import { useState } from "react";
import ProductCard from "./ProductCard";
import "../styles/ProductSection.css";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

function ProductSection({ title, products }) {

    const [startIndex, setStartIndex] = useState(0);

    if (!products || products.length === 0) return null;

    const visibleProducts = products.slice(startIndex, startIndex + 4);

    const nextSlide = () => {

        if (startIndex + 4 < products.length) {

            setStartIndex(startIndex + 1);

        }

    };

    const prevSlide = () => {

        if (startIndex > 0) {

            setStartIndex(startIndex - 1);

        }

    };

    return (

        <section className="product-section">

            <h2 className="section-title">

                {title}

            </h2>

            <div className="product-slider">

                <button
                    className="slider-btn"
                    onClick={prevSlide}
                >
                    <FiChevronLeft />
                </button>

                <div className="section-products">

                    {visibleProducts.map((product) => (

                        <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            price={Number(product.price)}
                            images={[
                                product.image && `http://localhost:5000/uploads/${product.image}`,
                                product.image2 && `http://localhost:5000/uploads/${product.image2}`,
                                product.image3 && `http://localhost:5000/uploads/${product.image3}`
                            ].filter(Boolean)}
                        />

                    ))}

                </div>

                <button
                    className="slider-btn"
                    onClick={nextSlide}
                >
                    <FiChevronRight />
                </button>

            </div>

        </section>

    );

}

export default ProductSection;