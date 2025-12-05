/** @format */

import React, {useState} from 'react';
import {AdminLayout} from '@/components/layout/admin';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
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
import {useNavigate} from 'react-router-dom';
import {toast} from 'sonner';
import {
  useFAQs,
  useCreateFAQ,
  useUpdateFAQ,
  useDeleteFAQ,
  type FAQ,
} from '@/api/faq.api';

interface FAQFormData {
  question: string;
  answer: string;
}

const KelolaFAQ: React.FC = () => {
  const navigate = useNavigate();

  const {data: faqs = [], isLoading: isLoadingFAQs} = useFAQs();
  const createFAQMutation = useCreateFAQ();
  const updateFAQMutation = useUpdateFAQ();
  const deleteFAQMutation = useDeleteFAQ();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [deleteFAQ, setDeleteFAQ] = useState<FAQ | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Form data
  const [formData, setFormData] = useState<FAQFormData>({
    question: '',
    answer: '',
  });

  // Form handlers
  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
    });
    setEditingFAQ(null);
    setFormErrors({});
  };

  const handleInputChange = (field: keyof FAQFormData, value: string) => {
    setFormData((prev) => ({...prev, [field]: value}));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = {...prev};
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSaveFAQ = async () => {
    setFormErrors({});

    if (!formData.question.trim() || !formData.answer.trim()) {
      toast.error('Pertanyaan dan Jawaban wajib diisi');
      return;
    }

    try {
      if (editingFAQ) {
        await updateFAQMutation.mutateAsync({
          id: editingFAQ.id,
          data: formData,
        });
        toast.success('FAQ berhasil diperbarui');
      } else {
        await createFAQMutation.mutateAsync(formData);
        toast.success('FAQ berhasil dibuat');
      }

      setIsSheetOpen(false);
      resetForm();
      setFormErrors({});
    } catch (err) {
      const error = err as {
        response?: {
          data?: {
            message?: Array<{field: string; message: string}> | string;
          };
        };
      };

      if (error.response?.data?.message) {
        const errorMessage = error.response.data.message;
        
        if (Array.isArray(errorMessage)) {
          const fieldErrors: Record<string, string> = {};
          errorMessage.forEach((err) => {
            if (err.field && err.message) {
              fieldErrors[err.field] = err.message;
            }
          });
          setFormErrors(fieldErrors);
        } else if (typeof errorMessage === 'string') {
          toast.error(errorMessage);
        }
      }
    }
  };

  const handleDeleteFAQ = async () => {
    if (!deleteFAQ) return;

    try {
      await deleteFAQMutation.mutateAsync(deleteFAQ.id);
      toast.success('FAQ berhasil dihapus');
      setDeleteFAQ(null);
    } catch (error) {
      console.error('Error deleting FAQ:', error);
    }
  };

  const handleEditFAQ = (faq: FAQ) => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
    });
    setEditingFAQ(faq);
    setIsSheetOpen(true);
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
                  <TableHead>Pertanyaan</TableHead>
                  <TableHead>Jawaban</TableHead>
                  <TableHead>Tanggal Dibuat</TableHead>
                  <TableHead className='text-right'>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingFAQs ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className='text-center py-8 text-muted-foreground'
                    >
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : faqs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className='text-center py-8 text-muted-foreground'
                    >
                      Tidak ada FAQ
                    </TableCell>
                  </TableRow>
                ) : (
                  faqs.map((faq) => (
                    <TableRow key={faq.id}>
                      <TableCell className='font-medium max-w-md'>
                        <p className='line-clamp-2'>{faq.question}</p>
                      </TableCell>
                      <TableCell className='max-w-md'>
                        <p className='text-sm text-muted-foreground line-clamp-2'>
                          {faq.answer}
                        </p>
                      </TableCell>
                      <TableCell>
                        {faq.createdAt ? (
                          <div className='flex items-center space-x-2'>
                            <Calendar className='h-4 w-4 text-muted-foreground' />
                            <span>
                              {new Date(faq.createdAt).toLocaleDateString(
                                'id-ID'
                              )}
                            </span>
                          </div>
                        ) : (
                          <span className='text-muted-foreground'>-</span>
                        )}
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
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create/Edit FAQ Sheet */}
        <Sheet
          open={isSheetOpen}
          onOpenChange={setIsSheetOpen}
        >
          <SheetContent className='w-[95vw] max-w-[800px] overflow-y-auto'>
            <SheetHeader>
              <SheetTitle>{editingFAQ ? 'Edit FAQ' : 'Tambah FAQ'}</SheetTitle>
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
                  <Label
                    htmlFor='question'
                    className='text-sm font-medium'
                  >
                    Pertanyaan *
                  </Label>
                  <Input
                    id='question'
                    value={formData.question}
                    onChange={(e) => handleInputChange('question', e.target.value)}
                    placeholder='Apa itu Tracer Study?'
                    className={`text-sm ${formErrors.question ? 'border-red-500' : ''}`}
                  />
                  {formErrors.question ? (
                    <p className='text-xs text-red-500'>{formErrors.question}</p>
                  ) : (
                    <p className='text-xs text-gray-500'>
                      Pertanyaan yang sering diajukan pengguna
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label
                    htmlFor='answer'
                    className='text-sm font-medium'
                  >
                    Jawaban *
                  </Label>
                  <textarea
                    id='answer'
                    value={formData.answer}
                    onChange={(e) => handleInputChange('answer', e.target.value)}
                    placeholder='Tracer Study adalah survei yang dilakukan untuk melacak perjalanan karier alumni setelah lulus dari universitas...'
                    className={`flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${formErrors.answer ? 'border-red-500' : ''}`}
                    rows={5}
                  />
                  {formErrors.answer ? (
                    <p className='text-xs text-red-500'>{formErrors.answer}</p>
                  ) : (
                    <p className='text-xs text-gray-500'>
                      Jawaban lengkap untuk pertanyaan di atas
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
                  disabled={
                    createFAQMutation.isPending ||
                    updateFAQMutation.isPending ||
                    !formData.question ||
                    !formData.answer
                  }
                >
                  {createFAQMutation.isPending || updateFAQMutation.isPending
                    ? 'Menyimpan...'
                    : editingFAQ
                    ? 'Update'
                    : 'Simpan'}
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
                  <strong>{deleteFAQ?.question}</strong>?
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
                disabled={deleteFAQMutation.isPending}
              >
                {deleteFAQMutation.isPending ? 'Menghapus...' : 'Hapus'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default KelolaFAQ;
