import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPOSData } from "@/redux/posSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { POS_API_END_POINT } from "@/utils/constant";

const POSPanel = ({
  cart,
  onIncrease,
  onDecrease,
  onRemove,
  subtotal,
  discount,
  discountPercent,
  setDiscountPercent,
  total,
  cashPaid,
  setCashPaid,
  creditAmount,
  setCreditAmount,
  customerName,
  setCustomerName,
  customerNumber,
  setCustomerNumber,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

 const handleCheckout = async () => {
  const onlineAmount = total - cashPaid - creditAmount;

  const payload = {
    cart: cart.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
    total: total,
    cash: cashPaid,
    credit: creditAmount,
    paymentMethod:
      cashPaid && creditAmount
        ? "mixed"
        : cashPaid
        ? "cash"
        : creditAmount
        ? "credit"
        : "online",
    orderType: "dine-in",
    customerDetails: {
      name: customerName || "Guest",
      contact: customerNumber,
    },
  };


  try {
    const res = await axios.post(
      `${POS_API_END_POINT}/create-bill`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    dispatch(
      setPOSData({
        cart,
        subtotal,
        discountPercent,
        discount,
        cash: cashPaid,
        credit: creditAmount,
        online: onlineAmount,
        total,
        customerName,
        customerNumber,
      })
    );

    navigate("/admin/pos/checkout");
  } catch (err) {
    console.error("❌ Failed to create POS entry:", err?.response?.data || err.message);
    alert("Something went wrong while processing the order.");
  }
};


  return (
    <div className="w-[300px] mx-auto p-4 font-mono text-sm bg-white">
      {cart.length === 0 ? (
        <div className="text-center text-gray-400">Cart is empty</div>
      ) : (
        <div className="space-y-2">
          <ul className="space-y-1">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between items-center">
                <div className="flex-1">
                  <p>{item.name}</p>
                  <p className="text-xs">
                    {item.quantity} × Rs. {item.price.toFixed(2)} = Rs.{" "}
                    {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onDecrease(item.id)}
                    className="px-1 bg-gray-200 rounded"
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => onIncrease(item.id)}
                    className="px-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="ml-1 text-red-500"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="space-y-2">
            <div>
              <label className="text-xs">Customer Name:</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-1 border rounded"
                placeholder="Guest"
              />
            </div>
            <div>
              <label className="text-xs">Phone Number:</label>
              <input
                type="tel"
                value={customerNumber}
                onChange={(e) => setCustomerNumber(e.target.value)}
                className="w-full p-1 border rounded"
                placeholder="9800000000"
              />
            </div>
            <div>
              <label className="text-xs">Discount (%):</label>
              <input
                type="number"
                min="0"
                max="100"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full p-1 border rounded"
              />
            </div>
            <div>
              <label className="text-xs">Cash (Rs):</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={cashPaid}
                onChange={(e) => setCashPaid(Number(e.target.value))}
                className="w-full p-1 border rounded"
              />
            </div>
            <div>
              <label className="text-xs">Credit (Rs):</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={creditAmount}
                onChange={(e) => setCreditAmount(Number(e.target.value))}
                className="w-full p-1 border rounded"
              />
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>Rs. {total.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full text-center bg-green-600 text-white py-1 rounded hover:bg-green-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default POSPanel;
