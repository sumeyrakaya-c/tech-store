import "../styles/auth.css";
import logo from "../assets/logo.png";
import devices from "../assets/devices.png";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ResetPassword() {

    const navigate = useNavigate();

    const email = localStorage.getItem("resetEmail");

    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleReset = async (e) => {

        e.preventDefault();

        if (newPassword !== confirmPassword) {

            alert("Şifreler uyuşmuyor.");

            return;

        }

        try {

            const res = await fetch(
                "http://localhost:5000/api/auth/reset-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        code,
                        newPassword
                    })
                }
            );

            const data = await res.json();

            alert(data.message);

            if (res.ok) {

                localStorage.removeItem("resetEmail");

                navigate("/login");

            }

        } catch (error) {

            console.log(error);

            alert("Sunucuya bağlanılamadı.");

        }

    };

    return (

        <div className="auth-page">

            {/* SOL */}

            <div className="auth-left">

                <img
                    src={devices}
                    alt="Teknoloji"
                    className="devices-image"
                />

                <h1>

                    Yeni Şifrenizi
                    <br />
                    Oluşturun

                </h1>

                <p>

                    Mail adresinize gelen doğrulama kodunu
                    girerek yeni şifrenizi belirleyin.

                </p>

                <div className="features">

                    <span>✔ Güvenli Şifre Değiştirme</span>

                    <span>✔ 6 Haneli Doğrulama Kodu</span>

                    <span>✔ Hesabınız Koruma Altında</span>

                </div>

            </div>

            {/* SAĞ */}

            <div className="auth-right">

                <img
                    src={logo}
                    alt="TeknoHup"
                    className="brand-logo"
                />

                <h2>

                    Yeni Şifre

                </h2>

                <p className="auth-subtitle">

                    Kodu ve yeni şifrenizi giriniz.

                </p>

                <form onSubmit={handleReset}>

                    <div className="auth-input-group">

                        <input
                            className="auth-input"
                            type="text"
                            placeholder="Doğrulama Kodu"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />

                    </div>

                    <div className="auth-input-group">

                        <input
                            className="auth-input"
                            type="password"
                            placeholder="Yeni Şifre"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />

                    </div>

                    <div className="auth-input-group">

                        <input
                            className="auth-input"
                            type="password"
                            placeholder="Şifre Tekrar"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                    </div>

                    <button
                        type="submit"
                        className="auth-btn"
                    >

                        Şifreyi Güncelle

                    </button>

                    <div className="auth-link">

                        <span>

                            Giriş ekranına dönmek ister misiniz?

                        </span>

                        <Link to="/login">

                            ← Giriş Yap

                        </Link>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default ResetPassword;