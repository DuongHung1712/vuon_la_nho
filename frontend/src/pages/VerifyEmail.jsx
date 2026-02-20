import React, { useEffect, useState } from 'react';
import { useVerifyEmail } from '../hooks/useApi';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Leaf, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // verifying, success, error
  const token = searchParams.get('token');

  const verifyEmailMutation = useVerifyEmail();

  useEffect(() => {
    if (!token) {
      setVerificationStatus('error');
      return;
    }

    verifyEmailMutation.mutate(token, {
      onSuccess: (response) => {
        if (response.data.success) {
          setVerificationStatus('success');
        } else {
          setVerificationStatus('error');
        }
      },
      onError: () => {
        setVerificationStatus('error');
      }
    });
  }, [token]);

  const renderContent = () => {
    switch (verificationStatus) {
      case 'verifying':
        return (
          <div className="text-center py-8">
            <Loader2 className="h-16 w-16 text-primary-600 mx-auto mb-4 animate-spin" />
            <h3 className="font-semibold text-gray-900 mb-2 text-lg">Đang xác thực email...</h3>
            <p className="text-sm text-gray-600">
              Vui lòng đợi trong giây lát
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-green-900 mb-2 text-lg">Xác thực thành công!</h3>
              <p className="text-sm text-green-700">
                Email của bạn đã được xác thực. Bạn có thể sử dụng đầy đủ các tính năng của Vườn Lá Nhỏ.
              </p>
            </div>

            <Button
              type="button"
              onClick={() => navigate('/')}
              className="w-full"
            >
              Về Trang Chủ
            </Button>
          </div>
        );

      case 'error':
        return (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h3 className="font-semibold text-red-900 mb-2 text-lg">Xác thực thất bại</h3>
              <p className="text-sm text-red-700">
                Link xác thực không hợp lệ hoặc đã hết hạn.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                type="button"
                onClick={() => navigate('/profile')}
                className="w-full"
              >
                Gửi lại email xác thực
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full"
              >
                Về Trang Chủ
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
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
          <p className="text-gray-600 mt-2">Xác thực email</p>
        </div>

        {/* Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Xác Thực Email</CardTitle>
            <CardDescription className="text-center">
              {verificationStatus === 'verifying' && 'Đang kiểm tra...'}
              {verificationStatus === 'success' && 'Email đã được xác thực'}
              {verificationStatus === 'error' && 'Có lỗi xảy ra'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
