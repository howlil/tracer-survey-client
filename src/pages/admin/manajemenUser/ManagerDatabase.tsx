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
  Building2,
  Briefcase,
  Mail,
  UserCheck,
  Download,
  Upload,
  FileSpreadsheet,
  Plus,
} from 'lucide-react';
import * as React from 'react';
import {useNavigate} from 'react-router-dom';
import {
  MANAGER_QUERY_KEY,
  createManagerApi,
  downloadManagerTemplateApi,
  importManagersApi,
  useManagers,
  useCompanies,
  usePositions,
} from '@/api/manager.api';
import {Badge} from '@/components/ui/badge';
import {Textarea} from '@/components/ui/textarea';
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
  logError(error, 'ManagerDatabase');
  return getDetailedErrorMessage(error, fallback);
};

function ManagerDatabase() {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = React.useState(false);
  const [isManualDialogOpen, setIsManualDialogOpen] = React.useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = React.useState(false);
  const [excelFile, setExcelFile] = React.useState<File | null>(null);
  const excelFileInputRef = React.useRef<HTMLInputElement | null>(null);
  type ManualManagerFormState = {
    fullName: string;
    email: string;
    company: string;
    position: string;
    phoneNumber: string;
  };
  const manualFormInitialState: ManualManagerFormState = {
    fullName: '',
    email: '',
    company: '',
    position: '',
    phoneNumber: '',
  };
  const [manualForm, setManualForm] = React.useState<ManualManagerFormState>(
    manualFormInitialState
  );
  const [alumniPinsInput, setAlumniPinsInput] = React.useState('');
  const queryClient = useQueryClient();
  const [isDownloadingTemplate, setIsDownloadingTemplate] =
    React.useState(false);

  const createManagerMutation = useMutation({
    mutationFn: createManagerApi,
    onSuccess: () => {
      toast.success('Manager berhasil ditambahkan');
      setIsManualDialogOpen(false);
      setManualForm(manualFormInitialState);
      setAlumniPinsInput('');
      queryClient.invalidateQueries({queryKey: MANAGER_QUERY_KEY});
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Gagal menambahkan manager'));
    },
  });

  const importManagersMutation = useMutation({
    mutationFn: importManagersApi,
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
      queryClient.invalidateQueries({queryKey: MANAGER_QUERY_KEY});
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Gagal mengimpor manager'));
    },
  });

  // Filter states
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCompany, setSelectedCompany] = React.useState<string>('');
  const [selectedPosition, setSelectedPosition] = React.useState<string>('');

  // Pagination states
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  // API hooks
  const {data: managersData, isLoading: isLoadingManagers} = useManagers({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery || undefined,
    company:
      selectedCompany && selectedCompany !== 'all'
        ? selectedCompany
        : undefined,
    position:
      selectedPosition && selectedPosition !== 'all'
        ? selectedPosition
        : undefined,
  });

  const {data: companiesData = []} = useCompanies();
  const {data: positionsData = []} = usePositions();

  const managers = managersData?.managers || [];
  const meta = managersData?.meta || {
    total: 0,
    limit: itemsPerPage,
    page: currentPage,
    totalPages: 0,
  };

  // Extract unique companies and positions from API
  const companies = companiesData.map((c) => c.company);
  const positions = positionsData.map((p) => p.position);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCompany('');
    setSelectedPosition('');
  };

  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const updateManualForm = (
    field: keyof ManualManagerFormState,
    value: string
  ) => {
    setManualForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleManualSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const pins = alumniPinsInput
      .split(/[\n,|;]/)
      .map((pin) => pin.trim())
      .filter(Boolean);

    if (pins.length === 0) {
      toast.error('Minimal satu PIN alumni diperlukan');
      return;
    }

    createManagerMutation.mutate({
      ...manualForm,
      alumniPins: pins,
    });
  };

  const handleTemplateDownload = async () => {
    try {
      setIsDownloadingTemplate(true);
      const blob = await downloadManagerTemplateApi();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'template-import-manager.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Gagal mengunduh template manager');
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
    importManagersMutation.mutate(excelFile);
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
                <BreadcrumbPage>Database Manager</BreadcrumbPage>
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
                    Total Manager
                  </p>
                  <p className='text-2xl font-bold text-foreground'>
                    {managers.length}
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
                    Perusahaan
                  </p>
                  <p className='text-2xl font-bold text-foreground'>
                    {companies.length}
                  </p>
                </div>
                <Building2 className='h-8 w-8 text-primary' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Posisi
                  </p>
                  <p className='text-2xl font-bold text-foreground'>
                    {positions.length}
                  </p>
                </div>
                <Briefcase className='h-8 w-8 text-primary' />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Ditampilkan
                  </p>
                  <p className='text-2xl font-bold text-foreground'>
                    {managers.length}
                  </p>
                </div>
                <Filter className='h-8 w-8 text-primary' />
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
                    Tambah Manager Per Akun
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    Segera buat akun manager baru ketika bertemu pihak
                    perusahaan tanpa menunggu file excel.
                  </p>
                </div>
                <Badge
                  variant='outline'
                  className='bg-background'
                >
                  Real-time
                </Badge>
              </div>
              <div className='flex flex-wrap gap-3'>
                <Button
                  onClick={() => setIsManualDialogOpen(true)}
                  className='flex items-center gap-2'
                >
                  <Plus className='h-4 w-4' />
                  Tambah Manager
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
                    Unggah Banyak Manager
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    Pakai template resmi untuk mempercepat onboarding manager di
                    banyak perusahaan sekaligus.
                  </p>
                </div>
                <FileSpreadsheet className='h-10 w-10 text-primary' />
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
                placeholder='Cari berdasarkan nama atau email...'
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

          {showFilters && (
            <div className='bg-gradient-to-r from-background via-muted/20 to-background rounded-xl p-6 border border-border/30 shadow-sm'>
              <div className='space-y-6'>
                {/* Filter Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {/* Company Filter */}
                  <div className='space-y-3'>
                    <Label
                      htmlFor='company'
                      className='text-sm font-medium text-foreground flex items-center gap-2'
                    >
                      <Building2 className='h-4 w-4' />
                      Perusahaan
                    </Label>
                    <Select
                      value={selectedCompany}
                      onValueChange={setSelectedCompany}
                    >
                      <SelectTrigger className='h-11 border-border/50 bg-background/50 focus:bg-background transition-all duration-200 rounded-lg'>
                        <SelectValue placeholder='Pilih Perusahaan' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>Semua Perusahaan</SelectItem>
                        {companies.map((company) => (
                          <SelectItem
                            key={company}
                            value={company}
                          >
                            {company}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Position Filter */}
                  <div className='space-y-3'>
                    <Label
                      htmlFor='position'
                      className='text-sm font-medium text-foreground flex items-center gap-2'
                    >
                      <Briefcase className='h-4 w-4' />
                      Posisi
                    </Label>
                    <Select
                      value={selectedPosition}
                      onValueChange={setSelectedPosition}
                    >
                      <SelectTrigger className='h-11 border-border/50 bg-background/50 focus:bg-background transition-all duration-200 rounded-lg'>
                        <SelectValue placeholder='Pilih Posisi' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>Semua Posisi</SelectItem>
                        {positions.map((position) => (
                          <SelectItem
                            key={position}
                            value={position}
                          >
                            {position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Filter Actions */}
                <div className='flex items-center justify-between pt-4 border-t border-border/30'>
                  <div className='text-sm text-muted-foreground'>
                    Menampilkan{' '}
                    <span className='font-semibold text-foreground'>
                      {managers.length}
                    </span>{' '}
                    dari{' '}
                    <span className='font-semibold text-foreground'>
                      {meta.total}
                    </span>{' '}
                    manager
                  </div>
                  <Button
                    onClick={clearFilters}
                    variant='outline'
                    className='h-9 px-4 rounded-lg border-border/50 hover:bg-muted/50 transition-all duration-200'
                  >
                    Hapus Filter
                  </Button>
                </div>
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
                  <TableHead className='font-semibold'>Nama Lengkap</TableHead>
                  <TableHead className='font-semibold'>Email</TableHead>
                  <TableHead className='font-semibold'>Perusahaan</TableHead>
                  <TableHead className='font-semibold'>Posisi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingManagers ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className='text-center py-8'
                    >
                      <p className='text-muted-foreground'>Memuat data...</p>
                    </TableCell>
                  </TableRow>
                ) : managers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className='text-center py-8'
                    >
                      <p className='text-muted-foreground'>
                        Tidak ada data manager
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  managers.map((manager) => (
                    <TableRow
                      key={manager.id}
                      className='border-border/30 hover:bg-muted/30 transition-colors'
                    >
                      <TableCell className='font-medium'>
                        {manager.respondent.fullName}
                      </TableCell>
                      <TableCell className='text-sm text-muted-foreground'>
                        <div className='flex items-center gap-2'>
                          <Mail className='h-4 w-4' />
                          {manager.respondent.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <Building2 className='h-4 w-4 text-muted-foreground' />
                          {manager.company}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <Briefcase className='h-4 w-4 text-muted-foreground' />
                          {manager.position}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        {!isLoadingManagers && managers.length > 0 && meta.totalPages > 1 && (
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
          <DialogContent>
            <form
              onSubmit={handleManualSubmit}
              className='space-y-6'
            >
              <DialogHeader>
                <DialogTitle>Tambah Manager Manual</DialogTitle>
                <DialogDescription>
                  Pastikan alamat email aktif karena kredensial akan dikirimkan
                  secara otomatis setelah integrasi backend.
                </DialogDescription>
              </DialogHeader>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='manager-fullname'>Nama Lengkap</Label>
                  <Input
                    id='manager-fullname'
                    value={manualForm.fullName}
                    onChange={(e) =>
                      updateManualForm('fullName', e.target.value)
                    }
                    placeholder='Nama manager'
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='manager-email'>Email</Label>
                  <Input
                    id='manager-email'
                    type='email'
                    value={manualForm.email}
                    onChange={(e) => updateManualForm('email', e.target.value)}
                    placeholder='manager@perusahaan.com'
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='manager-company'>Perusahaan</Label>
                  <Input
                    id='manager-company'
                    list='company-list'
                    value={manualForm.company}
                    onChange={(e) =>
                      updateManualForm('company', e.target.value)
                    }
                    placeholder='Nama perusahaan'
                    required
                  />
                  <datalist id='company-list'>
                    {companies.map((company) => (
                      <option
                        key={company}
                        value={company}
                      />
                    ))}
                  </datalist>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='manager-position'>Posisi</Label>
                  <Input
                    id='manager-position'
                    list='position-list'
                    value={manualForm.position}
                    onChange={(e) =>
                      updateManualForm('position', e.target.value)
                    }
                    placeholder='Contoh: HR Manager'
                    required
                  />
                  <datalist id='position-list'>
                    {positions.map((position) => (
                      <option
                        key={position}
                        value={position}
                      />
                    ))}
                  </datalist>
                </div>
                <div className='space-y-2 md:col-span-2'>
                  <Label htmlFor='manager-phone'>Nomor Telepon</Label>
                  <Input
                    id='manager-phone'
                    type='tel'
                    value={manualForm.phoneNumber}
                    onChange={(e) =>
                      updateManualForm('phoneNumber', e.target.value)
                    }
                    placeholder='+62xxxxxxxxxxx'
                  />
                </div>
                <div className='space-y-2 md:col-span-2'>
                  <Label htmlFor='manager-pins'>PIN Alumni</Label>
                  <Textarea
                    id='manager-pins'
                    value={alumniPinsInput}
                    onChange={(e) => setAlumniPinsInput(e.target.value)}
                    placeholder='Contoh: PIN123, PIN456 atau pisahkan per baris'
                    rows={3}
                    required
                  />
                  <p className='text-xs text-muted-foreground'>
                    Minimal satu PIN alumni. Gunakan koma, garis miring, atau
                    baris baru untuk memisahkan lebih dari satu PIN.
                  </p>
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
                  disabled={createManagerMutation.isPending}
                >
                  {createManagerMutation.isPending
                    ? 'Menyimpan...'
                    : 'Simpan Manager'}
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
              <DialogTitle>Unggah Excel Manager</DialogTitle>
              <DialogDescription>
                Gunakan file hasil unduhan template agar struktur kolom sesuai
                dengan sistem.
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='manager-excel'>Pilih File</Label>
                <Input
                  id='manager-excel'
                  type='file'
                  accept='.xlsx,.xls,.csv'
                  ref={excelFileInputRef}
                  onChange={handleExcelFileChange}
                />
                <p className='text-xs text-muted-foreground'>
                  Maksimal 5MB. Format: .xlsx, .xls, .csv
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
                disabled={!excelFile || importManagersMutation.isPending}
              >
                {importManagersMutation.isPending
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

export default ManagerDatabase;
