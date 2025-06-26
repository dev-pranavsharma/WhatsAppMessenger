import { executeQuery } from '../config/database.js';

/**
 * Get all contacts for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUserContacts = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { search, tags, limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT id, name, phone, email, tags, custom_fields, opt_in_status, 
             created_at, updated_at
      FROM contacts 
      WHERE user_id = ?
    `;
    
    const queryParams = [userId];
    
    // Add search functionality
    if (search) {
      query += ' AND (name LIKE ? OR phone LIKE ? OR email LIKE ?)';
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern);
    }
    
    // Add tag filtering
    if (tags) {
      query += ' AND JSON_CONTAINS(tags, ?)';
      queryParams.push(`"${tags}"`);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));
    
    const contacts = await executeQuery(query, queryParams);
    
    // Parse JSON fields
    const parsedContacts = contacts.map(contact => ({
      ...contact,
      tags: contact.tags ? JSON.parse(contact.tags) : [],
      custom_fields: contact.custom_fields ? JSON.parse(contact.custom_fields) : {}
    }));
    
    res.json(parsedContacts);
  } catch (error) {
    console.error('Error fetching user contacts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get single contact by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getContactById = async (req, res) => {
  try {
    const contactId = req.params.id;
    const userId = req.session.userId;
    
    const query = `
      SELECT id, name, phone, email, tags, custom_fields, opt_in_status, 
             created_at, updated_at
      FROM contacts 
      WHERE id = ? AND user_id = ?
    `;
    
    const contacts = await executeQuery(query, [contactId, userId]);
    
    if (contacts.length === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    const contact = contacts[0];
    contact.tags = contact.tags ? JSON.parse(contact.tags) : [];
    contact.custom_fields = contact.custom_fields ? JSON.parse(contact.custom_fields) : {};
    
    res.json(contact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Create new contact
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createContact = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { name, phone, email, tags, custom_fields, opt_in_status } = req.body;
    
    // Validate required fields
    if (!name || !phone) {
      return res.status(400).json({ 
        message: 'Name and phone number are required' 
      });
    }
    
    // Validate phone number format (basic validation)
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ 
        message: 'Invalid phone number format' 
      });
    }
    
    // Check for duplicate phone number
    const existingContact = await executeQuery(
      'SELECT id FROM contacts WHERE phone = ? AND user_id = ?',
      [phone, userId]
    );
    
    if (existingContact.length > 0) {
      return res.status(409).json({ 
        message: 'Contact with this phone number already exists' 
      });
    }
    
    // Create contact
    const insertQuery = `
      INSERT INTO contacts (user_id, name, phone, email, tags, custom_fields, opt_in_status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const tagsJson = tags ? JSON.stringify(tags) : null;
    const customFieldsJson = custom_fields ? JSON.stringify(custom_fields) : null;
    
    const result = await executeQuery(insertQuery, [
      userId, name, phone, email, tagsJson, customFieldsJson, opt_in_status !== false
    ]);
    
    // Fetch created contact
    const newContact = await executeQuery(`
      SELECT id, name, phone, email, tags, custom_fields, opt_in_status, 
             created_at, updated_at
      FROM contacts 
      WHERE id = ?
    `, [result.insertId]);
    
    const contact = newContact[0];
    contact.tags = contact.tags ? JSON.parse(contact.tags) : [];
    contact.custom_fields = contact.custom_fields ? JSON.parse(contact.custom_fields) : {};
    
    res.status(201).json({
      message: 'Contact created successfully',
      contact: contact
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Update contact
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    const userId = req.session.userId;
    const { name, phone, email, tags, custom_fields, opt_in_status } = req.body;
    
    // Check if contact exists and belongs to user
    const existingContact = await executeQuery(
      'SELECT id FROM contacts WHERE id = ? AND user_id = ?',
      [contactId, userId]
    );
    
    if (existingContact.length === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    // Validate phone number if provided
    if (phone) {
      const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ 
          message: 'Invalid phone number format' 
        });
      }
      
      // Check for duplicate phone number (excluding current contact)
      const duplicateCheck = await executeQuery(
        'SELECT id FROM contacts WHERE phone = ? AND user_id = ? AND id != ?',
        [phone, userId, contactId]
      );
      
      if (duplicateCheck.length > 0) {
        return res.status(409).json({ 
          message: 'Contact with this phone number already exists' 
        });
      }
    }
    
    // Update contact
    const updateQuery = `
      UPDATE contacts 
      SET name = ?, phone = ?, email = ?, tags = ?, custom_fields = ?, 
          opt_in_status = ?, updated_at = NOW()
      WHERE id = ? AND user_id = ?
    `;
    
    const tagsJson = tags ? JSON.stringify(tags) : null;
    const customFieldsJson = custom_fields ? JSON.stringify(custom_fields) : null;
    
    await executeQuery(updateQuery, [
      name, phone, email, tagsJson, customFieldsJson, opt_in_status, contactId, userId
    ]);
    
    // Fetch updated contact
    const updatedContact = await executeQuery(`
      SELECT id, name, phone, email, tags, custom_fields, opt_in_status, 
             created_at, updated_at
      FROM contacts 
      WHERE id = ?
    `, [contactId]);
    
    const contact = updatedContact[0];
    contact.tags = contact.tags ? JSON.parse(contact.tags) : [];
    contact.custom_fields = contact.custom_fields ? JSON.parse(contact.custom_fields) : {};
    
    res.json({
      message: 'Contact updated successfully',
      contact: contact
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Delete contact
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    const userId = req.session.userId;
    
    // Check if contact exists and belongs to user
    const existingContact = await executeQuery(
      'SELECT id FROM contacts WHERE id = ? AND user_id = ?',
      [contactId, userId]
    );
    
    if (existingContact.length === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    // Check if contact is being used in any active campaigns
    const campaignCheck = await executeQuery(`
      SELECT c.id, c.name 
      FROM campaigns c 
      WHERE c.user_id = ? AND c.status IN ('RUNNING', 'SCHEDULED') 
      AND JSON_CONTAINS(c.target_contacts, ?)
    `, [userId, contactId.toString()]);
    
    if (campaignCheck.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete contact that is part of active campaigns',
        active_campaigns: campaignCheck.map(c => c.name)
      });
    }
    
    // Delete contact (messages will be deleted due to CASCADE)
    await executeQuery('DELETE FROM contacts WHERE id = ? AND user_id = ?', [contactId, userId]);
    
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Bulk import contacts from CSV data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const bulkImportContacts = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { contacts } = req.body;
    
    if (!Array.isArray(contacts) || contacts.length === 0) {
      return res.status(400).json({ message: 'Contacts array is required' });
    }
    
    const results = {
      imported: 0,
      skipped: 0,
      errors: []
    };
    
    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      const { name, phone, email, tags } = contact;
      
      try {
        // Basic validation
        if (!name || !phone) {
          results.errors.push(`Row ${i + 1}: Name and phone are required`);
          results.skipped++;
          continue;
        }
        
        // Phone format validation
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(phone)) {
          results.errors.push(`Row ${i + 1}: Invalid phone number format`);
          results.skipped++;
          continue;
        }
        
        // Check for duplicate
        const existing = await executeQuery(
          'SELECT id FROM contacts WHERE phone = ? AND user_id = ?',
          [phone, userId]
        );
        
        if (existing.length > 0) {
          results.errors.push(`Row ${i + 1}: Phone number already exists`);
          results.skipped++;
          continue;
        }
        
        // Insert contact
        const tagsJson = tags && Array.isArray(tags) ? JSON.stringify(tags) : null;
        await executeQuery(`
          INSERT INTO contacts (user_id, name, phone, email, tags, opt_in_status)
          VALUES (?, ?, ?, ?, ?, TRUE)
        `, [userId, name, phone, email || null, tagsJson]);
        
        results.imported++;
      } catch (error) {
        results.errors.push(`Row ${i + 1}: ${error.message}`);
        results.skipped++;
      }
    }
    
    res.json({
      message: 'Bulk import completed',
      results: results
    });
  } catch (error) {
    console.error('Error bulk importing contacts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get unique tags from user contacts
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getContactTags = async (req, res) => {
  try {
    const userId = req.session.userId;
    
    const contacts = await executeQuery(
      'SELECT tags FROM contacts WHERE user_id = ? AND tags IS NOT NULL',
      [userId]
    );
    
    const allTags = new Set();
    
    contacts.forEach(contact => {
      if (contact.tags) {
        const tags = JSON.parse(contact.tags);
        tags.forEach(tag => allTags.add(tag));
      }
    });
    
    res.json(Array.from(allTags).sort());
  } catch (error) {
    console.error('Error fetching contact tags:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get contact statistics for dashboard
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getContactStats = async (req, res) => {
  try {
    const userId = req.session.userId;
    
    // Get total contacts
    const totalResult = await executeQuery(
      'SELECT COUNT(*) as total FROM contacts WHERE user_id = ?',
      [userId]
    );
    
    // Get opted-in contacts
    const optedInResult = await executeQuery(
      'SELECT COUNT(*) as opted_in FROM contacts WHERE user_id = ? AND opt_in_status = TRUE',
      [userId]
    );
    
    // Get recent contacts (last 30 days)
    const recentResult = await executeQuery(
      'SELECT COUNT(*) as recent FROM contacts WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)',
      [userId]
    );
    
    res.json({
      total_contacts: totalResult[0].total,
      opted_in_contacts: optedInResult[0].opted_in,
      recent_contacts: recentResult[0].recent,
      opt_in_rate: totalResult[0].total > 0 ? 
        ((optedInResult[0].opted_in / totalResult[0].total) * 100).toFixed(2) : 0
    });
  } catch (error) {
    console.error('Error fetching contact stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};