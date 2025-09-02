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
import { campaignService, contactService, templateService, tenantService, WABussinessService } from '../services/api';
import LoadingSpinner from '../components/loading-spinner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useQueryClient } from '@tanstack/react-query';

const Dashboard = () => {
 const queryClient = useQueryClient()
  const tenant = queryClient.getQueryData(["tenant"]);
  const user = queryClient.getQueryData(["session"]);
  const phone_numbers = queryClient.getQueryData(["phoneNumbers"]);
  const [stats, setStats] = useState({
    campaigns: { total: 0, active: 0, completed: 0 },
    contacts: { total: 0, opted_in: 0 },
    templates: { total: 0, approved: 0 }
  });
  const [recentCampaigns, setRecentCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  console.log(user);



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


  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-64">
  //       <LoadingSpinner size="lg" />
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold ">
            Welcome back, {user?.first_name || user?.last_name}!
          </h1>
          <p className=" mt-1">
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
        <Card className='py-3'>
          <CardHeader>
            <CardDescription>Total Campaigns</CardDescription>
            <CardTitle><h2>{stats?.campaigns.total}</h2></CardTitle>
          </CardHeader>
          <CardFooter> {stats?.campaigns.active} active, {stats.campaigns.completed} completed </CardFooter>

        </Card>

        <Card className='py-3'>
          <CardHeader>
            <CardDescription>Total Contacts</CardDescription>
            <CardTitle><h2>{stats?.contacts.total_contacts || 0}</h2></CardTitle>
          </CardHeader>
          <CardFooter>{stats?.contacts.opted_in_contacts || 0} opted in</CardFooter>
        </Card>

        <Card className='py-3'>
          <CardHeader>
            <CardDescription>Message Templates</CardDescription>
            <CardTitle><h2>{stats?.templates.total}</h2></CardTitle>
          </CardHeader>
          <CardFooter>{stats?.templates.approved} approved</CardFooter>
        </Card>

        <Card className='py-3'>
          <CardHeader>
            <CardDescription>Delivery Rate</CardDescription>
            <CardTitle><h2>{stats?.contacts.opt_in_rate || '0'}%</h2></CardTitle>
          </CardHeader>
          <CardFooter>Last 30 days</CardFooter>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick actions panel */}
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold ">Quick Actions</h3>
          </div>
          <div className="card-body space-y-3">
            <Link
              to="/campaigns"
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover: transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 -100 rounded-lg flex items-center justify-center">
                  <Plus className="w-4 h-4 text-primary-600" />
                </div>
                <span className="font-medium ">Create Campaign</span>
              </div>
              <ArrowRight className="w-4 h-4 " />
            </Link>

            <Link
              to="/templates"
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover: transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-success-600" />
                </div>
                <span className="font-medium ">Add Template</span>
              </div>
              <ArrowRight className="w-4 h-4 " />
            </Link>

            <Link
              to="/contacts"
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover: transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-warning-600" />
                </div>
                <span className="font-medium ">Import Contacts</span>
              </div>
              <ArrowRight className="w-4 h-4 " />
            </Link>
          </div>
        </div>

        {/* Recent campaigns */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header flex items-center justify-between">
              <h3 className="font-semibold ">Recent Campaigns</h3>
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
                        <h4 className="font-medium ">{campaign.name}</h4>
                        <p className="text-sm ">
                          Template: {campaign.template_name || 'Unknown'}
                        </p>
                        <p className="text-xs  mt-1">
                          Created: {new Date(campaign.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(campaign.status)}
                        <p className="text-xs  mt-1">
                          {campaign.messages_sent || 0} sent
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12  mx-auto mb-3" />
                  <p className="">No campaigns yet</p>
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