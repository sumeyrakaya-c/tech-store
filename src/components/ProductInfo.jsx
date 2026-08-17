import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/ProductInfo.css";

import { useLanguage } from "../context/LanguageContext";


function ProductInfo({ product }) {

    const navigate = useNavigate();

    const { t } = useLanguage();

    const [variants, setVariants] = useState([]);

    const [storageOptions, setStorageOptions] = useState([]);

    const [selectedStorage, setSelectedStorage] = useState("");


    // =========================================
    // RENK VARYANTLARINI GETİR
    // =========================================

    useEffect(() => {

        if (!product?.variant_group_id) {

            setVariants([]);

            return;

        }


        fetch(
            "http://localhost:5000/api/products"
        )
            .then((res) => {

                if (!res.ok) {

                    throw new Error(
                        t("dataCouldNotLoad")
                    );

                }

                return res.json();

            })
            .then((data) => {

                const sameVariants = data.filter(
                    (item) =>
                        Number(item.variant_group_id) ===
                        Number(product.variant_group_id)
                );


                setVariants(
                    sameVariants
                );

            })
            .catch((err) => {

                console.error(
                    "Renk varyantları alınamadı:",
                    err
                );

                setVariants([]);

            });

    }, [product?.variant_group_id, t]);


    // =========================================
    // DEPOLAMA SEÇENEKLERİNİ GETİR
    // =========================================

    useEffect(() => {

        if (!product?.variant_group_id) {

            setStorageOptions([]);

            setSelectedStorage("");

            return;

        }


        fetch(
            `http://localhost:5000/api/product-storage-options/${product.variant_group_id}`
        )
            .then((res) => {

                if (!res.ok) {

                    throw new Error(
                        t("dataCouldNotLoad")
                    );

                }

                return res.json();

            })
            .then((data) => {

                setStorageOptions(
                    data || []
                );


                // İlk açılışta mevcut ürünün
                // depolama bilgisini teknik özellikten
                // sadece SEÇİLİ GÖSTERMEK için kullanıyoruz.

                if (
                    product?.variant_group_id
                ) {

                    fetch(
                        `http://localhost:5000/api/product-specs/${product.id}`
                    )
                        .then((res) => {

                            if (!res.ok) {

                                return null;

                            }

                            return res.json();

                        })
                        .then((specs) => {

                            if (
                                specs?.storage
                            ) {

                                setSelectedStorage(
                                    specs.storage
                                );

                            } else if (
                                data?.length > 0
                            ) {

                                setSelectedStorage(
                                    data[0].storage
                                );

                            }

                        })
                        .catch(() => {

                            if (
                                data?.length > 0
                            ) {

                                setSelectedStorage(
                                    data[0].storage
                                );

                            }

                        });

                }

            })
            .catch((err) => {

                console.error(
                    "Depolama seçenekleri alınamadı:",
                    err
                );

                setStorageOptions([]);

                setSelectedStorage("");

            });

    }, [
        product?.variant_group_id,
        product?.id,
        t
    ]);


    // =========================================
    // RENK DEĞİŞTİR
    // =========================================

    const handleColorChange = (variant) => {

        if (!variant?.id) {

            return;

        }


        if (
            Number(variant.id) ===
            Number(product.id)
        ) {

            return;

        }


        navigate(
            `/product/${variant.id}`
        );

    };


    // =========================================
    // DEPOLAMA DEĞİŞTİR
    // =========================================

    const handleStorageChange = (storageItem) => {

        if (!storageItem?.storage) {

            return;

        }


        // SADECE DEPOLAMA SEÇİMİNİ DEĞİŞTİR.
        //
        // Ürün değişmez.
        // Renk değişmez.
        // URL değişmez.
        // Teknik özellikler değişmez.

        setSelectedStorage(
            storageItem.storage
        );

    };


    // =========================================
    // FİYAT
    // =========================================

    const basePrice =
        Number(product?.price || 0);


    const selectedStorageOption =
        storageOptions.find(
            (item) =>
                item.storage ===
                selectedStorage
        );


    const priceDifference =
        Number(
            selectedStorageOption?.price_difference || 0
        );


    const finalPrice =
        basePrice +
        priceDifference;


    return (

        <div className="product-info">


            {/* =========================================
                KATEGORİ
            ========================================= */}

            <p className="brand">

                {product?.category_name}

            </p>


            {/* =========================================
                ÜRÜN ADI
            ========================================= */}

            <h1 className="product-title">

                {product?.name}

            </h1>


            {/* =========================================
                DEĞERLENDİRME
            ========================================= */}

            <div className="rating">

                <span className="stars">

                    ⭐⭐⭐⭐⭐

                </span>


                <span>

                    {product?.rating || "5.0"}

                </span>


                <span className="review-count">

                    (124 {t("reviews")})

                </span>

            </div>


            {/* =========================================
                FİYAT
            ========================================= */}

            <h2 className="price">

                {finalPrice.toLocaleString("tr-TR")} ₺

            </h2>


            <hr />


            {/* =========================================
                DEPOLAMA
            ========================================= */}

            {storageOptions.length > 0 && (

                <div className="option-group">

                    <h3>

                        {t("storageOption")}

                    </h3>


                    <div className="storage-options">

                        {storageOptions.map(
                            (storageItem) => (

                                <button
                                    key={storageItem.id}
                                    type="button"

                                    className={
                                        storageItem.storage ===
                                        selectedStorage
                                            ? "active"
                                            : ""
                                    }

                                    onClick={() =>
                                        handleStorageChange(
                                            storageItem
                                        )
                                    }
                                >

                                    {storageItem.storage}

                                </button>

                            )
                        )}

                    </div>

                </div>

            )}


            {/* =========================================
                RENK
            ========================================= */}

            <div className="option-group">

                <h3>

                    {t("color")}

                </h3>


                <div className="color-options">

                    {variants.map((variant) => (

                        <button
                            key={variant.id}

                            type="button"

                            className={
                                `color ${
                                    Number(variant.id) ===
                                    Number(product.id)
                                        ? "selected"
                                        : ""
                                }`
                            }

                            style={{
                                backgroundColor:
                                    variant.color_code ||
                                    "#D1D5DB"
                            }}

                            title={
                                variant.color_name ||
                                t("color")
                            }

                            onClick={() =>
                                handleColorChange(
                                    variant
                                )
                            }

                        />

                    ))}

                </div>


                {/* =========================================
                    SEÇİLİ RENK
                ========================================= */}

                {product?.color_name && (

                    <p className="selected-color-name">

                        {product.color_name}

                    </p>

                )}

            </div>


        </div>

    );

}


export default ProductInfo;