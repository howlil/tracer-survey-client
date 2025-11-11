/** @format */

import axiosInstance from '@/lib/axios';

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  id: string;
  name: string;
  email: string;
  username: string;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const adminLogin = async (
  credentials: AdminLoginRequest
): Promise<AdminLoginResponse> => {
  const response = await axiosInstance.post<ApiResponse<AdminLoginResponse>>(
    '/v1/auth/admin/login',
    credentials
  );

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.message || 'Login failed');
};
