'use client';

import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import OnboardingWizard from '@/components/admin/OnboardingWizard';

export default function NewClientPage() {
  const router = useRouter();

  const handleComplete = (clientId) => {
    // Redirect to the client detail page
    router.push(`/admin/clients/${clientId}`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 py-6">
        <div>
          <h1 className="text-3xl font-bold">Onboard New Client</h1>
          <p className="text-muted-foreground">Add a new client to your ARI Solutions platform</p>
        </div>

        <OnboardingWizard onComplete={handleComplete} />
      </div>
    </AdminLayout>
  );
}
