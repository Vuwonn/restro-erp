import posModel from "../models/pos.model.js";

// Create a new bill
export const createBill = async (req, res) => {
  try {
    const {
      cart,
      total,
      cash,
      credit,
      paymentMethod = "cash",
      orderType = "dine-in",
      customerName,
      customerNumber,
    } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: "Cart items are required" });
    }

    // Validate cart items structure (optional, can be more thorough)
    const items = cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    // Create new POS bill record
    const newBill = await posModel.create({
      items,
      totalAmount: total,
      cash,
      credit,
      paymentMethod,
      orderType,
      customerDetails: {
        name: customerName || "Guest",
        contact: customerNumber || "",
      },
    });

    res.status(201).json({ success: true, bill: newBill });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create bill", details: err.message });
  }
};

// Get all bills
// export const getAllBills = async (req, res) => {
//   try {
//     const bills = await Bill.find()
//       .populate("items.menuItem")
//       .populate("room")
//       .populate("servedBy")
//       .sort({ createdAt: -1 });
//     res.json(bills);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch bills" });
//   }
// };

// Get daily sales
export const getDailySales = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const sales = await posModel.aggregate([
      {
        $match: {
          createdAt: { $gte: today, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
          orders: { $sum: 1 }
        }
      }
    ]);

    res.json(sales[0] || { totalSales: 0, orders: 0 });
  } catch (err) {
    res.status(500).json({ error: "Failed to get daily sales" });
  }
};

// Get monthly sales
export const getMonthlySales = async (req, res) => {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const sales = await posModel.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lt: end }
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
          orders: { $sum: 1 }
        }
      }
    ]);

    res.json(sales[0] || { totalSales: 0, orders: 0 });
  } catch (err) {
    res.status(500).json({ error: "Failed to get monthly sales" });
  }
};

// Get most sold items (Top 5)
export const getTopItems = async (req, res) => {
  try {
    const topItems = await posModel.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          totalQuantity: { $sum: "$items.quantity" },
          totalSales: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 }
    ]);

    res.json(topItems);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch top items" });
  }
};