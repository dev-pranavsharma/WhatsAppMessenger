import { useState } from "react";
import { useRoute } from "wouter";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import OnboardingPage from "./onboarding";
import CampaignsPage from "./campaigns";
import TemplatesPage from "./templates";
import ContactsPage from "./contacts";
import AnalyticsPage from "./analytics";
import SettingsPage from "./settings";

const Dashboard = () => {
  const [, params] = useRoute("/dashboard/:tab?");
  const activeTab = params?.tab || "onboarding";

  const tabConfig = {
    onboarding: {
      title: "WhatsApp Business Setup",
      subtitle: "Connect your WhatsApp Business account to start messaging campaigns",
      component: OnboardingPage,
    },
    campaigns: {
      title: "Campaign Management",
      subtitle: "Create and manage your WhatsApp marketing campaigns",
      component: CampaignsPage,
    },
    templates: {
      title: "Message Templates",
      subtitle: "Create and manage reusable message templates",
      component: TemplatesPage,
    },
    contacts: {
      title: "Contact Management",
      subtitle: "Organize and segment your contact lists",
      component: ContactsPage,
    },
    analytics: {
      title: "Analytics & Reports",
      subtitle: "Track campaign performance and engagement metrics",
      component: AnalyticsPage,
    },
    settings: {
      title: "Settings",
      subtitle: "Configure your WhatsApp integration and account settings",
      component: SettingsPage,
    },
  };

  const currentTab = tabConfig[activeTab as keyof typeof tabConfig] || tabConfig.onboarding;
  const CurrentComponent = currentTab.component;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar activeTab={activeTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={currentTab.title}
          subtitle={currentTab.subtitle}
          activeTab={activeTab}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <CurrentComponent />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
