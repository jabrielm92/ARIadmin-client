'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, DollarSign, Phone, Calendar } from 'lucide-react';

export default function AdminAnalytics() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30days');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const systemStats = {
    totalRevenue: '$48,750',
    revenueChange: '+22%',
    totalCalls: 1247,
    callsChange: '+18%',
    totalAppointments: 142,
    appointmentsChange: '+25%',
    totalLeads: 456,
    leadsChange: '+31%',
    mrr: '$18,000',
    mrrChange: '+15%',
    churnRate: '2.1%',
    churnChange: '-0.5%'
  };

  const clientPerformance = [
    { name: 'ABC Healthcare', calls: 342, leads: 128, appointments: 48, revenue: '$12,450', status: 'excellent' },
    { name: 'Premier Legal', calls: 289, leads: 98, appointments: 38, revenue: '$9,850', status: 'good' },
    { name: 'Elite Real Estate', calls: 267, leads: 112, appointments: 36, revenue: '$10,200', status: 'good' },
    { name: 'Tech Startup Inc', calls: 349, leads: 118, appointments: 20, revenue: '$16,250', status: 'excellent' }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">System Analytics</h1>
            <p className="text-muted-foreground">Performance across all clients</p>
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
            <TabsTrigger value="clients">Client Comparison</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* System-wide Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold">{systemStats.totalRevenue}</p>
                    <span className="text-sm text-green-500 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {systemStats.revenueChange}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Total Calls</p>
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold">{systemStats.totalCalls}</p>
                    <span className="text-sm text-green-500 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {systemStats.callsChange}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Appointments</p>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold">{systemStats.totalAppointments}</p>
                    <span className="text-sm text-green-500 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {systemStats.appointmentsChange}
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
                    <p className="text-3xl font-bold">{systemStats.totalLeads}</p>
                    <span className="text-sm text-green-500 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {systemStats.leadsChange}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Monthly Recurring Revenue</p>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold">{systemStats.mrr}</p>
                    <span className="text-sm text-green-500 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {systemStats.mrrChange}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Churn Rate</p>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold">{systemStats.churnRate}</p>
                    <span className="text-sm text-green-500 flex items-center">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      {systemStats.churnChange}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Clients</CardTitle>
                <CardDescription>Clients with highest engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clientPerformance.slice(0, 3).map((client, index) => (
                    <div key={client.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-muted-foreground">#{index + 1}</div>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-muted-foreground">{client.calls} calls | {client.leads} leads</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">{client.revenue}</p>
                        <Badge className="bg-green-500 mt-1">{client.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Client Performance Comparison</CardTitle>
                <CardDescription>All clients ranked by performance</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Calls</TableHead>
                      <TableHead>Leads</TableHead>
                      <TableHead>Appointments</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientPerformance.map((client, index) => (
                      <TableRow key={client.name}>
                        <TableCell>
                          <div className="text-lg font-bold text-muted-foreground">#{index + 1}</div>
                        </TableCell>
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell>{client.calls}</TableCell>
                        <TableCell>{client.leads}</TableCell>
                        <TableCell>{client.appointments}</TableCell>
                        <TableCell className="font-bold">{client.revenue}</TableCell>
                        <TableCell>
                          <Badge className={client.status === 'excellent' ? 'bg-green-500' : 'bg-blue-500'}>
                            {client.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                  <CardDescription>By service type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <span className="font-medium">AI Receptionist</span>
                      <span className="text-xl font-bold">$28,500</span>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <span className="font-medium">Booking Accelerator</span>
                      <span className="text-xl font-bold">$20,250</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Projected Revenue</CardTitle>
                  <CardDescription>Next 3 months forecast</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <span className="font-medium">Next Month</span>
                      <span className="text-xl font-bold text-green-500">$52,300</span>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <span className="font-medium">3 Months</span>
                      <span className="text-xl font-bold text-green-500">$163,800</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Client</CardTitle>
                <CardDescription>Monthly contribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clientPerformance.map((client) => (
                    <div key={client.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{client.name}</span>
                        <span className="text-sm font-bold">{client.revenue}</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-3">
                        <div 
                          className="bg-primary h-3 rounded-full transition-all" 
                          style={{ width: `${(parseFloat(client.revenue.replace('$', '').replace(',', '')) / 50000) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
