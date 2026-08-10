import { useEffect, useState } from "react";

import HeroBanner from "../components/HeroBanner";
import ProductSection from "../components/ProductSection";

function Home({ search, category }) {

    const [products, setProducts] = useState([]);

    useEffect(() => {

        fetch(
            `http://localhost:5000/api/products?search=${encodeURIComponent(search || "")}&category=${category || ""}`
        )
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.log(err));

    }, [search, category]);

    useEffect(() => {

        const scrollPosition = sessionStorage.getItem("scrollPosition");

        if (scrollPosition) {

            setTimeout(() => {

                window.scrollTo(0, Number(scrollPosition));

                sessionStorage.removeItem("scrollPosition");

            }, 50);

        }

    }, [products]);

    return (

        <>

            <HeroBanner />



            {products.length === 0 ? (

                <h2
                    style={{
                        textAlign: "center",
                        marginTop: "50px",
                        color: "#666"
                    }}
                >
                    Aradığınız kriterlere uygun ürün bulunamadı.
                </h2>

            ) : (

                <>

                    <ProductSection
                        title="🔥 İndirimdekiler"
                        products={products}
                    />

                    <ProductSection
                        title="🆕 Yeni Gelenler"
                        products={products}
                    />

                    <ProductSection
                        title="🏆 En Çok Satanlar"
                        products={products}
                    />

                </>

            )}

        </>

    );

}

export default Home;