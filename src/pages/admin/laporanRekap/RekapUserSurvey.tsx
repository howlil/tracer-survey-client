/** @format */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Download,
  BarChart3,
  Filter,
  Eye,
  Calendar,
  User,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  ChevronDown,
} from 'lucide-react';
import { AdminLayout } from '@/components/layout/admin';
import { useNavigate } from 'react-router-dom';

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

interface FilterData {
  searchTerm: string;
  company: string;
  position: string;
}

const RekapUserSurvey: React.FC = () => {
  const navigate = useNavigate();

  // State management
  const [responses, setResponses] = useState<ManagerResponse[]>([]);
  const [filteredResponses, setFilteredResponses] = useState<ManagerResponse[]>([]);

  // Filter state
  const [filters, setFilters] = useState<FilterData>({
    searchTerm: '',
    company: 'all',
    position: 'all',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - replace with API calls
  useEffect(() => {
    const mockResponses: ManagerResponse[] = [
      {
        id: '1',
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
          }
        ]
      },
      {
        id: '2',
        respondentId: 'resp2',
        fullName: 'Siti Rahayu',
        email: 'siti.rahayu@company.com',
        company: 'PT. Global Solutions',
        position: 'Recruitment Specialist',
        submittedAt: '2024-01-16T14:20:00Z',
        totalQuestions: 20,
        answeredQuestions: 15,
        completionPercentage: 75,
        responses: []
      },
      {
        id: '3',
        respondentId: 'resp3',
        fullName: 'Ahmad Wijaya',
        email: 'ahmad.wijaya@company.com',
        company: 'PT. Teknologi Indonesia',
        position: 'HR Director',
        submittedAt: '',
        totalQuestions: 20,
        answeredQuestions: 5,
        completionPercentage: 25,
        responses: []
      }
    ];

    setResponses(mockResponses);
    setFilteredResponses(mockResponses);
  }, []);

  // Filter responses
  useEffect(() => {
    let filtered = responses;

    if (filters.searchTerm) {
      filtered = filtered.filter(r =>
        r.fullName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        r.email.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        r.company.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    if (filters.company && filters.company !== 'all') {
      filtered = filtered.filter(r => r.company === filters.company);
    }

    if (filters.position && filters.position !== 'all') {
      filtered = filtered.filter(r => r.position === filters.position);
    }

    setFilteredResponses(filtered);
  }, [responses, filters]);

  const handleFilterChange = (field: keyof FilterData, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      company: 'all',
      position: 'all',
    });
  };

  const handleViewDetail = (response: ManagerResponse) => {
    navigate(`/admin/reports/user-survey/detail?id=${response.id}`);
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage === 100) return 'bg-green-100 text-green-800';
    if (percentage >= 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getCompletionIcon = (percentage: number) => {
    if (percentage === 100) return <CheckCircle className="h-4 w-4" />;
    if (percentage >= 80) return <Clock className="h-4 w-4" />;
    return <XCircle className="h-4 w-4" />;
  };

  const getCompanies = () => {
    const companies = [...new Set(responses.map(r => r.company))];
    return companies.sort();
  };

  const getPositions = () => {
    const positions = [...new Set(responses.map(r => r.position))];
    return positions.sort();
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Rekap User Survey</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Manager</p>
                  <p className="text-3xl font-bold text-blue-600">{filteredResponses.length}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sudah Mengisi</p>
                  <p className="text-3xl font-bold text-green-600">
                    {filteredResponses.filter(r => r.submittedAt).length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Belum Selesai</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {filteredResponses.filter(r => !r.submittedAt).length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rata-rata Kelengkapan</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {filteredResponses.length > 0
                      ? Math.round(
                          filteredResponses.reduce((sum, r) => sum + r.completionPercentage, 0) /
                            filteredResponses.length
                        )
                      : 0}%
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari manager..."
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                  className="pl-10 h-11 border-gray-300 focus:border-primary focus:ring-primary"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 h-11 px-4 border-gray-300 hover:bg-gray-50"
              >
                <Filter className="h-4 w-4" />
                Filter
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            <Badge variant="secondary" className="px-3 py-1 bg-gray-100 text-gray-700">
              {filteredResponses.length} data
            </Badge>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filter Lanjutan</h3>
                <Button variant="outline" size="sm" onClick={clearFilters} className="text-gray-600 hover:text-gray-900">
                  <XCircle className="h-4 w-4 mr-2" />
                  Reset Filter
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Company */}
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-medium text-gray-700">Perusahaan</Label>
                  <Select
                    value={filters.company}
                    onValueChange={(value) => handleFilterChange('company', value)}
                  >
                    <SelectTrigger className="h-10 border-gray-300">
                      <SelectValue placeholder="Semua Perusahaan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Perusahaan</SelectItem>
                      {getCompanies().map((company) => (
                        <SelectItem key={company} value={company}>
                          {company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Position */}
                <div className="space-y-2">
                  <Label htmlFor="position" className="text-sm font-medium text-gray-700">Posisi</Label>
                  <Select
                    value={filters.position}
                    onValueChange={(value) => handleFilterChange('position', value)}
                  >
                    <SelectTrigger className="h-10 border-gray-300">
                      <SelectValue placeholder="Semua Posisi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Posisi</SelectItem>
                      {getPositions().map((position) => (
                        <SelectItem key={position} value={position}>
                          {position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Responses Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>Data Respons Manager</span>
              </CardTitle>
              <Badge variant="secondary" className="text-sm">
                {filteredResponses.length} data
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead className="font-semibold">Nama Manager</TableHead>
                    <TableHead className="font-semibold">Perusahaan</TableHead>
                    <TableHead className="font-semibold">Posisi</TableHead>
                    <TableHead className="font-semibold">Kelengkapan</TableHead>
                    <TableHead className="font-semibold">Tanggal Submit</TableHead>
                    <TableHead className="text-right font-semibold">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResponses.map((response) => (
                    <TableRow key={response.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <p className="font-medium">{response.fullName}</p>
                          <p className="text-sm text-muted-foreground">{response.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{response.company}</p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{response.position}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getCompletionIcon(response.completionPercentage)}
                          <Badge className={getCompletionColor(response.completionPercentage)}>
                            {response.completionPercentage}%
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {response.answeredQuestions}/{response.totalQuestions} soal
                        </div>
                      </TableCell>
                      <TableCell>
                        {response.submittedAt ? (
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {new Date(response.submittedAt).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-orange-600">
                            Belum Submit
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetail(response)}
                          className="hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Lihat Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default RekapUserSurvey;