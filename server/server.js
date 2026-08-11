require("dotenv").config();

const express = require("express");
const cors = require("cors");

require("./config/db");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const brandRoutes = require("./routes/brandRoutes");
const productRoutes = require("./routes/productRoutes");
const reviewRoutes = require("./routes/reviews");
const questionRoutes = require("./routes/questions");


const app = express();


// =========================================
// MIDDLEWARE
// =========================================

app.use(
    cors({
        origin: "http://localhost:5173"
    })
);

app.use(express.json());


// =========================================
// STATIC FILES
// =========================================

app.use(
    "/uploads",
    express.static("uploads")
);


// =========================================
// API ROUTES
// =========================================

app.use("/api/users", userRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/favorites", favoriteRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/brands", brandRoutes);

app.use("/api/products", productRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/questions", questionRoutes);


// =========================================
// TEST
// =========================================

app.get("/", (req, res) => {

    res.send("🚀 TeknoHup API çalışıyor.");

});


// =========================================
// SERVER
// =========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `✅ Server ${PORT} portunda çalışıyor.`
    );

});