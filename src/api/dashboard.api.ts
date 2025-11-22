/** @format */

import axiosInstance from '@/lib/axios';
import {useQuery} from '@tanstack/react-query';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type DashboardActivityType = 'TRACER_STUDY' | 'USER_SURVEY';
export type DashboardActivityStatus = 'COMPLETED' | 'PENDING' | 'IN_PROGRESS';

export interface DashboardStats {
  totalTracerStudy: number;
  totalUserSurvey: number;
  responseRate: number;
  pendingReviews: number;
}

export interface DashboardActivity {
  id: string;
  type: DashboardActivityType;
  name: string;
  status: DashboardActivityStatus;
  submittedAt: string;
}

export interface DashboardOverview {
  stats: DashboardStats;
  recentActivities: DashboardActivity[];
}

const getDashboardOverviewApi = async (): Promise<DashboardOverview> => {
  const response = await axiosInstance.get<ApiResponse<DashboardOverview>>(
    '/v1/dashboard/overview'
  );

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Gagal memuat data dashboard');
};

export const useDashboardOverview = () => {
  return useQuery({
    queryKey: ['dashboardOverview'],
    queryFn: getDashboardOverviewApi,
    staleTime: 5 * 60 * 1000, // 5 menit
  });
};


