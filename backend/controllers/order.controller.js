import Order from '../models/order.model.js';
import Table from '../models/table.model.js';
export const createOrder = async (req, res) => {
  try {
    const {
      customerName = "Guest",
      items,
      orderType,
      tableNumber,
      deliveryAddress,
      specialInstructions,
      paymentMethod,
      subtotal,
    } = req.body;

    // Basic validations
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    for (let item of items) {
      if (!item.name || typeof item.name !== 'string') {
        return res.status(400).json({ message: `Item name is required and should be a string` });
      }
      if (typeof item.quantity !== 'number' || item.quantity <= 0) {
        return res.status(400).json({ message: `Item quantity must be a positive number` });
      }
      if (typeof item.price !== 'number' || item.price <= 0) {
        return res.status(400).json({ message: `Item price must be a positive number` });
      }
    }

    if (orderType === 'dine-in') {
      if (!tableNumber) {
        return res.status(400).json({ message: 'Table number is required for dine-in' });
      }

      // Check if table exists and is not already booked
      const table = await Table.findOne({ tableNumber });

      if (!table) {
        return res.status(404).json({ message: `Table number ${tableNumber} not found` });
      }

      if (table.isBooked) {
        return res.status(400).json({ message: `Table number ${tableNumber} is already booked` });
      }
    }

    if (orderType === 'delivery' && !deliveryAddress) {
      return res.status(400).json({ message: 'Delivery address is required' });
    }

    if (!paymentMethod || !['counter', 'card'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    const calculatedSubtotal = subtotal || items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create new order
    const order = new Order({
      customerName,
      items,
      orderType,
      ...(orderType === 'dine-in' && { tableNumber }),
      ...(orderType === 'delivery' && { deliveryAddress }),
      ...(specialInstructions && { specialInstructions }),
      paymentMethod,
      subtotal: calculatedSubtotal,
    });

    const createdOrder = await order.save();

    // If dine-in, update the table
    if (orderType === 'dine-in') {
      await Table.findOneAndUpdate(
        { tableNumber },
        {
          isBooked: true,
          currentOrderId: createdOrder._id,
        },
        { new: true }
      );
    }

    return res.status(201).json(createdOrder);

  } catch (error) {
    console.error("Error while creating order:", error);

    if (error.name === 'ValidationError') {
      const errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({ message: 'Server Error' });
  }
};
  
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    const totalOrders = orders.length;

    res.status(200).json({
      totalOrders,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addItemToOrder = async (req, res) => {
  const { orderId } = req.params;
  const { newItems } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order || order.status === "completed") {
      return res.status(400).json({ message: "Order not found or already completed." });
    }

    order.items.push(...newItems);
    order.total += newItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    await order.save();

    res.status(200).json(order);
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ message: "Failed to update order" });
  }
};

export const getFilteredOrders = async (req, res) => {
  try {
    const { filter } = req.query; 

    let startDate;
    const endDate = new Date(); 

    switch (filter) {
      case 'daily':
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0); 
        break;
      case 'weekly':
        startDate = new Date();
        const dayOfWeek = startDate.getDay(); 
        startDate.setDate(startDate.getDate() - dayOfWeek); 
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'monthly':
        startDate = new Date();
        startDate.setDate(1); 
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'yearly':
        startDate = new Date(startDate.getFullYear(), 0, 1); 
        startDate.setHours(0, 0, 0, 0);
        break;
      default:
        
        const allOrders = await Order.find().sort({ createdAt: -1 });
        return res.status(200).json({
          totalOrders: allOrders.length,
          orders: allOrders,
        });
    }

    // Find orders between startDate and endDate
    const filteredOrders = await Order.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      filter: filter || 'all',
      totalOrders: filteredOrders.length,
      orders: filteredOrders,
    });
  } catch (error) {
    console.error('Error fetching filtered orders:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params; 
    const { status } = req.body; 

    // Validate status
    const allowedStatuses = ["pending", "in-progress", "completed", "cancelled", "delivered"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

  
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true } 
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({
      message: "Order status updated successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
