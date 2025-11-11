/** @format */

import axios from 'axios';
import {toast} from 'sonner';

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
    const apiMessage =
      error.response?.data?.message || error.response?.data?.error;

    // Helper function to convert error message to string
    const getErrorMessage = (msg: unknown): string => {
      if (Array.isArray(msg)) {
        return msg
          .map((item) => {
            if (
              typeof item === 'object' &&
              item !== null &&
              'message' in item
            ) {
              const detail = item as {field?: string; message?: string};
              return `${detail.field || 'Error'}: ${
                detail.message || 'Unknown error'
              }`;
            }
            return String(item);
          })
          .join(', ');
      }
      if (typeof msg === 'string') {
        return msg;
      }
      if (msg && typeof msg === 'object' && 'message' in msg) {
        return String((msg as {message: unknown}).message);
      }
      return String(msg || '');
    };

    if (error.response?.status === 401) {
      const message =
        getErrorMessage(apiMessage) ||
        'Sesi Anda telah berakhir. Silakan login kembali';
      toast.error(message);
      localStorage.removeItem('auth-token');
      setTimeout(() => {
        window.location.href = '/admin/login';
      }, 1500);
    } else if (error.response?.status === 403) {
      const message =
        getErrorMessage(apiMessage) ||
        'Anda tidak memiliki akses untuk melakukan operasi ini';
      toast.error(message);
    } else if (error.response?.status === 404) {
      const message = getErrorMessage(apiMessage) || 'Data tidak ditemukan';
      toast.error(message);
    } else if (error.response?.status === 500) {
      const message =
        getErrorMessage(apiMessage) || 'Terjadi kesalahan pada server';
      toast.error(message);
    } else if (error.code === 'ECONNABORTED') {
      const message =
        getErrorMessage(apiMessage) || 'Permintaan timeout. Silakan coba lagi';
      toast.error(message);
    } else if (error.code === 'ERR_NETWORK') {
      const message =
        getErrorMessage(apiMessage) || 'Tidak dapat terhubung ke server';
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
