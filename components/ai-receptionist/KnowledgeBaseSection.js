'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function KnowledgeBaseSection({ config, setConfig }) {
  const updateKnowledgeBase = (field, value) => {
    setConfig({
      ...config,
      knowledgeBase: {
        ...config.knowledgeBase,
        [field]: value
      }
    });
  };

  const addService = () => {
    const services = config.knowledgeBase?.services || [];
    updateKnowledgeBase('services', [
      ...services,
      { id: Date.now(), name: '', description: '', pricing: '' }
    ]);
  };

  const updateService = (id, field, value) => {
    const services = config.knowledgeBase?.services || [];
    updateKnowledgeBase(
      'services',
      services.map(s => s.id === id ? { ...s, [field]: value } : s)
    );
  };

  const deleteService = (id) => {
    const services = config.knowledgeBase?.services || [];
    updateKnowledgeBase('services', services.filter(s => s.id !== id));
  };

  const addFAQ = () => {
    const faqs = config.knowledgeBase?.faqs || [];
    updateKnowledgeBase('faqs', [
      ...faqs,
      { id: Date.now(), question: '', answer: '', category: 'general' }
    ]);
  };

  const updateFAQ = (id, field, value) => {
    const faqs = config.knowledgeBase?.faqs || [];
    updateKnowledgeBase(
      'faqs',
      faqs.map(f => f.id === id ? { ...f, [field]: value } : f)
    );
  };

  const deleteFAQ = (id) => {
    const faqs = config.knowledgeBase?.faqs || [];
    updateKnowledgeBase('faqs', faqs.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="services" className="w-full">
        <TabsList>
          <TabsTrigger value="services">Services Offered</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="responses">Custom Responses</TabsTrigger>
        </TabsList>

        {/* Services Offered */}
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Services Offered</CardTitle>
                  <CardDescription>Tell the AI about your services and pricing</CardDescription>
                </div>
                <Button onClick={addService} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Service
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {(!config.knowledgeBase?.services || config.knowledgeBase.services.length === 0) ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No services added yet. Click "Add Service" to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {config.knowledgeBase.services.map((service) => (
                    <Card key={service.id} className="border-2">
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-4">
                            <div className="space-y-2">
                              <Label>Service Name</Label>
                              <Input
                                placeholder="Consultation, Installation, etc."
                                value={service.name}
                                onChange={(e) => updateService(service.id, 'name', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Textarea
                                placeholder="Brief description of what this service includes..."
                                value={service.description}
                                onChange={(e) => updateService(service.id, 'description', e.target.value)}
                                rows={2}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Pricing</Label>
                              <Input
                                placeholder="$100, Starting at $500, Free consultation"
                                value={service.pricing}
                                onChange={(e) => updateService(service.id, 'pricing', e.target.value)}
                              />
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteService(service.id)}
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

        {/* FAQs */}
        <TabsContent value="faqs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>Train your AI to answer common questions</CardDescription>
                </div>
                <Button onClick={addFAQ} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add FAQ
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {(!config.knowledgeBase?.faqs || config.knowledgeBase.faqs.length === 0) ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No FAQs added yet. Click "Add FAQ" to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {config.knowledgeBase.faqs.map((faq) => (
                    <Card key={faq.id} className="border-2">
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-4">
                            <div className="space-y-2">
                              <Label>Question</Label>
                              <Input
                                placeholder="What are your business hours?"
                                value={faq.question}
                                onChange={(e) => updateFAQ(faq.id, 'question', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Answer</Label>
                              <Textarea
                                placeholder="We're open Monday through Friday, 9 AM to 5 PM..."
                                value={faq.answer}
                                onChange={(e) => updateFAQ(faq.id, 'answer', e.target.value)}
                                rows={3}
                              />
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteFAQ(faq.id)}
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

        {/* Custom Responses */}
        <TabsContent value="responses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Responses</CardTitle>
              <CardDescription>Customize how your AI greets and responds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Opening Greeting</Label>
                <Textarea
                  placeholder="Thank you for calling ABC Company, this is Sarah, how may I help you today?"
                  value={config.knowledgeBase?.customResponses?.greeting || ''}
                  onChange={(e) => updateKnowledgeBase('customResponses', {
                    ...config.knowledgeBase?.customResponses,
                    greeting: e.target.value
                  })}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Closing Statement</Label>
                <Textarea
                  placeholder="Thank you for calling, have a great day!"
                  value={config.knowledgeBase?.customResponses?.closing || ''}
                  onChange={(e) => updateKnowledgeBase('customResponses', {
                    ...config.knowledgeBase?.customResponses,
                    closing: e.target.value
                  })}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>After Hours Message</Label>
                <Textarea
                  placeholder="Thank you for calling. We're currently closed. Our business hours are..."
                  value={config.knowledgeBase?.customResponses?.afterHours || ''}
                  onChange={(e) => updateKnowledgeBase('customResponses', {
                    ...config.knowledgeBase?.customResponses,
                    afterHours: e.target.value
                  })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>On Hold Message</Label>
                <Textarea
                  placeholder="Please hold while I transfer your call..."
                  value={config.knowledgeBase?.customResponses?.onHold || ''}
                  onChange={(e) => updateKnowledgeBase('customResponses', {
                    ...config.knowledgeBase?.customResponses,
                    onHold: e.target.value
                  })}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Voicemail Message</Label>
                <Textarea
                  placeholder="I'm sorry, no one is available to take your call. Please leave a message..."
                  value={config.knowledgeBase?.customResponses?.voicemail || ''}
                  onChange={(e) => updateKnowledgeBase('customResponses', {
                    ...config.knowledgeBase?.customResponses,
                    voicemail: e.target.value
                  })}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
