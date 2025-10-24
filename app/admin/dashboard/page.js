'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import StatsCard from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Phone, Calendar, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { onAuthChange } from '@/lib/auth';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('adminToken');
    const userStr = localStorage.getItem('adminUser');
    
    if (!token || !userStr) {
      router.push('/admin/login');
      return;
    }
    
    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
      setLoading(false);
    } catch (error) {
      router.push('/admin/login');
    }
  }, [router]);

  // Mock stats data
  const stats = [
    { title: 'Total Clients', value: '24', change: '+3 this month', icon: Users, color: 'bg-blue-500' },
    { title: 'Active AI Receptionists', value: '18', change: '75% of clients', icon: Phone, color: 'bg-green-500' },
    { title: 'Appointments Booked', value: '142', change: '+23% from last month', icon: Calendar, color: 'bg-purple-500' },
    { title: 'Monthly Revenue', value: '$12,450', change: '+18% from last month', icon: DollarSign, color: 'bg-teal-500' },
    { title: 'Calls Handled', value: '1,247', change: 'This month', icon: TrendingUp, color: 'bg-orange-500' },
    { title: 'Avg Call Duration', value: '3m 42s', change: '-15s from last month', icon: Clock, color: 'bg-pink-500' },
  ];

  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      if (!currentUser) {
        router.push('/admin/login');
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
          </div>
          <Button onClick={() => router.push('/admin/clients/new')}>
            Add New Client
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/admin/clients')}>
                <Users className="mr-2 h-4 w-4" />
                View All Clients
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/admin/clients/new')}>
                <Users className="mr-2 h-4 w-4" />
                Add New Client
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Phone className="mr-2 h-4 w-4" />
                View Call History
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                View Appointments
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your clients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">New client added: ABC Corp</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">18 calls handled today</p>
                    <p className="text-xs text-muted-foreground">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">5 new appointments booked</p>
                    <p className="text-xs text-muted-foreground">6 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
