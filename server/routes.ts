import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { whatsAppService } from "./services/whatsapp";
import { facebookService } from "./services/facebook";
import { schedulerService } from "./services/scheduler";
import { 
  insertUserSchema,
  insertCampaignSchema,
  insertTemplateSchema,
  insertContactSchema,
  insertMessageSchema,
  insertWebhookEventSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication middleware (simplified for MVP)
  const authenticateUser = (req: any, res: any, next: any) => {
    // For MVP, we'll use a simple user ID in headers
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ message: "User ID required" });
    }
    req.userId = parseInt(userId as string);
    next();
  };

  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.updateUser(parseInt(req.params.id), req.body);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  // Facebook integration routes
  app.post("/api/facebook/embedded-signup", authenticateUser, async (req, res) => {
    try {
      const { code, businessInfo } = req.body;
      const result = await facebookService.handleEmbeddedSignup(req.userId, code, businessInfo);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Facebook signup failed", error: error.message });
    }
  });

  app.get("/api/facebook/business-accounts", authenticateUser, async (req, res) => {
    try {
      const user = await storage.getUser(req.userId);
      if (!user?.whatsAppAccessToken) {
        return res.status(400).json({ message: "WhatsApp not connected" });
      }
      const accounts = await facebookService.getBusinessAccounts(user.whatsAppAccessToken);
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch business accounts", error: error.message });
    }
  });

  // WhatsApp routes
  app.post("/api/whatsapp/send-message", authenticateUser, async (req, res) => {
    try {
      const { to, templateId, variables } = req.body;
      const user = await storage.getUser(req.userId);
      if (!user?.whatsAppAccessToken || !user.whatsAppPhoneNumberId) {
        return res.status(400).json({ message: "WhatsApp not properly configured" });
      }

      const template = await storage.getTemplate(templateId);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      const result = await whatsAppService.sendTemplateMessage(
        user.whatsAppAccessToken,
        user.whatsAppPhoneNumberId,
        to,
        template,
        variables
      );

      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to send message", error: error.message });
    }
  });

  app.post("/api/whatsapp/webhook", async (req, res) => {
    try {
      const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || "default_verify_token";
      
      // Webhook verification
      if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === verifyToken) {
        return res.send(req.query['hub.challenge']);
      }

      // Process webhook events
      const events = await whatsAppService.processWebhookEvents(req.body);
      for (const event of events) {
        await storage.createWebhookEvent(event);
      }

      res.sendStatus(200);
    } catch (error) {
      console.error("Webhook processing error:", error);
      res.status(500).json({ message: "Webhook processing failed" });
    }
  });

  // Campaign routes
  app.get("/api/campaigns", authenticateUser, async (req, res) => {
    try {
      const campaigns = await storage.getCampaignsByUser(req.userId);
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaigns", error });
    }
  });

  app.post("/api/campaigns", authenticateUser, async (req, res) => {
    try {
      const campaignData = insertCampaignSchema.parse({ ...req.body, userId: req.userId });
      const campaign = await storage.createCampaign(campaignData);
      res.json(campaign);
    } catch (error) {
      res.status(400).json({ message: "Invalid campaign data", error });
    }
  });

  app.get("/api/campaigns/:id", authenticateUser, async (req, res) => {
    try {
      const campaign = await storage.getCampaign(parseInt(req.params.id));
      if (!campaign || campaign.userId !== req.userId) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.patch("/api/campaigns/:id", authenticateUser, async (req, res) => {
    try {
      const campaign = await storage.getCampaign(parseInt(req.params.id));
      if (!campaign || campaign.userId !== req.userId) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      const updated = await storage.updateCampaign(parseInt(req.params.id), req.body);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.post("/api/campaigns/:id/launch", authenticateUser, async (req, res) => {
    try {
      const campaign = await storage.getCampaign(parseInt(req.params.id));
      if (!campaign || campaign.userId !== req.userId) {
        return res.status(404).json({ message: "Campaign not found" });
      }

      await schedulerService.scheduleCampaign(campaign);
      await storage.updateCampaign(campaign.id, { status: "active" });
      
      res.json({ message: "Campaign launched successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to launch campaign", error: error.message });
    }
  });

  // Template routes
  app.get("/api/templates", authenticateUser, async (req, res) => {
    try {
      const templates = await storage.getTemplatesByUser(req.userId);
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch templates", error });
    }
  });

  app.post("/api/templates", authenticateUser, async (req, res) => {
    try {
      const templateData = insertTemplateSchema.parse({ ...req.body, userId: req.userId });
      const template = await storage.createTemplate(templateData);
      
      // Submit to WhatsApp for approval
      const user = await storage.getUser(req.userId);
      if (user?.whatsAppAccessToken && user.whatsAppBusinessId) {
        try {
          const whatsAppTemplate = await whatsAppService.createTemplate(
            user.whatsAppAccessToken,
            user.whatsAppBusinessId,
            template
          );
          
          await storage.updateTemplate(template.id, {
            whatsAppTemplateId: whatsAppTemplate.id,
            status: "pending"
          });
        } catch (whatsAppError) {
          console.error("WhatsApp template creation failed:", whatsAppError);
        }
      }
      
      res.json(template);
    } catch (error) {
      res.status(400).json({ message: "Invalid template data", error });
    }
  });

  app.get("/api/templates/:id", authenticateUser, async (req, res) => {
    try {
      const template = await storage.getTemplate(parseInt(req.params.id));
      if (!template || template.userId !== req.userId) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.patch("/api/templates/:id", authenticateUser, async (req, res) => {
    try {
      const template = await storage.getTemplate(parseInt(req.params.id));
      if (!template || template.userId !== req.userId) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      const updated = await storage.updateTemplate(parseInt(req.params.id), req.body);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  // Contact routes
  app.get("/api/contacts", authenticateUser, async (req, res) => {
    try {
      const contacts = await storage.getContactsByUser(req.userId);
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contacts", error });
    }
  });

  app.post("/api/contacts", authenticateUser, async (req, res) => {
    try {
      const contactData = insertContactSchema.parse({ ...req.body, userId: req.userId });
      const contact = await storage.createContact(contactData);
      res.json(contact);
    } catch (error) {
      res.status(400).json({ message: "Invalid contact data", error });
    }
  });

  app.post("/api/contacts/bulk", authenticateUser, async (req, res) => {
    try {
      const { contacts: contactsData } = req.body;
      const contacts = [];
      
      for (const contactData of contactsData) {
        const parsed = insertContactSchema.parse({ ...contactData, userId: req.userId });
        const contact = await storage.createContact(parsed);
        contacts.push(contact);
      }
      
      res.json(contacts);
    } catch (error) {
      res.status(400).json({ message: "Invalid contacts data", error });
    }
  });

  app.patch("/api/contacts/:id", authenticateUser, async (req, res) => {
    try {
      const contact = await storage.getContact(parseInt(req.params.id));
      if (!contact || contact.userId !== req.userId) {
        return res.status(404).json({ message: "Contact not found" });
      }
      
      const updated = await storage.updateContact(parseInt(req.params.id), req.body);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  // Analytics routes
  app.get("/api/analytics/dashboard", authenticateUser, async (req, res) => {
    try {
      const stats = await storage.getCampaignStats(req.userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics", error });
    }
  });

  app.get("/api/analytics/campaigns", authenticateUser, async (req, res) => {
    try {
      const campaigns = await storage.getCampaignsByUser(req.userId);
      const campaignStats = campaigns.map(campaign => ({
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        sentCount: campaign.sentCount || 0,
        deliveredCount: campaign.deliveredCount || 0,
        failedCount: campaign.failedCount || 0,
        responseCount: campaign.responseCount || 0,
        deliveryRate: campaign.sentCount ? (campaign.deliveredCount || 0) / campaign.sentCount * 100 : 0,
        responseRate: campaign.sentCount ? (campaign.responseCount || 0) / campaign.sentCount * 100 : 0,
      }));
      
      res.json(campaignStats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaign analytics", error });
    }
  });

  const httpServer = createServer(app);

  // Start background services
  schedulerService.start();

  return httpServer;
}
