const express = require("express");
const router = express.Router();

const {
    createOrder,
    getOrders,
    updateOrderStatus,
    getOrderDetail
} = require("../controllers/orderController");

router.get("/", getOrders);

router.get("/:id", getOrderDetail);

router.post("/", createOrder);

router.put("/:id", updateOrderStatus);

module.exports = router;