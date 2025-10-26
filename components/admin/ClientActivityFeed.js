'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Calendar, TrendingUp, Clock } from 'lucide-react';

export default function ClientActivityFeed({ clientId }) {
  // Mock activity data - in production, fetch from API
  const activities = [
    {
      id: 1,
      type: 'client_created',
      description: 'Client account created',
      timestamp: new Date(),
      icon: Clock
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'call':
        return Phone;
      case 'appointment':
        return Calendar;
      case 'lead':
        return TrendingUp;
      default:
        return Clock;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'call':
        return 'text-blue-500';
      case 'appointment':
        return 'text-green-500';
      case 'lead':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No activity yet
          </p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`p-2 rounded-full bg-muted ${getActivityColor(activity.type)}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
