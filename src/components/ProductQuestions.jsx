import "../styles/ProductQuestions.css";

function ProductQuestions() {
    return (
        <section className="product-questions">
    <div className="questions-header">

        <div className="questions-info">
            <h3 className="questions-title">
                Ürün Soruları & Cevapları
            </h3>

            <span className="question-count">
                2.364 soru soruldu
            </span>
        </div>

        <button className="see-all">
            Tümü →
        </button>

    </div>
</section>
    );
}

export default ProductQuestions;