import ProductCard from "../components/ProductCard";
import products from "../data/products";

function Home() {
    return (
        <div className="products">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    images={product.images}
                />
            ))}
        </div>
    );
}

export default Home;