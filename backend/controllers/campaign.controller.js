import { executeQuery } from '../config/database.js';

/**
 * Get all campaigns for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUserCampaigns = async (req, res) => {
  try {
    const userId = req.session.userId;
    
    const query = `
      SELECT c.*, t.name as template_name, t.category as template_category
      FROM campaigns c
      LEFT JOIN templates t ON c.template_id = t.id
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC
    `;
    
    const campaigns = await executeQuery(query, [userId]);
    res.json(campaigns);
  } catch (error) {
    console.error('Error fetching user campaigns:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get single campaign by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getCampaignById = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const userId = req.session.userId;
    
    const query = `
      SELECT c.*, t.name as template_name, t.content as template_content
      FROM campaigns c
      LEFT JOIN templates t ON c.template_id = t.id
      WHERE c.id = ? AND c.user_id = ?
    `;
    
    const campaigns = await executeQuery(query, [campaignId, userId]);
    
    if (campaigns.length === 0) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    res.json(campaigns[0]);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Create new campaign
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createCampaign = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { name, template_id, target_contacts, scheduled_at } = req.body;
    
    // Validate required fields
    if (!name || !template_id || !target_contacts) {
      return res.status(400).json({ 
        message: 'Name, template ID, and target contacts are required' 
      });
    }
    
    // Verify template belongs to user
    const templateCheck = await executeQuery(
      'SELECT id FROM templates WHERE id = ? AND user_id = ?',
      [template_id, userId]
    );
    
    if (templateCheck.length === 0) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    // Create campaign
    const insertQuery = `
      INSERT INTO campaigns (user_id, name, template_id, target_contacts, scheduled_at, status)
      VALUES (?, ?, ?, ?, ?, 'DRAFT')
    `;
    
    const targetContactsJson = JSON.stringify(target_contacts);
    const result = await executeQuery(insertQuery, [
      userId, name, template_id, targetContactsJson, scheduled_at
    ]);
    
    // Fetch created campaign
    const newCampaign = await executeQuery(`
      SELECT c.*, t.name as template_name
      FROM campaigns c
      LEFT JOIN templates t ON c.template_id = t.id
      WHERE c.id = ?
    `, [result.insertId]);
    
    res.status(201).json({
      message: 'Campaign created successfully',
      campaign: newCampaign[0]
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Update campaign
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateCampaign = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const userId = req.session.userId;
    const { name, template_id, target_contacts, scheduled_at, status } = req.body;
    
    // Check if campaign exists and belongs to user
    const existingCampaign = await executeQuery(
      'SELECT id, status FROM campaigns WHERE id = ? AND user_id = ?',
      [campaignId, userId]
    );
    
    if (existingCampaign.length === 0) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    // Don't allow updating completed campaigns
    if (existingCampaign[0].status === 'COMPLETED') {
      return res.status(400).json({ message: 'Cannot update completed campaign' });
    }
    
    // Update campaign
    const updateQuery = `
      UPDATE campaigns 
      SET name = ?, template_id = ?, target_contacts = ?, scheduled_at = ?, 
          status = ?, updated_at = NOW()
      WHERE id = ? AND user_id = ?
    `;
    
    const targetContactsJson = JSON.stringify(target_contacts);
    await executeQuery(updateQuery, [
      name, template_id, targetContactsJson, scheduled_at, status, campaignId, userId
    ]);
    
    // Fetch updated campaign
    const updatedCampaign = await executeQuery(`
      SELECT c.*, t.name as template_name
      FROM campaigns c
      LEFT JOIN templates t ON c.template_id = t.id
      WHERE c.id = ?
    `, [campaignId]);
    
    res.json({
      message: 'Campaign updated successfully',
      campaign: updatedCampaign[0]
    });
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Delete campaign
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteCampaign = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const userId = req.session.userId;
    
    // Check if campaign exists and belongs to user
    const existingCampaign = await executeQuery(
      'SELECT id, status FROM campaigns WHERE id = ? AND user_id = ?',
      [campaignId, userId]
    );
    
    if (existingCampaign.length === 0) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    // Don't allow deleting running campaigns
    if (existingCampaign[0].status === 'RUNNING') {
      return res.status(400).json({ message: 'Cannot delete running campaign' });
    }
    
    // Delete campaign (messages will be deleted due to CASCADE)
    await executeQuery('DELETE FROM campaigns WHERE id = ? AND user_id = ?', [campaignId, userId]);
    
    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Start campaign execution
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const startCampaign = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const userId = req.session.userId;
    
    // Check if campaign exists and belongs to user
    const campaignQuery = `
      SELECT c.*, t.status as template_status
      FROM campaigns c
      LEFT JOIN templates t ON c.template_id = t.id
      WHERE c.id = ? AND c.user_id = ?
    `;
    
    const campaigns = await executeQuery(campaignQuery, [campaignId, userId]);
    
    if (campaigns.length === 0) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    const campaign = campaigns[0];
    
    // Validate campaign can be started
    if (campaign.status === 'RUNNING' || campaign.status === 'COMPLETED') {
      return res.status(400).json({ message: 'Campaign already running or completed' });
    }
    
    if (campaign.template_status !== 'APPROVED') {
      return res.status(400).json({ message: 'Template must be approved before starting campaign' });
    }
    
    // Update campaign status to RUNNING
    await executeQuery(
      'UPDATE campaigns SET status = "RUNNING", updated_at = NOW() WHERE id = ?',
      [campaignId]
    );
    
    // Create message records for each target contact
    const targetContacts = JSON.parse(campaign.target_contacts);
    
    for (const contactId of targetContacts) {
      await executeQuery(`
        INSERT INTO messages (campaign_id, contact_id, status)
        VALUES (?, ?, 'PENDING')
      `, [campaignId, contactId]);
    }
    
    res.json({ message: 'Campaign started successfully' });
  } catch (error) {
    console.error('Error starting campaign:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get campaign statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getCampaignStats = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const userId = req.session.userId;
    
    // Verify campaign belongs to user
    const campaignCheck = await executeQuery(
      'SELECT id FROM campaigns WHERE id = ? AND user_id = ?',
      [campaignId, userId]
    );
    
    if (campaignCheck.length === 0) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    // Get message statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_messages,
        SUM(CASE WHEN status = 'SENT' THEN 1 ELSE 0 END) as sent_count,
        SUM(CASE WHEN status = 'DELIVERED' THEN 1 ELSE 0 END) as delivered_count,
        SUM(CASE WHEN status = 'READ' THEN 1 ELSE 0 END) as read_count,
        SUM(CASE WHEN status = 'FAILED' THEN 1 ELSE 0 END) as failed_count
      FROM messages 
      WHERE campaign_id = ?
    `;
    
    const stats = await executeQuery(statsQuery, [campaignId]);
    
    // Calculate rates
    const totalMessages = stats[0].total_messages || 0;
    const deliveryRate = totalMessages > 0 ? (stats[0].delivered_count / totalMessages * 100).toFixed(2) : 0;
    const readRate = totalMessages > 0 ? (stats[0].read_count / totalMessages * 100).toFixed(2) : 0;
    
    res.json({
      total_messages: totalMessages,
      sent_count: stats[0].sent_count || 0,
      delivered_count: stats[0].delivered_count || 0,
      read_count: stats[0].read_count || 0,
      failed_count: stats[0].failed_count || 0,
      delivery_rate: deliveryRate,
      read_rate: readRate
    });
  } catch (error) {
    console.error('Error fetching campaign stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};