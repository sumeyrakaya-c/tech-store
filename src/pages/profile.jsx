import { useEffect, useState } from "react";

import {
    FiUser,
    FiMapPin,
    FiEdit2,
    FiPackage,
    FiMessageSquare,
    FiSettings
} from "react-icons/fi";

import "../styles/profile.css";


function Profile() {

    const [profile, setProfile] = useState(null);

    const [activeMenu, setActiveMenu] = useState("profile");

    const [reviews, setReviews] = useState([]);

    const [reviewsLoading, setReviewsLoading] = useState(false);

    const [orderReviews, setOrderReviews] = useState([]);

    const [orderReviewsLoading, setOrderReviewsLoading] = useState(false);

    const [showPasswordModal, setShowPasswordModal] = useState(false);

const [passwordStep, setPasswordStep] = useState(1);

const [passwordCode, setPasswordCode] = useState("");

const [newPassword, setNewPassword] = useState("");

const [passwordLoading, setPasswordLoading] = useState(false);

const [showEmailModal, setShowEmailModal] = useState(false);

const [emailStep, setEmailStep] = useState(1);

const [currentPasswordEmail, setCurrentPasswordEmail] = useState("");

const [newEmail, setNewEmail] = useState("");

const [emailCode, setEmailCode] = useState("");

const [emailLoading, setEmailLoading] = useState(false);

const [orders, setOrders] = useState([]);

const [ordersLoading, setOrdersLoading] = useState(false);

const [returns, setReturns] = useState([]);
const [returningOrder, setReturningOrder] = useState(null);
const [returnReason, setReturnReason] = useState("");
const [returnLoading, setReturnLoading] = useState(false);

    const loadOrderReviews = () => {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    if (!user) {

        window.location.href = "/login";

        return;

    }

    setOrderReviewsLoading(true);

    fetch(
        `http://localhost:5000/api/reviews/user-orders/${user.id}`
    )
        .then(res => res.json())
        .then(data => {

            setOrderReviews(data);

            setOrderReviewsLoading(false);

        })
        .catch(err => {

            console.log(err);

            setOrderReviewsLoading(false);

        });

};

const loadOrders = async () => {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    if (!user) {

        window.location.href = "/login";

        return;

    }

    setOrdersLoading(true);

    try {

        const res = await fetch(
            `http://localhost:5000/api/orders/user/${user.id}`
        );

        const data = await res.json();

        if (!res.ok) {

            alert(
                data.message ||
                "Siparişler getirilemedi."
            );

            return;

        }

        setOrders(data);

    } catch (error) {

        console.log(
            "SİPARİŞLER HATASI:",
            error
        );

    } finally {

        setOrdersLoading(false);

    }

};

// =========================================
// KULLANICININ İADELERİNİ GETİR
// =========================================

const loadReturns = async () => {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    if (!user) {
        return;
    }

    try {

        const res = await fetch(
            `http://localhost:5000/api/returns/user/${user.id}`
        );

        const data = await res.json();

        if (!res.ok) {

            console.log(
                data.message || "İadeler getirilemedi."
            );

            return;
        }

        setReturns(data);

    } catch (error) {

        console.log(
            "İADELERİ GETİRME HATASI:",
            error
        );

    }

};

// =========================================
// İADE FORMUNU AÇ
// =========================================

const openReturnForm = (order) => {

    setReturningOrder(order);

    setReturnReason("");

};

// =========================================
// İADE TALEBİ OLUŞTUR
// =========================================

const createReturnRequest = async () => {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    if (!user) {

        alert(
            "İade talebi oluşturmak için giriş yapmalısınız."
        );

        return;

    }

    if (!returningOrder) {
        return;
    }

    if (!returnReason.trim()) {

        alert(
            "Lütfen iade nedeninizi yazın."
        );

        return;

    }

    try {

        setReturnLoading(true);

        const response = await fetch(
            "http://localhost:5000/api/returns",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    order_id: returningOrder.id,

                    user_id: user.id,

                    order_item_id: null,

                    reason: returnReason.trim(),

                    description: ""

                })
            }
        );

        const data = await response.json();

        console.log(
            "İADE CEVABI:",
            data
        );

        if (!response.ok) {

            alert(
                data.message ||
                "İade talebi oluşturulamadı."
            );

            return;

        }

        alert(
            data.message ||
            "İade talebiniz başarıyla oluşturuldu."
        );

        setReturningOrder(null);

        setReturnReason("");

        await loadReturns();

    } catch (error) {

        console.error(
            "İADE TALEBİ HATASI:",
            error
        );

        alert(
            "İade talebi oluşturulurken bir hata oluştu."
        );

    } finally {

        setReturnLoading(false);

    }

};

