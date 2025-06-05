import { useState } from "react";
import axios from "axios";
import { BILL_API_END_POINT } from "@/utils/constant";
import { toast } from "react-toastify";

export const useBill = () => {
  const [billData, setBillData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchBill = async (tableNumber) => {
    try {
      const res = await axios.get(
        `${BILL_API_END_POINT}/table/${tableNumber}`,
        {
          withCredentials: true,
        }
      );
      setBillData(res.data);
      setShowModal(true);
    } catch (err) {
      console.error("Fetch bill error:", err);
      toast.error("Failed to load bill");
    }
  };

  return { billData, showModal, fetchBill, setShowModal };
};
