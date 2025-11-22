/** @format */

import React, {useState, useRef} from 'react';
import {Card, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Checkbox} from '@/components/ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
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
import {showSequentialErrorToasts} from '@/lib/error-toast';
import {
  useAdmins,
  useCreateAdmin,
  useUpdateAdmin,
  useDeleteAdmin,
  type Admin,
  type Role,
} from '@/api/admin.api';
import {useRoles as useRolesApi} from '@/api/role-permission.api';

const AdminManagement: React.FC = () => {
  const navigate = useNavigate();

  // API hooks
  const {data: adminsData, isLoading: isLoadingAdmins} = useAdmins({
    limit: 100,
  });
  const {data: rolesData} = useRolesApi({limit: 100});
  const createAdminMutation = useCreateAdmin();
  const updateAdminMutation = useUpdateAdmin();
  const deleteAdminMutation = useDeleteAdmin();

  const admins = adminsData?.admins || [];
  const roles = rolesData?.roles || [];

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
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

  // Click outside handler
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsRoleDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      if (
        !formData.username.trim() ||
        !formData.name.trim() ||
        !formData.email.trim()
      ) {
        toast.error('Username, nama, dan email harus diisi');
        return;
      }

      if (formData.selectedRoles.length === 0) {
        toast.error('Minimal satu role harus dipilih');
        return;
      }

      if (editingAdmin) {
        await updateAdminMutation.mutateAsync({
          id: editingAdmin.id,
          data: {
            username: formData.username,
            name: formData.name,
            email: formData.email,
            isActive: formData.isActive,
            roleIds: formData.selectedRoles,
          },
        });
        toast.success('Admin berhasil diperbarui');
      } else {
        await createAdminMutation.mutateAsync({
          username: formData.username,
          name: formData.name,
          email: formData.email,
          isActive: formData.isActive,
          roleIds: formData.selectedRoles,
        });
        toast.success('Admin berhasil dibuat');
      }

      setIsSheetOpen(false);
      resetForm();
    } catch (err) {
      const error = err as {
        response?: {
          data?: {
            message?: Array<{field: string; message: string}> | string;
          };
        };
      };

      if (error.response?.data?.message) {
        const errorMessage = error.response.data.message;

        if (Array.isArray(errorMessage)) {
          const messages = errorMessage.map((err) => {
            const fieldLabel = err.field || 'Error';
            const messageDetail = err.message || 'Terjadi kesalahan';
            return `${fieldLabel}: ${messageDetail}`;
          });
          showSequentialErrorToasts({messages});
        } else if (typeof errorMessage === 'string') {
          toast.error(errorMessage);
        }
      } else {
        toast.error(
          editingAdmin ? 'Gagal memperbarui admin' : 'Gagal membuat admin'
        );
      }
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    try {
      await deleteAdminMutation.mutateAsync(adminId);
      toast.success('Admin berhasil dihapus');
    } catch (err) {
      const error = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };
      toast.error(error.response?.data?.message || 'Gagal menghapus admin');
    }
  };

  const openEditDialog = (admin: Admin) => {
    setEditingAdmin(admin);
    setFormData({
      username: admin.username,
      name: admin.name,
      email: admin.email,
      isActive: admin.isActive,
      selectedRoles: admin.roles.map((role) => role.roleId),
    });
    setIsRoleDropdownOpen(false);
    setIsSheetOpen(true);
  };

  const handleRoleToggle = (roleId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedRoles: prev.selectedRoles.includes(roleId)
        ? prev.selectedRoles.filter((id) => id !== roleId)
        : [...prev.selectedRoles, roleId],
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
                      : 'Buat admin baru dengan role yang sesuai'}
                  </SheetDescription>
                </SheetHeader>

                <div className='space-y-6 px-4'>
                  {/* Basic Info Section */}
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='username'
                        className='text-sm font-medium'
                      >
                        Username
                      </Label>
                      <Input
                        id='username'
                        placeholder='Masukkan username'
                        value={formData.username}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            username: e.target.value,
                          }))
                        }
                        className='h-10'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label
                        htmlFor='name'
                        className='text-sm font-medium'
                      >
                        Nama Lengkap
                      </Label>
                      <Input
                        id='name'
                        placeholder='Masukkan nama lengkap'
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className='h-10'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label
                        htmlFor='email'
                        className='text-sm font-medium'
                      >
                        Email
                      </Label>
                      <Input
                        id='email'
                        type='email'
                        placeholder='Masukkan email'
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className='h-10'
                      />
                    </div>

                    <div className='flex items-center space-x-2'>
                      <Checkbox
                        id='isActive'
                        checked={formData.isActive}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            isActive: checked as boolean,
                          }))
                        }
                      />
                      <Label
                        htmlFor='isActive'
                        className='text-sm font-medium'
                      >
                        Admin Aktif
                      </Label>
                    </div>
                  </div>

                  {/* Role Selection Section */}
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Label className='text-sm font-medium'>Pilih Role</Label>
                      <div
                        className='relative'
                        ref={popupRef}
                      >
                        <Button
                          variant='outline'
                          onClick={() => setIsRoleDropdownOpen(true)}
                          className='w-full justify-between'
                        >
                          {formData.selectedRoles.length > 0
                            ? `${formData.selectedRoles.length} role dipilih`
                            : 'Pilih role...'}
                          <ChevronRight className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>

                        {/* Role Selection Dropdown */}
                        {isRoleDropdownOpen && (
                          <div className='absolute top-full left-0 z-50 mt-1 w-full'>
                            <div className='bg-background border rounded-md shadow-lg'>
                              <Command>
                                <CommandInput placeholder='Cari role...' />
                                <CommandList>
                                  <CommandEmpty>
                                    Role tidak ditemukan.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {roles.map((role: Role) => (
                                      <CommandItem
                                        key={role.id}
                                        value={role.roleName}
                                        onSelect={() =>
                                          handleRoleToggle(role.id)
                                        }
                                        className='flex items-center justify-between w-full p-3'
                                      >
                                        <div className='flex items-center space-x-3'>
                                          <Checkbox
                                            checked={formData.selectedRoles.includes(
                                              role.id
                                            )}
                                            className='h-4 w-4'
                                          />
                                          <div>
                                            <span className='font-medium'>
                                              {role.roleName}
                                            </span>
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
                        <Label className='text-sm font-medium'>
                          Role yang Dipilih
                        </Label>
                        <div className='space-y-2 max-h-[200px] overflow-y-auto border rounded-md p-3'>
                          {formData.selectedRoles.map((roleId) => {
                            const role = roles.find(
                              (r: Role) => r.id === roleId
                            );
                            return (
                              <div
                                key={roleId}
                                className='flex items-center justify-between bg-muted/50 rounded-md p-2'
                              >
                                <div className='flex items-center space-x-2'>
                                  <span className='text-sm font-medium'>
                                    {role?.roleName}
                                  </span>
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
                    disabled={
                      createAdminMutation.isPending ||
                      updateAdminMutation.isPending
                    }
                    className='flex-1'
                  >
                    {createAdminMutation.isPending ||
                    updateAdminMutation.isPending
                      ? 'Menyimpan...'
                      : editingAdmin
                      ? 'Simpan Perubahan'
                      : 'Simpan Admin'}
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
                {isLoadingAdmins ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className='text-center py-8'
                    >
                      <p className='text-muted-foreground'>Memuat data...</p>
                    </TableCell>
                  </TableRow>
                ) : admins.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className='text-center py-8'
                    >
                      <p className='text-muted-foreground'>Belum ada admin</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  admins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className='font-medium'>
                        {admin.username}
                      </TableCell>
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
                        <Badge
                          variant={admin.isActive ? 'default' : 'secondary'}
                        >
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
                                  disabled={deleteAdminMutation.isPending}
                                  className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                >
                                  {deleteAdminMutation.isPending
                                    ? 'Menghapus...'
                                    : 'Hapus'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminManagement;
