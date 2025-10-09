/** @format */

import React, {useState, useEffect, useRef} from 'react';
import {Card, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Checkbox} from '@/components/ui/checkbox';
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from '@/components/ui/command';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {Badge} from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {Plus, Edit, Trash2, Users, ChevronRight} from 'lucide-react';
import {toast} from 'sonner';
import {AdminLayout} from '@/components/layout/admin';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {useNavigate} from 'react-router-dom';

// Interface untuk Admin
interface Admin {
  id: string;
  username: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  roles: AdminRole[];
}

// Interface untuk AdminRole
interface AdminRole {
  adminId: string;
  roleId: string;
  role: Role;
}

// Interface untuk Role (dari RoleManagement)
interface Role {
  id: string;
  roleName: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

const AdminManagement: React.FC = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    isActive: true,
    selectedRoles: [] as string[],
  });

  // Role dropdown state
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadAdmins();
    loadRoles();
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call to fetch admins
      // const response = await fetch('/api/admins');
      // const data = await response.json();
      // setAdmins(data);

      // Mock data for now
      setAdmins([
        {
          id: '1',
          username: 'admin1',
          name: 'Super Administrator',
          email: 'admin1@example.com',
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
          roles: [
            {
              adminId: '1',
              roleId: '1',
              role: {
                id: '1',
                roleName: 'Super Admin',
                description: 'Memiliki akses penuh ke semua fitur sistem',
                createdAt: '2024-01-01',
                updatedAt: '2024-01-01',
              },
            },
          ],
        },
        {
          id: '2',
          username: 'survey_manager',
          name: 'Survey Manager',
          email: 'survey@example.com',
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
          roles: [
            {
              adminId: '2',
              roleId: '2',
              role: {
                id: '2',
                roleName: 'Survey Manager',
                description: 'Mengelola survey dan pertanyaan',
                createdAt: '2024-01-01',
                updatedAt: '2024-01-01',
              },
            },
          ],
        },
      ]);
    } catch {
      toast.error('Gagal memuat data admin');
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      // TODO: Implement API call to fetch roles
      // const response = await fetch('/api/roles');
      // const data = await response.json();
      // setRoles(data);

      // Mock data for now
      setRoles([
        {
          id: '1',
          roleName: 'Super Admin',
          description: 'Memiliki akses penuh ke semua fitur sistem',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        {
          id: '2',
          roleName: 'Survey Manager',
          description: 'Mengelola survey dan pertanyaan',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        {
          id: '3',
          roleName: 'Content Admin',
          description: 'Mengelola konten dan FAQ',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ]);
    } catch {
      toast.error('Gagal memuat data role');
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      name: '',
      email: '',
      isActive: true,
      selectedRoles: [],
    });
    setEditingAdmin(null);
    setIsRoleDropdownOpen(false);
  };

  const handleSaveAdmin = async () => {
    try {
      if (!formData.username.trim() || !formData.name.trim() || !formData.email.trim()) {
        toast.error('Username, nama, dan email harus diisi');
        return;
      }


      if (formData.selectedRoles.length === 0) {
        toast.error('Minimal satu role harus dipilih');
        return;
      }

      setLoading(true);
      
      if (editingAdmin) {
        // Edit existing admin
        // TODO: Implement API call to update admin
        // const response = await fetch(`/api/admins/${editingAdmin.id}`, {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData)
        // });

        // Mock success
        const updatedAdmins = admins.map((admin) =>
          admin.id === editingAdmin.id
            ? {
                ...admin,
                username: formData.username,
                name: formData.name,
                email: formData.email,
                isActive: formData.isActive,
                updatedAt: new Date().toISOString(),
                roles: formData.selectedRoles.map(roleId => ({
                  adminId: admin.id,
                  roleId,
                  role: roles.find(r => r.id === roleId)!,
                })),
              }
            : admin
        );
        setAdmins(updatedAdmins);
        toast.success('Admin berhasil diperbarui');
      } else {
        // Create new admin
        // TODO: Implement API call to create admin
        // const response = await fetch('/api/admins', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData)
        // });

        // Mock success
        const newAdmin: Admin = {
          id: Date.now().toString(),
          username: formData.username,
          name: formData.name,
          email: formData.email,
          isActive: formData.isActive,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          roles: formData.selectedRoles.map(roleId => ({
            adminId: Date.now().toString(),
            roleId,
            role: roles.find(r => r.id === roleId)!,
          })),
        };

        setAdmins([...admins, newAdmin]);
        toast.success('Admin berhasil dibuat');
      }

      setIsSheetOpen(false);
      resetForm();
    } catch {
      toast.error(editingAdmin ? 'Gagal memperbarui admin' : 'Gagal membuat admin');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    try {
      setLoading(true);
      // TODO: Implement API call to delete admin
      // const response = await fetch(`/api/admins/${adminId}`, {
      //     method: 'DELETE'
      // });

      // Mock success
      setAdmins(admins.filter((admin) => admin.id !== adminId));
      toast.success('Admin berhasil dihapus');
    } catch {
      toast.error('Gagal menghapus admin');
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (admin: Admin) => {
    setEditingAdmin(admin);
    setFormData({
      username: admin.username,
      name: admin.name,
      email: admin.email,
      isActive: admin.isActive,
      selectedRoles: admin.roles.map(role => role.roleId),
    });
    setIsRoleDropdownOpen(false);
    setIsSheetOpen(true);
  };

  const handleRoleToggle = (roleId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedRoles: prev.selectedRoles.includes(roleId)
        ? prev.selectedRoles.filter(id => id !== roleId)
        : [...prev.selectedRoles, roleId]
    }));
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
                    <Users className='h-4 w-4' />
                    <span>Manajemen User</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Kelola Admin</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Button Tambah Admin */}
            <Sheet
              open={isSheetOpen}
              onOpenChange={setIsSheetOpen}
            >
              <SheetTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className='mr-2 h-4 w-4' />
                  Tambah Admin
                </Button>
              </SheetTrigger>
            <SheetContent className='w-[800px] sm:w-[1000px] overflow-y-auto'>
              <SheetHeader className='pb-4 border-b'>
                <SheetTitle className='text-xl'>
                  {editingAdmin ? 'Edit Admin' : 'Tambah Admin Baru'}
                </SheetTitle>
                <SheetDescription>
                  {editingAdmin 
                    ? 'Perbarui informasi admin dan role yang dimiliki'
                    : 'Buat admin baru dengan role yang sesuai'
                  }
                </SheetDescription>
              </SheetHeader>

              <div className='space-y-6 px-4'>
                {/* Basic Info Section */}
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='username' className='text-sm font-medium'>
                      Username
                    </Label>
                    <Input
                      id='username'
                      placeholder='Masukkan username'
                      value={formData.username}
                      onChange={(e) =>
                        setFormData((prev) => ({...prev, username: e.target.value}))
                      }
                      className='h-10'
                    />
                  </div>


                  <div className='space-y-2'>
                    <Label htmlFor='name' className='text-sm font-medium'>
                      Nama Lengkap
                    </Label>
                    <Input
                      id='name'
                      placeholder='Masukkan nama lengkap'
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({...prev, name: e.target.value}))
                      }
                      className='h-10'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='email' className='text-sm font-medium'>
                      Email
                    </Label>
                    <Input
                      id='email'
                      type='email'
                      placeholder='Masukkan email'
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({...prev, email: e.target.value}))
                      }
                      className='h-10'
                    />
                  </div>

                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      id='isActive'
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({...prev, isActive: checked as boolean}))
                      }
                    />
                    <Label htmlFor='isActive' className='text-sm font-medium'>
                      Admin Aktif
                    </Label>
                  </div>
                </div>

                {/* Role Selection Section */}
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label className='text-sm font-medium'>Pilih Role</Label>
                    <div className='relative' ref={popupRef}>
                      <Button
                        variant="outline"
                        onClick={() => setIsRoleDropdownOpen(true)}
                        className="w-full justify-between"
                      >
                        {formData.selectedRoles.length > 0 
                          ? `${formData.selectedRoles.length} role dipilih` 
                          : "Pilih role..."}
                        <ChevronRight className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>

                      {/* Role Selection Dropdown */}
                      {isRoleDropdownOpen && (
                        <div className="absolute top-full left-0 z-50 mt-1 w-full">
                          <div className="bg-background border rounded-md shadow-lg">
                            <Command>
                              <CommandInput placeholder="Cari role..." />
                              <CommandList>
                                <CommandEmpty>Role tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                  {roles.map((role) => (
                                    <CommandItem
                                      key={role.id}
                                      value={role.roleName}
                                      onSelect={() => handleRoleToggle(role.id)}
                                      className="flex items-center justify-between w-full p-3"
                                    >
                                      <div className='flex items-center space-x-3'>
                                        <Checkbox
                                          checked={formData.selectedRoles.includes(role.id)}
                                          className='h-4 w-4'
                                        />
                                        <div>
                                          <span className='font-medium'>{role.roleName}</span>
                                          {role.description && (
                                            <div className='text-xs text-muted-foreground'>
                                              {role.description}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selected Roles Summary */}
                  {formData.selectedRoles.length > 0 && (
                    <div className='space-y-2'>
                      <Label className='text-sm font-medium'>Role yang Dipilih</Label>
                      <div className='space-y-2 max-h-[200px] overflow-y-auto border rounded-md p-3'>
                        {formData.selectedRoles.map((roleId) => {
                          const role = roles.find(r => r.id === roleId);
                          return (
                            <div key={roleId} className='flex items-center justify-between bg-muted/50 rounded-md p-2'>
                              <div className='flex items-center space-x-2'>
                                <span className='text-sm font-medium'>{role?.roleName}</span>
                                {role?.description && (
                                  <span className='text-xs text-muted-foreground'>
                                    - {role.description}
                                  </span>
                                )}
                              </div>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => handleRoleToggle(roleId)}
                                className='h-6 w-6 p-0 text-destructive hover:text-destructive'
                              >
                                ×
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <SheetFooter className='flex gap-3 pt-4 border-t'>
                <Button
                  variant='outline'
                  onClick={() => setIsSheetOpen(false)}
                  className='flex-1'
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSaveAdmin}
                  disabled={loading}
                  className='flex-1'
                >
                  {loading ? 'Menyimpan...' : (editingAdmin ? 'Simpan Perubahan' : 'Simpan Admin')}
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          </div>
        </div>

        <Card>
          <CardContent className='p-0'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal Dibuat</TableHead>
                  <TableHead className='text-right'>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className='font-medium'>{admin.username}</TableCell>
                    <TableCell>{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      <div className='space-y-1'>
                        {admin.roles.map((adminRole, index) => (
                          <Badge
                            key={index}
                            variant='secondary'
                            className='text-xs'
                          >
                            {adminRole.role.roleName}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={admin.isActive ? 'default' : 'secondary'}>
                        {admin.isActive ? 'Aktif' : 'Tidak Aktif'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(admin.createdAt).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex items-center justify-end gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => openEditDialog(admin)}
                        >
                          <Edit className='h-4 w-4' />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant='outline'
                              size='sm'
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus Admin</AlertDialogTitle>
                              <AlertDialogDescription asChild>
                                <div>
                                  Apakah Anda yakin ingin menghapus admin "
                                  {admin.name}"? Tindakan ini tidak dapat
                                  dibatalkan.
                                </div>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteAdmin(admin.id)}
                                className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                              >
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </AdminLayout>
  );
};

export default AdminManagement;
