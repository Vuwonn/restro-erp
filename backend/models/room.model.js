import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
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
  qrUrl: {
    type: String, 
  },
  qrImage: {
    url: String,
    public_id: String,
  },
});

const Table = mongoose.model("Room", roomSchema);
export default Table;
