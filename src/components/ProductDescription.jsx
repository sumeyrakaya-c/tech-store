import "../styles/ProductDescription.css";

function ProductDescription({ product }) {
    return (
        <div className="product-description">
            <h3>Ürün Açıklaması</h3>

            <p className="description-text">
                {product.description}
            </p>
        </div>
    );
}

export default ProductDescription;