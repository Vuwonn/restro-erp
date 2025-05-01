// hooks/customer/useCart.js
import { setOrderItems } from '@/redux/orderSlice';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useCart = () => {
  const dispatch = useDispatch();
  const { items: cartItems } = useSelector(state => state.order);
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Calculate derived values
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const addToCart = (item) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      updateQuantity(item.id, existingItem.quantity + 1);
    } else {
      const newCart = [...cartItems, { ...item, quantity: 1 }];
      dispatch(setOrderItems({ items: newCart, subtotal: subtotal + item.price, totalItems: totalItems + 1 }));
    }
  };

  const removeFromCart = (itemId) => {
    const itemToRemove = cartItems.find(item => item.id === itemId);
    if (!itemToRemove) return;
    
    const newCart = cartItems.filter(item => item.id !== itemId);
    dispatch(setOrderItems({ 
      items: newCart, 
      subtotal: subtotal - (itemToRemove.price * itemToRemove.quantity),
      totalItems: totalItems - itemToRemove.quantity
    }));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }

    const itemToUpdate = cartItems.find(item => item.id === itemId);
    if (!itemToUpdate) return;

    const updatedCart = cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );

    const quantityDiff = newQuantity - itemToUpdate.quantity;
    dispatch(setOrderItems({
      items: updatedCart,
      subtotal: subtotal + (itemToUpdate.price * quantityDiff),
      totalItems: totalItems + quantityDiff
    }));
  };

  return {
    cart: cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    totalItems,
    subtotal
  };
};

export default useCart;