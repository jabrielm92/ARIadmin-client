'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Calendar, TrendingUp, Mail, Clock, CheckCircle } from 'lucide-react';

export default function ClientOverview({ client }) {
  const getServiceCount = () => {
    let count = 0;
    if (client.services?.aiReceptionist?.enabled) count++;
    if (client.services?.bookingAccelerator?.enabled) count++;
    if (client.services?.leadGen?.enabled) count++;
    return count;
  };

  const getSetupProgress = () => {
    let total = 0;
    let completed = 0;

    if (client.services?.aiReceptionist?.enabled) {
      total++;
      if (client.services.aiReceptionist.setupComplete) completed++;
    }
    if (client.services?.bookingAccelerator?.enabled) {
      total++;
      if (client.services.bookingAccelerator.setupComplete) completed++;
    }
    if (client.services?.leadGen?.enabled) {
      total++;
      if (client.services.leadGen.setupComplete) completed++;
    }

    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Status & Services */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
              <Badge variant={client.status === 'active' ? 'default' : 'secondary'} className="text-sm">
                {client.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Active Services</p>
              <p className="text-2xl font-bold">{getServiceCount()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Setup Progress</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all"
                    style={{ width: `${getSetupProgress()}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{getSetupProgress()}%</span>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Member Since</p>
              <p className="text-sm">
                {new Date(client.createdAt).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <p className="text-sm">
                {new Date(client.updatedAt).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>

          {/* Service Status Badges */}
          <div className="pt-4 border-t">
            <p className="text-sm font-medium text-muted-foreground mb-2">Services Status</p>
            <div className="flex flex-wrap gap-2">
              {client.services?.aiReceptionist?.enabled && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  AI Receptionist
                  {client.services.aiReceptionist.setupComplete && (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  )}
                </Badge>
              )}
              {client.services?.bookingAccelerator?.enabled && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Booking Accelerator
                  {client.services.bookingAccelerator.setupComplete && (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  )}
                </Badge>
              )}
              {client.services?.leadGen?.enabled && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Lead Gen
                  {client.services.leadGen.setupComplete && (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  )}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
