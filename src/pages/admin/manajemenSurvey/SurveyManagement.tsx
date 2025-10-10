/** @format */

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Settings,
  Edit,
  Trash2,
  FileText,
  Users,
  Calendar,
  Package,
  Plus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Types untuk Survey
interface Survey {
  id: string;
  name: string;
  type: 'TRACER_STUDY' | 'USER_SURVEY';
  description: string;
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  questionCount: number;
  responseCount: number;
  greetingOpening?: GreetingOpening;
  greetingClosing?: GreetingClosing;
  surveyRules?: SurveyRule[];
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

const SurveyManagement: React.FC = () => {
  const navigate = useNavigate();

  // State management
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: '',
    type: 'TRACER_STUDY' as 'TRACER_STUDY' | 'USER_SURVEY',
    description: '',
  });

  // Mock data - replace with API calls
  useEffect(() => {
    const mockMajors: Major[] = [
      { id: '1', name: 'Teknik Informatika', faculty: 'Fakultas Teknik' },
      { id: '2', name: 'Manajemen', faculty: 'Fakultas Ekonomi' },
      { id: '3', name: 'Kedokteran', faculty: 'Fakultas Kedokteran' },
    ];

    const mockSurveys: Survey[] = [
      {
        id: '1',
        name: 'Tracer Study Lulusan 2023',
        type: 'TRACER_STUDY',
        description: 'Survey untuk melacak status lulusan Universitas Andalas tahun 2023',
        status: 'ACTIVE',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        questionCount: 25,
        responseCount: 150,
        greetingOpening: {
          title: 'Tracer Study Lulusan Universitas Andalas',
          greeting: {
            islamic: "Assalaamu'alaikum warahmatullaahi wabarakatuh",
            general: 'Salam sejahtera untuk kita semua',
          },
          addressee: 'Kepada Yth. lulusan Universitas Andalas wisuda tahun 2023 Dimana saja berada.',
          introduction: 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi (Kemendikbudristek) telah meluncurkan program "Merdeka Belajar" yang mencakup beberapa terobosan untuk meningkatkan kualitas pendidikan tinggi.',
          ikuList: {
            title: 'Indikator Kinerja Utama (IKU) yang diukur:',
            items: [
              'Jumlah Lulusan mendapat pekerjaan',
              'Jumlah Lulusan yang menjadi wirausaha, atau',
              'Jumlah Lulusan yang melanjutkan studi',
              'Jumlah lulusan yang belum bekerja/tidak bekerja',
            ],
          },
          purpose: 'Untuk mengukur kinerja tersebut, Perguruan Tinggi diwajibkan mengumpulkan data dari seluruh alumni yang telah lulus atau diwisuda dalam kurun waktu 1 tahun terakhir.',
          expectation: 'Partisipasi seluruh alumni sangat diharapkan untuk mengumpulkan data dan masukan agar Unand menjadi lebih baik.',
          signOff: {
            department: 'Pusat Karir, Konseling, dan Tracer Study',
            university: 'Universitas Andalas',
          },
        },
        greetingClosing: {
          title: 'Terima Kasih',
          greeting: {
            islamic: "Wassalaamu'alaikum warahmatullaahi wabarakatuh",
            general: 'Salam sejahtera untuk kita semua',
          },
          addressee: 'Kepada Yth. lulusan Universitas Andalas yang telah berpartisipasi dalam survey ini.',
          introduction: 'Terima kasih atas partisipasi Anda dalam mengisi survey Tracer Study ini. Data yang Anda berikan sangat berharga untuk meningkatkan kualitas pendidikan di Universitas Andalas.',
          expectation: 'Kami berharap informasi yang telah Anda berikan dapat membantu kami dalam mengembangkan program studi dan layanan yang lebih baik untuk mahasiswa dan alumni di masa mendatang.',
          signOff: {
            department: 'Pusat Karir, Konseling, dan Tracer Study',
            university: 'Universitas Andalas',
          },
          contact: {
            phone: '(0751) 70537',
            email: 'tracer@unand.ac.id',
            website: 'www.unand.ac.id',
          },
        },
        surveyRules: [
          {
            id: '1',
            surveyId: '1',
            majorId: '1',
            major: mockMajors[0],
            degree: 'S1',
            targetRole: 'ALUMNI',
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
          },
          {
            id: '2',
            surveyId: '1',
            majorId: '2',
            major: mockMajors[1],
            degree: 'S1',
            targetRole: 'ALUMNI',
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
          },
        ],
      },
      {
        id: '2',
        name: 'Survey Kepuasan Mahasiswa',
        type: 'USER_SURVEY',
        description: 'Survey untuk mengukur tingkat kepuasan mahasiswa terhadap layanan kampus',
        status: 'DRAFT',
        createdAt: '2024-01-20T14:30:00Z',
        updatedAt: '2024-01-20T14:30:00Z',
        questionCount: 15,
        responseCount: 0,
        greetingOpening: {
          title: 'Survey Kepuasan Mahasiswa',
          greeting: {
            islamic: "Assalaamu'alaikum warahmatullaahi wabarakatuh",
            general: 'Salam sejahtera untuk kita semua',
          },
          addressee: 'Kepada Yth. Mahasiswa Universitas Andalas',
          introduction: 'Dalam rangka meningkatkan kualitas layanan dan pendidikan di Universitas Andalas, kami mengundang Anda untuk berpartisipasi dalam survey kepuasan mahasiswa.',
          ikuList: {
            title: 'Aspek yang akan dievaluasi:',
            items: [
              'Kualitas pembelajaran dan dosen',
              'Fasilitas kampus dan laboratorium',
              'Layanan administrasi dan kemahasiswaan',
              'Sarana dan prasarana pendukung',
            ],
          },
          purpose: 'Survey ini bertujuan untuk mengumpulkan feedback dari mahasiswa guna meningkatkan kualitas layanan dan pendidikan di Universitas Andalas.',
          expectation: 'Partisipasi Anda sangat berharga untuk kemajuan kampus tercinta.',
          signOff: {
            department: 'Biro Kemahasiswaan dan Alumni',
            university: 'Universitas Andalas',
          },
        },
        greetingClosing: {
          title: 'Terima Kasih',
          greeting: {
            islamic: "Wassalaamu'alaikum warahmatullaahi wabarakatuh",
            general: 'Salam sejahtera untuk kita semua',
          },
          addressee: 'Kepada Yth. Mahasiswa yang telah berpartisipasi',
          introduction: 'Terima kasih atas partisipasi Anda dalam survey kepuasan mahasiswa ini.',
          expectation: 'Feedback Anda akan membantu kami meningkatkan kualitas layanan kampus.',
          signOff: {
            department: 'Biro Kemahasiswaan dan Alumni',
            university: 'Universitas Andalas',
          },
          contact: {
            phone: '(0751) 70537',
            email: 'kemahasiswaan@unand.ac.id',
            website: 'www.unand.ac.id',
          },
        },
        surveyRules: [
          {
            id: '3',
            surveyId: '2',
            majorId: '1',
            major: mockMajors[0],
            degree: 'S1',
            targetRole: 'MANAGER',
            createdAt: '2024-01-20T14:30:00Z',
            updatedAt: '2024-01-20T14:30:00Z',
          },
        ],
      },
    ];
    setSurveys(mockSurveys);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'TRACER_STUDY':
        return 'bg-blue-100 text-blue-800';
      case 'USER_SURVEY':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'TRACER_STUDY':
        return 'Tracer Study';
      case 'USER_SURVEY':
        return 'User Survey';
      default:
        return type;
    }
  };

  const handleCreateSurvey = () => {
    setIsCreateSheetOpen(true);
  };

  const handleSaveNewSurvey = async () => {
    setLoading(true);
    try {
      const newSurvey: Survey = {
        id: Date.now().toString(),
        name: createFormData.name,
        type: createFormData.type,
        description: createFormData.description,
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        questionCount: 0,
        responseCount: 0,
        greetingOpening: {
          title: createFormData.type === 'USER_SURVEY' ? 'Survey Kepuasan Mahasiswa' : 'Tracer Study Lulusan Universitas Andalas',
          greeting: {
            islamic: "Assalaamu'alaikum warahmatullaahi wabarakatuh",
            general: 'Salam sejahtera untuk kita semua',
          },
          addressee: createFormData.type === 'USER_SURVEY' 
            ? 'Kepada Yth. Mahasiswa Universitas Andalas'
            : 'Kepada Yth. lulusan Universitas Andalas wisuda tahun 2023 Dimana saja berada.',
          introduction: createFormData.type === 'USER_SURVEY'
            ? 'Dalam rangka meningkatkan kualitas layanan dan pendidikan di Universitas Andalas, kami mengundang Anda untuk berpartisipasi dalam survey kepuasan mahasiswa.'
            : 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi (Kemendikbudristek) telah meluncurkan program "Merdeka Belajar" yang mencakup beberapa terobosan untuk meningkatkan kualitas pendidikan tinggi.',
          ikuList: {
            title: createFormData.type === 'USER_SURVEY' ? 'Aspek yang akan dievaluasi:' : 'Indikator Kinerja Utama (IKU) yang diukur:',
            items: createFormData.type === 'USER_SURVEY' 
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
          purpose: createFormData.type === 'USER_SURVEY'
            ? 'Survey ini bertujuan untuk mengumpulkan feedback dari mahasiswa guna meningkatkan kualitas layanan dan pendidikan di Universitas Andalas.'
            : 'Untuk mengukur kinerja tersebut, Perguruan Tinggi diwajibkan mengumpulkan data dari seluruh alumni yang telah lulus atau diwisuda dalam kurun waktu 1 tahun terakhir.',
          expectation: createFormData.type === 'USER_SURVEY'
            ? 'Partisipasi Anda sangat berharga untuk kemajuan kampus tercinta.'
            : 'Partisipasi seluruh alumni sangat diharapkan untuk mengumpulkan data dan masukan agar Unand menjadi lebih baik.',
          signOff: {
            department: createFormData.type === 'USER_SURVEY' ? 'Biro Kemahasiswaan dan Alumni' : 'Pusat Karir, Konseling, dan Tracer Study',
            university: 'Universitas Andalas',
          },
        },
        greetingClosing: {
          title: 'Terima Kasih',
          greeting: {
            islamic: "Wassalaamu'alaikum warahmatullaahi wabarakatuh",
            general: 'Salam sejahtera untuk kita semua',
          },
          addressee: createFormData.type === 'USER_SURVEY'
            ? 'Kepada Yth. Mahasiswa yang telah berpartisipasi'
            : 'Kepada Yth. lulusan Universitas Andalas yang telah berpartisipasi dalam survey ini.',
          introduction: createFormData.type === 'USER_SURVEY'
            ? 'Terima kasih atas partisipasi Anda dalam survey kepuasan mahasiswa ini.'
            : 'Terima kasih atas partisipasi Anda dalam mengisi survey Tracer Study ini. Data yang Anda berikan sangat berharga untuk meningkatkan kualitas pendidikan di Universitas Andalas.',
          expectation: createFormData.type === 'USER_SURVEY'
            ? 'Feedback Anda akan membantu kami meningkatkan kualitas layanan kampus.'
            : 'Kami berharap informasi yang telah Anda berikan dapat membantu kami dalam mengembangkan program studi dan layanan yang lebih baik untuk mahasiswa dan alumni di masa mendatang.',
          signOff: {
            department: createFormData.type === 'USER_SURVEY' ? 'Biro Kemahasiswaan dan Alumni' : 'Pusat Karir, Konseling, dan Tracer Study',
            university: 'Universitas Andalas',
          },
          contact: {
            phone: '(0751) 70537',
            email: createFormData.type === 'USER_SURVEY' ? 'kemahasiswaan@unand.ac.id' : 'tracer@unand.ac.id',
            website: 'www.unand.ac.id',
          },
        },
        surveyRules: [],
      };

      setSurveys((prev) => [...prev, newSurvey]);
      setCreateFormData({
        name: '',
        type: 'TRACER_STUDY',
        description: '',
      });
      setIsCreateSheetOpen(false);
    } catch (error) {
      console.error('Error creating survey:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSurvey = (survey: Survey) => {
    navigate(`/admin/survey/builder?type=${survey.type}&mode=edit&id=${survey.id}`);
  };

  const handleDeleteSurvey = async (surveyId: string) => {
    setLoading(true);
    try {
      setSurveys((prev) => prev.filter((s) => s.id !== surveyId));
    } catch (error) {
      console.error('Error deleting survey:', error);
    } finally {
      setLoading(false);
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
                  <BreadcrumbPage>Pengaturan Survey</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Button Create Survey */}
            <div className='flex items-center space-x-2'>
              <Button 
                onClick={handleCreateSurvey}
              >
                <Plus className='mr-2 h-4 w-4' />
                Buat Survey Baru
              </Button>
            </div>
          </div>
        </div>

        {/* Surveys Table */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2'>
              <Package className='h-5 w-5' />
              <span>Daftar Survey</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Survey</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rules</TableHead>
                  <TableHead>Soal</TableHead>
                  <TableHead>Respons</TableHead>
                  <TableHead>Tanggal Dibuat</TableHead>
                  <TableHead className='text-right'>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {surveys.map((survey) => (
                  <TableRow key={survey.id}>
                    <TableCell className='font-medium'>
                      <div>
                        <div className='font-medium'>{survey.name}</div>
                        <div className='text-sm text-gray-500'>{survey.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(survey.type)}>
                        {getTypeLabel(survey.type)}
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
                        <span>{survey.surveyRules?.length || 0} rules</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center space-x-2'>
                        <FileText className='h-4 w-4 text-muted-foreground' />
                        <span>{survey.questionCount} soal</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center space-x-2'>
                        <Users className='h-4 w-4 text-muted-foreground' />
                        <span>{survey.responseCount} respons</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center space-x-2'>
                        <Calendar className='h-4 w-4 text-muted-foreground' />
                        <span>
                          {new Date(survey.createdAt).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex items-center justify-end space-x-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => navigate(`/admin/survey/settings?id=${survey.id}&type=${survey.type}&name=${encodeURIComponent(survey.name)}`)}
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
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleDeleteSurvey(survey.id)}
                          disabled={loading}
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

        {/* Create Survey Sheet */}
        <Sheet open={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen}>
          <SheetContent className='w-[95vw] max-w-[800px] overflow-y-auto'>
            <SheetHeader>
              <SheetTitle>Buat Survey Baru</SheetTitle>
              <SheetDescription>
                Buat survey baru untuk Tracer Study atau User Survey
              </SheetDescription>
            </SheetHeader>

            <div className='px-4 space-y-6'>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='name' className='text-sm font-medium'>
                    Nama Survey *
                  </Label>
                  <Input
                    id='name'
                    value={createFormData.name}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder='Tracer Study Lulusan 2024'
                    className='text-sm'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='type' className='text-sm font-medium'>
                    Jenis Survey *
                  </Label>
                  <Select
                    value={createFormData.type}
                    onValueChange={(value: 'TRACER_STUDY' | 'USER_SURVEY') =>
                      setCreateFormData(prev => ({ ...prev, type: value }))
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
                  <Label htmlFor='description' className='text-sm font-medium'>
                    Deskripsi *
                  </Label>
                  <Textarea
                    id='description'
                    value={createFormData.description}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder='Deskripsi singkat tentang survey ini...'
                    rows={3}
                    className='text-sm'
                  />
                </div>
              </div>

              {/* Actions */}
              <div className='flex justify-end space-x-2'>
                <Button
                  variant='outline'
                  onClick={() => setIsCreateSheetOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSaveNewSurvey}
                  disabled={loading || !createFormData.name || !createFormData.description}
                >
                  {loading ? 'Menyimpan...' : 'Buat Survey'}
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
