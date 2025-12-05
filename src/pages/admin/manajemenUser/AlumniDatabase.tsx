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
  Download,
  Upload,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Edit,
} from 'lucide-react';
import * as React from 'react';
import {useNavigate} from 'react-router-dom';
import {
  ALUMNI_QUERY_KEY,
  createAlumniApi,
  downloadAlumniTemplateApi,
  importAlumniApi,
  updateAlumniApi,
  useAlumni,
  type Alumni,
} from '@/api/alumni.api';
import type {CreateAlumniPayload, UpdateAlumniPayload} from '@/api/alumni.api';
import {useFaculties, useMajors} from '@/api/major-faculty.api';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {showSequentialErrorToasts} from '@/lib/error-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {getDetailedErrorMessage, logError} from '@/utils/error-handler';

// Legacy function - using utility now
const getErrorMessage = (error: unknown, fallback: string) => {
  logError(error, 'AlumniDatabase');
  return getDetailedErrorMessage(error, fallback);
};

function AlumniDatabase() {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = React.useState(false);
  const [isManualDialogOpen, setIsManualDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editingAlumni, setEditingAlumni] = React.useState<Alumni | null>(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = React.useState(false);
  const [visiblePins, setVisiblePins] = React.useState<Set<string>>(new Set());
  const [excelFile, setExcelFile] = React.useState<File | null>(null);
  const excelFileInputRef = React.useRef<HTMLInputElement | null>(null);
  type ManualFormState = {
    nim: string;
    fullName: string;
    email: string;
    facultyId: string;
    majorId: string;
    degree: string;
    graduatedYear: string;
    graduatePeriode: string;
  };
  const manualFormInitialState: ManualFormState = {
    nim: '',
    fullName: '',
    email: '',
    facultyId: '',
    majorId: '',
    degree: '',
    graduatedYear: '',
    graduatePeriode: '',
  };
  const [manualForm, setManualForm] = React.useState<ManualFormState>(
    manualFormInitialState
  );
  const queryClient = useQueryClient();
  const [isDownloadingTemplate, setIsDownloadingTemplate] =
    React.useState(false);

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
  console.log(alumniData);
  const {data: faculties = []} = useFaculties();
  const {data: allMajors = []} = useMajors();

  const alumni = React.useMemo(() => alumniData?.alumni || [], [alumniData]);
  const meta = React.useMemo(
    () =>
      alumniData?.meta || {
        total: 0,
        limit: itemsPerPage,
        page: currentPage,
        totalPages: 0,
      },
    [alumniData, itemsPerPage, currentPage]
  );
  const stats = React.useMemo(() => alumniData?.stats, [alumniData]);

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

  const manualMajors = React.useMemo(() => {
    if (!manualForm.facultyId || manualForm.facultyId === 'all')
      return allMajors;
    return allMajors.filter(
      (major) => major.faculty.id === manualForm.facultyId
    );
  }, [manualForm.facultyId, allMajors]);

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

  const updateManualForm = (field: keyof ManualFormState, value: string) => {
    setManualForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const createAlumniMutation = useMutation({
    mutationFn: createAlumniApi,
    onSuccess: () => {
      toast.success('Alumni berhasil ditambahkan');
      setIsManualDialogOpen(false);
      setManualForm(manualFormInitialState);
      queryClient.invalidateQueries({queryKey: ALUMNI_QUERY_KEY});
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Gagal menambah alumni'));
    },
  });

  const updateAlumniMutation = useMutation({
    mutationFn: ({id, payload}: {id: string; payload: UpdateAlumniPayload}) =>
      updateAlumniApi(id, payload),
    onSuccess: () => {
      toast.success('Alumni berhasil diupdate');
      setIsEditDialogOpen(false);
      setEditingAlumni(null);
      queryClient.invalidateQueries({queryKey: ALUMNI_QUERY_KEY});
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Gagal mengupdate alumni'));
    },
  });

  const importAlumniMutation = useMutation({
    mutationFn: importAlumniApi,
    onSuccess: (summary) => {
      toast.success(
        `Import selesai: ${summary.success}/${summary.total} berhasil`
      );
      if (summary.errors?.length) {
        showSequentialErrorToasts({
          messages: summary.errors.map(
            (err) => `Baris ${err.row}: ${err.message}`
          ),
        });
      }
      setExcelFile(null);
      if (excelFileInputRef.current) {
        excelFileInputRef.current.value = '';
      }
      setIsImportDialogOpen(false);
      queryClient.invalidateQueries({queryKey: ALUMNI_QUERY_KEY});
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Gagal mengimpor alumni'));
    },
  });

  const handleManualSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !manualForm.graduatedYear ||
      !manualForm.facultyId ||
      !manualForm.majorId ||
      !manualForm.degree ||
      !manualForm.graduatePeriode
    ) {
      toast.error('Lengkapi seluruh field wajib terlebih dahulu');
      return;
    }
    const payload: CreateAlumniPayload = {
      nim: manualForm.nim,
      fullName: manualForm.fullName,
      email: manualForm.email,
      facultyId: manualForm.facultyId,
      majorId: manualForm.majorId,
      degree: manualForm.degree,
      graduatedYear: parseInt(manualForm.graduatedYear, 10),
      graduatePeriode:
        manualForm.graduatePeriode as CreateAlumniPayload['graduatePeriode'],
    };
    createAlumniMutation.mutate(payload);
  };

  const handleTemplateDownload = async () => {
    try {
      setIsDownloadingTemplate(true);
      const blob = await downloadAlumniTemplateApi();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'template-import-alumni.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Gagal mengunduh template alumni');
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  const handleExcelFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;
    setExcelFile(file);
  };

  const handleExcelUpload = () => {
    if (!excelFile) return;
    importAlumniMutation.mutate(excelFile);
  };

  const handleEditClick = (alumni: Alumni) => {
    setEditingAlumni(alumni);
    // Pre-fill form with existing data
    setManualForm({
      nim: alumni.nim,
      fullName: alumni.respondent.fullName,
      email: alumni.respondent.email,
      facultyId: alumni.major.faculty.id,
      majorId: alumni.major.id,
      degree: alumni.degree,
      graduatedYear: alumni.graduatedYear.toString(),
      graduatePeriode: alumni.graduatePeriode,
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingAlumni) return;

    const payload: UpdateAlumniPayload = {};
    if (manualForm.nim) payload.nim = manualForm.nim;
    if (manualForm.fullName) payload.fullName = manualForm.fullName;
    if (manualForm.email) payload.email = manualForm.email;
    if (manualForm.facultyId) payload.facultyId = manualForm.facultyId;
    if (manualForm.majorId) payload.majorId = manualForm.majorId;
    if (manualForm.degree) payload.degree = manualForm.degree;
    if (manualForm.graduatedYear)
      payload.graduatedYear = parseInt(manualForm.graduatedYear, 10);
    if (manualForm.graduatePeriode)
      payload.graduatePeriode =
        manualForm.graduatePeriode as UpdateAlumniPayload['graduatePeriode'];

    updateAlumniMutation.mutate({id: editingAlumni.id, payload});
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
                    {stats?.totalAlumni ?? alumni.length}
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
                    {stats?.alumniThisYear ?? 0}
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
                    {stats?.totalMajors ?? allMajors.length}
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
                    {stats?.totalFaculties ?? faculties.length}
                  </p>
                </div>
                <Building className='h-8 w-8 text-primary' />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Input Actions */}
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
          <Card className='border-dashed border-primary/40 bg-primary/5'>
            <CardContent className='p-6 flex flex-col gap-4'>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <p className='text-sm font-medium text-primary'>
                    Input Manual
                  </p>
                  <h3 className='text-xl font-semibold'>
                    Tambah Alumni Per Akun
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    Gunakan formulir ini untuk menambahkan alumni secara
                    individual sebelum data besar diunggah.
                  </p>
                </div>
              </div>
              <div className='flex flex-wrap gap-3'>
                <Button
                  onClick={() => setIsManualDialogOpen(true)}
                  className='flex items-center gap-2'
                >
                  <Plus className='h-4 w-4' />
                  Tambah Alumni
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className='border-dashed border-border/60'>
            <CardContent className='p-6 flex flex-col gap-4'>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <p className='text-sm font-medium text-foreground'>
                    Import Excel
                  </p>
                  <h3 className='text-xl font-semibold'>
                    Unggah Banyak Alumni
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    Unduh template resmi dan unggah kembali setelah diisi untuk
                    mempercepat proses input massal.
                  </p>
                </div>
              </div>
              <div className='flex flex-wrap gap-3'>
                <Button
                  variant='outline'
                  onClick={handleTemplateDownload}
                  disabled={isDownloadingTemplate}
                  className='flex items-center gap-2'
                >
                  <Download className='h-4 w-4' />
                  {isDownloadingTemplate ? 'Mengunduh...' : 'Download Template'}
                </Button>
                <Button
                  onClick={() => setIsImportDialogOpen(true)}
                  className='flex items-center gap-2'
                >
                  <Upload className='h-4 w-4' />
                  Upload Excel
                </Button>
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
                      <SelectItem value='VOKASI'>Vokasi</SelectItem>
                      <SelectItem value='PASCA'>Pascasarjana</SelectItem>
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
                    {stats?.filteredCount ?? meta.total}
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
                  <TableHead className='font-semibold'>PIN</TableHead>
                  <TableHead className='font-semibold'>Fakultas</TableHead>
                  <TableHead className='font-semibold'>Program Studi</TableHead>
                  <TableHead className='font-semibold'>Jenjang</TableHead>
                  <TableHead className='font-semibold'>Tahun Lulus</TableHead>
                  <TableHead className='font-semibold'>Periode</TableHead>
                  <TableHead className='font-semibold'>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingAlumni ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className='text-center py-8'
                    >
                      <p className='text-muted-foreground'>Memuat data...</p>
                    </TableCell>
                  </TableRow>
                ) : alumni.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
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
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          {alumni.pin ? (
                            <>
                              <span className='font-mono text-sm'>
                                {visiblePins.has(alumni.id)
                                  ? alumni.pin
                                  : '••••••'}
                              </span>
                              <Button
                                variant='ghost'
                                size='icon'
                                className='h-6 w-6'
                                onClick={() => {
                                  const newVisiblePins = new Set(visiblePins);
                                  if (newVisiblePins.has(alumni.id)) {
                                    newVisiblePins.delete(alumni.id);
                                  } else {
                                    newVisiblePins.add(alumni.id);
                                  }
                                  setVisiblePins(newVisiblePins);
                                }}
                                title={
                                  visiblePins.has(alumni.id)
                                    ? 'Sembunyikan PIN'
                                    : 'Tampilkan PIN'
                                }
                              >
                                {visiblePins.has(alumni.id) ? (
                                  <EyeOff className='h-4 w-4' />
                                ) : (
                                  <Eye className='h-4 w-4' />
                                )}
                              </Button>
                              <Button
                                variant='ghost'
                                size='icon'
                                className='h-6 w-6'
                                onClick={() => {
                                  if (alumni.pin) {
                                    navigator.clipboard.writeText(alumni.pin);
                                    toast.success('PIN berhasil disalin');
                                  }
                                }}
                                title='Salin PIN'
                              >
                                <Copy className='h-4 w-4' />
                              </Button>
                            </>
                          ) : (
                            <span className='text-sm text-muted-foreground'>
                              -
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{alumni.major.faculty.name}</TableCell>
                      <TableCell>{alumni.major.name}</TableCell>
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
                      <TableCell>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8'
                          onClick={() => handleEditClick(alumni)}
                          title='Edit Alumni'
                        >
                          <Edit className='h-4 w-4' />
                        </Button>
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

        {/* Manual Input Dialog */}
        <Dialog
          open={isManualDialogOpen}
          onOpenChange={setIsManualDialogOpen}
        >
          <DialogContent className='sm:max-w-2xl'>
            <form
              onSubmit={handleManualSubmit}
              className='space-y-6'
            >
              <DialogHeader>
                <DialogTitle>Tambah Alumni Manual</DialogTitle>
                <DialogDescription>
                  Lengkapi data berikut untuk menambahkan satu alumni secara
                  langsung ke database.
                </DialogDescription>
              </DialogHeader>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='manual-nim'>NIM</Label>
                  <Input
                    id='manual-nim'
                    value={manualForm.nim}
                    onChange={(e) => updateManualForm('nim', e.target.value)}
                    placeholder='Contoh: 2018123456'
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='manual-fullname'>Nama Lengkap</Label>
                  <Input
                    id='manual-fullname'
                    value={manualForm.fullName}
                    onChange={(e) =>
                      updateManualForm('fullName', e.target.value)
                    }
                    placeholder='Nama sesuai ijazah'
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='manual-email'>Email</Label>
                  <Input
                    id='manual-email'
                    type='email'
                    value={manualForm.email}
                    onChange={(e) => updateManualForm('email', e.target.value)}
                    placeholder='alumni@kampus.ac.id'
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label>Jenjang</Label>
                  <Select
                    value={manualForm.degree}
                    onValueChange={(value) => updateManualForm('degree', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Pilih jenjang' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='S1'>S1</SelectItem>
                      <SelectItem value='S2'>S2</SelectItem>
                      <SelectItem value='S3'>S3</SelectItem>
                      <SelectItem value='D3'>D3</SelectItem>
                      <SelectItem value='PROFESI'>Profesi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <Label>Fakultas</Label>
                  <Select
                    value={manualForm.facultyId}
                    onValueChange={(value) => {
                      updateManualForm('facultyId', value);
                      updateManualForm('majorId', '');
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Pilih fakultas' />
                    </SelectTrigger>
                    <SelectContent>
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
                <div className='space-y-2'>
                  <Label>Program Studi</Label>
                  <Select
                    value={manualForm.majorId}
                    onValueChange={(value) =>
                      updateManualForm('majorId', value)
                    }
                    disabled={!manualForm.facultyId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Pilih prodi' />
                    </SelectTrigger>
                    <SelectContent>
                      {manualMajors.map((major) => (
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
                <div className='space-y-2'>
                  <Label>Tahun Lulus</Label>
                  <Input
                    type='number'
                    min='2000'
                    max={new Date().getFullYear()}
                    value={manualForm.graduatedYear}
                    onChange={(e) =>
                      updateManualForm('graduatedYear', e.target.value)
                    }
                    placeholder='2024'
                  />
                </div>
                <div className='space-y-2'>
                  <Label>Periode Wisuda</Label>
                  <Select
                    value={manualForm.graduatePeriode}
                    onValueChange={(value) =>
                      updateManualForm('graduatePeriode', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Pilih periode' />
                    </SelectTrigger>
                    <SelectContent>
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

              <DialogFooter>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setIsManualDialogOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type='submit'
                  disabled={createAlumniMutation.isPending}
                >
                  {createAlumniMutation.isPending
                    ? 'Menyimpan...'
                    : 'Simpan Alumni'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) {
              setEditingAlumni(null);
              setManualForm(manualFormInitialState);
            }
          }}
        >
          <DialogContent className='sm:max-w-2xl'>
            <form
              onSubmit={handleEditSubmit}
              className='space-y-6'
            >
              <DialogHeader>
                <DialogTitle>Edit Alumni</DialogTitle>
                <DialogDescription>
                  Perbarui data alumni yang dipilih. Kosongkan field yang tidak
                  ingin diubah.
                </DialogDescription>
              </DialogHeader>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='edit-nim'>NIM</Label>
                  <Input
                    id='edit-nim'
                    value={manualForm.nim}
                    onChange={(e) => updateManualForm('nim', e.target.value)}
                    placeholder={
                      editingAlumni?.nim || 'Contoh: 2018123456'
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='edit-fullname'>Nama Lengkap</Label>
                  <Input
                    id='edit-fullname'
                    value={manualForm.fullName}
                    onChange={(e) =>
                      updateManualForm('fullName', e.target.value)
                    }
                    placeholder={
                      editingAlumni?.respondent.fullName ||
                      'Nama sesuai ijazah'
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='edit-email'>Email</Label>
                  <Input
                    id='edit-email'
                    type='email'
                    value={manualForm.email}
                    onChange={(e) => updateManualForm('email', e.target.value)}
                    placeholder={
                      editingAlumni?.respondent.email ||
                      'alumni@kampus.ac.id'
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label>Jenjang</Label>
                  <Select
                    value={manualForm.degree}
                    onValueChange={(value) =>
                      updateManualForm('degree', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          editingAlumni?.degree || 'Pilih jenjang'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='S1'>S1</SelectItem>
                      <SelectItem value='S2'>S2</SelectItem>
                      <SelectItem value='S3'>S3</SelectItem>
                      <SelectItem value='D3'>D3</SelectItem>
                      <SelectItem value='PROFESI'>Profesi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <Label>Fakultas</Label>
                  <Select
                    value={manualForm.facultyId}
                    onValueChange={(value) => {
                      updateManualForm('facultyId', value);
                      updateManualForm('majorId', '');
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          editingAlumni?.major.faculty.name ||
                          'Pilih fakultas'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
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
                <div className='space-y-2'>
                  <Label>Program Studi</Label>
                  <Select
                    value={manualForm.majorId}
                    onValueChange={(value) =>
                      updateManualForm('majorId', value)
                    }
                    disabled={!manualForm.facultyId}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          editingAlumni?.major.name || 'Pilih prodi'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {manualMajors.map((major) => (
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
                <div className='space-y-2'>
                  <Label>Tahun Lulus</Label>
                  <Input
                    type='number'
                    min='2000'
                    max={new Date().getFullYear()}
                    value={manualForm.graduatedYear}
                    onChange={(e) =>
                      updateManualForm('graduatedYear', e.target.value)
                    }
                    placeholder={
                      editingAlumni?.graduatedYear?.toString() || '2024'
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label>Periode Wisuda</Label>
                  <Select
                    value={manualForm.graduatePeriode}
                    onValueChange={(value) =>
                      updateManualForm('graduatePeriode', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          editingAlumni?.graduatePeriode?.replace('_', ' ') ||
                          'Pilih periode'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
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

              <DialogFooter>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingAlumni(null);
                    setManualForm(manualFormInitialState);
                  }}
                >
                  Batal
                </Button>
                <Button
                  type='submit'
                  disabled={updateAlumniMutation.isPending}
                >
                  {updateAlumniMutation.isPending
                    ? 'Menyimpan...'
                    : 'Simpan Perubahan'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Import Dialog */}
        <Dialog
          open={isImportDialogOpen}
          onOpenChange={setIsImportDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Unggah Excel Alumni</DialogTitle>
              <DialogDescription>
                Pastikan file mengikuti format template resmi sebelum unggah.
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='alumni-excel'>Pilih File</Label>
                <Input
                  id='alumni-excel'
                  type='file'
                  accept='.xlsx,.xls,.csv'
                  ref={excelFileInputRef}
                  onChange={handleExcelFileChange}
                />
                <p className='text-xs text-muted-foreground'>
                  Maksimal 5MB. Format yang didukung: .xlsx, .xls, .csv
                </p>
              </div>
              {excelFile && (
                <p className='text-sm font-medium'>
                  File terpilih: {excelFile.name}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  setExcelFile(null);
                  if (excelFileInputRef.current) {
                    excelFileInputRef.current.value = '';
                  }
                  setIsImportDialogOpen(false);
                }}
              >
                Batal
              </Button>
              <Button
                onClick={handleExcelUpload}
                disabled={!excelFile || importAlumniMutation.isPending}
              >
                {importAlumniMutation.isPending
                  ? 'Memproses...'
                  : 'Proses Upload'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </AdminLayout>
  );
}

export default AlumniDatabase;
