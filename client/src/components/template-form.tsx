import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const templateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  category: z.string().min(1, "Category is required"),
  language: z.string().default("en"),
  headerContent: z.string().optional(),
  bodyText: z.string().min(1, "Body text is required"),
  footerText: z.string().optional(),
});

type TemplateFormData = z.infer<typeof templateSchema>;

interface TemplateFormProps {
  onSuccess?: () => void;
}

const TemplateForm = ({ onSuccess }: TemplateFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "",
      category: "",
      language: "en",
      headerContent: "",
      bodyText: "",
      footerText: "",
    },
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (data: TemplateFormData) => {
      // Extract variables from body text (e.g., {{1}}, {{2}})
      const variables = [];
      const variableRegex = /\{\{(\d+)\}\}/g;
      let match;
      while ((match = variableRegex.exec(data.bodyText)) !== null) {
        const variableIndex = parseInt(match[1]) - 1;
        if (!variables[variableIndex]) {
          variables[variableIndex] = `variable_${variableIndex + 1}`;
        }
      }

      const templateData = {
        ...data,
        variables: variables.filter(Boolean),
      };

      const response = await apiRequest("POST", "/api/templates", templateData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Template created and submitted for approval.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create template.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TemplateFormData) => {
    createTemplateMutation.mutate(data);
  };

  const categories = [
    { value: "marketing", label: "Marketing" },
    { value: "utility", label: "Utility" },
    { value: "authentication", label: "Authentication" },
  ];

  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "pt", label: "Portuguese" },
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Template Form */}
      <Card>
        <CardHeader>
          <CardTitle>Template Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="Enter template name"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => form.setValue("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.category.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="language">Language</Label>
                <Select 
                  defaultValue="en"
                  onValueChange={(value) => form.setValue("language", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language.value} value={language.value}>
                        {language.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="headerContent">Header (Optional)</Label>
              <Input
                id="headerContent"
                {...form.register("headerContent")}
                placeholder="Header text"
              />
            </div>

            <div>
              <Label htmlFor="bodyText">Message Body</Label>
              <Textarea
                id="bodyText"
                {...form.register("bodyText")}
                placeholder="Enter your message. Use {{1}}, {{2}} for variables."
                rows={4}
              />
              {form.formState.errors.bodyText && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.bodyText.message}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Use {`{{1}}, {{2}}, {{3}}`} etc. for variables that will be replaced with actual values.
              </p>
            </div>

            <div>
              <Label htmlFor="footerText">Footer (Optional)</Label>
              <Input
                id="footerText"
                {...form.register("footerText")}
                placeholder="Footer text"
              />
            </div>

            <Button
              type="submit"
              disabled={createTemplateMutation.isPending}
              className="w-full"
            >
              {createTemplateMutation.isPending ? "Creating..." : "Create Template"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Template Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            {form.watch("headerContent") && (
              <div className="font-medium text-gray-900">
                {form.watch("headerContent")}
              </div>
            )}
            
            <div className="text-gray-800">
              {form.watch("bodyText") || "Enter your message body to see preview..."}
            </div>
            
            {form.watch("footerText") && (
              <div className="text-sm text-gray-600 border-t pt-2">
                {form.watch("footerText")}
              </div>
            )}
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <h4 className="font-medium mb-2">Template Variables:</h4>
            <p>Variables like {`{{1}}, {{2}}`} will be replaced with actual values when sending messages.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplateForm;
