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
    address_line_1,
    address_line_2,
    country,
    state,
    business_category,
    timezone
  } = req.body;
  console.log('client details', business_id, waba_id, phone_number_id, code)
  try {
    const tokenResponse = await axios({
      method: 'post',
      url: `${process.env.FACEBOOK_API_URL}/${FACEBOOK_API_VERSION}/oauth/access_token`,
      params: {
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        code: code,
        redirect_uri: ''
      }
    });
    const { access_token, expires_in } = tokenResponse.data;
    console.log('Access token from exchange-code:', access_token);

  try {
    const [result] = await pool.query(
      ` INSERT INTO tenants (business_id, business_name, business_email, phone_number, phone_number_code, first_name, last_name, display_name, website_url, country, state, business_category, timezone, waba_id, phone_number_id, access_token, token_expires_in ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) `, 
      [business_id, business_name, business_email, phone_number, phone_number_code, first_name, last_name, display_name, website_url, country, state, business_category, timezone, waba_id, phone_number_id, access_token, expires_in ]
    )
    console.log(`✅ New tenant inserted with ID: ${result.insertId}`);

      res.status(200).json({
        success: true,
        message: 'WhatsApp Business Account connected successfully',
        data: {
          tenant_id: result.insertId,
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





