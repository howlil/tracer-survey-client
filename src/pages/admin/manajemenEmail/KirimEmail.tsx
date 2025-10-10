/** @format */

import React, {useState, useEffect} from 'react';
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
import type {EmailTemplate} from '@/types/emailTemplate';
import {replaceEmailVariables} from '@/types/emailTemplate';

// Types untuk BlastEmail
interface BlastEmail {
  id: string;
  surveyId: string;
  emailTemplateId: string;
  emailTemplate: EmailTemplate;
  emailType: 'WELCOME' | 'REMINDER' | 'NOTIFICATION' | 'CUSTOM';
  title: string;
  dateToSend: string;
  status: 'SCHEDULED' | 'SENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  recipientCount: number;
  sentCount: number;
  failedCount: number;
}

interface BlastEmailFormData {
  emailTemplateId: string;
  emailType: 'WELCOME' | 'REMINDER' | 'NOTIFICATION' | 'CUSTOM';
  title: string;
  dateToSend: string;
  recipientType: 'ALUMNI' | 'MANAGER' | 'ALL' | 'CUSTOM';
  customRecipients: string;
  message: string;
}

const KirimEmail: React.FC = () => {
  const navigate = useNavigate();

  // State management
  const [blastEmails, setBlastEmails] = useState<BlastEmail[]>([]);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<BlastEmailFormData | null>(
    null
  );
  const [deleteBlastEmail, setDeleteBlastEmail] = useState<BlastEmail | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState<BlastEmailFormData>({
    emailTemplateId: '',
    emailType: 'CUSTOM',
    title: '',
    dateToSend: '',
    recipientType: 'ALUMNI',
    customRecipients: '',
    message: '',
  });

  // Mock data - replace with API calls
  useEffect(() => {
    const mockTemplates: EmailTemplate[] = [
      {
        id: '1',
        code: 'WELCOME_EMAIL',
        templateName: 'Email Selamat Datang',
        subject: 'Selamat Datang di Sistem Tracer Study - {{user.name}}',
        bodyText:
          'Halo {{user.name}},\n\nSelamat datang di sistem Tracer Study Universitas Andalas.',
        bodyHtml:
          '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;"><h2>Halo {{user.name}},</h2><p>Selamat datang di sistem Tracer Study Universitas Andalas.</p></div>',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      },
      {
        id: '2',
        code: 'SURVEY_REMINDER',
        templateName: 'Pengingat Survey',
        subject:
          'Pengingat: Survey Tracer Study - Batas Waktu {{survey.deadline}}',
        bodyText:
          'Halo {{user.name}},\n\nIni adalah pengingat bahwa survey Tracer Study akan berakhir pada {{survey.deadline}}.',
        bodyHtml:
          '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;"><h2>⏰ Pengingat Survey</h2><p>Halo {{user.name}},</p><p>Ini adalah pengingat bahwa survey Tracer Study akan berakhir pada <strong>{{survey.deadline}}</strong>.</p></div>',
        createdAt: '2024-01-15T11:00:00Z',
        updatedAt: '2024-01-15T11:00:00Z',
      },
    ];
    setEmailTemplates(mockTemplates);

    const mockBlastEmails: BlastEmail[] = [
      {
        id: '1',
        surveyId: 'survey-1',
        emailTemplateId: '1',
        emailTemplate: mockTemplates[0],
        emailType: 'WELCOME',
        title: 'Email Selamat Datang untuk Alumni 2024',
        dateToSend: '2024-01-20',
        status: 'COMPLETED',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T15:30:00Z',
        recipientCount: 150,
        sentCount: 148,
        failedCount: 2,
      },
      {
        id: '2',
        surveyId: 'survey-1',
        emailTemplateId: '2',
        emailTemplate: mockTemplates[1],
        emailType: 'REMINDER',
        title: 'Pengingat Survey Tracer Study',
        dateToSend: '2024-01-25',
        status: 'SCHEDULED',
        createdAt: '2024-01-18T14:00:00Z',
        updatedAt: '2024-01-18T14:00:00Z',
        recipientCount: 200,
        sentCount: 0,
        failedCount: 0,
      },
    ];
    setBlastEmails(mockBlastEmails);
  }, []);

  // Form handlers
  const resetForm = () => {
    setFormData({
      emailTemplateId: '',
      emailType: 'CUSTOM',
      title: '',
      dateToSend: '',
      recipientType: 'ALUMNI',
      customRecipients: '',
      message: '',
    });
  };

  const handleInputChange = (
    field: keyof BlastEmailFormData,
    value: string
  ) => {
    setFormData((prev) => ({...prev, [field]: value}));
  };

  const handleSaveBlastEmail = async () => {
    setLoading(true);
    try {
      const selectedTemplate = emailTemplates.find(
        (t) => t.id === formData.emailTemplateId
      );
      if (!selectedTemplate) return;

      const newBlastEmail: BlastEmail = {
        id: Date.now().toString(),
        surveyId: 'survey-1', // Mock survey ID
        emailTemplateId: formData.emailTemplateId,
        emailTemplate: selectedTemplate,
        emailType: formData.emailType,
        title: formData.title,
        dateToSend: formData.dateToSend,
        status: 'SCHEDULED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        recipientCount:
          formData.recipientType === 'ALL'
            ? 500
            : formData.recipientType === 'ALUMNI'
            ? 300
            : 50,
        sentCount: 0,
        failedCount: 0,
      };

      setBlastEmails((prev) => [newBlastEmail, ...prev]);
      setIsSheetOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving blast email:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlastEmail = async () => {
    if (!deleteBlastEmail) return;

    setLoading(true);
    try {
      setBlastEmails((prev) =>
        prev.filter((b) => b.id !== deleteBlastEmail.id)
      );
      setDeleteBlastEmail(null);
    } catch (error) {
      console.error('Error deleting blast email:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewEmail = () => {
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
      case 'WELCOME':
        return 'bg-green-100 text-green-800';
      case 'REMINDER':
        return 'bg-yellow-100 text-yellow-800';
      case 'NOTIFICATION':
        return 'bg-blue-100 text-blue-800';
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
                            const previewData: BlastEmailFormData = {
                              emailTemplateId: blastEmail.emailTemplateId,
                              emailType: blastEmail.emailType,
                              title: blastEmail.title,
                              dateToSend: blastEmail.dateToSend,
                              recipientType: 'ALUMNI',
                              customRecipients: '',
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
                                emailTemplateId: blastEmail.emailTemplateId,
                                emailType: blastEmail.emailType,
                                title: blastEmail.title,
                                dateToSend: blastEmail.dateToSend,
                                recipientType: 'ALUMNI',
                                customRecipients: '',
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
                        <SelectItem value='WELCOME'>Selamat Datang</SelectItem>
                        <SelectItem value='REMINDER'>Pengingat</SelectItem>
                        <SelectItem value='NOTIFICATION'>Notifikasi</SelectItem>
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
                  <div className='space-y-2'>
                    <Label
                      htmlFor='customRecipients'
                      className='text-sm font-medium'
                    >
                      Email Custom (opsional)
                    </Label>
                    <Textarea
                      id='customRecipients'
                      value={formData.customRecipients}
                      onChange={(e) =>
                        handleInputChange('customRecipients', e.target.value)
                      }
                      placeholder='Masukkan email yang dipisahkan dengan koma: email1@example.com, email2@example.com'
                      rows={3}
                      className='text-sm'
                    />
                    <p className='text-xs text-gray-500'>
                      Masukkan email custom yang dipisahkan dengan koma
                    </p>
                  </div>
                )}
              </div>

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
                  disabled={loading}
                >
                  {loading ? 'Menyimpan...' : 'Jadwalkan Email'}
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

export default KirimEmail;
