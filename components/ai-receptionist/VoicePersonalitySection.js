'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

export default function VoicePersonalitySection({ config, setConfig }) {
  const updateVoice = (field, value) => {
    setConfig({
      ...config,
      voice: {
        ...config.voice,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Voice Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Voice Selection</CardTitle>
          <CardDescription>Choose the voice for your AI receptionist</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Voice Provider</Label>
              <Select
                value={config.voice?.provider || 'vapi'}
                onValueChange={(value) => updateVoice('provider', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vapi">Vapi.ai <Badge variant="secondary" className="ml-2">Recommended</Badge></SelectItem>
                  <SelectItem value="bland">Bland AI</SelectItem>
                  <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Voice Type</Label>
              <Select
                value={config.voice?.type || 'female-professional'}
                onValueChange={(value) => updateVoice('type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female-professional">Female - Professional</SelectItem>
                  <SelectItem value="female-friendly">Female - Friendly</SelectItem>
                  <SelectItem value="female-energetic">Female - Energetic</SelectItem>
                  <SelectItem value="male-professional">Male - Professional</SelectItem>
                  <SelectItem value="male-friendly">Male - Friendly</SelectItem>
                  <SelectItem value="male-confident">Male - Confident</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Accent</Label>
            <Select
              value={config.voice?.accent || 'american'}
              onValueChange={(value) => updateVoice('accent', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="american">American</SelectItem>
                <SelectItem value="british">British</SelectItem>
                <SelectItem value="australian">Australian</SelectItem>
                <SelectItem value="indian">Indian</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Personality */}
      <Card>
        <CardHeader>
          <CardTitle>Personality Settings</CardTitle>
          <CardDescription>Define how your AI receptionist interacts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Personality Type</Label>
            <Select
              value={config.voice?.personality || 'professional'}
              onValueChange={(value) => updateVoice('personality', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional & Formal</SelectItem>
                <SelectItem value="friendly">Friendly & Warm</SelectItem>
                <SelectItem value="casual">Casual & Relaxed</SelectItem>
                <SelectItem value="enthusiastic">Enthusiastic & Energetic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Speaking Speed</Label>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Slow</span>
              <Slider
                value={[config.voice?.speed || 1]}
                min={0.5}
                max={1.5}
                step={0.1}
                onValueChange={(value) => updateVoice('speed', value[0])}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">Fast</span>
            </div>
            <p className="text-xs text-muted-foreground">Current: {config.voice?.speed || 1}x</p>
          </div>

          <div className="space-y-2">
            <Label>Tone</Label>
            <Select
              value={config.voice?.tone || 'neutral'}
              onValueChange={(value) => updateVoice('tone', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="upbeat">Upbeat</SelectItem>
                <SelectItem value="calm">Calm & Soothing</SelectItem>
                <SelectItem value="authoritative">Authoritative</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Voice Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Voice Preview</CardTitle>
          <CardDescription>Test how your AI receptionist sounds (placeholder)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Voice preview will be available when you connect your Vapi/Bland AI account
            </p>
            <Badge variant="secondary">Coming Soon</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
