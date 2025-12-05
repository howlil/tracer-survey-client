/** @format */

import React, {useState, useEffect} from 'react';
import {AdminLayout} from '@/components/layout/admin';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {Badge} from '@/components/ui/badge';
import {toast} from 'sonner';
import {
  useSurvey,
  useUpdateSurvey,
  useSurveyRules,
  useCreateSurveyRule,
  useDeleteSurveyRule,
  type SurveyRule,
} from '@/api/survey.api';
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
  Settings,
  Plus,
  Edit,
  Trash2,
  FileText,
  Users,
  Calendar,
  Save,
  ArrowLeft,
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {showSequentialErrorToasts} from '@/lib/error-toast';

interface ErrorDetail {
  field: string;
  message: string;
  type: string;
}

interface ErrorResponse {
  response?: {
    data?: {
      message?: string | ErrorDetail[];
      error?: string | unknown;
    };
  };
}

// Types untuk Survey Settings
interface SurveySettings {
  id: string;
  surveyId: string;
  surveyName: string;
  surveyType: 'TRACER_STUDY' | 'USER_SURVEY';
  greetingOpening: GreetingOpening;
  greetingClosing: GreetingClosing;
  surveyRules: SurveyRule[];
  createdAt: string;
  updatedAt: string;
}

interface GreetingOpening {
  title: string;
  greeting: {
    islamic: string;
    general: string;
  };
  addressee: string;
  introduction: string;
  ikuList: {
    title: string;
    items: string[];
  };
  purpose: string;
  expectation: string;
  signOff: {
    department: string;
    university: string;
  };
}

interface GreetingClosing {
  title: string;
  greeting: {
    islamic: string;
    general: string;
  };
  addressee: string;
  introduction: string;
  expectation: string;
  signOff: {
    department: string;
    university: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
}

interface SurveySettingsFormData {
  description: string;
  documentUrl: string;
  title: string;
  greetingIslamic: string;
  greetingGeneral: string;
  addressee: string;
  introduction: string;
  ikuTitle: string;
  ikuItems: string[];
  purpose: string;
  expectation: string;
  department: string;
  university: string;
  // Closing form data
  closingTitle: string;
  closingGreetingIslamic: string;
  closingGreetingGeneral: string;
  closingAddressee: string;
  closingIntroduction: string;
  closingExpectation: string;
  closingDepartment: string;
  closingUniversity: string;
  contactPhone: string;
  contactEmail: string;
  contactWebsite: string;
}

// Helper function untuk format tanggal DD/MM/YYYY
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '-';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return '-';
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
};

