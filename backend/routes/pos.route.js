import express from "express";
import { createBill, getAllBills, getDailySales, getMonthlySales, getSalesByTimeRange, getTopItems, getTotalByPaymentType, transferCreditTo } from "../controllers/pos.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";


const router = express.Router();


router.post("/create-bill", isAuthenticated, createBill);
router.get("/daily-sales", isAuthenticated, getDailySales);
router.get("/monthly-sales", isAuthenticated, getMonthlySales);
router.get("/top-items", isAuthenticated, getTopItems);
router.get("/total-by-payment-type", isAuthenticated, getTotalByPaymentType);
router.post("/transfer-credit", isAuthenticated, transferCreditTo);
router.get("/all-bills", isAuthenticated, getAllBills);
router.get("/sales", isAuthenticated, getSalesByTimeRange);



export default router;
