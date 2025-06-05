// src/hooks/useTableStats.js
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { TABLE_API_END_POINT } from "@/utils/constant";

const useTableStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${TABLE_API_END_POINT}/totaldocuments`, { withCredentials: true });
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching table stats:", err);
      setError("Failed to load table stats: " + err.message);
      toast.error("Failed to load table stats: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error };
};

export default useTableStats;