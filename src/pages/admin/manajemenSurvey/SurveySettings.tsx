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
import { useNavigate, useSearchParams } from 'react-router-dom';

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
  contact: {
    phone: string;
    email: string;
    website: string;
  };
}

interface SurveyRule {
  id: string;
  surveyId: string;
  majorId: string;
  major: Major;
  degree: 'D3' | 'S1' | 'S2' | 'S3' | 'PROFESI';
  targetRole: 'ALUMNI' | 'MANAGER' | 'BOTH';
  createdAt: string;
  updatedAt: string;
}

interface Major {
  id: string;
  name: string;
  faculty: string;
}

interface SurveySettingsFormData {
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

const SurveySettings: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get survey info from URL params
  const surveyId = searchParams.get('id');
  const surveyType = searchParams.get('type') as 'TRACER_STUDY' | 'USER_SURVEY' | null;
  const surveyName = searchParams.get('name') || 'Survey';

  // State management
  const [surveySettings, setSurveySettings] = useState<SurveySettings | null>(null);
  const [majors, setMajors] = useState<Major[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isRulesSheetOpen, setIsRulesSheetOpen] = useState(false);
  const [deleteRule, setDeleteRule] = useState<SurveyRule | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'opening' | 'closing' | 'rules'>('opening');

  // Form data
  const [formData, setFormData] = useState<SurveySettingsFormData>({
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
    majorId: '',
    degree: 'S1' as 'D3' | 'S1' | 'S2' | 'S3' | 'PROFESI',
    targetRole: 'ALUMNI' as 'ALUMNI' | 'MANAGER' | 'BOTH',
  });

