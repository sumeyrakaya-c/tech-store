import "../styles/auth.css";

import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";

import logo from "../assets/logo.png";
import devices from "../assets/devices.png";

function Register() {

    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleRegister = async (e) => {

        e.preventDefault();


        if (!fullName || !email || !password) {

            alert("Lütfen zorunlu alanları doldurun.");

            return;
        }


        if (password.length < 6) {

            alert("Şifre en az 6 karakter olmalıdır.");

            return;
        }


        setLoading(true);


        try {

            const res = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        fullName,
                        email,
                        phone,
                        password
                    })
                }
            );


            const data = await res.json();


            console.log("Kayıt sonucu:", data);


            if (!res.ok) {

                alert(
                    data.message ||
                    "Kayıt sırasında bir hata oluştu."
                );

                return;
            }


            alert(
                data.message ||
                "Doğrulama kodu e-posta adresinize gönderildi."
            );


            navigate("/verify-email", {

                state: {
                    email: email
                }

            });


        } catch (error) {

            console.log("KAYIT HATASI:", error);

            alert(
                "Sunucuya bağlanırken hata oluştu."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="auth-page">


            {/* =====================================
                SOL TARAF
            ===================================== */}

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

                    <span>
                        ✔ Güvenli Alışveriş
                    </span>

                    <span>
                        ✔ Hızlı Teslimat
                    </span>

                    <span>
                        ✔ Orijinal Ürün Garantisi
                    </span>

                </div>


            </div>



            {/* =====================================
                SAĞ TARAF
            ===================================== */}

            <div className="auth-right">


                <img
                    src={logo}
                    alt="TeknoHup"
                    className="brand-logo"
                />


                <h2>
                    Hesap Oluştur
                </h2>


                <p className="auth-subtitle">

                    TeknoHup'a katılın ve
                    alışverişe başlayın.

                </p>



                <form onSubmit={handleRegister}>


                    {/* AD SOYAD */}

                    <div className="auth-input-group">

                        <input
                            className="auth-input"
                            type="text"
                            placeholder="Ad Soyad"
                            value={fullName}
                            onChange={(e) =>
                                setFullName(e.target.value)
                            }
                        />

                    </div>



                    {/* E-POSTA */}

                    <div className="auth-input-group">

                        <input
                            className="auth-input"
                            type="email"
                            placeholder="E-posta"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />

                    </div>



                    {/* TELEFON */}

                    <div className="auth-input-group">

                        <input
                            className="auth-input"
                            type="text"
                            placeholder="Telefon"
                            value={phone}
                            onChange={(e) =>
                                setPhone(e.target.value)
                            }
                        />

                    </div>



                    {/* ŞİFRE */}

                    <div className="auth-password">

                        <input
                            className="auth-input"
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Şifre"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />


                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                        >

                            {showPassword
                                ? <FiEyeOff />
                                : <FiEye />
                            }

                        </button>

                    </div>



                    {/* KAYIT OL */}

                    <button
                        type="submit"
                        className="auth-btn"
                        disabled={loading}
                    >

                        {loading
                            ? "Kayıt oluşturuluyor..."
                            : "Kayıt Ol"
                        }

                    </button>



                    {/* GİRİŞ */}

                    <div className="auth-link">

                        <span>
                            Zaten hesabın var mı?
                        </span>


                        <Link to="/login">

                            Giriş Yap →

                        </Link>

                    </div>


                </form>


            </div>


        </div>

    );

}


export default Register;