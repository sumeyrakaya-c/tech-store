import { useEffect, useState } from "react";
import "../styles/ReviewSection.css";
import ReviewCard from "./ReviewCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ReviewForm from "./ReviewForm";
import { useLanguage } from "../context/LanguageContext";

function ReviewSection({ productId }) {

    const { language, t } = useLanguage();

    const user = JSON.parse(localStorage.getItem("user"));

    const [reviews, setReviews] = useState([]);

    const [stats, setStats] = useState({
        average_rating: 0,
        review_count: 0
    });

    const [canReview, setCanReview] = useState(false);

    // Yorum formu açık mı?
    const [showReviewForm, setShowReviewForm] = useState(false);

    // Tüm yorumlar popup'ı
    const [showAllReviews, setShowAllReviews] = useState(false);

    // Ana sayfadaki yorumların başlangıç sırası
    const [reviewStart, setReviewStart] = useState(0);


    // =========================
    // YORUMLARI YÜKLE
    // =========================

    const loadReviews = () => {

        fetch(
    `http://localhost:5000/api/reviews/${productId}`,
    {
        headers: {
            "Accept-Language": language
        }
    }
)
            .then((res) => res.json())
            .then((data) => {

                setReviews(data);

                // Yorumlar yenilendiğinde başa dön
                setReviewStart(0);

            })
            .catch((err) => console.log(err));


        // =========================
        // İSTATİSTİKLER
        // =========================

        fetch(`http://localhost:5000/api/reviews/stats/${productId}`)
            .then((res) => res.json())
            .then((data) => {

                setStats(data);

            })
            .catch((err) => console.log(err));


        // =========================
        // KULLANICI YORUM YAPABİLİR Mİ?
        // =========================

        if (user) {

            fetch(
                `http://localhost:5000/api/reviews/can-review/${user.id}/${productId}`
            )
                .then((res) => res.json())
                .then((data) => {

                    setCanReview(data.canReview);

                })
                .catch((err) => console.log(err));

        } else {

            setCanReview(false);

        }

    };


   useEffect(() => {

    loadReviews();

}, [productId, language]);""


    // =========================
    // MODAL SCROLL
    // =========================

    useEffect(() => {

        if (showAllReviews) {

            document.body.style.overflow = "hidden";

        } else {

            document.body.style.overflow = "auto";

        }

        return () => {

            document.body.style.overflow = "auto";

        };

    }, [showAllReviews]);


    // =========================
    // YORUM OKLARI
    // =========================

    const showPreviousReviews = () => {

        setReviewStart((current) => {

            return Math.max(current - 1, 0);

        });

    };


    const showNextReviews = () => {

        setReviewStart((current) => {

            /*
             * 0'dan başlayarak birer birer ilerliyoruz.
             *
             * Örnek:
             * 2 yorum varsa:
             * 0 -> yorum 1 + yorum 2
             * 1 -> yorum 2
             *
             * 3 yorum varsa:
             * 0 -> yorum 1 + yorum 2
             * 1 -> yorum 2 + yorum 3
             * 2 -> yorum 3
             */

            const maxStart = Math.max(reviews.length - 1, 0);

            return Math.min(current + 1, maxStart);

        });

    };


    // =========================
    // GÖSTERİLECEK YORUMLAR
    // =========================

    const visibleReviews = reviews.slice(
        reviewStart,
        reviewStart + 2
    );


    return (

        <section className="review-section">


            {/* =========================
                HEADER
            ========================= */}

            <div className="review-header">

                <div className="review-left">

                    <h2>
                        Ürün Değerlendirmeleri
                    </h2>


                    <div className="review-summary">

                        <div className="section-stars">
                            ★★★★★
                        </div>


                        <span className="review-score">

                            {stats.average_rating || 0}

                        </span>


                        <span className="review-count">

                            ({stats.review_count} Değerlendirme)

                        </span>

                    </div>

                </div>


                <div className="review-right">


                    {/* TÜM YORUMLAR */}

                    <button
                        type="button"
                        onClick={() =>
                            setShowAllReviews(true)
                        }
                    >

                        Tümü →

                    </button>


                    {/* OKLAR */}

                    <div className="review-arrows">


                        {/* SOL */}

                        <button
                            type="button"
                            onClick={showPreviousReviews}
                            className={
                                reviewStart === 0
                                    ? "arrow-disabled"
                                    : ""
                            }
                        >

                            <FaChevronLeft />

                        </button>


                        {/* SAĞ */}

                        <button
                            type="button"
                            onClick={showNextReviews}
                            className={
                                reviews.length === 0 ||
                                reviewStart >= reviews.length - 1
                                    ? "arrow-disabled"
                                    : ""
                            }
                        >

                            <FaChevronRight />

                        </button>


                    </div>

                </div>

            </div>


            {/* =========================
                YORUM YAP BUTONU
            ========================= */}

            {canReview && !showReviewForm && (

                <div className="review-action">

                    <button
                        type="button"
                        className="write-review-btn"
                        onClick={() =>
                            setShowReviewForm(true)
                        }
                    >

                        Değerlendirme Yap

                    </button>

                </div>

            )}


            {/* =========================
                YORUM FORMU
            ========================= */}

            {canReview && showReviewForm && (

                <ReviewForm
                    productId={productId}
                    onSuccess={() => {

                        loadReviews();

                        setShowReviewForm(false);

                    }}
                />

            )}


            {/* =========================
                YORUMLAR
            ========================= */}

            <div className="review-list">

                {reviews.length === 0 ? (

                    <p
                        style={{
                            padding: "20px",
                            textAlign: "center"
                        }}
                    >

                        Bu ürün için henüz yorum yapılmamış.

                    </p>

                ) : (

                    visibleReviews.map((review) => (

                        <ReviewCard
                            key={review.id}
                            review={review}
                            onDelete={loadReviews}
                        />

                    ))

                )}

            </div>


            {/* =========================
                TÜM YORUMLAR MODAL
            ========================= */}

            {showAllReviews && (

                <div
                    className="reviews-modal-overlay"
                    onClick={() =>
                        setShowAllReviews(false)
                    }
                >

                    <div
                        className="reviews-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >


                        {/* =========================
                            HEADER
                        ========================= */}

                        <div className="reviews-modal-header">

                            <div>

                                <h2>
                                    Ürün Değerlendirmeleri
                                </h2>


                                <div className="reviews-modal-summary">

                                    <span className="section-stars">
                                        ★★★★★
                                    </span>


                                    <strong>
                                        {stats.average_rating || 0}
                                    </strong>


                                    <span>
                                        ({stats.review_count} Değerlendirme)
                                    </span>

                                </div>

                            </div>


                            {/* KAPAT */}

                            <button
                                type="button"
                                className="reviews-modal-close"
                                onClick={() =>
                                    setShowAllReviews(false)
                                }
                            >

                                ×

                            </button>

                        </div>


                        {/* =========================
                            YORUMLAR
                        ========================= */}

                        <div className="reviews-modal-content">

                            {reviews.length === 0 ? (

                                <p className="no-reviews">

                                    Bu ürün için henüz yorum yapılmamış.

                                </p>

                            ) : (

                                reviews.map((review) => (

                                    <ReviewCard
                                        key={review.id}
                                        review={review}
                                        onDelete={loadReviews}
                                    />

                                ))

                            )}

                        </div>

                    </div>

                </div>

            )}

        </section>

    );

}

export default ReviewSection;