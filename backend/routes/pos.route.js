import express from "express";
import { createBill, getDailySales, getMonthlySales, getTopItems } from "../controllers/pos.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";


const router = express.Router();


router.post("/create-bill", isAuthenticated, createBill);
router.get("/daily-sales", isAuthenticated, getDailySales);
router.get("/monthly-sales", isAuthenticated, getMonthlySales);
router.get("/top-items", isAuthenticated, getTopItems);

export default router;
