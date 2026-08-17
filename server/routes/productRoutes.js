const express = require("express");
const router = express.Router();

const db = require("../config/db");
const upload = require("../config/multer");


// =========================================
// ÜRÜN EKLE
// =========================================

router.post(
    "/",

    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "image2", maxCount: 1 },
        { name: "image3", maxCount: 1 }
    ]),

    (req, res) => {

        const {
            category_id,
            brand_id,
            name,
            color_name,
            color_code,
            variant_group_id,
            description,
            description_en,
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
                color_name,
                color_code,
                variant_group_id,
                description,
                description_en,
                price,
                discount,
                stock,
                image,
                image2,
                image3,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;


        db.query(
            sql,

            [
                category_id || null,
                brand_id || null,
                name,
                color_name || null,
                color_code || null,
                variant_group_id || null,
                description || "",
                description_en || "",
                price || 0,
                discount || 0,
                stock || 0,
                image,
                image2,
                image3,
                status || "active"
            ],

            (err, result) => {

                if (err) {

                    console.log(
                        "ÜRÜN EKLEME SQL HATASI:",
                        err
                    );

                    return res.status(500).json({
                        message: "Ürün eklenemedi.",
                        error: err.message
                    });

                }


                res.status(201).json({

                    message: "Ürün başarıyla eklendi.",

                    id: result.insertId

                });

            }
        );

    }
);

// =========================================
// TÜM ÜRÜNLERİ GETİR
// =========================================

