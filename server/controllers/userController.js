const db = require("../config/db");

// Profil bilgilerini getir
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

module.exports = {
    getProfile
};