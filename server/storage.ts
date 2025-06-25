import {
  users,
  campaigns,
  templates,
  contacts,
  messages,
  webhookEvents,
  type User,
  type InsertUser,
  type Campaign,
  type InsertCampaign,
  type Template,
  type InsertTemplate,
  type Contact,
  type InsertContact,
  type Message,
  type InsertMessage,
  type WebhookEvent,
  type InsertWebhookEvent,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Campaigns
  getCampaignsByUser(userId: number): Promise<Campaign[]>;
  getCampaign(id: number): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: number, updates: Partial<Campaign>): Promise<Campaign | undefined>;
  deleteCampaign(id: number): Promise<boolean>;

  // Templates
  getTemplatesByUser(userId: number): Promise<Template[]>;
  getTemplate(id: number): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: number, updates: Partial<Template>): Promise<Template | undefined>;
  deleteTemplate(id: number): Promise<boolean>;

  // Contacts
  getContactsByUser(userId: number): Promise<Contact[]>;
  getContact(id: number): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: number, updates: Partial<Contact>): Promise<Contact | undefined>;
  deleteContact(id: number): Promise<boolean>;
  getContactsByIds(ids: number[]): Promise<Contact[]>;

  // Messages
  getMessagesByCampaign(campaignId: number): Promise<Message[]>;
  getMessagesByUser(userId: number): Promise<Message[]>;
  getMessage(id: number): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessage(id: number, updates: Partial<Message>): Promise<Message | undefined>;

  // Webhook Events
  createWebhookEvent(event: InsertWebhookEvent): Promise<WebhookEvent>;
  getUnprocessedWebhookEvents(): Promise<WebhookEvent[]>;
  markWebhookEventProcessed(id: number): Promise<boolean>;

  // Analytics
  getCampaignStats(userId: number): Promise<{
    activeCampaigns: number;
    totalMessagesSent: number;
    deliveryRate: number;
    responseRate: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private campaigns: Map<number, Campaign>;
  private templates: Map<number, Template>;
  private contacts: Map<number, Contact>;
  private messages: Map<number, Message>;
  private webhookEvents: Map<number, WebhookEvent>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.campaigns = new Map();
    this.templates = new Map();
    this.contacts = new Map();
    this.messages = new Map();
    this.webhookEvents = new Map();
    this.currentId = 1;
  }

  private getNextId(): number {
    return this.currentId++;
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.getNextId();
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
      isWhatsAppConnected: false,
      whatsAppBusinessId: null,
      whatsAppPhoneNumberId: null,
      whatsAppAccessToken: null,
      facebookAppId: null,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Campaigns
  async getCampaignsByUser(userId: number): Promise<Campaign[]> {
    return Array.from(this.campaigns.values()).filter(campaign => campaign.userId === userId);
  }

  async getCampaign(id: number): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const id = this.getNextId();
    const campaign: Campaign = {
      ...insertCampaign,
      id,
      sentCount: 0,
      deliveredCount: 0,
      failedCount: 0,
      responseCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.campaigns.set(id, campaign);
    return campaign;
  }

  async updateCampaign(id: number, updates: Partial<Campaign>): Promise<Campaign | undefined> {
    const campaign = this.campaigns.get(id);
    if (!campaign) return undefined;
    
    const updatedCampaign = { ...campaign, ...updates, updatedAt: new Date() };
    this.campaigns.set(id, updatedCampaign);
    return updatedCampaign;
  }

  async deleteCampaign(id: number): Promise<boolean> {
    return this.campaigns.delete(id);
  }

  // Templates
  async getTemplatesByUser(userId: number): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(template => template.userId === userId);
  }

  async getTemplate(id: number): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = this.getNextId();
    const template: Template = {
      ...insertTemplate,
      id,
      status: "pending",
      whatsAppTemplateId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.templates.set(id, template);
    return template;
  }

  async updateTemplate(id: number, updates: Partial<Template>): Promise<Template | undefined> {
    const template = this.templates.get(id);
    if (!template) return undefined;
    
    const updatedTemplate = { ...template, ...updates, updatedAt: new Date() };
    this.templates.set(id, updatedTemplate);
    return updatedTemplate;
  }

  async deleteTemplate(id: number): Promise<boolean> {
    return this.templates.delete(id);
  }

  // Contacts
  async getContactsByUser(userId: number): Promise<Contact[]> {
    return Array.from(this.contacts.values()).filter(contact => contact.userId === userId);
  }

  async getContact(id: number): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.getNextId();
    const contact: Contact = {
      ...insertContact,
      id,
      tags: insertContact.tags || [],
      customFields: insertContact.customFields || {},
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async updateContact(id: number, updates: Partial<Contact>): Promise<Contact | undefined> {
    const contact = this.contacts.get(id);
    if (!contact) return undefined;
    
    const updatedContact = { ...contact, ...updates, updatedAt: new Date() };
    this.contacts.set(id, updatedContact);
    return updatedContact;
  }

  async deleteContact(id: number): Promise<boolean> {
    return this.contacts.delete(id);
  }

  async getContactsByIds(ids: number[]): Promise<Contact[]> {
    return ids.map(id => this.contacts.get(id)).filter(Boolean) as Contact[];
  }

  // Messages
  async getMessagesByCampaign(campaignId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(message => message.campaignId === campaignId);
  }

  async getMessagesByUser(userId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(message => message.userId === userId);
  }

  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.getNextId();
    const message: Message = {
      ...insertMessage,
      id,
      whatsAppMessageId: null,
      sentAt: null,
      deliveredAt: null,
      readAt: null,
      failedReason: null,
      createdAt: new Date(),
    };
    this.messages.set(id, message);
    return message;
  }

  async updateMessage(id: number, updates: Partial<Message>): Promise<Message | undefined> {
    const message = this.messages.get(id);
    if (!message) return undefined;
    
    const updatedMessage = { ...message, ...updates };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }

  // Webhook Events
  async createWebhookEvent(insertEvent: InsertWebhookEvent): Promise<WebhookEvent> {
    const id = this.getNextId();
    const event: WebhookEvent = {
      ...insertEvent,
      id,
      processed: false,
      createdAt: new Date(),
    };
    this.webhookEvents.set(id, event);
    return event;
  }

  async getUnprocessedWebhookEvents(): Promise<WebhookEvent[]> {
    return Array.from(this.webhookEvents.values()).filter(event => !event.processed);
  }

  async markWebhookEventProcessed(id: number): Promise<boolean> {
    const event = this.webhookEvents.get(id);
    if (!event) return false;
    
    event.processed = true;
    this.webhookEvents.set(id, event);
    return true;
  }

  // Analytics
  async getCampaignStats(userId: number): Promise<{
    activeCampaigns: number;
    totalMessagesSent: number;
    deliveryRate: number;
    responseRate: number;
  }> {
    const userCampaigns = await this.getCampaignsByUser(userId);
    const activeCampaigns = userCampaigns.filter(c => c.status === 'active').length;
    
    const totalSent = userCampaigns.reduce((sum, c) => sum + (c.sentCount || 0), 0);
    const totalDelivered = userCampaigns.reduce((sum, c) => sum + (c.deliveredCount || 0), 0);
    const totalResponses = userCampaigns.reduce((sum, c) => sum + (c.responseCount || 0), 0);
    
    const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0;
    const responseRate = totalSent > 0 ? (totalResponses / totalSent) * 100 : 0;
    
    return {
      activeCampaigns,
      totalMessagesSent: totalSent,
      deliveryRate,
      responseRate,
    };
  }
}

export const storage = new MemStorage();
