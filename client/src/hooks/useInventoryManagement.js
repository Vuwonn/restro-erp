import { useState, useEffect } from "react";
import axios from "axios";

const useInventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get("/api/inventory"); // Modify the endpoint as needed
        setInventory(res.data);
        setLowStockItems(res.data.filter(item => item.stock < 5)); // Example: low stock threshold
      } catch (err) {
        setError("Failed to fetch inventory");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  return { inventory, lowStockItems, loading, error };
};

export default useInventoryManagement;
