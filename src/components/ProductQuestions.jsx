import { useEffect, useState } from "react";
import "../styles/ProductQuestions.css";

function ProductQuestions({ productId }) {

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (!productId) return;

        setLoading(true);

        fetch(`http://localhost:5000/api/questions/product/${productId}`)
            .then((res) => {

                if (!res.ok) {
                    throw new Error("Sorular alınamadı.");
                }

                return res.json();

            })
            .then((data) => {

                console.log("Ürün soruları:", data);

                setQuestions(data);
                setLoading(false);

            })
            .catch((error) => {

                console.log("SORULAR HATASI:", error);

                setQuestions([]);
                setLoading(false);

            });

    }, [productId]);


    return (

        <section className="product-questions">

            {/* =========================
                BAŞLIK
            ========================= */}

            <div className="questions-header">

                <div className="questions-info">

                    <h3 className="questions-title">
                        Ürün Soruları & Cevapları
                    </h3>

                    <span className="question-count">
                        {questions.length} soru soruldu
                    </span>

                </div>


                <button
                    className="see-all"
                    type="button"
                >
                    Tümü →
                </button>

            </div>


            {/* =========================
                SORULAR
            ========================= */}

            <div className="questions-list">

                {loading ? (

                    <p className="questions-message">
                        Sorular yükleniyor...
                    </p>

                ) : questions.length === 0 ? (

                    <p className="questions-message">
                        Bu ürün için henüz soru sorulmamış.
                    </p>

                ) : (

                    questions.map((question) => (

                        <div
                            className="question-card"
                            key={question.id}
                        >

                            {/* KULLANICI */}

                            <div className="question-user">

                                <strong>
                                    {question.full_name || "Kullanıcı"}
                                </strong>

                            </div>


                            {/* SORU */}

                            <div className="question-text">

                                <strong>
                                    Soru:
                                </strong>

                                <span>
                                    {question.question}
                                </span>

                            </div>


                            {/* CEVAP */}

                            {question.answer && (

                                <div className="question-answer">

                                    <strong>
                                        Cevap:
                                    </strong>

                                    <span>
                                        {question.answer}
                                    </span>

                                </div>

                            )}

                        </div>

                    ))

                )}

            </div>

        </section>

    );

}

export default ProductQuestions;