'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft, Plus, Eye, Edit, PlayCircle, PauseCircle, TrendingUp, Users, Target, 
  Settings, Save
} from 'lucide-react';

export default function AdminClientLeadGenPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id;
  
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchClientData();
    fetchCampaigns();
  }, [clientId]);

  const fetchClientData = async () => {
    try {
      const response = await fetch(`/api/clients/${clientId}`);
      const data = await response.json();
      
      if (data.success) {
        setClient(data.client);
      }
    } catch (error) {
      console.error('Error fetching client:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await fetch(`/api/client/lead-gen/campaigns?clientId=${clientId}`);
      const data = await response.json();
      
      if (data.success) {
        setCampaigns(data.campaigns || []);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const handleToggleCampaignStatus = async (campaignId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    
    try {
      const response = await fetch(`/api/client/lead-gen/campaigns/${campaignId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchCampaigns();
        alert(`Campaign ${newStatus === 'active' ? 'activated' : 'paused'} successfully`);
      }
    } catch (error) {
      console.error('Error updating campaign:', error);
      alert('Failed to update campaign status');
    }
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

  if (!client) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-lg">Client not found</div>
        </div>
      </AdminLayout>
    );
  }

  // Calculate stats
  const totalViews = campaigns.reduce((sum, c) => sum + (c.stats?.views || 0), 0);
  const totalSubmissions = campaigns.reduce((sum, c) => sum + (c.stats?.submissions || 0), 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + (c.stats?.conversions || 0), 0);
  const avgConversionRate = campaigns.length > 0 
    ? (campaigns.reduce((sum, c) => sum + (c.stats?.conversionRate || 0), 0) / campaigns.length).toFixed(1)
    : 0;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'draft': return 'bg-gray-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push(`/admin/clients/${clientId}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Lead Generation - {client.businessName}</h1>
            <p className="text-muted-foreground">Manage lead gen campaigns and settings for this client</p>
          </div>
          <Button onClick={() => router.push('/admin/leads')}>
            <Eye className="mr-2 h-4 w-4" />
            View All Leads
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Campaigns</p>
                  <p className="text-3xl font-bold">{campaigns.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {campaigns.filter(c => c.status === 'active').length} active
                  </p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                  <p className="text-3xl font-bold">{totalViews}</p>
                  <p className="text-xs text-muted-foreground mt-1">Landing pages</p>
                </div>
                <Eye className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Submissions</p>
                  <p className="text-3xl font-bold">{totalSubmissions}</p>
                  <p className="text-xs text-muted-foreground mt-1">Form fills</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Conv. Rate</p>
                  <p className="text-3xl font-bold">{avgConversionRate}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Average</p>
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
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>Recent campaign activity for {client.businessName}</CardDescription>
              </CardHeader>
              <CardContent>
                {campaigns.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium">No campaigns yet</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Help this client set up their first lead generation campaign
                    </p>
                    <Button onClick={() => setActiveTab('campaigns')}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Campaign
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {campaigns.slice(0, 5).map((campaign) => (
                      <div 
                        key={campaign.id} 
                        className="border rounded-lg p-4 hover:border-primary transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold">{campaign.name}</h3>
                              <Badge className={getStatusColor(campaign.status)}>
                                {campaign.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{campaign.description}</p>
                            
                            <div className="grid grid-cols-4 gap-4">
                              <div>
                                <p className="text-xs text-muted-foreground">Views</p>
                                <p className="text-lg font-bold">{campaign.stats?.views || 0}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Submissions</p>
                                <p className="text-lg font-bold">{campaign.stats?.submissions || 0}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Conversions</p>
                                <p className="text-lg font-bold">{campaign.stats?.conversions || 0}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Conv. Rate</p>
                                <p className="text-lg font-bold">{campaign.stats?.conversionRate || 0}%</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 ml-4">
                            {campaign.status === 'active' ? (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleToggleCampaignStatus(campaign.id, campaign.status)}
                              >
                                <PauseCircle className="h-4 w-4" />
                              </Button>
                            ) : (campaign.status === 'paused' || campaign.status === 'draft') ? (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleToggleCampaignStatus(campaign.id, campaign.status)}
                              >
                                <PlayCircle className="h-4 w-4" />
                              </Button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common admin tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <Button 
                    variant="outline" 
                    className="h-24 flex flex-col items-center justify-center"
                    onClick={() => setActiveTab('campaigns')}
                  >
                    <Plus className="h-6 w-6 mb-2" />
                    Create New Campaign
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-24 flex flex-col items-center justify-center"
                    onClick={() => router.push(`/admin/clients/${clientId}/leads`)}
                  >
                    <Users className="h-6 w-6 mb-2" />
                    View Client Leads
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-24 flex flex-col items-center justify-center"
                    onClick={() => setActiveTab('settings')}
                  >
                    <Settings className="h-6 w-6 mb-2" />
                    Configure Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>All Campaigns</CardTitle>
                    <CardDescription>Manage campaigns for {client.businessName}</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    New Campaign
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {campaigns.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium">No campaigns created</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Campaign Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead>Submissions</TableHead>
                        <TableHead>Conv. Rate</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {campaigns.map((campaign) => (
                        <TableRow key={campaign.id}>
                          <TableCell className="font-medium">{campaign.name}</TableCell>
                          <TableCell className="capitalize">{campaign.type?.replace('-', ' ')}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(campaign.status)}>
                              {campaign.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{campaign.stats?.views || 0}</TableCell>
                          <TableCell>{campaign.stats?.submissions || 0}</TableCell>
                          <TableCell>{campaign.stats?.conversionRate || 0}%</TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {new Date(campaign.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
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
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Lead Generation Settings</CardTitle>
                <CardDescription>Configure lead gen defaults for {client.businessName}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Lead Generation</Label>
                      <p className="text-sm text-muted-foreground">Allow this client to create campaigns</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto Lead Scoring</Label>
                      <p className="text-sm text-muted-foreground">Automatically score incoming leads</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Notify client on new leads</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Monthly Campaign Limit</Label>
                  <Select defaultValue="unlimited">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 campaigns</SelectItem>
                      <SelectItem value="10">10 campaigns</SelectItem>
                      <SelectItem value="25">25 campaigns</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Default Lead Assignment</Label>
                  <Input placeholder="email@example.com" />
                  <p className="text-xs text-muted-foreground">
                    Email address to assign new leads to
                  </p>
                </div>

                <div className="pt-4">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
