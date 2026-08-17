const express = require("express");
const router = express.Router();

const db = require("../config/db");


// =========================================
// DEPOLAMA SEÇENEKLERİNİ GETİR
// =========================================

router.get("/:variantGroupId", (req, res) => {

    const { variantGroupId } = req.params;

    const sql = `
        SELECT
            id,
            variant_group_id,
            storage,
            price_difference
        FROM product_storage_options
        WHERE variant_group_id = ?
        ORDER BY id ASC
    `;

    db.query(
        sql,
        [variantGroupId],
        (err, results) => {

            if (err) {

                console.log(
                    "DEPOLAMA SEÇENEKLERİ SQL HATASI:",
                    err
                );

                return res.status(500).json({
                    message: "Depolama seçenekleri alınamadı.",
                    error: err.message
                });

            }

            res.json(results);

        }
    );

});


// =========================================
// DEPOLAMA SEÇENEĞİ EKLE
// =========================================

router.post("/", (req, res) => {

    const {
        variant_group_id,
        storage,
        price_difference
    } = req.body;


    if (
        !variant_group_id ||
        !storage
    ) {

        return res.status(400).json({
            message: "Varyant grubu ve depolama alanı zorunludur."
        });

    }


    const sql = `
        INSERT INTO product_storage_options
        (
            variant_group_id,
            storage,
            price_difference
        )
        VALUES (?, ?, ?)
    `;


    db.query(
        sql,
        [
            variant_group_id,
            storage,
            price_difference || 0
        ],
        (err, result) => {

            if (err) {

                console.log(
                    "DEPOLAMA EKLEME SQL HATASI:",
                    err
                );

                return res.status(500).json({
                    message: "Depolama seçeneği eklenemedi.",
                    error: err.message
                });

            }


            res.status(201).json({

                message: "Depolama seçeneği eklendi.",

                id: result.insertId

            });

        }
    );

});


// =========================================
// DEPOLAMA SEÇENEĞİ SİL
// =========================================

router.delete("/:id", (req, res) => {

    const { id } = req.params;


    const sql = `
        DELETE FROM product_storage_options
        WHERE id = ?
    `;


    db.query(
        sql,
        [id],
        (err, result) => {

            if (err) {

                console.log(
                    "DEPOLAMA SİLME SQL HATASI:",
                    err
                );

                return res.status(500).json({
                    message: "Depolama seçeneği silinemedi.",
                    error: err.message
                });

            }


            if (
                result.affectedRows === 0
            ) {

                return res.status(404).json({
                    message: "Depolama seçeneği bulunamadı."
                });

            }


            res.json({
                message: "Depolama seçeneği silindi."
            });

        }
    );

});


module.exports = router;