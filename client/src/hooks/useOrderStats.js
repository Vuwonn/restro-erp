import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { ORDER_API_END_POINT } from '@/utils/constant';

const useOrderStats = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrderStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${ORDER_API_END_POINT}/orders`);
      setTotalOrders(response.data.totalOrders || 0);
      setError(null);
    } catch (err) {
      console.error("Error fetching order stats:", err);
      setError(err.response?.data?.message || "Failed to fetch order stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrderStats();
  }, [fetchOrderStats]);

  return { totalOrders, loading, error, refetch: fetchOrderStats };
};

export default useOrderStats;
