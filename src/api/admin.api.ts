/** @format */

import axiosInstance from '@/lib/axios';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';

export interface Admin {
  id: string;
  username: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  roles: AdminRole[];
}

export interface AdminRole {
  adminId: string;
  roleId: string;
  role: Role;
}

export interface Role {
  id: string;
  roleName: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminRequest {
  username: string;
  name: string;
  email: string;
  isActive?: boolean;
  roleIds: string[];
}

export interface UpdateAdminRequest {
  username?: string;
  name?: string;
  email?: string;
  isActive?: boolean;
  roleIds?: string[];
}

export interface PaginationMeta {
  total: number;
  limit: number;
  page: number;
  totalPages: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    admins?: T[];
    meta?: PaginationMeta;
  };
}

const getAdminsApi = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  roleId?: string;
}): Promise<{admins: Admin[]; meta: PaginationMeta}> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.isActive !== undefined)
    queryParams.append('isActive', params.isActive.toString());
  if (params?.roleId) queryParams.append('roleId', params.roleId);

  const queryString = queryParams.toString();
  const url = queryString ? `/v1/admins?${queryString}` : '/v1/admins';

  const response = await axiosInstance.get<PaginatedResponse<Admin>>(url);

  if (response.data.success && response.data.data) {
    return {
      admins: response.data.data.admins || [],
      meta: response.data.data.meta || {
        total: 0,
        limit: params?.limit || 10,
        page: params?.page || 1,
        totalPages: 0,
      },
    };
  }

  throw new Error(response.data.message || 'Failed to fetch admins');
};

const getAdminByIdApi = async (id: string): Promise<Admin> => {
  const response = await axiosInstance.get<ApiResponse<Admin>>(`/v1/admins/${id}`);

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to fetch admin');
};

const createAdminApi = async (data: CreateAdminRequest): Promise<Admin> => {
  const response = await axiosInstance.post<ApiResponse<Admin>>('/v1/admins', data);

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to create admin');
};

const updateAdminApi = async (
  id: string,
  data: UpdateAdminRequest
): Promise<Admin> => {
  const response = await axiosInstance.patch<ApiResponse<Admin>>(
    `/v1/admins/${id}`,
    data
  );

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to update admin');
};

const deleteAdminApi = async (id: string): Promise<void> => {
  const response = await axiosInstance.delete<ApiResponse<void>>(`/v1/admins/${id}`);

  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to delete admin');
  }
};

export const ADMIN_QUERY_KEY = ['admins'] as const;

export const useAdmins = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  roleId?: string;
}) => {
  return useQuery({
    queryKey: [...ADMIN_QUERY_KEY, params],
    queryFn: () => getAdminsApi(params),
  });
};

export const useAdmin = (id: string) => {
  return useQuery({
    queryKey: [...ADMIN_QUERY_KEY, id],
    queryFn: () => getAdminByIdApi(id),
    enabled: !!id,
  });
};

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdminApi,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ADMIN_QUERY_KEY});
    },
  });
};

export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}: {id: string; data: UpdateAdminRequest}) =>
      updateAdminApi(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: ADMIN_QUERY_KEY});
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_QUERY_KEY, variables.id],
      });
    },
  });
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminApi,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ADMIN_QUERY_KEY});
    },
  });
};

