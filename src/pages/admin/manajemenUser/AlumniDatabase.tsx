/** @format */

import {AdminLayout} from '@/components/layout/admin/AdminLayout';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
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
import {CustomPagination} from '@/components/ui/pagination';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Search,
  Filter,
  Users,
  Calendar,
  BookOpen,
  Award,
  Building,
  UserCheck,
} from 'lucide-react';
import * as React from 'react';
import {useNavigate} from 'react-router-dom';
import {useAlumni} from '@/api/alumni.api';
import {useFaculties, useMajors} from '@/api/major-faculty.api';

function AlumniDatabase() {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = React.useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedFaculty, setSelectedFaculty] = React.useState<string>('');
  const [selectedMajor, setSelectedMajor] = React.useState<string>('');
  const [selectedDegree, setSelectedDegree] = React.useState<string>('');
  const [selectedGraduatedYear, setSelectedGraduatedYear] =
    React.useState<string>('');
  const [selectedPeriode, setSelectedPeriode] = React.useState<string>('');

  // Pagination states
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  // API hooks
  const {data: alumniData, isLoading: isLoadingAlumni} = useAlumni({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery || undefined,
    facultyId:
      selectedFaculty && selectedFaculty !== 'all'
        ? selectedFaculty
        : undefined,
    majorId:
      selectedMajor && selectedMajor !== 'all' ? selectedMajor : undefined,
    degree:
      selectedDegree && selectedDegree !== 'all' ? selectedDegree : undefined,
    graduatedYear:
      selectedGraduatedYear && selectedGraduatedYear !== 'all'
        ? parseInt(selectedGraduatedYear)
        : undefined,
    graduatePeriode:
      selectedPeriode && selectedPeriode !== 'all'
        ? selectedPeriode
        : undefined,
  });

  const {data: faculties = []} = useFaculties();
  const {data: allMajors = []} = useMajors();

  const alumni = alumniData?.alumni || [];
  const meta = alumniData?.meta || {
    total: 0,
    limit: itemsPerPage,
    page: currentPage,
    totalPages: 0,
  };

  // Get unique years for filter (from current data)
  const graduatedYears = React.useMemo(() => {
    const years = [...new Set(alumni.map((a) => a.graduatedYear))].sort(
      (a, b) => b - a
    );
    return years;
  }, [alumni]);

  // Get majors filtered by faculty
  const filteredMajors = React.useMemo(() => {
    if (!selectedFaculty || selectedFaculty === 'all') return allMajors;
    return allMajors.filter((major) => major.faculty.id === selectedFaculty);
  }, [selectedFaculty, allMajors]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedFaculty('');
    setSelectedMajor('');
    setSelectedDegree('');
    setSelectedGraduatedYear('');
    setSelectedPeriode('');
  };

  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <AdminLayout>
      <div className='p-6 space-y-6'>
        {/* Header */}
        <div className='mb-6 relative'>
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => navigate('/admin/dashboard')}
                  className='flex items-center space-x-1 cursor-pointer hover:text-primary'
                >
                  <UserCheck className='h-4 w-4' />
                  <span>Manajemen User</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Database Alumni</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Total Alumni
                  </p>
                  <p className='text-2xl font-bold text-foreground'>
                    {alumni.length}
                  </p>
                </div>
                <Users className='h-8 w-8 text-primary' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Tahun Ini
                  </p>
                  <p className='text-2xl font-bold text-foreground'>
                    {
                      alumni.filter(
                        (a) => a.graduatedYear === new Date().getFullYear()
                      ).length
                    }
                  </p>
                </div>
                <Calendar className='h-8 w-8 text-primary' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Program Studi
                  </p>
                  <p className='text-2xl font-bold text-foreground'>
                    {allMajors.length}
                  </p>
                </div>
                <BookOpen className='h-8 w-8 text-primary' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Fakultas
                  </p>
                  <p className='text-2xl font-bold text-foreground'>
                    {faculties.length}
                  </p>
                </div>
                <Building className='h-8 w-8 text-primary' />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Controls */}
        <div className='space-y-4'>
          {/* Search Bar with Filter Toggle */}
          <div className='flex items-center gap-3'>
            <div className='relative flex-1'>
              <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground' />
              <Input
                id='search'
                placeholder='Cari berdasarkan nama, NIM, atau email...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-12 h-12 text-base border border-border/50 bg-background focus:border-primary transition-all duration-200 rounded-xl'
              />
            </div>
            <Button
              onClick={toggleFilters}
              variant={showFilters ? 'default' : 'outline'}
              className='h-12 px-6 flex items-center gap-2 rounded-xl font-medium'
            >
              <Filter className='h-4 w-4' />
              Filter
            </Button>
          </div>

          {/* Advanced Filters - Collapsible */}
          {showFilters && (
            <div className='bg-muted/30 rounded-lg p-6 border border-border/50'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'>
                {/* Faculty Filter */}
                <div className='space-y-2'>
                  <Label
                    htmlFor='faculty'
                    className='text-sm font-medium text-foreground'
                  >
                    Fakultas
                  </Label>
                  <Select
                    value={selectedFaculty}
                    onValueChange={setSelectedFaculty}
                  >
                    <SelectTrigger className='h-10'>
                      <SelectValue placeholder='Pilih Fakultas' />
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

                {/* Major Filter */}
                <div className='space-y-2'>
                  <Label
                    htmlFor='major'
                    className='text-sm font-medium text-foreground'
                  >
                    Program Studi
                  </Label>
                  <Select
                    value={selectedMajor}
                    onValueChange={setSelectedMajor}
                    disabled={!selectedFaculty}
                  >
                    <SelectTrigger className='h-10'>
                      <SelectValue placeholder='Pilih Program Studi' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>Semua Program Studi</SelectItem>
                      {filteredMajors.map((major) => (
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

                {/* Degree Filter */}
                <div className='space-y-2'>
                  <Label
                    htmlFor='degree'
                    className='text-sm font-medium text-foreground'
                  >
                    Jenjang
                  </Label>
                  <Select
                    value={selectedDegree}
                    onValueChange={setSelectedDegree}
                  >
                    <SelectTrigger className='h-10'>
                      <SelectValue placeholder='Pilih Jenjang' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>Semua Jenjang</SelectItem>
                      <SelectItem value='D3'>D3</SelectItem>
                      <SelectItem value='S1'>S1</SelectItem>
                      <SelectItem value='S2'>S2</SelectItem>
                      <SelectItem value='S3'>S3</SelectItem>
                      <SelectItem value='PROFESI'>Profesi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Graduated Year Filter */}
                <div className='space-y-2'>
                  <Label
                    htmlFor='year'
                    className='text-sm font-medium text-foreground'
                  >
                    Tahun Lulus
                  </Label>
                  <Select
                    value={selectedGraduatedYear}
                    onValueChange={setSelectedGraduatedYear}
                  >
                    <SelectTrigger className='h-10'>
                      <SelectValue placeholder='Pilih Tahun' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>Semua Tahun</SelectItem>
                      {graduatedYears.map((year) => (
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

                {/* Periode Filter */}
                <div className='space-y-2'>
                  <Label
                    htmlFor='periode'
                    className='text-sm font-medium text-foreground'
                  >
                    Periode Wisuda
                  </Label>
                  <Select
                    value={selectedPeriode}
                    onValueChange={setSelectedPeriode}
                  >
                    <SelectTrigger className='h-10'>
                      <SelectValue placeholder='Pilih Periode' />
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
              </div>

              {/* Filter Actions */}
              <div className='flex items-center justify-between mt-6 pt-4 border-t border-border/50'>
                <div className='text-sm text-muted-foreground'>
                  Menampilkan{' '}
                  <span className='font-semibold text-foreground'>
                    {alumni.length}
                  </span>{' '}
                  dari{' '}
                  <span className='font-semibold text-foreground'>
                    {meta.total}
                  </span>{' '}
                  alumni
                </div>
                <Button
                  onClick={clearFilters}
                  variant='outline'
                  className='h-9 px-4'
                >
                  Hapus Filter
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Pure Table */}
        <div className='bg-background border border-border/50 rounded-lg overflow-hidden shadow-sm'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow className='border-border/50 bg-muted/30'>
                  <TableHead className='font-semibold'>NIM</TableHead>
                  <TableHead className='font-semibold'>Nama Lengkap</TableHead>
                  <TableHead className='font-semibold'>Email</TableHead>
                  <TableHead className='font-semibold'>Fakultas</TableHead>
                  <TableHead className='font-semibold'>Program Studi</TableHead>
                  <TableHead className='font-semibold'>Jenjang</TableHead>
                  <TableHead className='font-semibold'>Tahun Lulus</TableHead>
                  <TableHead className='font-semibold'>Periode</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingAlumni ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className='text-center py-8'
                    >
                      <p className='text-muted-foreground'>Memuat data...</p>
                    </TableCell>
                  </TableRow>
                ) : alumni.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className='text-center py-8'
                    >
                      <p className='text-muted-foreground'>
                        Tidak ada data alumni
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  alumni.map((alumni) => (
                    <TableRow
                      key={alumni.id}
                      className='border-border/30 hover:bg-muted/30 transition-colors'
                    >
                      <TableCell className='font-mono text-sm'>
                        {alumni.nim}
                      </TableCell>
                      <TableCell className='font-medium'>
                        {alumni.respondent.fullName}
                      </TableCell>
                      <TableCell className='text-sm text-muted-foreground'>
                        {alumni.respondent.email}
                      </TableCell>
                      <TableCell>{alumni.major.faculty.facultyName}</TableCell>
                      <TableCell>{alumni.major.majorName}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            alumni.degree === 'S1' ? 'default' : 'outline'
                          }
                          className='flex items-center gap-1 w-fit'
                        >
                          <Award className='h-3 w-3' />
                          {alumni.degree}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline'>{alumni.graduatedYear}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            alumni.graduatePeriode === 'WISUDA_I'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {alumni.graduatePeriode.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        {!isLoadingAlumni && alumni.length > 0 && meta.totalPages > 1 && (
          <div className='flex items-center justify-between mt-6'>
            <CustomPagination
              currentPage={meta.page}
              totalPages={meta.totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AlumniDatabase;
