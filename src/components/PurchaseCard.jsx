import "../styles/PurchaseCard.css";

import {
    FiTruck,
    FiShield,
    FiRefreshCw,
    FiShare2
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import { useLanguage } from "../context/LanguageContext";


function PurchaseCard({ product }) {

    const navigate = useNavigate();

    const { t } = useLanguage();


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

                alert(
                    data.message ||
                    t("productAddedToCart")
                );


                window.dispatchEvent(
                    new Event("cartUpdated")
                );


            } else {

                alert(
                    data.message ||
                    t("productCouldNotBeAdded")
                );

            }


        } catch (error) {

            console.log(
                "SEPETE EKLEME HATASI:",
                error
            );


            alert(
                t("addToCartError")
            );

        }

    };


    // =========================================
    // HIZLI AL
    // =========================================

    const buyNow = async () => {

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


            if (!response.ok) {

                alert(
                    data.message ||
                    t("productCouldNotBeAdded")
                );

                return;

            }


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
                t("quickBuyError")
            );

        }

    };


    // =========================================
    // PAYLAŞ
    // =========================================

    const shareProduct = async () => {

        if (!product?.id) {

            return;

        }


        const shareUrl =
            `${window.location.origin}/product/${product.id}`;


        try {

            // =========================================
            // TARAYICI PAYLAŞIM ÖZELLİĞİ
            // =========================================

            if (navigator.share) {

                await navigator.share({

                    title:
                        product.name ||
                        t("product"),

                    text:
                        `${product.name || t("thisProduct")} ${t("checkItOut")}`,

                    url:
                        shareUrl

                });


                return;

            }


            // =========================================
            // PANoya KOPYALA
            // =========================================

            await navigator.clipboard.writeText(
                shareUrl
            );


            alert(
                t("productLinkCopied")
            );


        } catch (error) {

            // Kullanıcı paylaşım penceresini
            // kapattıysa hata göstermiyoruz

            if (
                error?.name ===
                "AbortError"
            ) {

                return;

            }


            console.log(
                "PAYLAŞMA HATASI:",
                error
            );


            alert(
                t("productCouldNotBeShared")
            );

        }

    };


    return (

        <div className="purchase-wrapper">


            {/* =========================
                PAYLAŞ BUTONU
            ========================= */}

            <button
                type="button"
                className="share-btn"
                onClick={shareProduct}
                title={t("shareProduct")}
            >

                <FiShare2 />

            </button>


            <div className="purchase-card">


                {/* =========================
                    KARGO
                ========================= */}

                <div className="service">

                    <FiTruck />

                    <span>
                        {t("freeShipping")}
                    </span>

                </div>


                {/* =========================
                    ÖDEME
                ========================= */}

                <div className="service">

                    <FiShield />

                    <span>
                        {t("securePayment")}
                    </span>

                </div>


                {/* =========================
                    İADE
                ========================= */}

                <div className="service">

                    <FiRefreshCw />

                    <span>
                        {t("easyReturn")}
                    </span>

                </div>


                {/* =========================
                    HIZLI AL
                ========================= */}

                <button
                    className="buy-now"
                    onClick={buyNow}
                >

                    ⚡ {t("buyNow")}

                </button>


                {/* =========================
                    SEPETE EKLE
                ========================= */}

                <button
                    className="add-cart"
                    onClick={addToCart}
                >

                    🛒 {t("addToCart")}

                </button>


            </div>

        </div>

    );

}


export default PurchaseCard;