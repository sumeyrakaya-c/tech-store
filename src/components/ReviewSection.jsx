import "../styles/ReviewSection.css";
import ReviewCard from "./ReviewCard";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";

const reviews = [
  {
    id: 1,
    rating: 5,
    date: "14.07.2026",
    name: "H**** K****",
    comment:
      "Telefon gerçekten beklediğimden daha iyi çıktı. Kamera performansı oldukça başarılı ve şarjı uzun süre gidiyor.",
    likes: 126,
  },
  {
    id: 2,
    rating: 4,
    date: "12.07.2026",
    name: "A**** D****",
    comment:
      "Ekran kalitesi çok güzel fakat bataryası biraz daha iyi olabilirdi. Genel olarak memnun kaldım.",
    likes: 84,
  },
];

function ReviewSection() {
  return (
    <section className="review-section">

      <div className="review-header">

        <div className="review-left">

          <h2>Ürün Değerlendirmeleri</h2>

          <div className="review-summary">

            <div className="section-stars">
  ★★★★★
</div>


            <span className="review-score">4.8</span>

            <span className="review-count">
              (25.654 Puan | 5.425 Yorum)
            </span>

          </div>

        </div>

        <div className="review-right">

          <button>Tümü →</button>

          <div className="review-arrows">

            <button>
              <FaChevronLeft/>
            </button>

            <button>
              <FaChevronRight/>
            </button>

          </div>

        </div>

      </div>

      <div className="review-list">

        {reviews.map(review=>(
          <ReviewCard
            key={review.id}
            review={review}
          />
        ))}

      </div>

    </section>
  );
}

export default ReviewSection;