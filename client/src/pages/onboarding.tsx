import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Check, Shield, Zap, MessageSquare } from "lucide-react";
import { SiFacebook } from "react-icons/si";
import FacebookSignup from "@/components/facebook-signup";

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [businessInfo, setBusinessInfo] = useState({
    name: "",
    phone: "",
    category: "",
  });

  const steps = [
    { id: 1, title: "WhatsApp Setup", active: currentStep >= 1 },
    { id: 2, title: "Business Verification", active: currentStep >= 2 },
    { id: 3, title: "Campaign Setup", active: currentStep >= 3 },
  ];

  const features = [
    {
      icon: Check,
      title: "Instant Setup",
      description: "Connect your WhatsApp Business account in just a few clicks",
    },
    {
      icon: Shield,
      title: "Secure Integration",
      description: "Your credentials are securely stored and encrypted",
    },
    {
      icon: Zap,
      title: "Real-time Messaging",
      description: "Send and receive messages instantly with live status updates",
    },
  ];

  const requirements = [
    "Valid WhatsApp Business account",
    "Facebook Business Manager access",
    "Verified business information",
  ];

  const businessCategories = [
    "E-commerce",
    "Healthcare",
    "Education",
    "Financial Services",
    "Travel & Hospitality",
    "Other",
  ];

  const handleBusinessInfoChange = (field: string, value: string) => {
    setBusinessInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center space-x-2">
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${step.active 
                        ? "bg-primary text-white" 
                        : "bg-gray-300 text-gray-600"
                      }
                    `}
                  >
                    {step.id}
                  </div>
                  <span
                    className={`
                      text-sm font-medium
                      ${step.active ? "text-gray-900" : "text-gray-600"}
                    `}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-12 h-0.5 bg-gray-300 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Setup Instructions */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-whatsapp/10 rounded-lg flex items-center justify-center">
                  <MessageSquare className="text-whatsapp text-xl" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">WhatsApp Business Account</h3>
                  <p className="text-sm text-gray-600">Connect your business account to start messaging</p>
                </div>
              </div>

              <div className="space-y-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                        <Icon className="text-primary text-xs" size={12} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h4 className="font-medium text-blue-900 mb-3">Requirements</h4>
              <ul className="space-y-2 text-sm text-blue-800">
                {requirements.map((requirement, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full" />
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Embedded Signup Form */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-whatsapp/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="text-whatsapp text-2xl" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect WhatsApp Business</h3>
              <p className="text-gray-600">Securely connect your WhatsApp Business account</p>
            </div>

            <div className="space-y-4">
              {/* Business Details Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="businessName" className="text-sm font-medium text-gray-700">
                    Business Name
                  </Label>
                  <Input
                    id="businessName"
                    type="text"
                    placeholder="Enter your business name"
                    value={businessInfo.name}
                    onChange={(e) => handleBusinessInfoChange("name", e.target.value)}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="businessPhone" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <Input
                    id="businessPhone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={businessInfo.phone}
                    onChange={(e) => handleBusinessInfoChange("phone", e.target.value)}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="businessCategory" className="text-sm font-medium text-gray-700">
                    Business Category
                  </Label>
                  <Select onValueChange={(value) => handleBusinessInfoChange("category", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {businessCategories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Facebook Login Integration */}
              <div className="pt-4 border-t border-gray-200">
                <FacebookSignup businessInfo={businessInfo} />
              </div>

              {/* Alternative Manual Setup */}
              <div className="pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => console.log("Manual setup clicked")}
                >
                  Manual API Setup
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingPage;
