/** @format */

import axiosInstance from '@/lib/axios';
import {useQuery, useMutation} from '@tanstack/react-query';

// Types
export interface TracerStudyResponse {
  id: string;
  respondentId: string;
  fullName: string;
  email: string;
  nim: string;
  graduatedYear: number;
  graduatePeriode: string;
  major: {
    id: string;
    majorName: string;
    faculty: {
      id: string;
      facultyName: string;
    };
  };
  degree: string;
  submittedAt?: string;
  totalQuestions: number;
  answeredQuestions: number;
  completionPercentage: number;
}

export interface UserSurveyResponse {
  id: string;
  respondentId: string;
  fullName: string;
  email: string;
  company: string;
  position: string;
  submittedAt?: string;
  totalQuestions: number;
  answeredQuestions: number;
  completionPercentage: number;
}

export interface QuestionResponse {
  questionId: string;
  questionText: string;
  questionType: string;
  isRequired: boolean;
  isAnswered: boolean;
  sortOrder: number;
  answer?: string;
  answerOptions?: Array<{
    id: string;
    optionText: string;
    isSelected?: boolean;
  }>;
  children?: Array<{
    id: string;
    questionText: string;
    isAnswered: boolean;
    answer: string | null;
  }>;
}

export interface TracerStudyResponseDetail extends TracerStudyResponse {
  responses: QuestionResponse[];
}

export interface UserSurveyResponseDetail extends UserSurveyResponse {
  responses: QuestionResponse[];
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
    responses?: T[];
    meta?: PaginationMeta;
  };
}

// API Functions - Tracer Study
const getTracerStudyResponsesApi = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  facultyId?: string;
  majorId?: string;
  graduatedYear?: number;
  graduatePeriode?: string;
  degree?: string;
}): Promise<{responses: TracerStudyResponse[]; meta: PaginationMeta}> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.facultyId) queryParams.append('facultyId', params.facultyId);
  if (params?.majorId) queryParams.append('majorId', params.majorId);
  if (params?.graduatedYear)
    queryParams.append('graduatedYear', params.graduatedYear.toString());
  if (params?.graduatePeriode)
    queryParams.append('graduatePeriode', params.graduatePeriode);
  if (params?.degree) queryParams.append('degree', params.degree);

  const queryString = queryParams.toString();
  const url = queryString
    ? `/v1/responses/tracer-study?${queryString}`
    : '/v1/responses/tracer-study';

  const response = await axiosInstance.get<
    PaginatedResponse<TracerStudyResponse>
  >(url);

  if (response.data.success && response.data.data) {
    return {
      responses: response.data.data.responses || [],
      meta: response.data.data.meta || {
        total: 0,
        limit: params?.limit || 10,
        page: params?.page || 1,
        totalPages: 0,
      },
    };
  }

  throw new Error(
    response.data.message || 'Failed to fetch tracer study responses'
  );
};

const getTracerStudyResponseDetailApi = async (
  id: string
): Promise<TracerStudyResponseDetail> => {
  const response = await axiosInstance.get<
    ApiResponse<TracerStudyResponseDetail>
  >(`/v1/responses/tracer-study/${id}`);

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(
    response.data.message || 'Failed to fetch tracer study response detail'
  );
};

const exportTracerStudyResponsesApi = async (params?: {
  format?: 'excel' | 'pdf';
  search?: string;
  facultyId?: string;
  majorId?: string;
  graduatedYear?: number;
  graduatePeriode?: string;
  degree?: string;
  completionStatus?: string;
}): Promise<Blob> => {
  const queryParams = new URLSearchParams();
  if (params?.format) queryParams.append('format', params.format);
  if (params?.search) queryParams.append('search', params.search);
  if (params?.facultyId) queryParams.append('facultyId', params.facultyId);
  if (params?.majorId) queryParams.append('majorId', params.majorId);
  if (params?.graduatedYear)
    queryParams.append('graduatedYear', params.graduatedYear.toString());
  if (params?.graduatePeriode)
    queryParams.append('graduatePeriode', params.graduatePeriode);
  if (params?.degree) queryParams.append('degree', params.degree);
  if (params?.completionStatus) queryParams.append('completionStatus', params.completionStatus);

  const queryString = queryParams.toString();
  const url = queryString
    ? `/v1/responses/tracer-study/export?${queryString}`
    : '/v1/responses/tracer-study/export';

  const response = await axiosInstance.get(url, {
    responseType: 'blob',
  });

  return response.data;
};

