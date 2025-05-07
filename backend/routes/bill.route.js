import express from "express";
import  {getBillDetails}  from "../controllers/bill.controller.js";

const router = express.Router();


router.get("/table/:tableNumber", getBillDetails);

export default router;
