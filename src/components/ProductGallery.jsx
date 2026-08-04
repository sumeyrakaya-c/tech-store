import "../styles/ProductGallery.css";
import { useEffect, useState } from "react";
import { FiHeart, FiChevronLeft, FiChevronRight } from "react-icons/fi";

function ProductGallery({ product }) {

    const [selectedImage, setSelectedImage] = useState(0);

    const [isFavorite, setIsFavorite] = useState(false);

const user = JSON.parse(localStorage.getItem("user"));

    const images = [
        product.image && `http://localhost:5000/uploads/${product.image}`,
        product.image2 && `http://localhost:5000/uploads/${product.image2}`,
        product.image3 && `http://localhost:5000/uploads/${product.image3}`
    ].filter(Boolean);

    const nextImage = (e) => {

        e.preventDefault();
        e.stopPropagation();

        setSelectedImage((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
        );

    };

useEffect(() => {

    if (!user) return;

    fetch(`http://localhost:5000/api/favorites/${user.id}/${product.id}`)
        .then(res => res.json())
        .then(data => setIsFavorite(data.isFavorite))
        .catch(err => console.log(err));

}, [product.id]);

    const prevImage = (e) => {

        e.preventDefault();
        e.stopPropagation();

        setSelectedImage((prev) =>
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
                    product_id: product.id

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
                    product_id: product.id

                })

            });

            const data = await res.json();

            alert(data.message);

            setIsFavorite(false);

        }

    } catch (error) {

        console.log(error);

    }

};

    return (

        <div className="product-gallery">

           <button
    type="button"
    className="favorite-btn"
    onClick={toggleFavorite}
    style={{
        color: isFavorite ? "red" : "#555"
    }}
>
    <FiHeart />
</button>

            {images.length > 1 && (

                <button
                    type="button"
                    className="gallery-arrow left-arrow"
                    onClick={prevImage}
                >
                    <FiChevronLeft />
                </button>

            )}

            <img
                className="main-image"
                src={
                    images.length
                        ? images[selectedImage]
                        : "https://placehold.co/350x400?text=Resim+Yok"
                }
                alt={product.name}
            />

            <div className="phone-shadow"></div>

            {images.length > 1 && (

                <button
                    type="button"
                    className="gallery-arrow right-arrow"
                    onClick={nextImage}
                >
                    <FiChevronRight />
                </button>

            )}

            {images.length > 1 && (

                <div className="thumbnail-list">

                    {images.map((image, index) => (

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