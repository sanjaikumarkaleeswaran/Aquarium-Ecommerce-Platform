import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json({ limit: "10mb" })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Parse URL-encoded bodies
app.use(cors()); // Enable CORS
app.use(morgan("dev")); // HTTP request logger

// Import routes
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import productRoutes from "./routes/products.js";
import retailerProductRoutes from "./routes/retailerProducts.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/orders.js";
import notificationRoutes from "./routes/notifications.js";
import userRoutes from "./routes/users.js";
import reviewRoutes from "./routes/reviews.js";
import aiRoutes from "./routes/ai.js";

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/retailer-products", retailerProductRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/ai", aiRoutes);

// Health check route
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Aquarium Commerce API is running",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development"
    });
});

// Root route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Aquarium Commerce API",
        version: "1.0.0",
        endpoints: {
            auth: "/api/auth",
            admin: "/api/admin",
            products: "/api/products",
            retailerProducts: "/api/retailer-products",
            cart: "/api/cart",
            orders: "/api/orders",
            notifications: "/api/notifications",
            users: "/api/users",
            health: "/api/health"
        }
    });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🐠 AQUARIUM COMMERCE API SERVER                        ║
║                                                           ║
║   🚀 Server running on port ${PORT}                         ║
║   🌍 Environment: ${process.env.NODE_ENV || "development"}                      ║
║   📡 API Base URL: http://localhost:${PORT}/api            ║
║                                                           ║
║   📚 Available Endpoints:                                 ║
║      - POST   /api/auth/register                         ║
║      - POST   /api/auth/login                            ║
║      - GET    /api/products                              ║
║      - GET    /api/retailer-products/browse              ║
║      - POST   /api/cart/items                            ║
║      - POST   /api/orders                                ║
║      - GET    /api/notifications                         ║
║                                                           ║
║   ✅ Ready to accept requests!                            ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
    });
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.error(`❌ Unhandled Rejection: ${err.message}`);
    // Close server & exit process
    process.exit(1);
});

export default app;

