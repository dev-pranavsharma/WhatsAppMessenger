import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required").optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  contact?: any;
  onSuccess?: () => void;
}

const ContactForm = ({ contact, onSuccess }: ContactFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!contact;

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: contact?.firstName || "",
      lastName: contact?.lastName || "",
      phoneNumber: contact?.phoneNumber || "",
      email: contact?.email || "",
      isActive: contact?.isActive ?? true,
    },
  });

  // Manage tags separately since they're not in the schema
  const [tags, setTags] = React.useState<string[]>(contact?.tags || []);
  const [newTag, setNewTag] = React.useState("");

  const createContactMutation = useMutation({
    mutationFn: async (data: ContactFormData & { tags: string[] }) => {
      const url = isEditing ? `/api/contacts/${contact.id}` : "/api/contacts";
      const method = isEditing ? "PATCH" : "POST";
      const response = await apiRequest(method, url, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: `Contact ${isEditing ? "updated" : "created"} successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || `Failed to ${isEditing ? "update" : "create"} contact.`,
        variant: "destructive",
      });
    },
  });

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const onSubmit = (data: ContactFormData) => {
    createContactMutation.mutate({ ...data, tags });
  };

  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? "Edit Contact" : "Add New Contact"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  {...form.register("firstName")}
                  placeholder="John"
                />
                {form.formState.errors.firstName && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...form.register("lastName")}
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  {...form.register("phoneNumber")}
                  placeholder="+1 (555) 123-4567"
                />
                {form.formState.errors.phoneNumber && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.phoneNumber.message}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Include country code (e.g., +1 for US)
                </p>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="john@example.com"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="tags">Tags</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Input
                    id="tags"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a tag (e.g., VIP, Customer, Lead)"
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    disabled={!newTag.trim()}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center space-x-1"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Tags help organize and segment your contacts
              </p>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isActive">Active Status</Label>
                <p className="text-sm text-gray-600">
                  Inactive contacts won't receive campaign messages
                </p>
              </div>
              <Switch
                id="isActive"
                checked={form.watch("isActive")}
                onCheckedChange={(checked) => form.setValue("isActive", checked)}
              />
            </div>

            {/* Form Actions */}
            <div className="flex space-x-4 pt-6">
              <Button
                type="submit"
                disabled={createContactMutation.isPending}
                className="flex-1"
              >
                {createContactMutation.isPending 
                  ? (isEditing ? "Updating..." : "Creating...") 
                  : (isEditing ? "Update Contact" : "Create Contact")
                }
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => onSuccess?.()}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Contact Preview */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Contact Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Name: </span>
              <span>{form.watch("firstName")} {form.watch("lastName")}</span>
            </div>
            <div>
              <span className="font-medium">Phone: </span>
              <span>{form.watch("phoneNumber") || "Not provided"}</span>
            </div>
            <div>
              <span className="font-medium">Email: </span>
              <span>{form.watch("email") || "Not provided"}</span>
            </div>
            <div>
              <span className="font-medium">Status: </span>
              <Badge 
                className={form.watch("isActive") 
                  ? "bg-green-100 text-green-800" 
                  : "bg-gray-100 text-gray-800"
                }
              >
                {form.watch("isActive") ? "Active" : "Inactive"}
              </Badge>
            </div>
            {tags.length > 0 && (
              <div>
                <span className="font-medium">Tags: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Add React import for useState
import React from "react";

export default ContactForm;
