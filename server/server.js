require("dotenv").config();

const express = require("express");
const cors = require("cors");

require("./config/db");


// =========================================
// ROUTES
// =========================================

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
const productSpecsRoutes = require("./routes/productSpecs");
const productStorageRoutes = require("./routes/productStorage");
const returnRoutes = require("./routes/returnRoutes");
const aiRoutes = require("./routes/aiRoutes");


// =========================================
// TRANSLATION MIDDLEWARE
// =========================================

const translationMiddleware =
    require("./middleware/translationMiddleware");


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
// MERKEZİ ÇEVİRİ
// =========================================

app.use(translationMiddleware);


// =========================================
// API ROUTES
// =========================================

app.use(
    "/api/users",
    userRoutes
);

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/dashboard",
    dashboardRoutes
);

app.use(
    "/api/cart",
    cartRoutes
);

app.use(
    "/api/orders",
    orderRoutes
);

app.use(
    "/api/favorites",
    favoriteRoutes
);

app.use(
    "/api/categories",
    categoryRoutes
);

app.use(
    "/api/brands",
    brandRoutes
);

app.use(
    "/api/products",
    productRoutes
);

app.use(
    "/api/reviews",
    reviewRoutes
);

app.use(
    "/api/questions",
    questionRoutes
);

app.use(
    "/api/product-specs",
    productSpecsRoutes
);

app.use(
    "/api/returns",
    returnRoutes
);

app.use(
    "/api/product-storage-options",
    productStorageRoutes
);


// =========================================
// AI ASİSTAN
// =========================================

app.use(
    "/api/ai",
    aiRoutes
);


// =========================================
// TEST
// =========================================

app.get("/", (req, res) => {

    res.send(
        "🚀 TeknoHup API çalışıyor."
    );

});


// =========================================
// SERVER
// =========================================

const PORT =
    process.env.PORT || 5000;


app.listen(
    PORT,
    () => {

        console.log(
            `✅ Server ${PORT} portunda çalışıyor.`
        );

    }
);