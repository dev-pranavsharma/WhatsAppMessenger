import React, { useEffect } from "react";

const WhatsAppSignupPopup = () => {
  const signupUrl = `https://business.facebook.com/messaging/whatsapp/onboard/?app_id=1049671833273088&config_id=1022527426322275&extras=${encodeURIComponent(
    JSON.stringify({
      sessionInfoVersion: "3",
      version: "v3",
    })
  )}`;

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
    const width = 960;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    window.open(
      signupUrl,
      "whatsapp_signup_popup",
      `toolbar=no, location=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=${width}, height=${height}, top=${top}, left=${left}`
    );
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
