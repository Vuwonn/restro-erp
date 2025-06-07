import express from "express";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import menuItemRoute from "./routes/menuItem.route.js";
import orderRoute from "./routes/order.route.js";
import tableRoute from "./routes/table.route.js";
import billRoute from "./routes/bill.route.js";
import roomRoute from "./routes/room.route.js"; 

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:8000",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  },
});

const _dirname = path.resolve();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:8000",
      "http://localhost:5173",
      "https://restro-erp.onrender.com"
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(_dirname, "/client/dist")));

app.locals.io = io;

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/menuitem", menuItemRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/table", tableRoute);
app.use("/api/v1/bill", billRoute);
app.use("/api/v1/room", roomRoute);

// Temporary test route (instead of catch-all)
app.get("/", (req, res) => {
  res.sendFile(path.join(_dirname, "client", "dist", "index.html"));
});

app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(_dirname, "client", "dist", "index.html"));
});

// Socket.IO
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 8000;
server.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
});