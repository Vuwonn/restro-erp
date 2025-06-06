import express from "express";
import {
  createRoom,
  getAllRooms,
  getRoomByNumber,
  getRoomStatusCounts,
  checkInRoom,
  checkOutRoom,
  deleteRoom,
} from "../controllers/room.controller.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";
import { multipleUpload } from "../middlewares/multer.js"; 

const router = express.Router();

// Create room with multiple image uploads
router.post("/create", isAuthenticated, multipleUpload, createRoom);

// Get all rooms
router.get("/getrooms", isAuthenticated, getAllRooms);

// Get total/available/booked room counts
router.get("/status-counts", getRoomStatusCounts);

// Get room details by room number
router.get("/:roomNumber", getRoomByNumber);

// Check in to a room
router.put("/checkin/:roomNumber", isAuthenticated, checkInRoom);

// Check out of a room
router.put("/checkout/:roomNumber", isAuthenticated, checkOutRoom);

// Delete a room
router.delete("/delete/:roomId", isAuthenticated, deleteRoom);

export default router;
