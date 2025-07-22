import { executeQuery } from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const query = `SELECT * FROM users WHERE id = ?`;

    const users = await executeQuery(query, [userId]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email, phone_number, business_name } = req.body;

    // Check if user exists
    const existingUser = await executeQuery('SELECT id FROM users WHERE id = ?', [userId]);
    if (existingUser.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user profile
    const updateQuery = `
      UPDATE users 
      SET username = ?, email = ?, phone_number = ?, business_name = ?, updated_at = NOW()
      WHERE id = ?
    `;

    await executeQuery(updateQuery, [username, email, phone_number, business_name, userId]);

    // Fetch updated user profile
    const updatedUser = await executeQuery(`
      SELECT id, username, email, whatsapp_business_id, phone_number, 
             business_name, is_verified, created_at, updated_at
      FROM users 
      WHERE id = ?
    `, [userId]);

    res.json(updatedUser[0]);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const registerUser = async (req, res) => {
  try {
    const {first_name,last_name, tenant_id, role_id, email, password } = req.body;
    console.log(first_name,last_name, tenant_id, role_id, email, password );
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await executeQuery('SELECT id FROM users WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'email already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Insert new user
    const insertQuery = ` INSERT INTO users (first_name, last_name, tenant_id ,role_id, email, password) VALUES (?, ?, ?, ?, ?, ?) `;

    const result = await executeQuery(insertQuery, [first_name,last_name,tenant_id, role_id, email, hashedPassword]);
    // save token
    const token = jwt.sign({ user_id: result.insertId, email: email, password: hashedPassword }, process.env.JWT_SECRET, { expiresIn: '30d' });
    const save_token = await executeQuery(`UPDATE users SET refresh_token = ? WHERE id = ?`, [token, result.insertId])

    // Return user data (without password)
    const newUser = await executeQuery(` SELECT id, email, first_name, last_name, created_at FROM users WHERE id = ? `, [result.insertId]);

    res.status(201).json({
      success:true,
      message: 'User registered successfully',
      user: newUser[0]
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    // Find user by username or email
    const userQuery = ` SELECT * FROM users WHERE email = ? `;

    const users = await executeQuery(userQuery, [email]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Remove password from response
    delete user.password;
    
    // Store user in session
    const token = jwt.sign({ user_id: user.id, role_id: user.role_id, tenant_id: user.tenant_id, email: user.email, }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('accessToken', token, {
      httpOnly: true,       // prevents access from JavaScript (XSS safe)
      secure: process.env.NODE_ENV === 'production', // send only over HTTPS in prod
      sameSite: 'none',   // optional, restricts cross-site requests
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
    res.json({
      message: 'Login successful',
      user: user,
    })

  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ message: 'Could not log out' });
    }

    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
};


export const updateWhatsAppConfig = async (req, res) => {
  try {
    const userId = req.params.id;
    const { whatsapp_business_id, access_token, phone_number } = req.body;

    // Update WhatsApp configuration
    const updateQuery = `
      UPDATE users 
      SET whatsapp_business_id = ?, access_token = ?, phone_number = ?, 
          is_verified = TRUE, updated_at = NOW()
      WHERE id = ?
    `;

    await executeQuery(updateQuery, [whatsapp_business_id, access_token, phone_number, userId]);

    // Fetch updated user profile
    const updatedUser = await executeQuery(`
      SELECT id, username, email, whatsapp_business_id, phone_number, 
             business_name, is_verified, created_at, updated_at
      FROM users 
      WHERE id = ?
    `, [userId]);

    res.json({
      message: 'WhatsApp configuration updated successfully',
      user: updatedUser[0]
    });
  } catch (error) {
    console.error('Error updating WhatsApp configuration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user.user_id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const query = `
      SELECT id, username, email, whatsapp_business_id, phone_number, 
             business_name, is_verified, created_at, updated_at
      FROM users 
      WHERE id = ?
    `;

    const users = await executeQuery(query, [req.user.user_id]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}