'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ClientLayout from '@/components/ClientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Eye, Search, Download, Phone, Mail, FileText, CheckCircle, XCircle } from 'lucide-react';

export default function ClientLeads() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [leadNotes, setLeadNotes] = useState('');
  const [leadStatus, setLeadStatus] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [activeAction, setActiveAction] = useState('details'); // details, call, email, notes, status

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
      setLoading(false);
    } catch (error) {
      router.push('/client/login');
    }
  }, [router]);

  const handleOpenDialog = (lead) => {
    setSelectedLead(lead);
    setLeadStatus(lead.status);
    setLeadNotes('');
    setEmailSubject(`Follow up with ${lead.name}`);
    setEmailBody(`Hi ${lead.name},\n\nThank you for your interest...`);
    setActiveAction('details');
    setDialogOpen(true);
  };

  const handleCallLead = () => {
    // Placeholder for phone integration
    alert(`Calling ${selectedLead.phone}...\n\nThis would integrate with your phone system or VoIP service.`);
  };

  const handleSendEmail = () => {
    // Placeholder for email integration
    alert(`Email sent to ${selectedLead.email}\n\nSubject: ${emailSubject}\n\nThis would integrate with your email service.`);
    setDialogOpen(false);
  };

  const handleAddNote = () => {
    if (!leadNotes.trim()) {
      alert('Please enter a note');
      return;
    }
    alert(`Note added to ${selectedLead.name}:\n\n${leadNotes}`);
    setDialogOpen(false);
  };

  const handleUpdateStatus = () => {
    alert(`Status updated for ${selectedLead.name}\n\nNew status: ${leadStatus}`);
    setDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Mock leads
  const mockLeads = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1-555-0123', source: 'Landing Page', status: 'new', created: '2 hours ago', score: 85, company: 'Tech Corp', interest: 'AI Receptionist' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1-555-0456', source: 'AI Receptionist', status: 'contacted', created: '1 day ago', score: 72, company: 'Design Studio', interest: 'Booking System' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '+1-555-0789', source: 'Landing Page', status: 'qualified', created: '3 days ago', score: 90, company: 'Law Firm', interest: 'Both Services' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', phone: '+1-555-0111', source: 'Landing Page', status: 'appointment-set', created: '5 days ago', score: 95, company: 'Medical Practice', interest: 'AI Receptionist' },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', phone: '+1-555-0222', source: 'AI Receptionist', status: 'converted', created: '1 week ago', score: 88, company: 'Consulting Firm', interest: 'Both Services' }
  ];

  const filteredLeads = mockLeads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500';
      case 'contacted':
        return 'bg-yellow-500';
      case 'qualified':
        return 'bg-purple-500';
      case 'appointment-set':
        return 'bg-orange-500';
      case 'converted':
        return 'bg-green-500';
      case 'lost':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Leads</h1>
            <p className="text-muted-foreground">Manage and track your captured leads</p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Leads
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
              <p className="text-3xl font-bold">{mockLeads.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">New</p>
              <p className="text-3xl font-bold">{mockLeads.filter(l => l.status === 'new').length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Qualified</p>
              <p className="text-3xl font-bold">{mockLeads.filter(l => l.status === 'qualified').length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Converted</p>
              <p className="text-3xl font-bold">{mockLeads.filter(l => l.status === 'converted').length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Inbox</CardTitle>
            <CardDescription>All captured leads from your services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="appointment-set">Appointment Set</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.phone}</TableCell>
                    <TableCell>{lead.source}</TableCell>
                    <TableCell>
                      <span className={`font-bold ${getScoreColor(lead.score)}`}>
                        {lead.score}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{lead.created}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleOpenDialog(lead)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Lead Actions Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Lead Actions - {selectedLead?.name}</DialogTitle>
              <DialogDescription>
                Manage this lead with quick actions
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Action Tabs */}
              <div className="flex gap-2 border-b pb-2">
                <Button 
                  variant={activeAction === 'details' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveAction('details')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Details
                </Button>
                <Button 
                  variant={activeAction === 'call' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveAction('call')}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button 
                  variant={activeAction === 'email' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveAction('email')}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button 
                  variant={activeAction === 'notes' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveAction('notes')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Notes
                </Button>
                <Button 
                  variant={activeAction === 'status' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveAction('status')}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Status
                </Button>
              </div>

              {/* Details View */}
              {activeAction === 'details' && selectedLead && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Name</Label>
                      <p className="font-medium">{selectedLead.name}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Company</Label>
                      <p className="font-medium">{selectedLead.company}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Email</Label>
                      <p className="font-medium">{selectedLead.email}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Phone</Label>
                      <p className="font-medium">{selectedLead.phone}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Source</Label>
                      <p className="font-medium">{selectedLead.source}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Interest</Label>
                      <p className="font-medium">{selectedLead.interest}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Lead Score</Label>
                      <p className={`font-bold text-lg ${getScoreColor(selectedLead.score)}`}>{selectedLead.score}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Status</Label>
                      <Badge className={getStatusColor(selectedLead.status)}>
                        {selectedLead.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* Call Action */}
              {activeAction === 'call' && selectedLead && (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Call</p>
                    <p className="text-2xl font-bold">{selectedLead.phone}</p>
                  </div>
                  <Button onClick={handleCallLead} className="w-full">
                    <Phone className="mr-2 h-4 w-4" />
                    Initiate Call
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    This will integrate with your phone system or VoIP service
                  </p>
                </div>
              )}

              {/* Email Action */}
              {activeAction === 'email' && selectedLead && (
                <div className="space-y-4">
                  <div>
                    <Label>To</Label>
                    <Input value={selectedLead.email} disabled />
                  </div>
                  <div>
                    <Label>Subject</Label>
                    <Input 
                      value={emailSubject} 
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Email subject"
                    />
                  </div>
                  <div>
                    <Label>Message</Label>
                    <Textarea 
                      value={emailBody} 
                      onChange={(e) => setEmailBody(e.target.value)}
                      placeholder="Email body"
                      rows={6}
                    />
                  </div>
                  <Button onClick={handleSendEmail} className="w-full">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </Button>
                </div>
              )}

              {/* Notes Action */}
              {activeAction === 'notes' && selectedLead && (
                <div className="space-y-4">
                  <div>
                    <Label>Add Note</Label>
                    <Textarea 
                      value={leadNotes} 
                      onChange={(e) => setLeadNotes(e.target.value)}
                      placeholder="Add notes about this lead..."
                      rows={8}
                    />
                  </div>
                  <Button onClick={handleAddNote} className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Save Note
                  </Button>
                </div>
              )}

              {/* Status Action */}
              {activeAction === 'status' && selectedLead && (
                <div className="space-y-4">
                  <div>
                    <Label>Current Status</Label>
                    <Badge className={getStatusColor(selectedLead.status)}>
                      {selectedLead.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <Label>Update Status</Label>
                    <Select value={leadStatus} onValueChange={setLeadStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="appointment-set">Appointment Set</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                        <SelectItem value="lost">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleUpdateStatus} className="w-full">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Update Status
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ClientLayout>
  );
}
