'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import configuration sections
import LandingPageSection from '@/components/booking-accelerator/LandingPageSection';
import FormBuilderSection from '@/components/booking-accelerator/FormBuilderSection';
import LeadQualificationSection from '@/components/booking-accelerator/LeadQualificationSection';
import CalendarIntegrationSection from '@/components/booking-accelerator/CalendarIntegrationSection';
import AutomationSection from '@/components/booking-accelerator/AutomationSection';
import LeadManagementSection from '@/components/booking-accelerator/LeadManagementSection';

export default function BookingAcceleratorConfigPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [client, setClient] = useState(null);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    fetchClientAndConfig();
  }, [params.id]);

  const fetchClientAndConfig = async () => {
    try {
      // Fetch client
      const clientRes = await fetch(`/api/clients/${params.id}`);
      const clientData = await clientRes.json();
      if (clientData.success) {
        setClient(clientData.client);
      }

      // Fetch Booking Accelerator config
      const configRes = await fetch(`/api/clients/${params.id}/booking-accelerator`);
      const configData = await configRes.json();
      if (configData.success) {
        setConfig(configData.config);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/clients/${params.id}/booking-accelerator`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Booking Accelerator configuration saved!',
        });
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to save configuration',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred',
        variant: 'destructive',
      });
    }
    setSaving(false);
  };

  const handlePreview = () => {
    // Open public booking page in new tab
    const publicUrl = config?.publicUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/book/${params.id}`;
    window.open(publicUrl, '_blank');
  };

  if (loading || !config) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-lg">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <Button variant="ghost" onClick={() => router.push(`/admin/clients/${params.id}/edit`)} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Client
            </Button>
            <h1 className="text-3xl font-bold">Appointment Booking Accelerator</h1>
            <p className="text-muted-foreground">
              Configure landing pages and lead capture for {client?.businessName}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="mr-2 h-4 w-4" />
              Preview Page
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save Configuration'}
            </Button>
          </div>
        </div>

        {/* Configuration Tabs */}
        <Tabs defaultValue="landing" className="w-full">
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
            <TabsTrigger value="landing">Landing Page</TabsTrigger>
            <TabsTrigger value="form">Form Builder</TabsTrigger>
            <TabsTrigger value="qualification">Qualification</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
          </TabsList>

          <TabsContent value="landing" className="space-y-4 mt-6">
            <LandingPageSection config={config} setConfig={setConfig} clientId={params.id} />
          </TabsContent>

          <TabsContent value="form" className="space-y-4 mt-6">
            <FormBuilderSection config={config} setConfig={setConfig} />
          </TabsContent>

          <TabsContent value="qualification" className="space-y-4 mt-6">
            <LeadQualificationSection config={config} setConfig={setConfig} />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4 mt-6">
            <CalendarIntegrationSection config={config} setConfig={setConfig} />
          </TabsContent>

          <TabsContent value="automation" className="space-y-4 mt-6">
            <AutomationSection config={config} setConfig={setConfig} />
          </TabsContent>

          <TabsContent value="leads" className="space-y-4 mt-6">
            <LeadManagementSection config={config} setConfig={setConfig} clientId={params.id} />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
