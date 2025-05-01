import { useState } from "react";
import axios from "axios";

const useAddNewItem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const addItem = async (newItem) => {
    try {
      setLoading(true);

      // Creating FormData to handle file uploads
      const formData = new FormData();
      formData.append("name", newItem.name.trim());
      formData.append("description", newItem.description.trim());
      formData.append("price", newItem.price);
      formData.append("category", newItem.category.trim());
      
      // Add image if present
      if (newItem.image) {
        formData.append("image", newItem.image);
      }

      // Add ingredients if present
      newItem.ingredients.forEach((ingredient, index) => {
        formData.append(`ingredients[${index}]`, ingredient);
      });

      // Make the API request to add the item
      const res = await axios.post("/api/menu/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      });

      // Success handling
      setSuccess("Item added successfully");

      // Optional: You can reset the form state here if needed
    } catch (err) {
      // Error handling
      setError("Failed to add new item");
      console.error("Error adding item:", err);
    } finally {
      setLoading(false);
    }
  };

  return { addItem, loading, error, success };
};

export default useAddNewItem;
