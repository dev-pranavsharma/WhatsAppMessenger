import { useEffect } from 'react';

function FacebookLoginButton() {
  useEffect(() => {
    // FB should already be initialized if SDK is loaded via index.html
    if (window.FB) {
      window.FB.init({
        appId: '1049671833273088',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v23.0',
      });
    }
  }, []);

  const handleLogin = () => {
    if (!window.FB) return alert("Facebook SDK not loaded");

    window.FB.login(
      (response) => {
        if (response.authResponse) {
          console.log("User logged in", response);
          const accessToken = response.authResponse.accessToken
          const signupUrl = `https://www.facebook.com/dialog/whatsapp_business_es?app_id=1049671833273088&redirect_uri=https://whats-app-messenger-steel.vercel.app/facebook/callback&access_token=${accessToken}`;
            window.location.href = signupUrl;
          // Redirect or trigger embedded signup
        } else {
          console.warn("Login cancelled or not authorized");
        }
      },
      {
        scope: 'business_management,whatsapp_business_management',
      }
    );
  };

  return <button onClick={handleLogin}>Connect with Facebook</button>;
}

export default FacebookLoginButton;
