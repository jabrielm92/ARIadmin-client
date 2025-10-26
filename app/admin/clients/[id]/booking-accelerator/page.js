'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';

export default function AdminBookingAcceleratorConfig() {
  const params = useParams();
  const router = useRouter();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Card>
          <CardContent className="p-12 text-center">
            <Info className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Client-Side Configuration</h2>
            <p className="text-muted-foreground mb-6">
              Appointment Booking Accelerator is configured by the client through their portal.
            </p>
            <p className="text-sm text-muted-foreground">
              Client ID: {params.id}
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Clients access this at: <strong>/client/booking-accelerator</strong> (Coming in Phase 3)
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
