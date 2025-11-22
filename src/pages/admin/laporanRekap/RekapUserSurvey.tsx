/** @format */

import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
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
import {Badge} from '@/components/ui/badge';
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
import {AdminLayout} from '@/components/layout/admin';
import {useNavigate} from 'react-router-dom';
import {
  useUserSurveyResponses,
  useExportUserSurveyResponses,
  type UserSurveyResponse,
} from '@/api/response.api';
import {useCompanies, usePositions} from '@/api/manager.api';
import {CustomPagination} from '@/components/ui/pagination';
import {toast} from 'sonner';

interface FilterData {
  searchTerm: string;
  company: string;
  position: string;
}

const RekapUserSurvey: React.FC = () => {
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter state
  const [filters, setFilters] = useState<FilterData>({
    searchTerm: '',
    company: 'all',
    position: 'all',
  });
  const [showFilters, setShowFilters] = useState(false);

  // API hooks
  const {data: responsesData, isLoading: isLoadingResponses} =
    useUserSurveyResponses({
      page: currentPage,
      limit: itemsPerPage,
      search: filters.searchTerm || undefined,
      company:
        filters.company && filters.company !== 'all'
          ? filters.company
          : undefined,
      position:
        filters.position && filters.position !== 'all'
          ? filters.position
          : undefined,
    });

  const {data: companiesData = []} = useCompanies();
  const {data: positionsData = []} = usePositions();

  const exportMutation = useExportUserSurveyResponses();

  const responses = responsesData?.responses || [];
  const meta = responsesData?.meta || {
    total: 0,
    limit: itemsPerPage,
    page: currentPage,
    totalPages: 0,
  };

  const companies = companiesData;
  const positions = positionsData;

  const handleFilterChange = (field: keyof FilterData, value: string) => {
    setFilters((prev) => ({...prev, [field]: value}));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      company: 'all',
      position: 'all',
    });
    setCurrentPage(1);
  };

  const handleExport = async (format: 'excel' | 'pdf' = 'excel') => {
    try {
      const blob = await exportMutation.mutateAsync({
        format,
        search: filters.searchTerm || undefined,
        company:
          filters.company && filters.company !== 'all'
            ? filters.company
            : undefined,
        position:
          filters.position && filters.position !== 'all'
            ? filters.position
            : undefined,
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `user-survey-responses-${
        new Date().toISOString().split('T')[0]
      }.${format === 'excel' ? 'xlsx' : 'pdf'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Data berhasil diekspor');
    } catch {
      toast.error('Gagal mengekspor data');
    }
  };

  const handleViewDetail = (response: UserSurveyResponse) => {
    navigate(`/admin/reports/user-survey/detail/${response.id}`);
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage === 100) return 'bg-green-100 text-green-800';
    if (percentage >= 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getCompletionIcon = (percentage: number) => {
    if (percentage === 100) return <CheckCircle className='h-4 w-4' />;
    if (percentage >= 80) return <Clock className='h-4 w-4' />;
    return <XCircle className='h-4 w-4' />;
  };

  return (
    <AdminLayout>
      <div className='p-6 space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href='/admin/dashboard'>
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Rekap User Survey</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <Button
            className='bg-primary hover:bg-primary/90'
            onClick={() => handleExport('excel')}
            disabled={exportMutation.isPending}
          >
            <Download className='mr-2 h-4 w-4' />
            {exportMutation.isPending ? 'Exporting...' : 'Export Data'}
          </Button>
        </div>

        {/* Summary Statistics */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-6'>
          <Card className='border-0 shadow-sm hover:shadow-md transition-shadow'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Total Manager
                  </p>
                  <p className='text-3xl font-bold text-blue-600'>
                    {meta.total}
                  </p>
                </div>
                <div className='h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center'>
                  <User className='h-6 w-6 text-blue-600' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='border-0 shadow-sm hover:shadow-md transition-shadow'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Sudah Mengisi
                  </p>
                  <p className='text-3xl font-bold text-green-600'>
                    {
                      responses.filter((r: UserSurveyResponse) => r.submittedAt)
                        .length
                    }
                  </p>
                </div>
                <div className='h-12 w-12 bg-green-100 rounded-full flex items-center justify-center'>
                  <CheckCircle className='h-6 w-6 text-green-600' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='border-0 shadow-sm hover:shadow-md transition-shadow'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Belum Selesai
                  </p>
                  <p className='text-3xl font-bold text-yellow-600'>
                    {
                      responses.filter(
                        (r: UserSurveyResponse) => !r.submittedAt
                      ).length
                    }
                  </p>
                </div>
                <div className='h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center'>
                  <Clock className='h-6 w-6 text-yellow-600' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='border-0 shadow-sm hover:shadow-md transition-shadow'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Rata-rata Kelengkapan
                  </p>
                  <p className='text-3xl font-bold text-purple-600'>
                    {responses.length > 0
                      ? Math.round(
                          responses.reduce(
                            (sum: number, r: UserSurveyResponse) =>
                              sum + r.completionPercentage,
                            0
                          ) / responses.length
                        )
                      : 0}
                    %
                  </p>
                </div>
                <div className='h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center'>
                  <BarChart3 className='h-6 w-6 text-purple-600' />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Section */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-4 flex-1'>
              <div className='relative flex-1 max-w-md'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                <Input
                  placeholder='Cari manager...'
                  value={filters.searchTerm}
                  onChange={(e) =>
                    handleFilterChange('searchTerm', e.target.value)
                  }
                  className='pl-10 h-11 border-gray-300 focus:border-primary focus:ring-primary'
                />
              </div>
              <Button
                variant='outline'
                onClick={() => setShowFilters(!showFilters)}
                className='flex items-center gap-2 h-11 px-4 border-gray-300 hover:bg-gray-50'
              >
                <Filter className='h-4 w-4' />
                Filter
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    showFilters ? 'rotate-180' : ''
                  }`}
                />
              </Button>
            </div>
            <Badge
              variant='secondary'
              className='px-3 py-1 bg-gray-100 text-gray-700'
            >
              {meta.total} data
            </Badge>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className='mt-6 pt-6 border-t border-gray-200'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  Filter Lanjutan
                </h3>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={clearFilters}
                  className='text-gray-600 hover:text-gray-900'
                >
                  <XCircle className='h-4 w-4 mr-2' />
                  Reset Filter
                </Button>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Company */}
                <div className='space-y-2'>
                  <Label
                    htmlFor='company'
                    className='text-sm font-medium text-gray-700'
                  >
                    Perusahaan
                  </Label>
                  <Select
                    value={filters.company}
                    onValueChange={(value) =>
                      handleFilterChange('company', value)
                    }
                  >
                    <SelectTrigger className='h-10 border-gray-300'>
                      <SelectValue placeholder='Semua Perusahaan' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>Semua Perusahaan</SelectItem>
                      {companies.map((companyData) => (
                        <SelectItem
                          key={companyData.company}
                          value={companyData.company}
                        >
                          {companyData.company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Position */}
                <div className='space-y-2'>
                  <Label
                    htmlFor='position'
                    className='text-sm font-medium text-gray-700'
                  >
                    Posisi
                  </Label>
                  <Select
                    value={filters.position}
                    onValueChange={(value) =>
                      handleFilterChange('position', value)
                    }
                  >
                    <SelectTrigger className='h-10 border-gray-300'>
                      <SelectValue placeholder='Semua Posisi' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>Semua Posisi</SelectItem>
                      {positions.map((positionData) => (
                        <SelectItem
                          key={positionData.position}
                          value={positionData.position}
                        >
                          {positionData.position}
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
        <Card className='border-0 shadow-sm'>
          <CardHeader className='pb-4'>
            <div className='flex items-center justify-between'>
              <CardTitle className='flex items-center space-x-2'>
                <FileText className='h-5 w-5 text-primary' />
                <span>Data Respons Manager</span>
              </CardTitle>
              <Badge
                variant='secondary'
                className='text-sm'
              >
                {meta.total} data
              </Badge>
            </div>
          </CardHeader>
          <CardContent className='p-0'>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow className='border-b'>
                    <TableHead className='font-semibold'>
                      Nama Manager
                    </TableHead>
                    <TableHead className='font-semibold'>Perusahaan</TableHead>
                    <TableHead className='font-semibold'>Posisi</TableHead>
                    <TableHead className='font-semibold'>Kelengkapan</TableHead>
                    <TableHead className='font-semibold'>
                      Tanggal Submit
                    </TableHead>
                    <TableHead className='text-right font-semibold'>
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingResponses ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className='text-center py-8'
                      >
                        <div className='flex items-center justify-center'>
                          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3'></div>
                          <span className='text-muted-foreground'>
                            Memuat data...
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : responses.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className='text-center py-8 text-muted-foreground'
                      >
                        Tidak ada data respons
                      </TableCell>
                    </TableRow>
                  ) : (
                    responses.map((response: UserSurveyResponse) => (
                      <TableRow
                        key={response.id}
                        className='hover:bg-muted/50'
                      >
                        <TableCell>
                          <div>
                            <p className='font-medium'>{response.fullName}</p>
                            <p className='text-sm text-muted-foreground'>
                              {response.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className='font-medium'>{response.company}</p>
                        </TableCell>
                        <TableCell>
                          <p className='font-medium'>{response.position}</p>
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center space-x-2'>
                            {getCompletionIcon(response.completionPercentage)}
                            <Badge
                              className={getCompletionColor(
                                response.completionPercentage
                              )}
                            >
                              {response.completionPercentage}%
                            </Badge>
                          </div>
                          <div className='text-xs text-muted-foreground mt-1'>
                            {response.answeredQuestions}/
                            {response.totalQuestions} soal
                          </div>
                        </TableCell>
                        <TableCell>
                          {response.submittedAt ? (
                            <div className='flex items-center space-x-2'>
                              <Calendar className='h-4 w-4 text-muted-foreground' />
                              <span className='text-sm'>
                                {new Date(
                                  response.submittedAt
                                ).toLocaleDateString('id-ID')}
                              </span>
                            </div>
                          ) : (
                            <Badge
                              variant='outline'
                              className='text-orange-600'
                            >
                              Belum Submit
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className='text-right'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleViewDetail(response)}
                            className='hover:bg-primary hover:text-primary-foreground transition-colors'
                          >
                            <Eye className='h-4 w-4 mr-2' />
                            Lihat Detail
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className='p-4 border-t'>
              <CustomPagination
                currentPage={currentPage}
                totalPages={meta.totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default RekapUserSurvey;
