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

            const code = Math.floor(
                100000 + Math.random() * 900000
             ).toString();

            const expiresAt = new Date(
                Date.now() + 10 * 60 * 1000
            );

            const insertSql = `
                INSERT INTO pending_users
                (
                  full_name,
                  email,
                  password,
                  phone,
                  code,
                  expires_at
                )
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            db.query(
                insertSql,
                [
                   fullName,
                   email,
                   hashedPassword,
                   phone,
                   code,
                   expiresAt
                ],
                async (err) => {

                    if (err) {
                        console.log(err);

                        return res.status(500).json({
                            message: "Kayıt oluşturulamadı."
                        });
                    }

try {

    await sendMail(

        email,

        "TeknoHup E-Posta Doğrulama",

        `
        <div style="font-family:Arial;padding:30px">

            <h2>TeknoHup'a Hoş Geldiniz 👋</h2>

            <p>

                Merhaba <b>${fullName}</b>,

            </p>

            <p>

                Hesabınızı doğrulamak için aşağıdaki kodu kullanın.

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
              phone: user.phone,
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

const verifyEmail = (req, res) => {

    const { email, code } = req.body;

    const sql = `
        SELECT *
        FROM pending_users
        WHERE email = ?
        AND code = ?
    `;

    db.query(sql, [email, code], (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Sunucu hatası."
            });

        }

        if (results.length === 0) {

            return res.status(400).json({
                message: "Kod hatalı."
            });

        }

        const pendingUser = results[0];

        if (new Date() > new Date(pendingUser.expires_at)) {

            return res.status(400).json({
                message: "Kodun süresi dolmuş."
            });

        }

       const insertSql = `
    INSERT INTO users
    (
        full_name,
        email,
        password,
        phone
    )
    VALUES (?, ?, ?, ?)
`;

db.query(

    insertSql,

    [
        pendingUser.full_name,
        pendingUser.email,
        pendingUser.password,
        pendingUser.phone
    ],

    (err) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Kullanıcı oluşturulamadı."
            });

        }

        db.query(

            `
            DELETE FROM pending_users
            WHERE id = ?
            `,

            [pendingUser.id],

            (err) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json({
                        message: "Geçici kayıt silinemedi."
                    });

                }

                res.json({

                    message: "Hesabınız başarıyla doğrulandı."

                });

            }

        );

    }

);

    });

};

const resetPassword = async (req, res) => {

    const { email, code, newPassword } = req.body;

    const sql = `
        SELECT *
        FROM password_reset_codes
        WHERE code = ?
        AND used = 0
        ORDER BY id DESC
        LIMIT 1
    `;

    db.query(sql, [code], async (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Sunucu hatası."
            });

        }

        if (results.length === 0) {

            return res.status(400).json({
                message: "Kod geçersiz."
            });

        }

        const resetCode = results[0];

        if (new Date() > new Date(resetCode.expires_at)) {

            return res.status(400).json({
                message: "Kodun süresi dolmuş."
            });

        }

       const hashedPassword = await bcrypt.hash(newPassword, 10);

db.query(

    `
    UPDATE users
    SET password = ?
    WHERE email = ?
    `,

    [
        hashedPassword,
        email
    ],

    (err) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Şifre güncellenemedi."
            });

        }

        db.query(

            `
            UPDATE password_reset_codes
            SET used = 1
            WHERE id = ?
            `,

            [resetCode.id],

            (err) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json({
                        message: "Kod güncellenemedi."
                    });

                }

                res.json({

                    message: "Şifreniz başarıyla değiştirildi."

                });

            }

        );

    }

);

    });

};

// Profil Bilgilerini Güncelle
const updateProfile = (req, res) => {

    const { id, fullName, email, phone } = req.body;

    if (!id || !fullName || !email) {

        return res.status(400).json({
            message: "Ad soyad ve e-posta zorunludur."
        });

    }

    // E-posta başka bir kullanıcı tarafından kullanılıyor mu?
    const checkSql = `
        SELECT id
        FROM users
        WHERE email = ?
        AND id != ?
    `;

    db.query(
        checkSql,
        [email, id],
        (err, results) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Sunucu hatası."
                });

            }

            if (results.length > 0) {

                return res.status(400).json({
                    message: "Bu e-posta başka bir kullanıcıya ait."
                });

            }

            const updateSql = `
                UPDATE users
                SET
                    full_name = ?,
                    email = ?,
                    phone = ?
                WHERE id = ?
            `;

            db.query(
                updateSql,
                [
                    fullName,
                    email,
                    phone || "",
                    id
                ],
                (err) => {

                    if (err) {

                        console.log(err);

                        return res.status(500).json({
                            message: "Profil bilgileri güncellenemedi."
                        });

                    }

                    res.json({

                        message: "Profil bilgileriniz güncellendi.",

                        user: {
                            id,
                            fullName,
                            email,
                            phone: phone || ""
                        }

                    });

                }
            );

        }
    );

};

