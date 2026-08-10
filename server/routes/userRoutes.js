const express = require("express");

const router = express.Router();

const {
    getProfile,
    updateProfile
} = require("../controllers/userController");


// PROFİL BİLGİLERİNİ GETİR
router.get("/:id", getProfile);


// PROFİL BİLGİLERİNİ GÜNCELLE
router.put("/:id", updateProfile);


module.exports = router;