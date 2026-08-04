import { useState } from "react";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        console.log("Butona basıldı");

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

            console.log("Status:", res.status);

            const data = await res.json();

            console.log(data);

            alert(data.message);

            if (res.ok) {

                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                // İstersen girişten sonra ana sayfaya yönlendirebiliriz.
                // window.location.href = "/";

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

                <input
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px"
                    }}
                />

                <br /><br />

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

            </form>

        </div>

    );

}

export default Login;