import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi, orderApi, authApi } from '../services/api';
import { toast } from 'react-toastify';

// ==================== AUTH HOOKS ====================
export const useAdminLogin = () => {
    return useMutation({
        mutationFn: ({ email, password }) => authApi.adminLogin(email, password),
        onSuccess: (response) => {
            if (response.data.success) {
                toast.success('Đăng nhập thành công!');
                return response.data;
            } else {
                toast.error(response.data.message);
            }
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};

// ==================== PRODUCT HOOKS ====================
export const useProducts = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await productApi.list();
            if (response.data.success) {
                return response.data.products;
            }
            throw new Error(response.data.message);
        },
    });
};

export const useAddProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: productApi.add,
        onSuccess: (response) => {
            if (response.data.success) {
                toast.success('Thêm sản phẩm thành công!');
                queryClient.invalidateQueries({ queryKey: ['products'] });
            } else {
                toast.error(response.data.message);
            }
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: productApi.update,
        onSuccess: (response) => {
            if (response.data.success) {
                toast.success('Cập nhật sản phẩm thành công!');
                queryClient.invalidateQueries({ queryKey: ['products'] });
            } else {
                toast.error(response.data.message);
            }
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};

export const useRemoveProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => productApi.remove(id),
        onSuccess: (response) => {
            if (response.data.success) {
                toast.success('Xóa sản phẩm thành công!');
                queryClient.invalidateQueries({ queryKey: ['products'] });
            } else {
                toast.error(response.data.message);
            }
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};

// ==================== ORDER HOOKS ====================
export const useOrders = () => {
    return useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            const response = await orderApi.list();
            if (response.data.success) {
                return response.data.orders;
            }
            throw new Error(response.data.message);
        },
    });
};

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ orderId, status }) => orderApi.updateStatus(orderId, status),
        onSuccess: (response) => {
            if (response.data.success) {
                toast.success('Cập nhật trạng thái thành công!');
                queryClient.invalidateQueries({ queryKey: ['orders'] });
            } else {
                toast.error(response.data.message);
            }
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};
