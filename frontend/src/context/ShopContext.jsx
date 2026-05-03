import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useProducts, useCart, useAddToCart, useUpdateCart } from '../hooks/useApi';
import Loading from '../components/Loading';

// eslint-disable-next-line react-refresh/only-export-components
export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = 'đ';
    const delivery_fee = 20000;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    // Use TanStack Query hooks
    const { data: products = [], isLoading: productsLoading } = useProducts();
    const { data: cartItems = {}, refetch: refetchCart } = useCart();
    const addToCartMutation = useAddToCart();
    const updateCartMutation = useUpdateCart();

    const addToCart = async (itemId, quantity, size) => {
        if (!size) {
            toast.error('Vui lòng chọn kích thước');
            return;
        }
        if (token) {
            addToCartMutation.mutate({ itemId, quantity, size });
        } else {
            toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const itemId in cartItems) {
            const sizes = cartItems[itemId];
            for (const size in sizes) {
                totalCount += Number(sizes[size]) || 0;
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, quantity, size) => {
        if (token) {
            updateCartMutation.mutate({ itemId, quantity, size });
        }
    };

    const getCartAmount = () => {
        let totalAmount = 0;

        for (const itemId in cartItems) {
            const itemInfo = products.find(product => product._id === itemId);
            if (!itemInfo) continue;

            const sizes = cartItems[itemId];
            for (const size in sizes) {
                const quantity = sizes[size];
                totalAmount += itemInfo.price * quantity;
            }
        }

        return totalAmount;
    };

    // Load token from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            refetchCart();
        }
    }, [refetchCart]);

    const value = {
        products,
        productsLoading,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        backendUrl,
        setToken,
        token,
        refetchCart
    }

    return (
        <ShopContext.Provider value={value}>
            {productsLoading ? (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative w-20 h-20 overflow-hidden animate-grow-up">
                            <img 
                                src="/favicon.png" 
                                alt="Loading" 
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="flex items-center gap-2 animate-pulse">
                            <span className="text-primary-700 font-medium">Vườn Lá Nhỏ</span>
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider