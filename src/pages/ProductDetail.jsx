import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductDescription from "../components/ProductDescription";
import ProductInfo from "../components/ProductInfo";
import ProductGallery from "../components/ProductGallery";
import PurchaseCard from "../components/PurchaseCard";
import ProductSpecs from "../components/ProductSpecs";
import ProductQuestions from "../components/ProductQuestions";
import ReviewSection from "../components/ReviewSection";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import "../styles/ProductDetail.css";

function ProductDetail() {
    const { id } = useParams();
const navigate = useNavigate();

const [product, setProduct] = useState(null);

useEffect(() => {

    fetch(`http://localhost:5000/api/products/${id}`)
        .then((res) => res.json())
        .then((data) => setProduct(data))
        .catch((err) => console.log(err));

}, [id]);

if (!product) {
    return <h2>Yükleniyor...</h2>;
}
    
    return (
        <>
    <div className="back-container">

        <button
            className="back-button"
            onClick={() => navigate(-1)}
        >
            <FiArrowLeft />
            Geri
        </button>

    </div>

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