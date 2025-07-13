import React, { useEffect, useState } from "react";

const WhatsAppSignupPopup = ({ prefill = {} }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [clientData, setClientData] = useState(null);
  const [error, setError] = useState('');

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

  const sendToBackend = async (data) => {
    try {
      const response = await fetch('https://whatsappmessenger-server.onrender.com/api/facebook/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Include all the data from Meta
          ...data,
          // Include all prefill data
          ...prefill
        })
      });

      const result = await response.json();

      if (response.ok) {
        console.log('✅ Backend response:', result);
      } else {
        throw new Error(result.error || 'Failed to save data');
      }
    } catch (error) {
      console.error('❌ Error sending to backend:', error);
      throw error;
    }
  };

  const launchSignup = () => {
    setIsLoading(true);
    setError('');

    // Create the extras object with prefill data
    const extras = {
      setup: {
        business: {
          name: prefill.business_name || '',
          email: prefill.business_email || '',
          website: prefill.website_url || '',
          address: {
            streetAddress1: prefill.addressline1 || '',
            streetAddress2: prefill.addressline2 || '',
            city: prefill.city || '',
            state: prefill.state || '',
            zipPostal: prefill.pincode || '',
            country: prefill.country || ''
          },
          phone: {
            code: prefill.phone_number_code || '',
            number: prefill.phone_number || ''
          },
          timezone: prefill.timezone || ''
        },
        phone: {
          displayName: prefill.display_name || '',
          category: prefill.business_category || '',
          description: prefill.business_description || ''
        }
      },
      featureType: 'whatsapp_business_messaging',
      sessionInfoVersion: '3',
    };

    console.log('🚀 Launching WhatsApp signup with extras:', extras);

    window.FB.login(
      async (response) => {
        console.log('📱 FB.login response:', response);

        if (response.authResponse) {
          const code = response.authResponse.code;

          try {
            // Send the code and prefill data to backend
            const backendResponse = await sendToBackend({
              code,
              ...prefill
            });

            setClientData(backendResponse.data);
            setIsLoading(false);

            alert("✅ WhatsApp Business Account connected successfully!");

          } catch (error) {
            console.error('❌ Backend error:', error);
            setError(error.message);
            setIsLoading(false);
          }
        } else {
          console.log('❌ User cancelled login or did not fully authorize.');
          setError('Login was cancelled or not authorized');
          setIsLoading(false);
        }
      },
      {
        config_id: '1022527426322275',
        response_type: 'code',
        override_default_response_type: true,
        extras: JSON.stringify(extras)
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

        // Log the raw response
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
          // Extract client data
          const extractedClientData = {
            wabaId: data.data?.waba_id || data.waba_id || data.business_id || data.data?.business_id,
            phoneNumberId: data.data?.phone_number_id || data.phone_number_id,
            businessVerificationStatus: data.data?.business_verification_status || data.verification_status,
            accessToken: data.data?.access_token || data.access_token,
            phoneNumber: data.data?.phone_number || data.phone_number,
            displayPhoneNumber: data.data?.display_phone_number || data.display_phone_number,
            businessId: data.data?.business_id || data.business_id,
            businessName: data.data?.business_name || data.business_name,
            accountReviewStatus: data.data?.account_review_status || data.account_review_status,
            appId: data.app_id || data.data?.app_id,
            configId: data.config_id || data.data?.config_id,
            fullResponse: data,
            timestamp: new Date().toISOString()
          };

          console.log("📊 Extracted Client Data:", extractedClientData);

          //   // Send to backend through postMessage data
          //   sendToBackend(extractedClientData)
          //     .then((result) => {
          //       setClientData(result.data);
          //       setIsLoading(false);
          //       alert("✅ WhatsApp setup completed successfully!");
          //     })
          //     .catch((error) => {
          //       console.error('❌ Error processing signup:', error);
          //       setError(error.message);
          //       setIsLoading(false);
          //     });

        } else {
          console.log("📝 Meta response received but not a success event:", data);

          if (data.error) {
            console.error("❌ Meta signup error:", data.error);
            setError(data.error.message || 'WhatsApp signup failed');
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error("❌ Error parsing Meta response:", error);
        setError('Error processing WhatsApp response');
        setIsLoading(false);
      }
    };

    // Listen for messages from the popup
    window.addEventListener("message", handleMessage);

    // Cleanup
    return () => window.removeEventListener("message", handleMessage);
  }, [onAccountCreated]);

  return (
    <div className="flex flex-col items-center mt-8 space-y-4">
      <button
        onClick={launchSignup}
        disabled={isLoading}
        className={`px-6 py-3 font-medium rounded-lg transition ${isLoading
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
            : 'btn btn-primary'
          }`}
      >
        {isLoading ? 'Setting up WhatsApp...' : 'Connect WhatsApp Business'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {clientData && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800">WhatsApp Connected Successfully!</h3>
          <div className="text-sm text-green-600 mt-2">
            <p>WABA ID: {clientData.waba_id}</p>
            <p>Phone Number ID: {clientData.phone_number_id}</p>
            <p>Tenant ID: {clientData.tenant_id}</p>
            <p>User ID: {clientData.user_id}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppSignupPopup;