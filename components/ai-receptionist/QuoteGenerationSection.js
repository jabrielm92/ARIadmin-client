'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

export default function QuoteGenerationSection({ config, setConfig }) {
  const updateQuotes = (field, value) => {
    setConfig({
      ...config,
      quoteGeneration: {
        ...config.quoteGeneration,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Enable Quote Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Quote Generation</CardTitle>
          <CardDescription>Allow AI to provide pricing quotes to callers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Quote Generation</Label>
              <p className="text-sm text-muted-foreground">
                AI can provide price estimates during calls
              </p>
            </div>
            <Switch
              checked={config.quoteGeneration?.enabled || false}
              onCheckedChange={(checked) => updateQuotes('enabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {config.quoteGeneration?.enabled && (
        <>
          {/* Pricing Rules */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing Rules</CardTitle>
              <CardDescription>Define how the AI calculates quotes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Pricing Strategy</Label>
                <Select
                  value={config.quoteGeneration?.strategy || 'fixed'}
                  onValueChange={(value) => updateQuotes('strategy', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Price (per service)</SelectItem>
                    <SelectItem value="hourly">Hourly Rate</SelectItem>
                    <SelectItem value="custom">Custom Quote (AI considers factors)</SelectItem>
                    <SelectItem value="range">Price Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Base Service Pricing (one per line)</Label>
                <Textarea
                  placeholder="Consultation: $100\nInstallation: $500-$1000\nMaintenance: $75/hour"
                  value={config.quoteGeneration?.basePricing || ''}
                  onChange={(e) => updateQuotes('basePricing', e.target.value)}
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label>Tax Rate (%)</Label>
                <Input
                  type="number"
                  placeholder="8.5"
                  value={config.quoteGeneration?.taxRate || ''}
                  onChange={(e) => updateQuotes('taxRate', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Discount Rules */}
          <Card>
            <CardHeader>
              <CardTitle>Discount Rules</CardTitle>
              <CardDescription>Automatic discounts the AI can apply</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Volume Discounts</Label>
                <Textarea
                  placeholder="2+ services: 10% off\n5+ services: 20% off\n10+ services: 30% off"
                  value={config.quoteGeneration?.volumeDiscounts || ''}
                  onChange={(e) => updateQuotes('volumeDiscounts', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Seasonal Discounts</Label>
                <Textarea
                  placeholder="Summer Special: 15% off installations\nNew Customer: 10% off first service"
                  value={config.quoteGeneration?.seasonalDiscounts || ''}
                  onChange={(e) => updateQuotes('seasonalDiscounts', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Promo Codes</Label>
                <Textarea
                  placeholder="WELCOME10: 10% off\nREFER20: 20% off for referrals"
                  value={config.quoteGeneration?.promoCodes || ''}
                  onChange={(e) => updateQuotes('promoCodes', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Approval Workflow */}
          <Card>
            <CardHeader>
              <CardTitle>Approval Workflow</CardTitle>
              <CardDescription>Set limits on what AI can quote without approval</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Auto-Approve Up To ($)</Label>
                <Input
                  type="number"
                  placeholder="1000"
                  value={config.quoteGeneration?.autoApproveLimit || ''}
                  onChange={(e) => updateQuotes('autoApproveLimit', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  AI can provide quotes up to this amount without requiring manager approval
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Manager Approval</Label>
                  <p className="text-sm text-muted-foreground">
                    All quotes above limit need manual approval
                  </p>
                </div>
                <Switch
                  checked={config.quoteGeneration?.requireApproval || false}
                  onCheckedChange={(checked) => updateQuotes('requireApproval', checked)}
                />
              </div>

              {config.quoteGeneration?.requireApproval && (
                <div className="space-y-2">
                  <Label>Approval Email</Label>
                  <Input
                    type="email"
                    placeholder="manager@company.com"
                    value={config.quoteGeneration?.approvalEmail || ''}
                    onChange={(e) => updateQuotes('approvalEmail', e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quote Email Template */}
          <Card>
            <CardHeader>
              <CardTitle>Quote Email Template</CardTitle>
              <CardDescription>Customize the quote email sent to customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Subject Line</Label>
                <Input
                  placeholder="Your Quote from [BUSINESS_NAME]"
                  value={config.quoteGeneration?.emailSubject || ''}
                  onChange={(e) => updateQuotes('emailSubject', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Email Body</Label>
                <Textarea
                  placeholder="Thank you for your interest! Here's your personalized quote...\n\n[QUOTE_DETAILS]\n\nTotal: [TOTAL_AMOUNT]\n\nThis quote is valid for 30 days."
                  value={config.quoteGeneration?.emailTemplate || ''}
                  onChange={(e) => updateQuotes('emailTemplate', e.target.value)}
                  rows={8}
                />
                <p className="text-xs text-muted-foreground">
                  Use [QUOTE_DETAILS], [TOTAL_AMOUNT], [CUSTOMER_NAME], [BUSINESS_NAME] as placeholders
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Send Quote Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically email quotes after call
                  </p>
                </div>
                <Switch
                  checked={config.quoteGeneration?.autoSendEmail || true}
                  onCheckedChange={(checked) => updateQuotes('autoSendEmail', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Follow-up */}
          <Card>
            <CardHeader>
              <CardTitle>Follow-up Sequence</CardTitle>
              <CardDescription>Automated follow-ups for quotes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Follow-up Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Send reminder emails if customer doesn't respond
                  </p>
                </div>
                <Switch
                  checked={config.quoteGeneration?.followUpEnabled || false}
                  onCheckedChange={(checked) => updateQuotes('followUpEnabled', checked)}
                />
              </div>

              {config.quoteGeneration?.followUpEnabled && (
                <div className="space-y-2">
                  <Label>Follow-up Schedule</Label>
                  <Textarea
                    placeholder="Day 3: First reminder\nDay 7: Second reminder\nDay 14: Final reminder"
                    value={config.quoteGeneration?.followUpSchedule || ''}
                    onChange={(e) => updateQuotes('followUpSchedule', e.target.value)}
                    rows={3}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
