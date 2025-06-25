interface WhatsAppTemplate {
  name: string;
  category: string;
  language: string;
  components: Array<{
    type: string;
    format?: string;
    text?: string;
    buttons?: Array<{
      type: string;
      text: string;
      url?: string;
    }>;
  }>;
}

interface MessageResponse {
  messageId: string;
  status: string;
}

class WhatsAppService {
  private baseUrl = "https://graph.facebook.com/v18.0";

  async sendTemplateMessage(
    accessToken: string,
    phoneNumberId: string,
    to: string,
    template: any,
    variables: Record<string, string> = {}
  ): Promise<MessageResponse> {
    try {
      // Replace variables in template body
      let messageText = template.bodyText;
      template.variables?.forEach((variable: string, index: number) => {
        if (variables[variable]) {
          messageText = messageText.replace(`{{${index + 1}}}`, variables[variable]);
        }
      });

      const messageData = {
        messaging_product: "whatsapp",
        to: to,
        type: "template",
        template: {
          name: template.whatsAppTemplateId || template.name.toLowerCase().replace(/\s+/g, '_'),
          language: {
            code: template.language || "en"
          },
          components: []
        }
      };

      // Add header if exists
      if (template.headerContent) {
        messageData.template.components.push({
          type: "header",
          parameters: [{
            type: "text",
            text: template.headerContent
          }]
        });
      }

      // Add body with variables
      if (template.variables && template.variables.length > 0) {
        const bodyParameters = template.variables.map((variable: string) => ({
          type: "text",
          text: variables[variable] || variable
        }));

        messageData.template.components.push({
          type: "body",
          parameters: bodyParameters
        });
      }

      // Add buttons if exists
      if (template.buttons && template.buttons.length > 0) {
        messageData.template.components.push({
          type: "button",
          sub_type: "quick_reply",
          index: "0",
          parameters: template.buttons.map((button: any) => ({
            type: "payload",
            payload: button.text
          }))
        });
      }

      const response = await fetch(`${this.baseUrl}/${phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`WhatsApp API error: ${error.error?.message || response.statusText}`);
      }

      const result = await response.json();
      return {
        messageId: result.messages[0].id,
        status: 'sent'
      };
    } catch (error) {
      console.error('WhatsApp send message error:', error);
      throw error;
    }
  }

  async createTemplate(
    accessToken: string,
    businessAccountId: string,
    template: any
  ): Promise<{ id: string; status: string }> {
    try {
      const components = [];

      // Add header component
      if (template.headerContent) {
        components.push({
          type: "HEADER",
          format: template.headerType || "TEXT",
          text: template.headerContent
        });
      }

      // Add body component
      components.push({
        type: "BODY",
        text: template.bodyText
      });

      // Add footer component
      if (template.footerText) {
        components.push({
          type: "FOOTER",
          text: template.footerText
        });
      }

      // Add buttons component
      if (template.buttons && template.buttons.length > 0) {
        components.push({
          type: "BUTTONS",
          buttons: template.buttons.map((button: any) => ({
            type: button.type.toUpperCase(),
            text: button.text,
            url: button.url
          }))
        });
      }

      const templateData = {
        name: template.name.toLowerCase().replace(/\s+/g, '_'),
        category: template.category.toUpperCase(),
        language: template.language || "en",
        components: components
      };

      const response = await fetch(`${this.baseUrl}/${businessAccountId}/message_templates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`WhatsApp template creation failed: ${error.error?.message || response.statusText}`);
      }

      const result = await response.json();
      return {
        id: result.id,
        status: result.status || 'pending'
      };
    } catch (error) {
      console.error('WhatsApp create template error:', error);
      throw error;
    }
  }

  async getTemplateStatus(accessToken: string, templateId: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/${templateId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get template status: ${response.statusText}`);
      }

      const result = await response.json();
      return result.status;
    } catch (error) {
      console.error('WhatsApp get template status error:', error);
      throw error;
    }
  }

  async processWebhookEvents(webhookBody: any): Promise<any[]> {
    const events = [];

    try {
      if (webhookBody.object === 'whatsapp_business_account') {
        for (const entry of webhookBody.entry || []) {
          for (const change of entry.changes || []) {
            if (change.field === 'messages') {
              const value = change.value;

              // Process message status updates
              if (value.statuses) {
                for (const status of value.statuses) {
                  events.push({
                    userId: 0, // Will be determined by message lookup
                    messageId: status.id,
                    eventType: 'message_status',
                    payload: {
                      status: status.status,
                      timestamp: status.timestamp,
                      recipientId: status.recipient_id,
                      errors: status.errors || []
                    }
                  });
                }
              }

              // Process incoming messages
              if (value.messages) {
                for (const message of value.messages) {
                  events.push({
                    userId: 0, // Will be determined by phone number lookup
                    messageId: message.id,
                    eventType: 'message_received',
                    payload: {
                      from: message.from,
                      timestamp: message.timestamp,
                      type: message.type,
                      text: message.text?.body,
                      context: message.context
                    }
                  });
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error processing webhook events:', error);
    }

    return events;
  }

  async getBusinessPhoneNumbers(accessToken: string, businessAccountId: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/${businessAccountId}/phone_numbers`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get phone numbers: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('WhatsApp get phone numbers error:', error);
      throw error;
    }
  }
}

export const whatsAppService = new WhatsAppService();
