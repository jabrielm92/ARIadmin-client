'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ClientLayout from '@/components/ClientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Target, Zap, BarChart3, Settings, Plus, Eye, PlayCircle, PauseCircle, Edit } from 'lucide-react';

export default function ClientLeadGenPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('clientToken');
    const userStr = localStorage.getItem('clientUser');
    
    if (!token || !userStr) {
      router.push('/client/login');
      return;
    }
    
    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
      fetchCampaigns(userData.clientId);
    } catch (error) {
      router.push('/client/login');
    }
  }, [router]);

  const fetchCampaigns = async (clientId) => {
    try {
      const response = await fetch(`/api/client/lead-gen/campaigns?clientId=${clientId}`);
      const data = await response.json();
      
      if (data.success) {
        setCampaigns(data.campaigns || []);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Calculate stats from campaigns
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
    <ClientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Lead Generation</h1>
            <p className="text-muted-foreground">Create and manage your lead generation campaigns</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => router.push('/client/lead-gen/settings')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button onClick={() => router.push('/client/lead-gen/campaigns/new')}>
              <Plus className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                  <p className="text-3xl font-bold">{totalViews}</p>
                  <p className="text-xs text-muted-foreground mt-1">All campaigns</p>
                </div>
                <Eye className="h-8 w-8 text-blue-500" />
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
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Conversions</p>
                  <p className="text-3xl font-bold">{totalConversions}</p>
                  <p className="text-xs text-muted-foreground mt-1">Qualified leads</p>
                </div>
                <Target className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Conv. Rate</p>
                  <p className="text-3xl font-bold">{avgConversionRate}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Performance</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/client/lead-gen/campaigns/new')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Zap className="h-10 w-10 text-blue-500" />
                <Plus className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardTitle className="text-lg">Create Campaign</CardTitle>
              <CardDescription>Launch a new lead generation campaign with custom forms and landing pages</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/client/leads')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Users className="h-10 w-10 text-green-500" />
                <Eye className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardTitle className="text-lg">View Leads</CardTitle>
              <CardDescription>Manage all captured leads from your campaigns and other sources</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/client/analytics')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <BarChart3 className="h-10 w-10 text-purple-500" />
                <Eye className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardTitle className="text-lg">Analytics</CardTitle>
              <CardDescription>Track performance metrics and ROI across all your campaigns</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Active Campaigns */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Active Campaigns</CardTitle>
                <CardDescription>Manage your lead generation campaigns</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/client/lead-gen/campaigns')}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {campaigns.length === 0 ? (
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">No campaigns yet</p>
                <p className="text-sm text-muted-foreground mb-4">Create your first lead generation campaign to get started</p>
                <Button onClick={() => router.push('/client/lead-gen/campaigns/new')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {campaigns.slice(0, 5).map((campaign) => (
                  <div 
                    key={campaign.id} 
                    className="border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
                    onClick={() => router.push(`/client/lead-gen/campaigns/${campaign.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{campaign.name}</h3>
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
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/client/lead-gen/campaigns/${campaign.id}/edit`);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {campaign.status === 'active' ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Pause campaign logic
                            }}
                          >
                            <PauseCircle className="h-4 w-4" />
                          </Button>
                        ) : campaign.status === 'paused' || campaign.status === 'draft' ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Activate campaign logic
                            }}
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
      </div>
    </ClientLayout>
  );
}
