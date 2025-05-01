import { useState, useEffect } from "react";
import axios from "axios";

const useStaffManagement = () => {
  const [staffStatus, setStaffStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaffStatus = async () => {
      try {
        const res = await axios.get("/api/staff/status"); // Modify the endpoint as needed
        setStaffStatus(res.data);
      } catch (err) {
        setError("Failed to fetch staff status");
      } finally {
        setLoading(false);
      }
    };

    fetchStaffStatus();
  }, []);

  return { staffStatus, loading, error };
};

export default useStaffManagement;
