import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = ' VND';
    const delivery_fee = 20000;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [size, setSize] = useState('');
    const [token, setToken] = useState('');
    const navigate = useNavigate();



    const addToCart = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    if (!cartData[itemId]) {
        cartData[itemId] = {};
    }

    if (cartData[itemId][size]) {
        cartData[itemId][size] += quantity;
    } else {
        cartData[itemId][size] = quantity;
    }
        setCartItems(cartData);
        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })

            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
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

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);

        cartData[itemId] = quantity;    
        setCartItems(cartData);
        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }

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
    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.success) {
                setProducts(response.data.products)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get',{},{headers:{token}})
            console.log(response.data)
            if (response.data.success){
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
    useEffect(() => {
        getProductsData()
    }, [])
    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
        }
    }, [])
    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken, token
    }
    useEffect(() => {
        console.log(cartItems);

    }, [cartItems])
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider