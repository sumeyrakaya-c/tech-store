const db = require("../config/db");


// =========================================
// TÜM KULLANICILARI GETİR
// ADMIN PANELİ
// =========================================

const getAllUsers = (req, res) => {

    const sql = `
        SELECT
            id,
            full_name,
            email,
            phone,
            city,
            district,
            address,
            role
        FROM users
        ORDER BY id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.log(
                "KULLANICILAR GETİRME HATASI:",
                err
            );

            return res.status(500).json({
                message: "Kullanıcılar getirilemedi.",
                error: err.message
            });

        }

        res.json(results);

    });

};


// =========================================
// PROFİL BİLGİLERİNİ GETİR
// =========================================

const getProfile = (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT
            id,
            full_name,
            email,
            phone,
            city,
            district,
            address,
            role
        FROM users
        WHERE id = ?
    `;

    db.query(sql, [id], (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Profil getirilemedi."
            });

        }

        if (results.length === 0) {

            return res.status(404).json({
                message: "Kullanıcı bulunamadı."
            });

        }

        res.json(results[0]);

    });

};


// =========================================
// PROFİL BİLGİLERİNİ GÜNCELLE
// =========================================

const updateProfile = (req, res) => {

    const { id } = req.params;

    const {
        fullName,
        phone,
        city,
        district,
        address
    } = req.body;

    const sql = `
        UPDATE users
        SET
            full_name = ?,
            phone = ?,
            city = ?,
            district = ?,
            address = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            fullName,
            phone,
            city,
            district,
            address,
            id
        ],
        (err, result) => {

            if (err) {

                console.log(
                    "PROFİL GÜNCELLEME HATASI:",
                    err
                );

                return res.status(500).json({
                    message: "Profil güncellenemedi.",
                    error: err.message
                });

            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message: "Kullanıcı bulunamadı."
                });

            }

            res.json({
                message: "Profil başarıyla güncellendi."
            });

        }
    );

};


// =========================================
// EXPORT
// =========================================

module.exports = {
    getAllUsers,
    getProfile,
    updateProfile
};