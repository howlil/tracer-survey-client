/** @format */

import axiosInstance from '@/lib/axios';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFAQRequest {
  question: string;
  answer: string;
}

export interface UpdateFAQRequest {
  question?: string;
  answer?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const getFAQsApi = async (): Promise<FAQ[]> => {
  const response = await axiosInstance.get<ApiResponse<FAQ[]>>('/v1/faqs');

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to fetch FAQs');
};

const getFAQsPublicApi = async (): Promise<FAQ[]> => {
  const response = await axiosInstance.get<ApiResponse<FAQ[]>>('/v1/faqs/public');

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to fetch FAQs');
};

const createFAQApi = async (data: CreateFAQRequest): Promise<FAQ> => {
  const response = await axiosInstance.post<ApiResponse<FAQ>>('/v1/faq', data);

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to create FAQ');
};

const updateFAQApi = async (
  id: string,
  data: UpdateFAQRequest
): Promise<FAQ> => {
  const response = await axiosInstance.patch<ApiResponse<FAQ>>(
    `/v1/faq/${id}`,
    data
  );

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to update FAQ');
};

const deleteFAQApi = async (id: string): Promise<void> => {
  const response = await axiosInstance.delete<ApiResponse<void>>(
    `/v1/faq/${id}`
  );

  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to delete FAQ');
  }
};

export const FAQ_QUERY_KEY = ['faqs'] as const;

export const useFAQs = () => {
  return useQuery({
    queryKey: FAQ_QUERY_KEY,
    queryFn: getFAQsApi,
  });
};

export const useFAQsPublic = () => {
  return useQuery({
    queryKey: [...FAQ_QUERY_KEY, 'public'],
    queryFn: getFAQsPublicApi,
  });
};

export const useCreateFAQ = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFAQApi,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: FAQ_QUERY_KEY});
    },
  });
};

export const useUpdateFAQ = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}: {id: string; data: UpdateFAQRequest}) =>
      updateFAQApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: FAQ_QUERY_KEY});
    },
  });
};

export const useDeleteFAQ = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFAQApi,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: FAQ_QUERY_KEY});
    },
  });
};
