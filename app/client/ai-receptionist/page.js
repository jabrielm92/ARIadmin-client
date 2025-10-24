'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ClientLayout from '@/components/ClientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Play, Download, FileText, Phone, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function ClientAIReceptionist() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [callHistory, setCallHistory] = useState([]);

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
      fetchCallHistory(userData.id);
      setLoading(false);
    } catch (error) {
      router.push('/client/login');
    }
  }, [router]);

  const fetchCallHistory = async (clientId) => {
    try {
      const response = await fetch(`/api/client/calls?clientId=${clientId}`);
      const data = await response.json();
      if (data.success) {
        setCallHistory(data.calls || []);
      }
    } catch (error) {
      console.error('Error fetching calls:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Mock call history
  const mockCalls = callHistory.length > 0 ? callHistory : [
    {
      id: 1,
      callerName: 'John Smith',
      callerNumber: '+1-555-0123',
      duration: '3m 45s',
      outcome: 'appointment-booked',
      timestamp: '2 hours ago',
      hasRecording: true,
      hasTranscript: true,
      sentiment: 'positive'
    },
    {
      id: 2,
      callerName: 'Jane Doe',
      callerNumber: '+1-555-0456',
      duration: '2m 15s',
      outcome: 'question-answered',
      timestamp: '5 hours ago',
      hasRecording: true,
      hasTranscript: true,
      sentiment: 'neutral'
    },
    {
      id: 3,
      callerName: 'Bob Johnson',
      callerNumber: '+1-555-0789',
      duration: '5m 30s',
      outcome: 'transferred',
      timestamp: '1 day ago',
      hasRecording: true,
      hasTranscript: true,
      sentiment: 'positive'
    }
  ];

  const stats = {
    totalCalls: 42,
    avgDuration: '3m 15s',
    appointmentsBooked: 15,
    callResolutionRate: '85%',
    missedCalls: 3,
    callbackRequests: 2
  };

  const getOutcomeColor = (outcome) => {
    switch (outcome) {
      case 'appointment-booked':
        return 'bg-green-500';
      case 'question-answered':
        return 'bg-blue-500';
      case 'transferred':
        return 'bg-yellow-500';
      case 'voicemail':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-300" />;
    }
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">AI Virtual Receptionist</h1>
          <p className="text-muted-foreground">Manage your AI receptionist and view call history</p>
        </div>

        <Tabs defaultValue="history" className="w-full">
          <TabsList>
            <TabsTrigger value="history">Call History</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Call History */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Calls</CardTitle>
                <CardDescription>All calls handled by your AI receptionist</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Caller</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Outcome</TableHead>
                      <TableHead>Sentiment</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockCalls.map((call) => (
                      <TableRow key={call.id}>
                        <TableCell className="font-medium">{call.callerName}</TableCell>
                        <TableCell>{call.callerNumber}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {call.duration}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getOutcomeColor(call.outcome)}>
                            {call.outcome.replace('-', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getSentimentIcon(call.sentiment)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{call.timestamp}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {call.hasRecording && (
                              <Button variant="ghost" size="icon" title="Play recording">
                                <Play className="h-4 w-4" />
                              </Button>
                            )}
                            {call.hasTranscript && (
                              <Button variant="ghost" size="icon" title="View transcript">
                                <FileText className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Metrics */}
          <TabsContent value="performance" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Total Calls</p>
                    <p className="text-3xl font-bold">{stats.totalCalls}</p>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Avg Duration</p>
                    <p className="text-3xl font-bold">{stats.avgDuration}</p>
                    <p className="text-xs text-muted-foreground">Per call</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Appointments Booked</p>
                    <p className="text-3xl font-bold">{stats.appointmentsBooked}</p>
                    <p className="text-xs text-muted-foreground">From calls</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Resolution Rate</p>
                    <p className="text-3xl font-bold">{stats.callResolutionRate}</p>
                    <p className="text-xs text-muted-foreground">Calls resolved by AI</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Missed Calls</p>
                    <p className="text-3xl font-bold">{stats.missedCalls}</p>
                    <p className="text-xs text-muted-foreground">Requires follow-up</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Callback Requests</p>
                    <p className="text-3xl font-bold">{stats.callbackRequests}</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
                <CardDescription>AI performance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Peak Call Hours</p>
                      <p className="text-sm text-muted-foreground">10 AM - 12 PM, 2 PM - 4 PM</p>
                    </div>
                    <Badge variant="secondary">Busiest</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Most Common Questions</p>
                      <p className="text-sm text-muted-foreground">Business hours, pricing, availability</p>
                    </div>
                    <Badge variant="secondary">Top 3</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Customer Satisfaction</p>
                      <p className="text-sm text-muted-foreground">Based on sentiment analysis</p>
                    </div>
                    <Badge className="bg-green-500">92% Positive</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI Receptionist Settings</CardTitle>
                <CardDescription>View your current configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <p className="font-medium mb-2">Business Hours</p>
                    <p className="text-sm text-muted-foreground">Monday - Friday: 9:00 AM - 5:00 PM</p>
                    <p className="text-sm text-muted-foreground">Saturday: 9:00 AM - 1:00 PM</p>
                    <p className="text-sm text-muted-foreground">Sunday: Closed</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="font-medium mb-2">Voice Settings</p>
                    <p className="text-sm text-muted-foreground">Voice: Female - Professional (American accent)</p>
                    <p className="text-sm text-muted-foreground">Speed: 1.0x | Tone: Neutral</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="font-medium mb-2">Services Configured</p>
                    <p className="text-sm text-muted-foreground">3 services, 12 FAQs, Custom greetings enabled</p>
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
