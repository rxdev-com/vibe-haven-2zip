import React, { createContext, useContext, useState, useCallback } from 'react';
const CartContext = /*#__PURE__*/ createContext(undefined);
export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
export function CartProvider({ children }) {
    const [items, setItems] = useState([]);
    const addItem = useCallback((item)=>{
        setItems((prev)=>{
            const existingItem = prev.find((i)=>i.id === item.id);
            if (existingItem) {
                return prev.map((i)=>i.id === item.id ? {
                        ...i,
                        quantity: i.quantity + 1
                    } : i);
            }
            return [
                ...prev,
                {
                    ...item,
                    quantity: 1
                }
            ];
        });
    }, []);
    const removeItem = useCallback((id)=>{
        setItems((prev)=>prev.filter((item)=>item.id !== id));
    }, []);
    const updateQuantity = useCallback((id, quantity)=>{
        if (quantity <= 0) {
            removeItem(id);
            return;
        }
        setItems((prev)=>prev.map((item)=>item.id === id ? {
                    ...item,
                    quantity
                } : item));
    }, [
        removeItem
    ]);
    const clearCart = useCallback(()=>{
        setItems([]);
    }, []);
    const isInCart = useCallback((id)=>{
        return items.some((item)=>item.id === id);
    }, [
        items
    ]);
    const totalItems = items.reduce((sum, item)=>sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item)=>sum + item.price * item.quantity, 0);
    return /*#__PURE__*/ React.createElement(CartContext.Provider, {
        value: {
            items,
            totalItems,
            totalAmount,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            isInCart
        }
    }, children);
}
