import { useEffect, useState } from "react";

function MyOrders() {

    const [orders, setOrders] = useState([]);
    const [returns, setReturns] = useState([]);

    const [returnOrderId, setReturnOrderId] = useState(null);
    const [reason, setReason] = useState("");
    const [returnLoading, setReturnLoading] = useState(false);


    // =========================================
    // SİPARİŞLERİ GETİR
    // =========================================

    useEffect(() => {

        const user = JSON.parse(
            localStorage.getItem("user")
        );

        if (!user) {
            return;
        }

        fetch(
            `http://localhost:5000/api/orders/user/${user.id}`
        )
            .then(res => res.json())
            .then(data => {

                console.log(
                    "SİPARİŞLER:",
                    data
                );

                setOrders(
                    Array.isArray(data)
                        ? data
                        : []
                );

            })
            .catch(err => {

                console.log(
                    "SİPARİŞLER GETİRME HATASI:",
                    err
                );

            });

    }, []);


    // =========================================
    // İADELERİ GETİR
    // =========================================

    const loadReturns = async () => {

        const user = JSON.parse(
            localStorage.getItem("user")
        );

        if (!user) {
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:5000/api/returns/user/${user.id}`
            );

            if (!response.ok) {

                console.log(
                    "İade bilgileri alınamadı."
                );

                return;
            }

            const data = await response.json();

            console.log(
                "KULLANICI İADELERİ:",
                data
            );

            setReturns(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.log(
                "İADELERİ GETİRME HATASI:",
                error
            );

        }

    };


    // =========================================
    // SAYFA AÇILINCA İADELERİ GETİR
    // =========================================

    useEffect(() => {

        loadReturns();

    }, []);


    // =========================================
    // İADE FORMUNU AÇ
    // =========================================

    const openReturnForm = (orderId) => {

        setReturnOrderId(orderId);
        setReason("");

    };


    // =========================================
    // İADE FORMUNU KAPAT
    // =========================================

    const closeReturnForm = () => {

        setReturnOrderId(null);
        setReason("");

    };


    // =========================================
    // İADE TALEBİ GÖNDER
    // =========================================

    const submitReturn = async (order) => {

        const user = JSON.parse(
            localStorage.getItem("user")
        );

        if (!user) {

            alert(
                "İade talebi oluşturmak için giriş yapmalısınız."
            );

            return;
        }

        if (!reason) {

            alert(
                "Lütfen iade nedenini seçin."
            );

            return;
        }

        try {

            setReturnLoading(true);

            console.log(
                "İADE GÖNDERİLİYOR:",
                {
                    order_id: order.id,
                    user_id: user.id,
                    reason: reason
                }
            );

            const response = await fetch(
                "http://localhost:5000/api/returns",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        order_id: order.id,

                        user_id: user.id,

                        reason: reason

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

            closeReturnForm();

            await loadReturns();

        } catch (error) {

            console.log(
                "İADE TALEBİ HATASI:",
                error
            );

            alert(
                "İade talebi gönderilirken bir hata oluştu."
            );

        } finally {

            setReturnLoading(false);

        }

    };


    // =========================================
    // İADE DURUMU BİLGİSİ
    // =========================================

    const getReturnMessage = (status) => {

        switch (status) {

            case "Bekliyor":

                return {
                    title: "İade talebiniz alındı.",
                    message:
                        "İade talebiniz incelenmek üzere alınmıştır. Sonuçlandığında size bilgi verilecektir.",
                    background: "#fef3c7",
                    border: "1px solid #fde68a",
                    color: "#92400e",
                    icon: "⏳"
                };


            case "Ürün Bekleniyor":

                return {
                    title: "Ürününüz bekleniyor.",
                    message:
                        "İade talebiniz onaylandı. Ürünün tarafımıza ulaştırılması bekleniyor. Ürün elimize ulaştığında kontrol işlemi başlatılacaktır.",
                    background: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    color: "#1d4ed8",
                    icon: "📦"
                };


            case "Ürün Kontrol Ediliyor":

                return {
                    title: "Ürününüz kontrol ediliyor.",
                    message:
                        "İade ürününüz tarafımıza ulaştı. Ürün kontrol işlemi devam ediyor. Kontrol tamamlandığında para iadesi süreci başlatılacaktır.",
                    background: "#fef3c7",
                    border: "1px solid #fde68a",
                    color: "#92400e",
                    icon: "🔍"
                };


            case "Para İadesi Yapıldı":

            

                return {
                    title: "Para iadeniz gerçekleştirildi.",
                    message:
                        "İade tutarınız ödeme yönteminize bağlı olarak 1–3 iş günü içerisinde hesabınıza yansıyabilir.",
                    background: "#dcfce7",
                    border: "1px solid #86efac",
                    color: "#166534",
                    icon: "💰"
                };

                case "Para İadesi Yapıldı":

    return {
        title: "Para iadesi yapıldı.",
        message:
            "İade ürününüzün kontrolü tamamlandı. Para iadeniz başarıyla gerçekleştirilmiştir. Tutarın hesabınıza yansıması bankanıza göre biraz zaman alabilir.",
        background: "#dcfce7",
        border: "1px solid #86efac",
        color: "#166534",
        icon: "💰"
    };


            case "Reddedildi":

                return {
                    title: "İade talebiniz reddedildi.",
                    message:
                        "İade talebiniz maalesef onaylanmadı. Detaylı bilgi için aşağıdaki açıklamayı inceleyebilirsiniz.",
                    background: "#fee2e2",
                    border: "1px solid #fca5a5",
                    color: "#991b1b",
                    icon: "✕"
                };


            case "Tamamlandı":

                return {
                    title: "İade işleminiz tamamlandı.",
                    message:
                        "İade işleminiz başarıyla tamamlanmıştır.",
                    background: "#dcfce7",
                    border: "1px solid #86efac",
                    color: "#166534",
                    icon: "✓"
                };


            default:

                return {
                    title: "İade talebiniz işleme alındı.",
                    message:
                        "İade süreciniz devam ediyor.",
                    background: "#fef3c7",
                    border: "1px solid #fde68a",
                    color: "#92400e",
                    icon: "⏳"
                };

        }

    };


    return (

        <div
            style={{
                maxWidth: "1000px",
                margin: "40px auto",
                padding: "0 20px"
            }}
        >

            <h1>
                Siparişlerim
            </h1>


            {orders.length === 0 ? (

                <p>
                    Henüz siparişiniz bulunmuyor.
                </p>

            ) : (

                orders.map(order => {

                    // =================================
                    // BU SİPARİŞE AİT İADEYİ BUL
                    // =================================

                    const returnRequest =
                        returns.find(
                            item =>
                                Number(item.order_id) ===
                                Number(order.id)
                        );


                    const returnInfo =
                        returnRequest
                            ? getReturnMessage(
                                returnRequest.status
                            )
                            : null;


                    return (

                        <div
                            key={order.id}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "10px",
                                padding: "20px",
                                marginTop: "20px"
                            }}
                        >

                            <h3>
                                Sipariş #{order.id}
                            </h3>


                            <p>

                                Durum:

                                <strong>
                                    {" "}
                                    {order.status}
                                </strong>

                            </p>


                            <p>

                                Toplam:

                                <strong>

                                    {" "}

                                    {Number(
                                        order.total_price
                                    ).toLocaleString(
                                        "tr-TR"
                                    )}

                                    {" "}₺

                                </strong>

                            </p>


                            <p>

                                Tarih:

                                {" "}

                                {new Date(
                                    order.created_at
                                ).toLocaleString(
                                    "tr-TR"
                                )}

                            </p>


                            {/* =================================
                                İADE DURUMU
                            ================================= */}

                            {returnRequest && returnInfo && (

                                <div
                                    style={{
                                        marginTop: "20px",
                                        padding: "16px 18px",
                                        borderRadius: "10px",
                                        background:
                                            returnInfo.background,
                                        border:
                                            returnInfo.border,
                                        color:
                                            returnInfo.color
                                    }}
                                >

                                    <strong
                                        style={{
                                            display: "block",
                                            marginBottom: "8px",
                                            fontSize: "16px"
                                        }}
                                    >

                                        {returnInfo.icon}{" "}

                                        {returnInfo.title}

                                    </strong>


                                    <div
                                        style={{
                                            lineHeight: "1.6",
                                            fontSize: "14px"
                                        }}
                                    >

                                        {returnInfo.message}

                                    </div>


                                    {/* =================================
                                        İADE NEDENİ
                                    ================================= */}

                                    {returnRequest.reason && (

                                        <div
                                            style={{
                                                marginTop: "12px",
                                                paddingTop: "12px",
                                                borderTop:
                                                    `1px solid ${returnInfo.border.replace(
                                                        "1px solid ",
                                                        ""
                                                    )}`,
                                                fontSize: "14px"
                                            }}
                                        >

                                            <strong>
                                                İade nedeni:
                                            </strong>

                                            {" "}

                                            {returnRequest.reason}

                                        </div>

                                    )}


                                    {/* =================================
                                        RED NEDENİ
                                    ================================= */}

                                    {returnRequest.status === "Reddedildi" &&
                                        returnRequest.admin_note && (

                                            <div
                                                style={{
                                                    marginTop: "12px",
                                                    paddingTop: "12px",
                                                    borderTop:
                                                        "1px solid #fca5a5",
                                                    fontSize: "14px"
                                                }}
                                            >

                                                <strong>
                                                    Red nedeni:
                                                </strong>

                                                {" "}

                                                {returnRequest.admin_note}

                                            </div>

                                        )}

                                </div>

                            )}


                            {/* =================================
                                İADE BUTONU
                            ================================= */}

                            {!returnRequest && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        openReturnForm(
                                            order.id
                                        )
                                    }
                                    style={{
                                        marginTop: "15px",
                                        padding: "10px 18px",
                                        border: "none",
                                        borderRadius: "7px",
                                        background: "#dc2626",
                                        color: "#fff",
                                        cursor: "pointer",
                                        fontSize: "14px"
                                    }}
                                >

                                    ↩ İade Talebi

                                </button>

                            )}


                            {/* =================================
                                İADE FORMU
                            ================================= */}

                            {returnOrderId === order.id && (

                                <div
                                    style={{
                                        marginTop: "20px",
                                        padding: "20px",
                                        background: "#f8fafc",
                                        borderRadius: "10px",
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
                                        value={reason}
                                        onChange={(e) =>
                                            setReason(
                                                e.target.value
                                            )
                                        }
                                        style={{
                                            width: "100%",
                                            padding: "10px",
                                            marginBottom: "15px",
                                            borderRadius: "6px",
                                            border:
                                                "1px solid #cbd5e1"
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

                                        <option value="Fikrim değişti">
                                            Fikrim değişti
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
                                            onClick={() =>
                                                submitReturn(
                                                    order
                                                )
                                            }
                                            disabled={
                                                returnLoading
                                            }
                                            style={{
                                                padding: "10px 18px",
                                                border: "none",
                                                borderRadius: "7px",
                                                background: "#2563eb",
                                                color: "#fff",
                                                cursor:
                                                    returnLoading
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
                                            onClick={
                                                closeReturnForm
                                            }
                                            style={{
                                                padding: "10px 18px",
                                                border:
                                                    "1px solid #cbd5e1",
                                                borderRadius: "7px",
                                                background: "#fff",
                                                cursor: "pointer"
                                            }}
                                        >

                                            Vazgeç

                                        </button>

                                    </div>

                                </div>

                            )}

                        </div>

                    );

                })

            )}

        </div>

    );

}

export default MyOrders;