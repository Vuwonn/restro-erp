import { useEffect, useState } from "react";
import axios from "axios";

const useTotalRevenue = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await axios.get("/api/revenue/stats");
        setTotalRevenue(response.data.totalRevenue || 0);

      } catch (err) {
        setError("Failed to fetch revenue stats");
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  return { totalRevenue, loading, error };
};

export default useTotalRevenue;

