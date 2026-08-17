import { useEffect, useState } from "react";

import "../styles/ProductSpecs.css";

import {
    FiCpu,
    FiHardDrive,
    FiMonitor,
    FiBatteryCharging,
    FiCamera,
    FiSmartphone
} from "react-icons/fi";

import { useLanguage } from "../context/LanguageContext";


function ProductSpecs({ product }) {

    const { language, t } = useLanguage();

    const [specs, setSpecs] = useState(null);


    // =========================================
    // TEKNİK ÖZELLİKLERİ GETİR
    // =========================================

    useEffect(() => {

        if (!product?.id) {
            return;
        }


        fetch(
            `http://localhost:5000/api/product-specs/${product.id}`
        )

            .then((res) => {

                if (!res.ok) {

                    throw new Error(
                        "Teknik özellikler alınamadı."
                    );

                }

                return res.json();

            })

            .then((data) => {

                setSpecs(data);

            })

            .catch((err) => {

                console.log(
                    "Teknik özellikler alınamadı:",
                    err
                );

            });

    }, [product?.id]);


    // =========================================
    // BOŞ DEĞER KONTROLÜ
    // =========================================

    const getSpecValue = (value) => {

        if (
            value === null ||
            value === undefined ||
            String(value).trim() === ""
        ) {

            return t("noInformation");

        }

        return value;

    };


    // =========================================
    // DİLE GÖRE DEĞER SEÇ
    // =========================================

    const getLanguageValue = (
        turkishValue,
        englishValue
    ) => {

        if (language === "en") {

            return getSpecValue(
                englishValue || turkishValue
            );

        }

        return getSpecValue(
            turkishValue
        );

    };


    return (

        <section className="product-specs">

            <h2>
                {t("technicalSpecifications")}
            </h2>


            <div className="specs-grid">


                {/* =========================
                    İŞLEMCİ
                ========================= */}

                <div className="spec-card">

                    <FiCpu />

                    <span>
                        {t("processor")}
                    </span>

                    <strong>

                        {getLanguageValue(
                            specs?.processor,
                            specs?.processor_en
                        )}

                    </strong>

                </div>


                {/* =========================
                    RAM
                ========================= */}

                <div className="spec-card">

                    <FiHardDrive />

                    <span>
                        {t("ram")}
                    </span>

                    <strong>

                        {getLanguageValue(
                            specs?.ram,
                            specs?.ram_en
                        )}

                    </strong>

                </div>


                {/* =========================
                    DEPOLAMA
                ========================= */}

                <div className="spec-card">

                    <FiHardDrive />

                    <span>
                        {t("storage")}
                    </span>

                    <strong>

                        {getLanguageValue(
                            specs?.storage,
                            specs?.storage_en
                        )}

                    </strong>

                </div>


                {/* =========================
                    EKRAN
                ========================= */}

                <div className="spec-card">

                    <FiMonitor />

                    <span>
                        {t("display")}
                    </span>

                    <strong>

                        {getLanguageValue(
                            specs?.display,
                            specs?.display_en
                        )}

                    </strong>

                </div>


                {/* =========================
                    PİL
                ========================= */}

                <div className="spec-card">

                    <FiBatteryCharging />

                    <span>
                        {t("battery")}
                    </span>

                    <strong>

                        {getLanguageValue(
                            specs?.battery,
                            specs?.battery_en
                        )}

                    </strong>

                </div>


                {/* =========================
                    KAMERA
                ========================= */}

                <div className="spec-card">

                    <FiCamera />

                    <span>
                        {t("camera")}
                    </span>

                    <strong>

                        {getLanguageValue(
                            specs?.camera,
                            specs?.camera_en
                        )}

                    </strong>

                </div>


                {/* =========================
                    İŞLETİM SİSTEMİ
                ========================= */}

                <div className="spec-card">

                    <FiSmartphone />

                    <span>
                        {t("operatingSystem")}
                    </span>

                    <strong>

                        {getLanguageValue(
                            specs?.operating_system,
                            specs?.operating_system_en
                        )}

                    </strong>

                </div>


            </div>

        </section>

    );

}


export default ProductSpecs;