import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  userApi,
  productApi,
  cartApi,
  orderApi,
  diseaseApi,
  reviewApi,
} from "../services/api";
import { toast } from "react-toastify";

// ==================== USER HOOKS ====================
const getErrorMessage = (message) => {
  const errorMap = {
    "User already exists": "Email này đã được đăng ký",
    "User does not exist": "Email chưa được đăng ký",
    "Invalid credentials": "Mật khẩu không chính xác",
    "Please enter a valid email address": "Email không hợp lệ",
    "Please enter a strong password": "Mật khẩu phải có ít nhất 8 ký tự",
  };
  return errorMap[message] || message || "Có lỗi xảy ra. Vui lòng thử lại.";
};

export const useRegister = () => {
  return useMutation({
    mutationFn: userApi.register,
    onSuccess: (response) => {
      if (response.data.success) {
        toast.success("Đăng ký thành công!");
      } else {
        toast.error(getErrorMessage(response.data.message));
      }
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(getErrorMessage(errorMessage));
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: userApi.login,
    onSuccess: (response) => {
      if (response.data.success) {
        toast.success("Đăng nhập thành công!");
      } else {
        toast.error(getErrorMessage(response.data.message));
      }
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(getErrorMessage(errorMessage));
    },
  });
};

export const useProfile = (token) => {
  return useQuery({
    queryKey: ["profile", token],
    queryFn: async () => {
      const response = await userApi.profile();
      return response.data;
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: (response) => {
      if (response.data.success) {
        toast.success("Cập nhật thông tin thành công!");
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      } else {
        toast.error(response.data.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useSendVerificationEmail = () => {
  return useMutation({
    mutationFn: userApi.sendVerificationEmail,
    onSuccess: (response) => {
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Không thể gửi email");
    },
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: userApi.verifyEmail,
    onSuccess: (response) => {
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Xác thực thất bại");
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: userApi.forgotPassword,
    onSuccess: (response) => {
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Không thể gửi email");
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, password }) => userApi.resetPassword(token, password),
    onSuccess: (response) => {
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Đặt lại mật khẩu thất bại");
    },
  });
};

// ==================== PRODUCT HOOKS ====================
export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await productApi.list();
      if (response.data.success) {
        return response.data.products;
      }
      throw new Error(response.data.message);
    },
  });
};

export const useProduct = (productId) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const response = await productApi.single(productId);
      if (response.data.success) {
        return response.data.product;
      }
      throw new Error(response.data.message);
    },
    enabled: !!productId,
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productApi.add,
    onSuccess: (response) => {
      if (response.data.success) {
        toast.success("Thêm sản phẩm thành công!");
        queryClient.invalidateQueries({ queryKey: ["products"] });
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
    mutationFn: productApi.remove,
    onSuccess: (response) => {
      if (response.data.success) {
        toast.success("Xóa sản phẩm thành công!");
        queryClient.invalidateQueries({ queryKey: ["products"] });
      } else {
        toast.error(response.data.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useSuggestProducts = () => {
  return useMutation({
    mutationFn: productApi.suggest,
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

// ==================== CART HOOKS ====================
export const useCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await cartApi.get();
      if (response.data.success) {
        return response.data.cartData;
      }
      throw new Error(response.data.message);
    },
    enabled: !!localStorage.getItem("token"),
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity, size }) =>
      cartApi.add(itemId, quantity, size),
    onSuccess: (response) => {
      if (response.data.success) {
        toast.success("Đã thêm vào giỏ hàng!");
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      } else {
        toast.error(response.data.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity, size }) =>
      cartApi.update(itemId, quantity, size),
    onSuccess: (response) => {
      if (response.data.success) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
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
export const usePlaceOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderApi.place,
    onSuccess: (response) => {
      if (response.data.success) {
        toast.success("Đặt hàng thành công!");
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        queryClient.invalidateQueries({ queryKey: ["orders"] });
      } else {
        toast.error(response.data.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useUserOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await orderApi.userOrders();
      if (response.data.success) {
        return response.data.orders;
      }
      throw new Error(response.data.message);
    },
    enabled: !!localStorage.getItem("token"),
  });
};

export const useAllOrders = () => {
  return useQuery({
    queryKey: ["allOrders"],
    queryFn: async () => {
      const response = await orderApi.allOrders();
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
        toast.success("Cập nhật trạng thái thành công!");
        queryClient.invalidateQueries({ queryKey: ["allOrders"] });
        queryClient.invalidateQueries({ queryKey: ["orders"] });
      } else {
        toast.error(response.data.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

// ==================== DISEASE DETECTION HOOKS ====================
export const useDetectDisease = () => {
  return useMutation({
    mutationFn: diseaseApi.detect,
    onSuccess: (response) => {
      if (response.data.success) {
        toast.success("Phát hiện bệnh thành công!");
      } else {
        toast.error(response.data.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

// ==================== REVIEW HOOKS ====================
export const useProductReviews = (productId, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["reviews", productId, page],
    queryFn: async () => {
      const response = await reviewApi.list(productId, page, limit);
      if (response.data.success) {
        return response.data;
      }
      throw new Error(response.data.message);
    },
    enabled: !!productId,
  });
};

export const useCheckUserReview = (productId) => {
  const getToken = () => localStorage.getItem("token");

  return useQuery({
    queryKey: ["userReview", productId],
    queryFn: async () => {
      const response = await reviewApi.check(productId);
      if (response.data.success) {
        return response.data;
      }
      throw new Error(response.data.message);
    },
    enabled: !!productId && !!getToken(),
  });
};

export const useAddReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewApi.add,
    onSuccess: (response, variables) => {
      if (response.data.success) {
        toast.success("Đánh giá thành công!");
        queryClient.invalidateQueries({ queryKey: ["reviews", variables.productId] });
        queryClient.invalidateQueries({ queryKey: ["userReview", variables.productId] });
        queryClient.invalidateQueries({ queryKey: ["products"] });
      } else {
        toast.error(response.data.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewApi.update,
    onSuccess: (response) => {
      if (response.data.success) {
        toast.success("Cập nhật đánh giá thành công!");
        queryClient.invalidateQueries({ queryKey: ["reviews"] });
        queryClient.invalidateQueries({ queryKey: ["userReview"] });
        queryClient.invalidateQueries({ queryKey: ["products"] });
      } else {
        toast.error(response.data.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewApi.delete,
    onSuccess: (response) => {
      if (response.data.success) {
        toast.success("Xóa đánh giá thành công!");
        queryClient.invalidateQueries({ queryKey: ["reviews"] });
        queryClient.invalidateQueries({ queryKey: ["userReview"] });
        queryClient.invalidateQueries({ queryKey: ["products"] });
      } else {
        toast.error(response.data.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

