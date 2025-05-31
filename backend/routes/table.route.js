import express from "express";
import {
  createTable,
  getAllTableQRCodes,
  getAllTables,
  getTableByNumber,
  getTableBookingStatusCounts,
  releaseTable,
} from "../controllers/table.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/createtable", isAuthenticated, createTable);
router.get("/gettables", isAuthenticated, getAllTables);
router.get("/totaldocuments", getTableBookingStatusCounts); // Specific route before dynamic
router.get("/:tableNumber", getTableByNumber); // Dynamic route after
router.put("/release/:tableNumber", isAuthenticated, releaseTable);
router.get("/get-qrcodes", getAllTableQRCodes);

export default router;