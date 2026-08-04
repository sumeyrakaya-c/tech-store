import ProductCard from "./ProductCard";
import "../styles/ProductSection.css";

function ProductSection({ title, products }) {

    if (!products || products.length === 0) return null;

    return (

        <section className="product-section">

            <div className="section-header">

                <h2>{title}</h2>

                <button>Tümünü Gör</button>

            </div>

            <div className="section-products">

                {products.map((product) => (

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

        </section>

    );

}

export default ProductSection;