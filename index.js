const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

// Routes
const contactUsRoutes = require("./Routes/contactUsRoutes");
const authRoutes = require("./Routes/authRoutes");
const productRoutes = require("./Routes/productRoutes");
const adminProductRoutes = require("./Routes/adminProductRoutes");
const userRoutes = require("./Routes/userRoutes");
const cartRoutes = require("./Routes/cartRoutes");
const paymentRoutes = require("./Routes/paymentRoutes");
const orderRoutes = require("./Routes/orderRoutes");
const couponRoutes = require("./Routes/couponRoutes");
const advertisementRoutes = require("./Routes/advertisementRoutes");
const Warehouse = require("./Routes/warehouse");

const app = express();

/* =========================
   CORS CONFIG
========================= */
const allowedOrigins = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(",").map((origin) => origin.trim())
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS not allowed"), false);
    },
    credentials: true,
  })
);

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* =========================
   ROUTES
========================= */
app.use("/api/contact-us", contactUsRoutes);
app.use("/api/products", productRoutes);
app.use("/api/products/admin", adminProductRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/advertisements", advertisementRoutes);
app.use("/api/warehouse", Warehouse);

/* =========================
   HEALTH CHECK (IMPORTANT)
========================= */
app.get("/", (req, res) => {
  res.status(200).send("🚀 Blossom Honey API is running");
});

/* =========================
   START SERVER FIRST (RENDER FIX)
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/* =========================
   CONNECT DATABASE AFTER SERVER STARTS
========================= */
connectDB()
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/* =========================
   CRON JOB (DISABLED FOR DEPLOY)
   Enable later after successful deploy
========================= */
// const { startDeliveryTrackingJob } = require("./utils/shiprocketTracker");
// startDeliveryTrackingJob();
