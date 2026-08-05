import { useEffect, useState } from "react";
import "../styles/ReviewSection.css";
import ReviewCard from "./ReviewCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ReviewForm from "./ReviewForm";

function ReviewSection({ productId }) {

    const user = JSON.parse(localStorage.getItem("user"));

    const [reviews, setReviews] = useState([]);

    const [stats, setStats] = useState({
        average_rating: 0,
        review_count: 0
    });

    const [canReview, setCanReview] = useState(false);

    const loadReviews = () => {

        fetch(`http://localhost:5000/api/reviews/${productId}`)
            .then((res) => res.json())
            .then((data) => setReviews(data))
            .catch((err) => console.log(err));

        fetch(`http://localhost:5000/api/reviews/stats/${productId}`)
            .then((res) => res.json())
            .then((data) => setStats(data))
            .catch((err) => console.log(err));

        if (user) {

            fetch(
                `http://localhost:5000/api/reviews/can-review/${user.id}/${productId}`
            )
                .then((res) => res.json())
                .then((data) => setCanReview(data.canReview))
                .catch((err) => console.log(err));

        } else {

            setCanReview(false);

        }

    };

    useEffect(() => {

        loadReviews();

    }, [productId]);

    return (

        <section className="review-section">

            <div className="review-header">

                <div className="review-left">

                    <h2>Ürün Değerlendirmeleri</h2>

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

                    <button>Tümü →</button>

                    <div className="review-arrows">

                        <button>
                            <FaChevronLeft />
                        </button>

                        <button>
                            <FaChevronRight />
                        </button>

                    </div>

                </div>

            </div>

            {canReview && (

               <ReviewCard
                     key={review.id}
                    review={review}
                    onDelete={loadReviews}
                    />

            )}

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

                    reviews.map((review) => (

                        <ReviewCard
                            key={review.id}
                            review={review}
                        />

                    ))

                )}

            </div>

        </section>

    );

}

export default ReviewSection;