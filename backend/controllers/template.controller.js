import { executeQuery } from '../config/database.js';

/**
 * Get all templates for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUserTemplates = async (req, res) => {
  try {
    const userId = req.session.userId;
    
    const query = `
      SELECT id, name, category, language, content, header_type, header_content, 
             footer_text, buttons, status, created_at, updated_at
      FROM templates 
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;
    
    const templates = await executeQuery(query, [userId]);
    
    // Parse JSON fields
    const parsedTemplates = templates.map(template => ({
      ...template,
      buttons: template.buttons ? JSON.parse(template.buttons) : null
    }))
    
    res.json(parsedTemplates);
  } catch (error) {
    console.error('Error fetching user templates:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get single template by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getTemplateById = async (req, res) => {
  try {
    const templateId = req.params.id;
    const userId = req.session.userId;
    
    const query = `
      SELECT id, name, category, language, content, header_type, header_content, 
             footer_text, buttons, status, created_at, updated_at
      FROM templates 
      WHERE id = ? AND user_id = ?
    `;
    
    const templates = await executeQuery(query, [templateId, userId]);
    
    if (templates.length === 0) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    const template = templates[0];
    template.buttons = template.buttons ? JSON.parse(template.buttons) : null;
    
    res.json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Create new template
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createTemplate = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { 
      name, category, language, content, header_type, 
      header_content, footer_text, buttons 
    } = req.body;
    
    // Validate required fields
    if (!name || !category || !content) {
      return res.status(400).json({ 
        message: 'Name, category, and content are required' 
      });
    }
    
    // Validate template content length
    if (content.length > 1024) {
      return res.status(400).json({ 
        message: 'Template content cannot exceed 1024 characters' 
      });
    }
    
    // Validate footer text length
    if (footer_text && footer_text.length > 60) {
      return res.status(400).json({ 
        message: 'Footer text cannot exceed 60 characters' 
      });
    }
    
    // Create template
    const insertQuery = `
      INSERT INTO templates 
      (user_id, name, category, language, content, header_type, header_content, 
       footer_text, buttons, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')
    `;
    
    const buttonsJson = buttons ? JSON.stringify(buttons) : null;
    const result = await executeQuery(insertQuery, [
      userId, name, category, language || 'en', content, 
      header_type, header_content, footer_text, buttonsJson
    ]);
    
    // Fetch created template
    const newTemplate = await executeQuery(`
      SELECT id, name, category, language, content, header_type, header_content, 
             footer_text, buttons, status, created_at, updated_at
      FROM templates 
      WHERE id = ?
    `, [result.insertId]);
    
    const template = newTemplate[0];
    template.buttons = template.buttons ? JSON.parse(template.buttons) : null;
    
    res.status(201).json({
      message: 'Template created successfully',
      template: template
    });
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Update template
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateTemplate = async (req, res) => {
  try {
    const templateId = req.params.id;
    const userId = req.session.userId;
    const { 
      name, category, language, content, header_type, 
      header_content, footer_text, buttons 
    } = req.body;
    
    // Check if template exists and belongs to user
    const existingTemplate = await executeQuery(
      'SELECT id, status FROM templates WHERE id = ? AND user_id = ?',
      [templateId, userId]
    );
    
    if (existingTemplate.length === 0) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    // Don't allow updating approved templates
    if (existingTemplate[0].status === 'APPROVED') {
      return res.status(400).json({ 
        message: 'Cannot update approved template. Create a new template instead.' 
      });
    }
    
    // Validate content length
    if (content && content.length > 1024) {
      return res.status(400).json({ 
        message: 'Template content cannot exceed 1024 characters' 
      });
    }
    
    // Update template
    const updateQuery = `
      UPDATE templates 
      SET name = ?, category = ?, language = ?, content = ?, header_type = ?, 
          header_content = ?, footer_text = ?, buttons = ?, status = 'PENDING', 
          updated_at = NOW()
      WHERE id = ? AND user_id = ?
    `;
    
    const buttonsJson = buttons ? JSON.stringify(buttons) : null;
    await executeQuery(updateQuery, [
      name, category, language, content, header_type, 
      header_content, footer_text, buttonsJson, templateId, userId
    ]);
    
    // Fetch updated template
    const updatedTemplate = await executeQuery(`
      SELECT id, name, category, language, content, header_type, header_content, 
             footer_text, buttons, status, created_at, updated_at
      FROM templates 
      WHERE id = ?
    `, [templateId]);
    
    const template = updatedTemplate[0];
    template.buttons = template.buttons ? JSON.parse(template.buttons) : null;
    
    res.json({
      message: 'Template updated successfully',
      template: template
    });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Delete template
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteTemplate = async (req, res) => {
  try {
    const templateId = req.params.id;
    const userId = req.session.userId;
    
    // Check if template exists and belongs to user
    const existingTemplate = await executeQuery(
      'SELECT id FROM templates WHERE id = ? AND user_id = ?',
      [templateId, userId]
    );
    
    if (existingTemplate.length === 0) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    // Check if template is being used in any campaigns
    const campaignCheck = await executeQuery(
      'SELECT id FROM campaigns WHERE template_id = ?',
      [templateId]
    );
    
    if (campaignCheck.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete template that is being used in campaigns' 
      });
    }
    
    // Delete template
    await executeQuery('DELETE FROM templates WHERE id = ? AND user_id = ?', [templateId, userId]);
    
    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Submit template for approval
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const submitTemplateForApproval = async (req, res) => {
  try {
    const templateId = req.params.id;
    const userId = req.session.userId;
    
    // Check if template exists and belongs to user
    const existingTemplate = await executeQuery(
      'SELECT id, status, name FROM templates WHERE id = ? AND user_id = ?',
      [templateId, userId]
    );
    
    if (existingTemplate.length === 0) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    const template = existingTemplate[0];
    
    if (template.status === 'APPROVED') {
      return res.status(400).json({ message: 'Template is already approved' });
    }
    
    if (template.status === 'UNDER_REVIEW') {
      return res.status(400).json({ message: 'Template is already under review' });
    }
    
    // Update template status to under review
    await executeQuery(
      'UPDATE templates SET status = "UNDER_REVIEW", updated_at = NOW() WHERE id = ?',
      [templateId]
    );
    
    res.json({ 
      message: 'Template submitted for approval successfully',
      template_name: template.name
    });
  } catch (error) {
    console.error('Error submitting template for approval:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get template categories
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getTemplateCategories = (req, res) => {
  const categories = [
    'MARKETING',
    'UTILITY',
    'AUTHENTICATION',
    'AUTO_REPLY',
    'ISSUE_RESOLUTION',
    'APPOINTMENT_UPDATE',
    'PAYMENT_UPDATE',
    'SHIPPING_UPDATE',
    'RESERVATION_UPDATE',
    'TRANSPORTATION_UPDATE'
  ];
  
  res.json(categories);
};

/**
 * Preview template with sample data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const previewTemplate = async (req, res) => {
  try {
    const templateId = req.params.id;
    const userId = req.session.userId;
    const { sample_data } = req.body;
    
    // Get template
    const templates = await executeQuery(
      'SELECT content, header_content, footer_text FROM templates WHERE id = ? AND user_id = ?',
      [templateId, userId]
    );
    
    if (templates.length === 0) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    const template = templates[0];
    let previewContent = template.content;
    let previewHeader = template.header_content;
    
    // Replace placeholders with sample data
    if (sample_data) {
      Object.keys(sample_data).forEach(key => {
        const placeholder = `{{${key}}}`;
        previewContent = previewContent.replace(new RegExp(placeholder, 'g'), sample_data[key]);
        if (previewHeader) {
          previewHeader = previewHeader.replace(new RegExp(placeholder, 'g'), sample_data[key]);
        }
      });
    }
    
    res.json({
      header_content: previewHeader,
      content: previewContent,
      footer_text: template.footer_text
    });
  } catch (error) {
    console.error('Error previewing template:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};