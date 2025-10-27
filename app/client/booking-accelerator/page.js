'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ClientLayout from '@/components/ClientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, Users, TrendingUp } from 'lucide-react';

export default function ClientBookingAcceleratorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

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
            <h1 className="text-3xl font-bold">Appointment Booking Accelerator</h1>
            <p className="text-muted-foreground">Smart booking system</p>
          </div>
          <Badge className="bg-green-500">Active</Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Show Rate</p>
                  <p className="text-2xl font-bold">92%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Conversion</p>
                  <p className="text-2xl font-bold">68%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Booking Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Your booking system is optimized and active.
            </p>
            <Button onClick={() => router.push('/client/analytics')}>View Details</Button>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
}