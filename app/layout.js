import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export const metadata = {
  title: 'ARI Solutions - Client Management Platform',
  description: 'Manage AI Virtual Receptionist and Appointment Booking Accelerator services',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
