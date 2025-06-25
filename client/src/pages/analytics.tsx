import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  MessageSquare, 
  CheckCircle, 
  Reply, 
  DollarSign,
  Clock,
  Users,
  Target
} from "lucide-react";

const AnalyticsPage = () => {
  // Fetch analytics data
  const { data: dashboardStats } = useQuery({
    queryKey: ["/api/analytics/dashboard"],
  });

  const { data: campaignStats = [] } = useQuery({
    queryKey: ["/api/analytics/campaigns"],
  });

  // Mock data for charts (in a real app, this would come from the API)
  const messageVolumeData = [
    { date: "Mon", sent: 120, delivered: 115, failed: 5 },
    { date: "Tue", sent: 145, delivered: 140, failed: 5 },
    { date: "Wed", sent: 180, delivered: 175, failed: 5 },
    { date: "Thu", sent: 220, delivered: 210, failed: 10 },
    { date: "Fri", sent: 195, delivered: 185, failed: 10 },
    { date: "Sat", sent: 165, delivered: 160, failed: 5 },
    { date: "Sun", sent: 135, delivered: 130, failed: 5 },
  ];

  const responseTimeData = [
    { hour: "00:00", responses: 5 },
    { hour: "06:00", responses: 15 },
    { hour: "09:00", responses: 45 },
    { hour: "12:00", responses: 65 },
    { hour: "15:00", responses: 55 },
    { hour: "18:00", responses: 75 },
    { hour: "21:00", responses: 35 },
  ];

  const campaignTypeData = [
    { name: "Marketing", value: 60, color: "#3B82F6" },
    { name: "Utility", value: 30, color: "#10B981" },
    { name: "Authentication", value: 10, color: "#8B5CF6" },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Total Messages</h3>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="text-blue-600" size={20} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Sent</span>
                <span className="text-sm font-medium">{dashboardStats?.totalMessagesSent || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">This Month</span>
                <span className="text-sm font-medium text-green-600">+12.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Delivery Rate</h3>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600" size={20} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Current</span>
                <span className="text-sm font-medium">
                  {formatPercentage(dashboardStats?.deliveryRate || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Target</span>
                <span className="text-sm font-medium text-green-600">95.0%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Response Rate</h3>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Reply className="text-purple-600" size={20} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Average</span>
                <span className="text-sm font-medium">
                  {formatPercentage(dashboardStats?.responseRate || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Best Campaign</span>
                <span className="text-sm font-medium text-purple-600">45.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Cost Analysis</h3>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-yellow-600" size={20} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Per Message</span>
                <span className="text-sm font-medium">{formatCurrency(0.05)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Monthly Budget</span>
                <span className="text-sm font-medium text-blue-600">{formatCurrency(1500)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Message Volume Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp size={20} />
              <span>Message Volume</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={messageVolumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sent" fill="#3B82F6" name="Sent" />
                <Bar dataKey="delivered" fill="#10B981" name="Delivered" />
                <Bar dataKey="failed" fill="#EF4444" name="Failed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Response Time Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock size={20} />
              <span>Response Pattern</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="responses" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  name="Responses"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance & Distribution */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Campaign Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target size={20} />
              <span>Campaign Types</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={campaignTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {campaignTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Performing Campaigns */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Performing Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            {campaignStats.length === 0 ? (
              <div className="text-center py-8">
                <BarChart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No campaign data available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {campaignStats.slice(0, 5).map((campaign: any, index: number) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                        <p className="text-sm text-gray-500">
                          {campaign.sentCount} messages sent
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatPercentage(campaign.deliveryRate)}
                      </p>
                      <p className="text-xs text-gray-500">delivery rate</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Engagement Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Click-through Rate</span>
                <span className="text-sm font-medium">24.3%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Conversion Rate</span>
                <span className="text-sm font-medium">8.7%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Unsubscribe Rate</span>
                <span className="text-sm font-medium">0.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Bounce Rate</span>
                <span className="text-sm font-medium">1.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Messages vs Last Month</span>
                <span className="text-sm font-medium text-green-600">+18.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Delivery vs Last Month</span>
                <span className="text-sm font-medium text-green-600">+2.1%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Response vs Last Month</span>
                <span className="text-sm font-medium text-green-600">+5.3%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cost vs Last Month</span>
                <span className="text-sm font-medium text-red-600">+12.1%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
