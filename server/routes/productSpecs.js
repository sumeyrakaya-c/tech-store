const express = require("express");
const router = express.Router();
const db = require("../config/db");


// =========================================
// ÜRÜNÜN TEKNİK ÖZELLİKLERİNİ GETİR
// =========================================

router.get("/:productId", (req, res) => {

    const { productId } = req.params;

    const sql = `
        SELECT
            id,
            product_id,

            processor,
            processor_en,

            ram,
            ram_en,

            storage,
            storage_en,

            display,
            display_en,

            battery,
            battery_en,

            camera,
            camera_en,

            operating_system,
            operating_system_en

        FROM product_specs

        WHERE product_id = ?

        LIMIT 1
    `;


    db.query(
        sql,
        [productId],

        (err, results) => {

            if (err) {

                console.log(
                    "TEKNİK ÖZELLİKLER SQL HATASI:",
                    err
                );

                return res.status(500).json({

                    message:
                        "Teknik özellikler alınamadı.",

                    error:
                        err.message

                });

            }


            if (results.length === 0) {

                return res.json(null);

            }


            res.json(results[0]);

        }
    );

});


// =========================================
// ÜRÜNE TEKNİK ÖZELLİK EKLE
// =========================================

router.post("/", (req, res) => {

    const {

        product_id,

        processor,
        processor_en,

        ram,
        ram_en,

        storage,
        storage_en,

        display,
        display_en,

        battery,
        battery_en,

        camera,
        camera_en,

        operating_system,
        operating_system_en

    } = req.body;


    if (!product_id) {

        return res.status(400).json({

            message:
                "Ürün bilgisi bulunamadı."

        });

    }


    const sql = `
        INSERT INTO product_specs
        (
            product_id,

            processor,
            processor_en,

            ram,
            ram_en,

            storage,
            storage_en,

            display,
            display_en,

            battery,
            battery_en,

            camera,
            camera_en,

            operating_system,
            operating_system_en
        )

        VALUES (
            ?,
            ?, ?,
            ?, ?,
            ?, ?,
            ?, ?,
            ?, ?,
            ?, ?,
            ?, ?
        )
    `;


    db.query(

        sql,

        [

            product_id,

            processor || null,
            processor_en || null,

            ram || null,
            ram_en || null,

            storage || null,
            storage_en || null,

            display || null,
            display_en || null,

            battery || null,
            battery_en || null,

            camera || null,
            camera_en || null,

            operating_system || null,
            operating_system_en || null

        ],

        (err, result) => {

            if (err) {

                console.log(
                    "TEKNİK ÖZELLİK EKLEME HATASI:",
                    err
                );

                return res.status(500).json({

                    message:
                        "Teknik özellikler kaydedilemedi.",

                    error:
                        err.message

                });

            }


            res.json({

                message:
                    "Teknik özellikler başarıyla kaydedildi.",

                id:
                    result.insertId

            });

        }

    );

});


// =========================================
// TEKNİK ÖZELLİK GÜNCELLE
// =========================================

router.put("/:productId", (req, res) => {

    const { productId } = req.params;


    const {

        processor,
        processor_en,

        ram,
        ram_en,

        storage,
        storage_en,

        display,
        display_en,

        battery,
        battery_en,

        camera,
        camera_en,

        operating_system,
        operating_system_en

    } = req.body;


    const sql = `
        UPDATE product_specs

        SET

            processor = ?,
            processor_en = ?,

            ram = ?,
            ram_en = ?,

            storage = ?,
            storage_en = ?,

            display = ?,
            display_en = ?,

            battery = ?,
            battery_en = ?,

            camera = ?,
            camera_en = ?,

            operating_system = ?,
            operating_system_en = ?

        WHERE product_id = ?
    `;


    db.query(

        sql,

        [

            processor || null,
            processor_en || null,

            ram || null,
            ram_en || null,

            storage || null,
            storage_en || null,

            display || null,
            display_en || null,

            battery || null,
            battery_en || null,

            camera || null,
            camera_en || null,

            operating_system || null,
            operating_system_en || null,

            productId

        ],

        (err, result) => {

            if (err) {

                console.log(
                    "TEKNİK ÖZELLİK GÜNCELLEME HATASI:",
                    err
                );

                return res.status(500).json({

                    message:
                        "Teknik özellikler güncellenemedi.",

                    error:
                        err.message

                });

            }


            res.json({

                message:
                    "Teknik özellikler güncellendi."

            });

        }

    );

});


module.exports = router;