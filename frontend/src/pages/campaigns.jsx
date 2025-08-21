import { useState, useEffect } from 'react';
import { Plus, Play, Pause, Edit, Trash2, BarChart3, Search, Filter } from 'lucide-react';
import { campaignService } from '../services/api';
import LoadingSpinner from '../components/loading-spinner';

const Campaigns = ({ user }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  /**
   * Load campaigns on component mount
   */
  useEffect(() => {
    loadCampaigns();
  }, []);

  /**
   * Filter campaigns when search or filter changes
   */
  useEffect(() => {
    filterCampaigns();
  }, [campaigns, searchQuery, statusFilter]);

  /**
   * Fetch all campaigns from API
   */
  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const data = await campaignService.getCampaigns();
      setCampaigns(data);
    } catch (err) {
      setError('Failed to load campaigns');
      console.error('Campaign loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filter campaigns based on search query and status
   */
  const filterCampaigns = () => {
    let filtered = campaigns;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(campaign =>
        campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (campaign.template_name && campaign.template_name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(campaign => campaign.status === statusFilter);
    }

    setFilteredCampaigns(filtered);
  };

  /**
   * Handle campaign start/stop
   * @param {number} campaignId - Campaign ID
   * @param {string} action - Action to perform (start/stop)
   */
  const handleCampaignAction = async (campaignId, action) => {
    try {
      if (action === 'start') {
        await campaignService.startCampaign(campaignId);
      }
      // Reload campaigns to get updated status
      await loadCampaigns();
    } catch (err) {
      setError(`Failed to ${action} campaign: ${err.message}`);
    }
  };

  /**
   * Handle campaign deletion
   * @param {number} campaignId - Campaign ID
   */
  const handleDeleteCampaign = async (campaignId) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) {
      return;
    }

    try {
      await campaignService.deleteCampaign(campaignId);
      await loadCampaigns();
    } catch (err) {
      setError(`Failed to delete campaign: ${err.message}`);
    }
  };

  /**
   * Get status badge for campaign
   * @param {string} status - Campaign status
   */
  const getStatusBadge = (status) => {
    const statusConfig = {
      DRAFT: { color: 'gray', text: 'Draft' },
      RUNNING: { color: 'primary', text: 'Running' },
      COMPLETED: { color: 'success', text: 'Completed' },
      FAILED: { color: 'error', text: 'Failed' }
    };

    const config = statusConfig[status] || statusConfig.DRAFT;
    return <span className={`badge badge-${config.color}`}>{config.text}</span>;
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
          <h1 className="text-2xl font-bold ">Campaigns</h1>
          <p className=" mt-1">
            Create and manage your WhatsApp marketing campaigns
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Campaign
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
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 " />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input pl-10"
                />
              </div>
            </div>

            {/* Status filter */}
            <div className="md:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 " />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="form-select pl-10"
                >
                  <option value="ALL">All Status</option>
                  <option value="DRAFT">Draft</option>
                  <option value="RUNNING">Running</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns list */}
      <div className="card">
        <div className="card-body p-0">
          {filteredCampaigns.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Campaign Name</th>
                    <th>Template</th>
                    <th>Status</th>
                    <th>Messages</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCampaigns.map((campaign) => (
                    <tr key={campaign.id}>
                      <td>
                        <div>
                          <h4 className="font-medium ">{campaign.name}</h4>
                          {campaign.scheduled_at && (
                            <p className="text-sm ">
                              Scheduled: {formatDate(campaign.scheduled_at)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="text-sm ">
                          {campaign.template_name || 'N/A'}
                        </span>
                      </td>
                      <td>{getStatusBadge(campaign.status)}</td>
                      <td>
                        <div className="text-sm">
                          <p>{campaign.messages_sent || 0} sent</p>
                          <p className="">
                            {campaign.messages_delivered || 0} delivered
                          </p>
                        </div>
                      </td>
                      <td className="text-sm ">
                        {formatDate(campaign.created_at)}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          {/* Start/Stop button */}
                          {campaign.status === 'DRAFT' && (
                            <button
                              onClick={() => handleCampaignAction(campaign.id, 'start')}
                              className="btn btn-sm btn-success"
                              title="Start campaign"
                            >
                              <Play className="w-3 h-3" />
                            </button>
                          )}

                          {campaign.status === 'RUNNING' && (
                            <button
                              onClick={() => handleCampaignAction(campaign.id, 'stop')}
                              className="btn btn-sm btn-secondary"
                              title="Stop campaign"
                            >
                              <Pause className="w-3 h-3" />
                            </button>
                          )}

                          {/* Analytics button */}
                          <button
                            className="btn btn-sm btn-secondary"
                            title="View analytics"
                          >
                            <BarChart3 className="w-3 h-3" />
                          </button>

                          {/* Edit button */}
                          {campaign.status === 'DRAFT' && (
                            <button
                              className="btn btn-sm btn-secondary"
                              title="Edit campaign"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                          )}

                          {/* Delete button */}
                          {campaign.status !== 'RUNNING' && (
                            <button
                              onClick={() => handleDeleteCampaign(campaign.id)}
                              className="btn btn-sm btn-danger"
                              title="Delete campaign"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16  rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 " />
              </div>
              <h3 className="text-lg font-medium  mb-2">No campaigns found</h3>
              <p className=" mb-4">
                {campaigns.length === 0 
                  ? "Get started by creating your first campaign"
                  : "Try adjusting your search or filter criteria"
                }
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                Create Your First Campaign
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create campaign modal placeholder */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="card-header">
              <h3 className="font-semibold ">Create New Campaign</h3>
            </div>
            <div className="card-body">
              <p className="">Campaign creation form will be implemented here.</p>
            </div>
            <div className="card-footer flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button className="btn btn-primary">
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Campaigns;