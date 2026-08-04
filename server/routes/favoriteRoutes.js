const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Favoriye ekle
router.post("/", (req, res) => {

    const { user_id, product_id } = req.body;

    const sql = `
        INSERT INTO favorites
        (user_id, product_id)
        VALUES (?, ?)
    `;

    db.query(sql, [user_id, product_id], (err) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Favoriye eklenemedi."
            });
        }

        res.json({
            message: "Favorilere eklendi."
        });

    });

});

// Favoriden sil
router.delete("/", (req, res) => {

    const { user_id, product_id } = req.body;

    const sql = `
        DELETE FROM favorites
        WHERE user_id = ?
        AND product_id = ?
    `;

    db.query(sql, [user_id, product_id], (err) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Favoriden silinemedi."
            });
        }

        res.json({
            message: "Favoriden kaldırıldı."
        });

    });

});

router.get("/count/:userId", (req, res) => {

    const { userId } = req.params;

    const sql = `
        SELECT COUNT(*) AS total
        FROM favorites
        WHERE user_id = ?
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Hata oluştu."
            });

        }

        res.json(results[0]);

    });

});

// Kullanıcının favorileri
router.get("/:userId", (req, res) => {

    const { userId } = req.params;

    const sql = `
        SELECT
            products.*
        FROM favorites
        INNER JOIN products
            ON favorites.product_id = products.id
        WHERE favorites.user_id = ?
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Favoriler getirilemedi."
            });

        }

        res.json(results);

    });

});

// Kullanıcının favoride olup olmadığını kontrol et
router.get("/:userId/:productId", (req, res) => {

    const { userId, productId } = req.params;

    const sql = `
        SELECT *
        FROM favorites
        WHERE user_id = ?
        AND product_id = ?
    `;

    db.query(sql, [userId, productId], (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Hata oluştu."
            });

        }

        res.json({
            isFavorite: results.length > 0
        });

    });

});

module.exports = router;