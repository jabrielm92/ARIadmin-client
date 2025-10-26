'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ClientLayout from '@/components/ClientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, HelpCircle, Briefcase, Users, Save } from 'lucide-react';

export default function KnowledgeBasePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // FAQs state
  const [faqs, setFaqs] = useState([]);
  const [faqDialog, setFaqDialog] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqForm, setFaqForm] = useState({ question: '', answer: '' });
  
  // Services state
  const [services, setServices] = useState([]);
  const [serviceDialog, setServiceDialog] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({ name: '', description: '', duration: '', price: '' });
  
  // Staff state
  const [staff, setStaff] = useState([]);
  const [staffDialog, setStaffDialog] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [staffForm, setStaffForm] = useState({ name: '', role: '', availability: '' });

  useEffect(() => {
    const token = localStorage.getItem('clientToken');
    const userStr = localStorage.getItem('clientUser');
    
    if (!token || !userStr) {
      router.push('/client/login');
      return;
    }
    
    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
      loadKnowledgeBase(userData.id);
    } catch (error) {
      router.push('/client/login');
    }
  }, [router]);

  const loadKnowledgeBase = async (clientId) => {
    try {
      const response = await fetch(`/api/client/knowledge-base?clientId=${clientId}`);
      const data = await response.json();
      
      if (data.success && data.knowledgeBase) {
        setFaqs(data.knowledgeBase.faqs || []);
        setServices(data.knowledgeBase.services || []);
        setStaff(data.knowledgeBase.staff || []);
      }
    } catch (error) {
      console.error('Error loading knowledge base:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveKnowledgeBase = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/client/knowledge-base', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: user.id,
          knowledgeBase: { faqs, services, staff }
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Knowledge base saved successfully!');
      } else {
        alert('Error saving: ' + data.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // FAQ functions
  const handleAddFaq = () => {
    setEditingFaq(null);
    setFaqForm({ question: '', answer: '' });
    setFaqDialog(true);
  };

  const handleEditFaq = (faq, index) => {
    setEditingFaq(index);
    setFaqForm(faq);
    setFaqDialog(true);
  };

  const handleSaveFaq = () => {
    if (!faqForm.question || !faqForm.answer) {
      alert('Please fill in both question and answer');
      return;
    }

    if (editingFaq !== null) {
      const updated = [...faqs];
      updated[editingFaq] = faqForm;
      setFaqs(updated);
    } else {
      setFaqs([...faqs, faqForm]);
    }
    
    setFaqDialog(false);
    setFaqForm({ question: '', answer: '' });
  };

  const handleDeleteFaq = (index) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      setFaqs(faqs.filter((_, i) => i !== index));
    }
  };

  // Service functions
  const handleAddService = () => {
    setEditingService(null);
    setServiceForm({ name: '', description: '', duration: '', price: '' });
    setServiceDialog(true);
  };

  const handleEditService = (service, index) => {
    setEditingService(index);
    setServiceForm(service);
    setServiceDialog(true);
  };

  const handleSaveService = () => {
    if (!serviceForm.name || !serviceForm.description) {
      alert('Please fill in name and description');
      return;
    }

    if (editingService !== null) {
      const updated = [...services];
      updated[editingService] = serviceForm;
      setServices(updated);
    } else {
      setServices([...services, serviceForm]);
    }
    
    setServiceDialog(false);
    setServiceForm({ name: '', description: '', duration: '', price: '' });
  };

  const handleDeleteService = (index) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter((_, i) => i !== index));
    }
  };

  // Staff functions
  const handleAddStaff = () => {
    setEditingStaff(null);
    setStaffForm({ name: '', role: '', availability: '' });
    setStaffDialog(true);
  };

  const handleEditStaff = (member, index) => {
    setEditingStaff(index);
    setStaffForm(member);
    setStaffDialog(true);
  };

  const handleSaveStaff = () => {
    if (!staffForm.name || !staffForm.role) {
      alert('Please fill in name and role');
      return;
    }

    if (editingStaff !== null) {
      const updated = [...staff];
      updated[editingStaff] = staffForm;
      setStaff(updated);
    } else {
      setStaff([...staff, staffForm]);
    }
    
    setStaffDialog(false);
    setStaffForm({ name: '', role: '', availability: '' });
  };

  const handleDeleteStaff = (index) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      setStaff(staff.filter((_, i) => i !== index));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Knowledge Base</h1>
            <p className="text-muted-foreground">Manage information your AI receptionist can share</p>
          </div>
          <Button onClick={saveKnowledgeBase} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save All Changes'}
          </Button>
        </div>

        <Tabs defaultValue="faqs" className="w-full">
          <TabsList>
            <TabsTrigger value="faqs">
              <HelpCircle className="h-4 w-4 mr-2" />
              FAQs
            </TabsTrigger>
            <TabsTrigger value="services">
              <Briefcase className="h-4 w-4 mr-2" />
              Services
            </TabsTrigger>
            <TabsTrigger value="staff">
              <Users className="h-4 w-4 mr-2" />
              Staff Directory
            </TabsTrigger>
          </TabsList>

          {/* FAQs Tab */}
          <TabsContent value="faqs">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>Common questions and answers for your AI to reference</CardDescription>
                  </div>
                  <Button onClick={handleAddFaq}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add FAQ
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {faqs.length === 0 ? (
                  <div className="text-center py-12">
                    <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium">No FAQs yet</p>
                    <p className="text-sm text-muted-foreground mb-4">Add frequently asked questions to help your AI answer common inquiries</p>
                    <Button onClick={handleAddFaq}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First FAQ
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <Card key={index} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <p className="font-semibold text-lg mb-2">{faq.question}</p>
                              <p className="text-sm text-muted-foreground">{faq.answer}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEditFaq(faq, index)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteFaq(index)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Services Catalog</CardTitle>
                    <CardDescription>Services you offer that your AI can discuss</CardDescription>
                  </div>
                  <Button onClick={handleAddService}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {services.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium">No services yet</p>
                    <p className="text-sm text-muted-foreground mb-4">Add services your business offers</p>
                    <Button onClick={handleAddService}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Service
                    </Button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {services.map((service, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-lg">{service.name}</h3>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEditService(service, index)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteService(index)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                          <div className="flex gap-4 text-sm">
                            {service.duration && (
                              <div>
                                <span className="text-muted-foreground">Duration:</span>
                                <span className="ml-1 font-medium">{service.duration}</span>
                              </div>
                            )}
                            {service.price && (
                              <div>
                                <span className="text-muted-foreground">Price:</span>
                                <span className="ml-1 font-medium">${service.price}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Staff Tab */}
          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Staff Directory</CardTitle>
                    <CardDescription>Your team members and their availability</CardDescription>
                  </div>
                  <Button onClick={handleAddStaff}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Staff
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {staff.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium">No staff members yet</p>
                    <p className="text-sm text-muted-foreground mb-4">Add your team members</p>
                    <Button onClick={handleAddStaff}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Staff Member
                    </Button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-3 gap-4">
                    {staff.map((member, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold">{member.name}</h3>
                              <p className="text-sm text-muted-foreground">{member.role}</p>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" onClick={() => handleEditStaff(member, index)}>
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteStaff(index)}>
                                <Trash2 className="h-3 w-3 text-red-500" />
                              </Button>
                            </div>
                          </div>
                          {member.availability && (
                            <p className="text-xs text-muted-foreground mt-2">{member.availability}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* FAQ Dialog */}
        <Dialog open={faqDialog} onOpenChange={setFaqDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingFaq !== null ? 'Edit FAQ' : 'Add FAQ'}</DialogTitle>
              <DialogDescription>Add a frequently asked question and its answer</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Question</Label>
                <Input
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  placeholder="What are your business hours?"
                />
              </div>
              <div>
                <Label>Answer</Label>
                <Textarea
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  placeholder="We're open Monday through Friday, 9 AM to 5 PM..."
                  rows={5}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setFaqDialog(false)}>Cancel</Button>
              <Button onClick={handleSaveFaq}>Save FAQ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Service Dialog */}
        <Dialog open={serviceDialog} onOpenChange={setServiceDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingService !== null ? 'Edit Service' : 'Add Service'}</DialogTitle>
              <DialogDescription>Add a service your business offers</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Service Name</Label>
                <Input
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  placeholder="Initial Consultation"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  placeholder="A comprehensive 30-minute consultation to understand your needs..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Duration</Label>
                  <Input
                    value={serviceForm.duration}
                    onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                    placeholder="30 minutes"
                  />
                </div>
                <div>
                  <Label>Price</Label>
                  <Input
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    placeholder="150"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setServiceDialog(false)}>Cancel</Button>
              <Button onClick={handleSaveService}>Save Service</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Staff Dialog */}
        <Dialog open={staffDialog} onOpenChange={setStaffDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingStaff !== null ? 'Edit Staff Member' : 'Add Staff Member'}</DialogTitle>
              <DialogDescription>Add a team member to your directory</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                  placeholder="Dr. Jane Smith"
                />
              </div>
              <div>
                <Label>Role/Title</Label>
                <Input
                  value={staffForm.role}
                  onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                  placeholder="Senior Consultant"
                />
              </div>
              <div>
                <Label>Availability</Label>
                <Input
                  value={staffForm.availability}
                  onChange={(e) => setStaffForm({ ...staffForm, availability: e.target.value })}
                  placeholder="Monday-Friday, 9 AM - 5 PM"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStaffDialog(false)}>Cancel</Button>
              <Button onClick={handleSaveStaff}>Save Staff Member</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ClientLayout>
  );
}
