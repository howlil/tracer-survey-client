/** @format */

import React from 'react';
import { AdminLayout } from '@/components/layout/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, Mail, Plus } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useNavigate } from 'react-router-dom';

const KirimEmail: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className='p-6 space-y-6'>
        {/* Header */}
        <div className='mb-6 relative'>
          <div className='flex items-center justify-between'>
            {/* Breadcrumb */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    onClick={() => navigate('/admin/dashboard')}
                    className='flex items-center space-x-1 cursor-pointer hover:text-primary'
                  >
                    <Mail className='h-4 w-4' />
                    <span>Manajemen Email</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Kirim Email</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Button Kirim Email */}
            <Button>
              <Plus className='mr-2 h-4 w-4' />
              Kirim Email Baru
            </Button>
          </div>
        </div>

        {/* Coming Soon Card */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2'>
              <Send className='h-5 w-5' />
              <span>Kirim Email</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-center py-12'>
              <div className='mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4'>
                <Mail className='h-12 w-12 text-muted-foreground' />
              </div>
              <h3 className='text-lg font-semibold mb-2'>Fitur Sedang Dikembangkan</h3>
              <p className='text-muted-foreground mb-4'>
                Halaman untuk mengirim email ke pengguna akan segera hadir.
              </p>
              <div className='text-sm text-muted-foreground'>
                <p>Fitur yang akan tersedia:</p>
                <ul className='mt-2 space-y-1'>
                  <li>• Kirim email ke semua pengguna</li>
                  <li>• Kirim email berdasarkan kategori</li>
                  <li>• Template email yang sudah dibuat</li>
                  <li>• Jadwal pengiriman email</li>
                  <li>• Tracking status pengiriman</li>
                  <li>• History email yang dikirim</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default KirimEmail;
