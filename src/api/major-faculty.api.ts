/** @format */

import axiosInstance from '@/lib/axios';
import {useQuery} from '@tanstack/react-query';

export interface Faculty {
  id: string;
  name: string;
}

export interface Major {
  id: string;
  name: string;
  faculty: Faculty;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const getFacultiesApi = async (): Promise<Faculty[]> => {
  const response = await axiosInstance.get<ApiResponse<Faculty[]>>(
    '/v1/faculties'
  );

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to fetch faculties');
};

const getMajorsApi = async (facultyId?: string): Promise<Major[]> => {
  const queryParams = new URLSearchParams();
  if (facultyId) {
    queryParams.append('facultyId', facultyId);
  }

  const response = await axiosInstance.get<ApiResponse<Major[]>>(
    `/v1/majors?${queryParams.toString()}`
  );

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to fetch majors');
};

export const FACULTY_QUERY_KEY = ['faculties'] as const;
export const MAJOR_QUERY_KEY = ['majors'] as const;

export const useFaculties = () => {
  return useQuery({
    queryKey: FACULTY_QUERY_KEY,
    queryFn: getFacultiesApi,
  });
};

export const useMajors = (facultyId?: string) => {
  return useQuery({
    queryKey: [...MAJOR_QUERY_KEY, facultyId],
    queryFn: () => getMajorsApi(facultyId),
  });
};
