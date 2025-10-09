/** @format */
// Fixed infinite loop and reference errors

import React, {useState, useEffect, useRef} from 'react';
import {Card, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
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

// Definisi resources dan permissions
interface ResourceConfig {
  name: string;
  actions: string[];
  subResources?: {
    [key: string]: {
      name: string;
      actions: string[];
    };
  };
}

const RESOURCES: {[key: string]: ResourceConfig} = {
  ADMIN: {
    name: 'admin',
    actions: ['create', 'read', 'update', 'delete'],
  },
  ROLE: {
    name: 'role',
    actions: ['create', 'read', 'update', 'delete'],
  },
  SURVEY: {
    name: 'survey',
    actions: ['create', 'read', 'update', 'delete', 'publish', 'archive'],
  },
  QUESTION: {
    name: 'question',
    actions: ['create', 'read', 'update', 'delete'],
  },
  RESPONDENT: {
    name: 'respondent',
    actions: ['create', 'read', 'update', 'delete', 'import'],
  },
  EMAIL: {
    name: 'email',
    actions: ['create', 'read', 'update', 'delete', 'send'],
    subResources: {
      TEMPLATE: {
        name: 'email.template',
        actions: ['manage'],
      },
    },
  },
  RESPONSE: {
    name: 'response',
    actions: ['read', 'export', 'delete'],
  },
  FACULTY: {
    name: 'faculty',
    actions: ['manage'],
  },
  MAJOR: {
    name: 'major',
    actions: ['manage'],
  },
  FAQ: {
    name: 'faq',
    actions: ['manage'],
  },
};

interface Permission {
  resource: string;
  actions: string[];
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

const RoleManagement: React.FC = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
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

  // Load roles on component mount
  useEffect(() => {
    loadRoles();
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsResourceDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call to fetch roles
      // const response = await fetch('/api/roles');
      // const data = await response.json();
      // setRoles(data);

      // Mock data for now
      setRoles([
        {
          id: '1',
          name: 'Super Admin',
          description: 'Memiliki akses penuh ke semua fitur sistem',
          permissions: [
            {
              resource: 'admin',
              actions: ['create', 'read', 'update', 'delete'],
            },
            {resource: 'role', actions: ['create', 'read', 'update', 'delete']},
            {
              resource: 'survey',
              actions: [
                'create',
                'read',
                'update',
                'delete',
                'publish',
                'archive',
              ],
            },
          ],
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        {
          id: '2',
          name: 'Survey Manager',
          description: 'Mengelola survey dan pertanyaan',
          permissions: [
            {
              resource: 'survey',
              actions: ['create', 'read', 'update', 'publish'],
            },
            {
              resource: 'question',
              actions: ['create', 'read', 'update', 'delete'],
            },
          ],
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ]);
    } catch {
      toast.error('Gagal memuat data role');
    } finally {
      setLoading(false);
    }
  };

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

      setLoading(true);
      
      if (editingRole) {
        // Edit existing role
        // TODO: Implement API call to update role
        // const response = await fetch(`/api/roles/${editingRole.id}`, {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData)
        // });

        // Mock success
        const updatedRoles = roles.map((role) =>
          role.id === editingRole.id
            ? {...role, ...formData, updatedAt: new Date().toISOString()}
            : role
        );
        setRoles(updatedRoles);
        toast.success('Role berhasil diperbarui');
      } else {
        // Create new role
        // TODO: Implement API call to create role
        // const response = await fetch('/api/roles', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData)
        // });

        // Mock success
        const newRole: Role = {
          id: Date.now().toString(),
          name: formData.name,
          description: formData.description,
          permissions: formData.permissions,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setRoles([...roles, newRole]);
        toast.success('Role berhasil dibuat');
      }

      setIsSheetOpen(false);
      resetForm();
    } catch {
      toast.error(editingRole ? 'Gagal memperbarui role' : 'Gagal membuat role');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      setLoading(true);
      // TODO: Implement API call to delete role
      // const response = await fetch(`/api/roles/${roleId}`, {
      //     method: 'DELETE'
      // });

      // Mock success
      setRoles(roles.filter((role) => role.id !== roleId));
      toast.success('Role berhasil dihapus');
    } catch {
      toast.error('Gagal menghapus role');
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
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
      const existingPermission = formData.permissions.find(p => p.resource === resource);
      setSelectedActions(existingPermission?.actions || []);
    }
  };

  const handleActionToggle = (action: string) => {
    const newActions = selectedActions.includes(action)
      ? selectedActions.filter(a => a !== action)
      : [...selectedActions, action];
    
    setSelectedActions(newActions);
    
    // Update formData
    setFormData(prev => {
      const otherPermissions = prev.permissions.filter(p => p.resource !== selectedResource);
      if (newActions.length > 0) {
        return {
          ...prev,
          permissions: [...otherPermissions, { resource: selectedResource, actions: newActions }]
        };
      } else {
        return {
          ...prev,
          permissions: otherPermissions
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
                    : 'Buat role baru dengan permission yang sesuai untuk admin sistem'
                  }
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
                        setFormData((prev) => ({...prev, name: e.target.value}))
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
                        <Label className='text-sm font-medium'>Permission</Label>
                        <div className='relative' ref={popupRef}>
                          {/* Single Input Button */}
                          <Button
                            variant="outline"
                            onClick={() => setIsResourceDropdownOpen(true)}
                            className="w-full justify-between"
                          >
                            {formData.permissions.length > 0 
                              ? `${formData.permissions.length} permission dipilih` 
                              : "Pilih permission..."}
                            <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>

                          {/* Combined Resource and Actions Popup */}
                          {isResourceDropdownOpen && (
                            <div className="absolute top-full left-0 z-50 mt-1">
                              <div className="bg-background border rounded-md shadow-lg w-[300px]">
                                <Command>
                                  <CommandInput placeholder="Cari resource atau action..." />
                                  <CommandList>
                                    <CommandEmpty>Resource tidak ditemukan.</CommandEmpty>
                                    <CommandGroup>
                                      {Object.entries(RESOURCES).map(([key, resource]) => (
                                        <div key={key}>
                                          <CommandItem
                                            value={resource.name}
                                            onSelect={() => {
                                              handleResourceSelect(resource.name);
                                            }}
                                            className="flex items-center justify-between w-full p-3"
                                          >
                                          <div className='flex items-center space-x-3'>
                                            <div>
                                              <span className='capitalize font-medium'>{resource.name}</span>
                                              <div className='text-xs text-muted-foreground'>
                                                {resource.actions.length} actions
                                              </div>
                                            </div>
                                          </div>
                                          <ChevronRight className='h-4 w-4 text-muted-foreground' />
                                          </CommandItem>
                                          
                                          {/* Actions for selected resource */}
                                          {selectedResource === resource.name && (
                                            <div className="ml-6 space-y-1 pb-2 border-l-2 border-muted pl-4">
                                              <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                                                Actions untuk {resource.name}:
                                              </div>
                                              {resource.actions.length > 2 ? (
                                                <div className="grid grid-cols-2 gap-2 px-2">
                                                  {resource.actions.map((action) => (
                                                    <div key={action} className="flex items-center space-x-2 py-1">
                                                      <Checkbox
                                                        checked={selectedActions.includes(action)}
                                                        onCheckedChange={() => handleActionToggle(action)}
                                                        className='h-3 w-3'
                                                      />
                                                      <span className='text-sm capitalize text-muted-foreground'>
                                                        {action}
                                                      </span>
                                                    </div>
                                                  ))}
                                                </div>
                                              ) : (
                                                <div className="space-y-1">
                                                  {resource.actions.map((action) => (
                                                    <div key={action} className="flex items-center space-x-2 px-2 py-1">
                                                      <Checkbox
                                                        checked={selectedActions.includes(action)}
                                                        onCheckedChange={() => handleActionToggle(action)}
                                                        className='h-3 w-3'
                                                      />
                                                      <span className='text-sm capitalize text-muted-foreground'>
                                                        {action}
                                                      </span>
                                                    </div>
                                                  ))}
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      ))}
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
                          <Label className='text-sm font-medium'>Permission yang Dipilih</Label>
                          <div className='space-y-2 max-h-[200px] overflow-y-auto border rounded-md p-3'>
                            {formData.permissions.map((permission, index) => (
                              <div key={index} className='flex items-center justify-between bg-muted/50 rounded-md p-2'>
                                <div className='flex items-center space-x-2'>
                                  <span className='text-sm font-medium capitalize'>{permission.resource}</span>
                                  <span className='text-xs text-muted-foreground'>
                                    {permission.actions.join(', ')}
                                  </span>
                                </div>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      permissions: prev.permissions.filter((_, i) => i !== index)
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
                  disabled={loading}
                  className='flex-1'
                >
                  {loading ? 'Menyimpan...' : (editingRole ? 'Simpan Perubahan' : 'Simpan Role')}
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
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className='font-medium'>{role.name}</TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>
                      <div className='space-y-1'>
                        {role.permissions.map((permission, index) => (
                          <Badge
                            key={index}
                            variant='secondary'
                            className='text-xs'
                          >
                            {permission.resource}:{' '}
                            {permission.actions.join(', ')}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(role.createdAt).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex items-center justify-end gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => openEditDialog(role)}
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
                              <AlertDialogTitle>Hapus Role</AlertDialogTitle>
                              <AlertDialogDescription asChild>
                                <div>
                                  Apakah Anda yakin ingin menghapus role "
                                  {role.name}"? Tindakan ini tidak dapat
                                  dibatalkan.
                                </div>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteRole(role.id)}
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

export default RoleManagement;
