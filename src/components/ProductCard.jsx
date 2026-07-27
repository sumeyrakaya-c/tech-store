import "../styles/ReviewCard.css";
import { useState } from "react";
import {
    FiHeart,
    FiChevronLeft,
    FiChevronRight,
} from "react-icons/fi";
import { Link } from "react-router-dom";

function ProductCard({ id, name, price, images }) {
    const [currentImage, setCurrentImage] = useState(0);

    const nextImage = (e) => {
        e.preventDefault();
        e.stopPropagation();

        setCurrentImage((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = (e) => {
        e.preventDefault();
        e.stopPropagation();

        setCurrentImage((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    return (
        <div className="product-card">

            <div className="favorite-icon">
                <FiHeart />
            </div>

            <Link to={`/product/${id}`} className="product-link">

                <div className="image-container">

                    {images.length > 1 && (
                        <button
                            type="button"
                            className="image-arrow left"
                            onClick={prevImage}
                        >
                            <FiChevronLeft />
                        </button>
                    )}

                    <img
                        src={images?.[currentImage] || "https://placehold.co/250x200"}
                        alt={name}
                    />

                    {images.length > 1 && (
                        <button
                            type="button"
                            className="image-arrow right"
                            onClick={nextImage}
                        >
                            <FiChevronRight />
                        </button>
                    )}

                </div>

                {images.length > 1 && (
                    <div className="image-dots">
                        {images.map((_, index) => (
                            <span
                                key={index}
                                className={`dot ${currentImage === index ? "active" : ""}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setCurrentImage(index);
                                }}
                            />
                        ))}
                    </div>
                )}

                <h3>{name}</h3>

                <p className="price">
                    {price.toLocaleString("tr-TR")} ₺
                </p>

            </Link>

            <button className="add-cart-btn">
                Sepete Ekle
            </button>

        </div>
    );
}

export default ProductCard;