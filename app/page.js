'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-teal-500">
      <Card className="w-full max-w-2xl mx-4">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-4xl font-bold">ARI Solutions</CardTitle>
          <CardDescription className="text-lg">
            Client Management Platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            Manage your AI Virtual Receptionist and Appointment Booking Accelerator services
            for all your clients in one centralized platform.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-2 hover:border-primary transition-colors cursor-pointer" onClick={() => router.push('/admin/login')}>
              <CardHeader>
                <CardTitle className="text-lg">Admin Portal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage clients, configure services, and view analytics
                </p>
                <Button className="w-full">
                  Admin Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-primary transition-colors cursor-pointer" onClick={() => router.push('/client/login')}>
              <CardHeader>
                <CardTitle className="text-lg">Client Portal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Access your dashboard, view calls, and manage settings
                </p>
                <Button variant="outline" className="w-full">
                  Client Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Setup Required:</strong> Please configure your Firebase credentials in the .env file.
              See README.md for detailed setup instructions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
