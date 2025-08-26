import { useContext, useEffect } from "react"
import { ShopContext } from "../context/ShopContext"



const LoginSuccess = () => {
    const {setToken} = useContext(ShopContext);
    const navigate = useContext(ShopContext).navigate;

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');  
        if (token){
            localStorage.setItem('token', token);
            setToken(token);
            navigate('/');
        }else{
            navigate('/login');
        }
    }, [navigate, setToken]);
    return <div>Đang xử lý đăng nhập...</div>;
}

export default LoginSuccess;