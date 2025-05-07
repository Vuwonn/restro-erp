import express from "express";
import { createTable,
    getAllTableQRCodes,
    getAllTables,
    getTableByNumber,
    releaseTable,
 } from "../controllers/table.controller.js";

 

const router = express.Router();

router.post("/createtable", createTable); 
router.get("/gettables", getAllTables); 
router.get("/:tableNumber", getTableByNumber);
router.put("/release/:tableNumber", releaseTable);
router.get("/get-qrcodes", getAllTableQRCodes);


export default router;
