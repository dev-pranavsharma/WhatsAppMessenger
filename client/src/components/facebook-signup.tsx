import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SiFacebook } from "react-icons/si";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface FacebookSignupProps {
  businessInfo: {
    name: string;
    phone: string;
    category: string;
  };
}

const FacebookSignup = ({ businessInfo }: FacebookSignupProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const signupMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest("POST", "/api/facebook/embedded-signup", {
        code,
        businessInfo,
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success!",
        description: "WhatsApp Business account connected successfully.",
      });
      console.log("Facebook signup successful:", data);
    },
    onError: (error) => {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect WhatsApp Business account.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const initiateFacebookLogin = () => {
    setIsLoading(true);

    // Facebook SDK configuration
    const facebookConfig = {
      appId: import.meta.env.VITE_FACEBOOK_APP_ID || "default_app_id",
      redirectUri: `${window.location.origin}/api/facebook/callback`,
      scope: "whatsapp_business_management,whatsapp_business_messaging,business_management",
      state: Math.random().toString(36).substring(7),
    };

    // Check if business info is complete
    if (!businessInfo.name || !businessInfo.phone || !businessInfo.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all business details before connecting to Facebook.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Initialize Facebook SDK (in a real implementation)
    if (typeof window !== "undefined" && (window as any).FB) {
      (window as any).FB.login(
        (response: any) => {
          if (response.authResponse) {
            signupMutation.mutate(response.authResponse.code);
          } else {
            toast({
              title: "Login Cancelled",
              description: "Facebook login was cancelled.",
              variant: "destructive",
            });
            setIsLoading(false);
          }
        },
        {
          scope: facebookConfig.scope,
          auth_type: "rerequest",
        }
      );
    } else {
      // Fallback: Redirect to Facebook OAuth URL
      const oauthUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
        `client_id=${facebookConfig.appId}&` +
        `redirect_uri=${encodeURIComponent(facebookConfig.redirectUri)}&` +
        `scope=${encodeURIComponent(facebookConfig.scope)}&` +
        `state=${facebookConfig.state}&` +
        `response_type=code`;

      window.location.href = oauthUrl;
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={initiateFacebookLogin}
        disabled={isLoading || signupMutation.isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
      >
        <SiFacebook size={16} />
        <span>
          {isLoading || signupMutation.isPending 
            ? "Connecting..." 
            : "Continue with Facebook Business"
          }
        </span>
      </Button>
      <p className="text-xs text-gray-500 text-center">
        By continuing, you agree to Facebook's Terms and Privacy Policy
      </p>
    </div>
  );
};

export default FacebookSignup;
