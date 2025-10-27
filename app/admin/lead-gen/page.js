'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, TrendingUp, Users, DollarSign, Eye, Edit, PlayCircle, 
  PauseCircle, Search, BarChart3, AlertCircle, CheckCircle, XCircle
} from 'lucide-react';

export default function AdminLeadGenDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Mock data - in production, fetch from API
  const [allCampaigns, setAllCampaigns] = useState([
    {
      id: 'camp-1',
      name: 'Q1 2025 Enterprise Campaign',
      clientId: 'client-1',
      clientName: 'Tech Corp',
      status: 'active',
      stats: {
        views: 1250,
        submissions: 280,
        conversionRate: 22.4,
        leadsDelivered: 280,
        avgLeadScore: 82
      },
      createdAt: '2025-01-15'
    },
    {
      id: 'camp-2',
      name: 'Healthcare Lead Gen',
      clientId: 'client-2',
      clientName: 'MedCare Solutions',
      status: 'active',
      stats: {
        views: 890,
        submissions: 156,
        conversionRate: 17.5,
        leadsDelivered: 156,
        avgLeadScore: 75
      },
      createdAt: '2025-01-20'
    },
    {
      id: 'camp-3',
      name: 'B2B SaaS Campaign',
      clientId: 'client-3',
      clientName: 'CloudTech Inc',
      status: 'paused',
      stats: {
        views: 450,
        submissions: 89,
        conversionRate: 19.8,
        leadsDelivered: 89,
        avgLeadScore: 78
      },
      createdAt: '2025-01-10'
    }
  ]);

  const [pendingLeads, setPendingLeads] = useState([
    {
      id: 'lead-1',
      name: 'John Doe',
      email: 'john@techcorp.com',
      phone: '+1-555-0123',
      company: 'Tech Corp',
      campaignName: 'Q1 2025 Enterprise',
      clientName: 'Tech Corp',
      score: 85,
      status: 'pending-review',
      capturedAt: '2025-01-26T10:30:00Z'
    },
    {
      id: 'lead-2',
      name: 'Jane Smith',
      email: 'jane@healthcare.com',
      phone: '+1-555-0456',
      company: 'HealthCare Plus',
      campaignName: 'Healthcare Lead Gen',
      clientName: 'MedCare Solutions',
      score: 78,
      status: 'pending-review',
      capturedAt: '2025-01-26T11:15:00Z'
    }
  ]);

  useEffect(() => {
    // In production, fetch real data
    setLoading(false);
  }, []);

  // Calculate totals
  const totalCampaigns = allCampaigns.length;
  const activeCampaigns = allCampaigns.filter(c => c.status === 'active').length;
  const totalLeadsDelivered = allCampaigns.reduce((sum, c) => sum + c.stats.leadsDelivered, 0);
  const totalRevenue = totalLeadsDelivered * 150; // Assuming avg $150/lead
  const avgConversionRate = (allCampaigns.reduce((sum, c) => sum + c.stats.conversionRate, 0) / allCampaigns.length).toFixed(1);

  const handleApproveLead = async (leadId) => {
    // In production, POST to API
    alert(`Lead ${leadId} approved and delivered to client`);
    setPendingLeads(pendingLeads.filter(l => l.id !== leadId));
  };

  const handleRejectLead = async (leadId) => {
    if (!confirm('Are you sure you want to reject this lead?')) return;
    
    // In production, POST to API
    alert(`Lead ${leadId} rejected (invalid/spam)`);
    setPendingLeads(pendingLeads.filter(l => l.id !== leadId));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'draft': return 'bg-gray-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-lg">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Lead Generation Control Center</h1>
          <p className="text-muted-foreground">Manage all lead gen campaigns and lead delivery across clients</p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Campaigns</p>
                  <p className="text-3xl font-bold">{totalCampaigns}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activeCampaigns} active</p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Leads Delivered</p>
                  <p className="text-3xl font-bold">{totalLeadsDelivered}</p>
                  <p className="text-xs text-muted-foreground mt-1">All time</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Estimated</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Conv. Rate</p>
                  <p className="text-3xl font-bold">{avgConversionRate}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Performance</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="campaigns">All Campaigns</TabsTrigger>
            <TabsTrigger value="pending">
              Pending Review
              {pendingLeads.length > 0 && (
                <Badge className="ml-2 bg-red-500">{pendingLeads.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Pending Leads Alert */}
            {pendingLeads.length > 0 && (
              <Card className="border-orange-500">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    <CardTitle>Action Required</CardTitle>
                  </div>
                  <CardDescription>
                    {pendingLeads.length} lead{pendingLeads.length > 1 ? 's' : ''} pending your review before delivery
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setActiveTab('pending')}>
                    Review Pending Leads
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Recent Campaign Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Campaign Activity</CardTitle>
                <CardDescription>Top performing campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allCampaigns.slice(0, 3).map((campaign) => (
                    <div key={campaign.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold">{campaign.name}</h3>
                            <Badge className={getStatusColor(campaign.status)}>
                              {campaign.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {campaign.clientName} • Created {new Date(campaign.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/admin/clients/${campaign.clientId}/lead-gen`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-5 gap-4 text-center">
                        <div>
                          <p className="text-xs text-muted-foreground">Views</p>
                          <p className="text-lg font-bold">{campaign.stats.views}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Submissions</p>
                          <p className="text-lg font-bold">{campaign.stats.submissions}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Conv. Rate</p>
                          <p className="text-lg font-bold">{campaign.stats.conversionRate}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Delivered</p>
                          <p className="text-lg font-bold">{campaign.stats.leadsDelivered}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Avg Score</p>
                          <p className={`text-lg font-bold ${getScoreColor(campaign.stats.avgLeadScore)}`}>
                            {campaign.stats.avgLeadScore}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/admin/clients')}>
                <CardHeader>
                  <Users className="h-10 w-10 text-blue-500 mb-2" />
                  <CardTitle className="text-lg">Manage Clients</CardTitle>
                  <CardDescription>View all clients and their campaigns</CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/admin/leads')}>
                <CardHeader>
                  <Target className="h-10 w-10 text-green-500 mb-2" />
                  <CardTitle className="text-lg">All Leads</CardTitle>
                  <CardDescription>View and manage all captured leads</CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('analytics')}>
                <CardHeader>
                  <BarChart3 className="h-10 w-10 text-purple-500 mb-2" />
                  <CardTitle className="text-lg">Analytics</CardTitle>
                  <CardDescription>Performance metrics and reports</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>

          {/* All Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>All Campaigns</CardTitle>
                    <CardDescription>Manage campaigns across all clients</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search campaigns or clients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Conv. Rate</TableHead>
                      <TableHead>Leads</TableHead>
                      <TableHead>Avg Score</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allCampaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">{campaign.name}</TableCell>
                        <TableCell>{campaign.clientName}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(campaign.status)}>
                            {campaign.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{campaign.stats.conversionRate}%</TableCell>
                        <TableCell>{campaign.stats.leadsDelivered}</TableCell>
                        <TableCell>
                          <span className={`font-bold ${getScoreColor(campaign.stats.avgLeadScore)}`}>
                            {campaign.stats.avgLeadScore}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(campaign.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => router.push(`/admin/clients/${campaign.clientId}/lead-gen`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Review Tab */}
          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Leads Pending Review</CardTitle>
                <CardDescription>
                  Review and approve leads before delivery to clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingLeads.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-medium">All caught up!</p>
                    <p className="text-sm text-muted-foreground">No leads pending review</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingLeads.map((lead) => (
                      <div key={lead.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{lead.name}</h3>
                              <span className={`font-bold ${getScoreColor(lead.score)}`}>
                                Score: {lead.score}
                              </span>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-3 text-sm mb-3">
                              <div>
                                <span className="text-muted-foreground">Email:</span>
                                <span className="ml-2 font-medium">{lead.email}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Phone:</span>
                                <span className="ml-2 font-medium">{lead.phone}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Company:</span>
                                <span className="ml-2 font-medium">{lead.company}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Captured:</span>
                                <span className="ml-2 font-medium">
                                  {new Date(lead.capturedAt).toLocaleString()}
                                </span>
                              </div>
                            </div>

                            <div className="text-sm">
                              <span className="text-muted-foreground">Campaign:</span>
                              <span className="ml-2 font-medium">{lead.campaignName}</span>
                              <span className="mx-2">•</span>
                              <span className="text-muted-foreground">Client:</span>
                              <span className="ml-2 font-medium">{lead.clientName}</span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 ml-4">
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApproveLead(lead.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve & Deliver
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleRejectLead(lead.id)}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>Coming soon - comprehensive analytics dashboard</CardDescription>
              </CardHeader>
              <CardContent className="py-12 text-center">
                <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">Analytics Dashboard</p>
                <p className="text-sm text-muted-foreground">
                  Advanced analytics and reporting will be available in Phase 2
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
