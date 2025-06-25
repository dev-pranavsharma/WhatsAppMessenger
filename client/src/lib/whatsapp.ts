export interface WhatsAppMessage {
  to: string;
  type: "template" | "text";
  template?: {
    name: string;
    language: {
      code: string;
    };
    components?: Array<{
      type: string;
      parameters?: Array<{
        type: string;
        text: string;
      }>;
    }>;
  };
  text?: {
    body: string;
  };
}

export interface WhatsAppTemplate {
  name: string;
  category: "MARKETING" | "UTILITY" | "AUTHENTICATION";
  language: string;
  components: Array<{
    type: "HEADER" | "BODY" | "FOOTER" | "BUTTONS";
    format?: string;
    text?: string;
    buttons?: Array<{
      type: string;
      text: string;
      url?: string;
    }>;
  }>;
}

export interface MessageStatus {
  id: string;
  status: "sent" | "delivered" | "read" | "failed";
  timestamp: number;
  recipient_id: string;
  errors?: Array<{
    code: number;
    title: string;
    message: string;
  }>;
}

export interface WebhookEvent {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        statuses?: MessageStatus[];
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          type: string;
          text?: {
            body: string;
          };
          context?: {
            from: string;
            id: string;
          };
        }>;
      };
      field: string;
    }>;
  }>;
}

class WhatsAppAPI {
  private baseUrl = "https://graph.facebook.com/v18.0";

  /**
   * Format phone number to WhatsApp standard
   * Removes special characters and ensures proper formatting
   */
  formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-numeric characters except +
    let formatted = phoneNumber.replace(/[^\d+]/g, "");
    
    // Ensure it starts with +
    if (!formatted.startsWith("+")) {
      formatted = "+" + formatted;
    }
    
    return formatted;
  }

  /**
   * Validate phone number format
   */
  isValidPhoneNumber(phoneNumber: string): boolean {
    const formatted = this.formatPhoneNumber(phoneNumber);
    // Basic validation: starts with + and has 10-15 digits
    return /^\+\d{10,15}$/.test(formatted);
  }

  /**
   * Extract variables from template body text
   * Finds patterns like {{1}}, {{2}}, etc.
   */
  extractVariables(templateBody: string): string[] {
    const variables: string[] = [];
    const regex = /\{\{(\d+)\}\}/g;
    let match;
    
    while ((match = regex.exec(templateBody)) !== null) {
      const index = parseInt(match[1]) - 1;
      if (!variables[index]) {
        variables[index] = `variable_${index + 1}`;
      }
    }
    
    return variables.filter(Boolean);
  }

  /**
   * Replace variables in template with actual values
   */
  replaceVariables(
    templateBody: string, 
    variables: Record<string, string>
  ): string {
    let result = templateBody;
    
    Object.keys(variables).forEach((key, index) => {
      const placeholder = `{{${index + 1}}}`;
      result = result.replace(new RegExp(placeholder, "g"), variables[key]);
    });
    
    return result;
  }

  /**
   * Build WhatsApp message object for template messages
   */
  buildTemplateMessage(
    to: string,
    template: any,
    variables: Record<string, string> = {}
  ): WhatsAppMessage {
    const message: WhatsAppMessage = {
      to: this.formatPhoneNumber(to),
      type: "template",
      template: {
        name: template.whatsAppTemplateId || template.name.toLowerCase().replace(/\s+/g, "_"),
        language: {
          code: template.language || "en"
        },
        components: []
      }
    };

    // Add header component if exists
    if (template.headerContent) {
      message.template!.components!.push({
        type: "header",
        parameters: [{
          type: "text",
          text: template.headerContent
        }]
      });
    }

    // Add body component with variables
    if (template.variables && template.variables.length > 0) {
      const bodyParameters = template.variables.map((variable: string) => ({
        type: "text",
        text: variables[variable] || variable
      }));

      message.template!.components!.push({
        type: "body",
        parameters: bodyParameters
      });
    }

    return message;
  }

  /**
   * Build WhatsApp template object for creation
   */
  buildTemplate(template: any): WhatsAppTemplate {
    const components = [];

    // Add header
    if (template.headerContent) {
      components.push({
        type: "HEADER" as const,
        format: template.headerType || "TEXT",
        text: template.headerContent
      });
    }

    // Add body (required)
    components.push({
      type: "BODY" as const,
      text: template.bodyText
    });

    // Add footer
    if (template.footerText) {
      components.push({
        type: "FOOTER" as const,
        text: template.footerText
      });
    }

    // Add buttons
    if (template.buttons && template.buttons.length > 0) {
      components.push({
        type: "BUTTONS" as const,
        buttons: template.buttons.map((button: any) => ({
          type: button.type.toUpperCase(),
          text: button.text,
          url: button.url
        }))
      });
    }

    return {
      name: template.name.toLowerCase().replace(/\s+/g, "_"),
      category: template.category.toUpperCase() as "MARKETING" | "UTILITY" | "AUTHENTICATION",
      language: template.language || "en",
      components
    };
  }

  /**
   * Parse webhook events to extract useful information
   */
  parseWebhookEvent(body: any): {
    messageStatuses: MessageStatus[];
    incomingMessages: any[];
  } {
    const messageStatuses: MessageStatus[] = [];
    const incomingMessages: any[] = [];

    if (body.object === "whatsapp_business_account") {
      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          if (change.field === "messages") {
            const value = change.value;

            // Process message status updates
            if (value.statuses) {
              messageStatuses.push(...value.statuses);
            }

            // Process incoming messages
            if (value.messages) {
              incomingMessages.push(...value.messages);
            }
          }
        }
      }
    }

    return { messageStatuses, incomingMessages };
  }

  /**
   * Get error message from WhatsApp API error response
   */
  getErrorMessage(error: any): string {
    if (error.error?.message) {
      return error.error.message;
    }
    
    if (error.error?.error_data?.details) {
      return error.error.error_data.details;
    }
    
    return "Unknown WhatsApp API error";
  }

  /**
   * Check if template name is valid for WhatsApp
   */
  isValidTemplateName(name: string): boolean {
    // WhatsApp template names must be lowercase, no spaces, only letters, numbers, and underscores
    return /^[a-z0-9_]+$/.test(name);
  }

  /**
   * Generate valid template name from user input
   */
  generateTemplateName(input: string): string {
    return input
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "") // Remove special characters
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .substring(0, 50); // Limit length
  }

  /**
   * Validate template structure before submission
   */
  validateTemplate(template: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!template.name) {
      errors.push("Template name is required");
    } else if (!this.isValidTemplateName(this.generateTemplateName(template.name))) {
      errors.push("Template name contains invalid characters");
    }

    if (!template.bodyText) {
      errors.push("Template body text is required");
    }

    if (!["marketing", "utility", "authentication"].includes(template.category?.toLowerCase())) {
      errors.push("Invalid template category");
    }

    // Check for variable consistency
    const extractedVars = this.extractVariables(template.bodyText);
    if (template.variables && template.variables.length !== extractedVars.length) {
      errors.push("Variable count mismatch in template body");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Format message status for display
   */
  formatMessageStatus(status: string): { label: string; color: string } {
    switch (status) {
      case "sent":
        return { label: "Sent", color: "blue" };
      case "delivered":
        return { label: "Delivered", color: "green" };
      case "read":
        return { label: "Read", color: "purple" };
      case "failed":
        return { label: "Failed", color: "red" };
      default:
        return { label: "Unknown", color: "gray" };
    }
  }
}

export const whatsAppAPI = new WhatsAppAPI();
export default whatsAppAPI;
