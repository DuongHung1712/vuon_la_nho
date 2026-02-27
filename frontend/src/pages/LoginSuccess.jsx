import { useEffect, useContext, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";

export default function LoginSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setToken, refetchCart, backendUrl } = useContext(ShopContext);
  const [error, setError] = useState(null);

useEffect(() => {
    const processLogin = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/user/session`, {
          withCredentials: true  
        });
        
        if (!response.data.success) {
          navigate("/login");
          return;
        }
        
        const token = response.data.token;

        localStorage.setItem("token", token);
        
        setToken(token);
        
        await queryClient.invalidateQueries({ queryKey: ["profile"] });
        
        await refetchCart();
        
        navigate("/");
      } catch (error) {
        console.error("Login processing error:", error);
        setError("Có lỗi xảy ra khi xử lý đăng nhập");
        setTimeout(() => navigate("/login"), 2000);
      }
    };

    processLogin();
  }, [navigate, setToken, refetchCart, queryClient, backendUrl]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="text-center">
        {error ? (
          <>
            <p className="text-sm text-gray-500">Đang chuyển về trang đăng nhập...</p>
          </>
        ) : (
          <>
            <div className="relative mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-500 mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-primary-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="text-lg font-medium text-gray-700 mb-2">Đang xử lý đăng nhập...</p>
            <p className="text-sm text-gray-500">Vui lòng đợi trong giây lát</p>
          </>
        )}
      </div>
    </div>
  );
}