const [isEditing, setIsEditing] = useState(false);

const [editForm, setEditForm] = useState({
    fullName: "",
    phone: "",
    city: "",
    district: "",
    address: ""
});

const [savingProfile, setSavingProfile] = useState(false);


    useEffect(() => {

        const user = JSON.parse(
            localStorage.getItem("user")
        );


        if (!user) {

            window.location.href = "/login";

            return;

        }


        fetch(
            `http://localhost:5000/api/users/${user.id}`
        )
            .then(res => res.json())
            .then(data => {

                setProfile(data);

            })
            .catch(err => {

                console.log(err);

            });

                loadReturns();

    }, []);

    const loadReviews = () => {

        const user = JSON.parse(
            localStorage.getItem("user")
        );


        if (!user) {

            window.location.href = "/login";

            return;

        }


        setReviewsLoading(true);


        fetch(
            `http://localhost:5000/api/reviews/user/${user.id}`
        )
            .then(res => res.json())
            .then(data => {

                setReviews(data);

                setReviewsLoading(false);

            })
            .catch(err => {

                console.log(err);

                setReviewsLoading(false);

            });

    };

    const handleEditProfile = () => {


    setEditForm({

        fullName: profile.full_name || "",
        phone: profile.phone || "",
        city: profile.city || "",
        district: profile.district || "",
        address: profile.address || ""

    });

    setIsEditing(true);

};



