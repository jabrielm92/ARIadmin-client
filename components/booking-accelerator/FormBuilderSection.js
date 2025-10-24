'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, GripVertical } from 'lucide-react';

export default function FormBuilderSection({ config, setConfig }) {
  const updateFormSettings = (field, value) => {
    setConfig({
      ...config,
      formSettings: {
        ...config.formSettings,
        [field]: value
      }
    });
  };

  const addField = () => {
    const fields = config.formFields || [];
    setConfig({
      ...config,
      formFields: [
        ...fields,
        { id: Date.now(), type: 'text', label: '', required: false, placeholder: '' }
      ]
    });
  };

  const updateField = (id, field, value) => {
    const fields = config.formFields || [];
    setConfig({
      ...config,
      formFields: fields.map(f => f.id === id ? { ...f, [field]: value } : f)
    });
  };

  const deleteField = (id) => {
    const fields = config.formFields || [];
    setConfig({
      ...config,
      formFields: fields.filter(f => f.id !== id)
    });
  };

  return (
    <div className="space-y-6">
      {/* Form Fields */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Form Fields</CardTitle>
              <CardDescription>Drag and drop to reorder fields</CardDescription>
            </div>
            <Button onClick={addField} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Field
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {(!config.formFields || config.formFields.length === 0) ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No fields added yet. Click "Add Field" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {config.formFields.map((field) => (
                <Card key={field.id} className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Button variant="ghost" size="icon" className="cursor-move mt-8">
                        <GripVertical className="h-4 w-4" />
                      </Button>
                      <div className="flex-1 grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label>Field Type</Label>
                          <Select
                            value={field.type}
                            onValueChange={(value) => updateField(field.id, 'type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="tel">Phone</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="textarea">Textarea</SelectItem>
                              <SelectItem value="select">Dropdown</SelectItem>
                              <SelectItem value="checkbox">Checkbox</SelectItem>
                              <SelectItem value="radio">Radio</SelectItem>
                              <SelectItem value="date">Date</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Label</Label>
                          <Input
                            placeholder="Full Name"
                            value={field.label}
                            onChange={(e) => updateField(field.id, 'label', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Placeholder</Label>
                          <Input
                            placeholder="John Doe"
                            value={field.placeholder}
                            onChange={(e) => updateField(field.id, 'placeholder', e.target.value)}
                          />
                        </div>
                        <div className="flex items-center space-x-2 md:col-span-2">
                          <Switch
                            checked={field.required}
                            onCheckedChange={(checked) => updateField(field.id, 'required', checked)}
                          />
                          <Label>Required Field</Label>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteField(field.id)}
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

      {/* Form Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Form Settings</CardTitle>
          <CardDescription>Configure form behavior and appearance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Layout</Label>
            <Select
              value={config.formSettings?.layout || 'single-column'}
              onValueChange={(value) => updateFormSettings('layout', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single-column">Single Column</SelectItem>
                <SelectItem value="two-column">Two Column</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Submit Button Text</Label>
            <Input
              placeholder="Book Appointment"
              value={config.formSettings?.submitButtonText || ''}
              onChange={(e) => updateFormSettings('submitButtonText', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Success Message</Label>
            <Input
              placeholder="Thank you! We'll be in touch soon."
              value={config.formSettings?.successMessage || ''}
              onChange={(e) => updateFormSettings('successMessage', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Redirect URL (Optional)</Label>
            <Input
              placeholder="https://yoursite.com/thank-you"
              value={config.formSettings?.redirectUrl || ''}
              onChange={(e) => updateFormSettings('redirectUrl', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to show success message on same page
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Multi-Step Form</Label>
              <p className="text-sm text-muted-foreground">
                Split form into multiple pages
              </p>
            </div>
            <Switch
              checked={config.formSettings?.multiStep || false}
              onCheckedChange={(checked) => updateFormSettings('multiStep', checked)}
            />
          </div>

          {config.formSettings?.multiStep && (
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Progress Bar</Label>
                <p className="text-sm text-muted-foreground">
                  Display step progress indicator
                </p>
              </div>
              <Switch
                checked={config.formSettings?.showProgressBar || false}
                onCheckedChange={(checked) => updateFormSettings('showProgressBar', checked)}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
