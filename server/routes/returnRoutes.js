const express = require("express");

const router = express.Router();

const {
    createReturn,
    getReturns,
    getUserReturns,
    updateReturnStatus
} = require("../controllers/returnController");


// =========================================
// İADE TALEBİ OLUŞTUR
// =========================================

router.post(
    "/",
    createReturn
);


// =========================================
// KULLANICININ İADELERİ
// =========================================

router.get(
    "/user/:userId",
    getUserReturns
);


// =========================================
// TÜM İADELER
// ADMIN
// =========================================

router.get(
    "/",
    getReturns
);


// =========================================
// İADE DURUMUNU GÜNCELLE
// ADMIN
// =========================================

router.put(
    "/:id",
    updateReturnStatus
);


module.exports = router;