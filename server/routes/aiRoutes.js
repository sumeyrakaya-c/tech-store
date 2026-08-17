const express = require("express");
const router = express.Router();

const db = require("../config/db");
const { askAI } = require("../services/aiService");


router.post("/chat", async (req, res) => {

    try {

        const { message } = req.body;


        if (!message || !message.trim()) {

            return res.status(400).json({
                message: "Mesaj boş olamaz."
            });

        }


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

            WHERE products.status = 'active'

            ORDER BY products.id DESC
        `;


        db.query(
            sql,
            async (err, products) => {

                if (err) {

                    console.log(
                        "AI ÜRÜN VERİSİ SQL HATASI:",
                        err
                    );

                    return res.status(500).json({
                        message: "Ürün verileri alınamadı."
                    });

                }


                try {

                    const answer =
                        await askAI(
                            message,
                            products
                        );


                    return res.json({
                        answer
                    });


                } catch (error) {

                    console.log(
                        "AI HATASI:",
                        error
                    );

                    return res.status(500).json({
                        message: "AI yanıt oluşturamadı."
                    });

                }

            }
        );


    } catch (error) {

        console.log(
            "AI ROUTE HATASI:",
            error
        );

        return res.status(500).json({
            message: "Bir hata oluştu."
        });

    }

});


module.exports = router;