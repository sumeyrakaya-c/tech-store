const express = require("express");
const router = express.Router();

const db = require("../config/db");
const upload = require("../config/multer");


// =========================================
// ÜRÜN YORUMLARINI GETİR
// =========================================

router.get("/:productId", (req, res) => {

    const { productId } = req.params;

    const sql = `
        SELECT
            reviews.*,
            users.full_name
        FROM reviews
        INNER JOIN users
            ON reviews.user_id = users.id
        WHERE
            reviews.product_id = ?
            AND reviews.deleted = 0
        ORDER BY created_at DESC
    `;


    db.query(
        sql,
        [productId],

        (err, results) => {

            if (err) {

                console.log(
                    "YORUMLAR SQL HATASI:",
                    err
                );

                return res.status(500).json({
                    message: "Yorumlar getirilemedi.",
                    error: err.message
                });

            }


            res.json(results);

        }
    );

});


// =========================================
// YORUM İSTATİSTİKLERİ
// =========================================

router.get(
    "/stats/:productId",
    (req, res) => {

        const { productId } = req.params;


        const sql = `
            SELECT
                COUNT(*) AS totalReviews,
                COALESCE(
                    AVG(rating),
                    0
                ) AS averageRating
            FROM reviews
            WHERE
                product_id = ?
                AND deleted = 0
        `;


        db.query(
            sql,
            [productId],

            (err, result) => {

                if (err) {

                    console.log(
                        "YORUM İSTATİSTİKLERİ SQL HATASI:",
                        err
                    );

                    return res.status(500).json({

                        message:
                            "Yorum istatistikleri alınamadı.",

                        error:
                            err.message

                    });

                }


                res.json({

                    averageRating:
                        Number(
                            result[0]?.averageRating || 0
                        ),

                    totalReviews:
                        Number(
                            result[0]?.totalReviews || 0
                        )

                });

            }
        );

    }
);


// =========================================
// YORUM DAĞILIMI
// =========================================

router.get(
    "/distribution/:productId",
    (req, res) => {

        const { productId } = req.params;


        const sql = `
            SELECT
                rating,
                COUNT(*) AS total
            FROM reviews
            WHERE
                product_id = ?
                AND deleted = 0
            GROUP BY rating
            ORDER BY rating DESC
        `;


        db.query(
            sql,
            [productId],

            (err, result) => {

                if (err) {

                    console.log(
                        "YORUM DAĞILIMI SQL HATASI:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Yorum dağılımı alınamadı.",
                        error:
                            err.message
                    });

                }


                res.json(result);

            }
        );

    }
);


// =========================================
// YORUM EKLE
// =========================================

router.post(
    "/",

    upload.fields([
        {
            name: "image1",
            maxCount: 1
        },
        {
            name: "image2",
            maxCount: 1
        },
        {
            name: "image3",
            maxCount: 1
        }
    ]),

    (req, res) => {

        const {
            user_id,
            product_id,
            rating,
            comment,
            anonymous
        } = req.body;


        const image1 =
            req.files?.image1
                ? req.files.image1[0].filename
                : null;


        const image2 =
            req.files?.image2
                ? req.files.image2[0].filename
                : null;


        const image3 =
            req.files?.image3
                ? req.files.image3[0].filename
                : null;


        // =========================================
        // PUAN KONTROLÜ
        // =========================================

        if (!rating) {

            return res.status(400).json({

                message:
                    "Lütfen puan veriniz."

            });

        }


        // =========================================
        // DAHA ÖNCE YORUM YAPILMIŞ MI?
        // =========================================

        db.query(

            `
                SELECT id
                FROM reviews
                WHERE
                    user_id = ?
                    AND product_id = ?
                    AND deleted = 0
            `,

            [
                user_id,
                product_id
            ],

            (err, review) => {

                if (err) {

                    return res
                        .status(500)
                        .json(err);

                }


                if (review.length > 0) {

                    return res.status(400).json({

                        message:
                            "Bu ürün için zaten yorum yaptınız."

                    });

                }


                // =========================================
                // ÜRÜN SATIN ALINMIŞ MI?
                // =========================================

                db.query(

                    `
                        SELECT orders.id
                        FROM orders
                        INNER JOIN order_items
                            ON orders.id = order_items.order_id
                        WHERE
                            orders.user_id = ?
                            AND order_items.product_id = ?
                            AND orders.status = 'Teslim Edildi'
                        LIMIT 1
                    `,

                    [
                        user_id,
                        product_id
                    ],

                    (err, order) => {

                        if (err) {

                            return res
                                .status(500)
                                .json(err);

                        }


                        if (order.length === 0) {

                            return res.status(403).json({

                                message:
                                    "Bu ürünü satın almadığınız için yorum yapamazsınız."

                            });

                        }


                        // =========================================
                        // YORUMU KAYDET
                        // =========================================

                        db.query(

                            `
                                INSERT INTO reviews
                                (
                                    user_id,
                                    product_id,
                                    order_id,
                                    rating,
                                    comment,
                                    anonymous,
                                    image1,
                                    image2,
                                    image3
                                )
                                VALUES
                                (?, ?, ?, ?, ?, ?, ?, ?, ?)
                            `,

                            [
                                user_id,
                                product_id,
                                order[0].id,
                                rating,
                                comment,
                                anonymous,
                                image1,
                                image2,
                                image3
                            ],

                            (err) => {

                                if (err) {

                                    return res
                                        .status(500)
                                        .json(err);

                                }


                                res.json({

                                    message:
                                        "Yorum başarıyla eklendi."

                                });

                            }

                        );

                    }

                );

            }

        );

    }

);


