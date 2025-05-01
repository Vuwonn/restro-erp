// src/hooks/useAddNewItem.js
import { useState } from "react";
import axios from "axios"; 
import { MENU_ITEM_API_END_POINT } from "@/utils/constant";

const useAddNewItem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const addItem = async (formData) => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("image", formData.image);

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await axios.post(`${MENU_ITEM_API_END_POINT}/add-menu-item`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (response.status === 201 || response.status === 200) {
        setSuccess(true);
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addItem, loading, error, success };
};

export default useAddNewItem;
