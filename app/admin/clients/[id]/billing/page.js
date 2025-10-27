'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, DollarSign, FileText, TrendingUp } from 'lucide-react';

export default function AdminClientBillingPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [client, setClient] = useState(null);
  const [billing, setBilling] = useState({
    type: 'per-lead',
    upfrontFee: 400,
    upfrontPaid: false,
    perLeadRate: 150,
    leadsDelivered: 0,
    leadsInvoiced: 0,
    totalRevenue: 0,
    status: 'active',
    notes: ''
  });

  useEffect(() => {
    fetchClient();
    fetchBilling();
  }, [clientId]);

  const fetchClient = async () => {
    try {
      const response = await fetch(`/api/clients/${clientId}`);
      const data = await response.json();
      
      if (data.success) {
        setClient(data.client);
      }
    } catch (error) {
      console.error('Error fetching client:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBilling = async () => {
    try {
      const response = await fetch(`/api/admin/billing/${clientId}`);
      const data = await response.json();
      
      if (data.success && data.billing) {
        setBilling(data.billing);
      }
    } catch (error) {
      console.error('Error fetching billing:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/billing/${clientId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...billing,
          clientId
        })
      });

      if (response.ok) {
        alert('Billing configuration saved successfully!');
        fetchBilling();
      }
    } catch (error) {
      console.error('Error saving billing:', error);
      alert('Failed to save billing configuration');
    } finally {
      setSaving(false);
    }
  };

  const calculateUnbilled = () => {
    return billing.leadsDelivered - billing.leadsInvoiced;
  };

  const calculateInvoiceAmount = () => {
    return calculateUnbilled() * billing.perLeadRate;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-lg">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!client) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-lg">Client not found</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push(`/admin/clients/${clientId}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Billing & Pricing</h1>
            <p className="text-muted-foreground">{client.businessName}</p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Leads Delivered</p>
                  <p className="text-3xl font-bold">{billing.leadsDelivered}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Unbilled Leads</p>
                  <p className="text-3xl font-bold">{calculateUnbilled()}</p>
                </div>
                <FileText className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold">${billing.totalRevenue}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing Model</CardTitle>
            <CardDescription>Configure how you charge this client</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Billing Type</Label>
              <Select
                value={billing.type}
                onValueChange={(value) => setBilling({ ...billing, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="per-lead">Pay Per Lead (PPL)</SelectItem>
                  <SelectItem value="per-appointment">Pay Per Show</SelectItem>
                  <SelectItem value="hybrid">Hybrid (Upfront + Per Lead)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Upfront Fee</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                  <Input
                    type="number"
                    value={billing.upfrontFee}
                    onChange={(e) => setBilling({ ...billing, upfrontFee: Number(e.target.value) })}
                    className="pl-7"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Typical range: $300-$500 (refundable if targets not met)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Upfront Fee Status</Label>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">
                    {billing.upfrontPaid ? 'Paid' : 'Unpaid'}
                  </span>
                  <Switch
                    checked={billing.upfrontPaid}
                    onCheckedChange={(checked) => setBilling({ ...billing, upfrontPaid: checked })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Per Lead Rate</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                <Input
                  type="number"
                  value={billing.perLeadRate}
                  onChange={(e) => setBilling({ ...billing, perLeadRate: Number(e.target.value) })}
                  className="pl-7"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Typical range: $60-$350 per qualified lead
              </p>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={billing.status}
                onValueChange={(value) => setBilling({ ...billing, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Internal Notes</Label>
              <Textarea
                value={billing.notes}
                onChange={(e) => setBilling({ ...billing, notes: e.target.value })}
                placeholder="Add any notes about this client's billing arrangement..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Current Invoice Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Current Invoice Preview</CardTitle>
            <CardDescription>Based on current unbilled leads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-sm text-muted-foreground">Leads Delivered</span>
                <span className="font-semibold">{billing.leadsDelivered}</span>
              </div>
              
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-sm text-muted-foreground">Leads Previously Invoiced</span>
                <span className="font-semibold">{billing.leadsInvoiced}</span>
              </div>
              
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-sm text-muted-foreground">Unbilled Leads</span>
                <span className="font-semibold">{calculateUnbilled()}</span>
              </div>
              
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-sm text-muted-foreground">Rate Per Lead</span>
                <span className="font-semibold">${billing.perLeadRate}</span>
              </div>
              
              <div className="flex justify-between items-center pt-3">
                <span className="text-lg font-semibold">Invoice Amount</span>
                <span className="text-2xl font-bold text-green-600">
                  ${calculateInvoiceAmount()}
                </span>
              </div>

              <Button className="w-full mt-4" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Generate Invoice
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Reference */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base">Pricing Quick Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-semibold mb-2">Pilot + PPL</p>
                <p className="text-muted-foreground">$300-500 refundable</p>
                <p className="text-muted-foreground">$60-350 per lead</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Pay Per Show</p>
                <p className="text-muted-foreground">60% deposit</p>
                <p className="text-muted-foreground">$120-450 per appt</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Hybrid/Subscription</p>
                <p className="text-muted-foreground">$1.5k-3k/month base</p>
                <p className="text-muted-foreground">$35-120 per lead</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
