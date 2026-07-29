import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";

function Home() {

    const [products, setProducts] = useState([]);

    useEffect(() => {

        fetch("http://localhost:5000/api/products")
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.log(err));

    }, []);

    return (
        <div className="products">

            {products.map((product) => (

                <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={Number(product.price)}
                    images={
                        product.image
                            ? [`http://localhost:5000/uploads/${product.image}`]
                            : []
                    }
                />

            ))}

        </div>
    );

}

export default Home;