import "../styles/auth.css";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate, useLocation, Link } from "react-router-dom";

import logo from "../assets/logo.png";
import devices from "../assets/devices.png";

function Login() {

    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const res = await fetch("http://localhost:5000/api/auth/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })

            });

            const data = await res.json();

            alert(data.message);

            if (res.ok) {

                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                const from = location.state?.from || "/";

                navigate(from, { replace: true });

            }

        } catch (error) {

            console.log(error);

            alert("Sunucuya bağlanırken hata oluştu.");

        }

    };

    return (

        <div className="auth-page">

            {/* SOL TARAF */}

            <div className="auth-left">

                <img
                    src={devices}
                    alt="Teknoloji Ürünleri"
                    className="devices-image"
                />

                <h1>

                    Teknoloji
                    <br />
                    Bir Tık Uzağında

                </h1>

                <p>

                    Laptop, telefon, kulaklık,
                    akıllı saat ve daha fazlası.

                </p>

                <div className="features">

                    <span>✔ Güvenli Alışveriş</span>

                    <span>✔ Hızlı Teslimat</span>

                    <span>✔ Orijinal Ürün Garantisi</span>

                </div>

            </div>

            {/* SAĞ TARAF */}

            <div className="auth-right">

                <img
                    src={logo}
                    alt="TeknoHup"
                    className="brand-logo"
                />

                <h2>Hoş Geldiniz</h2>

                <p className="auth-subtitle">

                    Hesabınıza giriş yaparak alışverişe devam edin.

                </p>

                <form onSubmit={handleLogin}>

                    <div className="auth-input-group">

                        <input
                            className="auth-input"
                            type="email"
                            placeholder="E-posta"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                    </div>

                    <div className="auth-password">

                        <input
                            className="auth-input"
                            type={showPassword ? "text" : "password"}
                            placeholder="Şifre"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>

                    </div>

                    <div className="auth-forgot">

    <Link to="/forgot-password">
        Şifremi Unuttum
    </Link>

</div>

                    <button
                        type="submit"
                        className="auth-btn"
                    >
                        Giriş Yap
                    </button>

                    <div className="auth-link">

    <span>Henüz hesabın yok mu?</span>

    <Link to="/register">

        Hemen Kayıt Ol →

    </Link>

</div>

                </form>

            </div>

        </div>

    );

}

export default Login;