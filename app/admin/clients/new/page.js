'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

export default function NewClientPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    contactName: '',
    contactTitle: '',
    contactEmail: '',
    contactPhone: '',
    aiReceptionist: true,
    bookingAccelerator: false,
    monthlyFee: '',
    notes: '',
    status: 'active'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Client added successfully!',
        });
        router.push('/admin/clients');
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to add client',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred',
        variant: 'destructive',
      });
    }

    setLoading(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Add New Client</h1>
          <p className="text-muted-foreground">Fill in the details to create a new client</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>Basic details about the client's business</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      required
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry *</Label>
                    <Select
                      value={formData.industry}
                      onValueChange={(value) => setFormData({ ...formData, industry: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="legal">Legal</SelectItem>
                        <SelectItem value="real-estate">Real Estate</SelectItem>
                        <SelectItem value="home-services">Home Services</SelectItem>
                        <SelectItem value="consulting">Consulting</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Details</CardTitle>
                <CardDescription>Primary contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Point of Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Point of Contact</CardTitle>
                <CardDescription>Primary person to contact at the business</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Name</Label>
                    <Input
                      id="contactName"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactTitle">Title</Label>
                    <Input
                      id="contactTitle"
                      placeholder="CEO, Owner, Manager"
                      value={formData.contactTitle}
                      onChange={(e) => setFormData({ ...formData, contactTitle: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Phone</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle>Services</CardTitle>
                <CardDescription>Select which services to enable for this client</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>AI Virtual Receptionist</Label>
                    <p className="text-sm text-muted-foreground">
                      Voice AI that handles calls and bookings
                    </p>
                  </div>
                  <Switch
                    checked={formData.aiReceptionist}
                    onCheckedChange={(checked) => setFormData({ ...formData, aiReceptionist: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Appointment Booking Accelerator</Label>
                    <p className="text-sm text-muted-foreground">
                      Landing pages and lead generation system
                    </p>
                  </div>
                  <Switch
                    checked={formData.bookingAccelerator}
                    onCheckedChange={(checked) => setFormData({ ...formData, bookingAccelerator: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Billing */}
            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
                <CardDescription>Set up billing for this client</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlyFee">Monthly Fee ($)</Label>
                  <Input
                    id="monthlyFee"
                    type="number"
                    placeholder="500"
                    value={formData.monthlyFee}
                    onChange={(e) => setFormData({ ...formData, monthlyFee: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
                <CardDescription>Internal notes about this client</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Add any additional notes or comments..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Client'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
