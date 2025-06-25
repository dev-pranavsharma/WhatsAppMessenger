import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const campaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  description: z.string().optional(),
  templateId: z.string().min(1, "Template is required"),
  targetContacts: z.array(z.number()).min(1, "At least one contact must be selected"),
  scheduledAt: z.string().optional(),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

interface CampaignFormProps {
  onSuccess?: () => void;
}

const CampaignForm = ({ onSuccess }: CampaignFormProps) => {
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: "",
      description: "",
      templateId: "",
      targetContacts: [],
      scheduledAt: "",
    },
  });

  // Fetch templates
  const { data: templates = [] } = useQuery({
    queryKey: ["/api/templates"],
  });

  // Fetch contacts
  const { data: contacts = [] } = useQuery({
    queryKey: ["/api/contacts"],
  });

  const createCampaignMutation = useMutation({
    mutationFn: async (data: CampaignFormData) => {
      const response = await apiRequest("POST", "/api/campaigns", {
        ...data,
        templateId: parseInt(data.templateId),
        targetContacts: selectedContacts,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Campaign created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create campaign.",
        variant: "destructive",
      });
    },
  });

  const handleContactToggle = (contactId: number, checked: boolean) => {
    if (checked) {
      setSelectedContacts(prev => [...prev, contactId]);
    } else {
      setSelectedContacts(prev => prev.filter(id => id !== contactId));
    }
  };

  const onSubmit = (data: CampaignFormData) => {
    createCampaignMutation.mutate({
      ...data,
      targetContacts: selectedContacts,
    });
  };

  const approvedTemplates = templates.filter((template: any) => template.status === "approved");

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Campaign Details */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Campaign Name</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="Enter campaign name"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Describe your campaign"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="templateId">Message Template</Label>
              <Select onValueChange={(value) => form.setValue("templateId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {approvedTemplates.map((template: any) => (
                    <SelectItem key={template.id} value={template.id.toString()}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.templateId && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.templateId.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="scheduledAt">Schedule Send Time (Optional)</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                {...form.register("scheduledAt")}
              />
            </div>

            <Button
              type="submit"
              disabled={createCampaignMutation.isPending || selectedContacts.length === 0}
              className="w-full"
            >
              {createCampaignMutation.isPending ? "Creating..." : "Create Campaign"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Contact Selection */}
      <Card>
        <CardHeader>
          <CardTitle>
            Select Recipients ({selectedContacts.length} selected)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No contacts available</p>
              <p className="text-sm text-gray-400">
                Add contacts first to create campaigns
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {contacts.map((contact: any) => (
                <div key={contact.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                  <Checkbox
                    id={`contact-${contact.id}`}
                    checked={selectedContacts.includes(contact.id)}
                    onCheckedChange={(checked) => 
                      handleContactToggle(contact.id, checked as boolean)
                    }
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {contact.firstName} {contact.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {contact.phoneNumber}
                    </div>
                    {contact.tags && contact.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {contact.tags.map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {selectedContacts.length === 0 && contacts.length > 0 && (
            <p className="text-sm text-red-600 mt-2">
              Please select at least one contact for your campaign.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignForm;