const handleSaveProfile = async () => {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    if (!user) {

        window.location.href = "/login";

        return;

    }

    setSavingProfile(true);

    try {

        const res = await fetch(
            `http://localhost:5000/api/users/${user.id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(editForm)
            }
        );

        const data = await res.json();

        if (!res.ok) {

            alert(
                data.message ||
                "Profil güncellenemedi."
            );

            return;

        }

        // Güncel bilgileri ekranda hemen göster
        setProfile({
            ...profile,
            full_name: editForm.fullName,
            phone: editForm.phone,
            city: editForm.city,
            district: editForm.district,
            address: editForm.address
        });

        setIsEditing(false);

        alert("Profil bilgileriniz güncellendi.");

    } catch (error) {

        console.log(error);

        alert(
            "Sunucuya bağlanırken hata oluştu."
        );

    } finally {

        setSavingProfile(false);

    }

};

   const handleEditChange = (e) => {

    const { name, value } = e.target;

    setEditForm({
        ...editForm,
        [name]: value
    });

};

const handleMenuClick = (menu) => {

    setActiveMenu(menu);

    if (menu === "reviews") {

        loadReviews();

    }

    if (menu === "order-reviews") {

        loadOrderReviews();

    }

if (menu === "orders") {

    loadOrders();

    loadReturns();

}

};

   const startPasswordChange = async () => {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    if (!user) {

        window.location.href = "/login";

        return;

    }

    setPasswordLoading(true);

    try {

        const res = await fetch(
            "http://localhost:5000/api/auth/send-change-password-code",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    userId: user.id
                })
            }
        );

        const data = await res.json();

        if (!res.ok) {

            alert(
                data.message ||
                "Doğrulama kodu gönderilemedi."
            );

            return;

        }

        setPasswordStep(2);

        setShowPasswordModal(true);

    } catch (error) {

        console.log(error);

        alert(
            "Sunucuya bağlanırken hata oluştu."
        );

    } finally {

        setPasswordLoading(false);

    }

};

const handleChangePassword = async () => {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    if (!user) {

        window.location.href = "/login";

        return;

    }


    if (passwordCode.length !== 6) {

        alert("6 haneli doğrulama kodunu giriniz.");

        return;

    }


    if (newPassword.length < 6) {

        alert("Şifre en az 6 karakter olmalıdır.");

        return;

    }


    setPasswordLoading(true);


    try {

        const res = await fetch(
            "http://localhost:5000/api/auth/change-password",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    userId: user.id,

                    code: passwordCode,

                    newPassword: newPassword

                })
            }
        );


        const data = await res.json();


        if (!res.ok) {

            alert(
                data.message ||
                "Şifre değiştirilemedi."
            );

            return;

        }


        alert(
            "Şifreniz başarıyla değiştirildi."
        );


        setShowPasswordModal(false);

        setPasswordStep(1);

        setPasswordCode("");

        setNewPassword("");


    } catch (error) {

        console.log(
            "ŞİFRE DEĞİŞTİRME HATASI:",
            error
        );

        alert(
            "Sunucuya bağlanırken hata oluştu."
        );

    } finally {

        setPasswordLoading(false);

    }

};

const handleVerifyEmailChange = async () => {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    if (!user) {

        window.location.href = "/login";

        return;

    }

    if (emailCode.length !== 6) {

        alert(
            "6 haneli doğrulama kodunu giriniz."
        );

        return;

    }

    setEmailLoading(true);

    try {

        const res = await fetch(
            "http://localhost:5000/api/auth/verify-email-change",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    userId: user.id,

                    newEmail: newEmail,

                    code: emailCode

                })
            }
        );

        const data = await res.json();

        if (!res.ok) {

            alert(
                data.message ||
                "E-posta değiştirilemedi."
            );

            return;

        }

        // Profil ekranındaki maili hemen güncelle
        setProfile({
            ...profile,
            email: data.email
        });

        // LocalStorage'daki kullanıcı bilgisini de güncelle
        const updatedUser = {
            ...user,
            email: data.email
        };

        localStorage.setItem(
            "user",
            JSON.stringify(updatedUser)
        );

        alert(
            "E-posta adresiniz başarıyla değiştirildi."
        );

        setShowEmailModal(false);

        setEmailStep(1);

        setCurrentPasswordEmail("");

        setNewEmail("");

        setEmailCode("");

    } catch (error) {

        console.log(
            "E-POSTA DOĞRULAMA HATASI:",
            error
        );

        alert(
            "Sunucuya bağlanırken hata oluştu."
        );

    } finally {

        setEmailLoading(false);

    }

};

const startEmailChange = async () => {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    if (!user) {

        window.location.href = "/login";

        return;

    }

    if (!currentPasswordEmail) {

        alert("Mevcut şifrenizi giriniz.");

        return;

    }

    if (!newEmail) {

        alert("Yeni e-posta adresinizi giriniz.");

        return;

    }

    setEmailLoading(true);

    try {

        const res = await fetch(
            "http://localhost:5000/api/auth/start-email-change",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    userId: user.id,

                    currentPassword:
                        currentPasswordEmail,

                    newEmail: newEmail

                })
            }
        );

        const data = await res.json();

        if (!res.ok) {

            alert(
                data.message ||
                "E-posta değiştirme işlemi başlatılamadı."
            );

            return;

        }

        alert(
            "Doğrulama kodu yeni e-posta adresinize gönderildi."
        );

        setEmailStep(2);

    } catch (error) {

        console.log(
            "E-POSTA DEĞİŞTİRME HATASI:",
            error
        );

        alert(
            "Sunucuya bağlanırken hata oluştu."
        );

    } finally {

        setEmailLoading(false);

    }

};

    const deleteReview = async (reviewId) => {

        const confirmDelete = window.confirm(
            "Bu yorumu silmek istediğinize emin misiniz?"
        );


        if (!confirmDelete) {

            return;

        }


        try {

            const res = await fetch(
                `http://localhost:5000/api/reviews/${reviewId}`,
                {
                    method: "DELETE"
                }
            );


            const data = await res.json();


            if (!res.ok) {

                alert(
                    data.message ||
                    "Yorum silinemedi."
                );

                return;

            }


            setReviews(
                reviews.filter(
                    review => review.id !== reviewId
                )
            );


            alert("Yorum silindi.");

        } catch (error) {

            console.log(error);

            alert(
                "Sunucuya bağlanırken hata oluştu."
            );

        }

    };


    if (!profile) {

        return (

            <div className="profile-loading">

                <div className="profile-spinner"></div>

                <p>
                    Profil bilgileri yükleniyor...
                </p>

            </div>

            

        );

    }



    return (

        <div className="profile-page">

            <div className="profile-container">


                {/* =====================================
                    SOL MENÜ
                ===================================== */}

                <aside className="profile-sidebar">


                    <div className="profile-avatar">

                        <FiUser />

                    </div>


                    <h2>
                        {profile.full_name}
                    </h2>


                    <p className="profile-email">

                        {profile.email}

                    </p>


                    <div className="profile-menu">


                        <button
                            className={
                                activeMenu === "profile"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                handleMenuClick("profile")
                            }
                        >

                            <FiUser />

                            Profilim

                        </button>


<button
    className={
        activeMenu === "orders"
            ? "active"
            : ""
    }
    onClick={() =>
        handleMenuClick("orders")
    }
>
    <FiPackage />

    Siparişlerim

</button>

                        <button
                            className={
                                activeMenu === "reviews"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                handleMenuClick("reviews")
                            }
                        >

                            <FiMessageSquare />

                            Ürün Yorumlarım

                        </button>

                        <button
    className={
        activeMenu === "order-reviews"
            ? "active"
            : ""
    }
    onClick={() =>
        handleMenuClick("order-reviews")
    }
>

    <FiPackage />

    Sipariş Yorumlarım

</button>

<button
    className={
        activeMenu === "settings"
            ? "active"
            : ""
    }
    onClick={() =>
        handleMenuClick("settings")
    }
>

    <FiSettings />

    Hesap Ayarları

</button>


                    </div>

                </aside>



                {/* =====================================
                    SAĞ TARAF
                ===================================== */}

                <main className="profile-content">


                    {/* =====================================
                        PROFİL
                    ===================================== */}

                    {activeMenu === "orders" && (

    <div>

        <div className="profile-header">

            <div>

                <span className="profile-label">
                    HESABIM
                </span>

                <h1>
                    Siparişlerim
                </h1>

                <p>
                    Verdiğiniz siparişleri buradan
                    takip edebilirsiniz.
                </p>

            </div>

        </div>


        {ordersLoading ? (

            <div className="profile-loading">

                <div className="profile-spinner"></div>

                <p>
                    Siparişleriniz yükleniyor...
                </p>

            </div>

        ) : orders.length === 0 ? (

            <section className="profile-card">

                <div className="empty-profile">

                    <FiPackage />

                    <h3>
                        Henüz siparişiniz yok
                    </h3>

                    <p>
                        Verdiğiniz siparişler burada
                        görüntülenecek.
                    </p>

                </div>

            </section>

        ) : (

            <div className="orders-list">

                {orders.map((order) => (

                    <section
                        className="order-card"
                        key={order.id}
                    >

                        <div className="order-card-header">

                            <div>

                                <span>
                                    Sipariş No
                                </span>

                                <strong>
                                    #{order.id}
                                </strong>

                            </div>

                            <span className="order-status">
                                {order.status || "Hazırlanıyor"}
                            </span>

                        </div>


                        <div className="order-card-info">

                            <div>

                                <span>
                                    Tarih
                                </span>

                                <strong>
                                    {order.created_at
                                        ? new Date(
                                            order.created_at
                                        ).toLocaleDateString("tr-TR")
                                        : "-"}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Toplam
                                </span>

                                <strong>
                                    {Number(
                                        order.total_price || 0
                                    ).toLocaleString(
                                        "tr-TR",
                                        {
                                            minimumFractionDigits: 2
                                        }
                                    )} ₺
                                </strong>

                            </div>

                        </div>


                        <div className="order-card-address">

                            <span>
                                Teslimat Adresi
                            </span>

                            <p>
                                {order.city || "-"}
                                {" / "}
                                {order.district || "-"}
                            </p>

                        </div>

                        {/* =========================================
    İADE TALEBİ
========================================= */}

<div
    style={{
        marginTop: "20px",
        paddingTop: "15px",
        borderTop: "1px solid #e5e7eb"
    }}
>

    {(() => {

        const orderReturn = returns.find(
            item =>
                Number(item.order_id) ===
                Number(order.id)
        );

        if (orderReturn) {

            return (

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px"
                    }}
                >

                    <span
                        style={{
                            fontWeight: "600",
                            color: "#555"
                        }}
                    >
                        İade Talebi:
                    </span>

                    <span
                        style={{
                            padding: "8px 14px",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            background: "#f8f8f8"
                        }}
                    >
                        {orderReturn.status}
                    </span>

                </div>

            );

        }

        return (

            <>

                <button
                    type="button"
                    onClick={() =>
                        openReturnForm(order)
                    }
                    style={{
                        padding: "10px 18px",
                        border: "none",
                        borderRadius: "8px",
                        background: "#dc2626",
                        color: "#fff",
                        fontWeight: "600",
                        cursor: "pointer"
                    }}
                >
                    ↩ İade Talebi
                </button>


                {/* =========================
                    İADE FORMU
                ========================= */}

                {returningOrder?.id === order.id && (

                    <div
                        style={{
                            marginTop: "15px",
                            padding: "20px",
                            borderRadius: "12px",
                            background: "#f8fafc",
                            border: "1px solid #e2e8f0"
                        }}
                    >

                        <h3>
                            İade Talebi Oluştur
                        </h3>


                        <label
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                fontWeight: "600"
                            }}
                        >
                            İade Nedeni
                        </label>


                        <select
                            value={returnReason}
                            onChange={(e) =>
                                setReturnReason(
                                    e.target.value
                                )
                            }
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "8px",
                                border: "1px solid #cbd5e1",
                                marginBottom: "15px"
                            }}
                        >

                            <option value="">
                                İade nedeni seçin
                            </option>

                            <option value="Ürün beklentimi karşılamadı">
                                Ürün beklentimi karşılamadı
                            </option>

                            <option value="Yanlış ürün gönderildi">
                                Yanlış ürün gönderildi
                            </option>

                            <option value="Ürün hasarlı geldi">
                                Ürün hasarlı geldi
                            </option>

                            <option value="Ürün arızalı">
                                Ürün arızalı
                            </option>

                            <option value="Farklı ürün istiyorum">
                                Farklı ürün istiyorum
                            </option>

                            <option value="Diğer">
                                Diğer
                            </option>

                        </select>


                        <div
                            style={{
                                display: "flex",
                                gap: "10px"
                            }}
                        >

                            <button
                                type="button"
                                onClick={createReturnRequest}
                                disabled={returnLoading}
                                style={{
                                    padding: "10px 18px",
                                    border: "none",
                                    borderRadius: "8px",
                                    background: "#2563eb",
                                    color: "#fff",
                                    cursor: returnLoading
                                        ? "not-allowed"
                                        : "pointer"
                                }}
                            >
                                {returnLoading
                                    ? "Gönderiliyor..."
                                    : "İade Talebi Gönder"}
                            </button>


                            <button
                                type="button"
                                onClick={() => {
                                    setReturningOrder(null);
                                    setReturnReason("");
                                }}
                                style={{
                                    padding: "10px 18px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    background: "#fff",
                                    color: "#374151",
                                    cursor: "pointer"
                                }}
                            >
                                Vazgeç
                            </button>

                        </div>

                    </div>

                )}

            </>

        );

    })()}

</div>

                    </section>

                ))}

            </div>

        )}

    </div>

)}

                    {activeMenu === "profile" && (

                        <>

                            <div className="profile-header">


                                <div>

                                    <span className="profile-label">

                                        HESABIM

                                    </span>


                                    <h1>

                                        Profilim

                                    </h1>


                                    <p>

                                        Kişisel bilgilerinizi ve
                                        teslimat adresinizi görüntüleyin.

                                    </p>

                                </div>


                                <button
    className="edit-profile-btn"
    type="button"
    onClick={handleEditProfile}
>
    <FiEdit2 />
    Düzenle
</button>


                            </div>



                            {/* =====================================
                                KİŞİSEL BİLGİLER
                            ===================================== */}

                            <section className="profile-card">


                                <div className="profile-card-title">


                                    <div className="card-icon">

                                        <FiUser />

                                    </div>


                                    <div>

                                        <h3>

                                            Kişisel Bilgiler

                                        </h3>


                                        <p>

                                            Hesabınıza ait temel bilgiler

                                        </p>

                                    </div>


                                </div>



                                <div className="profile-grid">


                                    <div className="profile-info">

                                        <span>
                                            Ad Soyad
                                        </span>

                                        {isEditing ? (

    <input
        className="profile-edit-input"
        type="text"
        name="fullName"
        value={editForm.fullName}
        onChange={handleEditChange}
    />

) : (

    <strong>
        {profile.full_name || "-"}
    </strong>

)}

                                    </div>


                                    <div className="profile-info">

                                        <span>
                                            E-posta
                                        </span>

                                        <strong>
                                            {profile.email || "-"}
                                        </strong>

                                    </div>


                                    <div className="profile-info">

                                        <span>
                                            Telefon
                                        </span>

                                        {isEditing ? (

    <input
        className="profile-edit-input"
        type="text"
        name="phone"
        value={editForm.phone}
        onChange={handleEditChange}
        placeholder="Telefon numaranız"
    />

) : (

    <strong>
        {profile.phone || "-"}
    </strong>

)}

                                    </div>


                                </div>

                            </section>



                            {/* =====================================
                                TESLİMAT ADRESİ
                            ===================================== */}

                            <section className="profile-card">


                                <div className="profile-card-title">


                                    <div className="card-icon">

                                        <FiMapPin />

                                    </div>


                                    <div>

                                        <h3>

                                            Teslimat Adresi

                                        </h3>


                                        <p>

                                            Siparişleriniz için kayıtlı adres

                                        </p>

                                    </div>


                                </div>



                                <div className="address-grid">


                                    <div className="profile-info">

                                        <span>
                                            İl
                                        </span>

                                        {isEditing ? (

    <input
        className="profile-edit-input"
        type="text"
        name="city"
        value={editForm.city}
        onChange={handleEditChange}
        placeholder="İl"
    />

) : (

    <strong>
        {profile.city || "-"}
    </strong>

)}

                                    </div>


                                    <div className="profile-info">

                                        <span>
                                            İlçe
                                        </span>

                                        {isEditing ? (

    <input
        className="profile-edit-input"
        type="text"
        name="district"
        value={editForm.district}
        onChange={handleEditChange}
        placeholder="İlçe"
    />

) : (

    <strong>
        {profile.district || "-"}
    </strong>

)}

                                    </div>


                                </div>



                                <div className="address-box">


                                    <span>
                                        Açık Adres
                                    </span>


                                    {isEditing ? (

    <textarea
        className="profile-edit-textarea"
        name="address"
        value={editForm.address}
        onChange={handleEditChange}
        placeholder="Açık adresinizi yazın"
        rows="4"
    />

) : (

    <p>
        {profile.address ||
            "Henüz adres eklenmemiş."}
    </p>

)}


{isEditing && (

    <div className="profile-edit-actions">

        <button
            type="button"
            className="profile-cancel-btn"
            onClick={() => setIsEditing(false)}
        >
            Vazgeç
        </button>

        <button
            type="button"
            className="profile-save-btn"
            onClick={handleSaveProfile}
            disabled={savingProfile}
        >

            {savingProfile
                ? "Kaydediliyor..."
                : "Değişiklikleri Kaydet"}

        </button>

    </div>

)}


                                </div>


                            </section>

                        </>

                    )}



                    {/* =====================================
                        ÜRÜN YORUMLARIM
                    ===================================== */}

                    {activeMenu === "reviews" && (

                        <div className="product-reviews">


                            <div className="reviews-page-header">

                                <div>

                                    <span className="profile-label">

                                        AKTİVİTELERİM

                                    </span>


                                    <h1>

                                        Ürün Yorumlarım

                                    </h1>


                                    <p>

                                        Satın aldığınız ürünler için
                                        yaptığınız yorumlar.

                                    </p>

                                </div>


                                <div className="reviews-count">

                                    <FiMessageSquare />

                                    {reviews.length} Yorum

                                </div>

                            </div>



                            {reviewsLoading ? (

                                <div className="reviews-loading">

                                    Yorumlarınız yükleniyor...

                                </div>

                            ) : reviews.length === 0 ? (

                                <div className="empty-reviews">

                                    <div className="empty-reviews-icon">

                                        <FiMessageSquare />

                                    </div>


                                    <h2>

                                        Henüz yorumunuz yok

                                    </h2>


                                    <p>

                                        Teslim edilen siparişlerinizdeki
                                        ürünleri değerlendirebilirsiniz.

                                    </p>

                                </div>

                            ) : (

                                <div className="reviews-list">

                                    {reviews.map((review) => (

                                        <div
                                            className="my-review-card"
                                            key={review.id}
                                        >


                                            <div className="review-product">


                                                <img
                                                    src={
                                                        review.product_image
                                                            ? `http://localhost:5000/uploads/${review.product_image}`
                                                            : "/placeholder.png"
                                                    }
                                                    alt={review.product_name}
                                                />


                                                <div>

                                                    <h3>

                                                        {review.product_name}

                                                    </h3>


                                                    <div className="review-stars">

                                                        {[1, 2, 3, 4, 5].map(
                                                            (star) => (

                                                                <span
                                                                    key={star}
                                                                    className={
                                                                        star <= review.rating
                                                                            ? "star-filled"
                                                                            : ""
                                                                    }
                                                                >

                                                                    ★

                                                                </span>

                                                            )
                                                        )}

                                                    </div>

                                                </div>

                                            </div>



                                            <div className="my-review-content">

                                                <p>

                                                    {review.comment ||
                                                        "Yorum yazılmamış."}

                                                </p>


                                                <span>

                                                    {new Date(
                                                        review.created_at
                                                    ).toLocaleDateString(
                                                        "tr-TR"
                                                    )}

                                                </span>

                                            </div>



                                            <button
                                                className="delete-review-btn"
                                                onClick={() =>
                                                    deleteReview(review.id)
                                                }
                                            >

                                                Sil

                                            </button>


                                        </div>

                                    ))}

                                </div>

                            )}

                        </div>

                    )}

