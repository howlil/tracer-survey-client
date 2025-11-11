/** @format */

import axiosInstance from '@/lib/axios';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';

export interface Role {
  id: string;
  roleName: string;
  description?: string;
  isSuperAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  permissions?: Permission[];
}

export interface Permission {
  id: string;
  permissionName: string;
  resource?: string;
  action?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  name: string;
  actions: string[];
  subResources?: {
    [key: string]: {
      name: string;
      actions: string[];
    };
  };
}

export interface CreateRoleRequest {
  roleName: string;
  description?: string;
  permissionIds: string[];
}

export interface UpdateRoleRequest {
  roleName?: string;
  description?: string;
  permissionIds?: string[];
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
    roles?: T[];
    meta?: PaginationMeta;
  };
}

const getRolesApi = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{roles: Role[]; meta: PaginationMeta}> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);

  const queryString = queryParams.toString();
  const url = queryString ? `/v1/roles?${queryString}` : '/v1/roles';

  const response = await axiosInstance.get<PaginatedResponse<Role>>(url);

  if (response.data.success && response.data.data) {
    return {
      roles: response.data.data.roles || [],
      meta: response.data.data.meta || {
        total: 0,
        limit: params?.limit || 10,
        page: params?.page || 1,
        totalPages: 0,
      },
    };
  }

  throw new Error(response.data.message || 'Failed to fetch roles');
};

const getRoleByIdApi = async (id: string): Promise<Role> => {
  const response = await axiosInstance.get<ApiResponse<Role>>(
    `/v1/roles/${id}`
  );

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to fetch role');
};

const getResourcesApi = async (): Promise<Resource[]> => {
  const response = await axiosInstance.get<ApiResponse<Resource[]>>(
    '/v1/roles/resources'
  );

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to fetch resources');
};

const createRoleApi = async (data: CreateRoleRequest): Promise<Role> => {
  const response = await axiosInstance.post<ApiResponse<Role>>(
    '/v1/roles',
    data
  );

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to create role');
};

const updateRoleApi = async (
  id: string,
  data: UpdateRoleRequest
): Promise<Role> => {
  const response = await axiosInstance.patch<ApiResponse<Role>>(
    `/v1/roles/${id}`,
    data
  );

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to update role');
};

const deleteRoleApi = async (id: string): Promise<void> => {
  const response = await axiosInstance.delete<ApiResponse<void>>(
    `/v1/roles/${id}`
  );

  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to delete role');
  }
};

export const ROLE_QUERY_KEY = ['roles'] as const;

export const useRoles = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: [...ROLE_QUERY_KEY, params],
    queryFn: () => getRolesApi(params),
  });
};

export const useRole = (id: string) => {
  return useQuery({
    queryKey: [...ROLE_QUERY_KEY, id],
    queryFn: () => getRoleByIdApi(id),
    enabled: !!id,
  });
};

export const useResources = () => {
  return useQuery({
    queryKey: ['resources'],
    queryFn: getResourcesApi,
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRoleApi,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ROLE_QUERY_KEY});
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}: {id: string; data: UpdateRoleRequest}) =>
      updateRoleApi(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: ROLE_QUERY_KEY});
      queryClient.invalidateQueries({
        queryKey: [...ROLE_QUERY_KEY, variables.id],
      });
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRoleApi,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ROLE_QUERY_KEY});
    },
  });
};
