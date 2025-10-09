/** @format */

import React from 'react';
import { AdminLayout } from '@/components/layout/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Users } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useNavigate } from 'react-router-dom';

const PaketSoalUserSurvey: React.FC = () => {
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
                    <FileText className='h-4 w-4' />
                    <span>Manajemen Paket Soal</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Kelola Paket Soal User Survey</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Button Tambah Paket Soal */}
            <Button>
              <Plus className='mr-2 h-4 w-4' />
              Tambah Paket Soal
            </Button>
          </div>
        </div>

        {/* Coming Soon Card */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2'>
              <Users className='h-5 w-5' />
              <span>Kelola Paket Soal User Survey</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-center py-12'>
              <div className='mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4'>
                <Users className='h-12 w-12 text-muted-foreground' />
              </div>
              <h3 className='text-lg font-semibold mb-2'>Fitur Sedang Dikembangkan</h3>
              <p className='text-muted-foreground mb-4'>
                Halaman untuk mengelola paket soal User Survey akan segera hadir.
              </p>
              <div className='text-sm text-muted-foreground'>
                <p>Fitur yang akan tersedia:</p>
                <ul className='mt-2 space-y-1'>
                  <li>• Buat paket soal User Survey</li>
                  <li>• Edit paket soal yang sudah ada</li>
                  <li>• Hapus paket soal</li>
                  <li>• Preview soal</li>
                  <li>• Manajemen kategori soal</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default PaketSoalUserSurvey;
