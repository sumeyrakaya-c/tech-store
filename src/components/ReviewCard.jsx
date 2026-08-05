import "../styles/ReviewCard.css";
import { FaThumbsUp, FaStar, FaTrash } from "react-icons/fa";

function ReviewCard({ review, onDelete }) {

    const user = JSON.parse(localStorage.getItem("user"));

    const formatName = () => {

        if (!review.anonymous) {
            return review.fullName;
        }

        const words = review.fullName.split(" ");

        return words
            .map(word => word[0] + "*".repeat(Math.max(word.length - 1, 1)))
            .join(" ");

    };

    const deleteReview = async () => {

        const confirmDelete = window.confirm(
            "Yorumunuzu silmek istediğinize emin misiniz?"
        );

        if (!confirmDelete) return;

        try {

            const response = await fetch(
                `http://localhost:5000/api/reviews/${review.id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            alert(data.message);

            if (response.ok && onDelete) {

                onDelete();

            }

        } catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="review-card">

            <div className="card-top">

                <div className="card-stars">

                    {[1, 2, 3, 4, 5].map((star) => (

                        <FaStar
                            key={star}
                            color={star <= review.rating ? "#FFC107" : "#ddd"}
                        />

                    ))}

                </div>

                <span className="review-date">

                    {new Date(review.created_at).toLocaleDateString("tr-TR")}

                </span>

            </div>

            <h4>{formatName()}</h4>

            <p>{review.comment}</p>

            {(review.image1 || review.image2 || review.image3) && (

                <div className="review-images">

                    {review.image1 && (
                        <img
                            src={`http://localhost:5000/uploads/${review.image1}`}
                            alt=""
                        />
                    )}

                    {review.image2 && (
                        <img
                            src={`http://localhost:5000/uploads/${review.image2}`}
                            alt=""
                        />
                    )}

                    {review.image3 && (
                        <img
                            src={`http://localhost:5000/uploads/${review.image3}`}
                            alt=""
                        />
                    )}

                </div>

            )}

            <div className="review-like">

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                    }}
                >
                    <FaThumbsUp />

                    <span>{review.helpful_count}</span>
                </div>

                {user?.id === review.user_id && (

                    <button
                        className="delete-review"
                        onClick={deleteReview}
                    >
                        <FaTrash />
                        Sil
                    </button>

                )}

            </div>

        </div>

    );

}

export default ReviewCard;