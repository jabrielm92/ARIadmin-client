'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import configuration sections
import BasicInfoSection from '@/components/ai-receptionist/BasicInfoSection';
import VoicePersonalitySection from '@/components/ai-receptionist/VoicePersonalitySection';
import KnowledgeBaseSection from '@/components/ai-receptionist/KnowledgeBaseSection';
import CallRoutingSection from '@/components/ai-receptionist/CallRoutingSection';
import AppointmentBookingSection from '@/components/ai-receptionist/AppointmentBookingSection';
import QuoteGenerationSection from '@/components/ai-receptionist/QuoteGenerationSection';
import PhoneNumberSection from '@/components/ai-receptionist/PhoneNumberSection';
import IntegrationsSection from '@/components/ai-receptionist/IntegrationsSection';

export default function AIReceptionistConfigPage() {
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

      // Fetch AI config
      const configRes = await fetch(`/api/clients/${params.id}/ai-receptionist`);
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
      const response = await fetch(`/api/clients/${params.id}/ai-receptionist`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Success',
          description: 'AI Receptionist configuration saved!',
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
            <h1 className="text-3xl font-bold">AI Virtual Receptionist</h1>
            <p className="text-muted-foreground">
              Configure voice AI for {client?.businessName}
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>

        {/* Configuration Tabs */}
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="voice">Voice</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
            <TabsTrigger value="routing">Routing</TabsTrigger>
            <TabsTrigger value="booking">Booking</TabsTrigger>
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
            <TabsTrigger value="phone">Phone</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-6">
            <BasicInfoSection config={config} setConfig={setConfig} />
          </TabsContent>

          <TabsContent value="voice" className="space-y-4 mt-6">
            <VoicePersonalitySection config={config} setConfig={setConfig} />
          </TabsContent>

          <TabsContent value="knowledge" className="space-y-4 mt-6">
            <KnowledgeBaseSection config={config} setConfig={setConfig} />
          </TabsContent>

          <TabsContent value="routing" className="space-y-4 mt-6">
            <CallRoutingSection config={config} setConfig={setConfig} />
          </TabsContent>

          <TabsContent value="booking" className="space-y-4 mt-6">
            <AppointmentBookingSection config={config} setConfig={setConfig} />
          </TabsContent>

          <TabsContent value="quotes" className="space-y-4 mt-6">
            <QuoteGenerationSection config={config} setConfig={setConfig} />
          </TabsContent>

          <TabsContent value="phone" className="space-y-4 mt-6">
            <PhoneNumberSection config={config} setConfig={setConfig} />
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4 mt-6">
            <IntegrationsSection config={config} setConfig={setConfig} />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
