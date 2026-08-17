import { useEffect, useState } from "react";

function Returns() {

    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [updatingId, setUpdatingId] = useState(null);

    // =========================================
    // İADELERİ GETİR
    // =========================================

    const loadReturns = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:5000/api/returns"
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "İade talepleri alınamadı."
                );

            }

            setReturns(data);

        } catch (error) {

            console.log(
                "İADELER GETİRİLEMEDİ:",
                error
            );

            setError(
                error.message ||
                "İade talepleri yüklenirken hata oluştu."
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================
    // SAYFA AÇILDIĞINDA
    // =========================================

    useEffect(() => {

        loadReturns();

    }, []);


    // =========================================
    // İADE DURUMUNU GÜNCELLE
    // =========================================

const updateStatus = async (id, status) => {

    let adminNote = "";


    // =========================================
    // RED İSE AÇIKLAMA AL
    // =========================================

    if (status === "Reddedildi") {

        adminNote = window.prompt(
            "İade talebini neden reddettiğinizi yazın:"
        );

        if (adminNote === null) {
            return;
        }

        adminNote = adminNote.trim();

        if (!adminNote) {

            alert(
                "İade reddedilirken açıklama yazmanız gerekiyor."
            );

            return;
        }

    }


    // =========================================
    // ONAY / RED ONAYI
    // =========================================
const message =
    status === "Reddedildi"
        ? "Bu iade talebini reddetmek istediğinize emin misiniz?"
        : "Bu iade işlemini devam ettirmek istediğinize emin misiniz?";


    const confirmed = window.confirm(message);


    if (!confirmed) {
        return;
    }


    try {

        setUpdatingId(id);


        const response = await fetch(
            `http://localhost:5000/api/returns/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    status: status,

                    admin_note:
                        adminNote || null

                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "İade durumu güncellenemedi."
            );

        }


        await loadReturns();


    } catch (error) {

        console.log(
            "İADE DURUMU GÜNCELLENEMEDİ:",
            error
        );

        alert(
            error.message ||
            "İade durumu güncellenemedi."
        );

    } finally {

        setUpdatingId(null);

    }

};


    // =========================================
    // YÜKLENİYOR
    // =========================================

    if (loading) {

        return (

            <div>

                <h1>
                    İade Talepleri
                </h1>

                <p>
                    İade talepleri yükleniyor...
                </p>

            </div>

        );

    }


    // =========================================
    // HATA
    // =========================================

    if (error) {

        return (

            <div>

                <h1>
                    İade Talepleri
                </h1>

                <p>
                    {error}
                </p>

                <button onClick={loadReturns}>
                    Tekrar Dene
                </button>

            </div>

        );

    }


    // =========================================
    // SAYFA
    // =========================================

    return (

        <div>

            <h1>
                İade Talepleri
            </h1>


            {/* =========================================
                İADE YOK
            ========================================= */}

            {returns.length === 0 ? (

                <p>
                    Henüz iade talebi bulunmuyor.
                </p>

            ) : (

                <div>

                    {returns.map((item) => (

                        <div
                            key={item.id}
                            style={{
                                border: "1px solid #e5e7eb",
                                borderRadius: "12px",
                                padding: "20px",
                                marginTop: "20px",
                                background: "#ffffff"
                            }}
                        >

                            <h3>
                                İade Talebi #{item.id}
                            </h3>


                            {/* KULLANICI */}

                            <p>

                                <strong>
                                    Kullanıcı:
                                </strong>{" "}

                                {item.user_name}

                            </p>


                            {/* E-POSTA */}

                            <p>

                                <strong>
                                    E-posta:
                                </strong>{" "}

                                {item.user_email}

                            </p>


                            {/* SİPARİŞ */}

                            <p>

                                <strong>
                                    Sipariş:
                                </strong>{" "}

                                #{item.order_id}

                            </p>


                            {/* SİPARİŞ TUTARI */}

                            <p>

                                <strong>
                                    Sipariş Tutarı:
                                </strong>{" "}

                                {Number(
                                    item.total_price
                                ).toLocaleString("tr-TR")} ₺

                            </p>


                            {/* İADE NEDENİ */}

                            <p>

                                <strong>
                                    İade Nedeni:
                                </strong>{" "}

                                {item.reason}

                            </p>


                            {/* KULLANICI AÇIKLAMASI */}

                            {item.description && (

                                <p>

                                    <strong>
                                        Açıklama:
                                    </strong>{" "}

                                    {item.description}

                                </p>

                            )}


                            {/* DURUM */}

                            <p>

                                <strong>
                                    Durum:
                                </strong>{" "}

                                {item.status}

                            </p>


                            {/* TARİH */}

                            <p>

                                <strong>
                                    Talep Tarihi:
                                </strong>{" "}

                                {new Date(
                                    item.created_at
                                ).toLocaleString("tr-TR")}

                            </p>


                            {/* =========================================
                                BEKLEYEN İADE
                            ========================================= */}

                            {item.status === "Bekliyor" && (

                                <div
                                    style={{
                                        display: "flex",
                                        gap: "10px",
                                        marginTop: "20px"
                                    }}
                                >

                                    {/* ONAYLA */}

                                    <button
                                        onClick={() =>
                                         updateStatus(
                                          item.id,
                                        "Ürün Bekleniyor"
                                        )
                                        }
                                        disabled={
                                            updatingId === item.id
                                        }
                                        style={{
                                            padding: "10px 18px",
                                            border: "none",
                                            borderRadius: "8px",
                                            background: "#16a34a",
                                            color: "white",
                                            cursor:
                                                updatingId === item.id
                                                    ? "not-allowed"
                                                    : "pointer",
                                            fontWeight: "600"
                                        }}
                                    >

                                        {updatingId === item.id
                                            ? "Güncelleniyor..."
                                            : "İadeyi Onayla"}

                                    </button>


                                    {/* REDDET */}

                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                item.id,
                                                "Reddedildi"
                                            )
                                        }
                                        disabled={
                                            updatingId === item.id
                                        }
                                        style={{
                                            padding: "10px 18px",
                                            border: "none",
                                            borderRadius: "8px",
                                            background: "#dc2626",
                                            color: "white",
                                            cursor:
                                                updatingId === item.id
                                                    ? "not-allowed"
                                                    : "pointer",
                                            fontWeight: "600"
                                        }}
                                    >

                                        {updatingId === item.id
                                            ? "Güncelleniyor..."
                                            : "İadeyi Reddet"}

                                    </button>

                                </div>

                            )}


                            {/* =========================================
                                ONAYLANDI
                            ========================================= */}

                            {item.status === "Onaylandı" && (

                                <div
                                    style={{
                                        marginTop: "20px",
                                        padding: "12px 15px",
                                        borderRadius: "8px",
                                        background: "#dcfce7",
                                        color: "#166534",
                                        fontWeight: "600"
                                    }}
                                >

                                    ✓ İade talebi onaylandı.

                                </div>

                            )}
                            
                            {/* =========================================
    ÜRÜN BEKLENİYOR
========================================= */}

{item.status === "Ürün Bekleniyor" && (

    <div
        style={{
            marginTop: "20px",
            padding: "15px",
            borderRadius: "8px",
            background: "#eff6ff",
            color: "#1d4ed8"
        }}
    >

        <div
            style={{
                fontWeight: "700",
                marginBottom: "8px"
            }}
        >
            📦 Ürün bekleniyor
        </div>

        <div
            style={{
                fontWeight: "400",
                lineHeight: "1.5",
                marginBottom: "15px"
            }}
        >
            İade talebi onaylandı.
            Ürünün tarafımıza ulaşması bekleniyor.
        </div>


        <button
            onClick={() =>
                updateStatus(
                    item.id,
                    "Ürün Kontrol Ediliyor"
                )
            }
            disabled={updatingId === item.id}
            style={{
                padding: "10px 18px",
                border: "none",
                borderRadius: "8px",
                background: "#2563eb",
                color: "white",
                cursor:
                    updatingId === item.id
                        ? "not-allowed"
                        : "pointer",
                fontWeight: "600"
            }}
        >

            {updatingId === item.id
                ? "Güncelleniyor..."
                : "Ürün Geldi / Kontrole Al"}

        </button>

    </div>         

)}
                                         
{/* =========================================
    ÜRÜN KONTROL EDİLİYOR
========================================= */}

{item.status === "Ürün Kontrol Ediliyor" && (

    <div
        style={{
            marginTop: "20px",
            padding: "15px",
            borderRadius: "8px",
            background: "#fef3c7",
            color: "#92400e"
        }}
    >

        <div
            style={{
                fontWeight: "700",
                marginBottom: "8px"
            }}
        >
            🔍 Ürün kontrol ediliyor
        </div>

        <div
            style={{
                fontWeight: "400",
                lineHeight: "1.5",
                marginBottom: "15px"
            }}
        >
            İade ürününüz tarafımıza ulaştı.
            Ürün kontrol işlemi devam ediyor.
        </div>

        <button
            onClick={() =>
                updateStatus(
                    item.id,
                    "Para İadesi Yapıldı"
                )
            }
            disabled={updatingId === item.id}
            style={{
                padding: "10px 18px",
                border: "none",
                borderRadius: "8px",
                background: "#16a34a",
                color: "white",
                cursor:
                    updatingId === item.id
                        ? "not-allowed"
                        : "pointer",
                fontWeight: "600"
            }}
        >

            {updatingId === item.id
                ? "Güncelleniyor..."
                : "Kontrol Tamamlandı / Para İadesini Başlat"}

        </button>

    </div>

)}                            

{/* =========================================
    PARA İADESİ YAPILDI
========================================= */}

{item.status === "Para İadesi Yapıldı" && (

    <div
        style={{
            marginTop: "20px",
            padding: "15px",
            borderRadius: "8px",
            background: "#dcfce7",
            color: "#166534"
        }}
    >

        <div
            style={{
                fontWeight: "700",
                marginBottom: "6px"
            }}
        >
            💰 Para iadesi yapıldı
        </div>

        <div
            style={{
                fontWeight: "400",
                lineHeight: "1.5"
            }}
        >
            Ürün kontrolü tamamlandı.
            Para iadesi müşteriye gerçekleştirildi.
        </div>

    </div>

)}

                            {/* =========================================
                                REDDEDİLDİ
                            ========================================= */}

                            {item.status === "Reddedildi" && (

                                <div
                                    style={{
                                        marginTop: "20px",
                                        padding: "15px",
                                        borderRadius: "8px",
                                        background: "#fee2e2",
                                        color: "#991b1b"
                                    }}
                                >

                                    <div
                                        style={{
                                            fontWeight: "700",
                                            marginBottom: "6px"
                                        }}
                                    >

                                        ✕ İade talebi reddedildi.

                                    </div>


                                    {/* ADMIN RED NEDENİ */}

                                    {item.admin_note && (

                                        <div
                                            style={{
                                                fontWeight: "400",
                                                lineHeight: "1.5"
                                            }}
                                        >

                                            <strong>
                                                Red nedeni:
                                            </strong>{" "}

                                            {item.admin_note}

                                        </div>

                                    )}

                                </div>

                            )}

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

export default Returns;