// =========================================
// YORUM YAPABİLİR Mİ?
// =========================================

router.get(
    "/can-review/:userId/:productId",
    (req, res) => {

        const {
            userId,
            productId
        } = req.params;


        const sql = `
            SELECT orders.id
            FROM orders
            INNER JOIN order_items
                ON orders.id = order_items.order_id
            WHERE
                orders.user_id = ?
                AND order_items.product_id = ?
                AND orders.status = 'Teslim Edildi'
            LIMIT 1
        `;


        db.query(
            sql,

            [
                userId,
                productId
            ],

            (err, order) => {

                if (err) {

                    return res
                        .status(500)
                        .json(err);

                }


                if (order.length === 0) {

                    return res.json({

                        canReview: false

                    });

                }


                db.query(

                    `
                        SELECT id
                        FROM reviews
                        WHERE
                            user_id = ?
                            AND product_id = ?
                            AND deleted = 0
                    `,

                    [
                        userId,
                        productId
                    ],

                    (err, review) => {

                        if (err) {

                            return res
                                .status(500)
                                .json(err);

                        }


                        res.json({

                            canReview:
                                review.length === 0

                        });

                    }

                );

            }

        );

    }
);


// =========================================
// YORUM SİL
// =========================================

router.delete(
    "/:id",
    (req, res) => {

        const { id } = req.params;


        const sql = `
            UPDATE reviews
            SET
                deleted = 1,
                updated_at = NOW()
            WHERE id = ?
        `;


        db.query(
            sql,
            [id],

            (err) => {

                if (err) {

                    return res
                        .status(500)
                        .json(err);

                }


                res.json({

                    message:
                        "Yorum silindi."

                });

            }

        );

    }
);


// =========================================
// KULLANICININ YORUMLARI
// =========================================

router.get(
    "/user/:userId",
    (req, res) => {

        const { userId } = req.params;


        const sql = `
            SELECT
                reviews.id,
                reviews.product_id,
                reviews.order_id,
                reviews.rating,
                reviews.comment,
                reviews.anonymous,
                reviews.image1,
                reviews.image2,
                reviews.image3,
                reviews.created_at,

                products.name AS product_name,
                products.image AS product_image

            FROM reviews

            INNER JOIN products
                ON reviews.product_id = products.id

            WHERE
                reviews.user_id = ?
                AND reviews.deleted = 0

            ORDER BY
                reviews.created_at DESC
        `;


        db.query(
            sql,
            [userId],

            (err, results) => {

                if (err) {

                    console.log(
                        "REVIEWS SQL HATASI:",
                        err
                    );

                    return res.status(500).json({

                        message:
                            "Yorumlar getirilemedi.",

                        error:
                            err.message

                    });

                }


                res.json(results);

            }

        );

    }
);


// =========================================
// KULLANICININ SİPARİŞ YORUMLARI
// =========================================

router.get(
    "/user-orders/:userId",
    (req, res) => {

        const { userId } = req.params;


        const sql = `
            SELECT

                orders.id AS order_id,

                orders.created_at AS order_date,

                orders.status,

                order_items.product_id,

                products.name AS product_name,

                products.image AS product_image,

                reviews.id AS review_id,

                reviews.rating,

                reviews.comment

            FROM orders

            INNER JOIN order_items
                ON orders.id = order_items.order_id

            INNER JOIN products
                ON order_items.product_id = products.id

            LEFT JOIN reviews
                ON reviews.order_id = orders.id
                AND reviews.product_id = order_items.product_id
                AND reviews.user_id = ?
                AND reviews.deleted = 0

            WHERE
                orders.user_id = ?
                AND orders.status = 'Teslim Edildi'

            ORDER BY
                orders.created_at DESC
        `;


        db.query(
            sql,

            [
                userId,
                userId
            ],

            (err, results) => {

                if (err) {

                    console.log(
                        "SİPARİŞ YORUMLARI SQL HATASI:",
                        err
                    );

                    return res.status(500).json({

                        message:
                            "Sipariş yorumları getirilemedi.",

                        error:
                            err.message

                    });

                }


                res.json(results);

            }

        );

    }
);


module.exports = router;