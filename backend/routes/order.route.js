import express from "express";
import {
  addItemToOrder,
  createOrder,
  getAllOrders,
  getFilteredOrders,
  updateOrderStatus,
  getActiveOrder,
  completeOrder,
  sendToKotController,
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

// Complete an order
router.put("/orders/complete", completeOrder);

router.put('/orders/:orderId/send-to-kot', sendToKotController);




export default router;