'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AutomationSection({ config, setConfig }) {
  const updateEmailSequence = (type, field, value) => {
    setConfig({
      ...config,
      automation: {
        ...config.automation,
        emailSequences: {
          ...config.automation.emailSequences,
          [type]: {
            ...config.automation.emailSequences[type],
            [field]: value
          }
        }
      }
    });
  };

  const updateSMSSequence = (type, field, value) => {
    setConfig({
      ...config,
      automation: {
        ...config.automation,
        smsSequences: {
          ...config.automation.smsSequences,
          [type]: {
            ...config.automation.smsSequences[type],
            [field]: value
          }
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="email" className="w-full">
        <TabsList>
          <TabsTrigger value="email">Email Sequences</TabsTrigger>
          <TabsTrigger value="sms">SMS Sequences</TabsTrigger>
        </TabsList>

        {/* Email Sequences */}
        <TabsContent value="email" className="space-y-4">
          {/* Confirmation Email */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Confirmation Email</CardTitle>
                  <CardDescription>Sent immediately after booking</CardDescription>
                </div>
                <Switch
                  checked={config.automation?.emailSequences?.confirmation?.enabled || false}
                  onCheckedChange={(checked) => updateEmailSequence('confirmation', 'enabled', checked)}
                />
              </div>
            </CardHeader>
            {config.automation?.emailSequences?.confirmation?.enabled && (
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Subject Line</Label>
                  <Input
                    placeholder="Your appointment is confirmed"
                    value={config.automation?.emailSequences?.confirmation?.subject || ''}
                    onChange={(e) => updateEmailSequence('confirmation', 'subject', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Body</Label>
                  <Textarea
                    placeholder="Thank you for booking! Your appointment is confirmed for [DATE] at [TIME]..."
                    value={config.automation?.emailSequences?.confirmation?.body || ''}
                    onChange={(e) => updateEmailSequence('confirmation', 'body', e.target.value)}
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use [DATE], [TIME], [NAME], [SERVICE] as placeholders
                  </p>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Reminder Email */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Reminder Email</CardTitle>
                  <CardDescription>Sent before the appointment</CardDescription>
                </div>
                <Switch
                  checked={config.automation?.emailSequences?.reminder?.enabled || false}
                  onCheckedChange={(checked) => updateEmailSequence('reminder', 'enabled', checked)}
                />
              </div>
            </CardHeader>
            {config.automation?.emailSequences?.reminder?.enabled && (
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Send Timing</Label>
                  <Input
                    placeholder="24h (e.g., 1h, 24h, 48h)"
                    value={config.automation?.emailSequences?.reminder?.timing || ''}
                    onChange={(e) => updateEmailSequence('reminder', 'timing', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">How many hours before appointment</p>
                </div>
                <div className="space-y-2">
                  <Label>Subject Line</Label>
                  <Input
                    placeholder="Reminder: Your appointment is tomorrow"
                    value={config.automation?.emailSequences?.reminder?.subject || ''}
                    onChange={(e) => updateEmailSequence('reminder', 'subject', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Body</Label>
                  <Textarea
                    placeholder="This is a reminder that your appointment is scheduled for [DATE] at [TIME]..."
                    value={config.automation?.emailSequences?.reminder?.body || ''}
                    onChange={(e) => updateEmailSequence('reminder', 'body', e.target.value)}
                    rows={6}
                  />
                </div>
              </CardContent>
            )}
          </Card>

          {/* Follow-up Email */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Follow-up Email</CardTitle>
                  <CardDescription>Sent after the appointment</CardDescription>
                </div>
                <Switch
                  checked={config.automation?.emailSequences?.followUp?.enabled || false}
                  onCheckedChange={(checked) => updateEmailSequence('followUp', 'enabled', checked)}
                />
              </div>
            </CardHeader>
            {config.automation?.emailSequences?.followUp?.enabled && (
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Send Timing</Label>
                  <Input
                    placeholder="1d (e.g., 1d, 3d, 7d)"
                    value={config.automation?.emailSequences?.followUp?.timing || ''}
                    onChange={(e) => updateEmailSequence('followUp', 'timing', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">How many days after appointment</p>
                </div>
                <div className="space-y-2">
                  <Label>Subject Line</Label>
                  <Input
                    placeholder="Thank you for your time"
                    value={config.automation?.emailSequences?.followUp?.subject || ''}
                    onChange={(e) => updateEmailSequence('followUp', 'subject', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Body</Label>
                  <Textarea
                    placeholder="Thank you for meeting with us. We hope you found it valuable..."
                    value={config.automation?.emailSequences?.followUp?.body || ''}
                    onChange={(e) => updateEmailSequence('followUp', 'body', e.target.value)}
                    rows={6}
                  />
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        {/* SMS Sequences */}
        <TabsContent value="sms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SMS Confirmation</CardTitle>
              <CardDescription>Send confirmation via SMS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable SMS Confirmation</Label>
                <Switch
                  checked={config.automation?.smsSequences?.confirmation?.enabled || false}
                  onCheckedChange={(checked) => updateSMSSequence('confirmation', 'enabled', checked)}
                />
              </div>
              {config.automation?.smsSequences?.confirmation?.enabled && (
                <div className="space-y-2">
                  <Label>SMS Message</Label>
                  <Textarea
                    placeholder="Hi [NAME], your appointment is confirmed for [DATE] at [TIME]. See you then!"
                    value={config.automation?.smsSequences?.confirmation?.message || ''}
                    onChange={(e) => updateSMSSequence('confirmation', 'message', e.target.value)}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">160 characters recommended</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SMS Reminder</CardTitle>
              <CardDescription>Send reminder via SMS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable SMS Reminder</Label>
                <Switch
                  checked={config.automation?.smsSequences?.reminder?.enabled || false}
                  onCheckedChange={(checked) => updateSMSSequence('reminder', 'enabled', checked)}
                />
              </div>
              {config.automation?.smsSequences?.reminder?.enabled && (
                <div className="space-y-2">
                  <Label>SMS Message</Label>
                  <Textarea
                    placeholder="Reminder: You have an appointment tomorrow at [TIME]. Reply CONFIRM to confirm."
                    value={config.automation?.smsSequences?.reminder?.message || ''}
                    onChange={(e) => updateSMSSequence('reminder', 'message', e.target.value)}
                    rows={3}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
