import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import ProductDescription from "../components/ProductDescription";
import ProductInfo from "../components/ProductInfo";
import ProductGallery from "../components/ProductGallery";
import PurchaseCard from "../components/PurchaseCard";
import ProductSpecs from "../components/ProductSpecs";
import ProductQuestions from "../components/ProductQuestions";
import ReviewSection from "../components/ReviewSection";

import {
    FiArrowLeft,
    FiBarChart2
} from "react-icons/fi";

import { useLanguage } from "../context/LanguageContext";

import "../styles/ProductDetail.css";


function ProductDetail() {

    const { id } = useParams();

    const navigate = useNavigate();

    const { t } = useLanguage();

    const [product, setProduct] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =========================================
    // ÜRÜNÜ GETİR
    // =========================================

    useEffect(() => {

        const getProduct = async () => {

            try {

                setLoading(true);

                setError("");

                console.log(
                    "ÜRÜN ID:",
                    id
                );


                const response = await fetch(
                    `http://localhost:5000/api/products/${id}`,
                    {
                        headers: {
                            "Accept-Language":
                                localStorage.getItem("language") || "tr"
                        }
                    }
                );


                console.log(
                    "ÜRÜN API DURUMU:",
                    response.status
                );


                const data = await response.json();


                console.log(
                    "ÜRÜN API CEVABI:",
                    data
                );


                // =====================================
                // API HATA VERDİYSE
                // =====================================

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        t("productNotFound")
                    );

                }


                // =====================================
                // ÜRÜN KONTROLÜ
                // =====================================

                if (
                    !data ||
                    !data.id
                ) {

                    throw new Error(
                        t("invalidProduct")
                    );

                }


                // =====================================
                // ÜRÜNÜ SET ET
                // =====================================

                setProduct(data);


            } catch (err) {

                console.error(
                    "ÜRÜN DETAY HATASI:",
                    err
                );


                setError(
                    err.message ||
                    t("productLoadError")
                );


                setProduct(null);


            } finally {

                setLoading(false);

            }

        };


        if (id) {

            getProduct();

        } else {

            setError(
                t("productIdNotFound")
            );

            setLoading(false);

        }


    }, [id, t]);


    // =========================================
    // ÜRÜN KARŞILAŞTIRMAYA EKLE
    // =========================================

    const addToCompare = () => {

        try {

            const existingCompare =
                JSON.parse(
                    localStorage.getItem(
                        "compareProducts"
                    ) || "[]"
                );


            // -----------------------------------------
            // ÜRÜN ZATEN EKLİ Mİ?
            // -----------------------------------------

            const alreadyExists =
                existingCompare.some(
                    (item) =>
                        Number(item.id) ===
                        Number(product.id)
                );


            if (alreadyExists) {

                alert(
                    "Bu ürün zaten karşılaştırma listesinde."
                );

                return;

            }


            // -----------------------------------------
            // MAKSİMUM 3 ÜRÜN
            // -----------------------------------------

            if (existingCompare.length >= 3) {

                alert(
                    "Karşılaştırmaya en fazla 3 ürün ekleyebilirsiniz."
                );

                return;

            }


            // -----------------------------------------
            // ÜRÜNÜ EKLE
            // -----------------------------------------

            const updatedCompare = [
                ...existingCompare,
                product
            ];


            localStorage.setItem(
                "compareProducts",
                JSON.stringify(
                    updatedCompare
                )
            );


            console.log(
                "KARŞILAŞTIRMA LİSTESİ:",
                updatedCompare
            );


            alert(
                "Ürün karşılaştırma listesine eklendi."
            );


        } catch (error) {

            console.error(
                "KARŞILAŞTIRMA HATASI:",
                error
            );

        }

    };


    // =========================================
    // YÜKLENİYOR
    // =========================================

    if (loading) {

        return (

            <div className="product-detail-loading">

                <h2>
                    {t("productLoading")}
                </h2>

            </div>

        );

    }


    // =========================================
    // HATA
    // =========================================

    if (error || !product) {

        return (

            <div className="product-detail-error">

                <h2>
                    {t("productCouldNotLoad")}
                </h2>


                <p>
                    {error || t("productNotFound")}
                </p>


                <button
                    onClick={() => navigate(-1)}
                >

                    <FiArrowLeft />

                    {t("back")}

                </button>

            </div>

        );

    }


    // =========================================
    // ÜRÜN DETAY
    // =========================================

    return (

        <>

            {/* =====================================
                GERİ BUTONU
            ===================================== */}

            <div className="back-container">

                <button
                    className="back-button"
                    onClick={() => navigate(-1)}
                >

                    <FiArrowLeft />

                    {t("back")}

                </button>

            </div>


            {/* =====================================
                ÜRÜN ANA ALANI
            ===================================== */}

            <div className="product-detail">

                <ProductInfo
                    product={product}
                />


                <ProductGallery
                    product={product}
                />


                <PurchaseCard
                    product={product}
                />

            </div>


            {/* =====================================
                KARŞILAŞTIRMA BUTONU
            ===================================== */}

            <div className="product-compare-area">

                <button
                    type="button"
                    className="product-compare-button"
                    onClick={addToCompare}
                >

                    <FiBarChart2 />

                    <span>
                        Karşılaştır
                    </span>

                </button>


                <span className="compare-info">
                    En fazla 3 ürün karşılaştırabilirsiniz.
                </span>

            </div>


            {/* =====================================
                ALT BİLGİLER
            ===================================== */}

            <div className="product-bottom">

                <ProductDescription
                    product={product}
                />


                <ProductSpecs
                    product={product}
                />

            </div>


            {/* =====================================
                SORULAR
            ===================================== */}

            <ProductQuestions
                productId={product.id}
            />


            {/* =====================================
                YORUMLAR
            ===================================== */}

            <ReviewSection
                productId={product.id}
            />

        </>

    );

}


export default ProductDetail;