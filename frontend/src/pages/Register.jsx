import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { useRegister } from '../hooks/useApi';
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Leaf } from 'lucide-react'

const Register = () => {
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [searchParams] = useSearchParams();

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, reset } = useForm({
    mode: 'onBlur'
  });

  const password = watch('password');

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      switch (error) {
        case 'oauth_failed':
          toast.error('Đăng nhập thất bại. Vui lòng thử lại.');
          break;
        case 'no_code':
          toast.error('Không nhận được mã xác thực. Vui lòng thử lại.');
          break;
        case 'no_email':
          toast.error('Không thể lấy email từ tài khoản. Vui lòng thử phương thức khác.');
          break;
        case 'auth_failed':
          toast.error('Xác thực thất bại. Vui lòng thử lại.');
          break;
        default:
          toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
      }
      navigate('/register', { replace: true });
    }
  }, [searchParams, navigate]);

  const registerMutation = useRegister();

  const onSubmitHandler = async (data) => {
    registerMutation.mutate({
      name: data.name,
      email: data.email,
      password: data.password
    }, {
      onSuccess: (response) => {
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        }
      }
    });
  };

  const onClickFacebook = () => {
    window.location.href = backendUrl + '/api/user/auth/facebook';
  };

  const onClickGoogle = () => {
    window.location.href = backendUrl + '/api/user/auth/google';
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <a className="inline-flex items-center space-x-2 mb-2" href="/">
            <Leaf className="h-10 w-10 text-primary-400" />
            <span className="text-3xl font-bold text-gray-900">Vườn Lá Nhỏ</span>
          </a>
          <p className="text-gray-600 mt-2">Tạo tài khoản mới</p>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Đăng Ký</CardTitle>
            <CardDescription className="text-center">Điền thông tin để tạo tài khoản mới</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  {...register('name', {
                    required: 'Vui lòng nhập họ tên',
                    minLength: {
                      value: 2,
                      message: 'Họ tên phải có ít nhất 2 ký tự'
                    }
                  })}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  {...register('email', {
                    required: 'Vui lòng nhập email',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email không hợp lệ'
                    }
                  })}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'Vui lòng nhập mật khẩu',
                    minLength: {
                      value: 6,
                      message: 'Mật khẩu phải có ít nhất 6 ký tự'
                    }
                  })}
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register('confirmPassword', {
                    required: 'Vui lòng xác nhận mật khẩu',
                    validate: (value) =>
                      value === password || 'Mật khẩu không khớp'
                  })}
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Footer Link */}
              <div className="text-center text-sm pt-2">
                <span className="text-gray-600">Đã có tài khoản? </span>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => navigate('/login')}
                  className="p-0 h-auto"
                >
                  Đăng nhập
                </Button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Đang xử lý...' : 'Đăng Ký'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">Hoặc</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClickGoogle}
                className="w-full"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path>
                </svg>
                Đăng ký với Google
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={onClickFacebook}
                className="w-full"
              >
                <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                </svg>
                Đăng ký với Facebook
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Register
