'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

export default function CalendarIntegrationSection({ config, setConfig }) {
  const updateCalendar = (field, value) => {
    setConfig({
      ...config,
      calendar: {
        ...config.calendar,
        [field]: value
      }
    });
  };

  const updateAvailability = (field, value) => {
    setConfig({
      ...config,
      calendar: {
        ...config.calendar,
        availability: {
          ...config.calendar.availability,
          [field]: value
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Calendar Provider */}
      <Card>
        <CardHeader>
          <CardTitle>Calendar Integration</CardTitle>
          <CardDescription>Connect your calendar system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Calendar Provider</Label>
            <Select
              value={config.calendar?.provider || 'calendly'}
              onValueChange={(value) => updateCalendar('provider', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="calendly">Calendly <Badge variant="secondary" className="ml-2">Popular</Badge></SelectItem>
                <SelectItem value="google">Google Calendar</SelectItem>
                <SelectItem value="outlook">Microsoft Outlook</SelectItem>
                <SelectItem value="custom">Custom API</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>API Key / Calendar URL</Label>
            <Input
              type="password"
              placeholder="Enter your API key or calendar URL"
              value={config.calendar?.apiKey || ''}
              onChange={(e) => updateCalendar('apiKey', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Calendar ID (if applicable)</Label>
            <Input
              placeholder="primary or specific calendar ID"
              value={config.calendar?.calendarId || ''}
              onChange={(e) => updateCalendar('calendarId', e.target.value)}
            />
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <Badge variant="outline" className="mr-2">Placeholder</Badge>
              Add real calendar credentials when ready
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Availability Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Availability Settings</CardTitle>
          <CardDescription>Configure booking rules and constraints</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Buffer Time Between Appointments (minutes)</Label>
            <Input
              type="number"
              placeholder="15"
              value={config.calendar?.availability?.bufferTime || ''}
              onChange={(e) => updateAvailability('bufferTime', parseInt(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Maximum Appointments Per Day</Label>
            <Input
              type="number"
              placeholder="10"
              value={config.calendar?.availability?.maxPerDay || ''}
              onChange={(e) => updateAvailability('maxPerDay', parseInt(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Advance Booking (days)</Label>
            <Input
              type="number"
              placeholder="30"
              value={config.calendar?.availability?.advanceBooking || ''}
              onChange={(e) => updateAvailability('advanceBooking', parseInt(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              How far in advance customers can book
            </p>
          </div>

          <div className="space-y-2">
            <Label>Minimum Notice (hours)</Label>
            <Input
              type="number"
              placeholder="24"
              value={config.calendar?.availability?.minimumNotice || ''}
              onChange={(e) => updateAvailability('minimumNotice', parseInt(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              Minimum time before appointment can be booked
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Meeting Types */}
      <Card>
        <CardHeader>
          <CardTitle>Meeting Types</CardTitle>
          <CardDescription>Define the types of appointments available</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Available Meeting Types (one per line)</Label>
            <Textarea
              placeholder="Initial Consultation - 30 min\nFollow-up Meeting - 15 min\nFull Service - 60 min"
              value={config.calendar?.meetingTypes?.join('\n') || ''}
              onChange={(e) => updateCalendar('meetingTypes', e.target.value.split('\n').filter(Boolean))}
              rows={5}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
