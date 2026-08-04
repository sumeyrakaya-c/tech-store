import { useEffect, useState } from "react";
import ProductSection from "../components/ProductSection";
import HeroBanner from "../components/HeroBanner";

function Home({ search, category }) {

    const [products, setProducts] = useState([]);

    // Ürünleri getir
    useEffect(() => {

        fetch(
            `http://localhost:5000/api/products?search=${encodeURIComponent(search || "")}&category=${category || ""}`
        )
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.log(err));

    }, [search, category]);

    // Scroll konumunu geri yükle
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

                <ProductSection
                    title="🆕 Yeni Gelenler"
                    products={products}
                />

            )}

        </>

    );

}

export default Home;