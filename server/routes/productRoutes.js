const express = require("express");
const router = express.Router();
const db = require("../config/db");
const upload = require("../config/multer");

// Ürün ekle
router.post(
    "/",
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "image2", maxCount: 1 },
        { name: "image3", maxCount: 1 },
    ]),
    (req, res) => {
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

const image =
    req.files?.image
        ? req.files.image[0].filename
        : null;

const image2 =
    req.files?.image2
        ? req.files.image2[0].filename
        : null;

    const image3 =
    req.files?.image3
        ? req.files.image3[0].filename
        : null;    

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
            image2,
            image3,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            image2,
            image3,
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

// Tüm ürünleri getir + Arama
router.get("/", (req, res) => {

    const { search, category } = req.query;

    console.log("Search =", search);

    let sql = `
        SELECT
            products.*,
            categories.name AS category_name,
            brands.name AS brand_name
        FROM products
        INNER JOIN categories
            ON products.category_id = categories.id
        INNER JOIN brands
            ON products.brand_id = brands.id
    `;

    let values = [];

    let conditions = [];

if (search && search.trim() !== "") {

    conditions.push(`
        (
            products.name LIKE ?
            OR brands.name LIKE ?
            OR categories.name LIKE ?
        )
    `);

    values.push(
        `%${search}%`,
        `%${search}%`,
        `%${search}%`
    );

}

if (category) {

    conditions.push(`products.category_id = ?`);

    values.push(Number(category));

}

if (conditions.length > 0) {

    sql += " WHERE " + conditions.join(" AND ");

}

    sql += " ORDER BY products.id DESC";

    console.log(sql);
    console.log(values);

    db.query(sql, values, (err, results) => {

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

// Ürün sil
router.delete("/:id", (req, res) => {

    const { id } = req.params;

    db.query("DELETE FROM cart WHERE product_id = ?", [id], () => {

        db.query("DELETE FROM favorites WHERE product_id = ?", [id], () => {

            db.query("DELETE FROM order_items WHERE product_id = ?", [id], () => {

                db.query(
                    "DELETE FROM products WHERE id = ?",
                    [id],
                    (err, result) => {

                        if (err) {
                            console.log(err);
                            return res.status(500).json(err);
                        }

                        res.json({
                            message: "Ürün silindi."
                        });

                    }
                );

            });

        });

    });

});

// Ürün güncelle
router.put(
    "/:id",
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "image2", maxCount: 1 },
        { name: "image3", maxCount: 1 }
    ]),
    (req, res) => {

    const { id } = req.params;

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

    let sql = `
        UPDATE products
        SET
            category_id = ?,
            brand_id = ?,
            name = ?,
            description = ?,
            price = ?,
            discount = ?,
            stock = ?,
            status = ?
    `;

    let values = [
        category_id,
        brand_id,
        name,
        description,
        price,
        discount,
        stock,
        status
    ];

    if (req.files?.image) {
    sql += ", image = ?";
    values.push(req.files.image[0].filename);
}

if (req.files?.image2) {
    sql += ", image2 = ?";
    values.push(req.files.image2[0].filename);
}

if (req.files?.image3) {
    sql += ", image3 = ?";
    values.push(req.files.image3[0].filename);
}

    sql += " WHERE id = ?";
    values.push(id);

    db.query(sql, values, (err) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            message: "Ürün başarıyla güncellendi."
        });

    });

});

module.exports = router;