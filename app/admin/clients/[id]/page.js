'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
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
                Client ID: {client.clientId}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/admin/clients/${client.clientId}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
              {client.status}
            </Badge>
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
                </div>
                <Phone className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Leads</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Appointments</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
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
                <Mail className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Client Info */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Business Details */}
          <Card>
            <CardHeader>
              <CardTitle>Business Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Industry</p>
                  <p>{client.industry || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{client.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p>{client.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Website</p>
                  <p>{client.website || 'N/A'}</p>
                </div>
              </div>
              {client.address && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                  <p>{client.address}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Person */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Person</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p>{client.contactName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Title</p>
                  <p>{client.contactTitle || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{client.contactEmail}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p>{client.contactPhone || 'N/A'}</p>
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
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-blue-500" />
                    <div>
                      <h3 className="font-semibold">AI Virtual Receptionist</h3>
                      <p className="text-sm text-muted-foreground">
                        {client.services?.aiReceptionist?.enabled ? 'Enabled' : 'Not enabled'}
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
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-green-500" />
                    <div>
                      <h3 className="font-semibold">Appointment Booking Accelerator</h3>
                      <p className="text-sm text-muted-foreground">
                        {client.services?.bookingAccelerator?.enabled ? 'Enabled' : 'Not enabled'}
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
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-purple-500" />
                    <div>
                      <h3 className="font-semibold">ARI Lead Gen Service</h3>
                      <p className="text-sm text-muted-foreground">
                        {client.services?.leadGen?.enabled ? 'Enabled' : 'Not enabled'}
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
                    Configure
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
      </div>
    </AdminLayout>
  );
}
