import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LoginSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");

    if (token) {
      localStorage.setItem("token", token); // lưu token
      setToken(token);

      navigate("/"); // chuyển về home
    }
  }, [navigate]);

  return <p>Đang xử lý đăng nhập...</p>;
}

export default LoginSuccess;
