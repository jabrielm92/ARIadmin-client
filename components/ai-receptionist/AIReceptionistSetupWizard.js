'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronRight } from 'lucide-react';

const steps = [
  { id: 1, name: 'Basic Info', description: 'Business hours & services' },
  { id: 2, name: 'Voice & Personality', description: 'AI voice settings' },
  { id: 3, name: 'Knowledge Base', description: 'FAQs & information' },
  { id: 4, name: 'Call Routing', description: 'Call handling rules' },
  { id: 5, name: 'Appointments', description: 'Booking settings' },
  { id: 6, name: 'Quotes', description: 'Quote generation' },
  { id: 7, name: 'Review', description: 'Review & activate' }
];

export default function AIReceptionistSetupWizard({ clientId, onComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Info
    businessName: '',
    businessHours: {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
      wednesday: { open: '09:00', close: '17:00', closed: false },
      thursday: { open: '09:00', close: '17:00', closed: false },
      friday: { open: '09:00', close: '17:00', closed: false },
      saturday: { open: '10:00', close: '14:00', closed: true },
      sunday: { open: '10:00', close: '14:00', closed: true }
    },
    primaryServices: '',
    
    // Voice & Personality
    voiceProvider: 'openai',
    voiceId: 'alloy',
    aiPersonality: 'professional',
    greetingMessage: 'Hello! Thank you for calling. How can I help you today?',
    
    // Knowledge Base
    faqs: [],
    services: [],
    pricingInfo: '',
    
    // Call Routing
    forwardTo: '',
    forwardAfterHours: true,
    voicemailEnabled: true,
    
    // Appointments
    bookingEnabled: true,
    appointmentTypes: '',
    calendarIntegration: '',
    
    // Quotes
    quoteEnabled: true,
    baseRates: ''
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateBusinessHours = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value
        }
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
    setLoading(true);
    try {
      const response = await fetch(`/api/client/ai-receptionist/configure`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, config: formData })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('AI Receptionist configured successfully!');
        if (onComplete) onComplete();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const voiceOptions = [
    { id: 'alloy', name: 'Alloy', description: 'Neutral and balanced' },
    { id: 'echo', name: 'Echo', description: 'Clear and articulate' },
    { id: 'fable', name: 'Fable', description: 'Warm and engaging' },
    { id: 'onyx', name: 'Onyx', description: 'Deep and authoritative' },
    { id: 'nova', name: 'Nova', description: 'Bright and energetic' },
    { id: 'shimmer', name: 'Shimmer', description: 'Soft and friendly' }
  ];

  const personalityOptions = [
    { id: 'professional', name: 'Professional', description: 'Formal and business-like' },
    { id: 'friendly', name: 'Friendly', description: 'Warm and approachable' },
    { id: 'casual', name: 'Casual', description: 'Relaxed and conversational' },
    { id: 'enthusiastic', name: 'Enthusiastic', description: 'Energetic and positive' }
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>AI Virtual Receptionist Setup</CardTitle>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-6 overflow-x-auto">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center min-w-[100px]">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep > step.id ? 'bg-green-500 text-white' :
                    currentStep === step.id ? 'bg-blue-600 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                  </div>
                  <p className="text-xs font-medium mt-2 text-center">{step.name}</p>
                </div>
                {idx < steps.length - 1 && (
                  <ChevronRight className={`h-5 w-5 mx-2 ${
                    currentStep > step.id ? 'text-green-500' : 'text-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <Label>Business Name</Label>
                <Input
                  value={formData.businessName}
                  onChange={(e) => updateFormData('businessName', e.target.value)}
                  placeholder="Your Business Name"
                />
              </div>

              <div>
                <Label className="mb-4 block">Business Hours</Label>
                <div className="space-y-3">
                  {Object.keys(formData.businessHours).map(day => (
                    <div key={day} className="flex items-center gap-4">
                      <div className="w-24">
                        <p className="text-sm font-medium capitalize">{day}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={!formData.businessHours[day].closed}
                        onChange={(e) => updateBusinessHours(day, 'closed', !e.target.checked)}
                        className="w-4 h-4"
                      />
                      <Input
                        type="time"
                        value={formData.businessHours[day].open}
                        onChange={(e) => updateBusinessHours(day, 'open', e.target.value)}
                        disabled={formData.businessHours[day].closed}
                        className="w-32"
                      />
                      <span className="text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={formData.businessHours[day].close}
                        onChange={(e) => updateBusinessHours(day, 'close', e.target.value)}
                        disabled={formData.businessHours[day].closed}
                        className="w-32"
                      />
                      {formData.businessHours[day].closed && (
                        <Badge variant="secondary">Closed</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Primary Services</Label>
                <Textarea
                  value={formData.primaryServices}
                  onChange={(e) => updateFormData('primaryServices', e.target.value)}
                  placeholder="List your main services (one per line)&#10;e.g., Consultations, Appointments, Support"
                  rows={5}
                />
              </div>
            </div>
          )}

          {/* Step 2: Voice & Personality */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <Label className="mb-4 block">AI Voice</Label>
                <div className="grid grid-cols-2 gap-4">
                  {voiceOptions.map(voice => (
                    <Card 
                      key={voice.id}
                      className={`cursor-pointer transition-all ${
                        formData.voiceId === voice.id ? 'border-blue-500 border-2' : ''
                      }`}
                      onClick={() => updateFormData('voiceId', voice.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold">{voice.name}</p>
                            <p className="text-sm text-muted-foreground">{voice.description}</p>
                          </div>
                          <input
                            type="radio"
                            checked={formData.voiceId === voice.id}
                            onChange={() => {}}
                            className="mt-1"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-4 block">AI Personality</Label>
                <div className="grid grid-cols-2 gap-4">
                  {personalityOptions.map(personality => (
                    <Card 
                      key={personality.id}
                      className={`cursor-pointer transition-all ${
                        formData.aiPersonality === personality.id ? 'border-blue-500 border-2' : ''
                      }`}
                      onClick={() => updateFormData('aiPersonality', personality.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold">{personality.name}</p>
                            <p className="text-sm text-muted-foreground">{personality.description}</p>
                          </div>
                          <input
                            type="radio"
                            checked={formData.aiPersonality === personality.id}
                            onChange={() => {}}
                            className="mt-1"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <Label>Greeting Message</Label>
                <Textarea
                  value={formData.greetingMessage}
                  onChange={(e) => updateFormData('greetingMessage', e.target.value)}
                  placeholder="What should the AI say when answering calls?"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 3: Knowledge Base */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <Label>Services Offered</Label>
                <Textarea
                  value={formData.services}
                  onChange={(e) => updateFormData('services', e.target.value)}
                  placeholder="Describe your services in detail...&#10;&#10;e.g., We offer:&#10;- Initial consultations (30 min)&#10;- Full assessments (1 hour)&#10;- Follow-up sessions"
                  rows={6}
                />
              </div>

              <div>
                <Label>Pricing Information</Label>
                <Textarea
                  value={formData.pricingInfo}
                  onChange={(e) => updateFormData('pricingInfo', e.target.value)}
                  placeholder="Pricing details the AI can share with callers...&#10;&#10;e.g., Consultations: $150&#10;Assessments: $300&#10;Package deals available"
                  rows={6}
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  💡 <strong>Tip:</strong> The more information you provide, the better your AI receptionist can answer questions!
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Call Routing */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <Label>Forward Calls To (Phone Number)</Label>
                <Input
                  value={formData.forwardTo}
                  onChange={(e) => updateFormData('forwardTo', e.target.value)}
                  placeholder="+1-555-0123"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Calls can be forwarded to this number when requested
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Forward After Hours</p>
                  <p className="text-sm text-muted-foreground">Forward calls outside business hours</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.forwardAfterHours}
                  onChange={(e) => updateFormData('forwardAfterHours', e.target.checked)}
                  className="w-4 h-4"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Voicemail</p>
                  <p className="text-sm text-muted-foreground">Take messages when unavailable</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.voicemailEnabled}
                  onChange={(e) => updateFormData('voicemailEnabled', e.target.checked)}
                  className="w-4 h-4"
                />
              </div>
            </div>
          )}

          {/* Step 5: Appointments */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Appointment Booking</p>
                  <p className="text-sm text-muted-foreground">Allow AI to book appointments</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.bookingEnabled}
                  onChange={(e) => updateFormData('bookingEnabled', e.target.checked)}
                  className="w-4 h-4"
                />
              </div>

              {formData.bookingEnabled && (
                <>
                  <div>
                    <Label>Appointment Types</Label>
                    <Textarea
                      value={formData.appointmentTypes}
                      onChange={(e) => updateFormData('appointmentTypes', e.target.value)}
                      placeholder="List appointment types...&#10;&#10;e.g.,&#10;- Consultation (30 min)&#10;- Assessment (1 hour)&#10;- Follow-up (15 min)"
                      rows={6}
                    />
                  </div>

                  <div>
                    <Label>Calendar Integration</Label>
                    <Select 
                      value={formData.calendarIntegration} 
                      onValueChange={(val) => updateFormData('calendarIntegration', val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select calendar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None (Manual)</SelectItem>
                        <SelectItem value="google">Google Calendar</SelectItem>
                        <SelectItem value="outlook">Outlook Calendar</SelectItem>
                        <SelectItem value="calendly">Calendly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 6: Quotes */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Quote Generation</p>
                  <p className="text-sm text-muted-foreground">Allow AI to provide price quotes</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.quoteEnabled}
                  onChange={(e) => updateFormData('quoteEnabled', e.target.checked)}
                  className="w-4 h-4"
                />
              </div>

              {formData.quoteEnabled && (
                <div>
                  <Label>Base Rates & Pricing Guide</Label>
                  <Textarea
                    value={formData.baseRates}
                    onChange={(e) => updateFormData('baseRates', e.target.value)}
                    placeholder="Provide pricing information for quotes...&#10;&#10;e.g.,&#10;Standard Service: $500&#10;Premium Service: $1000&#10;Enterprise: Custom pricing"
                    rows={8}
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 7: Review */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
                  🎉 Ready to Activate!
                </h3>
                <p className="text-sm text-green-900 dark:text-green-100">
                  Your AI Virtual Receptionist is configured and ready to go. Click "Activate" to complete the setup.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Configuration Summary:</h3>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Business Name</p>
                    <p className="font-medium">{formData.businessName || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Voice</p>
                    <p className="font-medium capitalize">{formData.voiceId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Personality</p>
                    <p className="font-medium capitalize">{formData.aiPersonality}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Booking</p>
                    <Badge variant={formData.bookingEnabled ? 'default' : 'secondary'}>
                      {formData.bookingEnabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Quotes</p>
                    <Badge variant={formData.quoteEnabled ? 'default' : 'secondary'}>
                      {formData.quoteEnabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Call Forwarding</p>
                    <p className="font-medium">{formData.forwardTo || 'Not set'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1 || loading}
            >
              Back
            </Button>
            
            {currentStep < steps.length ? (
              <Button onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Activating...' : 'Activate AI Receptionist'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
