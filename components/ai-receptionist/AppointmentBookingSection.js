'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

export default function AppointmentBookingSection({ config, setConfig }) {
  const updateBooking = (field, value) => {
    setConfig({
      ...config,
      appointmentBooking: {
        ...config.appointmentBooking,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Enable Booking */}
      <Card>
        <CardHeader>
          <CardTitle>Appointment Booking</CardTitle>
          <CardDescription>Allow AI to book appointments during calls</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Appointment Booking</Label>
              <p className="text-sm text-muted-foreground">
                AI can schedule appointments directly with callers
              </p>
            </div>
            <Switch
              checked={config.appointmentBooking?.enabled || false}
              onCheckedChange={(checked) => updateBooking('enabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {config.appointmentBooking?.enabled && (
        <>
          {/* Calendar Integration */}
          <Card>
            <CardHeader>
              <CardTitle>Calendar Integration</CardTitle>
              <CardDescription>Connect your calendar system (placeholder)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Calendar Provider</Label>
                <Select
                  value={config.appointmentBooking?.provider || 'calendly'}
                  onValueChange={(value) => updateBooking('provider', value)}
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
                  placeholder="Enter your Calendly API key or calendar URL"
                  value={config.appointmentBooking?.apiKey || ''}
                  onChange={(e) => updateBooking('apiKey', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  <Badge variant="outline" className="mr-2">Placeholder</Badge>
                  You'll add real credentials later
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Appointment Types */}
          <Card>
            <CardHeader>
              <CardTitle>Appointment Types</CardTitle>
              <CardDescription>Define the types of appointments available</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Available Appointment Types (one per line)</Label>
                <Textarea
                  placeholder="Initial Consultation - 30 min\nFollow-up Visit - 15 min\nService Appointment - 60 min"
                  value={config.appointmentBooking?.appointmentTypes || ''}
                  onChange={(e) => updateBooking('appointmentTypes', e.target.value)}
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label>Default Appointment Duration</Label>
                <Select
                  value={config.appointmentBooking?.defaultDuration || '30'}
                  onValueChange={(value) => updateBooking('defaultDuration', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Buffer Time Between Appointments</Label>
                <Select
                  value={config.appointmentBooking?.bufferTime || '0'}
                  onValueChange={(value) => updateBooking('bufferTime', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No buffer</SelectItem>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Confirmation & Reminders */}
          <Card>
            <CardHeader>
              <CardTitle>Confirmation & Reminders</CardTitle>
              <CardDescription>Set up automated notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Send Confirmation Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Email sent immediately after booking
                  </p>
                </div>
                <Switch
                  checked={config.appointmentBooking?.sendConfirmation || true}
                  onCheckedChange={(checked) => updateBooking('sendConfirmation', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Send Confirmation SMS</Label>
                  <p className="text-sm text-muted-foreground">
                    Text message confirmation
                  </p>
                </div>
                <Switch
                  checked={config.appointmentBooking?.sendSMS || false}
                  onCheckedChange={(checked) => updateBooking('sendSMS', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Reminder Schedule</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="reminder-24h" className="rounded" defaultChecked />
                    <Label htmlFor="reminder-24h" className="font-normal">24 hours before</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="reminder-1h" className="rounded" defaultChecked />
                    <Label htmlFor="reminder-1h" className="font-normal">1 hour before</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="reminder-15m" className="rounded" />
                    <Label htmlFor="reminder-15m" className="font-normal">15 minutes before</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Confirmation Email Template</Label>
                <Textarea
                  placeholder="Thank you for booking! Your appointment is confirmed for [DATE] at [TIME]..."
                  value={config.appointmentBooking?.confirmationTemplate || ''}
                  onChange={(e) => updateBooking('confirmationTemplate', e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Booking Rules */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Rules</CardTitle>
              <CardDescription>Set constraints and availability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Maximum Appointments Per Day</Label>
                <Input
                  type="number"
                  placeholder="10"
                  value={config.appointmentBooking?.maxPerDay || ''}
                  onChange={(e) => updateBooking('maxPerDay', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Advance Booking Time (days)</Label>
                <Input
                  type="number"
                  placeholder="30"
                  value={config.appointmentBooking?.advanceBooking || '30'}
                  onChange={(e) => updateBooking('advanceBooking', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  How far in advance customers can book
                </p>
              </div>

              <div className="space-y-2">
                <Label>Minimum Notice (hours)</Label>
                <Input
                  type="number"
                  placeholder="2"
                  value={config.appointmentBooking?.minimumNotice || '2'}
                  onChange={(e) => updateBooking('minimumNotice', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Minimum time before appointment can be booked
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
