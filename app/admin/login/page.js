'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { loginUser } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await loginUser(email, password);

    if (result.success) {
      toast({
        title: 'Success',
        description: 'Logged in successfully!',
      });
      router.push('/admin/dashboard');
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Invalid credentials',
        variant: 'destructive',
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-teal-500">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">ARI Solutions</CardTitle>
          <CardDescription className="text-center">
            Admin Dashboard Login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@arisolutions.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> Configure Firebase credentials in .env file first. 
              Default test: admin@arisolutions.com / password123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
