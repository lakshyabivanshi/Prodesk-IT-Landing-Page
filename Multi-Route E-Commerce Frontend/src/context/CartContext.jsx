import { createContext, useEffect, useState } from "react";
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart((prev) => [...prev, product]);
        alert(`Product added successfully!🎉 \n\nYou can view your items in the Cart.`)
    };
    const removeFromCart = (index) => {
        setCart((prev) => prev.filter((_, i) => i != index));
    }
    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

