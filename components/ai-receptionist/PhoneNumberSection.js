'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Check } from 'lucide-react';

export default function PhoneNumberSection({ config, setConfig }) {
  const updatePhone = (field, value) => {
    setConfig({
      ...config,
      phoneNumber: {
        ...config.phoneNumber,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Phone Number Management */}
      <Card>
        <CardHeader>
          <CardTitle>Phone Number Management</CardTitle>
          <CardDescription>Configure your Twilio phone number (placeholder)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Twilio Account SID</Label>
            <Input
              type="password"
              placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={config.phoneNumber?.twilioSID || ''}
              onChange={(e) => updatePhone('twilioSID', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Twilio Auth Token</Label>
            <Input
              type="password"
              placeholder="your_auth_token_here"
              value={config.phoneNumber?.twilioToken || ''}
              onChange={(e) => updatePhone('twilioToken', e.target.value)}
            />
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <Badge variant="outline" className="mr-2">Placeholder</Badge>
              You'll add real Twilio credentials later. This section is for configuration only.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Assigned Phone Number */}
      <Card>
        <CardHeader>
          <CardTitle>Assigned Phone Number</CardTitle>
          <CardDescription>The phone number your clients will call</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <div className="flex gap-2">
              <Input
                placeholder="+1-555-0123"
                value={config.phoneNumber?.number || ''}
                onChange={(e) => updatePhone('number', e.target.value)}
              />
              <Button variant="outline" size="icon" disabled>
                <Phone className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              This number will be connected to your AI receptionist
            </p>
          </div>

          <div className="space-y-2">
            <Label>Display Number</Label>
            <Select
              value={config.phoneNumber?.displayOption || 'twilio'}
              onValueChange={(value) => updatePhone('displayOption', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="twilio">Use Twilio Number</SelectItem>
                <SelectItem value="business">Use Business Number</SelectItem>
                <SelectItem value="custom">Custom Number</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Number shown on caller ID when AI calls out
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recording & Transcription */}
      <Card>
        <CardHeader>
          <CardTitle>Call Recording & Transcription</CardTitle>
          <CardDescription>Configure recording and transcription settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Call Recording</Label>
              <p className="text-sm text-muted-foreground">
                Record all calls for quality assurance
              </p>
            </div>
            <Switch
              checked={config.phoneNumber?.recordCalls || true}
              onCheckedChange={(checked) => updatePhone('recordCalls', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Transcription</Label>
              <p className="text-sm text-muted-foreground">
                Generate text transcripts of all calls
              </p>
            </div>
            <Switch
              checked={config.phoneNumber?.transcribe || true}
              onCheckedChange={(checked) => updatePhone('transcribe', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label>Recording Storage</Label>
            <Select
              value={config.phoneNumber?.storage || 'twilio'}
              onValueChange={(value) => updatePhone('storage', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="twilio">Twilio Cloud</SelectItem>
                <SelectItem value="s3">Amazon S3</SelectItem>
                <SelectItem value="google">Google Cloud Storage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Recording Retention (days)</Label>
            <Input
              type="number"
              placeholder="90"
              value={config.phoneNumber?.retention || '90'}
              onChange={(e) => updatePhone('retention', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Advanced Phone Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
          <CardDescription>Additional phone configuration options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Call Screening</Label>
              <p className="text-sm text-muted-foreground">
                Screen calls before connecting to AI
              </p>
            </div>
            <Switch
              checked={config.phoneNumber?.callScreening || false}
              onCheckedChange={(checked) => updatePhone('callScreening', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Spam Protection</Label>
              <p className="text-sm text-muted-foreground">
                Block known spam callers
              </p>
            </div>
            <Switch
              checked={config.phoneNumber?.spamProtection || true}
              onCheckedChange={(checked) => updatePhone('spamProtection', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>International Calls</Label>
              <p className="text-sm text-muted-foreground">
                Allow calls from international numbers
              </p>
            </div>
            <Switch
              checked={config.phoneNumber?.allowInternational || false}
              onCheckedChange={(checked) => updatePhone('allowInternational', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label>Music on Hold</Label>
            <Select
              value={config.phoneNumber?.musicOnHold || 'default'}
              onValueChange={(value) => updatePhone('musicOnHold', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default Music</SelectItem>
                <SelectItem value="classical">Classical</SelectItem>
                <SelectItem value="jazz">Jazz</SelectItem>
                <SelectItem value="ambient">Ambient</SelectItem>
                <SelectItem value="custom">Custom Upload</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
