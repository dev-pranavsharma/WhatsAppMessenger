export interface FacebookConfig {
  appId: string;
  redirectUri: string;
  scope: string;
  state: string;
}

export interface FacebookAuthResponse {
  authResponse: {
    accessToken: string;
    code: string;
    expiresIn: number;
    userID: string;
  };
  status: string;
}

export interface BusinessAccount {
  id: string;
  name: string;
  verification_status: string;
  timezone_id: string;
}

export interface WhatsAppBusinessAccount {
  id: string;
  name: string;
  currency: string;
  timezone_id: string;
  message_template_namespace: string;
}

class FacebookBusinessAPI {
  private config: FacebookConfig;

  constructor() {
    this.config = {
      appId: import.meta.env.VITE_FACEBOOK_APP_ID || "default_app_id",
      redirectUri: `${window.location.origin}/api/facebook/callback`,
      scope: "whatsapp_business_management,whatsapp_business_messaging,business_management,pages_read_engagement",
      state: this.generateState(),
    };
  }

  /**
   * Generate a random state for OAuth security
   */
  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Get Facebook OAuth URL for embedded signup
   */
  getOAuthURL(): string {
    const params = new URLSearchParams({
      client_id: this.config.appId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scope,
      state: this.config.state,
      response_type: "code",
      auth_type: "rerequest",
    });

    return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
  }

  /**
   * Initialize Facebook SDK if available
   */
  async initializeSDK(): Promise<boolean> {
    return new Promise((resolve) => {
      // Check if Facebook SDK is already loaded
      if (typeof window !== "undefined" && (window as any).FB) {
        resolve(true);
        return;
      }

      // Load Facebook SDK
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";

      script.onload = () => {
        (window as any).FB.init({
          appId: this.config.appId,
          cookie: true,
          xfbml: true,
          version: "v18.0",
        });
        resolve(true);
      };

      script.onerror = () => {
        console.error("Failed to load Facebook SDK");
        resolve(false);
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Initiate Facebook login with embedded signup
   */
  async initiateLogin(): Promise<FacebookAuthResponse> {
    return new Promise(async (resolve, reject) => {
      const sdkLoaded = await this.initializeSDK();
      
      if (!sdkLoaded || !(window as any).FB) {
        // Fallback to redirect method
        window.location.href = this.getOAuthURL();
        return;
      }

      (window as any).FB.login(
        (response: FacebookAuthResponse) => {
          if (response.authResponse) {
            resolve(response);
          } else {
            reject(new Error("Facebook login failed or was cancelled"));
          }
        },
        {
          scope: this.config.scope,
          auth_type: "rerequest",
          enable_profile_selector: true,
          return_scopes: true,
        }
      );
    });
  }

  /**
   * Check Facebook login status
   */
  async getLoginStatus(): Promise<FacebookAuthResponse | null> {
    const sdkLoaded = await this.initializeSDK();
    
    if (!sdkLoaded || !(window as any).FB) {
      return null;
    }

    return new Promise((resolve) => {
      (window as any).FB.getLoginStatus((response: FacebookAuthResponse) => {
        if (response.status === "connected") {
          resolve(response);
        } else {
          resolve(null);
        }
      });
    });
  }

  /**
   * Logout from Facebook
   */
  async logout(): Promise<void> {
    const sdkLoaded = await this.initializeSDK();
    
    if (!sdkLoaded || !(window as any).FB) {
      return;
    }

    return new Promise((resolve) => {
      (window as any).FB.logout(() => {
        resolve();
      });
    });
  }

  /**
   * Validate business information before signup
   */
  validateBusinessInfo(businessInfo: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!businessInfo.name || businessInfo.name.trim().length < 2) {
      errors.push("Business name must be at least 2 characters");
    }

    if (!businessInfo.phone || !this.isValidPhoneNumber(businessInfo.phone)) {
      errors.push("Valid phone number is required");
    }

    if (!businessInfo.category || businessInfo.category.trim().length === 0) {
      errors.push("Business category is required");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate phone number format
   */
  private isValidPhoneNumber(phone: string): boolean {
    // Remove all non-numeric characters except +
    const cleaned = phone.replace(/[^\d+]/g, "");
    
    // Check if it's a valid international format
    return /^\+\d{10,15}$/.test(cleaned);
  }

  /**
   * Extract error message from Facebook API response
   */
  getErrorMessage(error: any): string {
    if (error.error?.message) {
      return error.error.message;
    }

    if (error.error?.error_description) {
      return error.error.error_description;
    }

    if (typeof error === "string") {
      return error;
    }

    return "Facebook integration error occurred";
  }

  /**
   * Generate embed signup configuration
   */
  getEmbedSignupConfig() {
    return {
      appId: this.config.appId,
      redirectUri: this.config.redirectUri,
      scope: this.config.scope,
      state: this.config.state,
      version: "v18.0",
    };
  }

  /**
   * Parse callback URL parameters
   */
  parseCallbackParams(url: string): { code?: string; state?: string; error?: string } {
    const urlParams = new URLSearchParams(new URL(url).search);
    
    return {
      code: urlParams.get("code") || undefined,
      state: urlParams.get("state") || undefined,
      error: urlParams.get("error") || undefined,
    };
  }

  /**
   * Verify state parameter for security
   */
  verifyState(receivedState: string): boolean {
    return receivedState === this.config.state;
  }

  /**
   * Format business account data for display
   */
  formatBusinessAccount(account: BusinessAccount): {
    id: string;
    name: string;
    status: string;
    statusColor: string;
  } {
    let statusColor = "gray";
    
    switch (account.verification_status) {
      case "verified":
        statusColor = "green";
        break;
      case "pending":
        statusColor = "yellow";
        break;
      case "unverified":
        statusColor = "red";
        break;
    }

    return {
      id: account.id,
      name: account.name,
      status: account.verification_status || "unknown",
      statusColor,
    };
  }

  /**
   * Get required permissions for WhatsApp Business
   */
  getRequiredPermissions(): string[] {
    return [
      "whatsapp_business_management",
      "whatsapp_business_messaging", 
      "business_management",
      "pages_read_engagement",
    ];
  }

  /**
   * Check if user has granted required permissions
   */
  hasRequiredPermissions(grantedPermissions: string[]): boolean {
    const required = this.getRequiredPermissions();
    return required.every(permission => grantedPermissions.includes(permission));
  }

  /**
   * Get missing permissions
   */
  getMissingPermissions(grantedPermissions: string[]): string[] {
    const required = this.getRequiredPermissions();
    return required.filter(permission => !grantedPermissions.includes(permission));
  }

  /**
   * Generate webhook callback URL
   */
  getWebhookURL(): string {
    const domains = import.meta.env.VITE_REPLIT_DOMAINS || window.location.hostname;
    const domain = domains.split(",")[0] || window.location.hostname;
    
    return `https://${domain}/api/whatsapp/webhook`;
  }

  /**
   * Generate secure verify token for webhooks
   */
  generateVerifyToken(): string {
    return `whatsapp_verify_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
}

export const facebookAPI = new FacebookBusinessAPI();
export default facebookAPI;
