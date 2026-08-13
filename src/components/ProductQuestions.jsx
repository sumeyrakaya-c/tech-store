import { useEffect, useState } from "react";
import "../styles/ProductQuestions.css";

function ProductQuestions({ productId }) {

    const user = JSON.parse(localStorage.getItem("user"));

    const [questions, setQuestions] = useState([]);
    const [question, setQuestion] = useState("");
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [showAllQuestions, setShowAllQuestions] = useState(false);
    const [loading, setLoading] = useState(true);

    // =========================
    // SORULARI GETİR
    // =========================

    const loadQuestions = async () => {

        try {

            setLoading(true);

            const response = await fetch(
                `http://localhost:5000/api/questions/product/${productId}`
            );

            const data = await response.json();

            setQuestions(data);

        } catch (error) {

            console.log("Sorular alınamadı:", error);

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        if (productId) {
            loadQuestions();
        }

    }, [productId]);


    // =========================
    // SORU GÖNDER
    // =========================

    const submitQuestion = async () => {

        if (!user) {

            alert("Soru sormak için giriş yapmalısınız.");
            return;

        }

        if (!question.trim()) {

            alert("Lütfen sorunuzu yazınız.");
            return;

        }


        try {

            const response = await fetch(
                "http://localhost:5000/api/questions",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        user_id: user.id,
                        product_id: productId,
                        question: question.trim()
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                alert(data.message || "Soru gönderilemedi.");
                return;

            }


            alert(data.message);

            setQuestion("");
            setShowQuestionForm(false);

            loadQuestions();

        } catch (error) {

            console.log("Soru gönderme hatası:", error);

            alert("Soru gönderilirken bir hata oluştu.");

        }

    };


    // =========================
    // TARİH
    // =========================

    const formatDate = (date) => {

        return new Date(date).toLocaleDateString("tr-TR");

    };



const deleteQuestion = async (questionId) => {

    const confirmDelete = window.confirm(
        "Bu soruyu silmek istediğinize emin misiniz?"
    );

    if (!confirmDelete) return;

    if (!user) {
        alert("Kullanıcı bilgisi bulunamadı.");
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:5000/api/questions/${questionId}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_id: user.id
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Soru silinemedi.");
            return;
        }

        alert(data.message);

        loadQuestions();

    } catch (error) {

        console.log("SORU SİLME HATASI:", error);

        alert("Soru silinirken bir hata oluştu.");
    }
};

    return (

        <section className="product-questions">

            {/* =========================
                HEADER
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
                    onClick={() => setShowAllQuestions(true)}
                >
                    Tümü →
                </button>

            </div>


            {/* =========================
                SORU SOR BUTONU
            ========================= */}

            {user && !showQuestionForm && (

                <button
                    className="ask-question-btn"
                    onClick={() => setShowQuestionForm(true)}
                >
                    + Soru Sor
                </button>

            )}


            {/* =========================
                SORU FORMU
            ========================= */}

            {showQuestionForm && (

                <div className="question-form">

                    <textarea
                        value={question}
                        onChange={(e) =>
                            setQuestion(e.target.value)
                        }
                        placeholder="Ürün hakkında merak ettiğiniz soruyu yazın..."
                        maxLength={500}
                    />

                    <div className="question-form-buttons">

                        <button
                            className="cancel-question-btn"
                            onClick={() => {

                                setQuestion("");
                                setShowQuestionForm(false);

                            }}
                        >
                            Vazgeç
                        </button>


                        <button
                            className="submit-question-btn"
                            onClick={submitQuestion}
                        >
                            Soruyu Gönder
                        </button>

                    </div>

                </div>

            )}


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

                    questions.slice(0, 2).map((item) => (

                        <div
                            className="question-card"
                            key={item.id}
                        >

<div className="question-top">

    <strong>
        {item.full_name}
    </strong>

    <div className="question-top-right">

        <span>
            {formatDate(item.created_at)}
        </span>

        {user?.id === item.user_id && (
            <button
                className="question-delete-btn"
                onClick={() => deleteQuestion(item.id)}
            >
                Sil
            </button>
        )}

    </div>

</div>


                            <p className="question-text">
                                {item.question}
                            </p>


                            {item.answer && (

                                <div className="question-answer">

                                    <strong>
                                        Mağaza Yanıtı
                                    </strong>

                                    <p>
                                        {item.answer}
                                    </p>

                                </div>

                            )}

                        </div>

                    ))

                )}

            </div>


            {/* =========================
                TÜM SORULAR MODAL
            ========================= */}

            {showAllQuestions && (

                <div
                    className="questions-modal-overlay"
                    onClick={() =>
                        setShowAllQuestions(false)
                    }
                >

                    <div
                        className="questions-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="questions-modal-header">

                            <div>

                                <h2>
                                    Ürün Soruları & Cevapları
                                </h2>

                                <span>
                                    {questions.length} soru
                                </span>

                            </div>


                            <button
                                className="questions-modal-close"
                                onClick={() =>
                                    setShowAllQuestions(false)
                                }
                            >
                                ×
                            </button>

                        </div>


                        <div className="questions-modal-content">

                            {questions.length === 0 ? (

                                <p className="questions-message">
                                    Bu ürün için henüz soru sorulmamış.
                                </p>

                            ) : (

                                questions.map((item) => (

                                    <div
                                        className="question-card"
                                        key={item.id}
                                    >

                                        <div className="question-top">

                                            <strong>
                                                {item.full_name}
                                            </strong>

                                            <span>
                                                {formatDate(item.created_at)}
                                            </span>

                                        </div>


                                        <p className="question-text">
                                            {item.question}
                                        </p>


                                        {item.answer ? (

                                            <div className="question-answer">

                                                <strong>
                                                    Mağaza Yanıtı
                                                </strong>

                                                <p>
                                                    {item.answer}
                                                </p>

                                            </div>

                                        ) : (

                                            <span className="question-pending">
                                                Cevap bekleniyor
                                            </span>

                                        )}

                                    </div>

                                ))

                            )}

                        </div>

                    </div>

                </div>

            )}

        </section>

    );

}

export default ProductQuestions;