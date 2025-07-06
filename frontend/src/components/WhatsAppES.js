import React, { useEffect } from "react";

const WhatsAppSignupPopup = ({prefill}) => {
    const extras =  {
      setup: {
        business: {
          name: prefill.business_name,
          email: prefill.business_email,
          website: prefill.website_url,
          address: {
            streetAddress1: prefill?.addressline1,
            streetAddress2: prefill?.addressline2,
            city: prefill?.city,
            state: prefill?.state,
            zipPostal: prefill?.pincode,
            country: prefill?.country
          },
          phone: {
            code: prefill.phone_number_code,
            number: prefill.phone_number
          },
          timezone: prefill.timezone
        },
        phone: {
          displayName: prefill.display_name,
          category: prefill?.business_category,
          description: prefill?.business_description
        }
      },
      featureType: '',
      sessionInfoVersion: '3',
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
