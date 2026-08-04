import { useEffect, useState } from "react";

function Orders() {
    const [orders, setOrders] = useState([]);
const [selectedOrder, setSelectedOrder] = useState(null);

const [orderInfo, setOrderInfo] = useState(null);
const [orderDetail, setOrderDetail] = useState([]);
    useEffect(() => {

        fetch("http://localhost:5000/api/orders")
            .then(res => res.json())
            .then(data => setOrders(data))
            .catch(err => console.log(err));

    }, []);

    const updateStatus = async (id, status) => {

        try {

            await fetch(`http://localhost:5000/api/orders/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status })
            });

            setOrders(prev =>
                prev.map(order =>
                    order.id === id
                        ? { ...order, status }
                        : order
                )
            );

        } catch (error) {
            console.log(error);
        }

    };

    const showOrderDetail = async (id) => {

    try {

        const detailRes = await fetch(
            `http://localhost:5000/api/orders/${id}`
        );

        const detail = await detailRes.json();

        const selected = orders.find(order => order.id === id);

        setSelectedOrder(id);
        setOrderInfo(selected);
        setOrderDetail(detail);

    } catch (error) {

        console.log(error);

    }

};
    return (

        <div style={{ padding: "30px" }}>

            <h1>Siparişler</h1>

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "20px"
                }}
            >

                <thead>

                    <tr>

                        <th style={{ borderBottom: "1px solid #ddd", padding: "12px" }}>
                            Sipariş No
                        </th>

                        <th style={{ borderBottom: "1px solid #ddd", padding: "12px" }}>
                            Toplam
                        </th>

                        <th style={{ borderBottom: "1px solid #ddd", padding: "12px" }}>
                            Durum
                        </th>

                        <th style={{ borderBottom: "1px solid #ddd", padding: "12px" }}>
                            Tarih
                        </th>

                        <th style={{ borderBottom: "1px solid #ddd", padding: "12px" }}>
                            İşlem
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {orders.map(order => (

                        <tr key={order.id}>

                            <td style={{ padding: "12px", textAlign: "center" }}>
                                #{order.id}
                            </td>

                            <td style={{ padding: "12px", textAlign: "center" }}>
                                {Number(order.total_price).toLocaleString("tr-TR")} ₺
                            </td>

                            <td style={{ padding: "12px", textAlign: "center" }}>

                                <select
                                    value={order.status}
                                    onChange={(e) => updateStatus(order.id, e.target.value)}
                                >
                                    <option value="Hazırlanıyor">Hazırlanıyor</option>
                                    <option value="Kargoda">Kargoda</option>
                                    <option value="Teslim Edildi">Teslim Edildi</option>
                                    <option value="İptal Edildi">İptal Edildi</option>
                                </select>

                            </td>

                            <td style={{ padding: "12px", textAlign: "center" }}>
                                {new Date(order.created_at).toLocaleString("tr-TR")}
                            </td>

                            <td style={{ padding: "12px", textAlign: "center" }}>

                                <button
                                    onClick={() => showOrderDetail(order.id)}
                                >
                                    Detay
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

            {selectedOrder && (

                <div
                    style={{
                        marginTop: "40px",
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        padding: "20px"
                    }}
                >

                    <h2>Sipariş #{selectedOrder}</h2>

                    {orderInfo && (

    <div
        style={{
            marginBottom: "30px",
            background: "#f8f8f8",
            padding: "20px",
            borderRadius: "10px"
        }}
    >

        <h3>Teslimat Bilgileri</h3>

        <p>
            <strong>Ad Soyad:</strong> {orderInfo.full_name}
        </p>

        <p>
            <strong>Telefon:</strong> {orderInfo.phone}
        </p>

        <p>
            <strong>İl:</strong> {orderInfo.city}
        </p>

        <p>
            <strong>İlçe:</strong> {orderInfo.district}
        </p>

        <p>
            <strong>Adres:</strong>
            <br />
            {orderInfo.address}
        </p>

        <p>
            <strong>Sipariş Notu:</strong>
            <br />
            {orderInfo.note || "-"}
        </p>

        <hr />

        <p>
            <strong>Ara Toplam:</strong>
            {" "}
            {Number(orderInfo.subtotal).toLocaleString("tr-TR")} ₺
        </p>

        <p>
            <strong>Kargo:</strong>
            {" "}
            {Number(orderInfo.shipping_fee).toLocaleString("tr-TR")} ₺
        </p>

        <h3>
            Genel Toplam :
            {" "}
            {Number(orderInfo.total_price).toLocaleString("tr-TR")} ₺
        </h3>

    </div>

)}

                    {orderDetail.length === 0 ? (

                        <p>Bu siparişte ürün bulunamadı.</p>

                    ) : (

                        orderDetail.map(item => (

                            <div
                                key={item.id}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "20px",
                                    marginTop: "20px",
                                    borderBottom: "1px solid #eee",
                                    paddingBottom: "15px"
                                }}
                            >

                                <img
                                    src={`http://localhost:5000/uploads/${item.image}`}
                                    alt={item.name}
                                    width="80"
                                    height="80"
                                    style={{
                                        objectFit: "cover",
                                        borderRadius: "8px"
                                    }}
                                />

                                <div>

                                    <h3>{item.name}</h3>

                                    <p>Adet: {item.quantity}</p>

                                    <p>Fiyat: {item.price} ₺</p>

                                </div>

                            </div>

                        ))

                    )}

                </div>

            )}

        </div>

    );

}

export default Orders;