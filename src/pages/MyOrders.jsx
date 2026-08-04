import { useEffect, useState } from "react";

function MyOrders() {

    const [orders, setOrders] = useState([]);

    useEffect(() => {

        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) return;

        fetch(`http://localhost:5000/api/orders/user/${user.id}`)
            .then(res => res.json())
            .then(data => setOrders(data))
            .catch(err => console.log(err));

    }, []);

    return (

        <div
            style={{
                maxWidth: "1000px",
                margin: "40px auto"
            }}
        >

            <h1>Siparişlerim</h1>

            {orders.length === 0 ? (

                <p>Henüz siparişiniz bulunmuyor.</p>

            ) : (

                orders.map(order => (

                    <div
                        key={order.id}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "10px",
                            padding: "20px",
                            marginTop: "20px"
                        }}
                    >

                        <h3>Sipariş #{order.id}</h3>

                        <p>
                            Durum:
                            <strong> {order.status}</strong>
                        </p>

                        <p>
                            Toplam:
                            <strong>
                                {" "}
                                {Number(order.total_price).toLocaleString("tr-TR")} ₺
                            </strong>
                        </p>

                        <p>
                            Tarih:
                            {" "}
                            {new Date(order.created_at).toLocaleString("tr-TR")}
                        </p>

                    </div>

                ))

            )}

        </div>

    );

}

export default MyOrders;