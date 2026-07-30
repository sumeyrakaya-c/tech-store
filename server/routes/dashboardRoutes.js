const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", (req, res) => {

    const statsQuery = `
        SELECT
            (SELECT COUNT(*) FROM products) AS totalProducts,
            (SELECT COUNT(*) FROM categories) AS totalCategories,
            (SELECT COUNT(*) FROM brands) AS totalBrands
    `;

    const latestProductsQuery = `
        SELECT
            id,
            name,
            price,
            image
        FROM products
        ORDER BY id DESC
        LIMIT 5
    `;

    db.query(statsQuery, (err, stats) => {

        if (err) {
            return res.status(500).json(err);
        }

        db.query(latestProductsQuery, (err2, products) => {

            if (err2) {
                return res.status(500).json(err2);
            }

            res.json({
                stats: stats[0],
                latestProducts: products
            });

        });

    });

});

module.exports = router;