// =========================================
// PROFİL ŞİFRE DEĞİŞTİRME KODU GÖNDER
// =========================================

const sendChangePasswordCode = (req, res) => {

    const { userId } = req.body;

    if (!userId) {

        return res.status(400).json({
            message: "Kullanıcı bilgisi eksik."
        });

    }


    const sql = `
        SELECT id, full_name, email
        FROM users
        WHERE id = ?
    `;


    db.query(sql, [userId], async (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Sunucu hatası."
            });

        }


        if (results.length === 0) {

            return res.status(404).json({
                message: "Kullanıcı bulunamadı."
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
                        message: "Doğrulama kodu oluşturulamadı."
                    });

                }


                try {

                    await sendMail(

                        user.email,

                        "TeknoHup Şifre Değiştirme",

                        `
                        <div style="font-family:Arial;padding:30px">

                            <h2>TeknoHup Hesap Güvenliği 🔐</h2>

                            <p>
                                Merhaba <b>${user.full_name}</b>,
                            </p>

                            <p>
                                Şifrenizi değiştirmek için
                                aşağıdaki doğrulama kodunu kullanın.
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

                            <hr>

                            <p>
                                <b>TeknoHup</b>
                            </p>

                        </div>
                        `
                    );


                    res.json({

                        message:
                            "Doğrulama kodu e-posta adresinize gönderildi."

                    });


                } catch (error) {

                    console.log(error);

                    res.status(500).json({

                        message:
                            "Mail gönderilemedi."

                    });

                }

            }
        );

    });

};

// =========================================
// PROFİL ŞİFRE DEĞİŞTİR
// =========================================

const changePassword = async (req, res) => {

    const {
        userId,
        code,
        newPassword
    } = req.body;


    if (!userId || !code || !newPassword) {

        return res.status(400).json({
            message: "Gerekli bilgiler eksik."
        });

    }


    if (newPassword.length < 6) {

        return res.status(400).json({
            message: "Şifre en az 6 karakter olmalıdır."
        });

    }


    const sql = `
        SELECT *
        FROM password_reset_codes
        WHERE
            user_id = ?
            AND code = ?
            AND used = 0
        ORDER BY id DESC
        LIMIT 1
    `;


    db.query(
        sql,
        [userId, code],
        async (err, results) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Sunucu hatası."
                });

            }


            if (results.length === 0) {

                return res.status(400).json({
                    message: "Doğrulama kodu hatalı."
                });

            }


            const resetCode = results[0];


            if (
                new Date() >
                new Date(resetCode.expires_at)
            ) {

                return res.status(400).json({
                    message: "Doğrulama kodunun süresi dolmuş."
                });

            }


            try {

                const hashedPassword =
                    await bcrypt.hash(
                        newPassword,
                        10
                    );


                db.query(
                    `
                    UPDATE users
                    SET password = ?
                    WHERE id = ?
                    `,
                    [
                        hashedPassword,
                        userId
                    ],
                    (err) => {

                        if (err) {

                            console.log(err);

                            return res.status(500).json({
                                message:
                                    "Şifre güncellenemedi."
                            });

                        }


                        db.query(
                            `
                            UPDATE password_reset_codes
                            SET used = 1
                            WHERE id = ?
                            `,
                            [resetCode.id],
                            (err) => {

                                if (err) {

                                    console.log(err);

                                    return res.status(500).json({
                                        message:
                                            "Doğrulama kodu güncellenemedi."
                                    });

                                }


                                res.json({

                                    message:
                                        "Şifreniz başarıyla değiştirildi."

                                });

                            }
                        );

                    }
                );

            } catch (error) {

                console.log(error);

                res.status(500).json({

                    message:
                        "Şifre oluşturulamadı."

                });

            }

        }
    );

};

// =========================================
// E-POSTA DEĞİŞTİRME - ŞİFRE KONTROLÜ
// =========================================

