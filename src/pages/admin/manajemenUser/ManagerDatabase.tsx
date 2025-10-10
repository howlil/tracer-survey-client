
import {AdminLayout} from '@/components/layout/admin/AdminLayout';
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
import {CustomPagination} from '@/components/ui/pagination';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
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
  Upload,
  FileSpreadsheet,
  X,
  Edit,
} from 'lucide-react';
import * as React from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'sonner';

// Types untuk import data
interface ImportManagerData {
  fullName: string;
  email: string;
  company: string;
  position: string;
}

// Mock data alumni untuk dipilih
const mockAlumni = [
  { id: 'alumni-1', fullName: 'John Doe', nim: '1911522010' },
  { id: 'alumni-2', fullName: 'Jane Smith', nim: '1911522011' },
  { id: 'alumni-3', fullName: 'Bob Wilson', nim: '1911522012' },
  { id: 'alumni-4', fullName: 'Alice Johnson', nim: '1911522013' },
  { id: 'alumni-5', fullName: 'Charlie Brown', nim: '1911522014' },
  { id: 'alumni-6', fullName: 'David Lee', nim: '1911522015' },
  { id: 'alumni-7', fullName: 'Emma Watson', nim: '1911522016' },
  { id: 'alumni-8', fullName: 'Frank Miller', nim: '1911522017' },
  { id: 'alumni-9', fullName: 'Grace Hopper', nim: '1911522018' },
  { id: 'alumni-10', fullName: 'Henry Ford', nim: '1911522019' },
];

// Types berdasarkan Prisma schema
interface Respondent {
  id: string;
  fullName: string;
  email: string;
  role: 'ALUMNI' | 'MANAGER';
  createdAt: string;
  updatedAt: string;
}

interface Manager {
  id: string;
  company: string;
  position: string;
  respondentId: string;
  respondent: Respondent;
  workingAlumni: WorkingAlumni[];
  createdAt: string;
  updatedAt: string;
}

interface WorkingAlumni {
  id: string;
  fullName: string;
  nim: string;
}

