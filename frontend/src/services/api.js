/**
 * API service for communicating with the backend
 * Handles all HTTP requests and response processing
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

/**
 * Generic API request handler with error handling
 * @param {string} endpoint - API endpoint path
 * @param {Object} options - Request options (method, body, etc.)
 * @returns {Promise<Object>} Response data
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    credentials: 'include', // Include cookies for session handling
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Convert body to JSON if it's an object
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    
    // Handle different response types
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * User authentication and profile services
 */
export const userService = {
  /**
   * Register new user account
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} User data
   */
  register: (userData) => apiRequest('/users/register', {
    method: 'POST',
    body: userData,
  }),

  /**
   * Login user with credentials
   * @param {Object} credentials - Username and password
   * @returns {Promise<Object>} User data
   */
  login: (credentials) => apiRequest('/users/login', {
    method: 'POST',
    body: credentials,
  }),

  /**
   * Logout current user
   * @returns {Promise<Object>} Logout confirmation
   */
  logout: () => apiRequest('/users/logout', {
    method: 'POST',
  }),

  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  getCurrentUser: () => apiRequest('/users/me'),

  /**
   * Update user profile
   * @param {number} userId - User ID
   * @param {Object} profileData - Updated profile data
   * @returns {Promise<Object>} Updated user data
   */
  updateProfile: (userId, profileData) => apiRequest(`/users/${userId}`, {
    method: 'PUT',
    body: profileData,
  }),

  /**
   * Update WhatsApp business configuration
   * @param {number} userId - User ID
   * @param {Object} whatsappConfig - WhatsApp configuration
   * @returns {Promise<Object>} Updated user data
   */
  updateWhatsAppConfig: (userId, whatsappConfig) => apiRequest(`/users/${userId}/whatsapp`, {
    method: 'PUT',
    body: whatsappConfig,
  }),
};

/**
 * Campaign management services
 */
export const campaignService = {
  /**
   * Get all campaigns for current user
   * @returns {Promise<Array>} List of campaigns
   */
  getCampaigns: () => apiRequest('/campaigns'),

  /**
   * Get single campaign by ID
   * @param {number} campaignId - Campaign ID
   * @returns {Promise<Object>} Campaign data
   */
  getCampaign: (campaignId) => apiRequest(`/campaigns/${campaignId}`),

  /**
   * Create new campaign
   * @param {Object} campaignData - Campaign data
   * @returns {Promise<Object>} Created campaign
   */
  createCampaign: (campaignData) => apiRequest('/campaigns', {
    method: 'POST',
    body: campaignData,
  }),

  /**
   * Update existing campaign
   * @param {number} campaignId - Campaign ID
   * @param {Object} campaignData - Updated campaign data
   * @returns {Promise<Object>} Updated campaign
   */
  updateCampaign: (campaignId, campaignData) => apiRequest(`/campaigns/${campaignId}`, {
    method: 'PUT',
    body: campaignData,
  }),

  /**
   * Delete campaign
   * @param {number} campaignId - Campaign ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteCampaign: (campaignId) => apiRequest(`/campaigns/${campaignId}`, {
    method: 'DELETE',
  }),

  /**
   * Start campaign execution
   * @param {number} campaignId - Campaign ID
   * @returns {Promise<Object>} Start confirmation
   */
  startCampaign: (campaignId) => apiRequest(`/campaigns/${campaignId}/start`, {
    method: 'POST',
  }),

  /**
   * Get campaign statistics
   * @param {number} campaignId - Campaign ID
   * @returns {Promise<Object>} Campaign stats
   */
  getCampaignStats: (campaignId) => apiRequest(`/campaigns/${campaignId}/stats`),
};

/**
 * Template management services
 */
export const templateService = {
  /**
   * Get all templates for current user
   * @returns {Promise<Array>} List of templates
   */
  getTemplates: () => apiRequest('/templates'),

  /**
   * Get single template by ID
   * @param {number} templateId - Template ID
   * @returns {Promise<Object>} Template data
   */
  getTemplate: (templateId) => apiRequest(`/templates/${templateId}`),

  /**
   * Create new template
   * @param {Object} templateData - Template data
   * @returns {Promise<Object>} Created template
   */
  createTemplate: (templateData) => apiRequest('/templates', {
    method: 'POST',
    body: templateData,
  }),

  /**
   * Update existing template
   * @param {number} templateId - Template ID
   * @param {Object} templateData - Updated template data
   * @returns {Promise<Object>} Updated template
   */
  updateTemplate: (templateId, templateData) => apiRequest(`/templates/${templateId}`, {
    method: 'PUT',
    body: templateData,
  }),

  /**
   * Delete template
   * @param {number} templateId - Template ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteTemplate: (templateId) => apiRequest(`/templates/${templateId}`, {
    method: 'DELETE',
  }),

  /**
   * Submit template for approval
   * @param {number} templateId - Template ID
   * @returns {Promise<Object>} Submission confirmation
   */
  submitForApproval: (templateId) => apiRequest(`/templates/${templateId}/submit`, {
    method: 'POST',
  }),

  /**
   * Get available template categories
   * @returns {Promise<Array>} List of categories
   */
  getCategories: () => apiRequest('/templates/categories'),

  /**
   * Preview template with sample data
   * @param {number} templateId - Template ID
   * @param {Object} sampleData - Sample data for placeholders
   * @returns {Promise<Object>} Preview content
   */
  previewTemplate: (templateId, sampleData) => apiRequest(`/templates/${templateId}/preview`, {
    method: 'POST',
    body: { sample_data: sampleData },
  }),
};

/**
 * Contact management services
 */
export const contactService = {
  /**
   * Get all contacts for current user
   * @param {Object} params - Query parameters (search, tags, limit, offset)
   * @returns {Promise<Array>} List of contacts
   */
  getContacts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/contacts${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Get single contact by ID
   * @param {number} contactId - Contact ID
   * @returns {Promise<Object>} Contact data
   */
  getContact: (contactId) => apiRequest(`/contacts/${contactId}`),

  /**
   * Create new contact
   * @param {Object} contactData - Contact data
   * @returns {Promise<Object>} Created contact
   */
  createContact: (contactData) => apiRequest('/contacts', {
    method: 'POST',
    body: contactData,
  }),

  /**
   * Update existing contact
   * @param {number} contactId - Contact ID
   * @param {Object} contactData - Updated contact data
   * @returns {Promise<Object>} Updated contact
   */
  updateContact: (contactId, contactData) => apiRequest(`/contacts/${contactId}`, {
    method: 'PUT',
    body: contactData,
  }),

  /**
   * Delete contact
   * @param {number} contactId - Contact ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteContact: (contactId) => apiRequest(`/contacts/${contactId}`, {
    method: 'DELETE',
  }),

  /**
   * Bulk import contacts from CSV data
   * @param {Array} contacts - Array of contact objects
   * @returns {Promise<Object>} Import results
   */
  bulkImport: (contacts) => apiRequest('/contacts/bulk-import', {
    method: 'POST',
    body: { contacts },
  }),

  /**
   * Get available contact tags
   * @returns {Promise<Array>} List of tags
   */
  getTags: () => apiRequest('/contacts/tags'),

  /**
   * Get contact statistics
   * @returns {Promise<Object>} Contact stats
   */
  getStats: () => apiRequest('/contacts/stats'),
};

/**
 * Health check service
 */
export const healthService = {
  /**
   * Check API server health
   * @returns {Promise<Object>} Health status
   */
  checkHealth: () => apiRequest('/health'),
};