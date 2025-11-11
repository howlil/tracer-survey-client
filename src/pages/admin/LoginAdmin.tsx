/** @format */

import {Layout} from '@/components/layout/Layout';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {cn} from '@/lib/utils';
import {Eye, EyeOff, Lock, Mail} from 'lucide-react';
import * as React from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'sonner';
import {adminLogin} from '@/api/auth.api';

function LoginAdmin() {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({...prev, [name]: ''}));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Email tidak valid';
      }
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (credentials: {
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    setError('');

    try {
      // Call API
      const response = await adminLogin(credentials);

      // Save token to localStorage
      localStorage.setItem('auth-token', response.token);

      // Save user info (optional, for display purposes)
      localStorage.setItem(
        'auth-user',
        JSON.stringify({
          id: response.id,
          name: response.name,
          email: response.email,
          username: response.username,
        })
      );

      toast.success('Login berhasil!', {
        description: `Selamat datang, ${response.name}`,
        duration: 3000,
      });

      // Navigate to dashboard after successful login
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1000);
    } catch (err) {
      // Error handling - axios interceptor already shows toast for API errors
      const error = err as {
        response?: {data?: {message?: string}};
        message?: string;
      };

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Email atau password salah';

      setError(errorMessage);

      // Only show toast if axios interceptor didn't handle it
      if (!error.response) {
        toast.error('Login gagal!', {
          description: errorMessage,
          duration: 3000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      handleLogin(formData);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Layout>
      <div className='min-h-screen bg-gradient-to-br from-background to-muted/20'>
        <div className='container mx-auto px-4 py-8'>
          <div className='max-w-md mx-auto'>
            {/* Header */}
            <div className='text-center space-y-6 mb-8'>
              <div className='inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4'>
                <Lock className='h-8 w-8 text-primary' />
              </div>
              <h1 className='text-3xl font-bold text-foreground'>
                Admin Login
              </h1>
              <p className='text-muted-foreground'>
                Masuk ke dashboard admin Tracer Study & User Survey
              </p>
            </div>

            {/* Login Form */}
            <div className='bg-background border rounded-2xl shadow-xl p-8 space-y-6'>
              <form
                onSubmit={handleSubmit}
                className='space-y-6'
              >
                {/* Email Field */}
                <div className='space-y-2'>
                  <Label
                    htmlFor='email'
                    className='text-sm font-medium'
                  >
                    Email
                  </Label>
                  <div className='relative'>
                    <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                    <Input
                      id='email'
                      name='email'
                      type='email'
                      placeholder='Masukkan email'
                      value={formData.email}
                      onChange={handleInputChange}
                      className={cn(
                        'pl-10',
                        errors.email &&
                          'border-destructive focus:border-destructive'
                      )}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <p className='text-xs text-destructive'>{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className='space-y-2'>
                  <Label
                    htmlFor='password'
                    className='text-sm font-medium'
                  >
                    Password
                  </Label>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                    <Input
                      id='password'
                      name='password'
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Masukkan password'
                      value={formData.password}
                      onChange={handleInputChange}
                      className={cn(
                        'pl-10 pr-10',
                        errors.password &&
                          'border-destructive focus:border-destructive'
                      )}
                      disabled={isLoading}
                    />
                    <button
                      type='button'
                      onClick={togglePasswordVisibility}
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className='text-xs text-destructive'>
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className='p-3 bg-destructive/10 border border-destructive/20 rounded-md'>
                    <p className='text-sm text-destructive'>{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type='submit'
                  className='w-full'
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className='flex items-center space-x-2'>
                      <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                      <span>Memproses...</span>
                    </div>
                  ) : (
                    'Masuk'
                  )}
                </Button>
              </form>

              {/* Additional Info */}
              <div className='text-center space-y-2 pt-4 border-t'>
                <div className='flex flex-col items-center justify-center text-xs text-muted-foreground'>
                  <span>© 2025 Tracer Study & User Survey</span>
                  <span>Universitas Andalas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default LoginAdmin;
