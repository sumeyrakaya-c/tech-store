import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate, useLocation, Link } from "react-router-dom";

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

                // Geldiği sayfaya geri dön
                const from = location.state?.from || "/";

                navigate(from, { replace: true });

            }

        } catch (error) {

            console.log(error);

            alert("Sunucuya bağlanırken hata oluştu.");

        }

    };

    return (

        <div
            style={{
                maxWidth: "500px",
                margin: "50px auto"
            }}
        >

            <h1>Giriş Yap</h1>

            <form onSubmit={handleLogin}>

                <input
                    type="email"
                    placeholder="E-posta"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px"
                    }}
                />

                <br /><br />

                <div
    style={{
        position: "relative"
    }}
>

    <input
        type={showPassword ? "text" : "password"}
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
            width: "100%",
            padding: "10px 45px 10px 10px",
            boxSizing: "border-box"
        }}
    />

    <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: "20px",
            color: "#666"
        }}
    >
        {showPassword ? <FiEyeOff /> : <FiEye />}
    </button>

</div>

<div
    style={{
        textAlign: "right",
        marginTop: "10px"
    }}
>

    <Link
        to="/forgot-password"
        style={{
            textDecoration: "none",
            fontSize: "14px",
            color: "#0A84FF"
        }}
    >
        Şifremi Unuttum?
    </Link>

</div>

<br />
                

                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "12px",
                        cursor: "pointer"
                    }}
                >
                    Giriş Yap
                </button>

                <br /><br />

                <div
    style={{
        textAlign: "center",
        marginTop: "20px"
    }}
>

    Hesabın yok mu?{" "}

    <Link
        to="/register"
        style={{
            color: "#0A84FF",
            textDecoration: "none",
            fontWeight: "600"
        }}
    >
        Kayıt Ol
    </Link>

</div>

            </form>

        </div>

    );

}

export default Login;