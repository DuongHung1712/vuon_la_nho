import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile, useUpdateProfile } from '../hooks/useApi';
import { Mail, User, Phone, MapPin, Save, X, Camera } from 'lucide-react';
import Loading from '../components/Loading';

const ProfileEdit = () => {
    const navigate = useNavigate();
    const { data, isLoading: loading } = useProfile();
    const updateProfileMutation = useUpdateProfile();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
    });

    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');

    useEffect(() => {
        if (data?.user) {
            setFormData({
                name: data.user.name || '',
                phone: data.user.phone || '',
                address: data.user.address || '',
            });
            setAvatarPreview(data.user.avatar || '');
        }
    }, [data]);

    // Redirect if no token
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        }
    }, [navigate]);

    if (loading) {
        return <Loading />;
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('phone', formData.phone);
        submitData.append('address', formData.address);
        if (avatar) {
            submitData.append('avatar', avatar);
        }
        updateProfileMutation.mutate(submitData, {
            onSuccess: () => {
                navigate('/profile');
            },
        });
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Đang tải...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                {/* Header */}
                <div className="bg-primary-400 px-8 py-6">
                    <h1 className="text-2xl font-bold text-white">Chỉnh sửa thông tin</h1>
                </div>
                
                <form onSubmit={handleSubmit} className="px-8 py-8">
                    <div className="space-y-6">
                        {/* Avatar upload */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full border-4 border-primary-400 overflow-hidden bg-gray-100 flex items-center justify-center">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-16 h-16 text-gray-400" />
                                    )}
                                </div>
                                <label htmlFor="avatar" className="absolute bottom-0 right-0 bg-primary-400 text-white p-2 rounded-full cursor-pointer hover:bg-primary-500 transition shadow-lg">
                                    <Camera className="w-5 h-5" />
                                </label>
                                <input
                                    type="file"
                                    id="avatar"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </div>
                            <p className="text-sm text-gray-500 mt-2">Nhấp để thay đổi ảnh đại diện</p>
                        </div>

                        {/* Email field */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Mail className="w-4 h-4" />
                                Email
                            </label>
                            <input
                                type="email"
                                value={data?.user?.email || ''}
                                disabled
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-600"
                            />
                            <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
                        </div>

                        {/* Name field */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <User className="w-4 h-4" />
                                Họ tên <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                                placeholder="Nhập họ tên của bạn"
                            />
                        </div>

                        {/* Phone field */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Phone className="w-4 h-4" />
                                Số điện thoại
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                                placeholder="Nhập số điện thoại"
                            />
                        </div>

                        {/* Address field */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <MapPin className="w-4 h-4" />
                                Địa chỉ
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 resize-none"
                                placeholder="Nhập địa chỉ của bạn"
                            />
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-8">
                        <button
                            type="submit"
                            disabled={updateProfileMutation.isPending}
                            className="flex-1 bg-primary-400 text-white py-3 px-6 rounded-lg hover:bg-primary-500 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                        >
                            {updateProfileMutation.isPending ? (
                                <span>Đang lưu...</span>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    <span>Lưu thay đổi</span>
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/profile')}
                            className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition font-medium flex items-center justify-center gap-2"
                        >
                            <X className="w-5 h-5" />
                            <span>Hủy</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileEdit;
