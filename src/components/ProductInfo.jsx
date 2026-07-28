import "../styles/ProductInfo.css";
function ProductInfo({ product }) {
    return (
        <div className="product-info">

            <p className="brand">
                {product.category_name}
            </p>

            <h1 className="product-title">
                {product.name}
            </h1>

            <div className="rating">

                <span className="stars">
                    ⭐⭐⭐⭐⭐
                </span>

                <span>
                    {product.rating}
                </span>

                <span className="review-count">
                    (124 Değerlendirme)
                </span>

            </div>

            <h2 className="price">
                {Number(product.price).toLocaleString("tr-TR")} ₺
            </h2>

            <hr />

            <div className="option-group">

                <h3>Depolama</h3>

                <div className="storage-options">

                    <button>128 GB</button>

                    <button className="active">
                        256 GB
                    </button>

                    <button>512 GB</button>

                </div>

            </div>

            <div className="option-group">

                <h3>Renk</h3>

                <div className="color-options">

                    <button className="color black"></button>

                    <button className="color white"></button>

                    <button className="color blue"></button>

                    

                </div>
            </div>

        </div>
    );
}

export default ProductInfo;