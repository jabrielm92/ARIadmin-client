'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2, Loader2 } from 'lucide-react';

export default function PublicLandingPage() {
  const params = useParams();
  const campaignId = params.id;
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [campaign, setCampaign] = useState(null);
  const [landingPage, setLandingPage] = useState(null);
  const [formData, setFormData] = useState({});
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCampaign();
  }, [campaignId]);

  const fetchCampaign = async () => {
    try {
      const response = await fetch(`/api/public/campaigns/${campaignId}`);
      const data = await response.json();
      
      if (data.success) {
        setCampaign(data.campaign);
        setLandingPage(data.campaign.landingPage || {});
      }
    } catch (error) {
      console.error('Error fetching campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (questionId, value) => {
    setFormData({
      ...formData,
      [questionId]: value
    });
    // Clear error for this field
    if (errors[questionId]) {
      setErrors({
        ...errors,
        [questionId]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    landingPage.questions?.forEach(question => {
      if (question.required && !formData[question.id]) {
        newErrors[question.id] = 'This field is required';
      }
      
      // Validate email format
      if (question.type === 'email' && formData[question.id]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[question.id])) {
          newErrors[question.id] = 'Invalid email address';
        }
      }
      
      // Validate phone format
      if (question.type === 'phone' && formData[question.id]) {
        const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
        if (!phoneRegex.test(formData[question.id])) {
          newErrors[question.id] = 'Invalid phone number';
        }
      }
    });
    
    if (landingPage.collectConsent && !consent) {
      newErrors.consent = 'You must agree to continue';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Capture tracking data
      const trackingData = {
        ip: '', // Will be captured server-side
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        consentGiven: consent,
        url: window.location.href
      };
      
      const response = await fetch(`/api/public/leads/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaignId,
          formData,
          tracking: trackingData
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSubmitted(true);
        
        // Redirect if URL is provided
        if (landingPage.redirectUrl) {
          setTimeout(() => {
            window.location.href = landingPage.redirectUrl;
          }, 2000);
        }
      } else {
        alert('Submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!campaign || !landingPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Campaign not found</h1>
          <p className="text-gray-600 mt-2">This landing page may have been removed or is no longer active.</p>
        </div>
      </div>
    );
  }

  // Show thank you page
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {landingPage.thankYouHeadline || 'Thank You!'}
          </h1>
          <p className="text-gray-600 mb-6">
            {landingPage.thankYouMessage || 'We received your information and will contact you soon.'}
          </p>
          {landingPage.redirectUrl && (
            <p className="text-sm text-gray-500">
              Redirecting...
            </p>
          )}
        </div>
      </div>
    );
  }

  // Render form
  return (
    <div 
      className="min-h-screen py-12 px-4" 
      style={{
        background: `linear-gradient(to bottom right, ${landingPage.primaryColor}15, ${landingPage.primaryColor}05)`
      }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          {landingPage.heroImage && (
            <img 
              src={landingPage.heroImage} 
              alt="Hero" 
              className="w-full max-w-md mx-auto rounded-2xl shadow-lg mb-8"
            />
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {landingPage.headline || 'Get Started Today'}
          </h1>
          <p className="text-xl text-gray-600">
            {landingPage.subheadline || 'Fill out the form below'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {landingPage.questions?.map((question, index) => (
              <div key={question.id} className="space-y-2">
                <Label className="text-base font-semibold text-gray-700">
                  {question.label}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                
                {/* Text, Email, Phone inputs */}
                {(question.type === 'text' || question.type === 'email' || question.type === 'phone') && (
                  <Input
                    type={question.type}
                    placeholder={question.placeholder}
                    value={formData[question.id] || ''}
                    onChange={(e) => handleInputChange(question.id, e.target.value)}
                    className={`text-lg ${errors[question.id] ? 'border-red-500' : ''}`}
                  />
                )}
                
                {/* Textarea */}
                {question.type === 'textarea' && (
                  <Textarea
                    placeholder={question.placeholder}
                    value={formData[question.id] || ''}
                    onChange={(e) => handleInputChange(question.id, e.target.value)}
                    rows={4}
                    className={`text-lg ${errors[question.id] ? 'border-red-500' : ''}`}
                  />
                )}
                
                {/* Select dropdown */}
                {question.type === 'select' && (
                  <Select
                    value={formData[question.id] || ''}
                    onValueChange={(value) => handleInputChange(question.id, value)}
                  >
                    <SelectTrigger className={`text-lg ${errors[question.id] ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {question.options?.map((option, idx) => (
                        <SelectItem key={idx} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {/* Radio buttons */}
                {question.type === 'radio' && (
                  <RadioGroup
                    value={formData[question.id] || ''}
                    onValueChange={(value) => handleInputChange(question.id, value)}
                    className="space-y-2"
                  >
                    {question.options?.map((option, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${question.id}-${idx}`} />
                        <Label htmlFor={`${question.id}-${idx}`} className="font-normal cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                
                {errors[question.id] && (
                  <p className="text-sm text-red-500">{errors[question.id]}</p>
                )}
              </div>
            ))}

            {/* Consent Checkbox */}
            {landingPage.collectConsent && (
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="consent"
                    checked={consent}
                    onCheckedChange={setConsent}
                    className={errors.consent ? 'border-red-500' : ''}
                  />
                  <Label 
                    htmlFor="consent" 
                    className="text-sm text-gray-600 cursor-pointer leading-relaxed"
                  >
                    {landingPage.consentText}
                  </Label>
                </div>
                {errors.consent && (
                  <p className="text-sm text-red-500">{errors.consent}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full text-lg h-12"
              style={{ backgroundColor: landingPage.primaryColor }}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Powered by ARI Solutions Inc.</p>
        </div>
      </div>
    </div>
  );
}
