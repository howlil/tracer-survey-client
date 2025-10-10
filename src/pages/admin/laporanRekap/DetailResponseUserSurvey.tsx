/** @format */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft, 
  Calendar,
  XCircle,
  Download,
  Search,
  Filter,
  ChevronDown
} from 'lucide-react';
import { AdminLayout } from '@/components/layout/admin';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

// Types berdasarkan Prisma schema
interface QuestionResponse {
  questionId: string;
  questionText: string;
  questionType: string;
  isRequired: boolean;
  isAnswered: boolean;
  sortOrder: number;
  answer: string;
  answerOptions?: AnswerOption[];
}

interface AnswerOption {
  id: string;
  optionText: string;
}

interface ManagerResponse {
  id: string;
  respondentId: string;
  fullName: string;
  email: string;
  company: string;
  position: string;
  submittedAt: string;
  totalQuestions: number;
  answeredQuestions: number;
  completionPercentage: number;
  responses: QuestionResponse[];
}

const DetailResponseUserSurvey: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const responseId = searchParams.get('id');

  const [response, setResponse] = useState<ManagerResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - replace with API call
  useEffect(() => {
    if (!responseId) return;

    // Simulate API call
    setTimeout(() => {
      const mockResponse: ManagerResponse = {
        id: responseId,
        respondentId: 'resp1',
        fullName: 'Budi Santoso',
        email: 'budi.santoso@company.com',
        company: 'PT. Teknologi Indonesia',
        position: 'HR Manager',
        submittedAt: '2024-01-15T10:30:00Z',
        totalQuestions: 20,
        answeredQuestions: 18,
        completionPercentage: 90,
        responses: [
          {
            questionId: 'q1',
            questionText: 'Bagaimana penilaian Anda terhadap kualitas lulusan Universitas Andalas?',
            questionType: 'SINGLE_CHOICE',
            isRequired: true,
            isAnswered: true,
            sortOrder: 1,
            answer: 'Sangat Baik',
            answerOptions: [
              { id: 'opt1', optionText: 'Sangat Baik' },
              { id: 'opt2', optionText: 'Baik' },
              { id: 'opt3', optionText: 'Cukup' },
              { id: 'opt4', optionText: 'Kurang' }
            ]
          },
          {
            questionId: 'q2',
            questionText: 'Apakah Anda pernah merekrut lulusan dari Universitas Andalas?',
            questionType: 'SINGLE_CHOICE',
            isRequired: true,
            isAnswered: true,
            sortOrder: 2,
            answer: 'Ya',
            answerOptions: [
              { id: 'opt1', optionText: 'Ya' },
              { id: 'opt2', optionText: 'Tidak' }
            ]
          },
          {
            questionId: 'q3',
            questionText: 'Berapa jumlah lulusan Universitas Andalas yang pernah Anda rekrut?',
            questionType: 'TEXT',
            isRequired: true,
            isAnswered: true,
            sortOrder: 3,
            answer: '15 orang'
          },
          {
            questionId: 'q4',
            questionText: 'Bagaimana tingkat kinerja lulusan Universitas Andalas di perusahaan Anda?',
            questionType: 'SCALE',
            isRequired: true,
            isAnswered: true,
            sortOrder: 4,
            answer: '8'
          },
          {
            questionId: 'q5',
            questionText: 'Aspek apa yang perlu ditingkatkan dari lulusan Universitas Andalas?',
            questionType: 'MULTIPLE_CHOICE',
            isRequired: false,
            isAnswered: true,
            sortOrder: 5,
            answer: 'Komunikasi, Leadership',
            answerOptions: [
              { id: 'opt1', optionText: 'Komunikasi' },
              { id: 'opt2', optionText: 'Leadership' },
              { id: 'opt3', optionText: 'Problem Solving' },
              { id: 'opt4', optionText: 'Teamwork' },
              { id: 'opt5', optionText: 'Technical Skills' }
            ]
          },
          {
            questionId: 'q6',
            questionText: 'Apakah Anda akan merekrut lulusan Universitas Andalas lagi di masa depan?',
            questionType: 'SINGLE_CHOICE',
            isRequired: true,
            isAnswered: false,
            sortOrder: 6,
            answer: '',
            answerOptions: [
              { id: 'opt1', optionText: 'Ya, pasti' },
              { id: 'opt2', optionText: 'Mungkin' },
              { id: 'opt3', optionText: 'Tidak' }
            ]
          }
        ]
      };

      setResponse(mockResponse);
      setLoading(false);
    }, 1000);
  }, [responseId]);


  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'SINGLE_CHOICE': return 'Pilihan Tunggal';
      case 'MULTIPLE_CHOICE': return 'Pilihan Ganda';
      case 'TEXT': return 'Teks';
      case 'SCALE': return 'Skala';
      case 'DATE': return 'Tanggal';
      default: return type.replace('_', ' ');
    }
  };

  const handleExport = () => {
    // Implement export functionality
    toast.success('Data berhasil diekspor');
  };

  const getFilteredResponses = () => {
    if (!response) return [];
    
    let filtered = response.responses;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by question type
    if (filterType !== 'all') {
      filtered = filtered.filter(q => q.questionType === filterType);
    }
    
    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(q => 
        filterStatus === 'answered' ? q.isAnswered : !q.isAnswered
      );
    }
    
    return filtered;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterStatus('all');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Memuat data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!response) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Data tidak ditemukan</h3>
            <p className="text-muted-foreground mb-4">Response dengan ID tersebut tidak ditemukan.</p>
            <Button onClick={() => navigate('/admin/reports/user-survey')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Rekap
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/reports/user-survey">Rekap User Survey</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Detail Response</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/reports/user-survey')}
              className="hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Detail Response User Survey</h1>
              <p className="text-sm text-gray-500">
                Detail soal dan jawaban dari <span className="font-medium text-gray-700">{response.fullName}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="px-2 py-1 text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(response.submittedAt).toLocaleDateString('id-ID')}
            </Badge>
            <Button onClick={handleExport} size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Manager Info */}
        <div className="bg-white border border-gray-200 rounded-lg mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Informasi Manager</h2>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">{response.completionPercentage}%</div>
                <div className="text-xs text-gray-500">Kelengkapan</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Nama Lengkap</div>
                <p className="font-medium text-gray-900">{response.fullName}</p>
              </div>

              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Email</div>
                <p className="font-medium text-gray-900">{response.email}</p>
              </div>

              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Perusahaan</div>
                <p className="font-medium text-gray-900">{response.company}</p>
              </div>

              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Posisi</div>
                <p className="font-medium text-gray-900">{response.position}</p>
              </div>

              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Tanggal Submit</div>
                <p className="font-medium text-gray-900">{new Date(response.submittedAt).toLocaleDateString('id-ID')}</p>
              </div>

              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Progress</div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        response.completionPercentage === 100 ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${response.completionPercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    {response.answeredQuestions}/{response.totalQuestions}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white border border-gray-200 rounded-lg mb-6">
          <div className="p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari pertanyaan atau jawaban..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filter
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
              <div className="text-sm text-gray-600">
                {getFilteredResponses().length} dari {response.responses.length} pertanyaan
              </div>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Filter</h3>
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Reset Filter
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Tipe Pertanyaan</Label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Semua Tipe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Tipe</SelectItem>
                        <SelectItem value="SINGLE_CHOICE">Pilihan Tunggal</SelectItem>
                        <SelectItem value="MULTIPLE_CHOICE">Pilihan Ganda</SelectItem>
                        <SelectItem value="TEXT">Teks</SelectItem>
                        <SelectItem value="SCALE">Skala</SelectItem>
                        <SelectItem value="DATE">Tanggal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Status Jawaban</Label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Semua Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="answered">Sudah Dijawab</SelectItem>
                        <SelectItem value="unanswered">Belum Dijawab</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Responses */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Respons Pertanyaan</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {getFilteredResponses().map((questionResponse) => (
                <div key={questionResponse.questionId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-6 w-6 bg-gray-100 rounded flex items-center justify-center text-gray-600 font-medium text-sm">
                        {questionResponse.sortOrder}
                      </div>
                      <div className="flex items-center space-x-2">
                        {questionResponse.isRequired && (
                          <span className="text-red-500 text-xs">*</span>
                        )}
                        <Badge
                          variant={questionResponse.isAnswered ? 'default' : 'outline'}
                          className={`text-xs ${
                            questionResponse.isAnswered 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {questionResponse.isAnswered ? 'Terjawab' : 'Belum Dijawab'}
                        </Badge>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {getQuestionTypeLabel(questionResponse.questionType)}
                    </Badge>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-3">{questionResponse.questionText}</h4>
                  
                  {questionResponse.isAnswered ? (
                    <div className="bg-gray-50 p-3 rounded border">
                      <div className="text-sm text-gray-600 mb-1">Jawaban:</div>
                      <p className="text-gray-900 font-medium">
                        {questionResponse.answer}
                      </p>
                    </div>
                  ) : (
                    <div className="text-gray-400 italic">
                      Tidak ada jawaban
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DetailResponseUserSurvey;
