/** @format */

import axiosInstance from '@/lib/axios';
import {useQuery} from '@tanstack/react-query';

export interface Alumni {
  id: string;
  nim: string;
  graduatedYear: number;
  graduatePeriode:
    | 'WISUDA_I'
    | 'WISUDA_II'
    | 'WISUDA_III'
    | 'WISUDA_IV'
    | 'WISUDA_V'
    | 'WISUDA_VI';
  degree: 'S1' | 'S2' | 'S3' | 'D3' | 'VOKASI' | 'PROFESI' | 'PASCA';
  pin?: string; // PIN yang di-generate otomatis saat create alumni
  respondent: {
    id: string;
    fullName: string;
    email: string;
    role: 'ALUMNI' | 'MANAGER';
    createdAt: string;
  };
  major: {
    id: string;
    name?: string; // For list view (findManyWithPagination) - maps to majorName
    majorName: string; // Primary field - always present, maps to major.majorName from backend
    faculty: {
      id: string;
      name?: string; // For list view (findManyWithPagination) - maps to facultyName
      facultyName: string; // Primary field - always present, maps to major.faculty.facultyName from backend
    };
  };
  createdAt: string;
  updatedAt: string;
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

interface AlumniStats {
  totalAlumni: number;
  alumniThisYear: number;
  totalMajors: number;
  totalFaculties: number;
  filteredCount: number;
}

interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    alumni?: T[];
    meta?: PaginationMeta;
    stats?: AlumniStats;
  };
}

const getAlumniApi = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  facultyId?: string;
  majorId?: string;
  degree?: string;
  graduatedYear?: number;
  graduatePeriode?: string;
}): Promise<{alumni: Alumni[]; meta: PaginationMeta; stats?: AlumniStats}> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.facultyId) queryParams.append('facultyId', params.facultyId);
  if (params?.majorId) queryParams.append('majorId', params.majorId);
  if (params?.degree) queryParams.append('degree', params.degree);
  if (params?.graduatedYear)
    queryParams.append('graduatedYear', params.graduatedYear.toString());
  if (params?.graduatePeriode)
    queryParams.append('graduatePeriode', params.graduatePeriode);

  const queryString = queryParams.toString();
  const url = queryString ? `/v1/alumni?${queryString}` : '/v1/alumni';

  const response = await axiosInstance.get<PaginatedResponse<Alumni>>(url);

  if (response.data.success && response.data.data) {
    return {
      alumni: response.data.data.alumni || [],
      meta: response.data.data.meta || {
        total: 0,
        limit: params?.limit || 10,
        page: params?.page || 1,
        totalPages: 0,
      },
      stats: response.data.data.stats,
    };
  }

  throw new Error(response.data.message || 'Failed to fetch alumni');
};

export const ALUMNI_QUERY_KEY = ['alumni'] as const;

export const useAlumni = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  facultyId?: string;
  majorId?: string;
  degree?: string;
  graduatedYear?: number;
  graduatePeriode?: string;
}) => {
  return useQuery({
    queryKey: [...ALUMNI_QUERY_KEY, params],
    queryFn: () => getAlumniApi(params),
  });
};

export type CreateAlumniPayload = {
  nim: string;
  fullName: string;
  email: string;
  facultyId: string;
  majorId: string;
  degree: string;
  graduatedYear: number;
  graduatePeriode:
    | 'WISUDA_I'
    | 'WISUDA_II'
    | 'WISUDA_III'
    | 'WISUDA_IV'
    | 'WISUDA_V'
    | 'WISUDA_VI';
};

export type ImportSummary = {
  total: number;
  success: number;
  failed: number;
  errors: Array<{row: number; message: string}>;
};

export type {AlumniStats};

export const createAlumniApi = async (payload: CreateAlumniPayload) => {
  const response = await axiosInstance.post<ApiResponse<Alumni>>(
    '/v1/alumni',
    payload
  );
  if (!response.data.success) {
    throw new Error(response.data.message || 'Gagal menambahkan alumni');
  }
  return response.data.data;
};

export const downloadAlumniTemplateApi = async () => {
  const response = await axiosInstance.get<Blob>('/v1/alumni/template', {
    responseType: 'blob',
  });
  return response.data;
};

export const importAlumniApi = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axiosInstance.post<ApiResponse<ImportSummary>>(
    '/v1/alumni/import',
    formData,
    {
      headers: {'Content-Type': 'multipart/form-data'},
    }
  );
  if (!response.data.success) {
    throw new Error(response.data.message || 'Gagal mengimpor alumni');
  }
  return response.data.data;
};

export type UpdateAlumniPayload = Partial<CreateAlumniPayload>;

export const updateAlumniApi = async (
  id: string,
  payload: UpdateAlumniPayload
) => {
  const response = await axiosInstance.patch<ApiResponse<Alumni>>(
    `/v1/alumni/${id}`,
    payload
  );
  if (!response.data.success) {
    throw new Error(response.data.message || 'Gagal mengupdate alumni');
  }
  return response.data.data;
};

export const getCurrentAlumniProfileApi = async (): Promise<Alumni> => {
  const response = await axiosInstance.get<ApiResponse<Alumni>>(
    '/v1/alumni/profile/me'
  );
  if (!response.data.success) {
    throw new Error(response.data.message || 'Gagal mendapatkan profil alumni');
  }
  return response.data.data;
};

export const useCurrentAlumniProfile = () => {
  return useQuery({
    queryKey: ['currentAlumniProfile'],
    queryFn: getCurrentAlumniProfileApi,
    enabled: true,
  });
};
