import { useEffect, useState } from "react";

function Cart() {

    const [cart, setCart] = useState([]);

const [fullName, setFullName] = useState("");
const [phone, setPhone] = useState("");
const [city, setCity] = useState("");
const [district, setDistrict] = useState("");
const [address, setAddress] = useState("");
const [note, setNote] = useState("");

    // Sepeti getir
    const loadCart = () => {

        fetch("http://localhost:5000/api/cart")
            .then(res => res.json())
            .then(data => setCart(data))
            .catch(err => console.log(err));

    };

    // Adet güncelle
    const updateQuantity = async (id, quantity) => {

        if (quantity < 1) return;

        try {

            await fetch(`http://localhost:5000/api/cart/${id}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    quantity
                })

            });

            loadCart();

        } catch (error) {

            console.log(error);

        }

    };

    // Ürünü sil
    const deleteItem = async (id) => {

        try {

            await fetch(`http://localhost:5000/api/cart/${id}`, {

                method: "DELETE"

            });

            loadCart();

        } catch (error) {

            console.log(error);

        }

    };

    // Siparişi oluştur
const checkout = async () => {

    try {

        const response = await fetch("http://localhost:5000/api/orders", {
            method: "POST"
        });

        const data = await response.json();

        if (response.ok) {

            setCart([]);      // Sepeti hemen boşalt
            alert(data.message);

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.log(error);

    }

};

    useEffect(() => {

        loadCart();

    }, []);

    const totalPrice = cart.reduce((total, item) => {

    return total + (item.price * item.quantity);

}, 0);

     const shippingFee = totalPrice >= 1000 ? 0 : 100;

const grandTotal = totalPrice + shippingFee;

    return (

        <div
            style={{
                maxWidth: "1100px",
                margin: "40px auto",
                padding: "20px"
            }}
        >

            <h1>Sepetim</h1>

            {cart.length === 0 ? (

                <p>Sepetiniz boş.</p>

            ) : (

    <>

        {cart.map(item => (

            <div
                key={item.id}
                style={{
                    display: "flex",
                    gap: "20px",
                    alignItems: "center",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "15px",
                    marginBottom: "15px"
                }}
            >

                <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt={item.name}
                    width="100"
                />

                <div>

                    <h3>{item.name}</h3>

                    <p>
                        {Number(item.price).toLocaleString("tr-TR")} ₺
                    </p>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginTop: "10px"
                        }}
                    >

                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            -
                        </button>

                        <span>{item.quantity}</span>

                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            +
                        </button>

                        <button
                            onClick={() => deleteItem(item.id)}
                            style={{ marginLeft: "20px" }}
                        >
                            🗑️ Sil
                        </button>

                    </div>

                </div>

            </div>

        ))}

        <div
    style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "30px",
        marginTop: "30px"
    }}
>
    <div
        style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "20px"
        }}
    >
        <h2>Teslimat Bilgileri</h2>

        <input
            type="text"
            placeholder="Ad Soyad"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{ width: "100%", padding: "10px", marginTop: "15px" }}
        />

        <input
            type="text"
            placeholder="Telefon"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ width: "100%", padding: "10px", marginTop: "15px" }}
        />

        <input
            type="text"
            placeholder="İl"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{ width: "100%", padding: "10px", marginTop: "15px" }}
        />

        <input
            type="text"
            placeholder="İlçe"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            style={{ width: "100%", padding: "10px", marginTop: "15px" }}
        />

        <textarea
            placeholder="Açık Adres"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={4}
            style={{ width: "100%", padding: "10px", marginTop: "15px" }}
        />

        <textarea
            placeholder="Sipariş Notu (İsteğe Bağlı)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            style={{ width: "100%", padding: "10px", marginTop: "15px" }}
        />
    </div>

    <div
        style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "20px",
            height: "fit-content"
        }}
    >
        <h2>Sipariş Özeti</h2>

        <p>Ara Toplam: <strong>{totalPrice.toLocaleString("tr-TR")} ₺</strong></p>

        <p>
            Kargo:
            <strong>
                {shippingFee === 0
                    ? " Ücretsiz"
                    : ` ${shippingFee.toLocaleString("tr-TR")} ₺`}
            </strong>
        </p>

        <hr />

        <h3>Genel Toplam: {grandTotal.toLocaleString("tr-TR")} ₺</h3>

        <button
            onClick={checkout}
            style={{
                width: "100%",
                padding: "14px",
                marginTop: "20px",
                cursor: "pointer",
                fontSize: "16px"
            }}
        >
            Siparişi Tamamla
        </button>
    </div>
</div>

    </>

)}

        </div>

        

    );
    
    
    }

export default Cart;