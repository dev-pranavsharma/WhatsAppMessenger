import React, { useEffect, useState } from "react";

const WhatsAppSignupPopup = ({ prefill = {}, onAccountCreated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [clientData, setClientData] = useState(null);

  const extras = {
    setup: {
      business: {
        name: prefill.business_name || '',
        email: prefill.business_email || '',
        website: prefill.website_url || '',
        address: {
          streetAddress1: prefill?.addressline1 || '',
          streetAddress2: prefill?.addressline2 || '',
          city: prefill?.city || '',
          state: prefill?.state || '',
          zipPostal: prefill?.pincode || '',
          country: prefill?.country || ''
        },
        phone: {
          code: prefill.phone_number_code || '',
          number: prefill.phone_number || ''
        },
        timezone: prefill.timezone || ''
      },
      phone: {
        displayName: prefill.display_name || '',
        category: prefill?.business_category || '',
        description: prefill?.business_description || ''
      }
    },
    featureType: '',
    sessionInfoVersion: '3',
  };

  console.log(extras);
  

  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '1049671833273088',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v23.0'
      });
    };

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }, []);

  const launchSignup = () => {
    window.FB.login(
      (response) => {
        if (response.authResponse) {
          const code = response.authResponse.code;
          fetch('https://whatsappmessenger-server.onrender.com/api/facebook/exchange', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, ...prefill })
          })
            .then(res => res.json())
            .then(data => console.log('Token:', data))
            .catch(err => console.error('Error:', err));
        }
      },
      {
        config_id: '1022527426322275',
        response_type: 'code',
        override_default_response_type: true,
        extras: extras
      }
    );
  };

  useEffect(() => {
    const handleMessage = (event) => {
      // Security check - accept messages from Facebook/Meta domains
      if (!event.origin.includes("facebook.com") && !event.origin.includes("meta.com")) {
        return;
      }

      console.log("✅ Received Meta postMessage data:", event.data);
      console.log("📋 Event origin:", event.origin);

      try {
        let data = event.data;

        // Handle both string and object responses
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch (e) {
            console.log("Data is string but not JSON:", data);
            return;
          }
        }

        // Log the raw response first to see the actual structure
        console.log("📋 Raw Meta response:", data);

        // Check for different types of success responses
        const isSuccess = (
          data.type === 'WA_EMBEDDED_SIGNUP' ||
          data.event === 'FINISH' ||
          data.status === 'success' ||
          data.type === 'EMBEDDED_SIGNUP' ||
          (data.data && (data.data.waba_id || data.data.phone_number_id))
        );

        if (isSuccess) {
          // Extract client data with multiple fallback options
          const extractedClientData = {
            // WhatsApp Business Account ID
            wabaId: data.data?.waba_id || data.waba_id || data.business_id || data.data?.business_id,

            // Phone number ID (for sending messages)
            phoneNumberId: data.data?.phone_number_id || data.phone_number_id,

            // Business verification status
            businessVerificationStatus: data.data?.business_verification_status || data.verification_status,

            // Access token (temporary - should be exchanged for permanent token)
            accessToken: data.data?.access_token || data.access_token,

            // Phone number details
            phoneNumber: data.data?.phone_number || data.phone_number,
            displayPhoneNumber: data.data?.display_phone_number || data.display_phone_number,

            // Business details
            businessId: data.data?.business_id || data.business_id,
            businessName: data.data?.business_name || data.business_name,

            // Account status
            accountReviewStatus: data.data?.account_review_status || data.account_review_status,

            // Additional fields that might be present
            appId: data.app_id || data.data?.app_id,
            configId: data.config_id || data.data?.config_id,

            // Full response for debugging
            fullResponse: data,
            timestamp: new Date().toISOString()
          };

          setClientData(extractedClientData);
          setIsLoading(false);
          // Store in state or send to your backend
          console.log("📊 Extracted Client Data:", extractedClientData);

          // Send to backend (currently just logs)
          sendToBackend(extractedClientData);

          alert("✅ WhatsApp setup completed! Check console for client data.");
        } else {
          console.log("📝 Meta response received but not a success event:", data);

          // Check if it's an error or other event type
          if (data.error) {
            console.error("❌ Meta signup error:", data.error);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error("Error parsing Meta response:", error);
      }
    };

    // Listen for messages from the popup
    window.addEventListener("message", handleMessage);

    // Cleanup
    return () => window.removeEventListener("message", handleMessage);
  }, [onAccountCreated]);
  return (
    <div className="flex flex-col items-center mt-8 space-y-4">
      <button onClick={launchSignup}
        disabled={isLoading}
        className={`px-6 py-3 font-medium rounded-lg transition ${isLoading
          ? '  cursor-not-allowed'
          : 'btn btn-primary'
          }`}
      >
        {isLoading ? 'Setting up WhatsApp...' : 'Connect WhatsApp Business'}
      </button>
    </div>
  );
};

export default WhatsAppSignupPopup;