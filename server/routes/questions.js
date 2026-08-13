const express = require("express");
const router = express.Router();
const db = require("../config/db");


// =========================================
// ÜRÜNÜN SORULARINI GETİR
// =========================================

router.get("/product/:productId", (req, res) => {

    const { productId } = req.params;

    const sql = `
        SELECT
            questions.id,
            questions.user_id,
            questions.question,
            questions.answer,
            questions.status,
            questions.created_at,
            questions.answered_at,

            users.full_name,

            products.name AS product_name

        FROM questions

        INNER JOIN users
            ON questions.user_id = users.id

        INNER JOIN products
            ON questions.product_id = products.id

        WHERE questions.product_id = ?

        ORDER BY questions.created_at DESC
    `;

    db.query(sql, [productId], (err, results) => {

        if (err) {

            console.log("SORULAR SQL HATASI:", err);

            return res.status(500).json({
                message: "Sorular getirilemedi.",
                error: err.message
            });

        }

        res.json(results);

    });

});


// =========================================
// KULLANICI SORU SORSUN
// =========================================

router.post("/", (req, res) => {

    const {
        user_id,
        product_id,
        question
    } = req.body;


    if (!user_id || !product_id || !question?.trim()) {

        return res.status(400).json({
            message: "Lütfen sorunuzu yazınız."
        });

    }


    const sql = `
        INSERT INTO questions
        (
            user_id,
            product_id,
            question,
            status
        )

        VALUES (?, ?, ?, 'Bekliyor')
    `;


    db.query(
        sql,
        [
            user_id,
            product_id,
            question.trim()
        ],
        (err, result) => {

            if (err) {

                console.log("SORU EKLEME HATASI:", err);

                return res.status(500).json({
                    message: "Soru gönderilemedi.",
                    error: err.message
                });

            }


            res.json({
                message: "Sorunuz başarıyla gönderildi.",
                questionId: result.insertId
            });

        }
    );

});


// =========================================
// ADMIN BEKLEYEN SORULARI GETİRSİN
// =========================================

router.get("/admin/pending", (req, res) => {

    const sql = `
        SELECT
            questions.id,
            questions.question,
            questions.answer,
            questions.status,
            questions.created_at,

            users.full_name,
            users.email,

            products.name AS product_name,
            products.id AS product_id

        FROM questions

        INNER JOIN users
            ON questions.user_id = users.id

        INNER JOIN products
            ON questions.product_id = products.id

        WHERE questions.status = 'Bekliyor'

        ORDER BY questions.created_at DESC
    `;


    db.query(sql, (err, results) => {

        if (err) {

            console.log(
                "ADMIN SORULAR SQL HATASI:",
                err
            );

            return res.status(500).json({
                message: "Sorular getirilemedi.",
                error: err.message
            });

        }


        res.json(results);

    });

});


// =========================================
// ADMIN SORUYA CEVAP VERSİN
// =========================================

router.put("/:id/answer", (req, res) => {

    const { id } = req.params;

    const {
        answer,
        answered_by
    } = req.body;


    if (!answer?.trim()) {

        return res.status(400).json({
            message: "Lütfen cevap yazınız."
        });

    }


    const sql = `
        UPDATE questions

        SET
            answer = ?,
            answered_by = ?,
            status = 'Cevaplandı',
            answered_at = NOW()

        WHERE id = ?
    `;


    db.query(
        sql,
        [
            answer.trim(),
            answered_by || null,
            id
        ],
        (err, result) => {

            if (err) {

                console.log(
                    "SORU CEVAPLAMA HATASI:",
                    err
                );

                return res.status(500).json({
                    message: "Cevap kaydedilemedi.",
                    error: err.message
                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message: "Soru bulunamadı."
                });

            }


            res.json({
                message: "Cevap başarıyla gönderildi."
            });

        }
    );

});

// =========================================
// ADMIN HERHANGİ BİR SORUYU SİLSİN
// =========================================

router.delete("/admin/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM questions
        WHERE id = ?
    `;

    db.query(
        sql,
        [id],
        (err, result) => {

            if (err) {

                console.log(
                    "ADMIN SORU SİLME HATASI:",
                    err
                );

                return res.status(500).json({
                    message: "Soru silinemedi.",
                    error: err.message
                });

            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message: "Soru bulunamadı."
                });

            }

            res.json({
                message: "Soru admin tarafından silindi."
            });

        }
    );

});


// =========================================
// KULLANICI KENDİ SORUSUNU SİLSİN
// =========================================

router.delete("/:id", (req, res) => {

    const { id } = req.params;

    // req.body gelmezse hata vermesin
    const { user_id } = req.body || {};

    if (!user_id) {

        return res.status(400).json({
            message: "Kullanıcı bilgisi bulunamadı."
        });

    }

    const sql = `
        DELETE FROM questions
        WHERE id = ?
        AND user_id = ?
    `;

    db.query(
        sql,
        [id, user_id],
        (err, result) => {

            if (err) {

                console.log(
                    "KULLANICI SORU SİLME HATASI:",
                    err
                );

                return res.status(500).json({
                    message: "Soru silinemedi.",
                    error: err.message
                });

            }

            if (result.affectedRows === 0) {

                return res.status(403).json({
                    message:
                        "Bu soruyu silme yetkiniz yok veya soru bulunamadı."
                });

            }

            res.json({
                message: "Sorunuz silindi."
            });

        }
    );

});

module.exports = router;