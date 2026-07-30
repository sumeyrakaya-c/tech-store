const express = require("express");
const router = express.Router();

const {
    addToCart,
    getCart,
    updateCartQuantity,
    deleteCartItem
} = require("../controllers/cartController");

router.get("/", getCart);

router.post("/", addToCart);

router.put("/:id", updateCartQuantity);

router.delete("/:id", deleteCartItem);

module.exports = router;