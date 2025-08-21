import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Send, Eye, Search, Filter } from 'lucide-react';
import { templateService } from '../services/api';
import LoadingSpinner from '../components/loading-spinner';

const Templates = ({ user }) => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  /**
   * Load templates on component mount
   */
  useEffect(() => {
    loadTemplates();
  }, []);

  /**
   * Filter templates when search or filters change
   */
  useEffect(() => {
    filterTemplates();
  }, [templates, searchQuery, statusFilter, categoryFilter]);

  /**
   * Fetch all templates from API
   */
  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await templateService.getTemplates();
      setTemplates(data);
    } catch (err) {
      setError('Failed to load templates');
      console.error('Template loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filter templates based on search query and filters
   */
  const filterTemplates = () => {
    let filtered = templates;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(template => template.status === statusFilter);
    }

    // Filter by category
    if (categoryFilter !== 'ALL') {
      filtered = filtered.filter(template => template.category === categoryFilter);
    }

    setFilteredTemplates(filtered);
  };

  /**
   * Handle template submission for approval
   * @param {number} templateId - Template ID
   */
  const handleSubmitForApproval = async (templateId) => {
    try {
      await templateService.submitForApproval(templateId);
      await loadTemplates();
    } catch (err) {
      setError(`Failed to submit template: ${err.message}`);
    }
  };

  /**
   * Handle template deletion
   * @param {number} templateId - Template ID
   */
  const handleDeleteTemplate = async (templateId) => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }

    try {
      await templateService.deleteTemplate(templateId);
      await loadTemplates();
    } catch (err) {
      setError(`Failed to delete template: ${err.message}`);
    }
  };

  /**
   * Get status badge for template
   * @param {string} status - Template status
   */
  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { color: 'warning', text: 'Pending' },
      UNDER_REVIEW: { color: 'primary', text: 'Under Review' },
      APPROVED: { color: 'success', text: 'Approved' },
      REJECTED: { color: 'error', text: 'Rejected' }
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    return <span className={`badge badge-${config.color}`}>{config.text}</span>;
  };

  /**
   * Format category for display
   * @param {string} category - Template category
   */
  const formatCategory = (category) => {
    return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold ">Message Templates</h1>
          <p className=" mt-1">
            Create and manage reusable WhatsApp message templates
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Template
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Search and filters */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 " />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input pl-10"
                />
              </div>
            </div>

            {/* Status filter */}
            <div className="lg:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 " />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="form-select pl-10"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>

            {/* Category filter */}
            <div className="lg:w-48">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="form-select"
              >
                <option value="ALL">All Categories</option>
                <option value="MARKETING">Marketing</option>
                <option value="UTILITY">Utility</option>
                <option value="AUTHENTICATION">Authentication</option>
                <option value="AUTO_REPLY">Auto Reply</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Templates grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="card">
              <div className="card-header">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold  mb-1">{template.name}</h3>
                    <p className="text-sm ">{formatCategory(template.category)}</p>
                  </div>
                  {getStatusBadge(template.status)}
                </div>
              </div>

              <div className="card-body">
                {/* Template preview */}
                <div className=" rounded-lg p-3 mb-4">
                  {template.header_content && (
                    <div className="font-medium  mb-2">
                      {template.header_content}
                    </div>
                  )}
                  <div className="text-sm  line-clamp-3">
                    {template.content}
                  </div>
                  {template.footer_text && (
                    <div className="text-xs  mt-2 italic">
                      {template.footer_text}
                    </div>
                  )}
                </div>

                {/* Template info */}
                <div className="space-y-2 text-sm ">
                  <div className="flex justify-between">
                    <span>Language:</span>
                    <span className="font-medium">{template.language.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span>{formatDate(template.created_at)}</span>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* Preview button */}
                    <button
                      className="btn btn-sm btn-secondary"
                      title="Preview template"
                    >
                      <Eye className="w-3 h-3" />
                    </button>

                    {/* Edit button */}
                    {template.status === 'PENDING' && (
                      <button
                        className="btn btn-sm btn-secondary"
                        title="Edit template"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                    )}

                    {/* Delete button */}
                    {template.status !== 'APPROVED' && (
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="btn btn-sm btn-danger"
                        title="Delete template"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Submit for approval button */}
                  {template.status === 'PENDING' && (
                    <button
                      onClick={() => handleSubmitForApproval(template.id)}
                      className="btn btn-sm btn-primary flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      Submit
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="card-body text-center py-12">
            <div className="w-16 h-16  rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 " />
            </div>
            <h3 className="text-lg font-medium  mb-2">No templates found</h3>
            <p className=" mb-4">
              {templates.length === 0 
                ? "Create your first message template to get started"
                : "Try adjusting your search or filter criteria"
              }
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
            >
              Create Your First Template
            </button>
          </div>
        </div>
      )}

      {/* Create template modal placeholder */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="card-header">
              <h3 className="font-semibold ">Create New Template</h3>
            </div>
            <div className="card-body">
              <p className="">Template creation form will be implemented here.</p>
            </div>
            <div className="card-footer flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button className="btn btn-primary">
                Create Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates;