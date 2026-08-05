const sendMail = require("../config/mail");
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
                async (err) => {

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

const forgotPassword = (req, res) => {

    const { email } = req.body;

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

            return res.status(404).json({
                message: "Bu e-posta adresine ait kullanıcı bulunamadı."
            });

        }

       const user = results[0];

const code = Math.floor(
    100000 + Math.random() * 900000
).toString();

const expiresAt = new Date(
    Date.now() + 10 * 60 * 1000
);

db.query(

    `
    INSERT INTO password_reset_codes
    (
        user_id,
        code,
        expires_at
    )
    VALUES (?, ?, ?)
    `,

    [
        user.id,
        code,
        expiresAt
    ],

    async (err) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Kod kaydedilemedi."
            });

        }

        try {

    await sendMail(

        user.email,

        "TeknoHup Şifre Sıfırlama",

        `
        <div style="font-family:Arial;padding:30px">

            <h2>Merhaba ${user.full_name} 👋</h2>

            <p>
                Şifrenizi sıfırlamak için aşağıdaki doğrulama kodunu kullanın.
            </p>

            <div
                style="
                    font-size:42px;
                    font-weight:bold;
                    color:#0A84FF;
                    letter-spacing:10px;
                    margin:30px 0;
                "
            >

                ${code}

            </div>

            <p>

                Bu kod <b>10 dakika</b> boyunca geçerlidir.

            </p>

            <p>

                Eğer bu işlemi siz yapmadıysanız bu e-postayı dikkate almayabilirsiniz.

            </p>

            <hr>

            <p>

                <b>TeknoHup</b>

            </p>

        </div>
        `

    );

    res.json({

        message: "Doğrulama kodu e-posta adresinize gönderildi."

    });

} catch (error) {

    console.log(error);

    res.status(500).json({

        message: "Mail gönderilemedi."

    });

}

    }

);

    });

};

module.exports = {
    register,
    login,
    forgotPassword
};

