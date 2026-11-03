
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const organizationRoutes = require("./routes/organizationRoutes");

const app = express();

// Allowed frontend origins
// Allowed frontend origins
const allowedOrigins = [
    "http://localhost:5173",
    "https://stockflow-inventory-management-jx2m.vercel.app"
];

// CORS configuration
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false
}));
app.use(express.json());

// Health check
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to StockFlow API",
        status: "Running"
    });
});

// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/organization", organizationRoutes);

module.exports = app;