router.get("/", (req, res) => {

    const {
        search,
        category
    } = req.query;


    let sql = `
        SELECT
            products.*,

            categories.name AS category_name,

            brands.name AS brand_name

        FROM products

        LEFT JOIN categories
            ON products.category_id = categories.id

        LEFT JOIN brands
            ON products.brand_id = brands.id
    `;


    const values = [];
    const conditions = [];


    // =========================================
    // ARAMA
    // =========================================

    if (
        search &&
        search.trim() !== ""
    ) {

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


    // =========================================
    // KATEGORİ
    // =========================================

    if (
        category &&
        category !== ""
    ) {

        conditions.push(
            "products.category_id = ?"
        );

        values.push(
            Number(category)
        );

    }


    // =========================================
    // WHERE
    // =========================================

    if (
        conditions.length > 0
    ) {

        sql +=
            " WHERE " +
            conditions.join(" AND ");

    }


    // =========================================
    // SIRALAMA
    // =========================================

    sql += `
        ORDER BY products.id DESC
    `;


    db.query(
        sql,
        values,

        (err, results) => {

            if (err) {

                console.log(
                    "ÜRÜNLER GETİRME SQL HATASI:",
                    err
                );

                return res.status(500).json({
                    message: "Ürünler getirilemedi.",
                    error: err.message
                });

            }


            res.json(results);

        }
    );

});

// =========================================
// TEK ÜRÜN GETİR
// =========================================

router.get("/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT
            products.*,

            categories.name AS category_name,

            brands.name AS brand_name

        FROM products

        LEFT JOIN categories
            ON products.category_id = categories.id

        LEFT JOIN brands
            ON products.brand_id = brands.id

        WHERE products.id = ?
    `;

    db.query(
        sql,
        [id],

        (err, results) => {

            if (err) {

                console.log(
                    "TEK ÜRÜN SQL HATASI:",
                    err
                );

                return res.status(500).json({
                    message: "Ürün getirilemedi.",
                    error: err.message
                });

            }

            if (results.length === 0) {

                return res.status(404).json({
                    message: "Ürün bulunamadı."
                });

            }

            res.json(results[0]);

        }
    );

});


// =========================================
// RENK VARYANTLARINI GETİR
// =========================================

router.get(
    "/variants/:groupId",
    (req, res) => {

        const { groupId } = req.params;


        const sql = `
            SELECT
                products.*,

                categories.name AS category_name,

                brands.name AS brand_name

            FROM products

            LEFT JOIN categories
                ON products.category_id = categories.id

            LEFT JOIN brands
                ON products.brand_id = brands.id

            WHERE products.variant_group_id = ?

            ORDER BY products.id ASC
        `;


        db.query(
            sql,

            [groupId],

            (err, results) => {

                if (err) {

                    console.log(
                        "RENK VARYANTLARI SQL HATASI:",
                        err
                    );

                    return res.status(500).json({
                        message: "Renk varyantları alınamadı.",
                        error: err.message
                    });

                }


                res.json(results);

            }
        );

    }
);



// =========================================
// ÜRÜN SİL
// =========================================

router.delete("/:id", (req, res) => {

    const { id } = req.params;


    // TEKNİK ÖZELLİKLER

    db.query(
        "DELETE FROM product_specs WHERE product_id = ?",

        [id],

        () => {

            // SEPET

            db.query(
                "DELETE FROM cart WHERE product_id = ?",

                [id],

                () => {

                    // FAVORİLER

                    db.query(
                        "DELETE FROM favorites WHERE product_id = ?",

                        [id],

                        () => {

                            // SİPARİŞ KALEMLERİ

                            db.query(
                                "DELETE FROM order_items WHERE product_id = ?",

                                [id],

                                () => {

                                    // ÜRÜN

                                    db.query(
                                        "DELETE FROM products WHERE id = ?",

                                        [id],

                                        (err, result) => {

                                            if (err) {

                                                console.log(
                                                    "ÜRÜN SİLME HATASI:",
                                                    err
                                                );

                                                return res.status(500).json({
                                                    message: "Ürün silinemedi.",
                                                    error: err.message
                                                });

                                            }


                                            if (
                                                result.affectedRows === 0
                                            ) {

                                                return res.status(404).json({
                                                    message: "Ürün bulunamadı."
                                                });

                                            }


                                            res.json({
                                                message: "Ürün silindi."
                                            });

                                        }
                                    );

                                }
                            );

                        }
                    );

                }
            );

        }
    );

});


// =========================================
// ÜRÜN GÜNCELLE
// =========================================

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
            color_name,
            color_code,
            variant_group_id,
            description,
            description_en,
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
                color_name = ?,
                color_code = ?,
                variant_group_id = ?,
                description = ?,
                description_en = ?,
                price = ?,
                discount = ?,
                stock = ?,
                status = ?
        `;


        const values = [

            category_id || null,

            brand_id || null,

            name,

            color_name || null,

            color_code || null,

            variant_group_id || null,

            description || "",

            description_en || "",

            price || 0,

            discount || 0,

            stock || 0,

            status || "active"

        ];


        // =========================================
        // 1. GÖRSEL
        // =========================================

        if (
            req.files?.image
        ) {

            sql += ", image = ?";

            values.push(
                req.files.image[0].filename
            );

        }


        // =========================================
        // 2. GÖRSEL
        // =========================================

        if (
            req.files?.image2
        ) {

            sql += ", image2 = ?";

            values.push(
                req.files.image2[0].filename
            );

        }


        // =========================================
        // 3. GÖRSEL
        // =========================================

        if (
            req.files?.image3
        ) {

            sql += ", image3 = ?";

            values.push(
                req.files.image3[0].filename
            );

        }


        sql += `
            WHERE id = ?
        `;


        values.push(id);


        db.query(
            sql,

            values,

            (err, result) => {

                if (err) {

                    console.log(
                        "ÜRÜN GÜNCELLEME SQL HATASI:",
                        err
                    );

                    return res.status(500).json({
                        message: "Ürün güncellenemedi.",
                        error: err.message
                    });

                }


                if (
                    result.affectedRows === 0
                ) {

                    return res.status(404).json({
                        message: "Ürün bulunamadı."
                    });

                }


                res.json({
                    message: "Ürün başarıyla güncellendi."
                });

            }
        );

    }
);


module.exports = router;