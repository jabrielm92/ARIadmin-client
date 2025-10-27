'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, ArrowLeft, Save, Rocket, Users } from 'lucide-react';

export default function AdminCreateCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  
  const [campaignData, setCampaignData] = useState({
    clientId: '',
    name: '',
    description: '',
    type: 'lead-capture',
    targetAudience: {
      industry: '',
      companySize: '',
      budget: ''
    },
    leadMagnet: {
      title: '',
      description: '',
      type: 'ebook'
    },
    form: {
      fields: [
        { name: 'name', label: 'Full Name', type: 'text', required: true },
        { name: 'email', label: 'Email Address', type: 'email', required: true },
        { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
        { name: 'company', label: 'Company Name', type: 'text', required: false }
      ],
      submitText: 'Get Your Free Resource',
      successMessage: 'Thank you! Check your email for your download link.'
    },
    autoResponder: {
      enabled: true,
      subject: 'Your Free Resource is Ready!',
      body: 'Hi {{name}},\n\nThank you for your interest! Your requested resource is ready.\n\nBest regards,\nThe Team'
    },
    settings: {
      leadScoring: true,
      autoQualify: false,
      notifyOnSubmit: true
    }
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients');
      const data = await response.json();
      
      if (data.success) {
        setClients(data.clients || []);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleSave = async (status) => {
    if (!campaignData.clientId) {
      alert('Please select a client');
      return;
    }
    
    if (!campaignData.name.trim()) {
      alert('Please enter a campaign name');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/client/lead-gen/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...campaignData,
          status: status
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert(status === 'draft' ? 'Campaign saved as draft!' : 'Campaign created! Now build the landing page.');
        router.push(`/admin/lead-gen/campaigns/${data.campaign.id}/builder`);
      } else {
        alert('Failed to create campaign: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/admin/lead-gen')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Create Campaign for Client</h1>
            <p className="text-muted-foreground">Set up a new lead generation campaign</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleSave('draft')} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button onClick={() => handleSave('draft')} disabled={loading}>
              <Rocket className="mr-2 h-4 w-4" />
              Create & Build Page
            </Button>
          </div>
        </div>

        {/* Client Selection */}
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>Select Client</CardTitle>
            <CardDescription>Choose which client this campaign is for</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="client">Client *</Label>
              <Select 
                value={campaignData.clientId} 
                onValueChange={(value) => setCampaignData({ ...campaignData, clientId: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a client..." />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {client.businessName}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {clients.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No clients found. <a href="/admin/clients/new" className="text-primary underline">Create a client first</a>
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>Basic campaign information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Q1 2025 Enterprise Lead Gen"
                value={campaignData.name}
                onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of this campaign..."
                value={campaignData.description}
                onChange={(e) => setCampaignData({ ...campaignData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Campaign Type</Label>
              <Select 
                value={campaignData.type} 
                onValueChange={(value) => setCampaignData({ ...campaignData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead-capture">Lead Capture</SelectItem>
                  <SelectItem value="lead-magnet">Lead Magnet</SelectItem>
                  <SelectItem value="webinar">Webinar Registration</SelectItem>
                  <SelectItem value="free-trial">Free Trial Signup</SelectItem>
                  <SelectItem value="consultation">Book Consultation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Target Audience */}
        <Card>
          <CardHeader>
            <CardTitle>Target Audience</CardTitle>
            <CardDescription>Who is this campaign targeting?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  placeholder="e.g., Healthcare"
                  value={campaignData.targetAudience.industry}
                  onChange={(e) => setCampaignData({
                    ...campaignData,
                    targetAudience: { ...campaignData.targetAudience, industry: e.target.value }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companySize">Company Size</Label>
                <Select 
                  value={campaignData.targetAudience.companySize}
                  onValueChange={(value) => setCampaignData({
                    ...campaignData,
                    targetAudience: { ...campaignData.targetAudience, companySize: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-1000">201-1000 employees</SelectItem>
                    <SelectItem value="1000+">1000+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget Range</Label>
                <Input
                  id="budget"
                  placeholder="e.g., $10k-$50k"
                  value={campaignData.targetAudience.budget}
                  onChange={(e) => setCampaignData({
                    ...campaignData,
                    targetAudience: { ...campaignData.targetAudience, budget: e.target.value }
                  })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lead Magnet */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Magnet / Offer</CardTitle>
            <CardDescription>What are you offering to capture leads?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="leadMagnetType">Type</Label>
              <Select 
                value={campaignData.leadMagnet.type}
                onValueChange={(value) => setCampaignData({
                  ...campaignData,
                  leadMagnet: { ...campaignData.leadMagnet, type: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ebook">eBook / Guide</SelectItem>
                  <SelectItem value="webinar">Webinar</SelectItem>
                  <SelectItem value="free-trial">Free Trial</SelectItem>
                  <SelectItem value="consultation">Free Consultation</SelectItem>
                  <SelectItem value="checklist">Checklist</SelectItem>
                  <SelectItem value="template">Template</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="leadMagnetTitle">Title</Label>
              <Input
                id="leadMagnetTitle"
                placeholder="e.g., The Ultimate Guide to Lead Generation"
                value={campaignData.leadMagnet.title}
                onChange={(e) => setCampaignData({
                  ...campaignData,
                  leadMagnet: { ...campaignData.leadMagnet, title: e.target.value }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="leadMagnetDescription">Description</Label>
              <Textarea
                id="leadMagnetDescription"
                placeholder="What value does this offer provide?"
                value={campaignData.leadMagnet.description}
                onChange={(e) => setCampaignData({
                  ...campaignData,
                  leadMagnet: { ...campaignData.leadMagnet, description: e.target.value }
                })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Next Steps Message */}
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Next Steps:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Click "Create & Build Page" to save this campaign</li>
              <li>You'll be taken to the Landing Page Builder</li>
              <li>Design the landing page, customize questions</li>
              <li>Test and publish the landing page</li>
              <li>Share the public URL with your client</li>
            </ol>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pb-8">
          <Button variant="outline" onClick={() => router.push('/admin/lead-gen')}>
            Cancel
          </Button>
          <Button onClick={() => handleSave('draft')} disabled={loading || !campaignData.clientId}>
            <Rocket className="mr-2 h-4 w-4" />
            Create & Build Landing Page
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
