import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Settings as SettingsIcon, 
  MessageSquare, 
  Key, 
  Bell, 
  Shield, 
  Trash2, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { SiFacebook } from "react-icons/si";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const webhookSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  verifyToken: z.string().min(8, "Verify token must be at least 8 characters"),
});

const profileSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  businessCategory: z.string().min(1, "Business category is required"),
});

type WebhookFormData = z.infer<typeof webhookSchema>;
type ProfileFormData = z.infer<typeof profileSchema>;

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("whatsapp");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user data
  const { data: user } = useQuery({
    queryKey: ["/api/users/1"], // Simplified for MVP
  });

  // WhatsApp connection test mutation
  const testConnectionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/whatsapp/test-connection");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "WhatsApp connection is working properly.",
      });
    },
    onError: (error) => {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to WhatsApp.",
        variant: "destructive",
      });
    },
  });

  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await apiRequest("PATCH", "/api/users/1", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Profile updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users/1"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    },
  });

  // Disconnect WhatsApp mutation
  const disconnectMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/whatsapp/disconnect");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Disconnected",
        description: "WhatsApp account has been disconnected.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users/1"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to disconnect WhatsApp.",
        variant: "destructive",
      });
    },
  });

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      businessName: user?.businessName || "",
      phoneNumber: user?.phoneNumber || "",
      businessCategory: user?.businessCategory || "",
    },
  });

  const webhookForm = useForm<WebhookFormData>({
    resolver: zodResolver(webhookSchema),
    defaultValues: {
      url: `https://${window.location.hostname}/api/whatsapp/webhook`,
      verifyToken: "secure_webhook_token_2024",
    },
  });

  const onProfileSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const onWebhookSubmit = (data: WebhookFormData) => {
    toast({
      title: "Webhook Configuration",
      description: "Webhook settings would be updated in a real implementation.",
    });
  };

  const handleDisconnect = () => {
    if (window.confirm("Are you sure you want to disconnect your WhatsApp account? This will stop all messaging services.")) {
      disconnectMutation.mutate();
    }
  };

  return (
    <div className="max-w-4xl">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="whatsapp" className="flex items-center space-x-2">
            <MessageSquare size={16} />
            <span>WhatsApp</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <SettingsIcon size={16} />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex items-center space-x-2">
            <Key size={16} />
            <span>Webhooks</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell size={16} />
            <span>Notifications</span>
          </TabsTrigger>
        </TabsList>

        {/* WhatsApp Settings */}
        <TabsContent value="whatsapp" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare size={20} />
                <span>WhatsApp Business Connection</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {user?.isWhatsAppConnected ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="text-green-600" size={20} />
                      <div>
                        <h4 className="font-medium text-green-900">Connected</h4>
                        <p className="text-sm text-green-700">Your WhatsApp Business account is active</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Business Phone Number</Label>
                      <p className="text-sm text-gray-900 mt-1">{user?.phoneNumber || "Not configured"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">WhatsApp Business ID</Label>
                      <p className="text-sm text-gray-900 mt-1">{user?.whatsAppBusinessId || "Not available"}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Connection Status</h4>
                      <p className="text-sm text-gray-600">Test your WhatsApp connection</p>
                    </div>
                    <Button
                      onClick={() => testConnectionMutation.mutate()}
                      disabled={testConnectionMutation.isPending}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <RefreshCw size={16} />
                      <span>{testConnectionMutation.isPending ? "Testing..." : "Test Connection"}</span>
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Disconnect Account</h4>
                      <p className="text-sm text-gray-600">Remove WhatsApp integration from your account</p>
                    </div>
                    <Button
                      onClick={handleDisconnect}
                      disabled={disconnectMutation.isPending}
                      variant="destructive"
                      className="flex items-center space-x-2"
                    >
                      <Trash2 size={16} />
                      <span>{disconnectMutation.isPending ? "Disconnecting..." : "Disconnect"}</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="text-yellow-600" size={20} />
                      <div>
                        <h4 className="font-medium text-yellow-900">Not Connected</h4>
                        <p className="text-sm text-yellow-700">Connect your WhatsApp Business account to start messaging</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Setup Required</Badge>
                  </div>

                  <div className="text-center py-8">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Connect WhatsApp Business</h3>
                    <p className="text-gray-500 mb-4">
                      Go to the Getting Started page to connect your WhatsApp Business account.
                    </p>
                    <Button asChild>
                      <a href="/dashboard/onboarding">
                        Connect WhatsApp
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Facebook Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <SiFacebook size={20} />
                <span>Facebook Business Integration</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Facebook App ID</h4>
                    <p className="text-sm text-gray-600">{user?.facebookAppId || "Not configured"}</p>
                  </div>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <ExternalLink size={16} />
                    <span>Open Facebook Business</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    {...profileForm.register("businessName")}
                    placeholder="Enter your business name"
                  />
                  {profileForm.formState.errors.businessName && (
                    <p className="text-sm text-red-600 mt-1">
                      {profileForm.formState.errors.businessName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    {...profileForm.register("phoneNumber")}
                    placeholder="+1 (555) 123-4567"
                  />
                  {profileForm.formState.errors.phoneNumber && (
                    <p className="text-sm text-red-600 mt-1">
                      {profileForm.formState.errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="businessCategory">Business Category</Label>
                  <Input
                    id="businessCategory"
                    {...profileForm.register("businessCategory")}
                    placeholder="e.g., E-commerce, Healthcare, Education"
                  />
                  {profileForm.formState.errors.businessCategory && (
                    <p className="text-sm text-red-600 mt-1">
                      {profileForm.formState.errors.businessCategory.message}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  disabled={updateProfileMutation.isPending}
                  className="w-full"
                >
                  {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webhook Settings */}
        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key size={20} />
                <span>Webhook Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={webhookForm.handleSubmit(onWebhookSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    {...webhookForm.register("url")}
                    placeholder="https://yourdomain.com/webhook"
                  />
                  {webhookForm.formState.errors.url && (
                    <p className="text-sm text-red-600 mt-1">
                      {webhookForm.formState.errors.url.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    This URL will receive WhatsApp webhook events
                  </p>
                </div>

                <div>
                  <Label htmlFor="verifyToken">Verify Token</Label>
                  <Input
                    id="verifyToken"
                    {...webhookForm.register("verifyToken")}
                    placeholder="Enter a secure verify token"
                  />
                  {webhookForm.formState.errors.verifyToken && (
                    <p className="text-sm text-red-600 mt-1">
                      {webhookForm.formState.errors.verifyToken.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Used to verify webhook requests from WhatsApp
                  </p>
                </div>

                <Button type="submit" className="w-full">
                  Update Webhook Settings
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Webhook Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Message Status Updates</h4>
                    <p className="text-sm text-gray-600">Receive delivery and read receipts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Incoming Messages</h4>
                    <p className="text-sm text-gray-600">Receive customer replies and messages</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Template Status</h4>
                    <p className="text-sm text-gray-600">Get notified about template approvals</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell size={20} />
                <span>Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Campaign Completion</h4>
                    <p className="text-sm text-gray-600">Get notified when campaigns finish</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Template Approval</h4>
                    <p className="text-sm text-gray-600">Notifications for template status changes</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Delivery Failures</h4>
                    <p className="text-sm text-gray-600">Alert when message delivery fails</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Weekly Reports</h4>
                    <p className="text-sm text-gray-600">Receive weekly performance summaries</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Add extra security to your account</p>
                  </div>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Shield size={16} />
                    <span>Configure</span>
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">API Access Logs</h4>
                    <p className="text-sm text-gray-600">Monitor API usage and access</p>
                  </div>
                  <Button variant="outline">View Logs</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
