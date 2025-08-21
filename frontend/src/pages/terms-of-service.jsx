const TermsOfService = () => {
  return (
    <>
    <div className="flex justify-center items-center mt-10">
    <img className="logo-md" src="/assets/icons/logo.png"/>
    </div>
    <div className=" min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg p-8 border border-gray-200">
        <h1 className="text-4xl font-bold  mb-6">Terms of Service</h1>
        <p className=" leading-relaxed mb-6">
          By accessing or using Impretio’s services, platform, or any affiliated products (“Service”), you agree to comply with and be legally bound by these Terms of Service (“Terms”). If you do not agree, please do not use our services.
        </p>

        <h2 className="text-2xl font-semibold  mt-8 mb-2">1. Acceptance of Terms</h2>
        <p className=" mb-4">By using our services, you agree to these terms. Please read them carefully.</p>

        <h2 className="text-2xl font-semibold  mt-8 mb-2">2. Description of Service</h2>
        <p className=" mb-4">
          Impretio is a marketing management platform that allows users to manage campaigns, schedule posts, and send messages via integrated services like:
        </p>
        <ul className="list-disc list-inside  mb-4">
          <li>WhatsApp Business API (Meta)</li>
          <li>Instagram and Facebook Pages</li>
          <li>Review and analytics dashboards</li>
        </ul>

        <h2 className="text-2xl font-semibold  mt-8 mb-2">3. Eligibility</h2>
        <p className=" mb-4">
          You must be at least 18 years old to use our platform. By registering, you confirm that you are legally eligible to enter this agreement and use the services.
        </p>

        <h2 className="text-2xl font-semibold  mt-8 mb-2">4. Account Registration & Security</h2>
        <p className=" mb-4">
          You are responsible for providing accurate, current, and complete information when registering. You are solely responsible for maintaining the confidentiality of your account and credentials. Any unauthorized access or use must be reported immediately to Impretio.
        </p>

        <h2 className="text-2xl font-semibold  mt-8 mb-2">5. User Obligations</h2>
        <p className=" mb-2">By using Impretio, you agree to:</p>
        <ul className="list-disc list-inside  mb-4">
          <li>Use the service only for lawful purposes.</li>
          <li>Not send spam, abusive, or unauthorized marketing messages.</li>
          <li>Not interfere with the security or performance of the platform.</li>
          <li>Comply with Meta’s policies for WhatsApp, Instagram, and Facebook integrations.</li>
        </ul>

        <h2 className="text-2xl font-semibold  mt-8 mb-2">6. WhatsApp & Meta Integration</h2>
        <p className=" mb-4">
          Impretio uses the WhatsApp Business Cloud API and other Meta APIs. By using our service:
        </p>
        <ul className="list-disc list-inside  mb-4">
          <li>
            You agree to Meta’s{" "}
            <a href="https://www.whatsapp.com/legal/business-terms" className="text-primary underline" target="_blank" rel="noopener noreferrer">
              WhatsApp Business Terms
            </a>{" "}
            and{" "}
            <a href="https://developers.facebook.com/policy/" className="text-primary underline" target="_blank" rel="noopener noreferrer">
              Platform Policies
            </a>.
          </li>
          <li>Impretio is a technical service provider and not liable for any account actions taken by Meta.</li>
        </ul>

        <h2 className="text-2xl font-semibold  mt-8 mb-2">7. Fees and Payments</h2>
        <p className=" mb-4">
          Some features may require a paid subscription. All fees are listed in your billing section and are subject to change with prior notice. Non-payment may result in suspension or termination of access.
        </p>

        <h2 className="text-2xl font-semibold  mt-8 mb-2">8. Intellectual Property</h2>
        <p className=" mb-4">
          All content, trademarks, and software used in the service remain the property of Impretio or its licensors. Users may not copy, reverse engineer, or reuse parts of the platform without permission.
        </p>

        <h2 className="text-2xl font-semibold  mt-8 mb-2">9. Modifications</h2>
        <p className=" mb-4">
          We may change these terms at any time. Continued use after updates means you agree to the new terms. We will notify users of significant changes when applicable.
        </p>

        <h2 className="text-2xl font-semibold  mt-8 mb-2">10. Termination</h2>
        <p className=" mb-4">
          We may terminate or suspend your access immediately, without prior notice, if you violate these Terms, misuse the service, or for legal/security concerns.
        </p>

        <h2 className="text-2xl font-semibold  mt-8 mb-2">11. Disclaimers</h2>
        <p className=" mb-4">
          Impretio is provided “as is” and “as available.” We do not guarantee uninterrupted service or error-free performance. We are not liable for third-party service outages (e.g., Meta API downtime).
        </p>

        <h2 className="text-2xl font-semibold  mt-8 mb-2">12. Limitation of Liability</h2>
        <p className=" mb-2">
          To the maximum extent permitted by law, Impretio shall not be liable for:
        </p>
        <ul className="list-disc list-inside  mb-4">
          <li>Any indirect or consequential damages</li>
          <li>Any loss of data, revenue, or goodwill</li>
          <li>Any delays or errors resulting from third-party platforms like WhatsApp or Instagram</li>
        </ul>

        <h2 className="text-2xl font-semibold  mt-8 mb-2">13. Governing Law</h2>
        <p className=" mb-4">
          These Terms are governed by and construed in accordance with the laws of [Your Country/State]. Any disputes will be resolved in the appropriate courts of jurisdiction.
        </p>

        <h2 className="text-2xl font-semibold  mt-8 mb-2">14. Contact Information</h2>
        <p className=" mb-4">
          If you have any questions about these Terms, please contact us at:
          <br />
          📧{" "}
          <a href="mailto:support@impretio.com" className="text-primary underline">
            support@impretio.com
          </a>
        </p>

        <p className="text-sm  mt-12">Last updated: June 28, 2025</p>
      </div>
    </div>
    </>
  );
};

export default TermsOfService;
