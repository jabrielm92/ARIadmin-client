'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ClientLayout from '@/components/ClientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Rocket } from 'lucide-react';

export default function NewCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  
  const [campaignData, setCampaignData] = useState({
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
      type: 'ebook' // ebook, webinar, free-trial, consultation
    },
    form: {
      fields: [
        { name: 'name', label: 'Full Name', type: 'text', required: true },
        { name: 'email', label: 'Email Address', type: 'email', required: true },
        { name: 'phone', label: 'Phone Number', type: 'tel', required: false },
        { name: 'company', label: 'Company Name', type: 'text', required: false }
      ],
      submitText: 'Get Your Free Resource',
      successMessage: 'Thank you! Check your email for your download link.'
    },
    autoResponder: {
      enabled: true,
      subject: 'Your Free Resource is Ready!',
      body: 'Hi {{name}},\n\nThank you for your interest! Your requested resource is attached.\n\nBest regards,\nYour Team'
    },
    settings: {
      leadScoring: true,
      autoQualify: false,
      assignToSalesRep: null,
      notifyOnSubmit: true
    }
  });

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
    } catch (error) {
      router.push('/client/login');
    }
  }, [router]);

  const handleChange = (field, value) => {
    setCampaignData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setCampaignData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleSaveDraft = async () => {
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
          clientId: user.clientId,
          status: 'draft'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Campaign saved as draft!');
        router.push('/client/lead-gen/campaigns');
      } else {
        alert('Failed to save campaign: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving campaign:', error);
      alert('Failed to save campaign');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
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
          clientId: user.clientId,
          status: 'active'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Campaign published successfully!');
        router.push('/client/lead-gen/campaigns');
      } else {
        alert('Failed to publish campaign: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error publishing campaign:', error);
      alert('Failed to publish campaign');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <ClientLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Create New Campaign</h1>
            <p className="text-muted-foreground">Set up your lead generation campaign</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSaveDraft} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button onClick={handlePublish} disabled={loading}>
              <Rocket className="mr-2 h-4 w-4" />
              Publish
            </Button>
          </div>
        </div>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Campaign details and settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Q1 2025 Lead Generation"
                value={campaignData.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of this campaign..."
                value={campaignData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Campaign Type</Label>
              <Select 
                value={campaignData.type} 
                onValueChange={(value) => handleChange('type', value)}
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
            <CardDescription>Define who this campaign is for</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  placeholder="e.g., Healthcare"
                  value={campaignData.targetAudience.industry}
                  onChange={(e) => handleNestedChange('targetAudience', 'industry', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companySize">Company Size</Label>
                <Select 
                  value={campaignData.targetAudience.companySize}
                  onValueChange={(value) => handleNestedChange('targetAudience', 'companySize', value)}
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
                  onChange={(e) => handleNestedChange('targetAudience', 'budget', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lead Magnet */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Magnet</CardTitle>
            <CardDescription>The offer that attracts leads</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="leadMagnetType">Type</Label>
              <Select 
                value={campaignData.leadMagnet.type}
                onValueChange={(value) => handleNestedChange('leadMagnet', 'type', value)}
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
                placeholder="e.g., The Ultimate Guide to AI Virtual Receptionists"
                value={campaignData.leadMagnet.title}
                onChange={(e) => handleNestedChange('leadMagnet', 'title', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="leadMagnetDescription">Description</Label>
              <Textarea
                id="leadMagnetDescription"
                placeholder="What value does this offer provide?"
                value={campaignData.leadMagnet.description}
                onChange={(e) => handleNestedChange('leadMagnet', 'description', e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Form Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Capture Form</CardTitle>
            <CardDescription>Default fields: Name, Email, Phone, Company</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="submitText">Submit Button Text</Label>
              <Input
                id="submitText"
                placeholder="e.g., Get Your Free Guide"
                value={campaignData.form.submitText}
                onChange={(e) => handleNestedChange('form', 'submitText', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="successMessage">Success Message</Label>
              <Textarea
                id="successMessage"
                placeholder="Message shown after submission"
                value={campaignData.form.successMessage}
                onChange={(e) => handleNestedChange('form', 'successMessage', e.target.value)}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Auto-responder */}
        <Card>
          <CardHeader>
            <CardTitle>Email Auto-responder</CardTitle>
            <CardDescription>Automatic email sent to new leads</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Auto-responder</Label>
                <p className="text-sm text-muted-foreground">Send automatic welcome email</p>
              </div>
              <Switch
                checked={campaignData.autoResponder.enabled}
                onCheckedChange={(checked) => handleNestedChange('autoResponder', 'enabled', checked)}
              />
            </div>

            {campaignData.autoResponder.enabled && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="emailSubject">Email Subject</Label>
                  <Input
                    id="emailSubject"
                    placeholder="Email subject line"
                    value={campaignData.autoResponder.subject}
                    onChange={(e) => handleNestedChange('autoResponder', 'subject', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailBody">Email Body</Label>
                  <Textarea
                    id="emailBody"
                    placeholder="Use {{name}}, {{email}}, etc. for personalization"
                    value={campaignData.autoResponder.body}
                    onChange={(e) => handleNestedChange('autoResponder', 'body', e.target.value)}
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground">
                    Available variables: {`{{name}}, {{email}}, {{phone}}, {{company}}`}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Settings</CardTitle>
            <CardDescription>Additional configuration options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Lead Scoring</Label>
                <p className="text-sm text-muted-foreground">Automatically score leads</p>
              </div>
              <Switch
                checked={campaignData.settings.leadScoring}
                onCheckedChange={(checked) => handleNestedChange('settings', 'leadScoring', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-qualify Leads</Label>
                <p className="text-sm text-muted-foreground">Mark high-score leads as qualified</p>
              </div>
              <Switch
                checked={campaignData.settings.autoQualify}
                onCheckedChange={(checked) => handleNestedChange('settings', 'autoQualify', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Notify on Submission</Label>
                <p className="text-sm text-muted-foreground">Get instant email alerts for new leads</p>
              </div>
              <Switch
                checked={campaignData.settings.notifyOnSubmit}
                onCheckedChange={(checked) => handleNestedChange('settings', 'notifyOnSubmit', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pb-8">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button variant="outline" onClick={handleSaveDraft} disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button onClick={handlePublish} disabled={loading}>
            <Rocket className="mr-2 h-4 w-4" />
            Publish Campaign
          </Button>
        </div>
      </div>
    </ClientLayout>
  );
}
