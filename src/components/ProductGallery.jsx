import { useState } from "react";

import {
    FiHeart,
    FiChevronLeft,
    FiChevronRight
} from "react-icons/fi";

import "../styles/ProductGallery.css";


function ProductGallery({ product }) {

    const [currentImage, setCurrentImage] = useState(0);
    const [favorite, setFavorite] = useState(false);


    // =========================================
    // ÜRÜN GÖRSELLERİNİ HAZIRLA
    // =========================================

    let images = [];


    // image
    if (product?.image) {
        images.push(product.image);
    }


    // image2
    if (product?.image2) {
        images.push(product.image2);
    }


    // image3
    if (product?.image3) {
        images.push(product.image3);
    }


    // Eğer backend ileride images dizisi gönderirse
    if (
        images.length === 0 &&
        Array.isArray(product?.images)
    ) {
        images = product.images;
    }


    // Eğer images JSON string olarak gelirse
    if (
        images.length === 0 &&
        typeof product?.images === "string"
    ) {

        try {

            const parsedImages =
                JSON.parse(product.images);

            if (Array.isArray(parsedImages)) {
                images = parsedImages;
            }

        } catch {

            images = [product.images];

        }

    }


    // =========================================
    // FOTOĞRAF URL'Sİ
    // =========================================

    const getImageUrl = (image) => {

        if (!image) {
            return "";
        }


        if (
            image.startsWith("http://") ||
            image.startsWith("https://") ||
            image.startsWith("/")
        ) {

            return image;

        }


        return `http://localhost:5000/uploads/${image}`;

    };


    // =========================================
    // SONRAKİ FOTOĞRAF
    // =========================================

    const nextImage = () => {

        if (images.length <= 1) {
            return;
        }


        setCurrentImage(
            (prev) =>
                (prev + 1) % images.length
        );

    };


    // =========================================
    // ÖNCEKİ FOTOĞRAF
    // =========================================

    const previousImage = () => {

        if (images.length <= 1) {
            return;
        }


        setCurrentImage(
            (prev) =>
                (prev - 1 + images.length) %
                images.length
        );

    };


    return (

        <div className="product-gallery">


            {/* =========================================
                FAVORİ
            ========================================= */}

            <button
                type="button"
                className="favorite-btn"
                onClick={() =>
                    setFavorite(!favorite)
                }
            >

                <FiHeart
                    style={{
                        color: favorite
                            ? "#EF4444"
                            : "#374151",

                        fill: favorite
                            ? "#EF4444"
                            : "none"
                    }}
                />

            </button>


            {/* =========================================
                ANA FOTOĞRAF
            ========================================= */}

            {images.length > 0 ? (

                <img
                    className="main-image"
                    src={getImageUrl(
                        images[currentImage]
                    )}
                    alt={
                        product?.name ||
                        "Ürün görseli"
                    }
                />

            ) : (

                <div
                    style={{
                        width: "370px",
                        height: "400px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#64748b",
                        textAlign: "center"
                    }}
                >

                    Ürün görseli bulunamadı.

                </div>

            )}


            {/* =========================================
                SOL OK
            ========================================= */}

            {images.length > 1 && (

                <button
                    type="button"
                    className="gallery-arrow left-arrow"
                    onClick={previousImage}
                >

                    <FiChevronLeft />

                </button>

            )}


            {/* =========================================
                SAĞ OK
            ========================================= */}

            {images.length > 1 && (

                <button
                    type="button"
                    className="gallery-arrow right-arrow"
                    onClick={nextImage}
                >

                    <FiChevronRight />

                </button>

            )}


            {/* =========================================
                KÜÇÜK FOTOĞRAFLAR
            ========================================= */}

            {images.length > 1 && (

                <div className="thumbnail-container">

                    {images.map(
                        (image, index) => (

                            <img
                                key={index}
                                className={
                                    `thumbnail ${
                                        currentImage === index
                                            ? "active"
                                            : ""
                                    }`
                                }
                                src={getImageUrl(image)}
                                alt={
                                    `${product?.name || "Ürün"} ${
                                        index + 1
                                    }`
                                }
                                onClick={() =>
                                    setCurrentImage(index)
                                }
                            />

                        )
                    )}

                </div>

            )}

        </div>

    );

}


export default ProductGallery;