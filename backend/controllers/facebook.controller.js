import axios from 'axios';

async function FBCallback(req, res){
  const { code } = req.query;
  const redirectUri = 'https://yourdomain.com/api/facebook/callback';

  try {
    const tokenRes = await axios.get(`https://graph.facebook.com/v17.0/oauth/access_token`, {
      params: {
        client_id: process.env.FB_APP_ID,
        client_secret: process.env.FB_APP_SECRET,
        redirect_uri: redirectUri,
        code,
      },
    });

    const accessToken = tokenRes.data.access_token;

    // Fetch business info
    const businessRes = await axios.get(`https://graph.facebook.com/v17.0/me?fields=id,name&access_token=${accessToken}`);

    // Fetch WhatsApp details
    const wabaRes = await axios.get(`https://graph.facebook.com/v17.0/me/whatsapp_business_accounts?access_token=${accessToken}`);
    const wabaId = wabaRes.data.data[0].id;

    // Store all of this in your database under this client
    console.log({ accessToken, businessId: businessRes.data.id, wabaId });

    res.send('WhatsApp account connected successfully.');
  } catch (err) {
    console.error('Error exchanging token:', err.response?.data || err.message);
    res.status(500).send('Error during WhatsApp onboarding');
  }
}

export {FBCallback}