import { useState, useMemo } from 'react';

const usePOSCart = () => {
  const [cart, setCart] = useState([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [cashPaid, setCashPaid] = useState(0);
  const [creditAmount, setCreditAmount] = useState(0);
  const [customerName, setCustomerName] = useState('Guest');
const [customerNumber, setCustomerNumber] = useState('');


  const addToCart = (item) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === item.id);
      if (existing) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((i) => i.id !== id));
  };

  const increaseQty = (id) => {
    setCart((prevCart) =>
      prevCart.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  };

  const decreaseQty = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((i) =>
          i.id === id
            ? { ...i, quantity: i.quantity > 1 ? i.quantity - 1 : 1 }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
    setDiscountPercent(0);
    setCashPaid(0);
    setCreditAmount(0);
  };

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const discount = useMemo(
    () => (subtotal * Math.min(discountPercent, 100)) / 100,
    [subtotal, discountPercent]
  );

  const serviceCharge = useMemo(() => (subtotal - discount) * 0.1, [subtotal, discount]);

  const total = useMemo(
    () => subtotal - discount + serviceCharge - creditAmount,
    [subtotal, discount, serviceCharge, creditAmount]
  );

  const change = useMemo(
    () => (cashPaid > total ? cashPaid - total : 0).toFixed(2),
    [cashPaid, total]
  );

  return {
  cart,
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
  subtotal,
  discount,
  discountPercent,
  setDiscountPercent,
  serviceCharge,
  total,
  cashPaid,
  setCashPaid,
  creditAmount,
  setCreditAmount,
  change,
  customerName,
  setCustomerName,
  customerNumber,
  setCustomerNumber,
};

};

export default usePOSCart;
