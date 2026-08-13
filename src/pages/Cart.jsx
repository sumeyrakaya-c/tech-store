import { useEffect, useState } from "react";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import "../styles/Cart.css";

function Cart() {

    const [cart, setCart] = useState([]);
    const [showCheckout, setShowCheckout] = useState(false);

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [district, setDistrict] = useState("");
    const [address, setAddress] = useState("");
    const [note, setNote] = useState("");

    const [paymentMethod, setPaymentMethod] = useState("card");

    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");


    // ==============================
    // SEPETİ GETİR
    // ==============================

    const loadCart = () => {

        fetch("http://localhost:5000/api/cart")
            .then(res => res.json())
            .then(data => setCart(data))
            .catch(err => console.log(err));

    };


    // ==============================
    // ADET GÜNCELLE
    // ==============================

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


    // ==============================
    // ÜRÜN SİL
    // ==============================

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


    // ==============================
    // SON KULLANMA TARİHİ
    // ==============================

    const handleExpiryChange = (e) => {

        let value = e.target.value.replace(/\D/g, "");

        if (value.length > 4) {
            value = value.slice(0, 4);
        }

        if (value.length >= 3) {
            value = value.slice(0, 2) + "/" + value.slice(2);
        }

        setExpiry(value);

    };


    // ==============================
    // KART NUMARASI
    // ==============================

    const handleCardNumberChange = (e) => {

        let value = e.target.value.replace(/\D/g, "");

        value = value.slice(0, 16);

        value = value.match(/.{1,4}/g)?.join(" ") || "";

        setCardNumber(value);

    };


    // ==============================
    // CVV
    // ==============================

    const handleCvvChange = (e) => {

        const value = e.target.value
            .replace(/\D/g, "")
            .slice(0, 3);

        setCvv(value);

    };


    // ==============================
    // SİPARİŞ
    // ==============================

    const checkout = async () => {

        if (
            !fullName ||
            !phone ||
            !city ||
            !district ||
            !address
        ) {

            alert("Lütfen teslimat bilgilerini eksiksiz doldurun.");
            return;

        }


        if (paymentMethod === "card") {

            if (
                cardNumber.replace(/\s/g, "").length !== 16 ||
                !cardName ||
                expiry.length !== 5 ||
                cvv.length !== 3
            ) {

                alert("Lütfen kart bilgilerini eksiksiz doldurun.");
                return;

            }

        }


        try {

            const user = JSON.parse(
                localStorage.getItem("user")
            );


            if (!user) {

                alert(
                    "Sipariş verebilmek için giriş yapmalısınız."
                );

                return;

            }


            const response = await fetch(
                "http://localhost:5000/api/orders",
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        userId: user.id,

                        fullName,
                        phone,
                        city,
                        district,
                        address,
                        note,

                        subtotal: totalPrice,

                        shippingFee,

                        totalPrice: grandTotal

                    })

                }
            );


            const data = await response.json();


            if (response.ok) {

                setCart([]);

                setShowCheckout(false);

                setFullName("");
                setPhone("");
                setCity("");
                setDistrict("");
                setAddress("");
                setNote("");

                setCardNumber("");
                setCardName("");
                setExpiry("");
                setCvv("");

                alert(data.message);

            } else {

                alert(
                    data.message ||
                    "Sipariş oluşturulamadı."
                );

            }

        } catch (error) {

            console.log(error);

            alert(
                "Sipariş sırasında bir hata oluştu."
            );

        }

    };


    useEffect(() => {

        loadCart();

    }, []);


    // ==============================
    // HESAPLAMALAR
    // ==============================

    const totalPrice = cart.reduce(
        (total, item) =>
            total + Number(item.price) * item.quantity,
        0
    );


    const totalItems = cart.reduce(
        (total, item) =>
            total + Number(item.quantity),
        0
    );


    const shippingFee =
        totalPrice >= 1000 ? 0 : 100;


    const grandTotal =
        totalPrice + shippingFee;


    return (

        <div className="cart-page">

            {/* ==============================
                BAŞLIK
            ============================== */}

            <div className="cart-header">

                <div>

                    <span className="cart-eyebrow">
                        TEKNOHUP
                    </span>

                    <h1>Sepetim</h1>

                    <p>
                        {cart.length > 0
                            ? `${totalItems} ürün sepetinizde`
                            : "Sepetinizde henüz ürün bulunmuyor."
                        }
                    </p>

                </div>

                {cart.length > 0 && (

                    <div className="cart-count">

                        <FiShoppingBag />

                        <span>
                            {totalItems}
                        </span>

                    </div>

                )}

            </div>


            {/* ==============================
                BOŞ SEPET
            ============================== */}

            {cart.length === 0 ? (

                <div className="empty-cart">

                    <div className="empty-cart-icon">

                        <FiShoppingBag />

                    </div>

                    <h2>Sepetiniz şu an boş</h2>

                    <p>
                        Beğendiğiniz teknoloji ürünlerini
                        sepete ekleyerek alışverişe başlayabilirsiniz.
                    </p>

                    <button
                        className="continue-shopping-btn"
                        onClick={() => {
                            window.location.href = "/";
                        }}
                    >
                        Alışverişe Devam Et
                        <FiArrowRight />
                    </button>

                </div>

            ) : (

                <>

                    {/* ==============================
                        SEPET ÜRÜNLERİ
                    ============================== */}

                    <div className="cart-layout">

                        <div className="cart-products">

                            <div className="cart-section-title">

                                <h2>Sepetiniz</h2>

                                <span>
                                    {cart.length} farklı ürün
                                </span>

                            </div>


                            {cart.map(item => (

                                <div
                                    className="cart-item"
                                    key={item.id}
                                >

                                    <div className="cart-item-image">

                                        <img
                                            src={`http://localhost:5000/uploads/${item.image}`}
                                            alt={item.name}
                                        />

                                    </div>


                                    <div className="cart-item-info">

                                        <h3>
                                            {item.name}
                                        </h3>

                                        <span className="cart-item-price">
                                            {Number(item.price).toLocaleString("tr-TR")} ₺
                                        </span>


                                        <div className="cart-item-bottom">

                                            <div className="quantity-control">

                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                >
                                                    <FiMinus />
                                                </button>

                                                <span>
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                >
                                                    <FiPlus />
                                                </button>

                                            </div>


                                            <button
                                                className="remove-cart-item"
                                                onClick={() =>
                                                    deleteItem(item.id)
                                                }
                                            >
                                                <FiTrash2 />
                                                Ürünü Sil
                                            </button>

                                        </div>

                                    </div>


                                    <div className="cart-item-total">

                                        {(
                                            Number(item.price) *
                                            item.quantity
                                        ).toLocaleString("tr-TR")} ₺

                                    </div>

                                </div>

                            ))}

                        </div>


                        {/* ==============================
                            SİPARİŞ ÖZETİ
                        ============================== */}

                        <div className="cart-summary">

                            <h2>Sipariş Özeti</h2>

                            <div className="summary-row">

                                <span>Ara Toplam</span>

                                <strong>
                                    {totalPrice.toLocaleString("tr-TR")} ₺
                                </strong>

                            </div>


                            <div className="summary-row">

                                <span>Kargo</span>

                                <strong>

                                    {shippingFee === 0
                                        ? "Ücretsiz"
                                        : `${shippingFee.toLocaleString("tr-TR")} ₺`
                                    }

                                </strong>

                            </div>


                            <div className="summary-line" />


                            <div className="summary-total">

                                <span>Genel Toplam</span>

                                <strong>
                                    {grandTotal.toLocaleString("tr-TR")} ₺
                                </strong>

                            </div>


                            {!showCheckout && (

                                <button
                                    className="checkout-start-btn"
                                    onClick={() =>
                                        setShowCheckout(true)
                                    }
                                >
                                    Satın Al
                                    <FiArrowRight />
                                </button>

                            )}

                        </div>

                    </div>


                    {/* ==============================
                        ÖDEME / TESLİMAT
                    ============================== */}

                    {showCheckout && (

                        <div className="checkout-area">

                            <div className="checkout-header">

                                <div>

                                    <span>
                                        SİPARİŞ
                                    </span>

                                    <h2>
                                        Ödeme ve Teslimat
                                    </h2>

                                </div>

                                <button
                                    onClick={() =>
                                        setShowCheckout(false)
                                    }
                                >
                                    Geri Dön
                                </button>

                            </div>


                            <div className="checkout-grid">


                                {/* TESLİMAT */}

                                <div className="checkout-card">

                                    <h2>
                                        Teslimat Bilgileri
                                    </h2>


                                    <input
                                        type="text"
                                        placeholder="Ad Soyad"
                                        value={fullName}
                                        onChange={(e) =>
                                            setFullName(e.target.value)
                                        }
                                    />


                                    <input
                                        type="text"
                                        placeholder="Telefon"
                                        value={phone}
                                        onChange={(e) =>
                                            setPhone(e.target.value)
                                        }
                                    />


                                    <div className="two-inputs">

                                        <input
                                            type="text"
                                            placeholder="İl"
                                            value={city}
                                            onChange={(e) =>
                                                setCity(e.target.value)
                                            }
                                        />

                                        <input
                                            type="text"
                                            placeholder="İlçe"
                                            value={district}
                                            onChange={(e) =>
                                                setDistrict(e.target.value)
                                            }
                                        />

                                    </div>


                                    <textarea
                                        placeholder="Açık Adres"
                                        value={address}
                                        onChange={(e) =>
                                            setAddress(e.target.value)
                                        }
                                        rows={4}
                                    />


                                    <textarea
                                        placeholder="Sipariş Notu (İsteğe Bağlı)"
                                        value={note}
                                        onChange={(e) =>
                                            setNote(e.target.value)
                                        }
                                        rows={3}
                                    />

                                </div>


                                {/* ÖDEME */}

                                <div className="checkout-card">

                                    <h2>
                                        Ödeme Yöntemi
                                    </h2>


                                    <div className="payment-options">

                                        <label>

                                            <input
                                                type="radio"
                                                checked={
                                                    paymentMethod === "cash"
                                                }
                                                onChange={() =>
                                                    setPaymentMethod("cash")
                                                }
                                            />

                                            Kapıda Ödeme

                                        </label>


                                        <label>

                                            <input
                                                type="radio"
                                                checked={
                                                    paymentMethod === "card"
                                                }
                                                onChange={() =>
                                                    setPaymentMethod("card")
                                                }
                                            />

                                            Banka / Kredi Kartı

                                        </label>

                                    </div>


                                    {paymentMethod === "card" && (

                                        <div className="card-box">

                                            <h3>
                                                Kart Bilgileri
                                            </h3>


                                            <input
                                                type="text"
                                                placeholder="Kart Numarası"
                                                value={cardNumber}
                                                onChange={
                                                    handleCardNumberChange
                                                }
                                                maxLength={19}
                                            />


                                            <input
                                                type="text"
                                                placeholder="Kart Üzerindeki İsim"
                                                value={cardName}
                                                onChange={(e) =>
                                                    setCardName(
                                                        e.target.value
                                                    )
                                                }
                                            />


                                            <div className="card-row">

                                                <input
                                                    type="text"
                                                    placeholder="AA/YY"
                                                    value={expiry}
                                                    onChange={
                                                        handleExpiryChange
                                                    }
                                                    maxLength={5}
                                                />


                                                <input
                                                    type="password"
                                                    placeholder="CVV"
                                                    value={cvv}
                                                    onChange={
                                                        handleCvvChange
                                                    }
                                                    maxLength={3}
                                                />

                                            </div>

                                            <small>
                                                Kart bilgileriniz güvenli ödeme
                                                sistemi üzerinden işlenir.
                                            </small>

                                        </div>

                                    )}


                                    <div className="final-summary">

                                        <div>
                                            <span>Ara Toplam</span>
                                            <strong>
                                                {totalPrice.toLocaleString("tr-TR")} ₺
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Kargo</span>
                                            <strong>
                                                {shippingFee === 0
                                                    ? "Ücretsiz"
                                                    : `${shippingFee} ₺`
                                                }
                                            </strong>
                                        </div>

                                        <div className="final-total">

                                            <span>Toplam</span>

                                            <strong>
                                                {grandTotal.toLocaleString("tr-TR")} ₺
                                            </strong>

                                        </div>

                                    </div>


                                    <button
                                        className="complete-order-btn"
                                        onClick={checkout}
                                    >
                                        Siparişi Tamamla
                                    </button>

                                </div>

                            </div>

                        </div>

                    )}

                </>

            )}

        </div>

    );

}

export default Cart;