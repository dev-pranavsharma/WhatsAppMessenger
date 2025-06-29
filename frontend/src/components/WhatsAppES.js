import React, { useEffect } from "react";

const WhatsAppSignupPopup = () => {
    const extras = {
  sessionInfoVersion: "3",
  version: "v3",
  prefill: {
    business_name: "Pranav's Cafe",
    business_email: "contact@pranavcafe.com",
    phone_number: "9876543210",
    phone_number_code: "+91",
    first_name: "Pranav",
    last_name: "Sharma",
    display_name: "Pranav Cafe",
    website_url: "https://pranavcafe.com",
  },
};
const encodedExtras = encodeURIComponent(JSON.stringify(extras));
const signupUrl = `https://business.facebook.com/messaging/whatsapp/onboard/?app_id=1049671833273088&config_id=1022527426322275&extras=${encodedExtras}`;

  // Listener for Meta's postMessage
  useEffect(() => {
    const handleMessage = (event) => {
      if (!event.origin.includes("facebook.com")) return;

      console.log("✅ Received Meta postMessage data:", event.data);

      // TODO: Send data to backend API if needed
      // fetch('/api/save-waba', { method: 'POST', body: JSON.stringify(event.data) });

      alert("✅ WhatsApp setup completed!");
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const openPopup = () => {

    window.open(signupUrl);
  };

  return (
    <div className="flex justify-center mt-8">
      <button
        onClick={openPopup}
        className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
      >
        Connect WhatsApp Business
      </button>
    </div>
  );
};

export default WhatsAppSignupPopup;