const SurveySettings: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get survey info from URL params
  const surveyId = searchParams.get('id');
  const surveyType = searchParams.get('type') as
    | 'TRACER_STUDY'
    | 'USER_SURVEY'
    | null;
  const surveyName = searchParams.get('name') || 'Survey';

  // State management
  const [surveySettings, setSurveySettings] = useState<SurveySettings | null>(
    null
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isRulesSheetOpen, setIsRulesSheetOpen] = useState(false);
  const [deleteRule, setDeleteRule] = useState<SurveyRule | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'info' | 'opening' | 'closing' | 'rules'
  >('info');

  // Form data
  const [formData, setFormData] = useState<SurveySettingsFormData>({
    description: '',
    documentUrl: '',
    title: '',
    greetingIslamic: '',
    greetingGeneral: '',
    addressee: '',
    introduction: '',
    ikuTitle: '',
    ikuItems: [''],
    purpose: '',
    expectation: '',
    department: '',
    university: '',
    // Closing form data
    closingTitle: '',
    closingGreetingIslamic: '',
    closingGreetingGeneral: '',
    closingAddressee: '',
    closingIntroduction: '',
    closingExpectation: '',
    closingDepartment: '',
    closingUniversity: '',
    contactPhone: '',
    contactEmail: '',
    contactWebsite: '',
  });

  // Survey Rules form data
  const [rulesFormData, setRulesFormData] = useState({
    degree: 'S1' as 'S1' | 'PASCA' | 'PROFESI' | 'VOKASI',
  });

  // API Hooks
  const {data: surveyData} = useSurvey(surveyId || '');
  const {data: rulesData, isLoading: isLoadingRules} = useSurveyRules(
    surveyId || ''
  );
  const updateSurveyMutation = useUpdateSurvey();
  const createRuleMutation = useCreateSurveyRule();
  const deleteRuleMutation = useDeleteSurveyRule();

  useEffect(() => {
    if (!surveyData) return;

    // Normalize greetingOpening structure
    const rawGreetingOpening: Partial<GreetingOpening> =
      (surveyData.greetingOpening ||
        surveyData.greatingOpening ||
        {}) as Partial<GreetingOpening>;
    const defaultGreetingOpening: GreetingOpening = {
      title: '',
      greeting: {islamic: '', general: ''},
      addressee: '',
      introduction: '',
      ikuList: {title: '', items: []},
      purpose: '',
      expectation: '',
      signOff: {department: '', university: ''},
    };

    // Ensure greeting property exists
    const normalizedGreetingOpening: GreetingOpening = {
      ...defaultGreetingOpening,
      ...rawGreetingOpening,
      greeting: rawGreetingOpening.greeting || defaultGreetingOpening.greeting,
      ikuList: rawGreetingOpening.ikuList || defaultGreetingOpening.ikuList,
      signOff: rawGreetingOpening.signOff || defaultGreetingOpening.signOff,
    };

    // Normalize greetingClosing structure
    const rawGreetingClosing: Partial<GreetingClosing> =
      (surveyData.greetingClosing || {}) as Partial<GreetingClosing>;
    const defaultGreetingClosing: GreetingClosing = {
      title: '',
      greeting: {islamic: '', general: ''},
      addressee: '',
      introduction: '',
      expectation: '',
      signOff: {department: '', university: ''},
      contact: {phone: '', email: '', website: ''},
    };

    // Ensure greeting property exists
    const normalizedGreetingClosing: GreetingClosing = {
      ...defaultGreetingClosing,
      ...rawGreetingClosing,
      greeting: rawGreetingClosing.greeting || defaultGreetingClosing.greeting,
      signOff: rawGreetingClosing.signOff || defaultGreetingClosing.signOff,
      contact: rawGreetingClosing.contact || defaultGreetingClosing.contact,
    };

    const settingsData: SurveySettings = {
      id: surveyData.id,
      surveyId: surveyData.id,
      surveyName: surveyData.name,
      surveyType: surveyData.type || 'TRACER_STUDY',
      greetingOpening: normalizedGreetingOpening,
      greetingClosing: normalizedGreetingClosing,
      surveyRules: rulesData || surveyData.surveyRules || [],
      createdAt: surveyData.createdAt || new Date().toISOString(),
      updatedAt: surveyData.updatedAt || new Date().toISOString(),
    };

    setSurveySettings(settingsData);

    // Populate form data with safe access
    setFormData({
      description: surveyData.description || '',
      documentUrl: surveyData.documentUrl || '',
      title: normalizedGreetingOpening.title || '',
      greetingIslamic: normalizedGreetingOpening.greeting?.islamic || '',
      greetingGeneral: normalizedGreetingOpening.greeting?.general || '',
      addressee: normalizedGreetingOpening.addressee || '',
      introduction: normalizedGreetingOpening.introduction || '',
      ikuTitle: normalizedGreetingOpening.ikuList?.title || '',
      ikuItems:
        normalizedGreetingOpening.ikuList?.items &&
        normalizedGreetingOpening.ikuList.items.length > 0
          ? normalizedGreetingOpening.ikuList.items
          : [''],
      purpose: normalizedGreetingOpening.purpose || '',
      expectation: normalizedGreetingOpening.expectation || '',
      department: normalizedGreetingOpening.signOff?.department || '',
      university: normalizedGreetingOpening.signOff?.university || '',
      closingTitle: normalizedGreetingClosing.title || '',
      closingGreetingIslamic: normalizedGreetingClosing.greeting?.islamic || '',
      closingGreetingGeneral: normalizedGreetingClosing.greeting?.general || '',
      closingAddressee: normalizedGreetingClosing.addressee || '',
      closingIntroduction: normalizedGreetingClosing.introduction || '',
      closingExpectation: normalizedGreetingClosing.expectation || '',
      closingDepartment: normalizedGreetingClosing.signOff?.department || '',
      closingUniversity: normalizedGreetingClosing.signOff?.university || '',
      contactPhone: normalizedGreetingClosing.contact?.phone || '',
      contactEmail: normalizedGreetingClosing.contact?.email || '',
      contactWebsite: normalizedGreetingClosing.contact?.website || '',
    });
  }, [surveyData, rulesData]);

  // Form handlers
  const handleInputChange = (
    field: keyof SurveySettingsFormData,
    value: string | string[]
  ) => {
    setFormData((prev) => ({...prev, [field]: value}));
  };

  const handleIkuItemChange = (index: number, value: string) => {
    const newItems = [...formData.ikuItems];
    newItems[index] = value;
    setFormData((prev) => ({...prev, ikuItems: newItems}));
  };

  const addIkuItem = () => {
    setFormData((prev) => ({...prev, ikuItems: [...prev.ikuItems, '']}));
  };

  const removeIkuItem = (index: number) => {
    const newItems = formData.ikuItems.filter((_, i) => i !== index);
    setFormData((prev) => ({...prev, ikuItems: newItems}));
  };

  const handleSaveSettings = async () => {
    if (!surveySettings || !surveyId) return;

    setLoading(true);
    try {
      await updateSurveyMutation.mutateAsync({
        id: surveyId,
        data: {
          description: formData.description,
          documentUrl: formData.documentUrl || undefined,
          greetingOpening: {
            title: formData.title,
            greeting: {
              islamic: formData.greetingIslamic,
              general: formData.greetingGeneral,
            },
            addressee: formData.addressee,
            introduction: formData.introduction,
            ikuList: {
              title: formData.ikuTitle,
              items: formData.ikuItems.filter((item) => item.trim() !== ''),
            },
            purpose: formData.purpose,
            expectation: formData.expectation,
            signOff: {
              department: formData.department,
              university: formData.university,
            },
          },
          greetingClosing: {
            title: formData.closingTitle || 'Terima Kasih',
            greeting: {
              islamic: formData.closingGreetingIslamic,
              general: formData.closingGreetingGeneral,
            },
            addressee: formData.closingAddressee,
            introduction: formData.closingIntroduction,
            expectation: formData.closingExpectation,
            signOff: {
              department: formData.closingDepartment || formData.department,
              university: formData.closingUniversity || formData.university,
            },
            contact: {
              phone: formData.contactPhone,
              email: formData.contactEmail,
              website: formData.contactWebsite,
            },
          },
        },
      });

      toast.success('Settings berhasil disimpan');
      setIsSheetOpen(false);
    } catch (error: unknown) {
      try {
        const err = error as ErrorResponse;
        const errorData = err?.response?.data;

        // Handle different error response structures
        let errorMessages: string[] = [];

        if (errorData?.message) {
          const errorMessage = errorData.message;

          if (Array.isArray(errorMessage)) {
            errorMessages = errorMessage.map((errDetail) => {
              if (
                typeof errDetail === 'object' &&
                errDetail !== null &&
                !Array.isArray(errDetail)
              ) {
                const detail = errDetail as ErrorDetail;
                return `${detail.field || 'Error'}: ${
                  detail.message || 'Unknown error'
                }`;
              }
              return String(errDetail);
            });
          } else if (typeof errorMessage === 'string') {
            errorMessages = [errorMessage];
          }
        }

        if (errorData?.error) {
          errorMessages.push(String(errorData.error));
        }

        // Display errors
        if (errorMessages.length > 0) {
          showSequentialErrorToasts({messages: errorMessages});
        } else {
          toast.error('Gagal menyimpan settings');
        }
      } catch {
        // Fallback if error parsing fails
        toast.error('Gagal menyimpan settings');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddRule = async () => {
    if (!surveyId || !rulesFormData.degree) return;

    try {
      await createRuleMutation.mutateAsync({
        surveyId,
        data: {
          degree: rulesFormData.degree,
        },
      });

      toast.success('Rule berhasil ditambahkan');
      setRulesFormData({
        degree: 'S1',
      });
      setIsRulesSheetOpen(false);
    } catch (error: unknown) {
      try {
        const err = error as ErrorResponse;
        const errorData = err?.response?.data;

        let errorMessages: string[] = [];

        if (errorData?.message) {
          const errorMessage = errorData.message;

          if (Array.isArray(errorMessage)) {
            errorMessages = errorMessage.map((errDetail) => {
              if (
                typeof errDetail === 'object' &&
                errDetail !== null &&
                !Array.isArray(errDetail)
              ) {
                const detail = errDetail as ErrorDetail;
                return `${detail.field || 'Error'}: ${
                  detail.message || 'Unknown error'
                }`;
              }
              return String(errDetail);
            });
          } else if (typeof errorMessage === 'string') {
            errorMessages = [errorMessage];
          }
        }

        if (errorData?.error) {
          errorMessages.push(String(errorData.error));
        }

        if (errorMessages.length > 0) {
          showSequentialErrorToasts({messages: errorMessages});
        } else {
          toast.error('Gagal menambahkan rule');
        }
      } catch {
        toast.error('Gagal menambahkan rule');
      }
    }
  };

  const handleDeleteRule = async () => {
    if (!deleteRule || !surveyId) return;

    setLoading(true);
    try {
      await deleteRuleMutation.mutateAsync({
        surveyId,
        ruleId: deleteRule.id,
      });

      toast.success('Rule berhasil dihapus');
      setDeleteRule(null);
    } catch (error: unknown) {
      try {
        const err = error as ErrorResponse;
        const errorData = err?.response?.data;

        let errorMessages: string[] = [];

        if (errorData?.message) {
          const errorMessage = errorData.message;

          if (Array.isArray(errorMessage)) {
            errorMessages = errorMessage.map((errDetail) => {
              if (
                typeof errDetail === 'object' &&
                errDetail !== null &&
                !Array.isArray(errDetail)
              ) {
                const detail = errDetail as ErrorDetail;
                return `${detail.field || 'Error'}: ${
                  detail.message || 'Unknown error'
                }`;
              }
              return String(errDetail);
            });
          } else if (typeof errorMessage === 'string') {
            errorMessages = [errorMessage];
          }
        }

        if (errorData?.error) {
          errorMessages.push(String(errorData.error));
        }

        if (errorMessages.length > 0) {
          showSequentialErrorToasts({messages: errorMessages});
        } else {
          toast.error('Gagal menghapus rule');
        }
      } catch {
        toast.error('Gagal menghapus rule');
      }
    } finally {
      setLoading(false);
    }
  };

  const getSurveyTypeInfo = () => {
    switch (surveyType) {
      case 'TRACER_STUDY':
        return {
          title: 'Tracer Study',
          description: 'Survey untuk melacak status lulusan dan alumni',
          icon: FileText,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
        };
      case 'USER_SURVEY':
        return {
          title: 'User Survey',
          description: 'Survey untuk mengukur kepuasan mahasiswa',
          icon: Users,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
        };
      default:
        return {
          title: 'Survey',
          description: 'Survey settings',
          icon: Settings,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
        };
    }
  };

  const surveyInfo = getSurveyTypeInfo();

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
                  <BreadcrumbLink
                    onClick={() => navigate('/admin/survey')}
                    className='flex items-center space-x-1 cursor-pointer hover:text-primary'
                  >
                    <FileText className='h-4 w-4' />
                    <span>Pengaturan Survey</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{surveyName} - Settings</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Action Buttons */}
            <div className='flex items-center space-x-2'>
              <Button
                variant='outline'
                onClick={() => navigate('/admin/survey')}
              >
                <ArrowLeft className='mr-2 h-4 w-4' />
                Kembali
              </Button>
              <Button onClick={() => setIsSheetOpen(true)}>
                <Edit className='mr-2 h-4 w-4' />
                Edit Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Survey Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2'>
              <surveyInfo.icon className={`h-5 w-5 ${surveyInfo.color}`} />
              <span>{surveyName}</span>
              <Badge className={surveyInfo.bgColor + ' ' + surveyInfo.color}>
                {surveyInfo.title}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {surveyData?.description && (
              <div className='mb-4'>
                <p className='text-sm font-medium text-gray-700 mb-1'>
                  Deskripsi:
                </p>
                <p className='text-sm text-gray-600'>
                  {surveyData.description}
                </p>
              </div>
            )}
            {surveyData?.documentUrl && (
              <div className='mb-4'>
                <p className='text-sm font-medium text-gray-700 mb-1'>
                  Dokumen:
                </p>
                <a
                  href={surveyData.documentUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm text-primary hover:underline'
                >
                  {surveyData.documentUrl}
                </a>
              </div>
            )}
            {!surveyData?.description && (
              <p className='text-sm text-gray-600 mb-4'>
                {surveyInfo.description}
              </p>
            )}

            {/* Quick Stats */}
            <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
              <div className='flex items-center space-x-2'>
                <Settings className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm'>
                  {surveySettings?.surveyRules?.length || 0} Rules
                </span>
              </div>
              <div className='flex items-center space-x-2'>
                <FileText className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm'>
                  {(() => {
                    const count = surveyData?.questionCount || 0;
                    console.log('[SurveySettings] Survey ID:', surveyData?.id, 'Question Count:', count, 'Full Survey Data:', surveyData);
                    return count;
                  })()} Pertanyaan
                </span>
              </div>
              <div className='flex items-center space-x-2'>
                <Users className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm'>
                  {surveyData?.responseCount || 0} Response
                </span>
              </div>
              <div className='flex items-center space-x-2'>
                <Calendar className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm'>
                  Dibuat: {formatDate(surveySettings?.createdAt)}
                </span>
              </div>
              <div className='flex items-center space-x-2'>
                <Calendar className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm'>
                  Diupdate: {formatDate(surveySettings?.updatedAt)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Survey Rules */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <Settings className='h-5 w-5' />
                <span>Survey Rules</span>
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setIsRulesSheetOpen(true)}
              >
                <Plus className='mr-2 h-4 w-4' />
                Tambah Rule
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tingkat Pendidikan</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Tanggal Dibuat</TableHead>
                  <TableHead className='text-right'>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingRules ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className='text-center'
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : surveySettings?.surveyRules?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className='text-center text-muted-foreground'
                    >
                      Belum ada rule
                    </TableCell>
                  </TableRow>
                ) : (
                  surveySettings?.surveyRules?.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell>
                        <Badge variant='outline' className='text-sm font-medium'>
                          {rule.degree === 'S1' && 'S1 - Sarjana'}
                          {rule.degree === 'PASCA' && 'Pasca Sarjana'}
                          {rule.degree === 'PROFESI' && 'Profesi'}
                          {rule.degree === 'VOKASI' && 'Vokasi'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className='text-sm text-muted-foreground'>
                          Berlaku untuk semua fakultas dan jurusan dengan tingkat pendidikan{' '}
                          <span className='font-medium text-foreground'>
                            {rule.degree === 'S1' && 'Sarjana'}
                            {rule.degree === 'PASCA' && 'Pasca Sarjana'}
                            {rule.degree === 'PROFESI' && 'Profesi'}
                            {rule.degree === 'VOKASI' && 'Vokasi'}
                          </span>
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className='text-sm'>
                          {formatDate(rule.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell className='text-right'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => setDeleteRule(rule)}
                          className='hover:bg-destructive hover:text-destructive-foreground'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Settings Sheet */}
        <Sheet
          open={isSheetOpen}
          onOpenChange={setIsSheetOpen}
        >
          <SheetContent className='w-[95vw] max-w-[1200px] flex flex-col'>
            <SheetHeader className='shrink-0'>
              <SheetTitle>Edit Survey Settings</SheetTitle>
              <SheetDescription>
                Ubah pengaturan greeting opening dan closing untuk survey ini
              </SheetDescription>
            </SheetHeader>

            {/* Tab Navigation */}
            <div className='shrink-0 px-4 border-b overflow-x-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
              <div className='flex space-x-1'>
                <Button
                  variant={activeTab === 'info' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('info')}
                  className='rounded-none'
                >
                  Informasi Survey
                </Button>
                <Button
                  variant={activeTab === 'opening' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('opening')}
                  className='rounded-none'
                >
                  Pembuka Survey
                </Button>
                <Button
                  variant={activeTab === 'closing' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('closing')}
                  className='rounded-none'
                >
                  Penutup Survey
                </Button>
              </div>
            </div>

            <div className='flex-1 overflow-y-auto px-4 space-y-8 pb-6 pt-6'>
              {/* Info Tab */}
              {activeTab === 'info' && (
                <div className='space-y-6'>
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='description'
                        className='text-sm font-medium'
                      >
                        Deskripsi Survey *
                      </Label>
                      <Textarea
                        id='description'
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange('description', e.target.value)
                        }
                        placeholder='Deskripsi singkat tentang survey ini'
                        rows={4}
                        className='text-sm'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label
                        htmlFor='documentUrl'
                        className='text-sm font-medium'
                      >
                        URL Dokumen
                      </Label>
                      <Input
                        id='documentUrl'
                        value={formData.documentUrl}
                        onChange={(e) =>
                          handleInputChange('documentUrl', e.target.value)
                        }
                        placeholder='https://example.com/document.pdf'
                        className='text-sm'
                        type='url'
                      />
                      <p className='text-xs text-muted-foreground'>
                        URL untuk dokumen terkait survey (opsional)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Opening Tab */}
              {activeTab === 'opening' && (
                <div className='space-y-6'>
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='title'
                        className='text-sm font-medium'
                      >
                        Judul Survey *
                      </Label>
                      <Input
                        id='title'
                        value={formData.title}
                        onChange={(e) =>
                          handleInputChange('title', e.target.value)
                        }
                        placeholder='Tracer Study Lulusan Universitas Andalas'
                        className='text-sm'
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label
                          htmlFor='greetingIslamic'
                          className='text-sm font-medium'
                        >
                          Salam Islami
                        </Label>
                        <Input
                          id='greetingIslamic'
                          value={formData.greetingIslamic}
                          onChange={(e) =>
                            handleInputChange('greetingIslamic', e.target.value)
                          }
                          placeholder="Assalaamu'alaikum warahmatullaahi wabarakatuh"
                          className='text-sm'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label
                          htmlFor='greetingGeneral'
                          className='text-sm font-medium'
                        >
                          Salam Umum
                        </Label>
                        <Input
                          id='greetingGeneral'
                          value={formData.greetingGeneral}
                          onChange={(e) =>
                            handleInputChange('greetingGeneral', e.target.value)
                          }
                          placeholder='Salam sejahtera untuk kita semua'
                          className='text-sm'
                        />
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <Label
                        htmlFor='addressee'
                        className='text-sm font-medium'
                      >
                        Alamat Tujuan *
                      </Label>
                      <Textarea
                        id='addressee'
                        value={formData.addressee}
                        onChange={(e) =>
                          handleInputChange('addressee', e.target.value)
                        }
                        placeholder='Kepada Yth. lulusan Universitas Andalas wisuda tahun 2023 Dimana saja berada.'
                        rows={2}
                        className='text-sm'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label
                        htmlFor='introduction'
                        className='text-sm font-medium'
                      >
                        Pengantar *
                      </Label>
                      <Textarea
                        id='introduction'
                        value={formData.introduction}
                        onChange={(e) =>
                          handleInputChange('introduction', e.target.value)
                        }
                        placeholder='Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi...'
                        rows={4}
                        className='text-sm'
                      />
                    </div>

                    <div className='space-y-4'>
                      <div className='space-y-2'>
                        <Label
                          htmlFor='ikuTitle'
                          className='text-sm font-medium'
                        >
                          Judul Daftar IKU
                        </Label>
                        <Input
                          id='ikuTitle'
                          value={formData.ikuTitle}
                          onChange={(e) =>
                            handleInputChange('ikuTitle', e.target.value)
                          }
                          placeholder='Indikator Kinerja Utama (IKU) yang diukur:'
                          className='text-sm'
                        />
                      </div>

                      <div className='space-y-2'>
                        <Label className='text-sm font-medium'>
                          Daftar IKU
                        </Label>
                        {formData.ikuItems.map((item, index) => (
                          <div
                            key={index}
                            className='flex space-x-2'
                          >
                            <Input
                              value={item}
                              onChange={(e) =>
                                handleIkuItemChange(index, e.target.value)
                              }
                              placeholder={`Item IKU ${index + 1}`}
                              className='text-sm'
                            />
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              onClick={() => removeIkuItem(index)}
                              disabled={formData.ikuItems.length === 1}
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={addIkuItem}
                        >
                          <Plus className='mr-2 h-4 w-4' />
                          Tambah Item IKU
                        </Button>
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <Label
                        htmlFor='purpose'
                        className='text-sm font-medium'
                      >
                        Tujuan *
                      </Label>
                      <Textarea
                        id='purpose'
                        value={formData.purpose}
                        onChange={(e) =>
                          handleInputChange('purpose', e.target.value)
                        }
                        placeholder='Untuk mengukur kinerja tersebut...'
                        rows={3}
                        className='text-sm'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label
                        htmlFor='expectation'
                        className='text-sm font-medium'
                      >
                        Harapan *
                      </Label>
                      <Textarea
                        id='expectation'
                        value={formData.expectation}
                        onChange={(e) =>
                          handleInputChange('expectation', e.target.value)
                        }
                        placeholder='Partisipasi seluruh alumni sangat diharapkan...'
                        rows={3}
                        className='text-sm'
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label
                          htmlFor='department'
                          className='text-sm font-medium'
                        >
                          Departemen *
                        </Label>
                        <Input
                          id='department'
                          value={formData.department}
                          onChange={(e) =>
                            handleInputChange('department', e.target.value)
                          }
                          placeholder='Pusat Karir, Konseling, dan Tracer Study'
                          className='text-sm'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label
                          htmlFor='university'
                          className='text-sm font-medium'
                        >
                          Universitas *
                        </Label>
                        <Input
                          id='university'
                          value={formData.university}
                          onChange={(e) =>
                            handleInputChange('university', e.target.value)
                          }
                          placeholder='Universitas Andalas'
                          className='text-sm'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Closing Tab */}
              {activeTab === 'closing' && (
                <div className='space-y-6'>
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='closingTitle'
                        className='text-sm font-medium'
                      >
                        Judul Penutup *
                      </Label>
                      <Input
                        id='closingTitle'
                        value={formData.closingTitle}
                        onChange={(e) =>
                          handleInputChange('closingTitle', e.target.value)
                        }
                        placeholder='Terima Kasih'
                        className='text-sm'
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label
                          htmlFor='closingGreetingIslamic'
                          className='text-sm font-medium'
                        >
                          Salam Penutup Islami
                        </Label>
                        <Input
                          id='closingGreetingIslamic'
                          value={formData.closingGreetingIslamic}
                          onChange={(e) =>
                            handleInputChange(
                              'closingGreetingIslamic',
                              e.target.value
                            )
                          }
                          placeholder="Wassalaamu'alaikum warahmatullaahi wabarakatuh"
                          className='text-sm'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label
                          htmlFor='closingGreetingGeneral'
                          className='text-sm font-medium'
                        >
                          Salam Penutup Umum
                        </Label>
                        <Input
                          id='closingGreetingGeneral'
                          value={formData.closingGreetingGeneral}
                          onChange={(e) =>
                            handleInputChange(
                              'closingGreetingGeneral',
                              e.target.value
                            )
                          }
                          placeholder='Salam sejahtera untuk kita semua'
                          className='text-sm'
                        />
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <Label
                        htmlFor='closingAddressee'
                        className='text-sm font-medium'
                      >
                        Alamat Tujuan Penutup *
                      </Label>
                      <Textarea
                        id='closingAddressee'
                        value={formData.closingAddressee}
                        onChange={(e) =>
                          handleInputChange('closingAddressee', e.target.value)
                        }
                        placeholder='Kepada Yth. lulusan Universitas Andalas yang telah berpartisipasi dalam survey ini.'
                        rows={2}
                        className='text-sm'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label
                        htmlFor='closingIntroduction'
                        className='text-sm font-medium'
                      >
                        Pengantar Penutup *
                      </Label>
                      <Textarea
                        id='closingIntroduction'
                        value={formData.closingIntroduction}
                        onChange={(e) =>
                          handleInputChange(
                            'closingIntroduction',
                            e.target.value
                          )
                        }
                        placeholder='Terima kasih atas partisipasi Anda dalam mengisi survey Tracer Study ini...'
                        rows={4}
                        className='text-sm'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label
                        htmlFor='closingExpectation'
                        className='text-sm font-medium'
                      >
                        Harapan Penutup *
                      </Label>
                      <Textarea
                        id='closingExpectation'
                        value={formData.closingExpectation}
                        onChange={(e) =>
                          handleInputChange(
                            'closingExpectation',
                            e.target.value
                          )
                        }
                        placeholder='Kami berharap informasi yang telah Anda berikan dapat membantu kami...'
                        rows={3}
                        className='text-sm'
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label
                          htmlFor='closingDepartment'
                          className='text-sm font-medium'
                        >
                          Departemen Penutup *
                        </Label>
                        <Input
                          id='closingDepartment'
                          value={formData.closingDepartment}
                          onChange={(e) =>
                            handleInputChange(
                              'closingDepartment',
                              e.target.value
                            )
                          }
                          placeholder='Pusat Karir, Konseling, dan Tracer Study'
                          className='text-sm'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label
                          htmlFor='closingUniversity'
                          className='text-sm font-medium'
                        >
                          Universitas Penutup *
                        </Label>
                        <Input
                          id='closingUniversity'
                          value={formData.closingUniversity}
                          onChange={(e) =>
                            handleInputChange(
                              'closingUniversity',
                              e.target.value
                            )
                          }
                          placeholder='Universitas Andalas'
                          className='text-sm'
                        />
                      </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <div className='space-y-2'>
                        <Label
                          htmlFor='contactPhone'
                          className='text-sm font-medium'
                        >
                          Nomor Telepon
                        </Label>
                        <Input
                          id='contactPhone'
                          value={formData.contactPhone}
                          onChange={(e) =>
                            handleInputChange('contactPhone', e.target.value)
                          }
                          placeholder='(0751) 70537'
                          className='text-sm'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label
                          htmlFor='contactEmail'
                          className='text-sm font-medium'
                        >
                          Email Kontak
                        </Label>
                        <Input
                          id='contactEmail'
                          value={formData.contactEmail}
                          onChange={(e) =>
                            handleInputChange('contactEmail', e.target.value)
                          }
                          placeholder='tracer@unand.ac.id'
                          className='text-sm'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label
                          htmlFor='contactWebsite'
                          className='text-sm font-medium'
                        >
                          Website
                        </Label>
                        <Input
                          id='contactWebsite'
                          value={formData.contactWebsite}
                          onChange={(e) =>
                            handleInputChange('contactWebsite', e.target.value)
                          }
                          placeholder='www.unand.ac.id'
                          className='text-sm'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className='shrink-0 border-t bg-background px-4 py-4 flex justify-end space-x-2'>
              <Button
                variant='outline'
                onClick={() => setIsSheetOpen(false)}
              >
                Batal
              </Button>
              <Button
                onClick={handleSaveSettings}
                disabled={loading || !formData.title || !formData.addressee}
              >
                <Save className='mr-2 h-4 w-4' />
                {loading ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Survey Rules Sheet */}
        <Sheet
          open={isRulesSheetOpen}
          onOpenChange={setIsRulesSheetOpen}
        >
          <SheetContent className='w-[95vw] max-w-[600px] overflow-y-auto'>
            <SheetHeader className='pb-6 border-b'>
              <SheetTitle className='text-2xl font-semibold flex items-center gap-2'>
                <div className='p-2 bg-primary/10 rounded-lg'>
                  <Settings className='h-5 w-5 text-primary' />
                </div>
                Tambah Survey Rule
              </SheetTitle>
              <SheetDescription className='text-base mt-2'>
                Atur aturan survey berdasarkan tingkat pendidikan. Rule ini akan
                berlaku untuk semua fakultas dan jurusan dengan tingkat
                pendidikan yang dipilih.
              </SheetDescription>
            </SheetHeader>

            <div className='mt-6 space-y-6'>
              {/* Add New Rule */}
              <div className='space-y-6'>
                <div className='space-y-3'>
                  <Label className='text-sm font-semibold flex items-center gap-2'>
                    <Calendar className='h-4 w-4 text-muted-foreground' />
                    Tingkat Pendidikan
                    <span className='text-destructive'>*</span>
                  </Label>
                  <Select
                    value={rulesFormData.degree}
                    onValueChange={(
                      value: 'S1' | 'PASCA' | 'PROFESI' | 'VOKASI'
                    ) => setRulesFormData((prev) => ({...prev, degree: value}))}
                  >
                    <SelectTrigger className='h-11'>
                      <SelectValue placeholder='Pilih tingkat pendidikan' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='S1'>S1 - Sarjana</SelectItem>
                      <SelectItem value='PASCA'>Pasca Sarjana</SelectItem>
                      <SelectItem value='PROFESI'>Profesi</SelectItem>
                      <SelectItem value='VOKASI'>Vokasi</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className='text-xs text-muted-foreground'>
                    Pilih tingkat pendidikan yang akan diatur. Rule ini akan
                    berlaku untuk semua fakultas dan jurusan dengan tingkat
                    pendidikan tersebut.
                  </p>
                </div>

                {/* Info Box */}
                <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                  <div className='flex items-start gap-3'>
                    <div className='p-1.5 bg-blue-100 rounded'>
                      <Settings className='h-4 w-4 text-blue-600' />
                    </div>
                    <div className='flex-1'>
                      <p className='text-sm font-medium text-blue-900 mb-1'>
                        Informasi Rule
                      </p>
                      <p className='text-xs text-blue-700'>
                        Rule yang dibuat akan berlaku untuk semua fakultas dan
                        jurusan yang memiliki tingkat pendidikan{' '}
                        <span className='font-medium'>
                          {rulesFormData.degree === 'S1' && 'Sarjana (S1)'}
                          {rulesFormData.degree === 'PASCA' && 'Pasca Sarjana'}
                          {rulesFormData.degree === 'PROFESI' && 'Profesi'}
                          {rulesFormData.degree === 'VOKASI' && 'Vokasi'}
                        </span>
                        . Tidak perlu memilih fakultas atau jurusan secara
                        spesifik.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='pt-4 border-t'>
                <div className='flex items-center justify-between'>
                  <div className='text-sm text-muted-foreground'>
                    <p>
                      Pastikan tingkat pendidikan telah dipilih sebelum
                      menambahkan rule
                    </p>
                  </div>
                  <Button
                    onClick={handleAddRule}
                    disabled={!rulesFormData.degree}
                    className='min-w-[140px] h-11'
                    size='lg'
                  >
                    <Plus className='mr-2 h-4 w-4' />
                    Tambah Rule
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Delete Rule Confirmation Dialog */}
        <AlertDialog
          open={!!deleteRule}
          onOpenChange={() => setDeleteRule(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Survey Rule</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div>
                  Apakah Anda yakin ingin menghapus rule untuk tingkat
                  pendidikan{' '}
                  <strong>
                    {deleteRule?.degree === 'S1' && 'S1 - Sarjana'}
                    {deleteRule?.degree === 'PASCA' && 'Pasca Sarjana'}
                    {deleteRule?.degree === 'PROFESI' && 'Profesi'}
                    {deleteRule?.degree === 'VOKASI' && 'Vokasi'}
                  </strong>
                  ?
                  <br />
                  <br />
                  Rule ini berlaku untuk semua fakultas dan jurusan dengan
                  tingkat pendidikan tersebut.
                  <br />
                  <br />
                  <span className='font-medium text-destructive'>
                    Tindakan ini tidak dapat dibatalkan.
                  </span>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteRule}
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

export default SurveySettings;
