'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

export default function IntegrationsSection({ config, setConfig }) {
  const updateIntegrations = (field, value) => {
    setConfig({
      ...config,
      integrations: {
        ...config.integrations,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* CRM Integration */}
      <Card>
        <CardHeader>
          <CardTitle>CRM Integration</CardTitle>
          <CardDescription>Connect to your CRM system (placeholder)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>CRM Platform</Label>
            <Select
              value={config.integrations?.crm || 'none'}
              onValueChange={(value) => updateIntegrations('crm', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="hubspot">HubSpot</SelectItem>
                <SelectItem value="salesforce">Salesforce</SelectItem>
                <SelectItem value="pipedrive">Pipedrive</SelectItem>
                <SelectItem value="zoho">Zoho CRM</SelectItem>
                <SelectItem value="custom">Custom API</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {config.integrations?.crm && config.integrations.crm !== 'none' && (
            <>
              <div className="space-y-2">
                <Label>API Key</Label>
                <Input
                  type="password"
                  placeholder="Enter your CRM API key"
                  value={config.integrations?.crmApiKey || ''}
                  onChange={(e) => updateIntegrations('crmApiKey', e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-create Contacts</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically create CRM contacts from calls
                  </p>
                </div>
                <Switch
                  checked={config.integrations?.autoCreateContacts || false}
                  onCheckedChange={(checked) => updateIntegrations('autoCreateContacts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sync Call History</Label>
                  <p className="text-sm text-muted-foreground">
                    Log calls in CRM activity timeline
                  </p>
                </div>
                <Switch
                  checked={config.integrations?.syncCallHistory || false}
                  onCheckedChange={(checked) => updateIntegrations('syncCallHistory', checked)}
                />
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <Badge variant="outline" className="mr-2">Placeholder</Badge>
                  CRM integration will be active when you add real credentials
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Webhook Integration */}
      <Card>
        <CardHeader>
          <CardTitle>Webhooks</CardTitle>
          <CardDescription>Send real-time events to your systems</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <Input
              placeholder="https://your-domain.com/webhook"
              value={config.integrations?.webhookUrl || ''}
              onChange={(e) => updateIntegrations('webhookUrl', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              POST requests will be sent to this URL for call events
            </p>
          </div>

          <div className="space-y-2">
            <Label>Webhook Secret</Label>
            <Input
              type="password"
              placeholder="webhook_secret_key"
              value={config.integrations?.webhookSecret || ''}
              onChange={(e) => updateIntegrations('webhookSecret', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Used to verify webhook authenticity
            </p>
          </div>

          <div className="space-y-2">
            <Label>Events to Send</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="event-call-started" className="rounded" defaultChecked />
                <Label htmlFor="event-call-started" className="font-normal">Call Started</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="event-call-ended" className="rounded" defaultChecked />
                <Label htmlFor="event-call-ended" className="font-normal">Call Ended</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="event-appointment" className="rounded" defaultChecked />
                <Label htmlFor="event-appointment" className="font-normal">Appointment Booked</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="event-quote" className="rounded" />
                <Label htmlFor="event-quote" className="font-normal">Quote Generated</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="event-transfer" className="rounded" />
                <Label htmlFor="event-transfer" className="font-normal">Call Transferred</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Slack Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Slack Notifications</CardTitle>
          <CardDescription>Get real-time alerts in Slack</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Slack Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Send call notifications to Slack channel
              </p>
            </div>
            <Switch
              checked={config.integrations?.slackEnabled || false}
              onCheckedChange={(checked) => updateIntegrations('slackEnabled', checked)}
            />
          </div>

          {config.integrations?.slackEnabled && (
            <>
              <div className="space-y-2">
                <Label>Slack Webhook URL</Label>
                <Input
                  placeholder="https://hooks.slack.com/services/..."
                  value={config.integrations?.slackWebhook || ''}
                  onChange={(e) => updateIntegrations('slackWebhook', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Notification Triggers</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="slack-important" className="rounded" defaultChecked />
                    <Label htmlFor="slack-important" className="font-normal">Important Calls Only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="slack-missed" className="rounded" defaultChecked />
                    <Label htmlFor="slack-missed" className="font-normal">Missed Calls</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="slack-appointments" className="rounded" />
                    <Label htmlFor="slack-appointments" className="font-normal">New Appointments</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="slack-emergency" className="rounded" defaultChecked />
                    <Label htmlFor="slack-emergency" className="font-normal">Emergency Calls</Label>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>Configure email alerts for your team</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Notification Email(s)</Label>
            <Textarea
              placeholder="manager@company.com\nsales@company.com\nsupport@company.com"
              value={config.integrations?.notificationEmails || ''}
              onChange={(e) => updateIntegrations('notificationEmails', e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              One email per line. These addresses will receive call notifications.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Notification Frequency</Label>
            <Select
              value={config.integrations?.emailFrequency || 'immediate'}
              onValueChange={(value) => updateIntegrations('emailFrequency', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate (per call)</SelectItem>
                <SelectItem value="hourly">Hourly Digest</SelectItem>
                <SelectItem value="daily">Daily Summary</SelectItem>
                <SelectItem value="weekly">Weekly Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Include Call Transcripts</Label>
              <p className="text-sm text-muted-foreground">
                Attach full transcripts to email notifications
              </p>
            </div>
            <Switch
              checked={config.integrations?.includeTranscripts || false}
              onCheckedChange={(checked) => updateIntegrations('includeTranscripts', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Zapier/Make Integration */}
      <Card>
        <CardHeader>
          <CardTitle>Zapier / Make.com</CardTitle>
          <CardDescription>Connect to thousands of apps</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Zapier Integration</Label>
              <p className="text-sm text-muted-foreground">
                Use webhooks to connect with Zapier or Make.com
              </p>
            </div>
            <Switch
              checked={config.integrations?.zapierEnabled || false}
              onCheckedChange={(checked) => updateIntegrations('zapierEnabled', checked)}
            />
          </div>

          {config.integrations?.zapierEnabled && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                Your webhook URL: <code className="bg-blue-100 px-2 py-1 rounded">https://api.arisolutions.com/webhooks/{'{client_id}'}</code>
              </p>
              <p className="text-xs text-blue-600 mt-2">
                Use this URL in your Zapier or Make.com workflows
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
