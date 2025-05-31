import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOrderItems } from "@/redux/orderSlice";
import axios from "axios";
import { ORDER_API_END_POINT } from "@/utils/constant";
import { toast } from "react-toastify";
import { removeItem } from "@/redux/cartSlice";

const useSubmitOrder = () => {
  const dispatch = useDispatch();
  const {
    items,
    subtotal,
    orderType,
    tableNumber,
    deliveryAddress,
    specialInstructions,
    paymentMethod,
  } = useSelector((state) => state.order);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState(null);

  const validateOrder = () => {
    if (!items || items.length === 0) {
      console.warn("Order validation failed: Empty cart");
      return "Your cart is empty. Please add items before ordering.";
    }
    if (orderType === "dine-in" && !tableNumber) {
      console.warn("Order validation failed: Missing table number");
      return "Table number is required for dine-in orders";
    }
    if (orderType === "delivery" && !deliveryAddress) {
      console.warn("Order validation failed: Missing delivery address");
      return "Delivery address is required";
    }
    if (!paymentMethod) {
      console.warn("Order validation failed: Missing payment method");
      return "Please select a payment method";
    }
    return null;
  };

  const handleSubmitOrder = async (activeOrderId) => {
    setIsSubmitting(true);
    setOrderSuccess(false);
    setError(null);

    console.info("Starting order submission", {
      orderType,
      itemCount: items.length,
      subtotal,
      activeOrderId,
    });

    const validationError = validateOrder();
    if (validationError) {
      setError(validationError);
      toast.error(validationError, { position: "top-right" });
      setIsSubmitting(false);
      return;
    }

    const orderData = {
      customerName: "Guest",
      items: items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        specialInstructions: item.specialInstructions || null,
      })),
      orderType,
      tableNumber: orderType === "dine-in" ? tableNumber : undefined,
      deliveryAddress: orderType === "delivery" ? deliveryAddress : undefined,
      specialInstructions: specialInstructions || undefined,
      paymentMethod,
      subtotal,
      total: orderType === "delivery" ? subtotal + 2.5 : subtotal,
    };

    console.info("Submitting order with data", orderData);

    try {
      let response;
      if (activeOrderId) {
        // Add items to existing order
        response = await axios.post(
          `${ORDER_API_END_POINT}/add-item/${activeOrderId}`,
          { newItems: items, tableNumber },
          {
            timeout: 10000,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        // Create new order
        response = await axios.post(
          `${ORDER_API_END_POINT}/create-order`,
          orderData,
          {
            timeout: 10000,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      console.info("Order submission successful", {
        status: response.status,
        data: response.data,
      });

      if (response.status === 200 || response.status === 201) {
        setOrderSuccess(true);
        dispatch(setOrderItems({ items: [], subtotal: 0 }));
        dispatch(removeItem());
        toast.success(
          activeOrderId ? "Items added to order!" : "Order placed successfully!",
          { position: "top-right" }
        );
        console.info("Order and cart cleared from Redux store");
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (err) {
      let errorMessage = "Failed to submit order. Please try again.";

      if (err.response) {
        errorMessage =
          err.response.data?.message || `Server error: ${err.response.status}`;
        console.error("Order submission failed - Server response", {
          status: err.response.status,
          responseData: err.response.data,
          orderData,
        });
      } else if (err.request) {
        errorMessage = "No response from server. Please check your connection.";
        console.error("Order submission failed - No response", {
          orderData,
          requestConfig: err.config,
        });
      } else {
        console.error("Order submission failed - Setup error", {
          orderData,
          errorConfig: err.config,
        });
      }

      setError(errorMessage);
      toast.error(errorMessage, { position: "top-right" });
    } finally {
      setIsSubmitting(false);
      console.info("Order submission process completed");
    }
  };

  return { isSubmitting, orderSuccess, error, handleSubmitOrder };
};

export default useSubmitOrder;