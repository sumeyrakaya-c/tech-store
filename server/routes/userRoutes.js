const express = require("express");

const router = express.Router();

const {
    getAllUsers,
    getProfile,
    updateProfile
} = require("../controllers/userController");


// =========================================
// ADMIN - TÜM KULLANICILARI GETİR
// GET /api/users
// =========================================

router.get("/", getAllUsers);


// =========================================
// KULLANICI PROFİLİNİ GETİR
// GET /api/users/:id
// =========================================

router.get("/:id", getProfile);


// =========================================
// KULLANICI PROFİLİNİ GÜNCELLE
// PUT /api/users/:id
// =========================================

router.put("/:id", updateProfile);


module.exports = router;