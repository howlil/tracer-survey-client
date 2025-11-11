/** @format */

import React, {useState, useRef} from 'react';
import {Card, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
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
import {Plus, Edit, Trash2, UserCheck, ChevronRight} from 'lucide-react';
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
import {
  useRoles,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
  useResources,
  type Role as ApiRole,
} from '@/api/role-permission.api';

// Definisi permissions
interface Permission {
  resource: string;
  actions: string[];
}

const RoleManagement: React.FC = () => {
  const navigate = useNavigate();

  // API hooks
  const {data: rolesData, isLoading: isLoadingRoles} = useRoles({limit: 100});
  const {data: resourcesData} = useResources();
  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const deleteRoleMutation = useDeleteRole();

  const roles = rolesData?.roles || [];
  const RESOURCES = resourcesData || {};

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<ApiRole | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as Permission[],
  });

  // Permission dropdown state
  const [selectedResource, setSelectedResource] = useState<string>('');
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [isResourceDropdownOpen, setIsResourceDropdownOpen] = useState(false);

  // Click outside handler
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsResourceDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      permissions: [],
    });
    setEditingRole(null);
    // Reset dropdown state
    setSelectedResource('');
    setSelectedActions([]);
    setIsResourceDropdownOpen(false);
  };

  const handleSaveRole = async () => {
    try {
      if (!formData.name.trim()) {
        toast.error('Nama role harus diisi');
        return;
      }

      // Convert permissions format to match API expectation
      const permissionIds = formData.permissions.flatMap((perm) =>
        perm.actions.map((action) => `${perm.resource}.${action}`)
      );

      if (editingRole) {
        await updateRoleMutation.mutateAsync({
          id: editingRole.id,
          data: {
            roleName: formData.name,
            description: formData.description,
            permissionIds,
          },
        });
        toast.success('Role berhasil diperbarui');
      } else {
        await createRoleMutation.mutateAsync({
          roleName: formData.name,
          description: formData.description,
          permissionIds,
        });
        toast.success('Role berhasil dibuat');
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
          errorMessage.forEach((err) => {
            toast.error(`${err.field}: ${err.message}`);
          });
        } else if (typeof errorMessage === 'string') {
          toast.error(errorMessage);
        }
      } else {
        toast.error(
          editingRole ? 'Gagal memperbarui role' : 'Gagal membuat role'
        );
      }
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      await deleteRoleMutation.mutateAsync(roleId);
      toast.success('Role berhasil dihapus');
    } catch (err) {
      const error = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };
      toast.error(error.response?.data?.message || 'Gagal menghapus role');
    }
  };

  const openEditDialog = (role: ApiRole) => {
    setEditingRole(role);

    // Convert API permissions format to local format
    const permissionsMap: {[key: string]: string[]} = {};
    role.permissions?.forEach((perm) => {
      if (!perm.permissionName) return;

      const parts = perm.permissionName.split('.');
      if (parts.length < 2) return;

      const resource = parts[0];
      const action = parts[1];

      if (!permissionsMap[resource]) {
        permissionsMap[resource] = [];
      }
      permissionsMap[resource].push(action);
    });

    const permissions: Permission[] = Object.entries(permissionsMap).map(
      ([resource, actions]) => ({
        resource,
        actions,
      })
    );

    setFormData({
      name: role.roleName,
      description: role.description || '',
      permissions,
    });
    // Reset dropdown state
    setSelectedResource('');
    setSelectedActions([]);
    setIsResourceDropdownOpen(false);
    setIsSheetOpen(true);
  };

  const handleResourceSelect = (resource: string) => {
    if (selectedResource === resource) {
      // If same resource clicked, toggle the actions visibility
      setSelectedResource('');
      setSelectedActions([]);
    } else {
      // Select new resource
      setSelectedResource(resource);
      const existingPermission = formData.permissions.find(
        (p) => p.resource === resource
      );
      setSelectedActions(existingPermission?.actions || []);
    }
  };

  const handleActionToggle = (action: string) => {
    const newActions = selectedActions.includes(action)
      ? selectedActions.filter((a) => a !== action)
      : [...selectedActions, action];

    setSelectedActions(newActions);

    // Update formData
    setFormData((prev) => {
      const otherPermissions = prev.permissions.filter(
        (p) => p.resource !== selectedResource
      );
      if (newActions.length > 0) {
        return {
          ...prev,
          permissions: [
            ...otherPermissions,
            {resource: selectedResource, actions: newActions},
          ],
        };
      } else {
        return {
          ...prev,
          permissions: otherPermissions,
        };
      }
    });
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
                    <UserCheck className='h-4 w-4' />
                    <span>Manajemen User</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Kelola Grup Admin</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Button Tambah Role */}
            <Sheet
              open={isSheetOpen}
              onOpenChange={setIsSheetOpen}
            >
              <SheetTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className='mr-2 h-4 w-4' />
                  Tambah Role
                </Button>
              </SheetTrigger>
              <SheetContent className='w-[1100px] sm:w-[1300px] overflow-y-auto'>
                <SheetHeader className='pb-4 border-b'>
                  <SheetTitle className='text-xl'>
                    {editingRole ? 'Edit Role' : 'Tambah Role Baru'}
                  </SheetTitle>
                  <SheetDescription>
                    {editingRole
                      ? 'Perbarui informasi role dan permission untuk admin sistem'
                      : 'Buat role baru dengan permission yang sesuai untuk admin sistem'}
                  </SheetDescription>
                </SheetHeader>

                <div className='space-y-6 px-4 '>
                  {/* Basic Info Section */}
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='name'
                        className='text-sm font-medium'
                      >
                        Nama Role
                      </Label>
                      <Input
                        id='name'
                        placeholder='Contoh: Survey Manager, Content Admin'
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
                        htmlFor='description'
                        className='text-sm font-medium'
                      >
                        Deskripsi
                      </Label>
                      <Textarea
                        id='description'
                        placeholder='Jelaskan fungsi dan tanggung jawab role ini'
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        className='min-h-[80px] resize-none'
                      />
                    </div>
                  </div>

                  {/* Permission Section */}
                  <div className='space-y-4'>
                    <div className='space-y-4'>
                      {/* Single Input with Two Popups */}
                      <div className='space-y-2'>
                        <Label className='text-sm font-medium'>
                          Permission
                        </Label>
                        <div
                          className='relative'
                          ref={popupRef}
                        >
                          {/* Single Input Button */}
                          <Button
                            variant='outline'
                            onClick={() => setIsResourceDropdownOpen(true)}
                            className='w-full justify-between'
                          >
                            {formData.permissions.length > 0
                              ? `${formData.permissions.length} permission dipilih`
                              : 'Pilih permission...'}
                            <Plus className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>

                          {/* Combined Resource and Actions Popup */}
                          {isResourceDropdownOpen && (
                            <div className='absolute top-full left-0 z-50 mt-1'>
                              <div className='bg-background border rounded-md shadow-lg w-[300px]'>
                                <Command>
                                  <CommandInput placeholder='Cari resource atau action...' />
                                  <CommandList>
                                    <CommandEmpty>
                                      Resource tidak ditemukan.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {Object.entries(RESOURCES).map(
                                        ([key, resourceData]) => {
                                          const resource = resourceData as {
                                            name: string;
                                            actions: string[];
                                          };
                                          return (
                                            <div key={key}>
                                              <CommandItem
                                                value={resource.name}
                                                onSelect={() => {
                                                  handleResourceSelect(
                                                    resource.name
                                                  );
                                                }}
                                                className='flex items-center justify-between w-full p-3'
                                              >
                                                <div className='flex items-center space-x-3'>
                                                  <div>
                                                    <span className='capitalize font-medium'>
                                                      {resource.name}
                                                    </span>
                                                    <div className='text-xs text-muted-foreground'>
                                                      {resource.actions.length}{' '}
                                                      actions
                                                    </div>
                                                  </div>
                                                </div>
                                                <ChevronRight className='h-4 w-4 text-muted-foreground' />
                                              </CommandItem>

                                              {/* Actions for selected resource */}
                                              {selectedResource ===
                                                resource.name && (
                                                <div className='ml-6 space-y-1 pb-2 border-l-2 border-muted pl-4'>
                                                  <div className='text-xs font-medium text-muted-foreground mb-2 px-2'>
                                                    Actions untuk{' '}
                                                    {resource.name}:
                                                  </div>
                                                  {resource.actions.length >
                                                  2 ? (
                                                    <div className='grid grid-cols-2 gap-2 px-2'>
                                                      {resource.actions.map(
                                                        (action) => (
                                                          <div
                                                            key={action}
                                                            className='flex items-center space-x-2 py-1'
                                                          >
                                                            <Checkbox
                                                              checked={selectedActions.includes(
                                                                action
                                                              )}
                                                              onCheckedChange={() =>
                                                                handleActionToggle(
                                                                  action
                                                                )
                                                              }
                                                              className='h-3 w-3'
                                                            />
                                                            <span className='text-sm capitalize text-muted-foreground'>
                                                              {action}
                                                            </span>
                                                          </div>
                                                        )
                                                      )}
                                                    </div>
                                                  ) : (
                                                    <div className='space-y-1'>
                                                      {resource.actions.map(
                                                        (action) => (
                                                          <div
                                                            key={action}
                                                            className='flex items-center space-x-2 px-2 py-1'
                                                          >
                                                            <Checkbox
                                                              checked={selectedActions.includes(
                                                                action
                                                              )}
                                                              onCheckedChange={() =>
                                                                handleActionToggle(
                                                                  action
                                                                )
                                                              }
                                                              className='h-3 w-3'
                                                            />
                                                            <span className='text-sm capitalize text-muted-foreground'>
                                                              {action}
                                                            </span>
                                                          </div>
                                                        )
                                                      )}
                                                    </div>
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          );
                                        }
                                      )}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Selected Permissions Summary */}
                      {formData.permissions.length > 0 && (
                        <div className='space-y-2'>
                          <Label className='text-sm font-medium'>
                            Permission yang Dipilih
                          </Label>
                          <div className='space-y-2 max-h-[200px] overflow-y-auto border rounded-md p-3'>
                            {formData.permissions.map((permission, index) => (
                              <div
                                key={index}
                                className='flex items-center justify-between bg-muted/50 rounded-md p-2'
                              >
                                <div className='flex items-center space-x-2'>
                                  <span className='text-sm font-medium capitalize'>
                                    {permission.resource}
                                  </span>
                                  <span className='text-xs text-muted-foreground'>
                                    {permission.actions.join(', ')}
                                  </span>
                                </div>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  onClick={() => {
                                    setFormData((prev) => ({
                                      ...prev,
                                      permissions: prev.permissions.filter(
                                        (_, i) => i !== index
                                      ),
                                    }));
                                  }}
                                  className='h-6 w-6 p-0 text-destructive hover:text-destructive'
                                >
                                  ×
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
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
                    onClick={handleSaveRole}
                    disabled={
                      createRoleMutation.isPending ||
                      updateRoleMutation.isPending
                    }
                    className='flex-1'
                  >
                    {createRoleMutation.isPending ||
                    updateRoleMutation.isPending
                      ? 'Menyimpan...'
                      : editingRole
                      ? 'Simpan Perubahan'
                      : 'Simpan Role'}
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
                  <TableHead>Nama Role</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Permission</TableHead>
                  <TableHead>Tanggal Dibuat</TableHead>
                  <TableHead className='text-right'>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingRoles ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className='text-center py-8'
                    >
                      <p className='text-muted-foreground'>Memuat data...</p>
                    </TableCell>
                  </TableRow>
                ) : roles.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className='text-center py-8'
                    >
                      <p className='text-muted-foreground'>Belum ada role</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  roles.map((role) => {
                    // Group permissions by resource
                    const permissionsMap: {[key: string]: string[]} = {};
                    role.permissions?.forEach((perm) => {
                      if (!perm.permissionName) return;

                      const parts = perm.permissionName.split('.');
                      if (parts.length < 2) return;

                      const resource = parts[0];
                      const action = parts[1];

                      if (!permissionsMap[resource]) {
                        permissionsMap[resource] = [];
                      }
                      permissionsMap[resource].push(action);
                    });

                    return (
                      <TableRow key={role.id}>
                        <TableCell className='font-medium'>
                          {role.roleName}
                        </TableCell>
                        <TableCell className='max-w-xs'>
                          <div className='line-clamp-2 text-sm text-muted-foreground'>
                            {role.description || '-'}
                          </div>
                        </TableCell>
                        <TableCell className='max-w-md'>
                          <div className='flex flex-wrap gap-1'>
                            {Object.entries(permissionsMap)
                              .slice(0, 3)
                              .map(([resource, actions], index) => (
                                <Badge
                                  key={index}
                                  variant='secondary'
                                  className='text-xs whitespace-nowrap'
                                >
                                  {resource}: {actions.join(', ')}
                                </Badge>
                              ))}
                            {Object.entries(permissionsMap).length > 3 && (
                              <Badge
                                variant='outline'
                                className='text-xs'
                              >
                                +{Object.entries(permissionsMap).length - 3}{' '}
                                more
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(role.createdAt).toLocaleDateString('id-ID')}
                        </TableCell>
                        <TableCell className='text-right'>
                          <div className='flex items-center justify-end gap-1'>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => openEditDialog(role)}
                              disabled={role.isSuperAdmin}
                              className='h-8 w-8'
                            >
                              <Edit className='h-4 w-4' />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  disabled={role.isSuperAdmin}
                                  className='h-8 w-8'
                                >
                                  <Trash2 className='h-4 w-4' />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Hapus Role
                                  </AlertDialogTitle>
                                  <AlertDialogDescription asChild>
                                    <div>
                                      Apakah Anda yakin ingin menghapus role "
                                      {role.roleName}"? Tindakan ini tidak dapat
                                      dibatalkan.
                                    </div>
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteRole(role.id)}
                                    disabled={deleteRoleMutation.isPending}
                                    className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                  >
                                    {deleteRoleMutation.isPending
                                      ? 'Menghapus...'
                                      : 'Hapus'}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default RoleManagement;
