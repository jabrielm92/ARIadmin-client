'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye } from 'lucide-react';

export default function LeadManagementSection({ config, setConfig, clientId }) {
  const updateLeadManagement = (field, value) => {
    setConfig({
      ...config,
      leadManagement: {
        ...config.leadManagement,
        [field]: value
      }
    });
  };

  const updateAssignmentRules = (field, value) => {
    setConfig({
      ...config,
      leadManagement: {
        ...config.leadManagement,
        assignmentRules: {
          ...config.leadManagement.assignmentRules,
          [field]: value
        }
      }
    });
  };

  const updateNotifications = (field, value) => {
    setConfig({
      ...config,
      leadManagement: {
        ...config.leadManagement,
        notifications: {
          ...config.leadManagement.notifications,
          [field]: value
        }
      }
    });
  };

  // Mock leads for demonstration
  const mockLeads = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1-555-0123', status: 'new', created: '2 hours ago' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1-555-0456', status: 'contacted', created: '1 day ago' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '+1-555-0789', status: 'qualified', created: '3 days ago' }
  ];

  return (
    <div className="space-y-6">
      {/* Lead Statuses */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Statuses</CardTitle>
          <CardDescription>Customize the stages in your lead pipeline</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Status Labels (one per line)</Label>
            <Textarea
              placeholder="new\ncontacted\nqualified\nappointment-set\nconverted\nlost"
              value={config.leadManagement?.statuses?.join('\n') || ''}
              onChange={(e) => updateLeadManagement('statuses', e.target.value.split('\n').filter(Boolean))}
              rows={6}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {config.leadManagement?.statuses?.map((status) => (
              <Badge key={status} variant="secondary">
                {status}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assignment Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Assignment</CardTitle>
          <CardDescription>Automatically assign leads to team members</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Auto-Assignment</Label>
              <p className="text-sm text-muted-foreground">
                Automatically assign new leads
              </p>
            </div>
            <Switch
              checked={config.leadManagement?.assignmentRules?.enabled || false}
              onCheckedChange={(checked) => updateAssignmentRules('enabled', checked)}
            />
          </div>

          {config.leadManagement?.assignmentRules?.enabled && (
            <>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Round Robin Assignment</Label>
                  <p className="text-sm text-muted-foreground">
                    Distribute leads evenly among team
                  </p>
                </div>
                <Switch
                  checked={config.leadManagement?.assignmentRules?.roundRobin || false}
                  onCheckedChange={(checked) => updateAssignmentRules('roundRobin', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Team Members (one email per line)</Label>
                <Textarea
                  placeholder="sales1@company.com\nsales2@company.com\nsales3@company.com"
                  value={config.leadManagement?.assignmentRules?.assignees?.join('\n') || ''}
                  onChange={(e) => updateAssignmentRules('assignees', e.target.value.split('\n').filter(Boolean))}
                  rows={4}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Notifications</CardTitle>
          <CardDescription>Get notified when new leads come in</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email Notifications (one per line)</Label>
            <Textarea
              placeholder="manager@company.com\nsales@company.com"
              value={config.leadManagement?.notifications?.email?.join('\n') || ''}
              onChange={(e) => updateNotifications('email', e.target.value.split('\n').filter(Boolean))}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Slack Webhook URL</Label>
            <Input
              placeholder="https://hooks.slack.com/services/..."
              value={config.leadManagement?.notifications?.slack || ''}
              onChange={(e) => updateNotifications('slack', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Send lead notifications to Slack channel
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Lead Inbox Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Inbox (Preview)</CardTitle>
          <CardDescription>This is how leads will appear in your inbox</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{lead.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{lead.created}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="text-xs text-muted-foreground mt-4">
            Note: This is sample data. Real leads will appear here once your booking page is live.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
