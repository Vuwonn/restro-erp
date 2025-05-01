import Order from "../models/order.model.js";
import Table from "../models/table.model.js";

export const createTable = async (req, res) => {
  try {
    const { tableNumber } = req.body;

    const existing = await Table.findOne({ tableNumber });
    if (existing) return res.status(400).json({ message: "Table already exists" });

    const table = await Table.create({ tableNumber });
    res.status(201).json(table);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
