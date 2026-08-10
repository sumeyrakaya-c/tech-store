import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FiUser,
    FiMail,
    FiPhone,
    FiEdit2,
    FiSave,
    FiPackage,
    FiHeart,
    FiLogOut
} from "react-icons/fi";

import "../styles/Profile.css";


function Profile() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );


    // Kullanıcı giriş yapmamışsa login'e gönder
    if (!user) {

        navigate("/login");

        return null;

    }


    const [fullName, setFullName] = useState(
        user.fullName || ""
    );

    const [email, setEmail] = useState(
        user.email || ""
    );

    const [phone, setPhone] = useState(
        user.phone || ""
    );


    const [editing, setEditing] = useState(false);


    // Bilgileri kaydet
    const handleSave = () => {

        const updatedUser = {

            ...user,

            fullName: fullName,
            email: email,
            phone: phone

        };


        localStorage.setItem(
            "user",
            JSON.stringify(updatedUser)
        );


        setEditing(false);

        alert("Bilgileriniz güncellendi.");

    };


    // Çıkış
    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        navigate("/");

    };


    return (

        <div className="profile-page">


            <div className="profile-container">


                {/* =================================
                    SOL PROFİL MENÜSÜ
                ================================= */}

                <aside className="profile-sidebar">


                    <div className="profile-avatar">

                        <FiUser />

                    </div>


                    <h2>

                        {fullName || "Kullanıcı"}

                    </h2>


                    <p>

                        {email}

                    </p>


                    <div className="profile-menu">


                        <button
                            className="active"
                        >

                            <FiUser />

                            Profilim

                        </button>


                        <button
                            onClick={() =>
                                navigate("/my-orders")
                            }
                        >

                            <FiPackage />

                            Siparişlerim

                        </button>


                        <button
                            onClick={() =>
                                navigate("/favorites")
                            }
                        >

                            <FiHeart />

                            Favorilerim

                        </button>


                        <button
                            onClick={handleLogout}
                        >

                            <FiLogOut />

                            Çıkış Yap

                        </button>


                    </div>


                </aside>



                {/* =================================
                    SAĞ PROFİL ALANI
                ================================= */}

                <main className="profile-content">


                    <div className="profile-header">


                        <div>

                            <h1>

                                Profilim

                            </h1>


                            <p>

                                Hesap bilgilerinizi
                                görüntüleyebilir ve
                                düzenleyebilirsiniz.

                            </p>

                        </div>


                        {!editing && (

                            <button
                                className="edit-profile-btn"
                                onClick={() =>
                                    setEditing(true)
                                }
                            >

                                <FiEdit2 />

                                Düzenle

                            </button>

                        )}


                    </div>



                    {/* =================================
                        KİŞİSEL BİLGİLER
                    ================================= */}

                    <div className="profile-card">


                        <h3>

                            Kişisel Bilgiler

                        </h3>


                        {/* AD SOYAD */}

                        <div className="profile-field">

                            <label>

                                Ad Soyad

                            </label>


                            <div className="profile-input">

                                <FiUser />


                                <input
                                    type="text"
                                    value={fullName}
                                    disabled={!editing}
                                    onChange={(e) =>
                                        setFullName(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                        </div>



                        {/* E-POSTA */}

                        <div className="profile-field">

                            <label>

                                E-posta

                            </label>


                            <div className="profile-input">

                                <FiMail />


                                <input
                                    type="email"
                                    value={email}
                                    disabled={!editing}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                        </div>



                        {/* TELEFON */}

                        <div className="profile-field">

                            <label>

                                Telefon

                            </label>


                            <div className="profile-input">

                                <FiPhone />


                                <input
                                    type="text"
                                    value={phone}
                                    disabled={!editing}
                                    onChange={(e) =>
                                        setPhone(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                        </div>



                        {/* =================================
                            BUTONLAR
                        ================================= */}

                        {editing && (

                            <div className="profile-actions">


                                <button
                                    className="cancel-btn"
                                    onClick={() => {

                                        setFullName(
                                            user.fullName || ""
                                        );

                                        setEmail(
                                            user.email || ""
                                        );

                                        setPhone(
                                            user.phone || ""
                                        );

                                        setEditing(false);

                                    }}
                                >

                                    Vazgeç

                                </button>


                                <button
                                    className="save-profile-btn"
                                    onClick={handleSave}
                                >

                                    <FiSave />

                                    Kaydet

                                </button>


                            </div>

                        )}


                    </div>


                </main>


            </div>


        </div>

    );

}


export default Profile;