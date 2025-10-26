'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import ClientOverview from '@/components/admin/ClientOverview';
import ClientActivityFeed from '@/components/admin/ClientActivityFeed';
import ClientQuickActions from '@/components/admin/ClientQuickActions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Settings, Phone, Calendar, TrendingUp, Mail, Edit } from 'lucide-react';

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

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
          <Button onClick={() => router.push('/admin/clients')}>
            Back to Clients
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/admin/clients')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{client.businessName}</h1>
              <p className="text-muted-foreground">
                {client.industry || 'N/A'} • {client.email}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Calls</p>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </div>
                <Phone className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Leads</p>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Appointments</p>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </div>
                <Calendar className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Campaigns</p>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground mt-1">Active</p>
                </div>
                <Mail className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Column - Overview & Activity */}
          <div className="md:col-span-2 space-y-6">
            {/* Client Overview */}
            <ClientOverview client={client} />

            {/* Business & Contact Details */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Business Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Industry</p>
                      <p className="text-sm">{client.industry || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="text-sm">{client.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone</p>
                      <p className="text-sm">{client.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Website</p>
                      <p className="text-sm">{client.website || 'N/A'}</p>
                    </div>
                  </div>
                  {client.address && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Address</p>
                      <p className="text-sm">{client.address}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Person</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Name</p>
                      <p className="text-sm">{client.contactName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Title</p>
                      <p className="text-sm">{client.contactTitle || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="text-sm">{client.contactEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone</p>
                      <p className="text-sm">{client.contactPhone || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle>Enabled Services</CardTitle>
                <CardDescription>Configure and manage client services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* AI Receptionist */}
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-blue-500" />
                        <div>
                          <h3 className="font-semibold">AI Virtual Receptionist</h3>
                          <p className="text-sm text-muted-foreground">
                            {client.services?.aiReceptionist?.enabled ? (
                              client.services.aiReceptionist.setupComplete ? (
                                <span className="text-green-600">Active & Configured</span>
                              ) : (
                                <span className="text-yellow-600">Setup Required</span>
                              )
                            ) : (
                              <span>Not enabled</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    {client.services?.aiReceptionist?.enabled && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/clients/${client.clientId}/ai-receptionist`)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    )}
                  </div>

                  {/* Booking Accelerator */}
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-green-500" />
                        <div>
                          <h3 className="font-semibold">Appointment Booking Accelerator</h3>
                          <p className="text-sm text-muted-foreground">
                            {client.services?.bookingAccelerator?.enabled ? (
                              client.services.bookingAccelerator.setupComplete ? (
                                <span className="text-green-600">Active & Configured</span>
                              ) : (
                                <span className="text-yellow-600">Setup Required</span>
                              )
                            ) : (
                              <span>Not enabled</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    {client.services?.bookingAccelerator?.enabled && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/clients/${client.clientId}/booking-accelerator`)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    )}
                  </div>

                  {/* Lead Gen */}
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 text-purple-500" />
                        <div>
                          <h3 className="font-semibold">ARI Lead Gen Service</h3>
                          <p className="text-sm text-muted-foreground">
                            {client.services?.leadGen?.enabled ? (
                              client.services.leadGen.setupComplete ? (
                                <span className="text-green-600">Active & Configured</span>
                              ) : (
                                <span className="text-yellow-600">Setup Required</span>
                              )
                            ) : (
                              <span>Not enabled</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    {client.services?.leadGen?.enabled && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Coming Soon
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {client.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{client.notes}</p>
                </CardContent>
              </Card>
            )}

            {/* Activity Feed */}
            <ClientActivityFeed clientId={client.clientId} />
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            <ClientQuickActions client={client} onUpdate={fetchClient} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