const startEmailChange = async (req, res) => {

    const {
        userId,
        currentPassword,
        newEmail
    } = req.body;


    if (!userId || !currentPassword || !newEmail) {

        return res.status(400).json({
            message: "Gerekli bilgiler eksik."
        });

    }


    // E-posta formatı
    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(newEmail)) {

        return res.status(400).json({
            message: "Geçerli bir e-posta adresi giriniz."
        });

    }


    try {

        // Kullanıcıyı getir
        db.query(
            `
            SELECT id, email, password
            FROM users
            WHERE id = ?
            `,
            [userId],
            async (err, results) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json({
                        message: "Sunucu hatası."
                    });

                }


                if (results.length === 0) {

                    return res.status(404).json({
                        message: "Kullanıcı bulunamadı."
                    });

                }


                const user = results[0];


                // Mevcut şifreyi kontrol et
                const passwordCorrect =
                    await bcrypt.compare(
                        currentPassword,
                        user.password
                    );


                if (!passwordCorrect) {

                    return res.status(400).json({
                        message: "Mevcut şifreniz hatalı."
                    });

                }


                // Yeni e-posta mevcut mu?
                db.query(
                    `
                    SELECT id
                    FROM users
                    WHERE email = ?
                    AND id != ?
                    `,
                    [
                        newEmail,
                        userId
                    ],
                    (err, existingUser) => {

                        if (err) {

                            console.log(err);

                            return res.status(500).json({
                                message: "Sunucu hatası."
                            });

                        }


                        if (existingUser.length > 0) {

                            return res.status(400).json({
                                message:
                                    "Bu e-posta adresi başka bir hesap tarafından kullanılıyor."
                            });

                        }


                        // 6 haneli kod
                        const code =
                            Math.floor(
                                100000 +
                                Math.random() * 900000
                            ).toString();


                        const expiresAt =
                            new Date(
                                Date.now() +
                                10 * 60 * 1000
                            );


                        // Kod tablosuna kaydet
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
                                userId,
                                code,
                                expiresAt
                            ],
                            async (err) => {

                                if (err) {

                                    console.log(err);

                                    return res.status(500).json({
                                        message:
                                            "Doğrulama kodu oluşturulamadı."
                                    });

                                }


                                try {

                                    await sendMail(

                                        newEmail,

                                        "TeknoHup E-posta Doğrulama",

                                        `
                                        <div
                                            style="
                                                font-family:Arial;
                                                padding:30px;
                                            "
                                        >

                                            <h2>
                                                TeknoHup E-posta Doğrulama ✉️
                                            </h2>

                                            <p>
                                                Yeni e-posta adresinizi
                                                doğrulamak için aşağıdaki
                                                kodu kullanın.
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
                                                Bu kod
                                                <b>10 dakika</b>
                                                boyunca geçerlidir.
                                            </p>

                                            <hr>

                                            <p>
                                                <b>TeknoHup</b>
                                            </p>

                                        </div>
                                        `
                                    );


                                    res.json({

                                        message:
                                            "Doğrulama kodu yeni e-posta adresinize gönderildi."

                                    });


                                } catch (error) {

                                    console.log(error);

                                    res.status(500).json({

                                        message:
                                            "Mail gönderilemedi."

                                    });

                                }

                            }
                        );

                    }
                );

            }
        );

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Sunucu hatası."
        });

    }

};

// =========================================
// E-POSTA DEĞİŞTİRME - KODU DOĞRULA
// =========================================

const verifyEmailChange = (req, res) => {

    const {
        userId,
        newEmail,
        code
    } = req.body;


    if (!userId || !newEmail || !code) {

        return res.status(400).json({
            message: "Gerekli bilgiler eksik."
        });

    }


    db.query(
        `
        SELECT *
        FROM password_reset_codes
        WHERE
            user_id = ?
            AND code = ?
            AND used = 0
        ORDER BY id DESC
        LIMIT 1
        `,
        [userId, code],
        (err, results) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Sunucu hatası."
                });

            }


            if (results.length === 0) {

                return res.status(400).json({
                    message: "Doğrulama kodu hatalı."
                });

            }


            const verificationCode = results[0];


            // Kod süresi kontrolü
            if (
                new Date() >
                new Date(verificationCode.expires_at)
            ) {

                return res.status(400).json({
                    message: "Doğrulama kodunun süresi dolmuş."
                });

            }


            // Yeni e-posta başka hesapta kullanılıyor mu?
            db.query(
                `
                SELECT id
                FROM users
                WHERE email = ?
                AND id != ?
                `,
                [
                    newEmail,
                    userId
                ],
                (err, existingUser) => {

                    if (err) {

                        console.log(err);

                        return res.status(500).json({
                            message: "Sunucu hatası."
                        });

                    }


                    if (existingUser.length > 0) {

                        return res.status(400).json({
                            message:
                                "Bu e-posta adresi başka bir hesap tarafından kullanılıyor."
                        });

                    }


                    // E-postayı değiştir
                    db.query(
                        `
                        UPDATE users
                        SET email = ?
                        WHERE id = ?
                        `,
                        [
                            newEmail,
                            userId
                        ],
                        (err) => {

                            if (err) {

                                console.log(err);

                                return res.status(500).json({
                                    message:
                                        "E-posta adresi güncellenemedi."
                                });

                            }


                            // Kodu kullanıldı olarak işaretle
                            db.query(
                                `
                                UPDATE password_reset_codes
                                SET used = 1
                                WHERE id = ?
                                `,
                                [verificationCode.id],
                                (err) => {

                                    if (err) {

                                        console.log(err);

                                        return res.status(500).json({
                                            message:
                                                "Doğrulama kodu güncellenemedi."
                                        });

                                    }


                                    res.json({

                                        message:
                                            "E-posta adresiniz başarıyla değiştirildi.",

                                        email: newEmail

                                    });

                                }
                            );

                        }
                    );

                }
            );

        }
    );

};

module.exports = {
    register,
    login,
    forgotPassword,
    verifyEmail,
    resetPassword,
    updateProfile,
    sendChangePasswordCode,
    changePassword,
    startEmailChange,
    verifyEmailChange
};