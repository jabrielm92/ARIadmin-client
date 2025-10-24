'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ClientLayout from '@/components/ClientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Calendar, Users, TrendingUp, Clock, DollarSign } from 'lucide-react';

export default function ClientDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('clientToken');
    const userStr = localStorage.getItem('clientUser');
    
    if (!token || !userStr) {
      router.push('/client/login');
      return;
    }
    
    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
      fetchDashboardStats(userData.id);
      setLoading(false);
    } catch (error) {
      router.push('/client/login');
    }
  }, [router]);

  const fetchDashboardStats = async (clientId) => {
    try {
      const response = await fetch(`/api/client/dashboard?clientId=${clientId}`);
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Mock stats (will be replaced with real data)
  const dashboardStats = stats || {
    callsReceived: 42,
    appointmentsBooked: 15,
    leadsCaptured: 28,
    conversionRate: '53.6%',
    avgCallDuration: '3m 15s',
    revenue: '$4,250'
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.businessName}!</h1>
          <p className="text-muted-foreground">Here's what's happening with your services</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Calls Received</p>
                  <p className="text-3xl font-bold">{dashboardStats.callsReceived}</p>
                  <p className="text-xs text-muted-foreground">This month</p>
                </div>
                <div className="p-3 rounded-full bg-blue-500">
                  <Phone className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Appointments Booked</p>
                  <p className="text-3xl font-bold">{dashboardStats.appointmentsBooked}</p>
                  <p className="text-xs text-muted-foreground">This month</p>
                </div>
                <div className="p-3 rounded-full bg-green-500">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Leads Captured</p>
                  <p className="text-3xl font-bold">{dashboardStats.leadsCaptured}</p>
                  <p className="text-xs text-muted-foreground">This month</p>
                </div>
                <div className="p-3 rounded-full bg-purple-500">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                  <p className="text-3xl font-bold">{dashboardStats.conversionRate}</p>
                  <p className="text-xs text-muted-foreground">Leads to appointments</p>
                </div>
                <div className="p-3 rounded-full bg-teal-500">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Avg Call Duration</p>
                  <p className="text-3xl font-bold">{dashboardStats.avgCallDuration}</p>
                  <p className="text-xs text-muted-foreground">Per call</p>
                </div>
                <div className="p-3 rounded-full bg-orange-500">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Revenue Generated</p>
                  <p className="text-3xl font-bold">{dashboardStats.revenue}</p>
                  <p className="text-xs text-muted-foreground">This month</p>
                </div>
                <div className="p-3 rounded-full bg-green-600">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/client/ai-receptionist')}>
                <Phone className="mr-2 h-4 w-4" />
                View Call History
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/client/booking-accelerator')}>
                <Calendar className="mr-2 h-4 w-4" />
                Manage Appointments
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/client/leads')}>
                <Users className="mr-2 h-4 w-4" />
                View Leads
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/client/settings')}>
                <Badge className="mr-2">New</Badge>
                Update Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">New appointment booked</p>
                    <p className="text-xs text-muted-foreground">John Doe - Tomorrow at 2:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">5 calls handled today</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">3 new leads captured</p>
                    <p className="text-xs text-muted-foreground">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Quote sent to prospect</p>
                    <p className="text-xs text-muted-foreground">Yesterday</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Status */}
        <Card>
          <CardHeader>
            <CardTitle>Service Status</CardTitle>
            <CardDescription>Your active services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">AI Virtual Receptionist</p>
                    <p className="text-sm text-muted-foreground">Handling calls 24/7</p>
                  </div>
                </div>
                <Badge className="bg-green-500">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-purple-100 rounded">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Appointment Booking Accelerator</p>
                    <p className="text-sm text-muted-foreground">Landing page live</p>
                  </div>
                </div>
                <Badge className="bg-green-500">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
}
