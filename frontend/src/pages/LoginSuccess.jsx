import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function LoginSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/"); // quay về trang chủ hoặc dashboard
    } else {
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return <p>Đang xử lý đăng nhập...</p>;
}