{activeMenu === "order-reviews" && (

    <div className="order-reviews">


        <div className="reviews-page-header">

            <div>

                <span className="profile-label">

                    SİPARİŞLERİM

                </span>

                <h1>

                    Sipariş Yorumlarım

                </h1>

                <p>

                    Teslim edilen siparişlerinizdeki
                    ürünleri değerlendirin.

                </p>

            </div>


            <div className="reviews-count">

                <FiPackage />

                {orderReviews.length} Ürün

            </div>

        </div>



        {orderReviewsLoading ? (

            <div className="reviews-loading">

                Siparişleriniz yükleniyor...

            </div>

        ) : orderReviews.length === 0 ? (

            <div className="empty-reviews">

                <div className="empty-reviews-icon">

                    <FiPackage />

                </div>


                <h2>

                    Henüz değerlendirilecek ürün yok

                </h2>


                <p>

                    Teslim edilmiş siparişleriniz
                    burada görünecek.

                </p>

            </div>

        ) : (

            <div className="reviews-list">

                {orderReviews.map((item) => (

                    <div
                        className="my-review-card"
                        key={`${item.order_id}-${item.product_id}`}
                    >


                        <div className="review-product">


                            <img
                                src={
                                    item.product_image
                                        ? `http://localhost:5000/uploads/${item.product_image}`
                                        : "/placeholder.png"
                                }
                                alt={item.product_name}
                            />


                            <div>

                                <h3>

                                    {item.product_name}

                                </h3>


                                <span
                                    style={{
                                        color: "#64748b",
                                        fontSize: "12px"
                                    }}
                                >

                                    Sipariş #{item.order_id}

                                </span>

                            </div>

                        </div>



                        {item.review_id ? (

                            <div className="my-review-content">

                                <div className="review-stars">

                                    {[1, 2, 3, 4, 5].map(
                                        star => (

                                            <span
                                                key={star}
                                                className={
                                                    star <= item.rating
                                                        ? "star-filled"
                                                        : ""
                                                }
                                            >

                                                ★

                                            </span>

                                        )
                                    )}

                                </div>


                                <p>

                                    {item.comment ||
                                        "Yorumunuz var."}

                                </p>

                            </div>

                        ) : (

                            <button
                                className="edit-profile-btn"
                                type="button"
                                onClick={() => {

                                    alert(
                                        "Ürün değerlendirme ekranını bir sonraki adımda ekleyeceğiz."
                                    );

                                }}
                            >

                                <FiMessageSquare />

                                Ürünü Değerlendir

                            </button>

                        )}

                    </div>

                ))}

            </div>

        )}

    </div>

)}

  {activeMenu === "settings" && (

    <div className="profile-settings">

        <div className="reviews-page-header">

            <div>

                <span className="profile-label">
                    HESAP
                </span>

                <h1>
                    Hesap Ayarları
                </h1>

                <p>
                    Hesabınızın güvenlik ve iletişim
                    bilgilerini yönetin.
                </p>

            </div>

        </div>


        <section className="profile-card">

            <div className="profile-card-title">

                <div className="card-icon">

                    <FiSettings />

                </div>

                <div>

                    <h3>
                        Hesap Güvenliği
                    </h3>

                    <p>
                        Şifre ve e-posta bilgilerinizi yönetin.
                    </p>

                </div>

            </div>


            <div className="profile-setting-item">

                <div>

                    <strong>
                        E-posta
                    </strong>

                    <span>
                        {profile.email}
                    </span>

                </div>


<button
    type="button"
    className="edit-profile-btn"
    onClick={() => {

        setEmailStep(1);

        setCurrentPasswordEmail("");

        setNewEmail("");

        setEmailCode("");

        setShowEmailModal(true);

    }}
>
    Değiştir
</button>

            </div>


            <div className="profile-setting-item">

                <div>

                    <strong>
                        Şifre
                    </strong>

                    <span>
                        ••••••••••••
                    </span>

                </div>


                <button
    type="button"
    className="edit-profile-btn"
    onClick={startPasswordChange}
    disabled={passwordLoading}
>
    {passwordLoading
        ? "Gönderiliyor..."
        : "Değiştir"}
</button>

            </div>

        </section>

    </div>

)}

                </main>


            </div>
          {showPasswordModal && (

    <div className="password-modal-overlay">

        <div className="password-modal">

            <button
                type="button"
                className="password-modal-close"
                onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordStep(1);
                    setPasswordCode("");
                    setNewPassword("");
                }}
            >
                ×
            </button>


            {passwordStep === 2 && (

                <>

                    <div className="password-modal-icon">
                        🔐
                    </div>

                    <h2>
                        E-posta Doğrulaması
                    </h2>

                    <p>
                        Kayıtlı e-posta adresinize
                        6 haneli bir doğrulama kodu gönderdik.
                    </p>

                    <input
                        className="password-code-input"
                        type="text"
                        inputMode="numeric"
                        maxLength="6"
                        placeholder="6 haneli kod"
                        value={passwordCode}
                        onChange={(e) =>
                            setPasswordCode(
                                e.target.value.replace(/\D/g, "")
                            )
                        }
                    />

                    <button
                        type="button"
                        className="profile-save-btn"
                        onClick={() =>
                            setPasswordStep(3)
                        }
                        disabled={passwordCode.length !== 6}
                    >
                        Kodu Doğrula
                    </button>

                </>

            )}


            {passwordStep === 3 && (

                <>

                    <div className="password-modal-icon">
                        🔑
                    </div>

                    <h2>
                        Yeni Şifre
                    </h2>

                    <p>
                        Hesabınız için yeni şifrenizi belirleyin.
                    </p>

                    <input
                        className="password-code-input"
                        type="password"
                        placeholder="Yeni şifre"
                        value={newPassword}
                        onChange={(e) =>
                            setNewPassword(e.target.value)
                        }
                    />

                    <button
    type="button"
    className="profile-save-btn"
    onClick={handleChangePassword}
    disabled={
        newPassword.length < 6 ||
        passwordLoading
    }
>
    {passwordLoading
        ? "Güncelleniyor..."
        : "Şifreyi Güncelle"}
</button>

                </>

            )}

        </div>

    </div>

)}

