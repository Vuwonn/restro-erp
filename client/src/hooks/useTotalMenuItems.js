import { useEffect, useState } from "react";
import axios from "axios";
import { MENU_ITEM_API_END_POINT } from "@/utils/constant";

const useTotalMenuItems = () => {
  const [totalMenuItems, setTotalMenuItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`${MENU_ITEM_API_END_POINT}/menu-item-count`);
        setTotalMenuItems(response.data.totalCount || 0);
      } catch (err) {
        setError("Failed to fetch menu item stats");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  return { totalMenuItems, loading, error };
};

export default useTotalMenuItems;
