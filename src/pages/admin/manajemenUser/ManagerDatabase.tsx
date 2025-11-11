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
} from 'lucide-react';
import * as React from 'react';
import {useNavigate} from 'react-router-dom';
import {useManagers, useCompanies, usePositions} from '@/api/manager.api';

function ManagerDatabase() {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = React.useState(false);

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
      </div>
    </AdminLayout>
  );
}

export default ManagerDatabase;
