import { useParams } from "react-router-dom";
import products from "../data/products";
import ProductDescription from "../components/ProductDescription";
import ProductInfo from "../components/ProductInfo";
import ProductGallery from "../components/ProductGallery";
import PurchaseCard from "../components/PurchaseCard";
import ProductSpecs from "../components/ProductSpecs";
import ProductQuestions from "../components/ProductQuestions";
import ReviewSection from "../components/ReviewSection";

import "../styles/ProductDetail.css";

function ProductDetail() {
    const { id } = useParams();

    const product = products.find(item => item.id === Number(id));

    if (!product) {
        return <h2>Ürün bulunamadı.</h2>;
    }

    return (
    <>
        <div className="product-detail">
            <ProductInfo product={product} />
            <ProductGallery product={product} />
            <PurchaseCard product={product} />
        </div>

        <div className="product-bottom">
            <ProductDescription product={product} />
            <ProductSpecs product={product} />
        </div>

        <ProductQuestions />

        <ReviewSection />
    </>
);

}

export default ProductDetail;