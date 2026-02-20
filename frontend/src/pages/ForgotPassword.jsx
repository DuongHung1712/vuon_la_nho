import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useForgotPassword } from '../hooks/useApi';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Leaf, ArrowLeft, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm({
    mode: 'onBlur'
  });

  const forgotPasswordMutation = useForgotPassword();
  const email = watch('email');

  const onSubmitHandler = async (data) => {
    forgotPasswordMutation.mutate(data.email, {
      onSuccess: (response) => {
        if (response.data.success) {
          setEmailSent(true);
        }
      }
    });
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
          <p className="text-gray-600 mt-2">Đặt lại mật khẩu của bạn</p>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Quên Mật Khẩu</CardTitle>
            <CardDescription className="text-center">
              {emailSent 
                ? 'Email đã được gửi!' 
                : 'Nhập email để nhận link đặt lại mật khẩu'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!emailSent ? (
              <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
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

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Đang gửi...' : 'Gửi Email Đặt Lại'}
                </Button>

                {/* Back to Login */}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại đăng nhập
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <Mail className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-green-900 mb-2">Email đã được gửi!</h3>
                  <p className="text-sm text-green-700 mb-1">
                    Chúng tôi đã gửi link đặt lại mật khẩu đến
                  </p>
                  <p className="font-medium text-green-900">{email}</p>
                  <p className="text-xs text-green-600 mt-3">
                    Link sẽ hết hạn sau 1 giờ
                  </p>
                </div>

                <div className="text-center text-sm text-gray-600">
                  <p>Không nhận được email?</p>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setEmailSent(false)}
                    className="p-0 h-auto"
                  >
                    Gửi lại
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/login')}
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại đăng nhập
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
