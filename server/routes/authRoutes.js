const sendMail = require("../config/mail");
const express = require("express");
const router = express.Router();

const {
    register,
    login,
    forgotPassword
} = require("../controllers/authController");

router.post("/register", register);

router.post("/login", login);
router.post("/forgot-password", forgotPassword);

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