// Mock data untuk demo
const mockManagers: Manager[] = [
  {
    id: '1',
    company: 'PT Telkom Indonesia',
    position: 'Software Engineer',
    respondentId: 'resp-1',
    respondent: {
      id: 'resp-1',
      fullName: 'Ahmad Rizki Pratama',
      email: 'ahmad.rizki@telkom.co.id',
      role: 'MANAGER',
      createdAt: '2023-01-15T00:00:00Z',
      updatedAt: '2023-01-15T00:00:00Z',
    },
    workingAlumni: [
      {
        id: 'alumni-1',
        fullName: 'John Doe',
        nim: '1911522010'
      },
      {
        id: 'alumni-2',
        fullName: 'Jane Smith',
        nim: '1911522011'
      }
    ],
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2023-01-15T00:00:00Z',
  },
  {
    id: '2',
    company: 'Bank Mandiri',
    position: 'Product Manager',
    respondentId: 'resp-2',
    respondent: {
      id: 'resp-2',
      fullName: 'Siti Nurhaliza',
      email: 'siti.nurhaliza@bankmandiri.co.id',
      role: 'MANAGER',
      createdAt: '2023-07-20T00:00:00Z',
      updatedAt: '2023-07-20T00:00:00Z',
    },
    workingAlumni: [
      {
        id: 'alumni-3',
        fullName: 'Bob Wilson',
        nim: '1911522012'
      }
    ],
    createdAt: '2023-07-20T00:00:00Z',
    updatedAt: '2023-07-20T00:00:00Z',
  },
  {
    id: '3',
    company: 'PT Pertamina',
    position: 'Data Analyst',
    respondentId: 'resp-3',
    respondent: {
      id: 'resp-3',
      fullName: 'Budi Santoso',
      email: 'budi.santoso@pertamina.com',
      role: 'MANAGER',
      createdAt: '2022-01-10T00:00:00Z',
      updatedAt: '2022-01-10T00:00:00Z',
    },
    workingAlumni: [
      {
        id: 'alumni-4',
        fullName: 'Alice Johnson',
        nim: '1911522013'
      },
      {
        id: 'alumni-5',
        fullName: 'Charlie Brown',
        nim: '1911522014'
      }
    ],
    createdAt: '2022-01-10T00:00:00Z',
    updatedAt: '2022-01-10T00:00:00Z',
  },
  {
    id: '4',
    company: 'Gojek',
    position: 'UX Designer',
    respondentId: 'resp-4',
    respondent: {
      id: 'resp-4',
      fullName: 'Dewi Kartika',
      email: 'dewi.kartika@gojek.com',
      role: 'MANAGER',
      createdAt: '2023-08-15T00:00:00Z',
      updatedAt: '2023-08-15T00:00:00Z',
    },
    workingAlumni: [],
    createdAt: '2023-08-15T00:00:00Z',
    updatedAt: '2023-08-15T00:00:00Z',
  },
  {
    id: '5',
    company: 'Tokopedia',
    position: 'Backend Developer',
    respondentId: 'resp-5',
    respondent: {
      id: 'resp-5',
      fullName: 'Eko Prasetyo',
      email: 'eko.prasetyo@tokopedia.com',
      role: 'MANAGER',
      createdAt: '2021-01-05T00:00:00Z',
      updatedAt: '2021-01-05T00:00:00Z',
    },
    workingAlumni: [
      {
        id: 'alumni-6',
        fullName: 'David Lee',
        nim: '1911522015'
      }
    ],
    createdAt: '2021-01-05T00:00:00Z',
    updatedAt: '2021-01-05T00:00:00Z',
  },
  {
    id: '6',
    company: 'Shopee',
    position: 'Frontend Developer',
    respondentId: 'resp-6',
    respondent: {
      id: 'resp-6',
      fullName: 'Fina Rahayu',
      email: 'fina.rahayu@shopee.com',
      role: 'MANAGER',
      createdAt: '2023-03-12T00:00:00Z',
      updatedAt: '2023-03-12T00:00:00Z',
    },
    workingAlumni: [],
    createdAt: '2023-03-12T00:00:00Z',
    updatedAt: '2023-03-12T00:00:00Z',
  },
  {
    id: '7',
    company: 'PT Astra International',
    position: 'Business Analyst',
    respondentId: 'resp-7',
    respondent: {
      id: 'resp-7',
      fullName: 'Gita Sari',
      email: 'gita.sari@astra.co.id',
      role: 'MANAGER',
      createdAt: '2022-09-08T00:00:00Z',
      updatedAt: '2022-09-08T00:00:00Z',
    },
    workingAlumni: [
      {
        id: 'alumni-7',
        fullName: 'Emma Watson',
        nim: '1911522016'
      },
      {
        id: 'alumni-8',
        fullName: 'Frank Miller',
        nim: '1911522017'
      }
    ],
    createdAt: '2022-09-08T00:00:00Z',
    updatedAt: '2022-09-08T00:00:00Z',
  },
  {
    id: '8',
    company: 'Microsoft Indonesia',
    position: 'Cloud Solutions Architect',
    respondentId: 'resp-8',
    respondent: {
      id: 'resp-8',
      fullName: 'Hendra Wijaya',
      email: 'hendra.wijaya@microsoft.com',
      role: 'MANAGER',
      createdAt: '2023-11-20T00:00:00Z',
      updatedAt: '2023-11-20T00:00:00Z',
    },
    workingAlumni: [],
    createdAt: '2023-11-20T00:00:00Z',
    updatedAt: '2023-11-20T00:00:00Z',
  },
];

