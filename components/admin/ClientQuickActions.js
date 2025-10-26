'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { Key, Trash2, UserX, Mail, Copy, Check } from 'lucide-react';

export default function ClientQuickActions({ client, onUpdate }) {
  const router = useRouter();
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(password);
  };

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/clients/${client.clientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
      });

      if (response.ok) {
        alert('Password reset successfully!');
        setShowResetPassword(false);
        setNewPassword('');
      } else {
        alert('Failed to reset password');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/clients/${client.clientId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Client deleted successfully');
        router.push('/admin/clients');
      } else {
        alert('Failed to delete client');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendClient = async () => {
    setLoading(true);
    try {
      const newStatus = client.status === 'active' ? 'suspended' : 'active';
      const response = await fetch(`/api/clients/${client.clientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        alert(`Client ${newStatus === 'active' ? 'activated' : 'suspended'} successfully!`);
        if (onUpdate) onUpdate();
      } else {
        alert('Failed to update client status');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              generatePassword();
              setShowResetPassword(true);
            }}
          >
            <Key className="mr-2 h-4 w-4" />
            Reset Password
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleSuspendClient}
            disabled={loading}
          >
            <UserX className="mr-2 h-4 w-4" />
            {client.status === 'active' ? 'Suspend Client' : 'Activate Client'}
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => window.location.href = `mailto:${client.email}`}
          >
            <Mail className="mr-2 h-4 w-4" />
            Send Email
          </Button>

          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Client
          </Button>
        </CardContent>
      </Card>

      {/* Reset Password Dialog */}
      <Dialog open={showResetPassword} onOpenChange={setShowResetPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Client Password</DialogTitle>
            <DialogDescription>
              Generate a new password for {client.businessName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>New Password</Label>
              <div className="flex gap-2">
                <Input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(newPassword)}
                  disabled={!newPassword}
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={generatePassword}
            >
              Generate Random Password
            </Button>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetPassword(false)}>
              Cancel
            </Button>
            <Button onClick={handleResetPassword} disabled={!newPassword || loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Client</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {client.businessName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-900 dark:text-red-100">
              ⚠️ <strong>Warning:</strong> This will permanently delete all client data, including calls, leads, appointments, and configurations.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteClient} disabled={loading}>
              {loading ? 'Deleting...' : 'Delete Permanently'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
