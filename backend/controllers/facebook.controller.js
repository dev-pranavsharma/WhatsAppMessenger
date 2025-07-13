import pool from '@/config/database';
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


const REDIRECT_URI = "https://whatsappmessenger-server.onrender.com/api/facebook/exchange";


export async function FBCodeExchange(req, res) {
    const {
    code,
    business_name,
    business_email,
    phone_number,
    phone_number_code,
    first_name,
    last_name,
    display_name,
    website_url,
    country,
    state,
    business_category,
    timezone
  } = req.body;
  try {
    const tokenResponse = await axios({
      method: 'post',
      url: 'https://graph.facebook.com/v23.0/oauth/access_token',
      params: {
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        code: code,
        redirect_uri: REDIRECT_URI
      }
    });
    const { access_token, expires_in } = tokenResponse.data;
    console.log('Access token from exchange-code:', access_token);

    const accountResponse = await axios({
      method: 'get',
      url: 'https://graph.facebook.com/v23.0/me/businesses',
      headers: { Authorization: `Bearer ${access_token}` }
    });
    const businessId = accountResponse.data.data[0]?.id;
    let phone_number_id, waba_id;
    if (businessId) {
      const wabaResponse = await axios({
        method: 'get',
        url: `https://graph.facebook.com/v23.0/${businessId}/whatsapp_business_accounts`,
        headers: { Authorization: `Bearer ${access_token}` }
      });
      ({ phone_number_id, id: waba_id } = wabaResponse.data.data[0] || {});
    }

    if (phone_number_id && waba_id) {
      clients.push({ phone_number_id, waba_id, access_token, expires_in, timestamp: new Date() });
      console.log('Saved client:', { phone_number_id, waba_id });

  try {
    const [result] = await pool.query(
      ` INSERT INTO tenants ( business_name, business_email, phone_number, phone_number_code, first_name, last_name, display_name, website_url, country, state, business_category, timezone, waba_id, phone_number_id, access_token, token_expires_in ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) `, 
      [ business_name, business_email, phone_number, phone_number_code, first_name, last_name, display_name, website_url, country, state, business_category, timezone, waba_id, phone_number_id, access_token, expires_in ]
    );
    console.log(`✅ New tenant inserted with ID: ${result.insertId}`);
  } catch (err) {
    console.error('❌ Error inserting new tenant into DB:', err);
  }
    }

    res.json({ access_token, phone_number_id, waba_id });
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
};





