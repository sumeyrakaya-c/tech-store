import "../styles/ProductCard.css";
import { useEffect, useState } from "react";
import {
    FiHeart,
    FiChevronLeft,
    FiChevronRight,
} from "react-icons/fi";
import { Link } from "react-router-dom";

function ProductCard({
    id,
    name,
    price,
    images,
    onFavoriteRemoved
}) {
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {

    if (!user) return;

    fetch(`http://localhost:5000/api/favorites/${user.id}/${id}`)
        .then(res => res.json())
        .then(data => setIsFavorite(data.isFavorite))
        .catch(err => console.log(err));

}, [id]);

    const [isFavorite, setIsFavorite] = useState(false);

const user = JSON.parse(localStorage.getItem("user"));

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

    const toggleFavorite = async () => {

    if (!user) {

        alert("Favorilere eklemek için giriş yapmalısınız.");

        return;

    }

    try {

        if (!isFavorite) {

            const res = await fetch("http://localhost:5000/api/favorites", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    user_id: user.id,
                    product_id: id

                })

            });

            const data = await res.json();

            alert(data.message);

            setIsFavorite(true);

        } else {

            const res = await fetch("http://localhost:5000/api/favorites", {

                method: "DELETE",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    user_id: user.id,
                    product_id: id

                })

            });

            const data = await res.json();

            alert(data.message);

            setIsFavorite(false);

            if (onFavoriteRemoved) {
    onFavoriteRemoved(id);
}

        }

    } catch (error) {

        console.log(error);

    }

};

    const addToCart = async (productId) => {

    try {

        const response = await fetch("http://localhost:5000/api/cart", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                product_id: productId,
                quantity: 1

            })

        });

        const data = await response.json();

        alert(data.message);

    } catch (error) {

        console.log(error);

    }

};

    return (
        <div className="product-card">

           <div
    className="favorite-icon"
    onClick={toggleFavorite}
    style={{
        color: isFavorite ? "red" : "#555",
        cursor: "pointer"
    }}
>
    <FiHeart />
</div>

           <Link
    to={`/product/${id}`}
    className="product-link"
>

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

           <button
    type="button"
    onClick={() => addToCart(id)}
>
    Sepete Ekle
</button>
        </div>
    );
}

export default ProductCard;