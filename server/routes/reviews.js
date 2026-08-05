const express = require("express");
const router = express.Router();
const db = require("../config/db");
const upload = require("../config/multer");

router.get("/stats/:productId", (req, res) => {

    const { productId } = req.params;

    const sql = `
        SELECT

            ROUND(AVG(rating),1) AS average_rating,

            COUNT(*) AS review_count

        FROM reviews

         WHERE
         product_id = ?
         AND deleted = 0
          `;

    db.query(sql,[productId],(err,result)=>{

        if(err){

            return res.status(500).json(err);

        }

        res.json(result[0]);

    });

});

router.get("/distribution/:productId",(req,res)=>{

    const { productId } = req.params;

    const sql = `

        SELECT

        rating,

        COUNT(*) total

        FROM reviews

         WHERE
         product_id = ?
         AND deleted = 0

        GROUP BY rating

        ORDER BY rating DESC

    `;

    db.query(sql,[productId],(err,result)=>{

        if(err){

            return res.status(500).json(err);

        }

        res.json(result);

    });

});



router.post(
    "/",
    upload.fields([
        { name: "image1", maxCount: 1 },
        { name: "image2", maxCount: 1 },
        { name: "image3", maxCount: 1 }
    ]),
    (req, res) => {

        const {

            user_id,
            product_id,
            rating,
            comment,
            anonymous

        } = req.body;

        const image1 = req.files?.image1
            ? req.files.image1[0].filename
            : null;

        const image2 = req.files?.image2
            ? req.files.image2[0].filename
            : null;

        const image3 = req.files?.image3
            ? req.files.image3[0].filename
            : null;

                    if (!rating) {

            return res.status(400).json({

                message: "Lütfen puan veriniz."

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
            [user_id, product_id],

            (err, review) => {

                if (err) {

                    return res.status(500).json(err);

                }

                if (review.length > 0) {

                    return res.status(400).json({

                        message: "Bu ürün için zaten yorum yaptınız."

                    });

                }
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

                            return res.status(500).json(err);

                        }

                        if (order.length === 0) {

                            return res.status(403).json({

                                message:"Bu ürünü satın almadığınız için yorum yapamazsınız."

                            });

                        }

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

                            (?,?,?,?,?,?,?,?,?)

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

                            (err)=>{

                                if(err){

                                    return res.status(500).json(err);

                                }

                                res.json({

                                    message:"Yorum başarıyla eklendi."

                                });

                            }

                        );

                    }

                );

            }

        );

    }

);

router.get("/can-review/:userId/:productId", (req, res) => {

    const { userId, productId } = req.params;

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

    db.query(sql, [userId, productId], (err, order) => {

        if (err) {
            return res.status(500).json(err);
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
            [userId, productId],
            (err, review) => {

                if (err) {
                    return res.status(500).json(err);
                }

                res.json({
                    canReview: review.length === 0
                });

            }
        );

    });

});

router.delete("/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
       UPDATE reviews
       SET
       deleted = 1,
       updated_at = NOW()
       WHERE id = ?
    `;

    db.query(sql, [id], (err) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            message: "Yorum silindi."
        });

    });

});

router.get("/:productId", (req, res) => {

    const { productId } = req.params;

    const sql = `
        SELECT
            reviews.*,
            users.fullName
        FROM reviews
        INNER JOIN users
            ON reviews.user_id = users.id
            WHERE
            reviews.product_id = ?
            AND reviews.deleted = 0
            ORDER BY created_at DESC
            `;

    db.query(sql, [productId], (err, results) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(results);

    });

});


module.exports = router;