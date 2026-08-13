import { useEffect, useState } from "react";
import "../styles/Questions.css";

function Questions() {

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [answers, setAnswers] = useState({});

    const user = JSON.parse(localStorage.getItem("user"));

    // =========================================
    // BEKLEYEN SORULARI GETİR
    // =========================================

    const loadQuestions = async () => {

        try {

            setLoading(true);

            const response = await fetch(
                "http://localhost:5000/api/questions/admin/pending"
            );

            const data = await response.json();

            if (response.ok) {

                setQuestions(data);

            } else {

                console.log(data);

            }

        } catch (error) {

            console.log("SORULAR GETİRİLEMEDİ:", error);

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadQuestions();

    }, []);


    // =========================================
    // CEVAP INPUT
    // =========================================

    const handleAnswerChange = (questionId, value) => {

        setAnswers((prev) => ({
            ...prev,
            [questionId]: value
        }));

    };


    // =========================================
    // SORUYU CEVAPLA
    // =========================================

    const answerQuestion = async (questionId) => {

        const answer = answers[questionId];

        if (!answer || !answer.trim()) {

            alert("Lütfen cevap yazınız.");

            return;

        }

        try {

            const response = await fetch(
                `http://localhost:5000/api/questions/${questionId}/answer`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        answer: answer.trim(),
                        answered_by: user?.id || null
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                alert(data.message || "Cevap gönderilemedi.");

                return;

            }

            alert("Cevap başarıyla gönderildi.");

            // Inputu temizle
            setAnswers((prev) => {

                const newAnswers = { ...prev };

                delete newAnswers[questionId];

                return newAnswers;

            });

            // Soruyu listeden kaldır
            loadQuestions();

        } catch (error) {

            console.log("CEVAP GÖNDERME HATASI:", error);

            alert("Cevap gönderilirken bir hata oluştu.");

        }

    };

    // =========================================
// ADMIN SORUYU SİLSİN
// =========================================

const deleteQuestion = async (questionId) => {

    const confirmDelete = window.confirm(
        "Bu soruyu silmek istediğinize emin misiniz?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:5000/api/questions/admin/${questionId}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (!response.ok) {

            alert(data.message || "Soru silinemedi.");
            return;

        }

        alert("Soru başarıyla silindi.");

        // Listeden kaldır
        setQuestions((prev) =>
            prev.filter((question) => question.id !== questionId)
        );

    } catch (error) {

        console.log("ADMIN SORU SİLME HATASI:", error);

        alert("Soru silinirken bir hata oluştu.");

    }
};


    // =========================================
    // RENDER
    // =========================================

    return (

        <div className="admin-questions-page">

            <div className="questions-page-header">

                <div>

                    <h1>Ürün Soruları</h1>

                    <p>
                        Kullanıcıların ürünler hakkında sorduğu
                        soruları buradan cevaplayabilirsiniz.
                    </p>

                </div>

                <div className="question-total">

                    {questions.length} Bekleyen Soru

                </div>

            </div>


            {loading ? (

                <div className="questions-loading">
                    Sorular yükleniyor...
                </div>

            ) : questions.length === 0 ? (

                <div className="no-questions">

                    <h3>Bekleyen soru yok</h3>

                    <p>
                        Şu anda cevaplanmayı bekleyen bir soru bulunmuyor.
                    </p>

                </div>

            ) : (

                <div className="admin-question-list">

                    {questions.map((item) => (

                        <div
                            className="admin-question-card"
                            key={item.id}
                        >

                            {/* =========================
                                SORU BİLGİLERİ
                            ========================= */}

                            <div className="question-card-top">

                                <div>

                                    <span className="question-product">
                                        {item.product_name}
                                    </span>

                                    <h3>
                                        {item.question}
                                    </h3>

                                </div>

                                <span className="question-status">
                                    {item.status}
                                </span>

                            </div>


                            {/* =========================
                                KULLANICI
                            ========================= */}

                            <div className="question-user">

                                <strong>
                                    {item.full_name}
                                </strong>

                                <span>
                                    {item.email}
                                </span>

                                <span>
                                    {new Date(
                                        item.created_at
                                    ).toLocaleDateString("tr-TR")}
                                </span>

                            </div>


                            {/* =========================
                                CEVAP
                            ========================= */}

                            <div className="answer-area">

    <textarea
        placeholder="Bu soruya bir cevap yazın..."
        value={
            answers[item.id] || ""
        }
        onChange={(e) =>
            handleAnswerChange(
                item.id,
                e.target.value
            )
        }
    />

    <div className="question-actions">

        <button
            className="answer-btn"
            onClick={() =>
                answerQuestion(item.id)
            }
        >
            Cevabı Gönder
        </button>

        <button
            className="delete-question-btn"
            onClick={() =>
                deleteQuestion(item.id)
            }
        >
            Soruyu Sil
        </button>

    </div>

</div>
                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

export default Questions;