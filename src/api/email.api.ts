/** @format */

import axiosInstance from '@/lib/axios';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import type {EmailTemplate, EmailTemplateFormData} from '@/types/emailTemplate';

export interface BlastEmail {
  id: string;
  surveyId: string;
  emailTemplateId: string;
  emailTemplate: EmailTemplate;
  emailType: 'INVITATION' | 'REMINDER' | 'CUSTOM';
  title: string;
  dateToSend: string;
  status: 'SCHEDULED' | 'SENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  recipientType?: 'ALUMNI' | 'MANAGER' | 'ALL' | 'CUSTOM';
  recipientFilters?: {
    facultyId?: string | null;
    majorId?: string | null;
    graduatedYear?: number | null;
    graduatePeriode?: string | null;
    customRecipients?: string[] | null;
  } | null;
  recipientCount: number;
  sentCount: number;
  failedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlastEmailFormData {
  surveyId: string;
  emailTemplateId: string;
  emailType: 'INVITATION' | 'REMINDER' | 'CUSTOM';
  title: string;
  dateToSend: string;
  recipientType: 'ALUMNI' | 'MANAGER' | 'ALL' | 'CUSTOM';
  recipientFilters?: {
    facultyId?: string | null;
    majorId?: string | null;
    graduatedYear?: number | null;
    graduatePeriode?: string | null;
    customRecipients?: string[] | null;
  };
  message?: string;
}

export interface PreviewRecipientCountRequest {
  recipientType: 'ALUMNI' | 'MANAGER' | 'ALL' | 'CUSTOM';
  recipientFilters?: {
    facultyId?: string | null;
    majorId?: string | null;
    graduatedYear?: number | null;
    graduatePeriode?: string | null;
    customRecipients?: string[] | null;
  };
}

export interface PreviewRecipientCountResponse {
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
    templates?: T[];
    blastEmails?: T[];
    meta?: PaginationMeta;
  };
}

// Email Template API
const getEmailTemplatesApi = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{templates: EmailTemplate[]; meta: PaginationMeta}> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);

  const queryString = queryParams.toString();
  const url = queryString
    ? `/v1/email-templates?${queryString}`
    : '/v1/email-templates';

  try {
    const response = await axiosInstance.get<PaginatedResponse<EmailTemplate>>(
      url
    );

    if (response.data && response.data.success) {
      const data = response.data.data || {};
      return {
        templates: data.templates || [],
        meta: data.meta || {
          total: 0,
          limit: params?.limit || 10,
          page: params?.page || 1,
          totalPages: 0,
        },
      };
    }

    throw new Error(
      response.data?.message || 'Failed to fetch email templates'
    );
  } catch (error) {
    console.error('Error fetching email templates:', error);
    throw error;
  }
};

const getEmailTemplateByIdApi = async (id: string): Promise<EmailTemplate> => {
  const response = await axiosInstance.get<ApiResponse<EmailTemplate>>(
    `/v1/email-templates/${id}`
  );

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to fetch email template');
};

const createEmailTemplateApi = async (
  data: EmailTemplateFormData
): Promise<EmailTemplate> => {
  const response = await axiosInstance.post<ApiResponse<EmailTemplate>>(
    '/v1/email-templates',
    data
  );

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to create email template');
};

const updateEmailTemplateApi = async (
  id: string,
  data: Partial<EmailTemplateFormData>
): Promise<EmailTemplate> => {
  const response = await axiosInstance.patch<ApiResponse<EmailTemplate>>(
    `/v1/email-templates/${id}`,
    data
  );

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to update email template');
};

const deleteEmailTemplateApi = async (id: string): Promise<void> => {
  const response = await axiosInstance.delete<ApiResponse<void>>(
    `/v1/email-templates/${id}`
  );

  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to delete email template');
  }
};

// Blast Email API
const getBlastEmailsApi = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  emailType?: string;
}): Promise<{blastEmails: BlastEmail[]; meta: PaginationMeta}> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.emailType) queryParams.append('emailType', params.emailType);

  const response = await axiosInstance.get<PaginatedResponse<BlastEmail>>(
    `/v1/blast-emails?${queryParams.toString()}`
  );

  if (response.data.success && response.data.data) {
    return {
      blastEmails: response.data.data.blastEmails || [],
      meta: response.data.data.meta || {
        total: 0,
        limit: 10,
        page: 1,
        totalPages: 0,
      },
    };
  }

  throw new Error(response.data.message || 'Failed to fetch blast emails');
};

