'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

export default function CallRoutingSection({ config, setConfig }) {
  const updateRouting = (field, value) => {
    setConfig({
      ...config,
      callRouting: {
        ...config.callRouting,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Call Forwarding */}
      <Card>
        <CardHeader>
          <CardTitle>Call Forwarding</CardTitle>
          <CardDescription>Set up rules for when calls should be transferred</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Forward to Number</Label>
            <Input
              placeholder="+1-555-0123"
              value={config.callRouting?.forwardNumber || ''}
              onChange={(e) => updateRouting('forwardNumber', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Number to forward calls when AI can't help</p>
          </div>

          <div className="space-y-2">
            <Label>Forward Timeout (seconds)</Label>
            <Input
              type="number"
              placeholder="30"
              value={config.callRouting?.forwardTimeout || '30'}
              onChange={(e) => updateRouting('forwardTimeout', e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Voicemail</Label>
              <p className="text-sm text-muted-foreground">
                Allow callers to leave a voicemail if no one answers
              </p>
            </div>
            <Switch
              checked={config.callRouting?.voicemailEnabled || false}
              onCheckedChange={(checked) => updateRouting('voicemailEnabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Business Hours Routing */}
      <Card>
        <CardHeader>
          <CardTitle>Business Hours Routing</CardTitle>
          <CardDescription>Different behavior during and after business hours</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>During Business Hours</Label>
            <Select
              value={config.callRouting?.duringHoursAction || 'ai-only'}
              onValueChange={(value) => updateRouting('duringHoursAction', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ai-only">AI handles all calls</SelectItem>
                <SelectItem value="ai-then-forward">AI first, then forward if needed</SelectItem>
                <SelectItem value="forward-immediately">Forward immediately</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>After Business Hours</Label>
            <Select
              value={config.callRouting?.afterHoursAction || 'voicemail'}
              onValueChange={(value) => updateRouting('afterHoursAction', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ai-only">AI handles all calls</SelectItem>
                <SelectItem value="voicemail">Send to voicemail</SelectItem>
                <SelectItem value="emergency-only">Emergency calls only</SelectItem>
                <SelectItem value="forward">Forward to on-call number</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {config.callRouting?.afterHoursAction === 'forward' && (
            <div className="space-y-2">
              <Label>After Hours Forward Number</Label>
              <Input
                placeholder="+1-555-9999"
                value={config.callRouting?.afterHoursNumber || ''}
                onChange={(e) => updateRouting('afterHoursNumber', e.target.value)}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Emergency & VIP Handling */}
      <Card>
        <CardHeader>
          <CardTitle>Special Call Handling</CardTitle>
          <CardDescription>Configure emergency and VIP caller detection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Emergency Call Detection</Label>
              <p className="text-sm text-muted-foreground">
                AI will detect urgent keywords and prioritize accordingly
              </p>
            </div>
            <Switch
              checked={config.callRouting?.emergencyDetection || false}
              onCheckedChange={(checked) => updateRouting('emergencyDetection', checked)}
            />
          </div>

          {config.callRouting?.emergencyDetection && (
            <div className="space-y-2">
              <Label>Emergency Forward Number</Label>
              <Input
                placeholder="+1-555-0911"
                value={config.callRouting?.emergencyNumber || ''}
                onChange={(e) => updateRouting('emergencyNumber', e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>VIP Caller Numbers (one per line)</Label>
            <Textarea
              placeholder="+1-555-0001\n+1-555-0002\n+1-555-0003"
              value={config.callRouting?.vipNumbers || ''}
              onChange={(e) => updateRouting('vipNumbers', e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              VIP callers will be prioritized and can bypass certain restrictions
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Call Recording */}
      <Card>
        <CardHeader>
          <CardTitle>Call Recording & Transcription</CardTitle>
          <CardDescription>Configure recording and transcription settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Record All Calls</Label>
              <p className="text-sm text-muted-foreground">
                Save recordings for quality assurance and training
              </p>
            </div>
            <Switch
              checked={config.callRouting?.recordCalls || true}
              onCheckedChange={(checked) => updateRouting('recordCalls', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Transcribe Calls</Label>
              <p className="text-sm text-muted-foreground">
                Generate text transcripts of all calls
              </p>
            </div>
            <Switch
              checked={config.callRouting?.transcribeCalls || true}
              onCheckedChange={(checked) => updateRouting('transcribeCalls', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Call Whisper</Label>
              <p className="text-sm text-muted-foreground">
                Announce caller info before connecting forwarded calls
              </p>
            </div>
            <Switch
              checked={config.callRouting?.callWhisper || false}
              onCheckedChange={(checked) => updateRouting('callWhisper', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
