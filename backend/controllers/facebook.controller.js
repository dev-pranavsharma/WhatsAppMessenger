import pool from '@/config/database';
import axios from 'axios';
import { registerUser } from './user.controller';



const REDIRECT_URI = "https://www.impretio.com/login";
const clients = [];

export async function FBCodeExchange(req, res) {
  
    const {
    business_id,
    waba_id,
    phone_number_id,
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
  console.log('client details', business_id, waba_id, phone_number_id, code)
  try {
    const tokenResponse = await axios({
      method: 'post',
      url: 'https://graph.facebook.com/v23.0/oauth/access_token',
      params: {
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        code: code,
        redirect_uri: ''
      }
    });
    const { access_token, expires_in } = tokenResponse.data;
    console.log('Access token from exchange-code:', access_token);

    // const accountResponse = await axios({
    //   method: 'get',
    //   url: 'https://graph.facebook.com/v23.0/me/businesses',
    //   headers: { Authorization: `Bearer ${access_token}` }
    // });
    // const businessId = accountResponse.data.data[0]?.id;
    // let phone_number_id, waba_id;
    // if (businessId) {
    //   const wabaResponse = await axios({
    //     method: 'get',
    //     url: `https://graph.facebook.com/v23.0/${businessId}/whatsapp_business_accounts`,
    //     headers: { Authorization: `Bearer ${access_token}` }
    //   });
    //   ({ phone_number_id, id: waba_id } = wabaResponse.data.data[0] || {});
    // }

  try {
    const [result] = await pool.query(
      ` INSERT INTO tenants (business_id, business_name, business_email, phone_number, phone_number_code, first_name, last_name, display_name, website_url, country, state, business_category, timezone, waba_id, phone_number_id, access_token, token_expires_in ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) `, 
      [business_id, business_name, business_email, phone_number, phone_number_code, first_name, last_name, display_name, website_url, country, state, business_category, timezone, waba_id, phone_number_id, access_token, expires_in ]
    )
        console.log(`✅ New tenant inserted with ID: ${result.insertId}`);
       const userReq = {
        ...req,
        body: {
          ...req.body,
          tenant_id: result.insertId,
          // email: business_email, // Use business email as user email
          role_id: 1 // Set as admin user
        }
      };

      const userRes = {
        ...res,
        json: (data) => data, // Mock response for user creation
        status: (code) => ({ json: (data) => data })
      };
    const user_result = await registerUser(userReq,userRes)
       if (user_result.error) {
        throw new Error(user_result.error);
      }
      res.status(200).json({
        success: true,
        message: 'WhatsApp Business Account connected successfully',
        data: {
          tenant_id: result.insertId,
          user_id: user_result.user_id,
          waba_id,
          phone_number_id,
          business_id: business_id,
          expires_in
        }
      });
  } catch (err) {
    console.error('❌ Error inserting new tenant into DB:', err);
  }

  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
};





