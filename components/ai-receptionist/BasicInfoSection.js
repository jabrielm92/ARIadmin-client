'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function BasicInfoSection({ config, setConfig }) {
  const updateBasicInfo = (field, value) => {
    setConfig({
      ...config,
      basicInfo: {
        ...config.basicInfo,
        [field]: value
      }
    });
  };

  const updateBusinessHours = (day, field, value) => {
    setConfig({
      ...config,
      basicInfo: {
        ...config.basicInfo,
        businessHours: {
          ...config.basicInfo.businessHours,
          [day]: {
            ...config.basicInfo.businessHours[day],
            [field]: value
          }
        }
      }
    });
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Core details for your AI receptionist</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                placeholder="ABC Healthcare"
                value={config.basicInfo?.businessName || ''}
                onChange={(e) => updateBasicInfo('businessName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="receptionistName">Receptionist Name</Label>
              <Input
                id="receptionistName"
                placeholder="Sarah"
                value={config.basicInfo?.receptionistName || ''}
                onChange={(e) => updateBasicInfo('receptionistName', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">How the AI introduces itself</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={config.basicInfo?.timezone || 'America/New_York'}
                onValueChange={(value) => updateBasicInfo('timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern (ET)</SelectItem>
                  <SelectItem value="America/Chicago">Central (CT)</SelectItem>
                  <SelectItem value="America/Denver">Mountain (MT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific (PT)</SelectItem>
                  <SelectItem value="America/Phoenix">Arizona (MST)</SelectItem>
                  <SelectItem value="America/Anchorage">Alaska (AKT)</SelectItem>
                  <SelectItem value="Pacific/Honolulu">Hawaii (HST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Primary Language</Label>
              <Select
                value={config.basicInfo?.language || 'english'}
                onValueChange={(value) => updateBasicInfo('language', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="german">German</SelectItem>
                  <SelectItem value="mandarin">Mandarin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Business Hours</CardTitle>
          <CardDescription>Set your operating hours for each day</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {days.map((day) => (
            <div key={day} className="grid gap-4 md:grid-cols-4 items-center">
              <div className="font-medium capitalize">{day}</div>
              <div className="flex items-center space-x-2">
                <Input
                  type="time"
                  value={config.basicInfo?.businessHours?.[day]?.open || '09:00'}
                  onChange={(e) => updateBusinessHours(day, 'open', e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="time"
                  value={config.basicInfo?.businessHours?.[day]?.close || '17:00'}
                  onChange={(e) => updateBusinessHours(day, 'close', e.target.value)}
                />
              </div>
              <div>
                <Select
                  value={config.basicInfo?.businessHours?.[day]?.status || 'open'}
                  onValueChange={(value) => updateBusinessHours(day, 'status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
