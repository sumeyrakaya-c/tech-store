import { useEffect, useState } from "react";
import "../styles/Orders.css";

function Orders() {

    const [orders, setOrders] = useState([]);

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderInfo, setOrderInfo] = useState(null);
    const [orderDetail, setOrderDetail] = useState([]);

    // Admin'in seçtiği ama henüz kaydetmediği durumlar
    const [pendingStatuses, setPendingStatuses] = useState({});


    // =========================================
    // SİPARİŞLERİ GETİR
    // =========================================

    useEffect(() => {

        fetch("http://localhost:5000/api/orders")
            .then(res => res.json())
            .then(data => {

                console.log("SİPARİŞLER:", data);

                setOrders(data);

            })
            .catch(err => {

                console.log(
                    "SİPARİŞLER GETİRİLEMEDİ:",
                    err
                );

            });

    }, []);


    // =========================================
    // DURUMU SADECE EKRANDA DEĞİŞTİR
    // =========================================

    const handleStatusChange = (id, status) => {

        setPendingStatuses(prev => ({
            ...prev,
            [id]: status
        }));

    };


    // =========================================
    // DURUM GÜNCELLE + MAIL
    // =========================================

    const updateStatus = async (id) => {

        const newStatus = pendingStatuses[id];

        // Değişiklik yoksa hiçbir şey yapma
        if (!newStatus) {
            return;
        }


        // İlgili siparişi bul
        const currentOrder = orders.find(
            order => Number(order.id) === Number(id)
        );


        if (!currentOrder) {
            return;
        }


        // Aynı durum seçildiyse güncelleme yapma
        if (currentOrder.status === newStatus) {

            setPendingStatuses(prev => {

                const updated = {
                    ...prev
                };

                delete updated[id];

                return updated;

            });

            return;
        }


        try {

            console.log(
                "DURUM GÜNCELLENİYOR:",
                id,
                newStatus
            );


            const response = await fetch(
                `http://localhost:5000/api/orders/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            );


            const data = await response.json();


            console.log(
                "DURUM GÜNCELLEME CEVABI:",
                data
            );


            // Backend hata verdiyse
            if (!response.ok) {

                alert(
                    data.message ||
                    "Sipariş durumu güncellenemedi."
                );

                return;
            }


            // =====================================
            // SİPARİŞLER TABLOSUNU GÜNCELLE
            // =====================================

            setOrders(prev =>
                prev.map(order =>
                    Number(order.id) === Number(id)
                        ? {
                            ...order,
                            status: newStatus
                        }
                        : order
                )
            );


            // =====================================
            // DETAY AÇIKSA DETAYI DA GÜNCELLE
            // =====================================

            setOrderInfo(prev => {

                if (
                    prev &&
                    Number(prev.id) === Number(id)
                ) {

                    return {
                        ...prev,
                        status: newStatus
                    };

                }

                return prev;

            });


            // =====================================
            // KAYDEDİLEN DEĞİŞİKLİĞİ TEMİZLE
            // =====================================

            setPendingStatuses(prev => {

                const updated = {
                    ...prev
                };

                delete updated[id];

                return updated;

            });


            // =====================================
            // BAŞARILI MESAJ
            // =====================================

            alert(
                data.message ||
                "Sipariş durumu güncellendi."
            );


        } catch (error) {

            console.error(
                "DURUM GÜNCELLEME HATASI:",
                error
            );

            alert(
                "Sipariş durumu güncellenirken bir hata oluştu."
            );

        }

    };


    // =========================================
    // SİPARİŞ DETAYI
    // =========================================

    const showOrderDetail = async (id) => {

        try {

            console.log(
                "DETAY BUTONU:",
                id
            );


            const detailRes = await fetch(
                `http://localhost:5000/api/orders/${id}`
            );


            console.log(
                "DETAY STATUS:",
                detailRes.status
            );


            const detail = await detailRes.json();


            console.log(
                "DETAY VERİSİ:",
                detail
            );


            if (!detailRes.ok) {

                alert(
                    detail.message ||
                    "Sipariş detayları alınamadı."
                );

                return;
            }


            const selected = orders.find(
                order =>
                    Number(order.id) === Number(id)
            );


            console.log(
                "SEÇİLEN SİPARİŞ:",
                selected
            );


            setSelectedOrder(id);

            setOrderInfo(selected);

            setOrderDetail(
                Array.isArray(detail)
                    ? detail
                    : []
            );


        } catch (error) {

            console.error(
                "SİPARİŞ DETAY HATASI:",
                error
            );

            alert(
                "Sipariş detayları açılırken bir hata oluştu."
            );

        }

    };


    // =========================================
    // DETAYI KAPAT
    // =========================================

    const closeOrderDetail = () => {

        setSelectedOrder(null);

        setOrderInfo(null);

        setOrderDetail([]);

    };


    return (

        <div className="orders-page">


            {/* =====================================
                BAŞLIK
            ===================================== */}

            <div className="orders-header">

                <div>

                    <h1>
                        Siparişler
                    </h1>

                    <p>
                        Mağazanızdaki siparişleri yönetin
                        ve durumlarını güncelleyin.
                    </p>

                </div>

            </div>


            {/* =====================================
                SEÇİLİ SİPARİŞ DETAYI
            ===================================== */}

            {selectedOrder && (

                <div className="order-detail-panel">


                    {/* DETAY BAŞLIK */}

                    <div className="order-detail-header">

                        <div>

                            <span>
                                SİPARİŞ DETAYI
                            </span>

                            <h2>
                                Sipariş #{selectedOrder}
                            </h2>

                        </div>


                        <button
                            className="close-detail-btn"
                            onClick={closeOrderDetail}
                        >
                            Kapat
                        </button>

                    </div>


                    {/* =================================
                        TESLİMAT BİLGİLERİ
                    ================================= */}

                    {orderInfo && (

                        <div className="order-info-card">

                            <h3>
                                Teslimat Bilgileri
                            </h3>


                            <div className="order-info-grid">


                                <div>

                                    <span>
                                        Ad Soyad
                                    </span>

                                    <strong>
                                        {orderInfo.full_name}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Telefon
                                    </span>

                                    <strong>
                                        {orderInfo.phone}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        İl
                                    </span>

                                    <strong>
                                        {orderInfo.city}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        İlçe
                                    </span>

                                    <strong>
                                        {orderInfo.district}
                                    </strong>

                                </div>


                            </div>


                            {/* ADRES */}

                            <div className="address-box">

                                <span>
                                    Adres
                                </span>

                                <p>
                                    {orderInfo.address}
                                </p>

                            </div>


                            {/* SİPARİŞ NOTU */}

                            <div className="address-box">

                                <span>
                                    Sipariş Notu
                                </span>

                                <p>
                                    {orderInfo.note || "-"}
                                </p>

                            </div>


                            {/* =================================
                                SİPARİŞ DURUMU
                            ================================= */}

                            <div className="detail-status">

                                <span>
                                    Sipariş Durumu
                                </span>

                                <strong>
                                    {orderInfo.status}
                                </strong>

                            </div>


                            {/* =================================
                                FİYAT
                            ================================= */}

                            <div className="order-price-summary">


                                <div>

                                    <span>
                                        Ara Toplam
                                    </span>

                                    <strong>
                                        {Number(
                                            orderInfo.subtotal
                                        ).toLocaleString("tr-TR")} ₺
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Kargo
                                    </span>

                                    <strong>
                                        {Number(
                                            orderInfo.shipping_fee
                                        ).toLocaleString("tr-TR")} ₺
                                    </strong>

                                </div>


                                <div className="final-price">

                                    <span>
                                        Genel Toplam
                                    </span>

                                    <strong>
                                        {Number(
                                            orderInfo.total_price
                                        ).toLocaleString("tr-TR")} ₺
                                    </strong>

                                </div>


                            </div>


                        </div>

                    )}


                    {/* =================================
                        SİPARİŞ ÜRÜNLERİ
                    ================================= */}

                    <div className="order-products">

                        <h3>
                            Siparişteki Ürünler
                        </h3>


                        {orderDetail.length === 0 ? (

                            <p>
                                Bu siparişte ürün bulunamadı.
                            </p>

                        ) : (

                            orderDetail.map(item => (

                                <div
                                    className="order-product"
                                    key={item.id}
                                >


                                    <img
                                        src={`http://localhost:5000/uploads/${item.image}`}
                                        alt={item.name}
                                    />


                                    <div className="order-product-info">

                                        <h4>
                                            {item.name}
                                        </h4>

                                        <p>
                                            Adet: {item.quantity}
                                        </p>

                                        <p>
                                            Birim Fiyat:{" "}
                                            {Number(
                                                item.price
                                            ).toLocaleString("tr-TR")} ₺
                                        </p>

                                    </div>


                                    <strong>

                                        {(
                                            Number(item.price) *
                                            Number(item.quantity)
                                        ).toLocaleString("tr-TR")} ₺

                                    </strong>


                                </div>

                            ))

                        )}

                    </div>


                </div>

            )}


            {/* =====================================
                SİPARİŞ TABLOSU
            ===================================== */}

            <div className="orders-table">

                <table>

                    <thead>

                        <tr>

                            <th>
                                Sipariş No
                            </th>

                            <th>
                                Toplam
                            </th>

                            <th>
                                Durum
                            </th>

                            <th>
                                Tarih
                            </th>

                            <th>
                                İşlem
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {orders.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="5"
                                    className="empty-row"
                                >
                                    Henüz sipariş bulunmuyor.
                                </td>

                            </tr>

                        ) : (

                            orders.map(order => {

                                const pendingStatus =
                                    pendingStatuses[order.id];

                                const hasChange =
                                    pendingStatus &&
                                    pendingStatus !== order.status;


                                return (

                                    <tr key={order.id}>


                                        {/* SİPARİŞ NO */}

                                        <td>

                                            <span className="order-id">

                                                #{order.id}

                                            </span>

                                        </td>


                                        {/* TOPLAM */}

                                        <td>

                                            <strong className="order-total">

                                                {Number(
                                                    order.total_price
                                                ).toLocaleString("tr-TR")} ₺

                                            </strong>

                                        </td>


                                        {/* DURUM */}

                                        <td className="order-status-cell">


                                            <div className="status-controls">


                                                <select
                                                    className="status-select"
                                                    value={
                                                        pendingStatus ??
                                                        order.status
                                                    }
                                                    onChange={(e) =>
                                                        handleStatusChange(
                                                            order.id,
                                                            e.target.value
                                                        )
                                                    }
                                                >

                                                    <option value="Hazırlanıyor">
                                                        Hazırlanıyor
                                                    </option>

                                                    <option value="Kargoda">
                                                        Kargoda
                                                    </option>

                                                    <option value="Teslim Edildi">
                                                        Teslim Edildi
                                                    </option>

                                                    <option value="İptal Edildi">
                                                        İptal Edildi
                                                    </option>

                                                </select>


                                                {hasChange && (

                                                    <button
                                                        className="update-status-btn"
                                                        onClick={() =>
                                                            updateStatus(
                                                                order.id
                                                            )
                                                        }
                                                    >
                                                        Güncelle
                                                    </button>

                                                )}


                                            </div>


                                        </td>


                                        {/* TARİH */}

                                        <td>

                                            <span className="order-date">

                                                {new Date(
                                                    order.created_at
                                                ).toLocaleString(
                                                    "tr-TR"
                                                )}

                                            </span>

                                        </td>


                                        {/* DETAY */}

                                        <td>

                                            <button
                                                className="detail-btn"
                                                onClick={() =>
                                                    showOrderDetail(
                                                        order.id
                                                    )
                                                }
                                            >
                                                Detay
                                            </button>

                                        </td>


                                    </tr>

                                );

                            })

                        )}

                    </tbody>

                </table>

            </div>


        </div>

    );

}


export default Orders;