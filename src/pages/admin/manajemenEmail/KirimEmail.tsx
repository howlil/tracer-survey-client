/** @format */

import React, {useState} from 'react';
import {AdminLayout} from '@/components/layout/admin';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {Badge} from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  Send,
  Mail,
  Plus,
  Eye,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  Edit,
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
import {replaceEmailVariables} from '@/types/emailTemplate';
import {
  useBlastEmails,
  useCreateBlastEmail,
  useDeleteBlastEmail,
  usePreviewRecipientCount,
  type BlastEmail,
  type BlastEmailFormData,
} from '@/api/email.api';
import {useEmailTemplates} from '@/api/email.api';
import {useFaculties, useMajors} from '@/api/major-faculty.api';

interface BlastEmailFormDataLocal {
  surveyId: string;
  emailTemplateId: string;
  emailType: 'INVITATION' | 'REMINDER' | 'CUSTOM';
  title: string;
  dateToSend: string;
  recipientType: 'ALUMNI' | 'MANAGER' | 'ALL' | 'CUSTOM';
  customRecipients: string;
  customFilters: {
    facultyId: string;
    majorId: string;
    graduatedYear: string;
  };
  message: string;
}

const KirimEmail: React.FC = () => {
  const navigate = useNavigate();

  // API hooks
  const [page] = useState(1);
  const [searchQuery] = useState('');
  const [statusFilter] = useState<string>('');
  const [emailTypeFilter] = useState<string>('');

  const {data: blastEmailsData, isLoading: isLoadingBlastEmails} =
    useBlastEmails({
      page,
      limit: 10,
      search: searchQuery || undefined,
      status: statusFilter || undefined,
      emailType: emailTypeFilter || undefined,
    });
  const {data: templatesData} = useEmailTemplates({limit: 100});
  const createBlastEmailMutation = useCreateBlastEmail();
  const deleteBlastEmailMutation = useDeleteBlastEmail();
  const previewCountMutation = usePreviewRecipientCount();

  // State management
  const blastEmails = blastEmailsData?.blastEmails || [];
  const emailTemplates = templatesData?.templates || [];
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] =
    useState<BlastEmailFormDataLocal | null>(null);
  const [deleteBlastEmail, setDeleteBlastEmail] = useState<BlastEmail | null>(
    null
  );
  const [recipientCount, setRecipientCount] = useState<number | null>(null);

  // Form data
  const [formData, setFormData] = useState<BlastEmailFormDataLocal>({
    surveyId: '',
    emailTemplateId: '',
    emailType: 'CUSTOM',
    title: '',
    dateToSend: '',
    recipientType: 'ALUMNI',
    customRecipients: '',
    customFilters: {
      facultyId: '',
      majorId: '',
      graduatedYear: '',
    },
    message: '',
  });

  // API hooks for faculties and majors
  const {data: facultiesData = [], isLoading: isLoadingFaculties} =
    useFaculties();
  const {data: majorsData = [], isLoading: isLoadingMajors} = useMajors(
    formData.customFilters.facultyId &&
      formData.customFilters.facultyId !== 'all'
      ? formData.customFilters.facultyId
      : undefined
  );

  const faculties = facultiesData;
  const majors = majorsData;

  // Majors are already filtered by API based on selected faculty
  const filteredMajors = majors;

  // Get available graduation years
  const graduationYears = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= 2000; i--) {
      years.push(i.toString());
    }
    return years;
  }, []);

  // Form handlers
  const resetForm = () => {
    setFormData({
      surveyId: '',
      emailTemplateId: '',
      emailType: 'CUSTOM',
      title: '',
      dateToSend: '',
      recipientType: 'ALUMNI',
      customRecipients: '',
      customFilters: {
        facultyId: '',
        majorId: '',
        graduatedYear: '',
      },
      message: '',
    });
    setRecipientCount(null);
  };

  const handleInputChange = (
    field: keyof BlastEmailFormDataLocal,
    value: string
  ) => {
    setFormData((prev) => ({...prev, [field]: value}));
    if (field === 'recipientType' || field === 'customFilters') {
      setRecipientCount(null);
    }
  };

  const handleFilterChange = (
    field: keyof BlastEmailFormDataLocal['customFilters'],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      customFilters: {
        ...prev.customFilters,
        [field]: value,
        // Reset major when faculty changes
        ...(field === 'facultyId' ? {majorId: ''} : {}),
      },
    }));
    setRecipientCount(null);
  };

  const handlePreviewCount = async () => {
    try {
      const recipientFilters: {
        facultyId?: string;
        majorId?: string;
        graduatedYear?: number;
        customRecipients?: string[];
      } = {};
      if (
        formData.customFilters.facultyId &&
        formData.customFilters.facultyId !== 'all'
      ) {
        recipientFilters.facultyId = formData.customFilters.facultyId;
      }
      if (
        formData.customFilters.majorId &&
        formData.customFilters.majorId !== 'all'
      ) {
        recipientFilters.majorId = formData.customFilters.majorId;
      }
      if (
        formData.customFilters.graduatedYear &&
        formData.customFilters.graduatedYear !== 'all'
      ) {
        recipientFilters.graduatedYear = parseInt(
          formData.customFilters.graduatedYear
        );
      }
      if (formData.customRecipients) {
        recipientFilters.customRecipients = formData.customRecipients
          .split(',')
          .map((email) => email.trim())
          .filter((email) => email);
      }

      const result = await previewCountMutation.mutateAsync({
        recipientType: formData.recipientType,
        recipientFilters:
          Object.keys(recipientFilters).length > 0
            ? recipientFilters
            : undefined,
      });

      setRecipientCount(result.count);
    } catch (err) {
      const error = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };
      toast.error(
        error.response?.data?.message || 'Gagal mendapatkan jumlah penerima'
      );
    }
  };

  const handleSaveBlastEmail = async () => {
    if (!formData.surveyId) {
      toast.error('Survey wajib dipilih');
      return;
    }
    if (!formData.emailTemplateId) {
      toast.error('Template email wajib dipilih');
      return;
    }

    try {
      const recipientFilters: {
        facultyId?: string;
        majorId?: string;
        graduatedYear?: number;
        customRecipients?: string[];
      } = {};
      if (
        formData.customFilters.facultyId &&
        formData.customFilters.facultyId !== 'all'
      ) {
        recipientFilters.facultyId = formData.customFilters.facultyId;
      }
      if (
        formData.customFilters.majorId &&
        formData.customFilters.majorId !== 'all'
      ) {
        recipientFilters.majorId = formData.customFilters.majorId;
      }
      if (
        formData.customFilters.graduatedYear &&
        formData.customFilters.graduatedYear !== 'all'
      ) {
        recipientFilters.graduatedYear = parseInt(
          formData.customFilters.graduatedYear
        );
      }
      if (formData.customRecipients) {
        recipientFilters.customRecipients = formData.customRecipients
          .split(',')
          .map((email) => email.trim())
          .filter((email) => email);
      }

      const blastEmailData: BlastEmailFormData = {
        surveyId: formData.surveyId,
        emailTemplateId: formData.emailTemplateId,
        emailType: formData.emailType,
        title: formData.title,
        dateToSend: formData.dateToSend,
        recipientType: formData.recipientType,
        recipientFilters:
          Object.keys(recipientFilters).length > 0
            ? recipientFilters
            : undefined,
        message: formData.message || undefined,
      };

      await createBlastEmailMutation.mutateAsync(blastEmailData);
      toast.success('Blast email berhasil dibuat');
      setIsSheetOpen(false);
      resetForm();
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
          const firstError = errorMessage[0];
          toast.error(firstError.message || 'Gagal membuat blast email');
        } else if (typeof errorMessage === 'string') {
          toast.error(errorMessage);
        }
      } else {
        toast.error('Gagal membuat blast email');
      }
    }
  };

  const handleDeleteBlastEmail = async () => {
    if (!deleteBlastEmail) return;

    try {
      await deleteBlastEmailMutation.mutateAsync(deleteBlastEmail.id);
      toast.success('Blast email berhasil dihapus');
      setDeleteBlastEmail(null);
    } catch (err) {
      const error = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };
      toast.error(
        error.response?.data?.message || 'Gagal menghapus blast email'
      );
    }
  };

  const handlePreviewEmail = () => {
    if (!formData.surveyId) {
      toast.error('Survey wajib dipilih untuk preview');
      return;
    }
    setPreviewData(formData);
    setIsPreviewOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return <Clock className='h-4 w-4 text-blue-500' />;
      case 'SENDING':
        return <Send className='h-4 w-4 text-yellow-500' />;
      case 'COMPLETED':
        return <CheckCircle className='h-4 w-4 text-green-500' />;
      case 'FAILED':
        return <XCircle className='h-4 w-4 text-red-500' />;
      case 'CANCELLED':
        return <AlertCircle className='h-4 w-4 text-gray-500' />;
      default:
        return <Clock className='h-4 w-4 text-gray-500' />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'SENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEmailTypeColor = (type: string) => {
    switch (type) {
      case 'INVITATION':
        return 'bg-green-100 text-green-800';
      case 'REMINDER':
        return 'bg-yellow-100 text-yellow-800';
      case 'CUSTOM':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
            <Button onClick={() => setIsSheetOpen(true)}>
              <Plus className='mr-2 h-4 w-4' />
              Kirim Email Baru
            </Button>
          </div>
        </div>

        {/* Blast Emails Table */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2'>
              <Send className='h-5 w-5' />
              <span>Daftar Email Blast</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingBlastEmails ? (
              <div className='text-center py-8'>
                <p className='text-muted-foreground'>Memuat data...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Judul Email</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Jadwal Kirim</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Penerima</TableHead>
                    <TableHead className='text-right'>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blastEmails.map((blastEmail) => (
                    <TableRow key={blastEmail.id}>
                      <TableCell className='font-medium'>
                        {blastEmail.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline'>
                          {blastEmail.emailTemplate.templateName}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getEmailTypeColor(blastEmail.emailType)}
                        >
                          {blastEmail.emailType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center space-x-2'>
                          <Calendar className='h-4 w-4 text-muted-foreground' />
                          <span>
                            {new Date(blastEmail.dateToSend).toLocaleDateString(
                              'id-ID'
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center space-x-2'>
                          {getStatusIcon(blastEmail.status)}
                          <Badge className={getStatusColor(blastEmail.status)}>
                            {blastEmail.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='text-sm'>
                          <div className='flex items-center space-x-1'>
                            <Users className='h-4 w-4 text-muted-foreground' />
                            <span>{blastEmail.recipientCount} penerima</span>
                          </div>
                          {blastEmail.status === 'COMPLETED' && (
                            <div className='text-xs text-muted-foreground mt-1'>
                              {blastEmail.sentCount} terkirim,{' '}
                              {blastEmail.failedCount} gagal
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex items-center justify-end space-x-2'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => {
                              // Preview functionality
                              const previewData: BlastEmailFormDataLocal = {
                                surveyId: blastEmail.surveyId,
                                emailTemplateId: blastEmail.emailTemplateId,
                                emailType: blastEmail.emailType,
                                title: blastEmail.title,
                                dateToSend: blastEmail.dateToSend,
                                recipientType:
                                  blastEmail.recipientType || 'ALUMNI',
                                customRecipients: '',
                                customFilters: {
                                  facultyId: '',
                                  majorId: '',
                                  graduatedYear: '',
                                },
                                message: '',
                              };
                              setPreviewData(previewData);
                              setIsPreviewOpen(true);
                            }}
                          >
                            <Eye className='h-4 w-4' />
                          </Button>
                          {blastEmail.status === 'SCHEDULED' && (
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => {
                                // Edit functionality
                                setFormData({
                                  surveyId: blastEmail.surveyId,
                                  emailTemplateId: blastEmail.emailTemplateId,
                                  emailType: blastEmail.emailType,
                                  title: blastEmail.title,
                                  dateToSend: blastEmail.dateToSend,
                                  recipientType:
                                    blastEmail.recipientType || 'ALUMNI',
                                  customRecipients: '',
                                  customFilters: {
                                    facultyId: '',
                                    majorId: '',
                                    graduatedYear: '',
                                  },
                                  message: '',
                                });
                                setIsSheetOpen(true);
                              }}
                            >
                              <Edit className='h-4 w-4' />
                            </Button>
                          )}
                          {blastEmail.status === 'SCHEDULED' && (
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => setDeleteBlastEmail(blastEmail)}
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Blast Email Sheet */}
        <Sheet
          open={isSheetOpen}
          onOpenChange={setIsSheetOpen}
        >
          <SheetContent className='w-[95vw] max-w-[1200px] overflow-y-auto'>
            <SheetHeader>
              <SheetTitle>Kirim Email Blast</SheetTitle>
              <SheetDescription>
                Buat dan jadwalkan pengiriman email blast ke alumni atau manager
              </SheetDescription>
            </SheetHeader>

            <div className='px-4 space-y-8 '>
              {/* Basic Info Section */}

              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label
                    htmlFor='title'
                    className='text-sm font-medium'
                  >
                    Judul Email Blast *
                  </Label>
                  <Input
                    id='title'
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder='Email Selamat Datang untuk Alumni 2024'
                    className='text-sm'
                  />
                  <p className='text-xs text-gray-500'>
                    Judul untuk mengidentifikasi email blast ini
                  </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='emailType'
                      className='text-sm font-medium'
                    >
                      Tipe Email *
                    </Label>
                    <Select
                      value={formData.emailType}
                      onValueChange={(value) =>
                        handleInputChange('emailType', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Pilih tipe email' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='INVITATION'>Undangan</SelectItem>
                        <SelectItem value='REMINDER'>Pengingat</SelectItem>
                        <SelectItem value='CUSTOM'>Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-2'>
                    <Label
                      htmlFor='dateToSend'
                      className='text-sm font-medium'
                    >
                      Jadwal Kirim *
                    </Label>
                    <Input
                      id='dateToSend'
                      type='date'
                      value={formData.dateToSend}
                      onChange={(e) =>
                        handleInputChange('dateToSend', e.target.value)
                      }
                      className='text-sm'
                    />
                  </div>
                </div>
              </div>

              {/* Template Selection Section */}

              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label
                    htmlFor='emailTemplateId'
                    className='text-sm font-medium'
                  >
                    Pilih Template *
                  </Label>
                  <Select
                    value={formData.emailTemplateId}
                    onValueChange={(value) =>
                      handleInputChange('emailTemplateId', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Pilih template email' />
                    </SelectTrigger>
                    <SelectContent>
                      {emailTemplates.map((template) => (
                        <SelectItem
                          key={template.id}
                          value={template.id}
                        >
                          <div className='flex flex-col'>
                            <span className='font-medium'>
                              {template.templateName}
                            </span>
                            <span className='text-xs text-muted-foreground'>
                              {template.code}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className='text-xs text-gray-500'>
                    Template yang akan digunakan untuk email blast
                  </p>
                </div>
              </div>

              {/* Recipient Selection Section */}

              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label
                    htmlFor='recipientType'
                    className='text-sm font-medium'
                  >
                    Tipe Penerima *
                  </Label>
                  <Select
                    value={formData.recipientType}
                    onValueChange={(value) =>
                      handleInputChange('recipientType', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Pilih tipe penerima' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='ALUMNI'>Alumni</SelectItem>
                      <SelectItem value='MANAGER'>Manager</SelectItem>
                      <SelectItem value='ALL'>Semua</SelectItem>
                      <SelectItem value='CUSTOM'>Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.recipientType === 'CUSTOM' && (
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Label className='text-sm font-medium'>
                        Filter Penerima Berdasarkan
                      </Label>
                      <p className='text-xs text-gray-500'>
                        Pilih filter untuk menentukan penerima email berdasarkan
                        fakultas, jurusan, atau tahun lulus
                      </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      {/* Fakultas Filter */}
                      <div className='space-y-2'>
                        <Label
                          htmlFor='facultyFilter'
                          className='text-sm font-medium'
                        >
                          Fakultas
                        </Label>
                        <Select
                          value={formData.customFilters.facultyId || 'all'}
                          onValueChange={(value) =>
                            handleFilterChange('facultyId', value)
                          }
                        >
                          <SelectTrigger id='facultyFilter'>
                            <SelectValue placeholder='Pilih Fakultas' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='all'>Semua Fakultas</SelectItem>
                            {isLoadingFaculties ? (
                              <SelectItem
                                value='loading'
                                disabled
                              >
                                Memuat fakultas...
                              </SelectItem>
                            ) : (
                              faculties.map((faculty) => (
                                <SelectItem
                                  key={faculty.id}
                                  value={faculty.id}
                                >
                                  {faculty.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Jurusan Filter */}
                      <div className='space-y-2'>
                        <Label
                          htmlFor='majorFilter'
                          className='text-sm font-medium'
                        >
                          Jurusan
                        </Label>
                        <Select
                          value={formData.customFilters.majorId || 'all'}
                          onValueChange={(value) =>
                            handleFilterChange('majorId', value)
                          }
                          disabled={
                            !formData.customFilters.facultyId ||
                            formData.customFilters.facultyId === 'all'
                          }
                        >
                          <SelectTrigger id='majorFilter'>
                            <SelectValue placeholder='Pilih Jurusan' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='all'>Semua Jurusan</SelectItem>
                            {isLoadingMajors ? (
                              <SelectItem
                                value='loading'
                                disabled
                              >
                                Memuat jurusan...
                              </SelectItem>
                            ) : (
                              filteredMajors.map((major) => (
                                <SelectItem
                                  key={major.id}
                                  value={major.id}
                                >
                                  {major.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        {(!formData.customFilters.facultyId ||
                          formData.customFilters.facultyId === 'all') && (
                          <p className='text-xs text-gray-500'>
                            Pilih fakultas terlebih dahulu
                          </p>
                        )}
                      </div>

                      {/* Tahun Lulus Filter */}
                      <div className='space-y-2'>
                        <Label
                          htmlFor='graduatedYearFilter'
                          className='text-sm font-medium'
                        >
                          Tahun Lulus
                        </Label>
                        <Select
                          value={formData.customFilters.graduatedYear || 'all'}
                          onValueChange={(value) =>
                            handleFilterChange('graduatedYear', value)
                          }
                        >
                          <SelectTrigger id='graduatedYearFilter'>
                            <SelectValue placeholder='Pilih Tahun Lulus' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='all'>Semua Tahun</SelectItem>
                            {graduationYears.map((year) => (
                              <SelectItem
                                key={year}
                                value={year}
                              >
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Email Custom Manual (opsional) */}
                    <div className='space-y-2'>
                      <Label
                        htmlFor='customRecipients'
                        className='text-sm font-medium'
                      >
                        Email Custom Manual (opsional)
                      </Label>
                      <Textarea
                        id='customRecipients'
                        value={formData.customRecipients}
                        onChange={(e) =>
                          handleInputChange('customRecipients', e.target.value)
                        }
                        placeholder='Masukkan email tambahan yang dipisahkan dengan koma: email1@example.com, email2@example.com'
                        rows={2}
                        className='text-sm'
                      />
                      <p className='text-xs text-gray-500'>
                        Email tambahan yang akan ditambahkan ke daftar penerima
                        hasil filter
                      </p>
                    </div>

                    {/* Preview Count Button */}
                    <div className='space-y-2'>
                      <Button
                        type='button'
                        variant='outline'
                        onClick={handlePreviewCount}
                        disabled={previewCountMutation.isPending}
                      >
                        {previewCountMutation.isPending
                          ? 'Menghitung...'
                          : 'Preview Jumlah Penerima'}
                      </Button>
                      {recipientCount !== null && (
                        <p className='text-sm font-medium text-green-600'>
                          Jumlah penerima: {recipientCount} orang
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Additional Message Section */}

                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='message'
                      className='text-sm font-medium'
                    >
                      Pesan
                    </Label>
                    <Textarea
                      id='message'
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange('message', e.target.value)
                      }
                      placeholder='Pesan tambahan yang akan ditambahkan ke template...'
                      rows={4}
                      className='text-sm'
                    />
                    <p className='text-xs text-gray-500'>
                      Pesan tambahan yang akan ditambahkan ke template email
                    </p>
                  </div>
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
                  variant='outline'
                  onClick={handlePreviewEmail}
                >
                  <Eye className='mr-2 h-4 w-4' />
                  Preview
                </Button>
                <Button
                  onClick={handleSaveBlastEmail}
                  disabled={createBlastEmailMutation.isPending}
                >
                  {createBlastEmailMutation.isPending
                    ? 'Menyimpan...'
                    : 'Jadwalkan Email'}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Preview Email Dialog */}
        <Dialog
          open={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
        >
          <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>Preview Email Blast</DialogTitle>
              <DialogDescription>
                Preview email yang akan dikirim dengan sample data
              </DialogDescription>
            </DialogHeader>

            {previewData && (
              <div className='space-y-6 mt-4'>
                {/* Email Info */}
                <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
                  <h4 className='font-semibold text-blue-800 mb-2'>
                    Informasi Email Blast
                  </h4>
                  <div className='grid grid-cols-2 gap-4 text-sm'>
                    <div>
                      <span className='font-medium text-blue-700'>Judul:</span>
                      <span className='ml-2 text-blue-600'>
                        {previewData.title}
                      </span>
                    </div>
                    <div>
                      <span className='font-medium text-blue-700'>Tipe:</span>
                      <span className='ml-2 text-blue-600'>
                        {previewData.emailType}
                      </span>
                    </div>
                    <div>
                      <span className='font-medium text-blue-700'>
                        Jadwal Kirim:
                      </span>
                      <span className='ml-2 text-blue-600'>
                        {new Date(previewData.dateToSend).toLocaleDateString(
                          'id-ID'
                        )}
                      </span>
                    </div>
                    <div>
                      <span className='font-medium text-blue-700'>
                        Penerima:
                      </span>
                      <span className='ml-2 text-blue-600'>
                        {previewData.recipientType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Email Preview */}
                {(() => {
                  const selectedTemplate = emailTemplates.find(
                    (t) => t.id === previewData.emailTemplateId
                  );
                  if (!selectedTemplate) return null;

                  const sampleData = {
                    'user.name': 'John Doe',
                    'user.email': 'john.doe@example.com',
                    'survey.link': 'https://survey.example.com/tracer-study',
                    'survey.deadline': '31 Desember 2024',
                    'admin.name': 'Admin Sistem',
                    'system.url': 'https://tracer-study.example.com',
                    'current.date': '15 Januari 2024',
                    'current.year': '2024',
                  };

                  return (
                    <div className='space-y-4'>
                      {/* Email Header */}
                      <div className='bg-gray-50 p-4 rounded-lg border'>
                        <div className='flex items-center justify-between mb-2'>
                          <span className='text-sm font-medium text-gray-600'>
                            From:
                          </span>
                          <span className='text-sm'>
                            Sistem Tracer Study &lt;noreply@unand.ac.id&gt;
                          </span>
                        </div>
                        <div className='flex items-center justify-between mb-2'>
                          <span className='text-sm font-medium text-gray-600'>
                            To:
                          </span>
                          <span className='text-sm'>
                            [Penerima {previewData.recipientType}]
                          </span>
                        </div>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm font-medium text-gray-600'>
                            Subject:
                          </span>
                          <span className='text-sm font-semibold'>
                            {replaceEmailVariables(
                              selectedTemplate.subject,
                              sampleData
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Email Body */}
                      <div className='bg-white border rounded-lg shadow-sm'>
                        <div
                          className='p-6'
                          dangerouslySetInnerHTML={{
                            __html: replaceEmailVariables(
                              selectedTemplate.bodyHtml,
                              sampleData
                            ),
                          }}
                        />
                        {previewData.message && (
                          <div className='p-6 border-t bg-gray-50'>
                            <h4 className='font-semibold mb-2'>
                              Pesan Tambahan:
                            </h4>
                            <p className='text-sm text-gray-700'>
                              {previewData.message}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!deleteBlastEmail}
          onOpenChange={() => setDeleteBlastEmail(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Email Blast</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div>
                  Apakah Anda yakin ingin menghapus email blast{' '}
                  <strong>{deleteBlastEmail?.title}</strong>?
                  <br />
                  <br />
                  Tindakan ini tidak dapat dibatalkan dan akan menghapus jadwal
                  pengiriman email secara permanen.
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteBlastEmail}
                disabled={deleteBlastEmailMutation.isPending}
              >
                {deleteBlastEmailMutation.isPending ? 'Menghapus...' : 'Hapus'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default KirimEmail;
