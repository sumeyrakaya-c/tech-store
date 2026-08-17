import { useEffect, useState } from "react";
import "../styles/ProductQuestions.css";

import { useLanguage } from "../context/LanguageContext";


function ProductQuestions({ productId }) {

    const user = JSON.parse(
        localStorage.getItem("user")
    );


    const { t } = useLanguage();


    const [questions, setQuestions] = useState([]);

    const [question, setQuestion] = useState("");

    const [showQuestionForm, setShowQuestionForm] =
        useState(false);

    const [showAllQuestions, setShowAllQuestions] =
        useState(false);

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


            const data =
                await response.json();


            if (!response.ok) {

                console.log(
                    "SORULAR API HATASI:",
                    data
                );

                setQuestions([]);

                return;

            }


            setQuestions(
                Array.isArray(data)
                    ? data
                    : []
            );


        } catch (error) {

            console.log(
                "Sorular alınamadı:",
                error
            );


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

            alert(
                t("loginToAsk")
            );

            return;

        }


        if (!question.trim()) {

            alert(
                t("enterQuestion")
            );

            return;

        }


        try {

            const response = await fetch(
                "http://localhost:5000/api/questions",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        user_id: user.id,

                        product_id: productId,

                        question:
                            question.trim()

                    })

                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    t("questionCouldNotSend")
                );

                return;

            }


            alert(
                data.message ||
                t("questionSent")
            );


            setQuestion("");

            setShowQuestionForm(false);

            loadQuestions();


        } catch (error) {

            console.log(
                "Soru gönderme hatası:",
                error
            );


            alert(
                t("questionSendError")
            );

        }

    };


    // =========================
    // TARİH
    // =========================

    const formatDate = (date) => {

        return new Date(
            date
        ).toLocaleDateString(
            "tr-TR"
        );

    };


    // =========================
    // SORU SİL
    // =========================

    const deleteQuestion = async (
        questionId
    ) => {

        const confirmDelete =
            window.confirm(
                t("deleteQuestionConfirm")
            );


        if (!confirmDelete) {

            return;

        }


        if (!user) {

            alert(
                t("userNotFound")
            );

            return;

        }


        try {

            const response = await fetch(
                `http://localhost:5000/api/questions/${questionId}`,
                {
                    method: "DELETE",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        user_id: user.id

                    })

                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    t("questionCouldNotDelete")
                );

                return;

            }


            alert(
                data.message ||
                t("questionDeleted")
            );


            loadQuestions();


        } catch (error) {

            console.log(
                "SORU SİLME HATASI:",
                error
            );


            alert(
                t("questionDeleteError")
            );

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

                        {t("questionsAnswers")}

                    </h3>


                    <span className="question-count">

                        {questions.length}{" "}

                        {t("questionCount")}

                    </span>

                </div>


                <button
                    className="see-all"
                    onClick={() =>
                        setShowAllQuestions(true)
                    }
                >

                    {t("all")} →

                </button>

            </div>


            {/* =========================
                SORU SOR BUTONU
            ========================= */}

            {user &&
                !showQuestionForm && (

                    <button
                        className="ask-question-btn"
                        onClick={() =>
                            setShowQuestionForm(true)
                        }
                    >

                        + {t("askQuestion")}

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
                            setQuestion(
                                e.target.value
                            )
                        }
                        placeholder={
                            t("questionPlaceholder")
                        }
                        maxLength={500}
                    />


                    <div className="question-form-buttons">


                        <button
                            className="cancel-question-btn"
                            onClick={() => {

                                setQuestion("");

                                setShowQuestionForm(
                                    false
                                );

                            }}
                        >

                            {t("cancel")}

                        </button>


                        <button
                            className="submit-question-btn"
                            onClick={
                                submitQuestion
                            }
                        >

                            {t("sendQuestion")}

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

                        {t("questionsLoading")}

                    </p>


                ) : questions.length === 0 ? (

                    <p className="questions-message">

                        {t("noQuestions")}

                    </p>


                ) : (

                    questions
                        .slice(0, 2)
                        .map((item) => (

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

                                            {formatDate(
                                                item.created_at
                                            )}

                                        </span>


                                        {user?.id ===
                                            item.user_id && (

                                            <button
                                                className="question-delete-btn"
                                                onClick={() =>
                                                    deleteQuestion(
                                                        item.id
                                                    )
                                                }
                                            >

                                                {t(
                                                    "deleteQuestion"
                                                )}

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

                                            {t(
                                                "storeAnswer"
                                            )}

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

                                    {t(
                                        "questionsAnswers"
                                    )}

                                </h2>


                                <span>

                                    {questions.length}{" "}

                                    {t(
                                        "questionCountShort"
                                    )}

                                </span>

                            </div>


                            <button
                                className="questions-modal-close"
                                onClick={() =>
                                    setShowAllQuestions(
                                        false
                                    )
                                }
                            >

                                ×

                            </button>

                        </div>


                        <div className="questions-modal-content">


                            {questions.length === 0 ? (

                                <p className="questions-message">

                                    {t(
                                        "noQuestions"
                                    )}

                                </p>

                            ) : (

                                questions.map(
                                    (item) => (

                                        <div
                                            className="question-card"
                                            key={item.id}
                                        >

                                            <div className="question-top">

                                                <strong>

                                                    {
                                                        item.full_name
                                                    }

                                                </strong>


                                                <span>

                                                    {formatDate(
                                                        item.created_at
                                                    )}

                                                </span>

                                            </div>


                                            <p className="question-text">

                                                {
                                                    item.question
                                                }

                                            </p>


                                            {item.answer ? (

                                                <div className="question-answer">

                                                    <strong>

                                                        {t(
                                                            "storeAnswer"
                                                        )}

                                                    </strong>


                                                    <p>

                                                        {
                                                            item.answer
                                                        }

                                                    </p>

                                                </div>

                                            ) : (

                                                <span className="question-pending">

                                                    {t(
                                                        "waitingForAnswer"
                                                    )}

                                                </span>

                                            )}

                                        </div>

                                    )
                                )

                            )}

                        </div>

                    </div>

                </div>

            )}

        </section>

    );

}


export default ProductQuestions;