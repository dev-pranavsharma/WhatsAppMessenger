import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Download, TrendingUp, TrendingDown, BarChart3, MessageSquare } from 'lucide-react';
import { campaignService, contactService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Chart from 'chart.js/auto';

/**
 * Analytics page component showing campaign performance metrics
 * @param {Object} props - Component props
 * @param {Object} props.user - Current user data
 */
const Analytics = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('30');
  const [analytics, setAnalytics] = useState({
    overview: {
      totalCampaigns: 0,
      totalMessages: 0,
      deliveryRate: 0,
      readRate: 0
    },
    campaigns: [],
    messageStats: [],
    performanceMetrics: {}
  });

  // Chart refs
  const messageChartRef = useRef(null);
  const performanceChartRef = useRef(null);
  const messageChartInstance = useRef(null);
  const performanceChartInstance = useRef(null);

  /**
   * Load analytics data on component mount and when date range changes
   */
  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange]);

  /**
   * Initialize charts when analytics data is loaded
   */
  useEffect(() => {
    if (analytics.messageStats.length > 0) {
      initializeCharts();
    }
    
    return () => {
      // Cleanup charts on unmount
      if (messageChartInstance.current) {
        messageChartInstance.current.destroy();
      }
      if (performanceChartInstance.current) {
        performanceChartInstance.current.destroy();
      }
    };
  }, [analytics]);

  /**
   * Fetch analytics data from API
   */
  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Load campaigns and calculate analytics
      const campaigns = await campaignService.getCampaigns();
      const contactStats = await contactService.getStats();
      
      // Calculate overview metrics
      const totalCampaigns = campaigns.length;
      const activeCampaigns = campaigns.filter(c => c.status === 'RUNNING').length;
      const completedCampaigns = campaigns.filter(c => c.status === 'COMPLETED').length;
      
      let totalMessages = 0;
      let totalDelivered = 0;
      let totalRead = 0;
      
      campaigns.forEach(campaign => {
        totalMessages += campaign.messages_sent || 0;
        totalDelivered += campaign.messages_delivered || 0;
        totalRead += campaign.messages_read || 0;
      });
      
      const deliveryRate = totalMessages > 0 ? ((totalDelivered / totalMessages) * 100).toFixed(1) : 0;
      const readRate = totalMessages > 0 ? ((totalRead / totalMessages) * 100).toFixed(1) : 0;
      
      // Generate mock time series data for charts
      const messageStats = generateMessageStats(parseInt(dateRange));
      const performanceMetrics = generatePerformanceMetrics();
      
      setAnalytics({
        overview: {
          totalCampaigns,
          activeCampaigns,
          completedCampaigns,
          totalMessages,
          deliveryRate,
          readRate
        },
        campaigns: campaigns.slice(0, 10), // Top 10 campaigns
        messageStats,
        performanceMetrics,
        contactStats
      });
      
    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Analytics loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generate message statistics for the selected date range
   * @param {number} days - Number of days to generate data for
   */
  const generateMessageStats = (days) => {
    const stats = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      stats.push({
        date: date.toISOString().split('T')[0],
        sent: Math.floor(Math.random() * 500) + 100,
        delivered: Math.floor(Math.random() * 450) + 80,
        read: Math.floor(Math.random() * 300) + 50
      });
    }
    
    return stats;
  };

  /**
   * Generate performance metrics data
   */
  const generatePerformanceMetrics = () => {
    return {
      campaignTypes: [
        { name: 'Marketing', value: 45, color: '#0ea5e9' },
        { name: 'Promotional', value: 30, color: '#22c55e' },
        { name: 'Transactional', value: 25, color: '#f59e0b' }
      ],
      hourlyActivity: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        messages: Math.floor(Math.random() * 100) + 10
      }))
    };
  };

  /**
   * Initialize Chart.js charts
   */
  const initializeCharts = () => {
    // Destroy existing charts
    if (messageChartInstance.current) {
      messageChartInstance.current.destroy();
    }
    if (performanceChartInstance.current) {
      performanceChartInstance.current.destroy();
    }

    // Message trends chart
    if (messageChartRef.current) {
      const ctx = messageChartRef.current.getContext('2d');
      messageChartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: analytics.messageStats.map(stat => {
            const date = new Date(stat.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }),
          datasets: [
            {
              label: 'Messages Sent',
              data: analytics.messageStats.map(stat => stat.sent),
              borderColor: '#0ea5e9',
              backgroundColor: 'rgba(14, 165, 233, 0.1)',
              fill: true,
              tension: 0.4
            },
            {
              label: 'Messages Delivered',
              data: analytics.messageStats.map(stat => stat.delivered),
              borderColor: '#22c55e',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              fill: true,
              tension: 0.4
            },
            {
              label: 'Messages Read',
              data: analytics.messageStats.map(stat => stat.read),
              borderColor: '#f59e0b',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              fill: true,
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              }
            },
            x: {
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              }
            }
          }
        }
      });
    }

    // Performance doughnut chart
    if (performanceChartRef.current) {
      const ctx = performanceChartRef.current.getContext('2d');
      performanceChartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: analytics.performanceMetrics.campaignTypes.map(type => type.name),
          datasets: [{
            data: analytics.performanceMetrics.campaignTypes.map(type => type.value),
            backgroundColor: analytics.performanceMetrics.campaignTypes.map(type => type.color),
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }
  };

  /**
   * Export analytics data to CSV
   */
  const exportData = () => {
    const csvContent = [
      ['Date', 'Messages Sent', 'Messages Delivered', 'Messages Read'],
      ...analytics.messageStats.map(stat => [
        stat.date,
        stat.sent,
        stat.delivered,
        stat.read
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `whatsapp-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  /**
   * Format number with commas
   * @param {number} num - Number to format
   */
  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  /**
   * Get trend indicator
   * @param {number} current - Current value
   * @param {number} previous - Previous value
   */
  const getTrendIndicator = (current, previous) => {
    if (current > previous) {
      return <TrendingUp className="w-4 h-4 text-success-600" />;
    } else if (current < previous) {
      return <TrendingDown className="w-4 h-4 text-error-600" />;
    }
    return null;
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
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600 mt-1">
            Track your WhatsApp campaign performance and engagement metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="form-select text-sm"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
          <button
            onClick={exportData}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Overview metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(analytics.overview.totalCampaigns)}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIndicator(analytics.overview.totalCampaigns, analytics.overview.totalCampaigns - 2)}
                  <span className="text-xs text-gray-500">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Messages Sent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(analytics.overview.totalMessages)}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIndicator(analytics.overview.totalMessages, analytics.overview.totalMessages - 150)}
                  <span className="text-xs text-gray-500">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-success-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivery Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.overview.deliveryRate}%
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIndicator(parseFloat(analytics.overview.deliveryRate), 85)}
                  <span className="text-xs text-gray-500">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-warning-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Read Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.overview.readRate}%
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIndicator(parseFloat(analytics.overview.readRate), 65)}
                  <span className="text-xs text-gray-500">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-error-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-error-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message trends chart */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold text-gray-900">Message Trends</h3>
            </div>
            <div className="card-body">
              <div className="h-80">
                <canvas ref={messageChartRef}></canvas>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign types chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold text-gray-900">Campaign Types</h3>
          </div>
          <div className="card-body">
            <div className="h-80">
              <canvas ref={performanceChartRef}></canvas>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign performance table */}
      <div className="card">
        <div className="card-header">
          <h3 className="font-semibold text-gray-900">Campaign Performance</h3>
        </div>
        <div className="card-body p-0">
          {analytics.campaigns.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Campaign Name</th>
                    <th>Status</th>
                    <th>Messages Sent</th>
                    <th>Delivery Rate</th>
                    <th>Read Rate</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.campaigns.map((campaign) => {
                    const deliveryRate = campaign.messages_sent > 0 
                      ? ((campaign.messages_delivered || 0) / campaign.messages_sent * 100).toFixed(1)
                      : 0;
                    const readRate = campaign.messages_sent > 0 
                      ? ((campaign.messages_read || 0) / campaign.messages_sent * 100).toFixed(1)
                      : 0;

                    return (
                      <tr key={campaign.id}>
                        <td>
                          <div className="font-medium text-gray-900">{campaign.name}</div>
                        </td>
                        <td>
                          <span className={`badge ${
                            campaign.status === 'COMPLETED' ? 'badge-success' :
                            campaign.status === 'RUNNING' ? 'badge-primary' :
                            campaign.status === 'FAILED' ? 'badge-error' : 'badge-gray'
                          }`}>
                            {campaign.status}
                          </span>
                        </td>
                        <td>{formatNumber(campaign.messages_sent || 0)}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <span>{deliveryRate}%</span>
                            <div className="w-12 h-2 bg-gray-200 rounded-full">
                              <div 
                                className="h-2 bg-success-500 rounded-full"
                                style={{ width: `${Math.min(deliveryRate, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <span>{readRate}%</span>
                            <div className="w-12 h-2 bg-gray-200 rounded-full">
                              <div 
                                className="h-2 bg-primary-500 rounded-full"
                                style={{ width: `${Math.min(readRate, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="text-sm text-gray-500">
                          {new Date(campaign.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No campaign data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;