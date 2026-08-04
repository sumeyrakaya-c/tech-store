require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const cartRoutes = require("./routes/cartRoutes");
const express = require("express");
const cors = require("cors");
const orderRoutes = require("./routes/orderRoutes");     const favoriteRoutes = require("./routes/favoriteRoutes");
require("dotenv").config();

require("./config/db");

const categoryRoutes = require("./routes/categoryRoutes");
const brandRoutes = require("./routes/brandRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use("/api/users", userRoutes);
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/products", productRoutes);

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("🚀 TeknoHup API çalışıyor.");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server ${PORT} portunda çalışıyor.`);
});

