/** @format */

import React, {useState} from 'react';
import {AdminLayout} from '@/components/layout/admin';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
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
  TrendingUp,
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
import {useNavigate} from 'react-router-dom';
import {
  useTracerStudyResponses,
  useExportTracerStudyResponses,
  type TracerStudyResponse,
} from '@/api/response.api';
import {useFaculties, useMajors} from '@/api/major-faculty.api';
import {CustomPagination} from '@/components/ui/pagination';
import {toast} from 'sonner';

interface FilterData {
  facultyId: string;
  majorId: string;
  graduatedYear: string;
  graduatePeriode: string;
  degree: string;
  searchTerm: string;
}

const RekapTracerStudy: React.FC = () => {
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter state
  const [filters, setFilters] = useState<FilterData>({
    facultyId: 'all',
    majorId: 'all',
    graduatedYear: 'all',
    graduatePeriode: 'all',
    degree: 'all',
    searchTerm: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // API hooks
  const {data: responsesData, isLoading: isLoadingResponses} =
    useTracerStudyResponses({
      page: currentPage,
      limit: itemsPerPage,
      search: filters.searchTerm || undefined,
      facultyId:
        filters.facultyId && filters.facultyId !== 'all'
          ? filters.facultyId
          : undefined,
      majorId:
        filters.majorId && filters.majorId !== 'all'
          ? filters.majorId
          : undefined,
      graduatedYear:
        filters.graduatedYear && filters.graduatedYear !== 'all'
          ? parseInt(filters.graduatedYear)
          : undefined,
      graduatePeriode:
        filters.graduatePeriode && filters.graduatePeriode !== 'all'
          ? filters.graduatePeriode
          : undefined,
      degree:
        filters.degree && filters.degree !== 'all' ? filters.degree : undefined,
    });

  const {data: facultiesData = []} = useFaculties();
  const {data: majorsData = []} = useMajors(
    filters.facultyId && filters.facultyId !== 'all'
      ? filters.facultyId
      : undefined
  );

  const exportMutation = useExportTracerStudyResponses();

  const responses = responsesData?.responses || [];
  const meta = responsesData?.meta || {
    total: 0,
    limit: itemsPerPage,
    page: currentPage,
    totalPages: 0,
  };

  const faculties = facultiesData;
  const majors = majorsData;

  const handleFilterChange = (field: keyof FilterData, value: string) => {
    setFilters((prev) => ({...prev, [field]: value}));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      facultyId: 'all',
      majorId: 'all',
      graduatedYear: 'all',
      graduatePeriode: 'all',
      degree: 'all',
      searchTerm: '',
    });
    setCurrentPage(1);
  };

  const handleExport = async (format: 'excel' | 'pdf' = 'excel') => {
    try {
      const blob = await exportMutation.mutateAsync({
        format,
        search: filters.searchTerm || undefined,
        facultyId:
          filters.facultyId && filters.facultyId !== 'all'
            ? filters.facultyId
            : undefined,
        majorId:
          filters.majorId && filters.majorId !== 'all'
            ? filters.majorId
            : undefined,
        graduatedYear:
          filters.graduatedYear && filters.graduatedYear !== 'all'
            ? parseInt(filters.graduatedYear)
            : undefined,
        graduatePeriode:
          filters.graduatePeriode && filters.graduatePeriode !== 'all'
            ? filters.graduatePeriode
            : undefined,
        degree:
          filters.degree && filters.degree !== 'all'
            ? filters.degree
            : undefined,
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tracer-study-responses-${
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

  const handleViewDetail = (response: TracerStudyResponse) => {
    navigate(`/admin/reports/tracer-study/detail/${response.id}`);
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

  const getFilteredMajors = () => {
    if (!filters.facultyId || filters.facultyId === 'all') return majors;
    return majors.filter((m) => m.faculty.id === filters.facultyId);
  };

  const getGraduateYears = () => {
    const years = [...new Set(responses.map((r) => r.graduatedYear))];
    return years.sort((a, b) => b - a);
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
                    <BarChart3 className='h-4 w-4' />
                    <span>Dashboard</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    onClick={() => navigate('/admin/reports')}
                    className='flex items-center space-x-1 cursor-pointer hover:text-primary'
                  >
                    <TrendingUp className='h-4 w-4' />
                    <span>Laporan & Rekap</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Rekap Tracer Study</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Button Export */}
            <Button
              onClick={() => handleExport('excel')}
              disabled={exportMutation.isPending}
            >
              <Download className='mr-2 h-4 w-4' />
              {exportMutation.isPending ? 'Exporting...' : 'Export Data'}
            </Button>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-6'>
          <Card className='border-0 shadow-sm hover:shadow-md transition-shadow'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Total Alumni
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
                      responses.filter(
                        (r: TracerStudyResponse) => r.submittedAt
                      ).length
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
                        (r: TracerStudyResponse) => !r.submittedAt
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
                            (sum: number, r: TracerStudyResponse) =>
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
        <div className='flex items-center justify-between gap-4 mb-6'>
          <div className='flex items-center gap-4 flex-1'>
            <div className='relative flex-1 max-w-md'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Cari alumni...'
                value={filters.searchTerm}
                onChange={(e) =>
                  handleFilterChange('searchTerm', e.target.value)
                }
                className='pl-10'
              />
            </div>
            <Button
              variant='outline'
              onClick={() => setShowFilters(!showFilters)}
              className='flex items-center gap-2'
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
            className='text-sm'
          >
            {meta.total} data
          </Badge>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <Card className='border-0 shadow-sm mb-6'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold'>Filter Lanjutan</h3>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={clearFilters}
                  className='text-muted-foreground'
                >
                  <XCircle className='h-4 w-4 mr-2' />
                  Reset Filter
                </Button>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'>
                {/* Faculty */}
                <div className='space-y-2'>
                  <Label
                    htmlFor='faculty'
                    className='text-sm font-medium'
                  >
                    Fakultas
                  </Label>
                  <Select
                    value={filters.facultyId}
                    onValueChange={(value) =>
                      handleFilterChange('facultyId', value)
                    }
                  >
                    <SelectTrigger className='h-10'>
                      <SelectValue placeholder='Semua Fakultas' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>Semua Fakultas</SelectItem>
                      {faculties.map((faculty) => (
                        <SelectItem
                          key={faculty.id}
                          value={faculty.id}
                        >
                          {faculty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Major */}
                <div className='space-y-2'>
                  <Label
                    htmlFor='major'
                    className='text-sm font-medium'
                  >
                    Jurusan
                  </Label>
                  <Select
                    value={filters.majorId}
                    onValueChange={(value) =>
                      handleFilterChange('majorId', value)
                    }
                  >
                    <SelectTrigger className='h-10'>
                      <SelectValue placeholder='Semua Jurusan' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>Semua Jurusan</SelectItem>
                      {getFilteredMajors().map((major) => (
                        <SelectItem
                          key={major.id}
                          value={major.id}
                        >
                          {major.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Graduated Year */}
                <div className='space-y-2'>
                  <Label
                    htmlFor='year'
                    className='text-sm font-medium'
                  >
                    Tahun Lulus
                  </Label>
                  <Select
                    value={filters.graduatedYear}
                    onValueChange={(value) =>
                      handleFilterChange('graduatedYear', value)
                    }
                  >
                    <SelectTrigger className='h-10'>
                      <SelectValue placeholder='Semua Tahun' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>Semua Tahun</SelectItem>
                      {getGraduateYears().map((year) => (
                        <SelectItem
                          key={year}
                          value={year.toString()}
                        >
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Graduate Periode */}
                <div className='space-y-2'>
                  <Label
                    htmlFor='periode'
                    className='text-sm font-medium'
                  >
                    Periode Wisuda
                  </Label>
                  <Select
                    value={filters.graduatePeriode}
                    onValueChange={(value) =>
                      handleFilterChange('graduatePeriode', value)
                    }
                  >
                    <SelectTrigger className='h-10'>
                      <SelectValue placeholder='Semua Periode' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>Semua Periode</SelectItem>
                      <SelectItem value='WISUDA_I'>Wisuda I</SelectItem>
                      <SelectItem value='WISUDA_II'>Wisuda II</SelectItem>
                      <SelectItem value='WISUDA_III'>Wisuda III</SelectItem>
                      <SelectItem value='WISUDA_IV'>Wisuda IV</SelectItem>
                      <SelectItem value='WISUDA_V'>Wisuda V</SelectItem>
                      <SelectItem value='WISUDA_VI'>Wisuda VI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Degree */}
                <div className='space-y-2'>
                  <Label
                    htmlFor='degree'
                    className='text-sm font-medium'
                  >
                    Tingkat
                  </Label>
                  <Select
                    value={filters.degree}
                    onValueChange={(value) =>
                      handleFilterChange('degree', value)
                    }
                  >
                    <SelectTrigger className='h-10'>
                      <SelectValue placeholder='Semua Tingkat' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>Semua Tingkat</SelectItem>
                      <SelectItem value='S1'>S1</SelectItem>
                      <SelectItem value='PASCA'>Pascasarjana</SelectItem>
                      <SelectItem value='PROFESI'>Profesi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Responses Table */}
        <Card className='border-0 shadow-sm'>
          <CardHeader className='pb-4'>
            <div className='flex items-center justify-between'>
              <CardTitle className='flex items-center space-x-2'>
                <FileText className='h-5 w-5 text-primary' />
                <span>Data Respons Alumni</span>
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
                    <TableHead className='font-semibold'>Nama Alumni</TableHead>
                    <TableHead className='font-semibold'>NIM</TableHead>
                    <TableHead className='font-semibold'>
                      Fakultas/Jurusan
                    </TableHead>
                    <TableHead className='font-semibold'>Tahun Lulus</TableHead>
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
                        colSpan={7}
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
                        colSpan={7}
                        className='text-center py-8 text-muted-foreground'
                      >
                        Tidak ada data respons
                      </TableCell>
                    </TableRow>
                  ) : (
                    responses.map((response: TracerStudyResponse) => (
                      <TableRow key={response.id}>
                        <TableCell>
                          <div>
                            <div className='font-medium'>
                              {response.fullName}
                            </div>
                            <div className='text-sm text-muted-foreground'>
                              {response.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant='outline'>{response.nim}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className='text-sm font-medium'>
                              {response.major.majorName}
                            </div>
                            <div className='text-xs text-muted-foreground'>
                              {response.major.faculty.facultyName}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className='text-sm'>
                              {response.graduatedYear}
                            </div>
                            <div className='text-xs text-muted-foreground'>
                              {response.graduatePeriode.replace(
                                'WISUDA_',
                                'Wisuda '
                              )}
                            </div>
                          </div>
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

export default RekapTracerStudy;
