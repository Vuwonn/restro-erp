import { useState, useEffect } from "react";
import axios from "axios";

const useKitchenStatus = () => {
  const [kitchenStatus, setKitchenStatus] = useState({ pending: 0, prepared: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKitchenStatus = async () => {
      try {
        const res = await axios.get("/api/kitchen/status"); // Modify the endpoint as needed
        setKitchenStatus(res.data);
      } catch (err) {
        setError("Failed to fetch kitchen status");
      } finally {
        setLoading(false);
      }
    };

    fetchKitchenStatus();
  }, []);

  return { kitchenStatus, loading, error };
};

export default useKitchenStatus;
