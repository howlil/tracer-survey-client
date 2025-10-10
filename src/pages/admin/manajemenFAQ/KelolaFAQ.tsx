/** @format */

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  HelpCircle,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Calendar,
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useNavigate } from 'react-router-dom';

// Types untuk FAQ
interface FAQ {
  id: string;
  title: string;
  link: string;
  createdAt: string;
  updatedAt: string;
}

interface FAQFormData {
  title: string;
  link: string;
}

const KelolaFAQ: React.FC = () => {
  const navigate = useNavigate();

  // State management
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [deleteFAQ, setDeleteFAQ] = useState<FAQ | null>(null);
  const [loading, setLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState<FAQFormData>({
    title: '',
    link: '',
  });

  // Mock data - replace with API calls
  useEffect(() => {
    const mockFAQs: FAQ[] = [
      {
        id: '1',
        title: 'Bagaimana cara mengisi survey Tracer Study?',
        link: 'https://help.unand.ac.id/tracer-study-guide',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      },
      {
        id: '2',
        title: 'Kapan deadline pengisian survey?',
        link: 'https://help.unand.ac.id/survey-deadline',
        createdAt: '2024-01-16T14:30:00Z',
        updatedAt: '2024-01-16T14:30:00Z',
      },
      {
        id: '3',
        title: 'Bagaimana cara reset password?',
        link: 'https://help.unand.ac.id/reset-password',
        createdAt: '2024-01-17T09:15:00Z',
        updatedAt: '2024-01-17T09:15:00Z',
      },
      {
        id: '4',
        title: 'Apakah survey ini wajib diisi?',
        link: 'https://help.unand.ac.id/survey-mandatory',
        createdAt: '2024-01-18T11:45:00Z',
        updatedAt: '2024-01-18T11:45:00Z',
      },
      {
        id: '5',
        title: 'Bagaimana cara menghubungi admin?',
        link: 'https://help.unand.ac.id/contact-admin',
        createdAt: '2024-01-19T16:20:00Z',
        updatedAt: '2024-01-19T16:20:00Z',
      },
    ];
    setFaqs(mockFAQs);
  }, []);

  // Form handlers
  const resetForm = () => {
    setFormData({
      title: '',
      link: '',
    });
    setEditingFAQ(null);
  };

  const handleInputChange = (field: keyof FAQFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveFAQ = async () => {
    setLoading(true);
    try {
      if (editingFAQ) {
        // Update existing FAQ
        const updatedFAQ: FAQ = {
          ...editingFAQ,
          ...formData,
          updatedAt: new Date().toISOString(),
        };
        setFaqs((prev) =>
          prev.map((f) => (f.id === editingFAQ.id ? updatedFAQ : f))
        );
      } else {
        // Create new FAQ
        const newFAQ: FAQ = {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setFaqs((prev) => [newFAQ, ...prev]);
      }

      setIsSheetOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving FAQ:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFAQ = async () => {
    if (!deleteFAQ) return;

    setLoading(true);
    try {
      setFaqs((prev) => prev.filter((f) => f.id !== deleteFAQ.id));
      setDeleteFAQ(null);
    } catch (error) {
      console.error('Error deleting FAQ:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditFAQ = (faq: FAQ) => {
    setFormData({
      title: faq.title,
      link: faq.link,
    });
    setEditingFAQ(faq);
    setIsSheetOpen(true);
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

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
                    <HelpCircle className='h-4 w-4' />
                    <span>Dashboard</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Kelola FAQ</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Button Tambah FAQ */}
            <Button onClick={() => setIsSheetOpen(true)}>
              <Plus className='mr-2 h-4 w-4' />
              Tambah FAQ
            </Button>
          </div>
        </div>

        {/* FAQ Table */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2'>
              <HelpCircle className='h-5 w-5' />
              <span>Daftar FAQ</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul FAQ</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Status Link</TableHead>
                  <TableHead>Tanggal Dibuat</TableHead>
                  <TableHead className='text-right'>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faqs.map((faq) => (
                  <TableRow key={faq.id}>
                    <TableCell className='font-medium'>{faq.title}</TableCell>
                    <TableCell>
                      <div className='flex items-center space-x-2'>
                        <span className='text-sm text-muted-foreground max-w-xs truncate'>
                          {faq.link}
                        </span>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => window.open(faq.link, '_blank')}
                          className='h-6 w-6 p-0'
                        >
                          <ExternalLink className='h-3 w-3' />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={isValidUrl(faq.link) ? 'default' : 'destructive'}
                        className={
                          isValidUrl(faq.link)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }
                      >
                        {isValidUrl(faq.link) ? 'Valid' : 'Invalid'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center space-x-2'>
                        <Calendar className='h-4 w-4 text-muted-foreground' />
                        <span>
                          {new Date(faq.createdAt).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex items-center justify-end space-x-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleEditFAQ(faq)}
                        >
                          <Edit className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => setDeleteFAQ(faq)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create/Edit FAQ Sheet */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className='w-[95vw] max-w-[800px] overflow-y-auto'>
            <SheetHeader>
              <SheetTitle>
                {editingFAQ ? 'Edit FAQ' : 'Tambah FAQ'}
              </SheetTitle>
              <SheetDescription>
                {editingFAQ
                  ? 'Ubah informasi FAQ yang sudah ada'
                  : 'Buat FAQ baru untuk membantu pengguna'}
              </SheetDescription>
            </SheetHeader>

            <div className='px-4 space-y-8'>
              {/* Basic Info Section */}
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='title' className='text-sm font-medium'>
                    Judul FAQ *
                  </Label>
                  <Input
                    id='title'
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder='Bagaimana cara mengisi survey Tracer Study?'
                    className='text-sm'
                  />
                  <p className='text-xs text-gray-500'>
                    Pertanyaan yang sering diajukan pengguna
                  </p>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='link' className='text-sm font-medium'>
                    Link Jawaban *
                  </Label>
                  <Input
                    id='link'
                    value={formData.link}
                    onChange={(e) => handleInputChange('link', e.target.value)}
                    placeholder='https://help.unand.ac.id/tracer-study-guide'
                    className='text-sm'
                  />
                  <p className='text-xs text-gray-500'>
                    URL yang mengarah ke halaman jawaban atau panduan
                  </p>
                  {formData.link && !isValidUrl(formData.link) && (
                    <p className='text-xs text-red-500'>
                      Format URL tidak valid. Pastikan URL dimulai dengan http://
                      atau https://
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className='flex justify-end space-x-2'>
                <Button
                  variant='outline'
                  onClick={() => setIsSheetOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSaveFAQ}
                  disabled={loading || !formData.title || !formData.link}
                >
                  {loading ? 'Menyimpan...' : editingFAQ ? 'Update' : 'Simpan'}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!deleteFAQ}
          onOpenChange={() => setDeleteFAQ(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus FAQ</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div>
                  Apakah Anda yakin ingin menghapus FAQ{' '}
                  <strong>{deleteFAQ?.title}</strong>?
                  <br />
                  <br />
                  Tindakan ini tidak dapat dibatalkan dan akan menghapus FAQ
                  secara permanen.
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteFAQ}
                disabled={loading}
              >
                {loading ? 'Menghapus...' : 'Hapus'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default KelolaFAQ;
