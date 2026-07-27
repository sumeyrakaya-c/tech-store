import "../styles/ProductGallery.css";
import { useState } from "react";
import { FiHeart, FiChevronLeft, FiChevronRight } from "react-icons/fi";

function ProductGallery({ product }) {

    const [selectedImage, setSelectedImage] = useState(0);

    const nextImage = () => {
        setSelectedImage((prev) =>
            prev === product.images.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setSelectedImage((prev) =>
            prev === 0 ? product.images.length - 1 : prev - 1
        );
    };

    return (
        <div className="product-gallery">

            <button className="favorite-btn">
                <FiHeart />
            </button>

            {product.images.length > 1 && (
                <button className="gallery-arrow left-arrow" onClick={prevImage}>
                    <FiChevronLeft />
                </button>
            )}

            <img
                className="main-image"
                src={
                    product.images.length
                        ? product.images[selectedImage]
                        : "https://placehold.co/350x400?text=Resim+Yok"
                }
                alt={product.name}
            />

            <div className="phone-shadow"></div>

            {product.images.length > 1 && (
                <button className="gallery-arrow right-arrow" onClick={nextImage}>
                    <FiChevronRight />
                </button>
            )}

            {product.images.length > 1 && (
                <div className="thumbnail-list">

                    {product.images.map((image, index) => (

                        <img
                            key={index}
                            src={image}
                            alt={product.name}
                            className={
                                selectedImage === index
                                    ? "thumbnail active"
                                    : "thumbnail"
                            }
                            onClick={() => setSelectedImage(index)}
                        />

                    ))}

                </div>
            )}

        </div>
    );
}

export default ProductGallery;