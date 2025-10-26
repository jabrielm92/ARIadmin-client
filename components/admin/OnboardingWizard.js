'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Check, Copy, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const steps = [
  { id: 1, name: 'Business Info', description: 'Basic business details' },
  { id: 2, name: 'Contact Info', description: 'Primary contact details' },
  { id: 3, name: 'Services', description: 'Select services to enable' },
  { id: 4, name: 'Review', description: 'Review and confirm' }
];

export default function OnboardingWizard({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Business Info
    businessName: '',
    industry: '',
    website: '',
    phone: '',
    email: '',
    address: '',
    
    // Contact Info
    contactName: '',
    contactTitle: '',
    contactEmail: '',
    contactPhone: '',
    
    // Services
    services: {
      aiReceptionist: false,
      bookingAccelerator: false,
      leadGen: false
    },
    
    // Additional
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateService = (service, value) => {
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [service]: value
      }
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Show credentials
        setCredentials({
          email: data.client.loginEmail,
          password: data.client.temporaryPassword,
          clientId: data.client.clientId
        });
        setShowCredentials(true);
      } else {
        alert('Error creating client: ' + data.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCredentialsClose = () => {
    setShowCredentials(false);
    if (onComplete) {
      onComplete(credentials.clientId);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.businessName && formData.email && formData.phone;
      case 2:
        return formData.contactName && formData.contactEmail;
      case 3:
        return formData.services.aiReceptionist || formData.services.bookingAccelerator || formData.services.leadGen;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Client</CardTitle>
          <CardDescription>Complete the wizard to onboard a new client</CardDescription>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-6">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep > step.id ? 'bg-green-500 text-white' :
                    currentStep === step.id ? 'bg-blue-600 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                  </div>
                  <div className="text-center mt-2">
                    <p className="text-xs font-medium">{step.name}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Business Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Business Name *</Label>
                  <Input
                    value={formData.businessName}
                    onChange={(e) => updateFormData('businessName', e.target.value)}
                    placeholder="ABC Company"
                  />
                </div>
                <div>
                  <Label>Industry</Label>
                  <Select value={formData.industry} onValueChange={(val) => updateFormData('industry', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                      <SelectItem value="real-estate">Real Estate</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Business Email *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="contact@company.com"
                  />
                </div>
                <div>
                  <Label>Business Phone *</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    placeholder="+1-555-0123"
                  />
                </div>
              </div>

              <div>
                <Label>Website</Label>
                <Input
                  value={formData.website}
                  onChange={(e) => updateFormData('website', e.target.value)}
                  placeholder="https://company.com"
                />
              </div>

              <div>
                <Label>Address</Label>
                <Textarea
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  placeholder="Street address, City, State, ZIP"
                  rows={2}
                />
              </div>
            </div>
          )}

          {/* Step 2: Contact Info */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Contact Name *</Label>
                  <Input
                    value={formData.contactName}
                    onChange={(e) => updateFormData('contactName', e.target.value)}
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <Label>Title/Position</Label>
                  <Input
                    value={formData.contactTitle}
                    onChange={(e) => updateFormData('contactTitle', e.target.value)}
                    placeholder="CEO"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Contact Email *</Label>
                  <Input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => updateFormData('contactEmail', e.target.value)}
                    placeholder="john@company.com"
                  />
                </div>
                <div>
                  <Label>Contact Phone</Label>
                  <Input
                    value={formData.contactPhone}
                    onChange={(e) => updateFormData('contactPhone', e.target.value)}
                    placeholder="+1-555-0123"
                  />
                </div>
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => updateFormData('notes', e.target.value)}
                  placeholder="Any additional notes about this client..."
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Step 3: Services */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Select which services to enable for this client:
              </p>

              <div className="space-y-4">
                <Card className={`cursor-pointer transition-all ${
                  formData.services.aiReceptionist ? 'border-blue-500 border-2' : ''
                }`} onClick={() => updateService('aiReceptionist', !formData.services.aiReceptionist)}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">AI Virtual Receptionist</h3>
                        <p className="text-sm text-muted-foreground">
                          24/7 AI phone answering, appointment booking, lead qualification, and quote generation
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.services.aiReceptionist}
                        onChange={() => {}}
                        className="w-5 h-5 mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className={`cursor-pointer transition-all ${
                  formData.services.bookingAccelerator ? 'border-blue-500 border-2' : ''
                }`} onClick={() => updateService('bookingAccelerator', !formData.services.bookingAccelerator)}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">Appointment Booking Accelerator</h3>
                        <p className="text-sm text-muted-foreground">
                          Landing pages, lead capture forms, calendar integration, and automated follow-ups
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.services.bookingAccelerator}
                        onChange={() => {}}
                        className="w-5 h-5 mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className={`cursor-pointer transition-all ${
                  formData.services.leadGen ? 'border-blue-500 border-2' : ''
                }`} onClick={() => updateService('leadGen', !formData.services.leadGen)}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">ARI Lead Gen Service</h3>
                        <p className="text-sm text-muted-foreground">
                          Multi-channel campaigns, lead scoring, nurturing workflows, and ROI tracking
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.services.leadGen}
                        onChange={() => {}}
                        className="w-5 h-5 mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Review Client Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Business Details</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-muted-foreground">Name:</span> {formData.businessName}</div>
                      <div><span className="text-muted-foreground">Industry:</span> {formData.industry || 'N/A'}</div>
                      <div><span className="text-muted-foreground">Email:</span> {formData.email}</div>
                      <div><span className="text-muted-foreground">Phone:</span> {formData.phone}</div>
                      {formData.website && <div className="col-span-2"><span className="text-muted-foreground">Website:</span> {formData.website}</div>}
                      {formData.address && <div className="col-span-2"><span className="text-muted-foreground">Address:</span> {formData.address}</div>}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Contact Person</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-muted-foreground">Name:</span> {formData.contactName}</div>
                      <div><span className="text-muted-foreground">Title:</span> {formData.contactTitle || 'N/A'}</div>
                      <div><span className="text-muted-foreground">Email:</span> {formData.contactEmail}</div>
                      <div><span className="text-muted-foreground">Phone:</span> {formData.contactPhone || 'N/A'}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Enabled Services</h4>
                    <div className="flex gap-2">
                      {formData.services.aiReceptionist && <Badge>AI Virtual Receptionist</Badge>}
                      {formData.services.bookingAccelerator && <Badge>Booking Accelerator</Badge>}
                      {formData.services.leadGen && <Badge>Lead Gen Service</Badge>}
                    </div>
                  </div>

                  {formData.notes && (
                    <div>
                      <h4 className="font-medium mb-2">Notes</h4>
                      <p className="text-sm text-muted-foreground">{formData.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1 || isSubmitting}
            >
              Back
            </Button>
            
            {currentStep < steps.length ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Client'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Credentials Dialog */}
      <Dialog open={showCredentials} onOpenChange={setShowCredentials}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Client Created Successfully!</DialogTitle>
            <DialogDescription>
              Save these credentials - they won't be shown again
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-sm text-green-900 dark:text-green-100 mb-2">
                ✅ Client portal account created for <strong>{formData.businessName}</strong>
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <Label>Login Email</Label>
                <div className="flex gap-2">
                  <Input value={credentials?.email || ''} readOnly className="flex-1" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(credentials?.email, 'email')}
                  >
                    {copiedField === 'email' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label>Temporary Password</Label>
                <div className="flex gap-2">
                  <Input value={credentials?.password || ''} readOnly className="flex-1" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(credentials?.password, 'password')}
                  >
                    {copiedField === 'password' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <p className="text-xs text-yellow-900 dark:text-yellow-100">
                  ⚠️ <strong>Important:</strong> Share these credentials with your client. They can change the password after first login.
                </p>
              </div>
            </div>

            <Button onClick={handleCredentialsClose} className="w-full">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