{showEmailModal && (

    <div className="password-modal-overlay">

        <div className="password-modal">

            <button
                type="button"
                className="password-modal-close"
                onClick={() => {

                    setShowEmailModal(false);

                    setEmailStep(1);

                    setCurrentPasswordEmail("");

                    setNewEmail("");

                    setEmailCode("");

                }}
            >
                ×
            </button>


            {/* =====================================
                1. ADIM
            ===================================== */}

            {emailStep === 1 && (

                <>

                    <div className="password-modal-icon">
                        ✉️
                    </div>

                    <h2>
                        E-posta Değiştir
                    </h2>

                    <p>
                        Güvenliğiniz için önce mevcut
                        şifrenizi girin.
                    </p>


                    <input
                        className="password-code-input"
                        type="password"
                        placeholder="Mevcut şifre"
                        value={currentPasswordEmail}
                        onChange={(e) =>
                            setCurrentPasswordEmail(
                                e.target.value
                            )
                        }
                    />


                    <input
                        className="password-code-input"
                        type="email"
                        placeholder="Yeni e-posta"
                        value={newEmail}
                        onChange={(e) =>
                            setNewEmail(
                                e.target.value
                            )
                        }
                    />


                    <button
                        type="button"
                        className="profile-save-btn"
                        onClick={startEmailChange}
                        disabled={
                            emailLoading ||
                            !currentPasswordEmail ||
                            !newEmail
                        }
                    >

                        {emailLoading
                            ? "Kod Gönderiliyor..."
                            : "Doğrulama Kodu Gönder"}

                    </button>

                </>

            )}


            {/* =====================================
                2. ADIM
            ===================================== */}

            {emailStep === 2 && (

                <>

                    <div className="password-modal-icon">
                        🔐
                    </div>

                    <h2>
                        E-posta Doğrulama
                    </h2>

                    <p>
                        <strong>
                            {newEmail}
                        </strong>
                        {" "}
                        adresine 6 haneli doğrulama
                        kodu gönderdik.
                    </p>


                    <input
                        className="password-code-input"
                        type="text"
                        inputMode="numeric"
                        maxLength="6"
                        placeholder="6 haneli kod"
                        value={emailCode}
                        onChange={(e) =>
                            setEmailCode(
                                e.target.value.replace(
                                    /\D/g,
                                    ""
                                )
                            )
                        }
                    />


                    <button
    type="button"
    className="profile-save-btn"
    onClick={handleVerifyEmailChange}
    disabled={
        emailCode.length !== 6 ||
        emailLoading
    }
>
    {emailLoading
        ? "Onaylanıyor..."
        : "E-postayı Onayla"}
</button>
                </>

            )}

        </div>

    </div>

)}
        </div>

    );

}


export default Profile;