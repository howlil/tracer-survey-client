/** @format */

import React, {useState} from 'react';
import {AdminLayout} from '@/components/layout/admin';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';

interface ErrorDetail {
  field: string;
  message: string;
  type: string;
}

interface ErrorResponse {
  response?: {
    data?: {
      message?: string | ErrorDetail[];
    };
  };
}
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {Settings, Edit, Trash2, FileText, Users, Plus} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import {
  useSurveys,
  useCreateSurvey,
  useDeleteSurvey,
  type Survey,
} from '@/api/survey.api';
import {toast} from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const SurveyManagement: React.FC = () => {
  const navigate = useNavigate();

  // State management
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: '',
    type: 'TRACER_STUDY' as 'TRACER_STUDY' | 'USER_SURVEY',
    description: '',
  });

  // API hooks
  const {data: surveysData, isLoading} = useSurveys({
    page: 1,
    limit: 100,
  });
  const createSurveyMutation = useCreateSurvey();
  const deleteSurveyMutation = useDeleteSurvey();

  const surveys = surveysData?.surveys || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'ARCHIVED':
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      case 'CLOSED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateSurvey = () => {
    setIsCreateSheetOpen(true);
  };

  const handleSaveNewSurvey = async () => {
    if (!createFormData.name || !createFormData.description) {
      toast.error('Nama dan deskripsi survey wajib diisi');
      return;
    }

    try {
      await createSurveyMutation.mutateAsync({
        name: createFormData.name,
        type: createFormData.type,
        description: createFormData.description,
      });

      toast.success('Survey berhasil dibuat');
      setIsCreateSheetOpen(false);
      setCreateFormData({
        name: '',
        type: 'TRACER_STUDY',
        description: '',
      });
    } catch (error) {
      const err = error as ErrorResponse;
      const errorMessage = err?.response?.data?.message;

      if (Array.isArray(errorMessage)) {
        errorMessage.forEach((errDetail) => {
          toast.error(`${errDetail.field}: ${errDetail.message}`);
        });
      } else if (typeof errorMessage === 'string') {
        toast.error(errorMessage);
      } else {
        toast.error('Gagal membuat survey');
      }
    }
  };

  const handleEditSurvey = (survey: Survey) => {
    // Determine type from targetRole if type is not available
    const surveyType =
      survey.type ||
      (survey.targetRole === 'MANAGER' ? 'USER_SURVEY' : 'TRACER_STUDY');
    navigate(
      `/admin/survey/builder?type=${surveyType}&mode=edit&id=${survey.id}`
    );
  };

  const handleDeleteSurvey = async (id: string) => {
    try {
      await deleteSurveyMutation.mutateAsync(id);
      toast.success('Survey berhasil dihapus');
    } catch (error) {
      const err = error as ErrorResponse;
      const errorMessage = err?.response?.data?.message;

      if (Array.isArray(errorMessage)) {
        errorMessage.forEach((errDetail) => {
          toast.error(`${errDetail.field}: ${errDetail.message}`);
        });
      } else if (typeof errorMessage === 'string') {
        toast.error(errorMessage);
      } else {
        toast.error('Gagal menghapus survey');
      }
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
                    <Settings className='h-4 w-4' />
                    <span>Dashboard</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Manajemen Survey</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Create Button */}
            <Button
              onClick={handleCreateSurvey}
              className='bg-primary hover:bg-primary/90'
            >
              <Plus className='mr-2 h-4 w-4' />
              Buat Survey Baru
            </Button>
          </div>
        </div>

        {/* Survey List Card */}
        <Card className='border-0 shadow-sm'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle className='flex items-center space-x-2'>
                <FileText className='h-5 w-5 text-primary' />
                <span>Daftar Survey</span>
              </CardTitle>
              <Badge
                variant='secondary'
                className='text-sm'
              >
                {surveys.length} survey
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='flex items-center justify-center py-12'>
                <div className='text-center'>
                  <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
                  <p className='text-muted-foreground'>Memuat data survey...</p>
                </div>
              </div>
            ) : surveys.length === 0 ? (
              <div className='text-center py-12'>
                <FileText className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                <h3 className='text-lg font-semibold mb-2'>Belum ada survey</h3>
                <p className='text-muted-foreground mb-4'>
                  Buat survey pertama Anda untuk mulai mengumpulkan data
                </p>
                <Button onClick={handleCreateSurvey}>
                  <Plus className='mr-2 h-4 w-4' />
                  Buat Survey Baru
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='font-semibold'>Survey</TableHead>
                    <TableHead className='font-semibold'>Target Role</TableHead>
                    <TableHead className='font-semibold'>Status</TableHead>
                    <TableHead className='font-semibold'>Rules</TableHead>
                    <TableHead className='font-semibold'>Soal</TableHead>
                    <TableHead className='font-semibold'>Respons</TableHead>
                    <TableHead className='text-right font-semibold'>
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {surveys.map((survey) => (
                    <TableRow key={survey.id}>
                      <TableCell className='font-medium'>
                        <div className='font-medium'>{survey.name}</div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            survey.targetRole === 'MANAGER'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }
                        >
                          {survey.targetRole === 'MANAGER'
                            ? 'Manager'
                            : survey.targetRole === 'ALUMNI'
                            ? 'Alumni'
                            : survey.targetRole || '-'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(survey.status)}>
                          {survey.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center space-x-2'>
                          <Settings className='h-4 w-4 text-muted-foreground' />
                          <span>{survey.surveyRulesCount || 0} rules</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center space-x-2'>
                          <FileText className='h-4 w-4 text-muted-foreground' />
                          <span>{survey.questionCount || 0} soal</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center space-x-2'>
                          <Users className='h-4 w-4 text-muted-foreground' />
                          <span>{survey.responseCount || 0} respons</span>
                        </div>
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex items-center justify-end space-x-2'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() =>
                              navigate(
                                `/admin/survey/settings?id=${survey.id}&type=${
                                  survey.type || 'TRACER_STUDY'
                                }&name=${encodeURIComponent(survey.name)}`
                              )
                            }
                          >
                            <Settings className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleEditSurvey(survey)}
                          >
                            <Edit className='h-4 w-4' />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant='outline'
                                size='sm'
                                disabled={deleteSurveyMutation.isPending}
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Hapus Survey?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin menghapus survey ini?
                                  Tindakan ini tidak dapat dibatalkan dan semua
                                  data terkait akan dihapus.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteSurvey(survey.id)}
                                  className='bg-red-600 hover:bg-red-700'
                                >
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Create Survey Sheet */}
        <Sheet
          open={isCreateSheetOpen}
          onOpenChange={setIsCreateSheetOpen}
        >
          <SheetContent className='w-[95vw] max-w-[800px] overflow-y-auto'>
            <SheetHeader>
              <SheetTitle>Buat Survey Baru</SheetTitle>
              <SheetDescription>
                Buat survey baru untuk Tracer Study atau User Survey
              </SheetDescription>
            </SheetHeader>

            <div className='mt-6 space-y-6'>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label
                    htmlFor='name'
                    className='text-sm font-medium'
                  >
                    Nama Survey *
                  </Label>
                  <Input
                    id='name'
                    value={createFormData.name}
                    onChange={(e) =>
                      setCreateFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder='Tracer Study Lulusan 2024'
                    className='text-sm'
                  />
                </div>

                <div className='space-y-2'>
                  <Label
                    htmlFor='type'
                    className='text-sm font-medium'
                  >
                    Jenis Survey *
                  </Label>
                  <Select
                    value={createFormData.type}
                    onValueChange={(value: 'TRACER_STUDY' | 'USER_SURVEY') =>
                      setCreateFormData((prev) => ({...prev, type: value}))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='TRACER_STUDY'>Tracer Study</SelectItem>
                      <SelectItem value='USER_SURVEY'>User Survey</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label
                    htmlFor='description'
                    className='text-sm font-medium'
                  >
                    Deskripsi *
                  </Label>
                  <Textarea
                    id='description'
                    value={createFormData.description}
                    onChange={(e) =>
                      setCreateFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder='Deskripsi singkat tentang survey ini'
                    className='text-sm min-h-[100px]'
                  />
                </div>
              </div>

              <div className='flex justify-end space-x-3 pt-4'>
                <Button
                  variant='outline'
                  onClick={() => setIsCreateSheetOpen(false)}
                  disabled={createSurveyMutation.isPending}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSaveNewSurvey}
                  disabled={createSurveyMutation.isPending}
                >
                  {createSurveyMutation.isPending ? 'Menyimpan...' : 'Simpan'}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </AdminLayout>
  );
};

export default SurveyManagement;
