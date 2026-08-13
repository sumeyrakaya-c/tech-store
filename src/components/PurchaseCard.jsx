import "../styles/PurchaseCard.css";

import {
    FiTruck,
    FiShield,
    FiRefreshCw,
    FiShare2
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";


function PurchaseCard({ product }) {

    const navigate = useNavigate();


    // =========================================
    // SEPETE EKLE
    // =========================================

    const addToCart = async () => {

        try {

            const response = await fetch(
                "http://localhost:5000/api/cart",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        product_id: product.id,
                        quantity: 1
                    })
                }
            );


            const data = await response.json();


            if (response.ok) {

                alert(data.message);

            } else {

                alert(
                    data.message ||
                    "Ürün sepete eklenemedi."
                );

            }


        } catch (error) {

            console.log(
                "SEPETE EKLEME HATASI:",
                error
            );

            alert(
                "Ürün sepete eklenirken bir hata oluştu."
            );

        }

    };


    // =========================================
    // HIZLI AL
    // =========================================

    const buyNow = async () => {

        try {

            // Önce ürünü sepete ekle
            const response = await fetch(
                "http://localhost:5000/api/cart",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        product_id: product.id,
                        quantity: 1
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Ürün sepete eklenemedi."
                );

                return;

            }


            // Ürün başarıyla eklendiyse
            // sepet sayfasına git
            navigate("/cart", {

                state: {
                    quickBuy: true
                }

            });


        } catch (error) {

            console.log(
                "HIZLI AL HATASI:",
                error
            );

            alert(
                "Hızlı Al işlemi sırasında bir hata oluştu."
            );

        }

    };


    return (

        <div className="purchase-wrapper">


            {/* =========================
                PAYLAŞ
            ========================= */}

            <button className="share-btn">

                <FiShare2 />

            </button>


            <div className="purchase-card">


                {/* =========================
                    KARGO
                ========================= */}

                <div className="service">

                    <FiTruck />

                    <span>
                        Ücretsiz Kargo
                    </span>

                </div>


                {/* =========================
                    ÖDEME
                ========================= */}

                <div className="service">

                    <FiShield />

                    <span>
                        Güvenli Ödeme
                    </span>

                </div>


                {/* =========================
                    İADE
                ========================= */}

                <div className="service">

                    <FiRefreshCw />

                    <span>
                        Kolay İade
                    </span>

                </div>


                {/* =========================
                    HIZLI AL
                ========================= */}

                <button
                    className="buy-now"
                    onClick={buyNow}
                >
                    ⚡ Hızlı Al
                </button>


                {/* =========================
                    SEPETE EKLE
                ========================= */}

                <button
                    className="add-cart"
                    onClick={addToCart}
                >
                    🛒 Sepete Ekle
                </button>


            </div>

        </div>

    );

}


export default PurchaseCard;