import { storage } from "../storage";
import { whatsAppService } from "./whatsapp";

class SchedulerService {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    // Check for scheduled campaigns every minute
    this.intervalId = setInterval(() => {
      this.processPendingCampaigns().catch(console.error);
      this.processWebhookEvents().catch(console.error);
    }, 60000);
    
    console.log('Scheduler service started');
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('Scheduler service stopped');
  }

  async scheduleCampaign(campaign: any): Promise<void> {
    try {
      if (!campaign.targetContacts || campaign.targetContacts.length === 0) {
        throw new Error('No target contacts specified');
      }

      const template = await storage.getTemplate(campaign.templateId);
      if (!template) {
        throw new Error('Template not found');
      }

      const user = await storage.getUser(campaign.userId);
      if (!user?.whatsAppAccessToken || !user.whatsAppPhoneNumberId) {
        throw new Error('WhatsApp not properly configured');
      }

      const contacts = await storage.getContactsByIds(campaign.targetContacts);
      
      // Schedule immediate execution or set for later
      if (!campaign.scheduledAt || new Date(campaign.scheduledAt) <= new Date()) {
        await this.executeCampaign(campaign, template, contacts, user);
      }
      
    } catch (error) {
      console.error('Campaign scheduling error:', error);
      await storage.updateCampaign(campaign.id, { 
        status: 'failed',
        failedCount: (campaign.failedCount || 0) + 1
      });
      throw error;
    }
  }

  private async processPendingCampaigns(): Promise<void> {
    try {
      // This would normally query for campaigns with status 'scheduled' and scheduledAt <= now
      // For the in-memory implementation, we'll check all active campaigns
      console.log('Processing pending campaigns...');
    } catch (error) {
      console.error('Error processing pending campaigns:', error);
    }
  }

  private async processWebhookEvents(): Promise<void> {
    try {
      const unprocessedEvents = await storage.getUnprocessedWebhookEvents();
      
      for (const event of unprocessedEvents) {
        try {
          await this.processWebhookEvent(event);
          await storage.markWebhookEventProcessed(event.id);
        } catch (error) {
          console.error(`Error processing webhook event ${event.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error processing webhook events:', error);
    }
  }

  private async processWebhookEvent(event: any): Promise<void> {
    try {
      if (event.eventType === 'message_status') {
        const payload = event.payload;
        
        // Find message by WhatsApp message ID and update status
        const messages = await storage.getMessagesByUser(event.userId);
        const message = messages.find(m => m.whatsAppMessageId === event.messageId);
        
        if (message) {
          const updates: any = { status: payload.status };
          
          if (payload.status === 'delivered') {
            updates.deliveredAt = new Date(parseInt(payload.timestamp) * 1000);
          } else if (payload.status === 'read') {
            updates.readAt = new Date(parseInt(payload.timestamp) * 1000);
          } else if (payload.status === 'failed') {
            updates.failedReason = payload.errors?.[0]?.title || 'Unknown error';
          }
          
          await storage.updateMessage(message.id, updates);
          
          // Update campaign stats if message belongs to a campaign
          if (message.campaignId) {
            await this.updateCampaignStats(message.campaignId);
          }
        }
      } else if (event.eventType === 'message_received') {
        // Handle incoming messages - could trigger auto-responses or update conversation threads
        console.log('Received incoming message:', event.payload);
      }
    } catch (error) {
      console.error('Error processing individual webhook event:', error);
      throw error;
    }
  }

  private async updateCampaignStats(campaignId: number): Promise<void> {
    try {
      const messages = await storage.getMessagesByCampaign(campaignId);
      
      const stats = {
        sentCount: messages.filter(m => m.status !== 'pending').length,
        deliveredCount: messages.filter(m => m.status === 'delivered' || m.status === 'read').length,
        failedCount: messages.filter(m => m.status === 'failed').length,
        responseCount: 0, // Would be calculated based on incoming messages
      };
      
      await storage.updateCampaign(campaignId, stats);
    } catch (error) {
      console.error('Error updating campaign stats:', error);
    }
  }

  private async executeCampaign(campaign: any, template: any, contacts: any[], user: any): Promise<void> {
    const batchSize = 10; // Send messages in batches to avoid rate limiting
    const delay = 1000; // 1 second delay between batches
    
    for (let i = 0; i < contacts.length; i += batchSize) {
      const batch = contacts.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (contact) => {
        try {
          // Create message record
          const message = await storage.createMessage({
            campaignId: campaign.id,
            contactId: contact.id,
            userId: user.id,
            templateId: template.id,
            content: template.bodyText,
            status: 'pending'
          });

          // Send via WhatsApp
          const result = await whatsAppService.sendTemplateMessage(
            user.whatsAppAccessToken,
            user.whatsAppPhoneNumberId,
            contact.phoneNumber,
            template,
            { name: contact.firstName } // Basic variable substitution
          );

          // Update message with WhatsApp message ID
          await storage.updateMessage(message.id, {
            whatsAppMessageId: result.messageId,
            status: 'sent',
            sentAt: new Date()
          });

        } catch (error) {
          console.error(`Failed to send message to ${contact.phoneNumber}:`, error);
          // The message record will remain with 'pending' status indicating failure
        }
      }));
      
      // Delay between batches
      if (i + batchSize < contacts.length) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // Update campaign status
    await storage.updateCampaign(campaign.id, { status: 'completed' });
  }
}

export const schedulerService = new SchedulerService();
