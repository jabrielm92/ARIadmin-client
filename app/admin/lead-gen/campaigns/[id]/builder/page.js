'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Eye, Plus, Trash2, GripVertical } from 'lucide-react';

export default function LandingPageBuilder() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [campaign, setCampaign] = useState(null);
  const [activeTab, setActiveTab] = useState('design');
  
  const [landingPage, setLandingPage] = useState({
    headline: 'Get Your Free Consultation',
    subheadline: 'Fill out the quick quiz below to see if you qualify',
    heroImage: '',
    primaryColor: '#3B82F6',
    
    // Quiz/Survey Questions
    questions: [
      {
        id: '1',
        type: 'text',
        label: 'Full Name',
        placeholder: 'John Doe',
        required: true
      },
      {
        id: '2',
        type: 'email',
        label: 'Email Address',
        placeholder: 'john@company.com',
        required: true
      },
      {
        id: '3',
        type: 'phone',
        label: 'Phone Number',
        placeholder: '(555) 123-4567',
        required: true
      },
      {
        id: '4',
        type: 'text',
        label: 'Company Name',
        placeholder: 'Acme Corp',
        required: false
      },
      {
        id: '5',
        type: 'select',
        label: 'What is your primary need?',
        options: [
          'Lead Generation',
          'AI Virtual Receptionist',
          'Appointment Booking',
          'Other'
        ],
        required: true
      },
      {
        id: '6',
        type: 'select',
        label: 'What is your monthly budget?',
        options: [
          'Under $1,000',
          '$1,000 - $5,000',
          '$5,000 - $10,000',
          'Over $10,000'
        ],
        required: true
      },
      {
        id: '7',
        type: 'textarea',
        label: 'Tell us more about your needs',
        placeholder: 'Describe your requirements...',
        required: false
      }
    ],
    
    // Thank You Page
    thankYouHeadline: 'Thank You!',
    thankYouMessage: 'We received your information and will contact you within 24 hours.',
    
    // Settings
    collectConsent: true,
    consentText: 'I agree to receive communications and understand my information will be used per the Privacy Policy',
    redirectUrl: '',
    notifyOnSubmit: true
  });

  useEffect(() => {
    fetchCampaign();
  }, [campaignId]);

  const fetchCampaign = async () => {
    try {
      const response = await fetch(`/api/client/lead-gen/campaigns/${campaignId}`);
      const data = await response.json();
      
      if (data.success) {
        setCampaign(data.campaign);
        if (data.campaign.landingPage) {
          setLandingPage({ ...landingPage, ...data.campaign.landingPage });
        }
      }
    } catch (error) {
      console.error('Error fetching campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/client/lead-gen/campaigns/${campaignId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          landingPage: landingPage
        })
      });

      if (response.ok) {
        alert('Landing page saved successfully!');
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save landing page');
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    window.open(`/lead/${campaignId}`, '_blank');
  };

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now().toString(),
      type: 'text',
      label: 'New Question',
      placeholder: '',
      required: false
    };
    setLandingPage({
      ...landingPage,
      questions: [...landingPage.questions, newQuestion]
    });
  };

  const updateQuestion = (id, field, value) => {
    setLandingPage({
      ...landingPage,
      questions: landingPage.questions.map(q => 
        q.id === id ? { ...q, [field]: value } : q
      )
    });
  };

  const deleteQuestion = (id) => {
    setLandingPage({
      ...landingPage,
      questions: landingPage.questions.filter(q => q.id !== id)
    });
  };

  const addOption = (questionId) => {
    setLandingPage({
      ...landingPage,
      questions: landingPage.questions.map(q => 
        q.id === questionId 
          ? { ...q, options: [...(q.options || []), 'New Option'] }
          : q
      )
    });
  };

  const updateOption = (questionId, optionIndex, value) => {
    setLandingPage({
      ...landingPage,
      questions: landingPage.questions.map(q => 
        q.id === questionId 
          ? { 
              ...q, 
              options: q.options.map((opt, idx) => idx === optionIndex ? value : opt)
            }
          : q
      )
    });
  };

  const deleteOption = (questionId, optionIndex) => {
    setLandingPage({
      ...landingPage,
      questions: landingPage.questions.map(q => 
        q.id === questionId 
          ? { ...q, options: q.options.filter((_, idx) => idx !== optionIndex) }
          : q
      )
    });
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-lg">Loading...</div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Landing Page Builder</h1>
            <p className="text-muted-foreground">{campaign?.name}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Public URL */}
        <Card>
          <CardHeader>
            <CardTitle>Public Landing Page URL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input 
                value={`${window.location.origin}/lead/${campaignId}`} 
                readOnly 
                className="font-mono text-sm"
              />
              <Button 
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/lead/${campaignId}`);
                  alert('URL copied to clipboard!');
                }}
              >
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="thankyou">Thank You Page</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Design Tab */}
          <TabsContent value="design" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>Main content that visitors see first</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Headline</Label>
                  <Input
                    value={landingPage.headline}
                    onChange={(e) => setLandingPage({ ...landingPage, headline: e.target.value })}
                    placeholder="Main headline"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Subheadline</Label>
                  <Input
                    value={landingPage.subheadline}
                    onChange={(e) => setLandingPage({ ...landingPage, subheadline: e.target.value })}
                    placeholder="Supporting text"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Hero Image URL (optional)</Label>
                  <Input
                    value={landingPage.heroImage}
                    onChange={(e) => setLandingPage({ ...landingPage, heroImage: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={landingPage.primaryColor}
                      onChange={(e) => setLandingPage({ ...landingPage, primaryColor: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input
                      value={landingPage.primaryColor}
                      onChange={(e) => setLandingPage({ ...landingPage, primaryColor: e.target.value })}
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Quiz/Survey Questions</CardTitle>
                    <CardDescription>Build your lead capture form</CardDescription>
                  </div>
                  <Button onClick={addQuestion} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Question
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {landingPage.questions.map((question, index) => (
                  <div key={question.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                        <span className="font-semibold">Question {index + 1}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteQuestion(question.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Question Label</Label>
                        <Input
                          value={question.label}
                          onChange={(e) => updateQuestion(question.id, 'label', e.target.value)}
                          placeholder="Question text"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Field Type</Label>
                        <Select
                          value={question.type}
                          onValueChange={(value) => updateQuestion(question.id, 'type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                            <SelectItem value="textarea">Long Text</SelectItem>
                            <SelectItem value="select">Dropdown</SelectItem>
                            <SelectItem value="radio">Multiple Choice</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {(question.type === 'text' || question.type === 'email' || question.type === 'phone' || question.type === 'textarea') && (
                      <div className="space-y-2">
                        <Label>Placeholder</Label>
                        <Input
                          value={question.placeholder || ''}
                          onChange={(e) => updateQuestion(question.id, 'placeholder', e.target.value)}
                          placeholder="Placeholder text"
                        />
                      </div>
                    )}

                    {(question.type === 'select' || question.type === 'radio') && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>Options</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addOption(question.id)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Option
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {(question.options || []).map((option, optIdx) => (
                            <div key={optIdx} className="flex gap-2">
                              <Input
                                value={option}
                                onChange={(e) => updateOption(question.id, optIdx, e.target.value)}
                                placeholder={`Option ${optIdx + 1}`}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteOption(question.id, optIdx)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <Label>Required Field</Label>
                      <Switch
                        checked={question.required}
                        onCheckedChange={(checked) => updateQuestion(question.id, 'required', checked)}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Thank You Tab */}
          <TabsContent value="thankyou" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Thank You Page</CardTitle>
                <CardDescription>Message shown after form submission</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Headline</Label>
                  <Input
                    value={landingPage.thankYouHeadline}
                    onChange={(e) => setLandingPage({ ...landingPage, thankYouHeadline: e.target.value })}
                    placeholder="Thank You!"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea
                    value={landingPage.thankYouMessage}
                    onChange={(e) => setLandingPage({ ...landingPage, thankYouMessage: e.target.value })}
                    placeholder="Thank you message..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Redirect URL (optional)</Label>
                  <Input
                    value={landingPage.redirectUrl}
                    onChange={(e) => setLandingPage({ ...landingPage, redirectUrl: e.target.value })}
                    placeholder="https://example.com/thank-you"
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave blank to show thank you message on page
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Compliance & Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Collect Consent (TCPA)</Label>
                    <p className="text-sm text-muted-foreground">Require consent checkbox</p>
                  </div>
                  <Switch
                    checked={landingPage.collectConsent}
                    onCheckedChange={(checked) => setLandingPage({ ...landingPage, collectConsent: checked })}
                  />
                </div>

                {landingPage.collectConsent && (
                  <div className="space-y-2">
                    <Label>Consent Text</Label>
                    <Textarea
                      value={landingPage.consentText}
                      onChange={(e) => setLandingPage({ ...landingPage, consentText: e.target.value })}
                      rows={3}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notification</Label>
                    <p className="text-sm text-muted-foreground">Get notified on new leads</p>
                  </div>
                  <Switch
                    checked={landingPage.notifyOnSubmit}
                    onCheckedChange={(checked) => setLandingPage({ ...landingPage, notifyOnSubmit: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