  // Mock data - replace with API calls
  useEffect(() => {
    const mockMajors: Major[] = [
      { id: '1', name: 'Teknik Informatika', faculty: 'Fakultas Teknik' },
      { id: '2', name: 'Manajemen', faculty: 'Fakultas Ekonomi' },
      { id: '3', name: 'Kedokteran', faculty: 'Fakultas Kedokteran' },
      { id: '4', name: 'Psikologi', faculty: 'Fakultas Psikologi' },
      { id: '5', name: 'Teknik Sipil', faculty: 'Fakultas Teknik' },
    ];
    setMajors(mockMajors);

    // Mock survey settings data
    const mockSurveySettings: SurveySettings = {
      id: '1',
      surveyId: surveyId || '1',
      surveyName: surveyName,
      surveyType: surveyType || 'TRACER_STUDY',
      greetingOpening: {
        title: surveyType === 'USER_SURVEY' ? 'Survey Kepuasan Mahasiswa' : 'Tracer Study Lulusan Universitas Andalas',
        greeting: {
          islamic: "Assalaamu'alaikum warahmatullaahi wabarakatuh",
          general: 'Salam sejahtera untuk kita semua',
        },
        addressee: surveyType === 'USER_SURVEY' 
          ? 'Kepada Yth. Mahasiswa Universitas Andalas'
          : 'Kepada Yth. lulusan Universitas Andalas wisuda tahun 2023 Dimana saja berada.',
        introduction: surveyType === 'USER_SURVEY'
          ? 'Dalam rangka meningkatkan kualitas layanan dan pendidikan di Universitas Andalas, kami mengundang Anda untuk berpartisipasi dalam survey kepuasan mahasiswa.'
          : 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi (Kemendikbudristek) telah meluncurkan program "Merdeka Belajar" yang mencakup beberapa terobosan untuk meningkatkan kualitas pendidikan tinggi.',
        ikuList: {
          title: surveyType === 'USER_SURVEY' ? 'Aspek yang akan dievaluasi:' : 'Indikator Kinerja Utama (IKU) yang diukur:',
          items: surveyType === 'USER_SURVEY' 
            ? [
                'Kualitas pembelajaran dan dosen',
                'Fasilitas kampus dan laboratorium',
                'Layanan administrasi dan kemahasiswaan',
                'Sarana dan prasarana pendukung',
              ]
            : [
                'Jumlah Lulusan mendapat pekerjaan',
                'Jumlah Lulusan yang menjadi wirausaha, atau',
                'Jumlah Lulusan yang melanjutkan studi',
                'Jumlah lulusan yang belum bekerja/tidak bekerja',
              ],
        },
        purpose: surveyType === 'USER_SURVEY'
          ? 'Survey ini bertujuan untuk mengumpulkan feedback dari mahasiswa guna meningkatkan kualitas layanan dan pendidikan di Universitas Andalas.'
          : 'Untuk mengukur kinerja tersebut, Perguruan Tinggi diwajibkan mengumpulkan data dari seluruh alumni yang telah lulus atau diwisuda dalam kurun waktu 1 tahun terakhir.',
        expectation: surveyType === 'USER_SURVEY'
          ? 'Partisipasi Anda sangat berharga untuk kemajuan kampus tercinta.'
          : 'Partisipasi seluruh alumni sangat diharapkan untuk mengumpulkan data dan masukan agar Unand menjadi lebih baik.',
        signOff: {
          department: surveyType === 'USER_SURVEY' ? 'Biro Kemahasiswaan dan Alumni' : 'Pusat Karir, Konseling, dan Tracer Study',
          university: 'Universitas Andalas',
        },
      },
      greetingClosing: {
        title: 'Terima Kasih',
        greeting: {
          islamic: "Wassalaamu'alaikum warahmatullaahi wabarakatuh",
          general: 'Salam sejahtera untuk kita semua',
        },
        addressee: surveyType === 'USER_SURVEY'
          ? 'Kepada Yth. Mahasiswa yang telah berpartisipasi'
          : 'Kepada Yth. lulusan Universitas Andalas yang telah berpartisipasi dalam survey ini.',
        introduction: surveyType === 'USER_SURVEY'
          ? 'Terima kasih atas partisipasi Anda dalam survey kepuasan mahasiswa ini.'
          : 'Terima kasih atas partisipasi Anda dalam mengisi survey Tracer Study ini. Data yang Anda berikan sangat berharga untuk meningkatkan kualitas pendidikan di Universitas Andalas.',
        expectation: surveyType === 'USER_SURVEY'
          ? 'Feedback Anda akan membantu kami meningkatkan kualitas layanan kampus.'
          : 'Kami berharap informasi yang telah Anda berikan dapat membantu kami dalam mengembangkan program studi dan layanan yang lebih baik untuk mahasiswa dan alumni di masa mendatang.',
        signOff: {
          department: surveyType === 'USER_SURVEY' ? 'Biro Kemahasiswaan dan Alumni' : 'Pusat Karir, Konseling, dan Tracer Study',
          university: 'Universitas Andalas',
        },
        contact: {
          phone: '(0751) 70537',
          email: surveyType === 'USER_SURVEY' ? 'kemahasiswaan@unand.ac.id' : 'tracer@unand.ac.id',
          website: 'www.unand.ac.id',
        },
      },
      surveyRules: [
        {
          id: '1',
          surveyId: surveyId || '1',
          majorId: '1',
          major: mockMajors[0],
          degree: 'S1',
          targetRole: surveyType === 'USER_SURVEY' ? 'MANAGER' : 'ALUMNI',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
      ],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    };
    setSurveySettings(mockSurveySettings);

    // Populate form data
    setFormData({
      title: mockSurveySettings.greetingOpening.title,
      greetingIslamic: mockSurveySettings.greetingOpening.greeting.islamic,
      greetingGeneral: mockSurveySettings.greetingOpening.greeting.general,
      addressee: mockSurveySettings.greetingOpening.addressee,
      introduction: mockSurveySettings.greetingOpening.introduction,
      ikuTitle: mockSurveySettings.greetingOpening.ikuList.title,
      ikuItems: mockSurveySettings.greetingOpening.ikuList.items.length > 0 
        ? mockSurveySettings.greetingOpening.ikuList.items 
        : [''],
      purpose: mockSurveySettings.greetingOpening.purpose,
      expectation: mockSurveySettings.greetingOpening.expectation,
      department: mockSurveySettings.greetingOpening.signOff.department,
      university: mockSurveySettings.greetingOpening.signOff.university,
      // Closing form data
      closingTitle: mockSurveySettings.greetingClosing.title,
      closingGreetingIslamic: mockSurveySettings.greetingClosing.greeting.islamic,
      closingGreetingGeneral: mockSurveySettings.greetingClosing.greeting.general,
      closingAddressee: mockSurveySettings.greetingClosing.addressee,
      closingIntroduction: mockSurveySettings.greetingClosing.introduction,
      closingExpectation: mockSurveySettings.greetingClosing.expectation,
      closingDepartment: mockSurveySettings.greetingClosing.signOff.department,
      closingUniversity: mockSurveySettings.greetingClosing.signOff.university,
      contactPhone: mockSurveySettings.greetingClosing.contact.phone,
      contactEmail: mockSurveySettings.greetingClosing.contact.email,
      contactWebsite: mockSurveySettings.greetingClosing.contact.website,
    });
  }, [surveyId, surveyType, surveyName]);

  // Form handlers
  const handleInputChange = (field: keyof SurveySettingsFormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleIkuItemChange = (index: number, value: string) => {
    const newItems = [...formData.ikuItems];
    newItems[index] = value;
    setFormData((prev) => ({ ...prev, ikuItems: newItems }));
  };

  const addIkuItem = () => {
    setFormData((prev) => ({ ...prev, ikuItems: [...prev.ikuItems, ''] }));
  };

  const removeIkuItem = (index: number) => {
    const newItems = formData.ikuItems.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, ikuItems: newItems }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      if (!surveySettings) return;

      const updatedSettings: SurveySettings = {
        ...surveySettings,
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
            items: formData.ikuItems.filter(item => item.trim() !== ''),
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
        updatedAt: new Date().toISOString(),
      };

      setSurveySettings(updatedSettings);
      setIsSheetOpen(false);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRule = () => {
    if (!surveySettings || !rulesFormData.majorId) return;

    const selectedMajor = majors.find(m => m.id === rulesFormData.majorId);
    if (!selectedMajor) return;

    const newRule: SurveyRule = {
      id: Date.now().toString(),
      surveyId: surveySettings.surveyId,
      majorId: rulesFormData.majorId,
      major: selectedMajor,
      degree: rulesFormData.degree,
      targetRole: rulesFormData.targetRole,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSurveySettings((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        surveyRules: [...prev.surveyRules, newRule],
        updatedAt: new Date().toISOString(),
      };
    });

    setRulesFormData({
      majorId: '',
      degree: 'S1',
      targetRole: 'ALUMNI',
    });
  };

  const handleDeleteRule = async () => {
    if (!deleteRule || !surveySettings) return;

    setLoading(true);
    try {
      setSurveySettings((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          surveyRules: prev.surveyRules.filter(r => r.id !== deleteRule.id),
          updatedAt: new Date().toISOString(),
        };
      });
      setDeleteRule(null);
    } catch (error) {
      console.error('Error deleting rule:', error);
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
          bgColor: 'bg-blue-50'
        }
      case 'USER_SURVEY':
        return {
          title: 'User Survey',
          description: 'Survey untuk mengukur kepuasan mahasiswa',
          icon: Users,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50'
        }
      default:
        return {
          title: 'Survey',
          description: 'Survey settings',
          icon: Settings,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50'
        }
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
            <p className='text-sm text-gray-600 mb-4'>{surveyInfo.description}</p>
            
            {/* Quick Stats */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='flex items-center space-x-2'>
                <Settings className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm'>{surveySettings?.surveyRules?.length || 0} Rules</span>
              </div>
              <div className='flex items-center space-x-2'>
                <Calendar className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm'>
                  Dibuat: {surveySettings ? new Date(surveySettings.createdAt).toLocaleDateString('id-ID') : '-'}
                </span>
              </div>
              <div className='flex items-center space-x-2'>
                <Calendar className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm'>
                  Diupdate: {surveySettings ? new Date(surveySettings.updatedAt).toLocaleDateString('id-ID') : '-'}
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
                  <TableHead>Jurusan</TableHead>
                  <TableHead>Tingkat</TableHead>
                  <TableHead>Target Role</TableHead>
                  <TableHead>Tanggal Dibuat</TableHead>
                  <TableHead className='text-right'>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {surveySettings?.surveyRules?.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>{rule.major.name}</TableCell>
                    <TableCell>
                      <Badge variant='outline'>{rule.degree}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          rule.targetRole === 'ALUMNI'
                            ? 'bg-blue-100 text-blue-800'
                            : rule.targetRole === 'MANAGER'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-purple-100 text-purple-800'
                        }
                      >
                        {rule.targetRole}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(rule.createdAt).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell className='text-right'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => setDeleteRule(rule)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Settings Sheet */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className='w-[95vw] max-w-[1200px] overflow-y-auto'>
            <SheetHeader>
              <SheetTitle>Edit Survey Settings</SheetTitle>
              <SheetDescription>
                Ubah pengaturan greeting opening dan closing untuk survey ini
              </SheetDescription>
            </SheetHeader>

            <div className='px-4 space-y-8'>
              {/* Tab Navigation */}
              <div className='flex space-x-1 border-b'>
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

              {/* Opening Tab */}
              {activeTab === 'opening' && (
                <div className='space-y-6'>
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='title' className='text-sm font-medium'>
                        Judul Survey *
                      </Label>
                      <Input
                        id='title'
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder='Tracer Study Lulusan Universitas Andalas'
                        className='text-sm'
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='greetingIslamic' className='text-sm font-medium'>
                          Salam Islami
                        </Label>
                        <Input
                          id='greetingIslamic'
                          value={formData.greetingIslamic}
                          onChange={(e) => handleInputChange('greetingIslamic', e.target.value)}
                          placeholder="Assalaamu'alaikum warahmatullaahi wabarakatuh"
                          className='text-sm'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='greetingGeneral' className='text-sm font-medium'>
                          Salam Umum
                        </Label>
                        <Input
                          id='greetingGeneral'
                          value={formData.greetingGeneral}
                          onChange={(e) => handleInputChange('greetingGeneral', e.target.value)}
                          placeholder='Salam sejahtera untuk kita semua'
                          className='text-sm'
                        />
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='addressee' className='text-sm font-medium'>
                        Alamat Tujuan *
                      </Label>
                      <Textarea
                        id='addressee'
                        value={formData.addressee}
                        onChange={(e) => handleInputChange('addressee', e.target.value)}
                        placeholder='Kepada Yth. lulusan Universitas Andalas wisuda tahun 2023 Dimana saja berada.'
                        rows={2}
                        className='text-sm'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='introduction' className='text-sm font-medium'>
                        Pengantar *
                      </Label>
                      <Textarea
                        id='introduction'
                        value={formData.introduction}
                        onChange={(e) => handleInputChange('introduction', e.target.value)}
                        placeholder='Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi...'
                        rows={4}
                        className='text-sm'
                      />
                    </div>

                    <div className='space-y-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='ikuTitle' className='text-sm font-medium'>
                          Judul Daftar IKU
                        </Label>
                        <Input
                          id='ikuTitle'
                          value={formData.ikuTitle}
                          onChange={(e) => handleInputChange('ikuTitle', e.target.value)}
                          placeholder='Indikator Kinerja Utama (IKU) yang diukur:'
                          className='text-sm'
                        />
                      </div>

                      <div className='space-y-2'>
                        <Label className='text-sm font-medium'>Daftar IKU</Label>
                        {formData.ikuItems.map((item, index) => (
                          <div key={index} className='flex space-x-2'>
                            <Input
                              value={item}
                              onChange={(e) => handleIkuItemChange(index, e.target.value)}
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
                      <Label htmlFor='purpose' className='text-sm font-medium'>
                        Tujuan *
                      </Label>
                      <Textarea
                        id='purpose'
                        value={formData.purpose}
                        onChange={(e) => handleInputChange('purpose', e.target.value)}
                        placeholder='Untuk mengukur kinerja tersebut...'
                        rows={3}
                        className='text-sm'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='expectation' className='text-sm font-medium'>
                        Harapan *
                      </Label>
                      <Textarea
                        id='expectation'
                        value={formData.expectation}
                        onChange={(e) => handleInputChange('expectation', e.target.value)}
                        placeholder='Partisipasi seluruh alumni sangat diharapkan...'
                        rows={3}
                        className='text-sm'
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='department' className='text-sm font-medium'>
                          Departemen *
                        </Label>
                        <Input
                          id='department'
                          value={formData.department}
                          onChange={(e) => handleInputChange('department', e.target.value)}
                          placeholder='Pusat Karir, Konseling, dan Tracer Study'
                          className='text-sm'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='university' className='text-sm font-medium'>
                          Universitas *
                        </Label>
                        <Input
                          id='university'
                          value={formData.university}
                          onChange={(e) => handleInputChange('university', e.target.value)}
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
                      <Label htmlFor='closingTitle' className='text-sm font-medium'>
                        Judul Penutup *
                      </Label>
                      <Input
                        id='closingTitle'
                        value={formData.closingTitle}
                        onChange={(e) => handleInputChange('closingTitle', e.target.value)}
                        placeholder='Terima Kasih'
                        className='text-sm'
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='closingGreetingIslamic' className='text-sm font-medium'>
                          Salam Penutup Islami
                        </Label>
                        <Input
                          id='closingGreetingIslamic'
                          value={formData.closingGreetingIslamic}
                          onChange={(e) => handleInputChange('closingGreetingIslamic', e.target.value)}
                          placeholder="Wassalaamu'alaikum warahmatullaahi wabarakatuh"
                          className='text-sm'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='closingGreetingGeneral' className='text-sm font-medium'>
                          Salam Penutup Umum
                        </Label>
                        <Input
                          id='closingGreetingGeneral'
                          value={formData.closingGreetingGeneral}
                          onChange={(e) => handleInputChange('closingGreetingGeneral', e.target.value)}
                          placeholder='Salam sejahtera untuk kita semua'
                          className='text-sm'
                        />
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='closingAddressee' className='text-sm font-medium'>
                        Alamat Tujuan Penutup *
                      </Label>
                      <Textarea
                        id='closingAddressee'
                        value={formData.closingAddressee}
                        onChange={(e) => handleInputChange('closingAddressee', e.target.value)}
                        placeholder='Kepada Yth. lulusan Universitas Andalas yang telah berpartisipasi dalam survey ini.'
                        rows={2}
                        className='text-sm'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='closingIntroduction' className='text-sm font-medium'>
                        Pengantar Penutup *
                      </Label>
                      <Textarea
                        id='closingIntroduction'
                        value={formData.closingIntroduction}
                        onChange={(e) => handleInputChange('closingIntroduction', e.target.value)}
                        placeholder='Terima kasih atas partisipasi Anda dalam mengisi survey Tracer Study ini...'
                        rows={4}
                        className='text-sm'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='closingExpectation' className='text-sm font-medium'>
                        Harapan Penutup *
                      </Label>
                      <Textarea
                        id='closingExpectation'
                        value={formData.closingExpectation}
                        onChange={(e) => handleInputChange('closingExpectation', e.target.value)}
                        placeholder='Kami berharap informasi yang telah Anda berikan dapat membantu kami...'
                        rows={3}
                        className='text-sm'
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='closingDepartment' className='text-sm font-medium'>
                          Departemen Penutup *
                        </Label>
                        <Input
                          id='closingDepartment'
                          value={formData.closingDepartment}
                          onChange={(e) => handleInputChange('closingDepartment', e.target.value)}
                          placeholder='Pusat Karir, Konseling, dan Tracer Study'
                          className='text-sm'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='closingUniversity' className='text-sm font-medium'>
                          Universitas Penutup *
                        </Label>
                        <Input
                          id='closingUniversity'
                          value={formData.closingUniversity}
                          onChange={(e) => handleInputChange('closingUniversity', e.target.value)}
                          placeholder='Universitas Andalas'
                          className='text-sm'
                        />
                      </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='contactPhone' className='text-sm font-medium'>
                          Nomor Telepon
                        </Label>
                        <Input
                          id='contactPhone'
                          value={formData.contactPhone}
                          onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                          placeholder='(0751) 70537'
                          className='text-sm'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='contactEmail' className='text-sm font-medium'>
                          Email Kontak
                        </Label>
                        <Input
                          id='contactEmail'
                          value={formData.contactEmail}
                          onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                          placeholder='tracer@unand.ac.id'
                          className='text-sm'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='contactWebsite' className='text-sm font-medium'>
                          Website
                        </Label>
                        <Input
                          id='contactWebsite'
                          value={formData.contactWebsite}
                          onChange={(e) => handleInputChange('contactWebsite', e.target.value)}
                          placeholder='www.unand.ac.id'
                          className='text-sm'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className='flex justify-end space-x-2'>
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
            </div>
          </SheetContent>
        </Sheet>

        {/* Survey Rules Sheet */}
        <Sheet open={isRulesSheetOpen} onOpenChange={setIsRulesSheetOpen}>
          <SheetContent className='w-[95vw] max-w-[1000px] overflow-y-auto'>
            <SheetHeader>
              <SheetTitle>Tambah Survey Rule</SheetTitle>
              <SheetDescription>
                Atur aturan survey berdasarkan jurusan, tingkat pendidikan, dan target role
              </SheetDescription>
            </SheetHeader>

            <div className='px-4 space-y-6'>
              {/* Add New Rule */}
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>Tambah Rule Baru</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='space-y-2'>
                      <Label className='text-sm font-medium'>Jurusan *</Label>
                      <Select
                        value={rulesFormData.majorId}
                        onValueChange={(value) =>
                          setRulesFormData((prev) => ({ ...prev, majorId: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Pilih jurusan' />
                        </SelectTrigger>
                        <SelectContent>
                          {majors.map((major) => (
                            <SelectItem key={major.id} value={major.id}>
                              {major.name} ({major.faculty})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-2'>
                      <Label className='text-sm font-medium'>Tingkat Pendidikan *</Label>
                      <Select
                        value={rulesFormData.degree}
                        onValueChange={(value: 'D3' | 'S1' | 'S2' | 'S3' | 'PROFESI') =>
                          setRulesFormData((prev) => ({ ...prev, degree: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='D3'>D3</SelectItem>
                          <SelectItem value='S1'>S1</SelectItem>
                          <SelectItem value='S2'>S2</SelectItem>
                          <SelectItem value='S3'>S3</SelectItem>
                          <SelectItem value='PROFESI'>Profesi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-2'>
                      <Label className='text-sm font-medium'>Target Role *</Label>
                      <Select
                        value={rulesFormData.targetRole}
                        onValueChange={(value: 'ALUMNI' | 'MANAGER' | 'BOTH') =>
                          setRulesFormData((prev) => ({ ...prev, targetRole: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='ALUMNI'>Alumni</SelectItem>
                          <SelectItem value='MANAGER'>Manager</SelectItem>
                          <SelectItem value='BOTH'>Keduanya</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button onClick={handleAddRule} disabled={!rulesFormData.majorId}>
                    <Plus className='mr-2 h-4 w-4' />
                    Tambah Rule
                  </Button>
                </CardContent>
              </Card>
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
                  Apakah Anda yakin ingin menghapus rule untuk{' '}
                  <strong>{deleteRule?.major.name}</strong> - {deleteRule?.degree} - {deleteRule?.targetRole}?
                  <br />
                  <br />
                  Tindakan ini tidak dapat dibatalkan.
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
