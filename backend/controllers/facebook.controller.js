import axios from 'axios';

// async function FBCallback(req, res){
//   console.log(req.query)
//   console.log(req.body);

//   const { code } = req.query;
//   const redirectUri = 'https://yourdomain.com/api/facebook/callback';

//   try {
//     const tokenRes = await axios.get(`https://graph.facebook.com/v17.0/oauth/access_token`, {
//       params: {
//         client_id: process.env.FB_APP_ID,
//         client_secret: process.env.FB_APP_SECRET,
//         redirect_uri: redirectUri,
//         code,
//       },
//     });

//     const accessToken = tokenRes.data.access_token;

//     // Fetch business info
//     const businessRes = await axios.get(`https://graph.facebook.com/v17.0/me?fields=id,name&access_token=${accessToken}`);

//     // Fetch WhatsApp details
//     const wabaRes = await axios.get(`https://graph.facebook.com/v17.0/me/whatsapp_business_accounts?access_token=${accessToken}`);
//     const wabaId = wabaRes.data.data[0].id;

//     // Store all of this in your database under this client
//     console.log({ accessToken, businessId: businessRes.data.id, wabaId });

//     res.send('WhatsApp account connected successfully.');
//   } catch (err) {
//     console.error('Error exchanging token:', err.response?.data || err.message);
//     res.status(500).send('Error during WhatsApp onboarding');
//   }
// }

// export {FBCallback}

// backend/index.js or routes/facebook.js


const APP_ID = process.env.FACEBOOK_APP_ID;
const APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const REDIRECT_URI = "http://localhost:8080/api/facebook/callback";

// 1. Receive redirect with ?code
export async function FBCallback(req, res) {
  console.log(req);
  
  const code = req.query.code;
  console.log(code);
  

  if (!code) return res.status(400).send("Missing code");

  try {
    // 2. Exchange code for token
    const tokenRes = await axios.get(
      `https://graph.facebook.com/v18.0/oauth/access_token`,
      {
        params: {
          client_id: APP_ID,
          client_secret: APP_SECRET,
          redirect_uri: REDIRECT_URI,
          code: code,
        },
      }
    );

    const { access_token } = tokenRes.data;

    // 3. Get WABA accounts
    const wabaRes = await axios.get(
      `https://graph.facebook.com/v18.0/${APP_ID}/whatsapp_business_accounts`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const wabaId = wabaRes.data.data[0]?.id;

    // 4. Get phone numbers linked to WABA
    const phoneRes = await axios.get(
      `https://graph.facebook.com/v18.0/${wabaId}/phone_numbers`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    console.log('response from phone', phoneRes.data.data);
    const phone = phoneRes.data.data[0];
    console.log('phone',phone);

    // 5. Save to DB (pseudo-code)
    // await saveClientWhatsAppData({
    //   wabaId,
    //   phoneNumberId: phone.id,
    //   displayPhoneNumber: phone.display_phone_number,
    //   verifiedName: phone.verified_name,
    //   token: access_token,
    // });

    // // 6. Redirect or send UI response
    // res.redirect("http://localhost:3000/settings?status=connected");
  } catch (err) {
    console.error(err?.response?.data || err);
    res.status(500).send("Error onboarding");
  }
};

