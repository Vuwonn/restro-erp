import express from "express";
import { createBill } from "../controllers/pos.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";


const router = express.Router();


router.post("/create-bill", isAuthenticated, createBill);

export default router;
