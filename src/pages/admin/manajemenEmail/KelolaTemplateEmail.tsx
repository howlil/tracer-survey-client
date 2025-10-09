/** @format */

import React from 'react';
import { AdminLayout } from '@/components/layout/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { File, Mail, Plus } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useNavigate } from 'react-router-dom';

const KelolaTemplateEmail: React.FC = () => {
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
                  <BreadcrumbPage>Kelola Template Email</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Button Tambah Template */}
            <Button>
              <Plus className='mr-2 h-4 w-4' />
              Tambah Template
            </Button>
          </div>
        </div>

        {/* Coming Soon Card */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2'>
              <File className='h-5 w-5' />
              <span>Kelola Template Email</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-center py-12'>
              <div className='mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4'>
                <File className='h-12 w-12 text-muted-foreground' />
              </div>
              <h3 className='text-lg font-semibold mb-2'>Fitur Sedang Dikembangkan</h3>
              <p className='text-muted-foreground mb-4'>
                Halaman untuk mengelola template email akan segera hadir.
              </p>
              <div className='text-sm text-muted-foreground'>
                <p>Fitur yang akan tersedia:</p>
                <ul className='mt-2 space-y-1'>
                  <li>• Buat template email baru</li>
                  <li>• Edit template yang sudah ada</li>
                  <li>• Hapus template</li>
                  <li>• Preview template</li>
                  <li>• Kategori template</li>
                  <li>• Import/Export template</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default KelolaTemplateEmail;
