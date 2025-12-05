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
  Plus,
  AlertTriangle,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
} from 'lucide-react';
import * as React from 'react';
import {useNavigate} from 'react-router-dom';
import {
  MANAGER_QUERY_KEY,
  generateManagersFromTracerStudyApi,
  useManagers,
  useCompanies,
  usePositions,
} from '@/api/manager.api';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {getDetailedErrorMessage, logError} from '@/utils/error-handler';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Legacy function - using utility now
const getErrorMessage = (error: unknown, fallback: string) => {
  logError(error, 'ManagerDatabase');
  return getDetailedErrorMessage(error, fallback);
};

function ManagerDatabase() {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = React.useState(false);
  const [showGenerateConfirm, setShowGenerateConfirm] = React.useState(false);
  const [visiblePins, setVisiblePins] = React.useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  const generateManagersMutation = useMutation({
    mutationFn: generateManagersFromTracerStudyApi,
    onSuccess: (summary) => {
      if (summary.success > 0) {
        toast.success(
          `Generate selesai: ${summary.success} manager berhasil dibuat dari ${summary.total} response`
        );
      } else {
        toast.info('Tidak ada manager baru yang dapat dibuat. Semua response sudah memiliki manager atau data tidak lengkap.');
      }
      if (summary.errors?.length > 0) {
        summary.errors.slice(0, 5).forEach((err) => {
          toast.error(`${err.respondentName}: ${err.message}`);
        });
        if (summary.errors.length > 5) {
          toast.warning(`Dan ${summary.errors.length - 5} error lainnya...`);
        }
      }
      queryClient.invalidateQueries({queryKey: MANAGER_QUERY_KEY});
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Gagal generate manager dari tracer study'));
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

  const handleGenerateManagers = () => {
    setShowGenerateConfirm(true);
  };

  const confirmGenerateManagers = () => {
    setShowGenerateConfirm(false);
    generateManagersMutation.mutate();
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

        {/* Generate Managers Action */}
        <Card className='border-dashed border-primary/40 bg-primary/5'>
          <CardContent className='p-6 flex flex-col gap-4'>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <p className='text-sm font-medium text-primary'>
                  Generate Otomatis
                </p>
                <h3 className='text-xl font-semibold'>
                  Generate Manager dari Tracer Study
                </h3>
                <p className='text-sm text-muted-foreground'>
                  Manager akan dibuat otomatis dari response tracer study yang status bekerjanya "sudah bekerja" dan kelengkapannya 100%. Data perusahaan, posisi, dan nomor telepon akan diambil dari jawaban survey.
                </p>
              </div>
            </div>
            <div className='flex flex-wrap gap-3'>
              <Button
                onClick={handleGenerateManagers}
                disabled={generateManagersMutation.isPending}
                className='flex items-center gap-2'
              >
                {generateManagersMutation.isPending ? (
                  <>
                    <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <Plus className='h-4 w-4' />
                    Generate Manager
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

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
            <div className='bg-linear-to-r from-background via-muted/20 to-background rounded-xl p-6 border border-border/30 shadow-sm'>
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
                  <TableHead className='font-semibold'>PIN</TableHead>
                  <TableHead className='font-semibold'>Perusahaan</TableHead>
                  <TableHead className='font-semibold'>Posisi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingManagers ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className='text-center py-8'
                    >
                      <p className='text-muted-foreground'>Memuat data...</p>
                    </TableCell>
                  </TableRow>
                ) : managers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
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
                          {manager.pin ? (
                            <>
                              <span className='font-mono text-sm'>
                                {visiblePins.has(manager.id)
                                  ? manager.pin
                                  : '••••••'}
                              </span>
                              <Button
                                variant='ghost'
                                size='icon'
                                className='h-6 w-6'
                                onClick={() => {
                                  const newVisiblePins = new Set(visiblePins);
                                  if (newVisiblePins.has(manager.id)) {
                                    newVisiblePins.delete(manager.id);
                                  } else {
                                    newVisiblePins.add(manager.id);
                                  }
                                  setVisiblePins(newVisiblePins);
                                }}
                                title={
                                  visiblePins.has(manager.id)
                                    ? 'Sembunyikan PIN'
                                    : 'Tampilkan PIN'
                                }
                              >
                                {visiblePins.has(manager.id) ? (
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
                                  if (manager.pin) {
                                    navigator.clipboard.writeText(manager.pin);
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
                      <TableCell>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => navigate(`/admin/users/manager/detail/${manager.id}`)}
                          className='flex items-center gap-2'
                        >
                          <ExternalLink className='h-4 w-4' />
                          Detail
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
        {!isLoadingManagers && managers.length > 0 && meta.totalPages > 1 && (
          <div className='flex items-center justify-between mt-6'>
            <CustomPagination
              currentPage={meta.page}
              totalPages={meta.totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {/* Generate Confirmation Modal */}
        <Dialog open={showGenerateConfirm} onOpenChange={setShowGenerateConfirm}>
          <DialogContent className='sm:max-w-[500px]'>
            <DialogHeader>
              <div className='flex items-center gap-3 mb-2'>
                <div className='p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg'>
                  <AlertTriangle className='h-6 w-6 text-orange-600 dark:text-orange-400' />
                </div>
                <DialogTitle className='text-xl font-semibold'>
                  Konfirmasi Generate Manager
                </DialogTitle>
              </div>
              <DialogDescription className='text-base pt-2'>
                Apakah Anda yakin ingin generate manager dari tracer study?
              </DialogDescription>
            </DialogHeader>
            <div className='py-4 space-y-3'>
              <div className='bg-muted/50 rounded-lg p-4 space-y-2'>
                <p className='text-sm font-medium text-foreground'>
                  Manager akan dibuat otomatis dengan ketentuan:
                </p>
                <ul className='text-sm text-muted-foreground space-y-1 list-disc list-inside'>
                  <li>Status kerja adalah "Bekerja (Full Time)", "Bekerja (Part Time)", atau "Wiraswasta"</li>
                  <li>Kelengkapan survey mencapai 100%</li>
                  <li>Data perusahaan, posisi, nama atasan, dan email atasan tersedia</li>
                </ul>
              </div>
              <div className='bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3'>
                <p className='text-sm text-blue-900 dark:text-blue-200'>
                  <strong>Catatan:</strong> Setiap manager akan mendapatkan PIN baru yang unik untuk user survey.
                </p>
              </div>
            </div>
            <DialogFooter className='gap-2 sm:gap-0'>
              <Button
                variant='outline'
                onClick={() => setShowGenerateConfirm(false)}
                disabled={generateManagersMutation.isPending}
              >
                Batal
              </Button>
              <Button
                onClick={confirmGenerateManagers}
                disabled={generateManagersMutation.isPending}
                className='bg-primary hover:bg-primary/90'
              >
                {generateManagersMutation.isPending ? (
                  <>
                    <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2' />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Plus className='h-4 w-4 mr-2' />
                    Generate Manager
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

export default ManagerDatabase;
