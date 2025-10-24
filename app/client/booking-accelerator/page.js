'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ClientLayout from '@/components/ClientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Eye, ExternalLink, Users, TrendingUp } from 'lucide-react';

export default function ClientBookingAccelerator() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

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
      setLoading(false);
    } catch (error) {
      router.push('/client/login');
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Mock appointments
  const mockAppointments = [
    { id: 1, name: 'John Doe', email: 'john@example.com', type: 'Consultation', dateTime: 'Tomorrow at 2:00 PM', status: 'confirmed' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', type: 'Follow-up', dateTime: 'Dec 25 at 10:00 AM', status: 'confirmed' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', type: 'Service Call', dateTime: 'Dec 26 at 3:00 PM', status: 'pending' }
  ];

  const stats = {
    pageViews: 245,
    formSubmissions: 28,
    conversionRate: '11.4%',
    bounceRate: '42%',
    avgTimeOnPage: '2m 35s'
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Booking Accelerator</h1>
            <p className="text-muted-foreground">Manage your landing page and appointments</p>
          </div>
          <Button variant="outline">
            <ExternalLink className="mr-2 h-4 w-4" />
            View Public Page
          </Button>
        </div>

        <Tabs defaultValue="appointments" className="w-full">
          <TabsList>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Appointments */}
          <TabsContent value="appointments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>All booked appointments from your landing page</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium">{appointment.name}</TableCell>
                        <TableCell>{appointment.email}</TableCell>
                        <TableCell>{appointment.type}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {appointment.dateTime}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance */}
          <TabsContent value="performance" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Page Views</p>
                    <p className="text-3xl font-bold">{stats.pageViews}</p>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Form Submissions</p>
                    <p className="text-3xl font-bold">{stats.formSubmissions}</p>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                    <p className="text-3xl font-bold">{stats.conversionRate}</p>
                    <p className="text-xs text-muted-foreground">Views to submissions</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Bounce Rate</p>
                    <p className="text-3xl font-bold">{stats.bounceRate}</p>
                    <p className="text-xs text-muted-foreground">Left without action</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Avg Time on Page</p>
                    <p className="text-3xl font-bold">{stats.avgTimeOnPage}</p>
                    <p className="text-xs text-muted-foreground">Per visit</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Where your visitors are coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Direct Traffic</p>
                      <p className="text-sm text-muted-foreground">Visitors typing URL directly</p>
                    </div>
                    <Badge variant="secondary">45%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Google Search</p>
                      <p className="text-sm text-muted-foreground">Organic search traffic</p>
                    </div>
                    <Badge variant="secondary">30%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Social Media</p>
                      <p className="text-sm text-muted-foreground">Facebook, LinkedIn, Twitter</p>
                    </div>
                    <Badge variant="secondary">15%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Referrals</p>
                      <p className="text-sm text-muted-foreground">Other websites linking to you</p>
                    </div>
                    <Badge variant="secondary">10%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Landing Page Configuration</CardTitle>
                <CardDescription>View your current setup</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <p className="font-medium mb-2">Template</p>
                    <p className="text-sm text-muted-foreground">Professional template with custom branding</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="font-medium mb-2">Form Fields</p>
                    <p className="text-sm text-muted-foreground">3 fields configured (Name, Email, Phone)</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="font-medium mb-2">Calendar Integration</p>
                    <p className="text-sm text-muted-foreground">Calendly connected</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="font-medium mb-2">Public URL</p>
                    <p className="text-sm text-blue-600">https://client-mgmt-portal-2.preview.emergentagent.com/book/your-business</p>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> To update these settings, please contact your account manager.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ClientLayout>
  );
}