const getBlastEmailByIdApi = async (id: string): Promise<BlastEmail> => {
  const response = await axiosInstance.get<ApiResponse<BlastEmail>>(
    `/v1/blast-emails/${id}`
  );

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to fetch blast email');
};

const createBlastEmailApi = async (
  data: BlastEmailFormData
): Promise<BlastEmail> => {
  const response = await axiosInstance.post<ApiResponse<BlastEmail>>(
    '/v1/blast-emails',
    data
  );

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to create blast email');
};

const updateBlastEmailApi = async (
  id: string,
  data: Partial<BlastEmailFormData>
): Promise<BlastEmail> => {
  const response = await axiosInstance.patch<ApiResponse<BlastEmail>>(
    `/v1/blast-emails/${id}`,
    data
  );

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to update blast email');
};

const deleteBlastEmailApi = async (id: string): Promise<void> => {
  const response = await axiosInstance.delete<ApiResponse<void>>(
    `/v1/blast-emails/${id}`
  );

  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to delete blast email');
  }
};

const previewRecipientCountApi = async (
  data: PreviewRecipientCountRequest
): Promise<PreviewRecipientCountResponse> => {
  const response = await axiosInstance.post<
    ApiResponse<PreviewRecipientCountResponse>
  >('/v1/blast-emails/preview-count', data);

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to preview recipient count');
};

// React Query Hooks - Email Template
export const EMAIL_TEMPLATE_QUERY_KEY = ['email-templates'] as const;

export const useEmailTemplates = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: [...EMAIL_TEMPLATE_QUERY_KEY, params],
    queryFn: () => getEmailTemplatesApi(params),
  });
};

export const useEmailTemplate = (id: string) => {
  return useQuery({
    queryKey: [...EMAIL_TEMPLATE_QUERY_KEY, id],
    queryFn: () => getEmailTemplateByIdApi(id),
    enabled: !!id,
  });
};

export const useCreateEmailTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmailTemplateApi,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: EMAIL_TEMPLATE_QUERY_KEY});
    },
  });
};

export const useUpdateEmailTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<EmailTemplateFormData>;
    }) => updateEmailTemplateApi(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: EMAIL_TEMPLATE_QUERY_KEY});
      queryClient.invalidateQueries({
        queryKey: [...EMAIL_TEMPLATE_QUERY_KEY, variables.id],
      });
    },
  });
};

export const useDeleteEmailTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEmailTemplateApi,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: EMAIL_TEMPLATE_QUERY_KEY});
    },
  });
};

// React Query Hooks - Blast Email
export const BLAST_EMAIL_QUERY_KEY = ['blast-emails'] as const;

export const useBlastEmails = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  emailType?: string;
}) => {
  return useQuery({
    queryKey: [...BLAST_EMAIL_QUERY_KEY, params],
    queryFn: () => getBlastEmailsApi(params),
  });
};

export const useBlastEmail = (id: string) => {
  return useQuery({
    queryKey: [...BLAST_EMAIL_QUERY_KEY, id],
    queryFn: () => getBlastEmailByIdApi(id),
    enabled: !!id,
  });
};

export const useCreateBlastEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBlastEmailApi,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: BLAST_EMAIL_QUERY_KEY});
    },
  });
};

export const useUpdateBlastEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}: {id: string; data: Partial<BlastEmailFormData>}) =>
      updateBlastEmailApi(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: BLAST_EMAIL_QUERY_KEY});
      queryClient.invalidateQueries({
        queryKey: [...BLAST_EMAIL_QUERY_KEY, variables.id],
      });
    },
  });
};

export const useDeleteBlastEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBlastEmailApi,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: BLAST_EMAIL_QUERY_KEY});
    },
  });
};

export const usePreviewRecipientCount = () => {
  return useMutation({
    mutationFn: previewRecipientCountApi,
  });
};
