import { useEffect, useState } from "react";

import "../styles/ProductDescription.css";

import { useLanguage } from "../context/LanguageContext";


function ProductDescription({ product }) {

    const { language, t } = useLanguage();

    const [isSpeaking, setIsSpeaking] = useState(false);


    // =========================================
    // AÇIKLAMAYI SESLENDİR
    // =========================================

    const speakDescription = () => {

        if (!product?.description) {
            return;
        }


        // Ses zaten çalıyorsa durdur

        if (window.speechSynthesis.speaking) {

            window.speechSynthesis.cancel();

            setIsSpeaking(false);

            return;

        }


        const speech =
            new SpeechSynthesisUtterance(
                product.description
            );


        // =========================================
        // DİLE GÖRE SES
        // =========================================

        speech.lang =
            language === "en"
                ? "en-US"
                : "tr-TR";


        speech.rate = 0.95;

        speech.pitch = 1;

        speech.volume = 1;


        speech.onstart = () => {

            setIsSpeaking(true);

        };


        speech.onend = () => {

            setIsSpeaking(false);

        };


        speech.onerror = () => {

            setIsSpeaking(false);

        };


        window.speechSynthesis.speak(
            speech
        );

    };


    // =========================================
    // COMPONENT KAPANIRSA SESİ DURDUR
    // =========================================

    useEffect(() => {

        return () => {

            window.speechSynthesis.cancel();

        };

    }, []);


    // =========================================
    // DİL DEĞİŞİNCE SESİ DURDUR
    // =========================================

    useEffect(() => {

        window.speechSynthesis.cancel();

        setIsSpeaking(false);

    }, [language]);


    return (

        <div className="product-description">

            <div className="description-header">

                <h3>
                    {t("productDescription")}
                </h3>


                <button
                    type="button"
                    className={
                        isSpeaking
                            ? "speak-button speaking"
                            : "speak-button"
                    }
                    onClick={speakDescription}
                >

                    <span>
                        {isSpeaking
                            ? "🔇"
                            : "🔊"
                        }
                    </span>


                    {isSpeaking
                        ? t("stop")
                        : t("listen")
                    }

                </button>

            </div>


            <p className="description-text">

                {product?.description}

            </p>

        </div>

    );

}


export default ProductDescription;