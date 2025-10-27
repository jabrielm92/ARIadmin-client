'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ClientLayout from '@/components/ClientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, Phone, Mail, MessageSquare, Clock, User, Building, 
  Calendar, Star, Tag, Save, Send, AlertCircle
} from 'lucide-react';

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id;
  
  const [loading, setLoading] = useState(true);
  const [lead, setLead] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [smsBody, setSmsBody] = useState('');
  
  useEffect(() => {
    fetchLead();
  }, [leadId]);

  const fetchLead = async () => {
    try {
      // Mock data for now - in production, fetch from API
      const mockLead = {
        id: leadId,
        name: 'John Doe',
        email: 'john@techcorp.com',
        phone: '+1-555-0123',
        company: 'Tech Corp',
        status: 'new',
        score: 85,
        source: 'Lead Gen Campaign',
        campaignName: 'Q1 2025 Enterprise Campaign',
        
        // Form responses
        formResponses: {
          '1': 'John Doe',
          '2': 'john@techcorp.com',
          '3': '+1-555-0123',
          '4': 'Tech Corp',
          '5': 'Lead Generation',
          '6': '$5,000 - $10,000',
          '7': 'Looking to scale our lead generation by 3x in Q1. Need proven system with compliance tracking.'
        },
        
        // Tracking data
        tracking: {
          ip: '192.168.1.1',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          timestamp: '2025-01-26T15:30:00Z',
          consentGiven: true,
          url: 'https://example.com/lead/abc123'
        },
        
        // Notes
        notes: [
          {
            id: '1',
            text: 'Initial contact made via email',
            addedBy: 'Admin',
            addedAt: '2025-01-26T16:00:00Z'
          }
        ],
        
        // Tags
        tags: ['hot', 'qualified'],
        
        // Activity
        activities: [
          {
            id: '1',
            type: 'email',
            description: 'Sent welcome email',
            performedBy: 'System',
            performedAt: '2025-01-26T15:31:00Z'
          },
          {
            id: '2',
            type: 'note',
            description: 'Added note: Initial contact made',
            performedBy: 'Admin',
            performedAt: '2025-01-26T16:00:00Z'
          }
        ],
        
        createdAt: '2025-01-26T15:30:00Z'
      };
      
      setLead(mockLead);
      setEmailSubject(`Follow up: ${mockLead.name}`);
      setEmailBody(`Hi ${mockLead.name},\n\nThank you for your interest in our lead generation services...\n\nBest regards,\nARI Solutions Inc.`);
      setSmsBody(`Hi ${mockLead.name}, this is ARI Solutions following up on your inquiry...`);
    } catch (error) {
      console.error('Error fetching lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    // In production, POST to API
    alert(`Note added: ${newNote}`);
    setNewNote('');
  };

  const handleSendEmail = async () => {
    // In production, POST to email API
    alert(`Email sent to ${lead.email}\n\nSubject: ${emailSubject}`);
  };

  const handleSendSMS = async () => {
    // In production, POST to SMS API
    alert(`SMS sent to ${lead.phone}`);
  };

  const handleCallLead = () => {
    // In production, integrate with Twilio
    window.open(`tel:${lead?.phone}`);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'contacted': return 'bg-yellow-500';
      case 'qualified': return 'bg-purple-500';
      case 'appointment-set': return 'bg-orange-500';
      case 'converted': return 'bg-green-500';
      case 'lost': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
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

  if (!lead) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-lg">Lead not found</div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{lead.name}</h1>
            <p className="text-muted-foreground">{lead.company}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCallLead}>
              <Phone className="mr-2 h-4 w-4" />
              Call
            </Button>
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Lead Info */}
          <div className="md:col-span-2 space-y-6">
            {/* Overview Card */}
            <Card>
              <CardHeader>
                <CardTitle>Lead Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{lead.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="font-medium">{lead.phone}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Company</Label>
                    <p className="font-medium">{lead.company}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Source</Label>
                    <p className="font-medium">{lead.source}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-muted-foreground">Lead Score</Label>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg mt-1 ${getScoreColor(lead.score)}`}>
                      <Star className="h-4 w-4" />
                      <span className="font-bold text-lg">{lead.score}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="mt-1">
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Tags</Label>
                    <div className="flex gap-2 mt-1">
                      {lead.tags?.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs: Form Responses, Compliance, Actions */}
            <Tabs defaultValue="responses">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="responses">Form Responses</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="sms">SMS</TabsTrigger>
              </TabsList>

              {/* Form Responses */}
              <TabsContent value="responses">
                <Card>
                  <CardHeader>
                    <CardTitle>Form Responses</CardTitle>
                    <CardDescription>Answers from {lead.campaignName}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(lead.formResponses).map(([key, value]) => (
                      <div key={key}>
                        <Label className="text-muted-foreground text-sm">Question {key}</Label>
                        <p className="font-medium mt-1">{value}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Compliance */}
              <TabsContent value="compliance">
                <Card>
                  <CardHeader>
                    <CardTitle>TCPA Compliance Data</CardTitle>
                    <CardDescription>Tracking information for legal protection</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground">IP Address</Label>
                      <p className="font-medium font-mono">{lead.tracking.ip}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Timestamp</Label>
                      <p className="font-medium">{new Date(lead.tracking.timestamp).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">User Agent</Label>
                      <p className="font-medium text-sm">{lead.tracking.userAgent}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Consent Given</Label>
                      <div className="flex items-center gap-2 mt-1">
                        {lead.tracking.consentGiven ? (
                          <>
                            <Badge className="bg-green-500">Yes</Badge>
                            <span className="text-sm text-muted-foreground">Checkbox confirmed</span>
                          </>
                        ) : (
                          <>
                            <Badge className="bg-red-500">No</Badge>
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Landing Page URL</Label>
                      <p className="font-medium text-sm break-all">{lead.tracking.url}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Email */}
              <TabsContent value="email">
                <Card>
                  <CardHeader>
                    <CardTitle>Send Email</CardTitle>
                    <CardDescription>Quick email to {lead.name}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>To</Label>
                      <Input value={lead.email} disabled />
                    </div>
                    <div>
                      <Label>Subject</Label>
                      <Input 
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Message</Label>
                      <Textarea 
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                        rows={8}
                      />
                    </div>
                    <Button onClick={handleSendEmail} className="w-full">
                      <Send className="mr-2 h-4 w-4" />
                      Send Email
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SMS */}
              <TabsContent value="sms">
                <Card>
                  <CardHeader>
                    <CardTitle>Send SMS</CardTitle>
                    <CardDescription>Quick text to {lead.phone}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>To</Label>
                      <Input value={lead.phone} disabled />
                    </div>
                    <div>
                      <Label>Message</Label>
                      <Textarea 
                        value={smsBody}
                        onChange={(e) => setSmsBody(e.target.value)}
                        rows={4}
                        maxLength={160}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {smsBody.length}/160 characters
                      </p>
                    </div>
                    <Button onClick={handleSendSMS} className="w-full">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send SMS
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Activity & Notes */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium">{new Date(lead.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Campaign:</span>
                  <span className="font-medium">{lead.campaignName}</span>
                </div>
              </CardContent>
            </Card>

            {/* Add Note */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Add Note</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add internal note..."
                  rows={4}
                />
                <Button onClick={handleAddNote} className="w-full" size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Save Note
                </Button>
              </CardContent>
            </Card>

            {/* Activity Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lead.activities?.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <div className="mt-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.performedBy} • {new Date(activity.performedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lead.notes?.map((note) => (
                    <div key={note.id} className="border-l-2 border-primary pl-3">
                      <p className="text-sm">{note.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {note.addedBy} • {new Date(note.addedAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
