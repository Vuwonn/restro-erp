import express from "express";
import {
  createOrder,
  getAllOrders,
  getFilteredOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js"; 
const router = express.Router();
router.post("/create-order", createOrder);
router.get("/orders", getAllOrders);
router.get("/orders/filter", getFilteredOrders);
router.put('/orders/:id', updateOrderStatus);
export default router;
