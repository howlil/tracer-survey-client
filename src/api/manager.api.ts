/** @format */

import axiosInstance from '@/lib/axios';
import {useQuery} from '@tanstack/react-query';

export interface Manager {
  id: string;
  company: string;
  position: string;
  phoneNumber?: string | null;
  respondentId: string;
  respondent: {
    id: string;
    fullName: string;
    email: string;
    role: 'ALUMNI' | 'MANAGER';
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  company: string;
  count: number;
}

export interface Position {
  position: string;
  count: number;
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
    managers?: T[];
    meta?: PaginationMeta;
  };
}

const getManagersApi = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  company?: string;
  position?: string;
}): Promise<{managers: Manager[]; meta: PaginationMeta}> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.company) queryParams.append('company', params.company);
  if (params?.position) queryParams.append('position', params.position);

  const queryString = queryParams.toString();
  const url = queryString ? `/v1/managers?${queryString}` : '/v1/managers';

  const response = await axiosInstance.get<PaginatedResponse<Manager>>(url);

  if (response.data.success && response.data.data) {
    return {
      managers: response.data.data.managers || [],
      meta: response.data.data.meta || {
        total: 0,
        limit: params?.limit || 10,
        page: params?.page || 1,
        totalPages: 0,
      },
    };
  }

  throw new Error(response.data.message || 'Failed to fetch managers');
};

const getCompaniesApi = async (): Promise<Company[]> => {
  const response = await axiosInstance.get<ApiResponse<Company[]>>(
    '/v1/managers/companies'
  );

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to fetch companies');
};

const getPositionsApi = async (): Promise<Position[]> => {
  const response = await axiosInstance.get<ApiResponse<Position[]>>(
    '/v1/managers/positions'
  );

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to fetch positions');
};

export const MANAGER_QUERY_KEY = ['managers'] as const;

export const useManagers = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  company?: string;
  position?: string;
}) => {
  return useQuery({
    queryKey: [...MANAGER_QUERY_KEY, params],
    queryFn: () => getManagersApi(params),
  });
};

export const useCompanies = () => {
  return useQuery({
    queryKey: [...MANAGER_QUERY_KEY, 'companies'],
    queryFn: getCompaniesApi,
  });
};

export const usePositions = () => {
  return useQuery({
    queryKey: [...MANAGER_QUERY_KEY, 'positions'],
    queryFn: getPositionsApi,
  });
};

export type CreateManagerPayload = {
  fullName: string;
  email: string;
  company: string;
  position: string;
  phoneNumber?: string;
  alumniPins: string[];
};

export type ImportSummary = {
  total: number;
  success: number;
  failed: number;
  errors: Array<{row: number; message: string}>;
};

export const createManagerApi = async (payload: CreateManagerPayload) => {
  const response = await axiosInstance.post<ApiResponse<Manager>>(
    '/v1/managers',
    payload
  );
  if (!response.data.success) {
    throw new Error(response.data.message || 'Gagal menambahkan manager');
  }
  return response.data.data;
};

export const downloadManagerTemplateApi = async () => {
  const response = await axiosInstance.get<Blob>('/v1/managers/template', {
    responseType: 'blob',
  });
  return response.data;
};

export const importManagersApi = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axiosInstance.post<ApiResponse<ImportSummary>>(
    '/v1/managers/import',
    formData,
    {
      headers: {'Content-Type': 'multipart/form-data'},
    }
  );
  if (!response.data.success) {
    throw new Error(response.data.message || 'Gagal mengimpor manager');
  }
  return response.data.data;
};
