import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useApi';
import { Mail, Phone, MapPin, Edit, LogOut, User, Leaf } from 'lucide-react';
import Loading from '../components/Loading';
import SEO from '../components/SEO';

const Profile = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const { data, isLoading: loading, error } = useProfile(token);

    // Redirect if no token
    React.useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [navigate, token]);

    // Redirect on auth error
    React.useEffect(() => {
        if (error?.response?.status === 401) {
            navigate('/login');
        }
    }, [error, navigate]);

    const user = data?.user;

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div className="text-red-500 text-center mt-4">Không thể tải thông tin người dùng</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <SEO noindex={true} title="Hồ sơ cá nhân - Vườn Lá Nhỏ" />
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                {/* Header */}
                <div className="relative h-24 sm:h-32 bg-primary-400">
                    <div className="absolute -bottom-12 sm:-bottom-16 left-4 sm:left-8">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-primary-400 flex items-center justify-center shadow-lg overflow-hidden">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="px-4 sm:px-8 pt-16 sm:pt-20 pb-6 sm:pb-8">
                    {/* User name */}
                    <div className="flex items-center gap-3 mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{user?.name}</h1>
                        <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-primary-400" />
                    </div>
                    
                    {/* Info section */}
                    <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
                        <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-primary-400 transition">
                            <div className="flex items-center gap-2 mb-2 text-gray-600">
                                <Mail className="w-5 h-5" />
                                <p className="text-sm font-semibold">Email</p>
                            </div>
                            <p className="text-gray-800 break-all">{user?.email}</p>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-primary-400 transition">
                            <div className="flex items-center gap-2 mb-2 text-gray-600">
                                <Phone className="w-5 h-5" />
                                <p className="text-sm font-semibold">Số điện thoại</p>
                            </div>
                            <p className="text-gray-800">{user?.phone || 'Chưa cập nhật'}</p>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-primary-400 transition">
                            <div className="flex items-center gap-2 mb-2 text-gray-600">
                                <MapPin className="w-5 h-5" />
                                <p className="text-sm font-semibold">Địa chỉ</p>
                            </div>
                            <p className="text-gray-800">{user?.address || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => navigate('/profile/edit')}
                            className="flex-1 bg-primary-400 text-white py-3 px-6 rounded-lg hover:bg-primary-500 transition font-medium flex items-center justify-center gap-2"
                        >
                            <Edit className="w-5 h-5" />
                            Chỉnh sửa thông tin
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex-1 bg-secondary text-white py-3 px-6 rounded-lg hover:bg-secondary-dark transition font-medium flex items-center justify-center gap-2"
                        >
                            <LogOut className="w-5 h-5" />
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;