const express = require("express");
const router = express.Router();
const db = require("../config/db");
const upload = require("../config/multer");

// Ürün ekle
router.post("/", upload.single("image"), (req, res) => {

   const {
    category_id,
    brand_id,
    name,
    description,
    price,
    discount,
    stock,
    status
} = req.body;

const image = req.file ? req.file.filename : null;

    const sql = `
        INSERT INTO products
        (
            category_id,
            brand_id,
            name,
            description,
            price,
            discount,
            stock,
            image,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            category_id,
            brand_id,
            name,
            description,
            price,
            discount,
            stock,
            image,
            status
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.status(201).json({
                message: "Ürün başarıyla eklendi.",
                id: result.insertId
            });

        }
    );

});

// Tüm ürünleri getir
router.get("/", (req, res) => {

    const sql = `
        SELECT
            products.*,
            categories.name AS category_name,
            brands.name AS brand_name
        FROM products
        INNER JOIN categories
            ON products.category_id = categories.id
        INNER JOIN brands
            ON products.brand_id = brands.id
        ORDER BY products.id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(results);

    });
});

// Tek ürün getir
router.get("/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT
            products.*,
            categories.name AS category_name,
            brands.name AS brand_name
        FROM products
        INNER JOIN categories
            ON products.category_id = categories.id
        INNER JOIN brands
            ON products.brand_id = brands.id
        WHERE products.id = ?
    `;

    db.query(sql, [id], (err, results) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Ürün bulunamadı."
            });
        }

        res.json(results[0]);

    });

});

module.exports = router;