// API Functions - User Survey
const getUserSurveyResponsesApi = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  company?: string;
  position?: string;
}): Promise<{responses: UserSurveyResponse[]; meta: PaginationMeta}> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.company) queryParams.append('company', params.company);
  if (params?.position) queryParams.append('position', params.position);

  const queryString = queryParams.toString();
  const url = queryString
    ? `/v1/responses/user-survey?${queryString}`
    : '/v1/responses/user-survey';

  const response = await axiosInstance.get<
    PaginatedResponse<UserSurveyResponse>
  >(url);

  if (response.data.success && response.data.data) {
    return {
      responses: response.data.data.responses || [],
      meta: response.data.data.meta || {
        total: 0,
        limit: params?.limit || 10,
        page: params?.page || 1,
        totalPages: 0,
      },
    };
  }

  throw new Error(
    response.data.message || 'Failed to fetch user survey responses'
  );
};

const getUserSurveyResponseDetailApi = async (
  id: string
): Promise<UserSurveyResponseDetail> => {
  const response = await axiosInstance.get<
    ApiResponse<UserSurveyResponseDetail>
  >(`/v1/responses/user-survey/${id}`);

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(
    response.data.message || 'Failed to fetch user survey response detail'
  );
};

const exportUserSurveyResponsesApi = async (params?: {
  format?: 'excel' | 'pdf';
  search?: string;
  company?: string;
  position?: string;
}): Promise<Blob> => {
  const queryParams = new URLSearchParams();
  if (params?.format) queryParams.append('format', params.format);
  if (params?.search) queryParams.append('search', params.search);
  if (params?.company) queryParams.append('company', params.company);
  if (params?.position) queryParams.append('position', params.position);

  const queryString = queryParams.toString();
  const url = queryString
    ? `/v1/responses/user-survey/export?${queryString}`
    : '/v1/responses/user-survey/export';

  const response = await axiosInstance.get(url, {
    responseType: 'blob',
  });

  return response.data;
};

// React Query Hooks - Tracer Study
export const useTracerStudyResponses = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  facultyId?: string;
  majorId?: string;
  graduatedYear?: number;
  graduatePeriode?: string;
  degree?: string;
}) => {
  return useQuery({
    queryKey: ['tracer-study-responses', params],
    queryFn: () => getTracerStudyResponsesApi(params),
  });
};

export const useTracerStudyResponseDetail = (id: string) => {
  return useQuery({
    queryKey: ['tracer-study-response', id],
    queryFn: () => getTracerStudyResponseDetailApi(id),
    enabled: !!id,
  });
};

export const useExportTracerStudyResponses = () => {
  return useMutation({
    mutationFn: exportTracerStudyResponsesApi,
  });
};

// React Query Hooks - User Survey
export const useUserSurveyResponses = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  company?: string;
  position?: string;
}) => {
  return useQuery({
    queryKey: ['user-survey-responses', params],
    queryFn: () => getUserSurveyResponsesApi(params),
  });
};

export const useUserSurveyResponseDetail = (id: string) => {
  return useQuery({
    queryKey: ['user-survey-response', id],
    queryFn: () => getUserSurveyResponseDetailApi(id),
    enabled: !!id,
  });
};

export const useExportUserSurveyResponses = () => {
  return useMutation({
    mutationFn: exportUserSurveyResponsesApi,
  });
};

// Submit Response Types
export interface SubmitAnswer {
  questionId: string;
  answerText?: string;
  answerOptionIds?: string[];
}

export interface SubmitResponseRequest {
  surveyId: string;
  answers: SubmitAnswer[];
}

export interface SubmitResponseResponse {
  id: string;
  surveyId: string;
  respondentId: string;
  submittedAt: string;
}

// API Function - Submit Response
const submitResponseApi = async (
  data: SubmitResponseRequest
): Promise<SubmitResponseResponse> => {
  const response = await axiosInstance.post<ApiResponse<SubmitResponseResponse>>(
    '/v1/responses/submit',
    data
  );

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to submit response');
};

// React Query Hook - Submit Response
export const useSubmitResponse = () => {
  return useMutation({
    mutationFn: submitResponseApi,
  });
};

// API Function - Save Draft
const saveDraftApi = async (
  data: SubmitResponseRequest
): Promise<SubmitResponseResponse> => {
  const response = await axiosInstance.post<ApiResponse<SubmitResponseResponse>>(
    '/v1/responses/draft',
    data
  );

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Failed to save draft');
};

// React Query Hook - Save Draft
export const useSaveDraft = () => {
  return useMutation({
    mutationFn: saveDraftApi,
  });
};