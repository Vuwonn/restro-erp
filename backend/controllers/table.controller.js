import Order from "../models/order.model.js";
import Table from "../models/table.model.js";
import QRCode from "qrcode";
import cloudinary from "../utils/cloudinary.js"; 
import fs from "fs";
import path from "path";

export const createTable = async (req, res) => {
  try {
    const { tableNumber } = req.body;
    

    // Validate input
    if (!tableNumber) {
      return res.status(400).json({ message: "Valid table number is required." });
    }

    // Check if table already exists
    const existing = await Table.findOne({ tableNumber });
    if (existing) {
      return res.status(400).json({ message: "Table already exists." });
    }

    // Create table entry
    const table = new Table({ tableNumber });

    // Generate QR code URL
    const qrUrl = `http://localhost:5173/order?table=${tableNumber}`;
    
    // Use OS-independent temp file path
    const tempDir = path.resolve("./tmp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    const filePath = path.join(tempDir, `table-${tableNumber}.png`);

    // Generate QR code and save locally
    await QRCode.toFile(filePath, qrUrl);

    // Convert image to base64
    const fileBuffer = fs.readFileSync(filePath);
    const fileUri = `data:image/png;base64,${fileBuffer.toString("base64")}`;

    // Upload to Cloudinary
    const cloudResponse = await cloudinary.uploader.upload(fileUri, {
      folder: "tableQRCodes",
      public_id: `table-${tableNumber}`,
    });

    // Attach QR info to the table object
    table.qrUrl = qrUrl;
    table.qrImage = {
      url: cloudResponse.secure_url,
      public_id: cloudResponse.public_id,
    };

    // Save the updated table document
    await table.save();

    // Delete the local temp QR code image
    fs.unlinkSync(filePath);

    res.status(201).json({
      message: "Table created with QR code.",
      table,
    });
  } catch (err) {
    console.error("Error creating table:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

export const getAllTables = async (req, res) => {
  try {
    const tables = await Table.find().populate("currentOrderId");
    res.json(tables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getTableByNumber = async (req, res) => {
  try {
    const { tableNumber } = req.params;
    const table = await Table.findOne({ tableNumber }).populate("currentOrderId");
    if (!table) return res.status(404).json({ message: "Table not found" });
    res.json(table);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const releaseTable = async (req, res) => {
  try {
    const { tableNumber } = req.params;
    const table = await Table.findOne({ tableNumber });

    if (!table || !table.isBooked) {
      return res.status(400).json({ message: "Table is not booked" });
    }

    const order = await Order.findById(table.currentOrderId);
    if (!order || order.status !== "completed") {
      return res.status(400).json({ message: "Order not completed yet" });
    }

    // Optionally you can log or return bill data here

    table.isBooked = false;
    table.currentOrderId = null;
    await table.save();

    res.json({ message: "Table released successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getAllTableQRCodes = async (req, res) => {
  try {
    const qrCodes = await TableQRCode.find().populate("tableId");

    res.status(200).json({
      message: "QR Codes fetched successfully",
      qrCodes,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getTableBookingStatusCounts = async (req, res) => {
  try {
    const total = await Table.countDocuments();
    const booked = await Table.countDocuments({ isBooked: true });
    const unbooked = await Table.countDocuments({ isBooked: false });

    res.status(200).json({
      message: "Table booking status counts fetched successfully",
      totalTables: total,
      bookedTables: booked,
      unbookedTables: unbooked,
    });
  } catch (error) {
    console.error("Error fetching table booking counts:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


