import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useResetPassword } from '../hooks/useApi';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Leaf, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const token = searchParams.get('token');

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm({
    mode: 'onBlur'
  });

  const password = watch('password');
  const resetPasswordMutation = useResetPassword();

  useEffect(() => {
    if (!token) {
      navigate('/forgot-password');
    }
  }, [token, navigate]);

  const onSubmitHandler = async (data) => {
    resetPasswordMutation.mutate(
      { token, password: data.password },
      {
        onSuccess: (response) => {
          if (response.data.success) {
            setResetSuccess(true);
            setTimeout(() => {
              navigate('/login');
            }, 3000);
          }
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <a className="inline-flex items-center space-x-2 mb-2" href="/">
            <Leaf className="h-10 w-10 text-primary-400" />
            <span className="text-3xl font-bold text-gray-900">Vườn Lá Nhỏ</span>
          </a>
          <p className="text-gray-600 mt-2">Tạo mật khẩu mới</p>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Đặt Lại Mật Khẩu</CardTitle>
            <CardDescription className="text-center">
              {resetSuccess ? 'Mật khẩu đã được đặt lại!' : 'Nhập mật khẩu mới của bạn'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!resetSuccess ? (
              <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu mới</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register('password', {
                        required: 'Vui lòng nhập mật khẩu',
                        minLength: {
                          value: 8,
                          message: 'Mật khẩu phải có ít nhất 8 ký tự'
                        }
                      })}
                      className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register('confirmPassword', {
                        required: 'Vui lòng xác nhận mật khẩu',
                        validate: (value) =>
                          value === password || 'Mật khẩu không khớp'
                      })}
                      className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Đặt Lại Mật Khẩu'}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-green-900 mb-2 text-lg">Thành công!</h3>
                  <p className="text-sm text-green-700">
                    Mật khẩu của bạn đã được đặt lại thành công.
                  </p>
                  <p className="text-xs text-green-600 mt-3">
                    Đang chuyển hướng đến trang đăng nhập...
                  </p>
                </div>

                <Button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full"
                >
                  Đăng Nhập Ngay
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
