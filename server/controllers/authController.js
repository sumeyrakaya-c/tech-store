const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Kayıt Ol
const register = async (req, res) => {
    try {
        const { fullName, email, password, phone } = req.body;

        const checkSql = `
            SELECT id
            FROM users
            WHERE email = ?
        `;

        db.query(checkSql, [email], async (err, results) => {

            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Sunucu hatası."
                });
            }

            if (results.length > 0) {
                return res.status(400).json({
                    message: "Bu e-posta zaten kayıtlı."
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const insertSql = `
                INSERT INTO users
                (full_name, email, password, phone)
                VALUES (?, ?, ?, ?)
            `;

            db.query(
                insertSql,
                [fullName, email, hashedPassword, phone],
                (err) => {

                    if (err) {
                        console.log(err);

                        return res.status(500).json({
                            message: "Kayıt oluşturulamadı."
                        });
                    }

                    res.json({
                        message: "Kayıt başarılı."
                    });

                }
            );

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Sunucu hatası."
        });

    }
};

// Giriş Yap
const login = (req, res) => {

    const { email, password } = req.body;

    const sql = `
        SELECT *
        FROM users
        WHERE email = ?
    `;

    db.query(sql, [email], async (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Sunucu hatası."
            });
        }

        if (results.length === 0) {
            return res.status(400).json({
                message: "E-posta veya şifre hatalı."
            });
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "E-posta veya şifre hatalı."
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            message: "Giriş başarılı.",
            token,
            user: {
                id: user.id,
                fullName: user.full_name,
                email: user.email,
                role: user.role
            }
        });

    });

};

module.exports = {
    register,
    login
};