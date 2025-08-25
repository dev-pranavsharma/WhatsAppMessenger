import mysql from 'mysql2/promise';

/**
 * Database connection configuration
 * Creates MySQL connection pool for efficient database operations
 */
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'whatsapp_campaigns',
  port :process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
};

export const pool = mysql.createPool(dbConfig);

export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return false;
  }
};

export const executeQuery = async (query, params = []) => {
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error('Query execution failed:', error.message);
    throw error;
  }
};

export const initializeTables = async () => {
  try {
    // Users table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        whatsapp_business_id VARCHAR(100),
        access_token TEXT,
        phone_number VARCHAR(20),
        business_name VARCHAR(100),
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Templates table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS templates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        language VARCHAR(10) NOT NULL DEFAULT 'en',
        content TEXT NOT NULL,
        header_type VARCHAR(20),
        header_content TEXT,
        footer_text VARCHAR(60),
        buttons JSON,
        status VARCHAR(20) DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Contacts table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(100),
        tags JSON,
        custom_fields JSON,
        opt_in_status BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Campaigns table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        template_id INT NOT NULL,
        target_contacts JSON,
        scheduled_at DATETIME,
        status VARCHAR(20) DEFAULT 'DRAFT',
        messages_sent INT DEFAULT 0,
        messages_delivered INT DEFAULT 0,
        messages_read INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE
      )
    `);

    // Messages table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        campaign_id INT NOT NULL,
        contact_id INT NOT NULL,
        whatsapp_message_id VARCHAR(100),
        status VARCHAR(20) DEFAULT 'PENDING',
        sent_at TIMESTAMP NULL,
        delivered_at TIMESTAMP NULL,
        read_at TIMESTAMP NULL,
        error_message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
        FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
      )
    `);

    // Webhook events table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS webhook_events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_type VARCHAR(50) NOT NULL,
        whatsapp_message_id VARCHAR(100) NOT NULL,
        payload JSON NOT NULL,
        processed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database tables:', error.message);
    throw error;
  }
};

export default pool;