const express = require("express");
const router = express.Router();

const {
    createOrder,
    getOrders,
    updateOrderStatus,
    getOrderDetail,
    getMyOrders
} = require("../controllers/orderController");

router.get("/", getOrders);

router.get("/user/:userId", getMyOrders);

router.get("/:id", getOrderDetail);

router.post("/", createOrder);

router.put("/:id", updateOrderStatus);

module.exports = router;