'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Phone, Settings, CheckCircle, ExternalLink, HelpCircle, Briefcase, Users } from 'lucide-react';

export default function AdminAIReceptionistPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState(null);
  const [config, setConfig] = useState(null);
  const [knowledgeBase, setKnowledgeBase] = useState(null);
  const [recentCalls, setRecentCalls] = useState([]);

  useEffect(() => {
    fetchClientData();
  }, [params.id]);

  const fetchClientData = async () => {
    try {
      // Fetch client
      const clientRes = await fetch(`/api/clients/${params.id}`);
      const clientData = await clientRes.json();
      
      if (clientData.success) {
        setClient(clientData.client);
        setConfig(clientData.client.services?.aiReceptionist?.config || null);
      }

      // Fetch knowledge base
      const kbRes = await fetch(`/api/client/knowledge-base?clientId=${params.id}`);
      const kbData = await kbRes.json();
      if (kbData.success) {
        setKnowledgeBase(kbData.knowledgeBase);
      }

      // Fetch recent calls
      const callsRes = await fetch(`/api/client/calls?clientId=${params.id}`);
      const callsData = await callsRes.json();
      if (callsData.success) {
        setRecentCalls(callsData.calls.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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

  const isSetupComplete = client.services?.aiReceptionist?.setupComplete;
  const hasPhoneNumber = client.services?.aiReceptionist?.phoneNumber;
  const assistantId = client.services?.aiReceptionist?.vapiAssistantId;

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
              <h1 className="text-3xl font-bold">AI Virtual Receptionist</h1>
              <p className="text-muted-foreground">{client.businessName}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant={isSetupComplete ? 'default' : 'secondary'}>
              {isSetupComplete ? 'Configured' : 'Not Configured'}
            </Badge>
            {hasPhoneNumber && (
              <Badge className="bg-green-500">Phone Active</Badge>
            )}
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Setup Status</p>
                  <p className="text-2xl font-bold">{isSetupComplete ? 'Complete' : 'Pending'}</p>
                </div>
                {isSetupComplete ? (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                ) : (
                  <Settings className="h-8 w-8 text-yellow-500" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                  <p className="text-lg font-bold">{hasPhoneNumber ? client.services.aiReceptionist.phoneNumber : 'None'}</p>
                </div>
                <Phone className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Calls</p>
                  <p className="text-2xl font-bold">{recentCalls.length}</p>
                </div>
                <Phone className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assistant ID</p>
                  <p className="text-xs font-mono">{assistantId ? assistantId.slice(0, 12) + '...' : 'Not created'}</p>
                </div>
                <Settings className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="knowledge-base">Knowledge Base</TabsTrigger>
            <TabsTrigger value="calls">Recent Calls</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Setup Progress</CardTitle>
                  <CardDescription>Help client complete their AI receptionist setup</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {isSetupComplete ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                        )}
                        <div>
                          <p className="font-medium">Initial Configuration</p>
                          <p className="text-sm text-muted-foreground">Voice, personality, business hours</p>
                        </div>
                      </div>
                      <Badge variant={isSetupComplete ? 'default' : 'secondary'}>
                        {isSetupComplete ? 'Complete' : 'Pending'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {assistantId ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                        )}
                        <div>
                          <p className="font-medium">Vapi Assistant Created</p>
                          <p className="text-sm text-muted-foreground">AI assistant configured and active</p>
                        </div>
                      </div>
                      <Badge variant={assistantId ? 'default' : 'secondary'}>
                        {assistantId ? 'Complete' : 'Pending'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {hasPhoneNumber ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                        )}
                        <div>
                          <p className="font-medium">Phone Number Assigned</p>
                          <p className="text-sm text-muted-foreground">Ready to receive calls</p>
                        </div>
                      </div>
                      <Badge variant={hasPhoneNumber ? 'default' : 'secondary'}>
                        {hasPhoneNumber ? 'Complete' : 'Pending'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {knowledgeBase?.faqs?.length > 0 ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                        )}
                        <div>
                          <p className="font-medium">Knowledge Base Populated</p>
                          <p className="text-sm text-muted-foreground">FAQs, services, staff info</p>
                        </div>
                      </div>
                      <Badge variant={knowledgeBase?.faqs?.length > 0 ? 'default' : 'secondary'}>
                        {knowledgeBase?.faqs?.length > 0 ? 'Complete' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Client Portal Links</CardTitle>
                  <CardDescription>Share these links with the client for self-service</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm font-mono">/client/ai-receptionist/setup</span>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm font-mono">/client/ai-receptionist/knowledge-base</span>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm font-mono">/client/ai-receptionist/phone-number</span>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="configuration">
            <Card>
              <CardHeader>
                <CardTitle>AI Receptionist Configuration</CardTitle>
                <CardDescription>View current settings</CardDescription>
              </CardHeader>
              <CardContent>
                {config ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Voice</p>
                        <p className="text-lg font-semibold capitalize">{config.voiceId || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Personality</p>
                        <p className="text-lg font-semibold capitalize">{config.aiPersonality || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Booking Enabled</p>
                        <Badge variant={config.bookingEnabled ? 'default' : 'secondary'}>
                          {config.bookingEnabled ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Quotes Enabled</p>
                        <Badge variant={config.quoteEnabled ? 'default' : 'secondary'}>
                          {config.quoteEnabled ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                    </div>

                    {config.greetingMessage && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Greeting Message</p>
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm">{config.greetingMessage}</p>
                        </div>
                      </div>
                    )}

                    {config.businessHours && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Business Hours</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(config.businessHours).map(([day, hours]) => (
                            <div key={day} className="flex justify-between p-2 bg-muted rounded">
                              <span className="capitalize font-medium">{day}</span>
                              <span>{hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium">Not Configured</p>
                    <p className="text-sm text-muted-foreground">Client needs to complete setup wizard</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Knowledge Base Tab */}
          <TabsContent value="knowledge-base">
            <div className="space-y-6">
              {/* FAQs */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>FAQs</CardTitle>
                      <CardDescription>{knowledgeBase?.faqs?.length || 0} questions configured</CardDescription>
                    </div>
                    <HelpCircle className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  {knowledgeBase?.faqs?.length > 0 ? (
                    <div className="space-y-3">
                      {knowledgeBase.faqs.map((faq, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <p className="font-semibold mb-1">{faq.question}</p>
                          <p className="text-sm text-muted-foreground">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">No FAQs configured</p>
                  )}
                </CardContent>
              </Card>

              {/* Services */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Services</CardTitle>
                      <CardDescription>{knowledgeBase?.services?.length || 0} services listed</CardDescription>
                    </div>
                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  {knowledgeBase?.services?.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-3">
                      {knowledgeBase.services.map((service, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <p className="font-semibold">{service.name}</p>
                          <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                          <div className="flex gap-4 text-xs">
                            {service.duration && <span>⏱️ {service.duration}</span>}
                            {service.price && <span>💵 ${service.price}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">No services configured</p>
                  )}
                </CardContent>
              </Card>

              {/* Staff */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Staff Directory</CardTitle>
                      <CardDescription>{knowledgeBase?.staff?.length || 0} team members</CardDescription>
                    </div>
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  {knowledgeBase?.staff?.length > 0 ? (
                    <div className="grid md:grid-cols-3 gap-3">
                      {knowledgeBase.staff.map((member, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <p className="font-semibold">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                          {member.availability && (
                            <p className="text-xs text-muted-foreground mt-1">{member.availability}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">No staff configured</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Recent Calls Tab */}
          <TabsContent value="calls">
            <Card>
              <CardHeader>
                <CardTitle>Recent Calls</CardTitle>
                <CardDescription>Latest calls handled by AI receptionist</CardDescription>
              </CardHeader>
              <CardContent>
                {recentCalls.length > 0 ? (
                  <div className="space-y-3">
                    {recentCalls.map((call) => (
                      <div key={call.callId} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{call.phoneNumber || 'Unknown'}</p>
                            <p className="text-sm text-muted-foreground">{new Date(call.createdAt).toLocaleString()}</p>
                          </div>
                          <Badge>{call.status}</Badge>
                        </div>
                        {call.summary && (
                          <p className="text-sm text-muted-foreground">{call.summary}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium">No calls yet</p>
                    <p className="text-sm text-muted-foreground">Call history will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
