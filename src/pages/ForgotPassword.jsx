import { useState } from "react";

function ForgotPassword() {

    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await fetch(
                "http://localhost:5000/api/auth/forgot-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email
                    })
                }
            );

            const data = await res.json();

            alert(data.message);

        } catch (error) {

            console.log(error);

            alert("Sunucuya bağlanılamadı.");

        }

    };

    return (

        <div
            style={{
                maxWidth: "500px",
                margin: "60px auto"
            }}
        >

            <h1>Şifremi Unuttum</h1>

            <p>
                Hesabınıza kayıtlı e-posta adresinizi giriniz.
            </p>

            <form onSubmit={handleSubmit}>

                <input
                    type="email"
                    placeholder="E-posta"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "12px"
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
                    Doğrulama Kodu Gönder
                </button>

            </form>

        </div>

    );

}

export default ForgotPassword;