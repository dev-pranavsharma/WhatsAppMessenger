import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-2">
        Your privacy is important to us. This privacy policy explains what data we collect, how we use it, and your rights.
      </p>
      <h2 className="text-xl font-semibold mt-4">Information We Collect</h2>
      <p className="mb-2">
        We may collect personal information such as your name, email, and phone number when you sign up or interact with our services.
      </p>
      <h2 className="text-xl font-semibold mt-4">How We Use Your Information</h2>
      <p className="mb-2">
        We use the data to provide and improve our services, including sending WhatsApp messages on your behalf through the WhatsApp Business API.
      </p>
      <h2 className="text-xl font-semibold mt-4">Your Rights</h2>
      <p className="mb-2">
        You can request access to your data, or ask us to delete or correct it at any time by contacting us.
      </p>
      <p className="mt-4 text-sm ">Last updated: June 28, 2025</p>
    </div>
  );
};

export default PrivacyPolicy;
