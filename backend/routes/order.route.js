import express from "express";
import {
  addItemToOrder,
  createOrder,
  getAllOrders,
  getFilteredOrders,
  updateOrderStatus,
  getActiveOrder,
} from "../controllers/order.controller.js";

const router = express.Router();

// Create a new order
router.post("/create-order", createOrder);

// Add items to an existing order
router.post("/add-item/:orderId", addItemToOrder);

// Get all orders
router.get("/orders", getAllOrders);

// Get filtered orders (daily, weekly, monthly, yearly)
router.get("/orders/filter", getFilteredOrders);


router.put("/orders/:id", updateOrderStatus);


router.get("/orders/active", getActiveOrder);

export default router;