const sendMail = require("../config/mail");
const express = require("express");

const router = express.Router();

const {
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
} = require("../controllers/authController");


// =========================================
// AUTH ROUTES
// =========================================

router.post("/verify-email", verifyEmail);

router.post("/reset-password", resetPassword);

router.post("/register", register);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);


// =========================================
// PROFILE
// =========================================

router.put("/profile", updateProfile);


// =========================================
// ŞİFRE DEĞİŞTİRME DOĞRULAMA KODU
// =========================================

router.post(
    "/send-change-password-code",
    sendChangePasswordCode
);

router.post(
    "/change-password",
    changePassword
);

router.post(
    "/start-email-change",
    startEmailChange
);

router.post(
    "/verify-email-change",
    verifyEmailChange
);
// =========================================
// MAIL TEST
// =========================================

router.get("/mail-test", async (req, res) => {

    try {

        await sendMail(

            "teknohup0@gmail.com",

            "TeknoHup Test",

            `
            <h2>Merhaba 👋</h2>

            <p>
                Bu mail TeknoHup tarafından başarıyla gönderildi.
            </p>

            <h1 style="color:#0A84FF;">
                Mail Sistemi Çalışıyor 🎉
            </h1>
            `
        );

        res.json({

            message: "Mail gönderildi."

        });

    } catch (err) {

        console.log(err);

        res.status(500).json(err);

    }

});


module.exports = router;