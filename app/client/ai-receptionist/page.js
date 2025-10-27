'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ClientLayout from '@/components/ClientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, CheckCircle, XCircle, BarChart3 } from 'lucide-react';

export default function ClientAIReceptionistPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(true); // Mock as configured

  useEffect(() => {
    const token = localStorage.getItem('clientToken');
    if (!token) {
      router.push('/client/login');
      return;
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-lg">Loading...</div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">AI Virtual Receptionist</h1>
            <p className="text-muted-foreground">24/7 call handling</p>
          </div>
          <Badge className="bg-green-500">Active</Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Calls Today</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Phone className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Service Info</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your AI receptionist is active. View call history and performance in Analytics.
            </p>
            <div className="mt-4">
              <Button onClick={() => router.push('/client/calls')}>View Calls</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
}