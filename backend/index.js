import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./utils/db.js"; 
import userRoute from "./routes/user.route.js";
import menuItemRoute from "./routes/menuItem.route.js";
import orderRoute from "./routes/order.route.js";
import tableRoute from "./routes/table.route.js";

dotenv.config();

const app = express();
const _dirname = path.resolve(); 

// CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:8000",
  "http://localhost:5173",
];

const corsOptions = {
  origin: (origin, callback) => {
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
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/menuitem", menuItemRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/table", tableRoute);

// Serve Static Files from admin/dist
app.use(express.static(path.join(_dirname, "admin", "dist")));

// Catch-all Route for SPA (only for non-static requests)
// app.get("*", (req, res) => {
//   res.sendFile(path.join(_dirname, "admin", "dist", "index.html"));
// });

// Server Initialization
const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
});
