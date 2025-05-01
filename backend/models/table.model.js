import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: String,
    required: true,
    unique: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
  currentOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    default: null,
  },
});

const Table = mongoose.model("Table", tableSchema);
export default Table;
