import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Users, 
  FileText, 
  BarChart3, 
  Plus, 
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { campaignService, contactService, templateService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * Dashboard page component showing overview and quick actions
 * @param {Object} props - Component props
 * @param {Object} props.user - Current user data
 */
const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    campaigns: { total: 0, active: 0, completed: 0 },
    contacts: { total: 0, opted_in: 0 },
    templates: { total: 0, approved: 0 }
  });
  const [recentCampaigns, setRecentCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * Load dashboard data on component mount
   */
  useEffect(() => {
    loadDashboardData();
  }, []);

  /**
   * Fetch all dashboard data
   */
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load dashboard statistics
      const [campaigns, contacts, templates] = await Promise.all([
        campaignService.getCampaigns(),
        contactService.getStats(),
        templateService.getTemplates()
      ]);

      // Process campaign statistics
      const campaignStats = {
        total: campaigns.length,
        active: campaigns.filter(c => c.status === 'RUNNING').length,
        completed: campaigns.filter(c => c.status === 'COMPLETED').length
      };

      // Process template statistics
      const templateStats = {
        total: templates.length,
        approved: templates.filter(t => t.status === 'APPROVED').length
      };

      setStats({
        campaigns: campaignStats,
        contacts: contacts,
        templates: templateStats
      });

      // Set recent campaigns (last 5)
      setRecentCampaigns(campaigns.slice(0, 5));

    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get status badge for campaign
   * @param {string} status - Campaign status
   * @returns {JSX.Element} Status badge component
   */
  const getStatusBadge = (status) => {
    const statusConfig = {
      DRAFT: { color: 'gray', icon: Clock, text: 'Draft' },
      RUNNING: { color: 'primary', icon: TrendingUp, text: 'Running' },
      COMPLETED: { color: 'success', icon: CheckCircle, text: 'Completed' },
      FAILED: { color: 'error', icon: AlertCircle, text: 'Failed' }
    };

    const config = statusConfig[status] || statusConfig.DRAFT;
    const IconComponent = config.icon;

    return (
      <span className={`badge badge-${config.color} flex items-center gap-1`}>
        <IconComponent className="w-3 h-3" />
        {config.text}
      </span>
    );
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
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.business_name || user?.username}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's an overview of your WhatsApp campaign performance
          </p>
        </div>

        {/* WhatsApp connection status */}
        <div className="flex items-center gap-3">
          {user?.is_verified ? (
            <div className="flex items-center gap-2 px-3 py-2 bg-success-50 border border-success-200 rounded-lg">
              <CheckCircle className="w-4 h-4 text-success-600" />
              <span className="text-success-700 text-sm font-medium">WhatsApp Connected</span>
            </div>
          ) : (
            <Link
              to="/settings"
              className="flex items-center gap-2 px-3 py-2 bg-warning-50 border border-warning-200 rounded-lg hover:bg-warning-100 transition-colors"
            >
              <AlertCircle className="w-4 h-4 text-warning-600" />
              <span className="text-warning-700 text-sm font-medium">Setup WhatsApp</span>
            </Link>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Campaigns stats */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{stats.campaigns.total}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.campaigns.active} active, {stats.campaigns.completed} completed
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Contacts stats */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Contacts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.contacts.total_contacts || 0}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.contacts.opted_in_contacts || 0} opted in
                </p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-success-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Templates stats */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Message Templates</p>
                <p className="text-2xl font-bold text-gray-900">{stats.templates.total}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.templates.approved} approved
                </p>
              </div>
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-warning-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Performance stats */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivery Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.contacts.opt_in_rate || '0'}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Last 30 days
                </p>
              </div>
              <div className="w-12 h-12 bg-error-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-error-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick actions panel */}
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="card-body space-y-3">
            <Link
              to="/campaigns"
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-4 h-4 text-primary-600" />
                </div>
                <span className="font-medium text-gray-900">Create Campaign</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              to="/templates"
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-success-600" />
                </div>
                <span className="font-medium text-gray-900">Add Template</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              to="/contacts"
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-warning-600" />
                </div>
                <span className="font-medium text-gray-900">Import Contacts</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
          </div>
        </div>

        {/* Recent campaigns */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Recent Campaigns</h3>
              <Link
                to="/campaigns"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View all
              </Link>
            </div>
            <div className="card-body">
              {recentCampaigns.length > 0 ? (
                <div className="space-y-3">
                  {recentCampaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                        <p className="text-sm text-gray-500">
                          Template: {campaign.template_name || 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Created: {new Date(campaign.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(campaign.status)}
                        <p className="text-xs text-gray-500 mt-1">
                          {campaign.messages_sent || 0} sent
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No campaigns yet</p>
                  <Link
                    to="/campaigns"
                    className="btn btn-primary btn-sm mt-3"
                  >
                    Create Your First Campaign
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;