function ManagerDatabase() {
  const navigate = useNavigate();
  const [managers, setManagers] = React.useState<Manager[]>(mockManagers);
  const [filteredManagers, setFilteredManagers] =
    React.useState<Manager[]>(mockManagers);
  const [showFilters, setShowFilters] = React.useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCompany, setSelectedCompany] = React.useState<string>('');
  const [selectedPosition, setSelectedPosition] = React.useState<string>('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  // Dialog states
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [showImportDialog, setShowImportDialog] = React.useState(false);
  const [editingManager, setEditingManager] = React.useState<Manager | null>(null);

  // Form states for manual add
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    company: '',
    position: '',
  });

  // Alumni selection states
  const [selectedAlumni, setSelectedAlumni] = React.useState<WorkingAlumni[]>([]);
  const [alumniSearchQuery, setAlumniSearchQuery] = React.useState('');
  const [showAlumniSelector, setShowAlumniSelector] = React.useState(false);

  // Import states
  const [importPreview, setImportPreview] = React.useState<ImportManagerData[]>(
    []
  );
  const [showImportPreview, setShowImportPreview] = React.useState(false);
  
  // Get unique companies and positions for filter
  const companies = React.useMemo(() => {
    const uniqueCompanies = [...new Set(managers.map((m) => m.company))].sort();
    return uniqueCompanies;
  }, [managers]);
  
  const positions = React.useMemo(() => {
    const uniquePositions = [
      ...new Set(managers.map((m) => m.position)),
    ].sort();
    return uniquePositions;
  }, [managers]);

  // Filter alumni berdasarkan search query
  const filteredAlumni = React.useMemo(() => {
    if (!alumniSearchQuery.trim()) return mockAlumni;
    
    return mockAlumni.filter(
      (alumni) =>
        alumni.fullName.toLowerCase().includes(alumniSearchQuery.toLowerCase()) ||
        alumni.nim.toLowerCase().includes(alumniSearchQuery.toLowerCase())
    );
  }, [alumniSearchQuery]);
  
  // Apply filters
  React.useEffect(() => {
    let filtered = [...managers];
    
    // Search by name or email
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (manager) =>
          manager.respondent.fullName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          manager.respondent.email
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by company
    if (selectedCompany && selectedCompany !== 'all') {
      filtered = filtered.filter(
        (manager) => manager.company === selectedCompany
      );
    }
    
    // Filter by position
    if (selectedPosition && selectedPosition !== 'all') {
      filtered = filtered.filter(
        (manager) => manager.position === selectedPosition
      );
    }

    setFilteredManagers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [managers, searchQuery, selectedCompany, selectedPosition]);
  
  // Pagination
  const totalPages = Math.ceil(filteredManagers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentManagers = filteredManagers.slice(startIndex, endIndex);
  
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

  // Handle manual form submission
  const handleManualSubmit = () => {
    // Validate form
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.company ||
      !formData.position
    ) {
      toast.error('Semua field harus diisi');
      return;
    }

    // Check if email already exists
    if (managers.some((m) => m.respondent.email === formData.email)) {
      toast.error('Email sudah terdaftar');
      return;
    }

    // Create new manager
    const newManager: Manager = {
      id: `manager-${Date.now()}`,
      company: formData.company,
      position: formData.position,
      respondentId: `resp-${Date.now()}`,
      respondent: {
        id: `resp-${Date.now()}`,
        fullName: formData.fullName,
        email: formData.email,
        role: 'MANAGER',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      workingAlumni: selectedAlumni,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to managers list
    setManagers((prev) => [...prev, newManager]);
    setShowAddDialog(false);

    // Reset form
    setFormData({
      fullName: '',
      email: '',
      company: '',
      position: '',
    });
    setSelectedAlumni([]);

    toast.success('Data manager berhasil ditambahkan');
  };

  // Handle file import
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error('File harus berformat Excel (.xlsx atau .xls)');
      return;
    }

    // Simulate Excel parsing (in real app, use a library like xlsx)
    const mockParsedData: ImportManagerData[] = [
      {
        fullName: 'John Manager',
        email: 'john.manager@company.com',
        company: 'PT Teknologi Baru',
        position: 'Project Manager',
      },
      {
        fullName: 'Jane Director',
        email: 'jane.director@company.com',
        company: 'PT Inovasi Digital',
        position: 'Technical Director',
      },
    ];

    setImportPreview(mockParsedData);
    setShowImportPreview(true);
  };

  // Handle import confirmation
  const handleImportConfirm = () => {
    if (importPreview.length === 0) {
      toast.error('Tidak ada data untuk diimport');
      return;
    }

    // Process import data
    const newManagerList: Manager[] = importPreview.map((item, index) => {
      return {
        id: `manager-import-${Date.now()}-${index}`,
        company: item.company,
        position: item.position,
        respondentId: `resp-import-${Date.now()}-${index}`,
        respondent: {
          id: `resp-import-${Date.now()}-${index}`,
          fullName: item.fullName,
          email: item.email,
          role: 'MANAGER',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        workingAlumni: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    // Add to managers list
    setManagers((prev) => [...prev, ...newManagerList]);
    setShowImportDialog(false);
    setShowImportPreview(false);
    setImportPreview([]);

    toast.success(`${newManagerList.length} data manager berhasil diimport`);
  };

  // Reset import
  const resetImport = () => {
    setImportPreview([]);
    setShowImportPreview(false);
  };

  // Alumni management functions
  const addAlumni = (alumni: { id: string; fullName: string; nim: string }) => {
    if (selectedAlumni.some((a) => a.id === alumni.id)) {
      toast.error('Alumni sudah dipilih');
      return;
    }
    
    setSelectedAlumni((prev) => [...prev, alumni]);
    setShowAlumniSelector(false);
    setAlumniSearchQuery('');
  };

  const removeAlumni = (alumniId: string) => {
    setSelectedAlumni((prev) => prev.filter((a) => a.id !== alumniId));
  };

  // Edit and Delete functions
  const handleEditManager = (manager: Manager) => {
    setEditingManager(manager);
    setFormData({
      fullName: manager.respondent.fullName,
      email: manager.respondent.email,
      company: manager.company,
      position: manager.position,
    });
    setSelectedAlumni(manager.workingAlumni);
    setShowEditDialog(true);
  };

  const handleUpdateManager = () => {
    if (!editingManager) return;

    // Validate form
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.company ||
      !formData.position
    ) {
      toast.error('Semua field harus diisi');
      return;
    }

    // Check if email already exists (excluding current manager)
    if (
      managers.some(
        (m) => m.respondent.email === formData.email && m.id !== editingManager.id
      )
    ) {
      toast.error('Email sudah terdaftar');
      return;
    }

    // Update manager
    const updatedManager: Manager = {
      ...editingManager,
      company: formData.company,
      position: formData.position,
      respondent: {
        ...editingManager.respondent,
        fullName: formData.fullName,
        email: formData.email,
        updatedAt: new Date().toISOString(),
      },
      workingAlumni: selectedAlumni,
      updatedAt: new Date().toISOString(),
    };

    setManagers((prev) =>
      prev.map((m) => (m.id === editingManager.id ? updatedManager : m))
    );
    setShowEditDialog(false);
    setEditingManager(null);

    // Reset form
    setFormData({
      fullName: '',
      email: '',
      company: '',
      position: '',
    });
    setSelectedAlumni([]);

    toast.success('Data manager berhasil diperbarui');
  };

  
  return (
    <AdminLayout>
      <div className='p-6 space-y-6'>
        {/* Header */}
        <div className='mb-6'>
          <div className='flex items-center justify-between'>
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

            {/* Action Buttons */}
            <div className='flex items-center gap-3'>
              <Sheet
                open={showAddDialog}
                onOpenChange={setShowAddDialog}
              >
                <SheetTrigger asChild>
                  <Button className='flex items-center gap-2'>
                    <Plus className='h-4 w-4' />
                    Tambah Manual
                  </Button>
                </SheetTrigger>
                <SheetContent className='w-[500px] sm:w-[600px]'>
                  <SheetHeader>
                    <SheetTitle className='text-xl font-semibold'>
                      Tambah Data Manager
                    </SheetTitle>
                    <SheetDescription>
                      Masukkan data manager secara manual. Semua field yang
                      bertanda (*) wajib diisi.
                    </SheetDescription>
                  </SheetHeader>

                  <div className='px-4 space-y-4'>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='fullName'
                        className='text-sm font-medium'
                      >
                        Nama Lengkap *
                      </Label>
                      <Input
                        id='fullName'
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            fullName: e.target.value,
                          }))
                        }
                        placeholder='Masukkan nama lengkap'
                        className='h-10'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='email'
                        className='text-sm font-medium'
                      >
                        Email *
                      </Label>
                      <Input
                        id='email'
                        type='email'
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder='Masukkan email'
                        className='h-10'
                      />
        </div>
        
                    <div className='space-y-2'>
                      <Label
                        htmlFor='company'
                        className='text-sm font-medium'
                      >
                        Perusahaan *
                      </Label>
                      <Input
                        id='company'
                        value={formData.company}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            company: e.target.value,
                          }))
                        }
                        placeholder='Masukkan nama perusahaan'
                        className='h-10'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='position'
                        className='text-sm font-medium'
                      >
                        Posisi *
                      </Label>
                      <Input
                        id='position'
                        value={formData.position}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            position: e.target.value,
                          }))
                        }
                        placeholder='Masukkan posisi/jabatan'
                        className='h-10'
                      />
                    </div>

                    {/* Alumni Selection */}
                    <div className='space-y-2'>
                      <Label className='text-sm font-medium'>
                        Alumni yang Bekerja
                      </Label>
                      
                      {/* Add Alumni Button */}
                      <Button
                        type='button'
                        variant='outline'
                        onClick={() => setShowAlumniSelector(!showAlumniSelector)}
                        className='w-full h-10 justify-start'
                      >
                        <Plus className='h-4 w-4 mr-2' />
                        {selectedAlumni.length === 0 ? 'Tambah Alumni' : `Tambah Alumni Lainnya (${selectedAlumni.length} terpilih)`}
                      </Button>

                      {/* Alumni Selector Popover */}
                      {showAlumniSelector && (
                        <div className='border rounded-lg p-4 bg-background shadow-sm'>
                          {/* Search Input */}
                          <div className='relative mb-3'>
                            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                            <Input
                              placeholder='Cari alumni berdasarkan nama atau NIM...'
                              value={alumniSearchQuery}
                              onChange={(e) => setAlumniSearchQuery(e.target.value)}
                              className='pl-10 h-9'
                            />
                          </div>

                          {/* Alumni List */}
                          <div className='max-h-40 overflow-y-auto border rounded-lg'>
                            {filteredAlumni.length > 0 ? (
                              <div className='space-y-1 p-2'>
                                {filteredAlumni.map((alumni) => (
                                  <div
                                    key={alumni.id}
                                    className='flex items-center justify-between p-2 hover:bg-muted/50 rounded-md cursor-pointer'
                                    onClick={() => addAlumni(alumni)}
                                  >
                                    <div>
                                      <div className='font-medium text-sm'>{alumni.fullName}</div>
                                      <div className='text-xs text-muted-foreground'>
                                        NIM: {alumni.nim}
                                      </div>
                                    </div>
                                    <Button
                                      type='button'
                                      variant='ghost'
                                      size='sm'
                                      className='h-6 w-6 p-0'
                                    >
                                      <Plus className='h-3 w-3' />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className='p-4 text-center text-muted-foreground text-sm'>
                                Tidak ada alumni ditemukan
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Selected Alumni Display */}
                      {selectedAlumni.length > 0 && (
                        <div className='space-y-2'>
                          <div className='text-xs text-muted-foreground'>
                            Alumni terpilih ({selectedAlumni.length}):
                          </div>
                          <div className='space-y-1'>
                            {selectedAlumni.map((alumni) => (
                              <div
                                key={alumni.id}
                                className='flex items-center justify-between bg-muted/30 rounded-md p-2 text-sm'
                              >
                                <span>{alumni.fullName} - {alumni.nim}</span>
                                <Button
                                  type='button'
                                  variant='ghost'
                                  size='sm'
                                  onClick={() => removeAlumni(alumni.id)}
                                  className='h-6 w-6 p-0 text-muted-foreground hover:text-destructive'
                                >
                                  <X className='h-3 w-3' />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <SheetFooter className='gap-2'>
                    <Button
                      variant='outline'
                      onClick={() => setShowAddDialog(false)}
                      className='flex-1'
                    >
                      Batal
                    </Button>
                    <Button
                      onClick={handleManualSubmit}
                      className='flex-1'
                    >
                      Simpan Data
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              {/* Edit Manager Sheet */}
              <Sheet
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
              >
                <SheetContent className='w-[500px] sm:w-[600px]'>
                  <SheetHeader>
                    <SheetTitle className='text-xl font-semibold'>
                      Edit Data Manager
                    </SheetTitle>
                    <SheetDescription>
                      Perbarui data manager. Semua field yang bertanda (*) wajib diisi.
                    </SheetDescription>
                  </SheetHeader>

                  <div className='px-4 space-y-4'>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='edit-fullName'
                        className='text-sm font-medium'
                      >
                        Nama Lengkap *
                      </Label>
                      <Input
                        id='edit-fullName'
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            fullName: e.target.value,
                          }))
                        }
                        placeholder='Masukkan nama lengkap'
                        className='h-10'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='edit-email'
                        className='text-sm font-medium'
                      >
                        Email *
                      </Label>
                      <Input
                        id='edit-email'
                        type='email'
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder='Masukkan email'
                        className='h-10'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label
                        htmlFor='edit-company'
                        className='text-sm font-medium'
                      >
                        Perusahaan *
                      </Label>
                      <Input
                        id='edit-company'
                        value={formData.company}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            company: e.target.value,
                          }))
                        }
                        placeholder='Masukkan nama perusahaan'
                        className='h-10'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='edit-position'
                        className='text-sm font-medium'
                      >
                        Posisi *
                      </Label>
                      <Input
                        id='edit-position'
                        value={formData.position}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            position: e.target.value,
                          }))
                        }
                        placeholder='Masukkan posisi/jabatan'
                        className='h-10'
                      />
                    </div>

                    {/* Alumni Selection */}
                    <div className='space-y-2'>
                      <Label className='text-sm font-medium'>
                        Alumni yang Bekerja
                      </Label>
                      
                      {/* Add Alumni Button */}
                      <Button
                        type='button'
                        variant='outline'
                        onClick={() => setShowAlumniSelector(!showAlumniSelector)}
                        className='w-full h-10 justify-start'
                      >
                        <Plus className='h-4 w-4 mr-2' />
                        {selectedAlumni.length === 0 ? 'Tambah Alumni' : `Tambah Alumni Lainnya (${selectedAlumni.length} terpilih)`}
                      </Button>

                      {/* Alumni Selector Popover */}
                      {showAlumniSelector && (
                        <div className='border rounded-lg p-4 bg-background shadow-sm'>
                          {/* Search Input */}
                          <div className='relative mb-3'>
                            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                            <Input
                              placeholder='Cari alumni berdasarkan nama atau NIM...'
                              value={alumniSearchQuery}
                              onChange={(e) => setAlumniSearchQuery(e.target.value)}
                              className='pl-10 h-9'
                            />
                          </div>

                          {/* Alumni List */}
                          <div className='max-h-40 overflow-y-auto border rounded-lg'>
                            {filteredAlumni.length > 0 ? (
                              <div className='space-y-1 p-2'>
                                {filteredAlumni.map((alumni) => (
                                  <div
                                    key={alumni.id}
                                    className='flex items-center justify-between p-2 hover:bg-muted/50 rounded-md cursor-pointer'
                                    onClick={() => addAlumni(alumni)}
                                  >
                                    <div>
                                      <div className='font-medium text-sm'>{alumni.fullName}</div>
                                      <div className='text-xs text-muted-foreground'>
                                        NIM: {alumni.nim}
                                      </div>
                                    </div>
                                    <Button
                                      type='button'
                                      variant='ghost'
                                      size='sm'
                                      className='h-6 w-6 p-0'
                                    >
                                      <Plus className='h-3 w-3' />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className='p-4 text-center text-muted-foreground text-sm'>
                                Tidak ada alumni ditemukan
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Selected Alumni Display */}
                      {selectedAlumni.length > 0 && (
                        <div className='space-y-2'>
                          <div className='text-xs text-muted-foreground'>
                            Alumni terpilih ({selectedAlumni.length}):
                          </div>
                          <div className='space-y-1'>
                            {selectedAlumni.map((alumni) => (
                              <div
                                key={alumni.id}
                                className='flex items-center justify-between bg-muted/30 rounded-md p-2 text-sm'
                              >
                                <span>{alumni.fullName} - {alumni.nim}</span>
                                <Button
                                  type='button'
                                  variant='ghost'
                                  size='sm'
                                  onClick={() => removeAlumni(alumni.id)}
                                  className='h-6 w-6 p-0 text-muted-foreground hover:text-destructive'
                                >
                                  <X className='h-3 w-3' />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <SheetFooter className='gap-2'>
                    <Button
                      variant='outline'
                      onClick={() => setShowEditDialog(false)}
                      className='flex-1'
                    >
                      Batal
                    </Button>
                    <Button
                      onClick={handleUpdateManager}
                      className='flex-1'
                    >
                      Perbarui Data
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              <Dialog
                open={showImportDialog}
                onOpenChange={setShowImportDialog}
              >
                <DialogTrigger asChild>
                  <Button
                    variant='outline'
                    className='flex items-center gap-2'
                  >
                    <Upload className='h-4 w-4' />
                    Import Excel
                  </Button>
                </DialogTrigger>
                <DialogContent className='max-w-4xl'>
                  <DialogHeader>
                    <DialogTitle>Import Data Manager dari Excel</DialogTitle>
                    <DialogDescription>
                      Upload file Excel dengan format yang sesuai. Pastikan
                      kolom: Nama Lengkap, Email, Perusahaan, Posisi
                    </DialogDescription>
                  </DialogHeader>

                  {!showImportPreview ? (
                    <div className='py-6'>
                      <div className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center'>
                        <FileSpreadsheet className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                        <div className='space-y-2'>
                          <p className='text-lg font-medium'>
                            Upload File Excel
                          </p>
                          <p className='text-sm text-gray-500'>
                            Format yang didukung: .xlsx, .xls
                          </p>
                        </div>
                        <div className='mt-6'>
                          <input
                            type='file'
                            accept='.xlsx,.xls'
                            onChange={handleFileImport}
                            className='hidden'
                            id='excel-upload'
                          />
                          <Button asChild>
                            <label
                              htmlFor='excel-upload'
                              className='cursor-pointer'
                            >
                              Pilih File
                            </label>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className='py-4'>
                      <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-lg font-medium'>
                          Preview Data ({importPreview.length} baris)
                        </h3>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={resetImport}
                        >
                          <X className='h-4 w-4 mr-2' />
                          Ganti File
                        </Button>
                </div>
                      <div className='border rounded-lg overflow-hidden'>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nama Lengkap</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Perusahaan</TableHead>
                              <TableHead>Posisi</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {importPreview.slice(0, 5).map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.fullName}</TableCell>
                                <TableCell>{item.email}</TableCell>
                                <TableCell>{item.company}</TableCell>
                                <TableCell>{item.position}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        {importPreview.length > 5 && (
                          <div className='p-2 text-sm text-gray-500 text-center'>
                            ... dan {importPreview.length - 5} baris lainnya
              </div>
                        )}
                </div>
              </div>
                  )}

                  <DialogFooter>
                    <Button
                      variant='outline'
                      onClick={() => setShowImportDialog(false)}
                    >
                      Batal
                    </Button>
                    {showImportPreview && (
                      <Button onClick={handleImportConfirm}>
                        Import {importPreview.length} Data
                      </Button>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
                </div>
              </div>
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
                      {filteredManagers.length}
                    </span>{' '}
                    dari{' '}
                    <span className='font-semibold text-foreground'>
                      {managers.length}
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
                   <TableHead className='font-semibold'>Alumni yang Bekerja</TableHead>
                   <TableHead className='font-semibold'>Actions</TableHead>
                 </TableRow>
              </TableHeader>
              <TableBody>
                {currentManagers.map((manager) => (
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
                     <TableCell>
                       <div className='space-y-1'>
                         {manager.workingAlumni.length > 0 ? (
                           manager.workingAlumni.map((alumni) => (
                             <div key={alumni.id} className='text-sm'>
                               {alumni.fullName} - {alumni.nim}
                             </div>
                           ))
                         ) : (
                           <div className='text-sm text-muted-foreground italic'>
                             Belum ada alumni
                           </div>
                         )}
                       </div>
                     </TableCell>
                     <TableCell>
                       <div className='flex items-center gap-2'>
                         <Button
                           variant='ghost'
                           size='sm'
                           onClick={() => handleEditManager(manager)}
                           className='h-8 w-8 p-0'
                         >
                           <Edit className='h-4 w-4' />
                         </Button>
                       </div>
                     </TableCell>
                   </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className='flex justify-center p-4 border-t border-border/50'>
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
          
          {/* Empty State */}
          {filteredManagers.length === 0 && (
            <div className='text-center py-12'>
              <Users className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
              <h3 className='text-lg font-semibold text-foreground mb-2'>
                Tidak ada manager ditemukan
              </h3>
              <p className='text-muted-foreground mb-4'>
                Coba ubah filter atau kata kunci pencarian Anda
              </p>
              <Button
                onClick={clearFilters}
                variant='outline'
              >
                Hapus Semua Filter
              </Button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default ManagerDatabase;
