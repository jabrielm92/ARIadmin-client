'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ClientLayout from '@/components/ClientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, TrendingDown, Users, Phone, Calendar, DollarSign } from 'lucide-react';

export default function ClientAnalytics() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [timeRange, setTimeRange] = useState('30days');

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

  const stats = {
    totalRevenue: '$12,450',
    revenueChange: '+18%',
    totalLeads: 156,
    leadsChange: '+23%',
    conversionRate: '36.5%',
    conversionChange: '+5.2%',
    avgCallDuration: '3m 45s',
    callChange: '-12s'
  };

  const monthlyData = [
    { month: 'Jan', calls: 120, leads: 45, appointments: 28, revenue: 3200 },
    { month: 'Feb', calls: 145, leads: 52, appointments: 32, revenue: 3800 },
    { month: 'Mar', calls: 168, leads: 61, appointments: 38, revenue: 4500 },
    { month: 'Apr', calls: 152, leads: 58, appointments: 35, revenue: 4100 },
    { month: 'May', calls: 189, leads: 68, appointments: 42, revenue: 5200 },
    { month: 'Jun', calls: 201, leads: 74, appointments: 48, revenue: 5800 }
  ];

  const sourceBreakdown = [
    { source: 'AI Receptionist Calls', count: 124, percentage: 45 },
    { source: 'Landing Page Forms', count: 89, percentage: 32 },
    { source: 'Direct Bookings', count: 43, percentage: 16 },
    { source: 'Referrals', count: 19, percentage: 7 }
  ];

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Detailed performance insights</p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="12months">Last 12 months</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold">{stats.totalRevenue}</p>
                    <span className="text-sm text-green-500 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stats.revenueChange}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold">{stats.totalLeads}</p>
                    <span className="text-sm text-green-500 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stats.leadsChange}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold">{stats.conversionRate}</p>
                    <span className="text-sm text-green-500 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stats.conversionChange}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Avg Call Duration</p>
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold">{stats.avgCallDuration}</p>
                    <span className="text-sm text-green-500 flex items-center">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      {stats.callChange}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Charts */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
                <CardDescription>Calls, leads, appointments, and revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {monthlyData.map((data) => (
                    <div key={data.month} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{data.month}</span>
                        <span className="text-muted-foreground">{data.calls} calls | {data.leads} leads | ${data.revenue}</span>
                      </div>
                      <div className="flex gap-1">
                        <div className="h-2 bg-blue-500 rounded" style={{ width: `${(data.calls / 250) * 100}%` }} />
                        <div className="h-2 bg-purple-500 rounded" style={{ width: `${(data.leads / 100) * 100}%` }} />
                        <div className="h-2 bg-green-500 rounded" style={{ width: `${(data.appointments / 60) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-6 mt-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded" />
                    <span className="text-sm">Calls</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded" />
                    <span className="text-sm">Leads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded" />
                    <span className="text-sm">Appointments</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Growth Trends</CardTitle>
                <CardDescription>Month-over-month comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Calls Handled</p>
                      <p className="text-2xl font-bold">201</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">vs last month</p>
                      <p className="text-lg font-bold text-green-500">+6.3% ↑</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Leads Captured</p>
                      <p className="text-2xl font-bold">74</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">vs last month</p>
                      <p className="text-lg font-bold text-green-500">+8.8% ↑</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Appointments Booked</p>
                      <p className="text-2xl font-bold">48</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">vs last month</p>
                      <p className="text-lg font-bold text-green-500">+14.3% ↑</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Revenue Generated</p>
                      <p className="text-2xl font-bold">$5,800</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">vs last month</p>
                      <p className="text-lg font-bold text-green-500">+11.5% ↑</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sources" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Lead Sources</CardTitle>
                <CardDescription>Where your leads are coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {sourceBreakdown.map((source) => (
                    <div key={source.source} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{source.source}</span>
                        <span className="text-sm text-muted-foreground">{source.count} leads ({source.percentage}%)</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-3">
                        <div 
                          className="bg-primary h-3 rounded-full transition-all" 
                          style={{ width: `${source.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>Lead journey from capture to conversion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-primary/10 border-2 border-primary rounded-lg">
                    <span className="font-medium">Total Leads</span>
                    <span className="text-2xl font-bold">275</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-purple-500/10 border-2 border-purple-500 rounded-lg">
                    <span className="font-medium">Contacted</span>
                    <span className="text-2xl font-bold">198 (72%)</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-orange-500/10 border-2 border-orange-500 rounded-lg">
                    <span className="font-medium">Qualified</span>
                    <span className="text-2xl font-bold">142 (52%)</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-500/10 border-2 border-green-500 rounded-lg">
                    <span className="font-medium">Converted</span>
                    <span className="text-2xl font-bold">87 (32%)</span>
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
