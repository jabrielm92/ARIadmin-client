'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Upload } from 'lucide-react';

export default function LandingPageSection({ config, setConfig, clientId }) {
  const updateLandingPage = (field, value) => {
    setConfig({
      ...config,
      landingPage: {
        ...config.landingPage,
        [field]: value
      }
    });
  };

  const updateHero = (field, value) => {
    setConfig({
      ...config,
      landingPage: {
        ...config.landingPage,
        hero: {
          ...config.landingPage.hero,
          [field]: value
        }
      }
    });
  };

  const updateBranding = (field, value) => {
    setConfig({
      ...config,
      landingPage: {
        ...config.landingPage,
        branding: {
          ...config.landingPage.branding,
          [field]: value
        }
      }
    });
  };

  const updateSEO = (field, value) => {
    setConfig({
      ...config,
      landingPage: {
        ...config.landingPage,
        seo: {
          ...config.landingPage.seo,
          [field]: value
        }
      }
    });
  };

  const addBenefit = () => {
    const benefits = config.landingPage?.benefits || [];
    updateLandingPage('benefits', [
      ...benefits,
      { id: Date.now(), icon: 'check', title: '', description: '' }
    ]);
  };

  const updateBenefit = (id, field, value) => {
    const benefits = config.landingPage?.benefits || [];
    updateLandingPage(
      'benefits',
      benefits.map(b => b.id === id ? { ...b, [field]: value } : b)
    );
  };

  const deleteBenefit = (id) => {
    const benefits = config.landingPage?.benefits || [];
    updateLandingPage('benefits', benefits.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="hero" className="w-full">
        <TabsList>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Template Selection</CardTitle>
              <CardDescription>Choose a pre-built template for your landing page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {['professional', 'modern', 'minimal', 'bold'].map((template) => (
                  <Card
                    key={template}
                    className={`cursor-pointer border-2 transition-colors ${
                      config.landingPage?.template === template
                        ? 'border-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => updateLandingPage('template', template)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="h-32 bg-muted rounded mb-2 flex items-center justify-center">
                        <span className="text-sm text-muted-foreground capitalize">{template}</span>
                      </div>
                      <p className="font-medium capitalize">{template}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hero Content</CardTitle>
              <CardDescription>Main headline and call-to-action</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Headline</Label>
                <Input
                  placeholder="Book Your Appointment Today"
                  value={config.landingPage?.hero?.headline || ''}
                  onChange={(e) => updateHero('headline', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Subheadline</Label>
                <Input
                  placeholder="Schedule a consultation with our expert team"
                  value={config.landingPage?.hero?.subheadline || ''}
                  onChange={(e) => updateHero('subheadline', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>CTA Button Text</Label>
                <Input
                  placeholder="Book Now"
                  value={config.landingPage?.hero?.ctaText || ''}
                  onChange={(e) => updateHero('ctaText', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Background Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={config.landingPage?.hero?.backgroundImage || ''}
                    onChange={(e) => updateHero('backgroundImage', e.target.value)}
                  />
                  <Button variant="outline" size="icon" disabled>
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Recommended: 1920x1080px</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Video Instead</Label>
                  <p className="text-sm text-muted-foreground">
                    Display a video in the hero section
                  </p>
                </div>
                <Switch
                  checked={config.landingPage?.hero?.showVideo || false}
                  onCheckedChange={(checked) => updateHero('showVideo', checked)}
                />
              </div>

              {config.landingPage?.hero?.showVideo && (
                <div className="space-y-2">
                  <Label>Video URL (YouTube, Vimeo, or direct link)</Label>
                  <Input
                    placeholder="https://youtube.com/watch?v=..."
                    value={config.landingPage?.hero?.videoUrl || ''}
                    onChange={(e) => updateHero('videoUrl', e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Benefits */}
        <TabsContent value="benefits" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Benefits Section</CardTitle>
                  <CardDescription>Highlight key benefits of booking with you</CardDescription>
                </div>
                <Button onClick={addBenefit} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Benefit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {(!config.landingPage?.benefits || config.landingPage.benefits.length === 0) ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No benefits added yet. Click "Add Benefit" to get started.</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {config.landingPage.benefits.map((benefit) => (
                    <Card key={benefit.id} className="border-2">
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-4">
                            <div className="space-y-2">
                              <Label>Icon</Label>
                              <Select
                                value={benefit.icon}
                                onValueChange={(value) => updateBenefit(benefit.id, 'icon', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="check">✓ Check</SelectItem>
                                  <SelectItem value="calendar">📅 Calendar</SelectItem>
                                  <SelectItem value="clock">⏰ Clock</SelectItem>
                                  <SelectItem value="shield">🛡️ Shield</SelectItem>
                                  <SelectItem value="star">⭐ Star</SelectItem>
                                  <SelectItem value="heart">❤️ Heart</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Title</Label>
                              <Input
                                placeholder="Fast & Easy"
                                value={benefit.title}
                                onChange={(e) => updateBenefit(benefit.id, 'title', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Textarea
                                placeholder="Book in under 2 minutes"
                                value={benefit.description}
                                onChange={(e) => updateBenefit(benefit.id, 'description', e.target.value)}
                                rows={2}
                              />
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteBenefit(benefit.id)}
                            className="ml-2"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding */}
        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Brand Customization</CardTitle>
              <CardDescription>Customize colors and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Logo URL</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com/logo.png"
                    value={config.landingPage?.branding?.logo || ''}
                    onChange={(e) => updateBranding('logo', e.target.value)}
                  />
                  <Button variant="outline" size="icon" disabled>
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.landingPage?.branding?.primaryColor || '#1e3a8a'}
                      onChange={(e) => updateBranding('primaryColor', e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      value={config.landingPage?.branding?.primaryColor || '#1e3a8a'}
                      onChange={(e) => updateBranding('primaryColor', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.landingPage?.branding?.secondaryColor || '#14b8a6'}
                      onChange={(e) => updateBranding('secondaryColor', e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      value={config.landingPage?.branding?.secondaryColor || '#14b8a6'}
                      onChange={(e) => updateBranding('secondaryColor', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select
                  value={config.landingPage?.branding?.fontFamily || 'Inter'}
                  onValueChange={(value) => updateBranding('fontFamily', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                    <SelectItem value="Lato">Lato</SelectItem>
                    <SelectItem value="Montserrat">Montserrat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>Optimize for search engines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Page Title</Label>
                <Input
                  placeholder="Book an Appointment | Your Business Name"
                  value={config.landingPage?.seo?.title || ''}
                  onChange={(e) => updateSEO('title', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">50-60 characters recommended</p>
              </div>

              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea
                  placeholder="Schedule your appointment online. Easy booking in just a few clicks."
                  value={config.landingPage?.seo?.description || ''}
                  onChange={(e) => updateSEO('description', e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">150-160 characters recommended</p>
              </div>

              <div className="space-y-2">
                <Label>OG Image (Social Sharing)</Label>
                <Input
                  placeholder="https://example.com/og-image.jpg"
                  value={config.landingPage?.seo?.ogImage || ''}
                  onChange={(e) => updateSEO('ogImage', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">1200x630px recommended</p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Public URL:</strong> {config.publicUrl}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
