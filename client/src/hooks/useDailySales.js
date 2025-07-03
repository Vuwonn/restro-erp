// src/hooks/useDailySales.js
import { useEffect, useState } from "react";
import axios from "axios";
import { POS_API_END_POINT } from "@/utils/constant";

const useDailySales = () => {
  const [data, setData] = useState({ totalSales: 0, orders: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${POS_API_END_POINT}/daily-sales`, {
        withCredentials: true,
      });
      setData({
        totalSales: res.data.totalSales || 0,
        orders: res.data.orders || 0,
      });
      setError(null);
    } catch (err) {
      console.error("Error fetching daily sales:", err);
      setError("Failed to fetch daily sales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error };
};

export default useDailySales;
