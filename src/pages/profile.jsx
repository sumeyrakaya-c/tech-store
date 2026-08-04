import { useEffect, useState } from "react";

function Profile() {

    const [profile, setProfile] = useState(null);

    useEffect(() => {

        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {

            window.location.href = "/login";
            return;

        }

        fetch(`http://localhost:5000/api/users/${user.id}`)
            .then(res => res.json())
            .then(data => setProfile(data))
            .catch(err => console.log(err));

    }, []);

    if (!profile) {
        return <h2 style={{ textAlign: "center" }}>Yükleniyor...</h2>;
    }

    return (

        <div
            style={{
                maxWidth: "700px",
                margin: "40px auto",
                padding: "20px"
            }}
        >

            <h1>Profilim</h1>

            <div style={{ marginTop: "30px" }}>

                <p><strong>Ad Soyad:</strong> {profile.full_name}</p>

                <p><strong>E-posta:</strong> {profile.email}</p>

                <p><strong>Telefon:</strong> {profile.phone || "-"}</p>

                <p><strong>İl:</strong> {profile.city || "-"}</p>

                <p><strong>İlçe:</strong> {profile.district || "-"}</p>

                <p><strong>Adres:</strong></p>

                <div
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "15px",
                        background: "#fafafa"
                    }}
                >
                    {profile.address || "Adres eklenmemiş."}
                </div>

            </div>

        </div>

    );

}

export default Profile;