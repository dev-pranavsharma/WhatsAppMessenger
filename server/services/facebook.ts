class FacebookService {
  private baseUrl = "https://graph.facebook.com/v18.0";
  private appId = process.env.FACEBOOK_APP_ID || process.env.FACEBOOK_APP_ID_ENV_VAR || "default_app_id";
  private appSecret = process.env.FACEBOOK_APP_SECRET || process.env.FACEBOOK_APP_SECRET_ENV_VAR || "default_app_secret";

  async handleEmbeddedSignup(userId: number, code: string, businessInfo: any): Promise<any> {
    try {
      // Exchange code for access token
      const tokenResponse = await this.exchangeCodeForToken(code);
      
      // Get business accounts
      const businessAccounts = await this.getBusinessAccounts(tokenResponse.access_token);
      
      // Update user with Facebook/WhatsApp credentials
      const { storage } = await import("../storage");
      await storage.updateUser(userId, {
        ...businessInfo,
        isWhatsAppConnected: true,
        whatsAppAccessToken: tokenResponse.access_token,
        facebookAppId: this.appId,
      });

      return {
        success: true,
        accessToken: tokenResponse.access_token,
        businessAccounts: businessAccounts
      };
    } catch (error) {
      console.error('Facebook embedded signup error:', error);
      throw new Error(`Embedded signup failed: ${error.message}`);
    }
  }

  async exchangeCodeForToken(code: string): Promise<{ access_token: string; token_type: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/oauth/access_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.appId,
          client_secret: this.appSecret,
          code: code,
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Token exchange failed: ${error.error?.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Facebook token exchange error:', error);
      throw error;
    }
  }

  async getBusinessAccounts(accessToken: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/me/businesses`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to get business accounts: ${error.error?.message || response.statusText}`);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Facebook get business accounts error:', error);
      throw error;
    }
  }

  async getWhatsAppBusinessAccounts(accessToken: string, businessId: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/${businessId}/client_whatsapp_business_accounts`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to get WhatsApp business accounts: ${error.error?.message || response.statusText}`);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Facebook get WhatsApp business accounts error:', error);
      throw error;
    }
  }

  async subscribeToWebhooks(accessToken: string, whatsAppBusinessId: string): Promise<boolean> {
    try {
      const webhookUrl = process.env.WEBHOOK_URL || `${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}/api/whatsapp/webhook`;
      
      const response = await fetch(`${this.baseUrl}/${whatsAppBusinessId}/subscribed_apps`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscribed_fields: ['messages']
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Webhook subscription failed: ${error.error?.message || response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Facebook webhook subscription error:', error);
      throw error;
    }
  }

  generateEmbeddedSignupConfig() {
    const redirectUri = process.env.FACEBOOK_REDIRECT_URI || 
                       `https://${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}/api/facebook/callback`;
    
    return {
      appId: this.appId,
      redirectUri: redirectUri,
      scope: 'whatsapp_business_management,whatsapp_business_messaging,business_management',
      state: Math.random().toString(36).substring(7), // Random state for security
    };
  }
}

export const facebookService = new FacebookService();
