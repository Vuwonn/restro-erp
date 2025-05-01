import { useEffect, useState } from 'react';
import axios from 'axios';
import { ORDER_API_END_POINT } from '@/utils/constant';

const useOrder = () => {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(ORDER_API_END_POINT);
      setOrders(response.data.orders);
      setTotalOrders(response.data.totalOrders);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, totalOrders, loading, error, refetch: fetchOrders };
};

export default useOrder;
