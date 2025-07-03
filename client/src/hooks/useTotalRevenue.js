import { useEffect, useState } from "react";
import axios from "axios";
import { POS_API_END_POINT } from "@/utils/constant";

const useTotalRevenue = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRevenue = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${POS_API_END_POINT}/daily-sales`, {
        withCredentials: true,
      });
      setTotalRevenue(response.data.totalRevenue || 0);
      setError(null);
    } catch (err) {
      setError("Failed to fetch revenue stats");
      console.error("Error fetching total revenue:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  return { totalRevenue, loading, error, refetch: fetchRevenue };
};
export default useTotalRevenue;

