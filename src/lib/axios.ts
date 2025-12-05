/** @format */

import axios from 'axios';
import {toast} from 'sonner';
import {getDetailedErrorMessage, logError} from '@/utils/error-handler';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['ngrok-skip-browser-warning'] = 'true';
    return config;
  },
  (error) => {
    toast.error('Gagal mengirim permintaan');
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    const isLoginEndpoint =
      response.config.url?.includes('/auth/') &&
      response.config.url?.includes('/login');

    if (response.config.method !== 'get' && !isLoginEndpoint) {
      const message = response.data?.message || 'Operasi berhasil';
      toast.success(message);
    }
    return response;
  },
  (error) => {
    logError(error, 'AxiosInterceptor');

    if (error.response?.status === 401) {
      const message = getDetailedErrorMessage(
        error,
        'Sesi Anda telah berakhir. Silakan login kembali'
      );
      toast.error(message);
      localStorage.removeItem('auth-token');
      
      // Redirect ke halaman login yang sesuai berdasarkan URL saat ini
      const currentPath = window.location.pathname;
      let redirectPath = '/admin/login';
      
      if (currentPath.includes('/tracer-study')) {
        redirectPath = '/tracer-study/login';
      } else if (currentPath.includes('/user-survey')) {
        redirectPath = '/user-survey/login';
      }
      
      setTimeout(() => {
        window.location.href = redirectPath;
      }, 1500);
    } else if (error.response?.status === 403) {
      const message = getDetailedErrorMessage(
        error,
        'Anda tidak memiliki akses untuk melakukan operasi ini'
      );
      toast.error(message);
    } else if (error.response?.status === 404) {
      const message = getDetailedErrorMessage(error, 'Data tidak ditemukan');
      toast.error(message);
    } else if (error.response?.status === 500) {
      const message = getDetailedErrorMessage(
        error,
        'Terjadi kesalahan pada server'
      );
      toast.error(message);
    } else if (error.code === 'ECONNABORTED') {
      const message = getDetailedErrorMessage(
        error,
        'Permintaan timeout. Silakan coba lagi'
      );
      toast.error(message);
    } else if (error.code === 'ERR_NETWORK') {
      const message = getDetailedErrorMessage(
        error,
        'Tidak dapat terhubung ke server'
      );
      toast.error(message);
    } else {
      // For 422 and other status codes, don't show toast here
      // Let the component handle it
      // Just reject the error
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
