/** @format */

import React, {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Briefcase,
  User,
  Eye,
  EyeOff,
  Copy,
  GraduationCap,
} from 'lucide-react';
import {AdminLayout} from '@/components/layout/admin';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {useNavigate, useParams} from 'react-router-dom';
import {toast} from 'sonner';
import {useManagerById} from '@/api/manager.api';

const DetailManager: React.FC = () => {
  const navigate = useNavigate();
  const {id: managerId} = useParams<{id: string}>();
  const [visiblePins, setVisiblePins] = useState<Set<string>>(new Set());

  const {
    data: manager,
    isLoading: loading,
    error,
  } = useManagerById(managerId || '');

  const togglePinVisibility = (alumniId: string) => {
    const newVisiblePins = new Set(visiblePins);
    if (newVisiblePins.has(alumniId)) {
      newVisiblePins.delete(alumniId);
    } else {
      newVisiblePins.add(alumniId);
    }
    setVisiblePins(newVisiblePins);
  };

  const copyPin = (pin: string) => {
    navigator.clipboard.writeText(pin);
    toast.success('PIN berhasil disalin');
  };

  const getGraduatePeriodeLabel = (periode: string) => {
    switch (periode) {
      case 'WISUDA_I':
        return 'Wisuda I';
      case 'WISUDA_II':
        return 'Wisuda II';
      case 'WISUDA_III':
        return 'Wisuda III';
      case 'WISUDA_IV':
        return 'Wisuda IV';
      case 'WISUDA_V':
        return 'Wisuda V';
      case 'WISUDA_VI':
        return 'Wisuda VI';
      default:
        return periode;
    }
  };

  const getDegreeLabel = (degree: string) => {
    switch (degree) {
      case 'S1':
        return 'Sarjana (S1)';
      case 'S2':
        return 'Magister (S2)';
      case 'S3':
        return 'Doktor (S3)';
      case 'D3':
        return 'Diploma 3 (D3)';
      case 'VOKASI':
        return 'Vokasi';
      case 'PROFESI':
        return 'Profesi';
      case 'PASCA':
        return 'Pascasarjana';
      default:
        return degree;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className='flex items-center justify-center min-h-[400px]'>
          <p className='text-muted-foreground'>Memuat data...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !manager) {
    return (
      <AdminLayout>
        <div className='flex items-center justify-center min-h-[400px]'>
          <p className='text-destructive'>
            {error ? 'Gagal memuat data manager' : 'Manager tidak ditemukan'}
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className='space-y-6 p-6'>
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href='/admin/users/manager'
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/admin/users/manager');
                }}
              >
                Database Manager
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Detail Manager</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => navigate('/admin/users/manager')}
            >
              <ArrowLeft className='h-5 w-5' />
            </Button>
            <div>
              <h1 className='text-3xl font-bold'>Detail Manager</h1>
              <p className='text-muted-foreground mt-1'>
                Informasi lengkap manager dan daftar alumni terkait
              </p>
            </div>
          </div>
        </div>

        {/* Manager Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <User className='h-5 w-5' />
              Informasi Manager
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-muted-foreground'>
                  Nama Lengkap
                </label>
                <p className='text-base font-semibold'>
                  {manager.respondent.fullName}
                </p>
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
                  <Mail className='h-4 w-4' />
                  Email
                </label>
                <p className='text-base'>{manager.respondent.email}</p>
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
                  <Building2 className='h-4 w-4' />
                  Perusahaan
                </label>
                <p className='text-base'>{manager.company}</p>
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
                  <Briefcase className='h-4 w-4' />
                  Posisi/Jabatan
                </label>
                <p className='text-base'>{manager.position}</p>
              </div>
              {manager.phoneNumber && (
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
                    <Phone className='h-4 w-4' />
                    Nomor Telepon
                  </label>
                  <p className='text-base'>{manager.phoneNumber}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Alumni List Card */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <GraduationCap className='h-5 w-5' />
              Daftar Alumni ({manager.alumni.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {manager.alumni.length === 0 ? (
              <div className='text-center py-8'>
                <p className='text-muted-foreground'>
                  Belum ada alumni yang terkait dengan manager ini
                </p>
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow className='border-border/50 bg-muted/30'>
                      <TableHead className='font-semibold'>NIM</TableHead>
                      <TableHead className='font-semibold'>Nama Lengkap</TableHead>
                      <TableHead className='font-semibold'>Email</TableHead>
                      <TableHead className='font-semibold'>Fakultas</TableHead>
                      <TableHead className='font-semibold'>Program Studi</TableHead>
                      <TableHead className='font-semibold'>Jenjang</TableHead>
                      <TableHead className='font-semibold'>Tahun Lulus</TableHead>
                      <TableHead className='font-semibold'>Periode</TableHead>
                      <TableHead className='font-semibold'>PIN User Survey</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {manager.alumni.map((alumni) => (
                      <TableRow
                        key={alumni.id}
                        className='border-border/30 hover:bg-muted/30 transition-colors'
                      >
                        <TableCell className='font-medium'>{alumni.nim}</TableCell>
                        <TableCell>{alumni.fullName}</TableCell>
                        <TableCell className='text-sm text-muted-foreground'>
                          {alumni.email}
                        </TableCell>
                        <TableCell>{alumni.faculty}</TableCell>
                        <TableCell>{alumni.major}</TableCell>
                        <TableCell>{getDegreeLabel(alumni.degree)}</TableCell>
                        <TableCell>{alumni.graduatedYear}</TableCell>
                        <TableCell>
                          {getGraduatePeriodeLabel(alumni.graduatePeriode)}
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            {alumni.pin ? (
                              <>
                                <span className='font-mono text-sm'>
                                  {visiblePins.has(alumni.id)
                                    ? alumni.pin
                                    : '••••••'}
                                </span>
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  className='h-6 w-6'
                                  onClick={() => togglePinVisibility(alumni.id)}
                                  title={
                                    visiblePins.has(alumni.id)
                                      ? 'Sembunyikan PIN'
                                      : 'Tampilkan PIN'
                                  }
                                >
                                  {visiblePins.has(alumni.id) ? (
                                    <EyeOff className='h-4 w-4' />
                                  ) : (
                                    <Eye className='h-4 w-4' />
                                  )}
                                </Button>
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  className='h-6 w-6'
                                  onClick={() => copyPin(alumni.pin)}
                                  title='Salin PIN'
                                >
                                  <Copy className='h-4 w-4' />
                                </Button>
                              </>
                            ) : (
                              <span className='text-sm text-muted-foreground'>-</span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default DetailManager;

