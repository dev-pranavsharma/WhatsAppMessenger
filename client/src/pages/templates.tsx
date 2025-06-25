import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Edit, Copy, CheckCircle, Clock, XCircle } from "lucide-react";
import TemplateForm from "@/components/template-form";

const TemplatesPage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["/api/templates"],
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="text-green-600" size={16} />;
      case "pending":
        return <Clock className="text-yellow-600" size={16} />;
      case "rejected":
        return <XCircle className="text-red-600" size={16} />;
      default:
        return <Clock className="text-gray-600" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (showCreateForm) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Create New Template</h3>
          <Button
            variant="outline"
            onClick={() => setShowCreateForm(false)}
          >
            Back to Templates
          </Button>
        </div>
        <TemplateForm onSuccess={() => setShowCreateForm(false)} />
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Template Library */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Message Templates</CardTitle>
              <Button onClick={() => setShowCreateForm(true)} className="flex items-center space-x-2">
                <Plus size={16} />
                <span>New Template</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading templates...</p>
              </div>
            ) : templates.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No templates yet</h3>
                <p className="text-gray-500 mb-4">Create your first message template to get started.</p>
                <Button onClick={() => setShowCreateForm(true)}>
                  Create Template
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {templates.map((template: any) => (
                  <div
                    key={template.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-gray-900">{template.name}</h4>
                          <Badge className={getStatusColor(template.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(template.status)}
                              <span>{template.status}</span>
                            </div>
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {template.bodyText}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Category: {template.category}</span>
                          <span>Language: {template.language}</span>
                        </div>
                        {template.variables && template.variables.length > 0 && (
                          <div className="mt-2">
                            <span className="text-sm text-gray-500">Variables: </span>
                            {template.variables.map((variable: string, index: number) => (
                              <span
                                key={index}
                                className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded mr-1"
                              >
                                {variable}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Copy size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Template Guidelines */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Create</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="w-full mb-4"
            >
              Create New Template
            </Button>
            <p className="text-sm text-gray-600">
              Create WhatsApp message templates that comply with Meta's policies.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Template Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start space-x-2">
                <CheckCircle className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
                <span>Use clear, concise language</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
                <span>Include relevant variables for personalization</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
                <span>Follow WhatsApp Business policies</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
                <span>Test templates before approval</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Template Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium text-gray-900">Marketing</h4>
                <p className="text-gray-600">Promotional messages and offers</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Utility</h4>
                <p className="text-gray-600">Account updates and notifications</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Authentication</h4>
                <p className="text-gray-600">OTP and verification codes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TemplatesPage;
