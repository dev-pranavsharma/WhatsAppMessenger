
const API_BASE_URL = process.env.REACT_APP_API_URL + '/api' || 'https://49a8-119-42-59-162.ngrok-free.app/api';

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

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
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

export const userService = {

  register: (userData) => apiRequest('/users/register', {
    method: 'POST',
    body: userData,
  }),


  login: (credentials) => apiRequest('/users/login', {
    method: 'POST',
    body: credentials,
  }),

  logout: () => apiRequest('/users/logout', {
    method: 'POST',
  }),

  getCurrentUser: () => apiRequest('/users/me'),

  updateProfile: (userId, profileData) => apiRequest(`/users/${userId}`, {
    method: 'PUT',
    body: profileData,
  }),


  updateWhatsAppConfig: (userId, whatsappConfig) => apiRequest(`/users/${userId}/whatsapp`, {
    method: 'PUT',
    body: whatsappConfig,
  }),
};

export const campaignService = {

  getCampaigns: () => apiRequest('/campaigns'),

  getCampaign: (campaignId) => apiRequest(`/campaigns/${campaignId}`),


  createCampaign: (campaignData) => apiRequest('/campaigns', {
    method: 'POST',
    body: campaignData,
  }),

  updateCampaign: (campaignId, campaignData) => apiRequest(`/campaigns/${campaignId}`, {
    method: 'PUT',
    body: campaignData,
  }),

  deleteCampaign: (campaignId) => apiRequest(`/campaigns/${campaignId}`, {
    method: 'DELETE',
  }),

  startCampaign: (campaignId) => apiRequest(`/campaigns/${campaignId}/start`, {
    method: 'POST',
  }),

  getCampaignStats: (campaignId) => apiRequest(`/campaigns/${campaignId}/stats`),
}

export const templateService = {

  getTemplates: () => apiRequest('/templates'),

  getTemplate: (templateId) => apiRequest(`/templates/${templateId}`),

  createTemplate: (templateData) => apiRequest('/templates', {
    method: 'POST',
    body: templateData,
  }),

  updateTemplate: (templateId, templateData) => apiRequest(`/templates/${templateId}`, {
    method: 'PUT',
    body: templateData,
  }),

  deleteTemplate: (templateId) => apiRequest(`/templates/${templateId}`, {
    method: 'DELETE',
  }),

  submitForApproval: (templateId) => apiRequest(`/templates/${templateId}/submit`, {
    method: 'POST',
  }),

  getCategories: () => apiRequest('/templates/categories'),

  previewTemplate: (templateId, sampleData) => apiRequest(`/templates/${templateId}/preview`, {
    method: 'POST',
    body: { sample_data: sampleData },
  }),
};

export const contactService = {

  getContacts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/contacts${queryString ? `?${queryString}` : ''}`);
  },

  getContact: (contactId) => apiRequest(`/contacts/${contactId}`),

  createContact: (contactData) => apiRequest('/contacts', {
    method: 'POST',
    body: contactData,
  }),

  updateContact: (contactId, contactData) => apiRequest(`/contacts/${contactId}`, {
    method: 'PUT',
    body: contactData,
  }),

  deleteContact: (contactId) => apiRequest(`/contacts/${contactId}`, {
    method: 'DELETE',
  }),

  bulkImport: (contacts) => apiRequest('/contacts/bulk-import', {
    method: 'POST',
    body: { contacts },
  }),

  getTags: () => apiRequest('/contacts/tags'),
  getStats: () => apiRequest('/contacts/stats'),
};

export const healthService = {
  checkHealth: () => apiRequest('/health'),
}

export const tenantService = {
  addTenant: async (payload) => {
    apiRequest('/tenants/add', {
      method: "POST",
      body: payload
    })
  },
  updateTenant: async (payload) => {
    return apiRequest('/tenants/update', {
      method: "PUT",
      body: payload
    })
  },
  tenantById: async () => {
    return apiRequest(`/tenants/tenant`)
  }

}