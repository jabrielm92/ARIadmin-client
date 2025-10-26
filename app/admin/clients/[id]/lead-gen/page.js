'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TrendingUp, Mail, Zap, Target, ExternalLink, Settings } from 'lucide-react';

export default function AdminLeadGenPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState(null);

  useEffect(() => {
    fetchClient();
  }, [params.id]);

  const fetchClient = async () => {
    try {
      const response = await fetch(`/api/clients/${params.id}`);
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p>Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!client) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <p className="text-muted-foreground">Client not found</p>
          <Button onClick={() => router.push('/admin/clients')}>Back to Clients</Button>
        </div>
      </AdminLayout>
    );
  }

  const isEnabled = client.services?.leadGen?.enabled;
  const isSetupComplete = client.services?.leadGen?.setupComplete;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/admin/clients/${params.id}`)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">ARI Lead Gen Service</h1>
              <p className="text-muted-foreground">{client.businessName}</p>
            </div>
          </div>
          <Badge variant={isEnabled ? 'default' : 'secondary'}>
            {isEnabled ? 'Enabled' : 'Not Enabled'}
          </Badge>
        </div>

        {/* Status Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <p className="text-2xl font-bold">{isEnabled ? 'Active' : 'Inactive'}</p>
                </div>
                <Settings className={`h-8 w-8 ${isEnabled ? 'text-green-500' : 'text-gray-400'}`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Campaigns</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <Mail className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Leads Generated</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                  <p className="text-2xl font-bold">0%</p>
                </div>
                <Target className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon Notice */}
        <Card className="border-2 border-dashed">
          <CardContent className="p-12 text-center">
            <Zap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Phase 4: Coming Soon</h2>
            <p className="text-muted-foreground mb-6">
              The ARI Lead Gen Service will be implemented in Phase 4.
            </p>
            <p className="text-sm text-muted-foreground">
              Features will include:
            </p>
            <ul className="text-sm text-muted-foreground mt-4 space-y-2 max-w-md mx-auto">
              <li>• Campaign builder & management</li>
              <li>• Multi-channel outreach (Email, SMS, LinkedIn)</li>
              <li>• Lead scoring & qualification</li>
              <li>• Nurturing workflows & automation</li>
              <li>• Lead enrichment & segmentation</li>
              <li>• Analytics & ROI tracking</li>
            </ul>
          </CardContent>
        </Card>

        {/* Client Portal Link */}
        <Card>
          <CardHeader>
            <CardTitle>Client Access</CardTitle>
            <CardDescription>Client configuration portal (will be available in Phase 4)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-mono">/client/lead-gen</span>
              <Button variant="ghost" size="sm" disabled>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
