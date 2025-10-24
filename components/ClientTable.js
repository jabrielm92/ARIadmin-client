'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Eye, Trash2, Phone, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function ClientTable({ clients, onRefresh }) {
  const router = useRouter();

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-gray-500';
      case 'suspended':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (!clients || clients.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">No clients found. Add your first client to get started.</p>
        <Button className="mt-4" onClick={() => router.push('/admin/clients/new')}>
          Add Client
        </Button>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business Name</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Services</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.businessName}</TableCell>
              <TableCell className="capitalize">{client.industry}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {client.aiReceptionist && (
                    <Badge variant="secondary" className="text-xs">
                      <Phone className="mr-1 h-3 w-3" />
                      AI
                    </Badge>
                  )}
                  {client.bookingAccelerator && (
                    <Badge variant="secondary" className="text-xs">
                      <Calendar className="mr-1 h-3 w-3" />
                      ABA
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(client.status)}>
                  {client.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/admin/clients/${client.id}/edit`)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    {client.aiReceptionist && (
                      <DropdownMenuItem onClick={() => router.push(`/admin/clients/${client.id}/ai-receptionist`)}>
                        <Phone className="mr-2 h-4 w-4" />
                        Configure AI Receptionist
                      </DropdownMenuItem>
                    )}
                    {client.bookingAccelerator && (
                      <DropdownMenuItem onClick={() => router.push(`/admin/clients/${client.id}/booking-accelerator`)}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Configure Booking
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => router.push(`/admin/clients/${client.id}`)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
