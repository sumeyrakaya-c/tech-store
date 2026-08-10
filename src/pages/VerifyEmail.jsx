import "../styles/auth.css";
import logo from "../assets/logo.png";
import devices from "../assets/devices.png";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function VerifyEmail() {

    const [code, setCode] = useState("");

    const navigate = useNavigate();

    const email = localStorage.getItem("verifyEmail");

    const handleVerify = async (e) => {

        e.preventDefault();

        try {

            const res = await fetch(
                "http://localhost:5000/api/auth/verify-email",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        code
                    })
                }
            );

            const data = await res.json();

            alert(data.message);

            if (res.ok) {

                localStorage.removeItem("verifyEmail");

                navigate("/login");

            }

        } catch (error) {

            console.log(error);

            alert("Sunucuya bağlanılamadı.");

        }

    };

    return (

        <div className="auth-page">

            <div className="auth-left">

                <img
                    src={devices}
                    alt="Teknoloji"
                    className="devices-image"
                />

                <h1>

                    E-Postanızı
                    <br />
                    Doğrulayın

                </h1>

                <p>

                    Size gönderdiğimiz
                    6 haneli doğrulama kodunu girerek
                    hesabınızı aktif hale getirin.

                </p>

                <div className="features">

                    <span>✔ Güvenli Doğrulama</span>

                    <span>✔ 10 Dakika Geçerli Kod</span>

                    <span>✔ Hesabınızı Aktifleştirin</span>

                </div>

            </div>

            <div className="auth-right">

                <img
                    src={logo}
                    alt="TeknoHup"
                    className="brand-logo"
                />

                <h2>

                    E-Posta Doğrulama

                </h2>

                <p className="auth-subtitle">

                    Mail adresinize gelen doğrulama kodunu giriniz.

                </p>

                <form onSubmit={handleVerify}>

                    <div className="auth-input-group">

                        <input
                            className="auth-input"
                            type="text"
                            placeholder="6 Haneli Kod"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />

                    </div>

                    <button
                        type="submit"
                        className="auth-btn"
                    >

                        Hesabı Doğrula

                    </button>

                    <div className="auth-link">

                        <span>

                            Yanlış e-posta mı kullandınız?

                        </span>

                        <Link to="/register">

                            ← Kayıt Sayfasına Dön

                        </Link>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default VerifyEmail;