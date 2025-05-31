import { useState, useEffect } from "react";
import axios from "axios";
import { TABLE_API_END_POINT } from "@/utils/constant";
import { toast } from "react-toastify";

export const useTables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTables = async () => {
    try {
      const res = await axios.get(`${TABLE_API_END_POINT}/gettables`, { withCredentials: true });
      setTables(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch tables error:", err);
      toast.error("Failed to load tables");
      setTables([]);
    }
  };

  const createTable = async (newTableNumber) => {
    if (!newTableNumber) return toast.warning("Please enter a table number");
    try {
      setLoading(true);
      await axios.post(`${TABLE_API_END_POINT}/createtable`, {withCredentials: true}, {
        tableNumber: Number(newTableNumber),
      });
      toast.success("Table created!");
      await fetchTables();
    } catch (err) {
      console.error("Create table error:", err);
      toast.error(err?.response?.data?.message || "Failed to create table");
    } finally {
      setLoading(false);
    }
  };

  const releaseTable = async (tableNumber) => {
    try {
      setLoading(true);
      await axios.put(`${TABLE_API_END_POINT}/release/${tableNumber}`,  { withCredentials: true });
      toast.success("Table released");
      await fetchTables();
    } catch (err) {
      console.error("Release table error:", err);
      toast.error(err?.response?.data?.message || "Failed to release table");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  return { tables, loading, createTable, releaseTable, fetchTables };
};
