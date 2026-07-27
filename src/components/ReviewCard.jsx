import "../styles/ReviewCard.css";
import { FaThumbsUp } from "react-icons/fa";

function ReviewCard({ review }) {
  return (
    <div className="review-card">

      <div className="card-top">

        <div className="card-stars">
          {"★".repeat(review.rating)}
          {"☆".repeat(5 - review.rating)}
        </div>

        <span className="review-date">
          {review.date}
        </span>

      </div>

      <h4>{review.name}</h4>

      <p>{review.comment}</p>

      <div className="review-like">
        <FaThumbsUp />
        <span>{review.likes}</span>
      </div>

    </div>
  );
}

export default ReviewCard;