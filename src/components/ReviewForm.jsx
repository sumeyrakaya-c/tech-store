import { useState } from "react";
import "../styles/ReviewForm.css";
import { FaStar } from "react-icons/fa";

function ReviewForm({ productId, onSuccess }) {

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [anonymous, setAnonymous] = useState(false);
    const [images, setImages] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));

    const submitReview = async () => {

        if (!user) {
            alert("Yorum yapmak için giriş yapmalısınız.");
            return;
        }

        if (!rating) {
            alert("Lütfen puan veriniz.");
            return;
        }

        if (!comment.trim()) {
            alert("Lütfen yorumunuzu yazınız.");
            return;
        }

        const formData = new FormData();

        formData.append("user_id", user.id);
        formData.append("product_id", productId);
        formData.append("rating", rating);
        formData.append("comment", comment);
        formData.append("anonymous", anonymous ? 1 : 0);

        if (images[0]) formData.append("image1", images[0]);
        if (images[1]) formData.append("image2", images[1]);
        if (images[2]) formData.append("image3", images[2]);

        try {

            const response = await fetch(
                "http://localhost:5000/api/reviews",
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await response.json();

            alert(data.message);

            if (response.ok) {

                setRating(0);
                setComment("");
                setAnonymous(false);
                setImages([]);

                if (onSuccess) {
                    onSuccess();
                }

            }

        } catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="review-form">

            <h3>Ürünü Değerlendir</h3>

            <div className="rating-stars">

                {[1, 2, 3, 4, 5].map((star) => (

                    <FaStar
                        key={star}
                        size={28}
                        color={star <= rating ? "#FFC107" : "#ddd"}
                        onClick={() => setRating(star)}
                        style={{ cursor: "pointer" }}
                    />

                ))}

            </div>

            <textarea
                placeholder="Ürün hakkındaki düşüncelerinizi yazın..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />

            <div className="review-options">

                <label>

                    <input
                        type="checkbox"
                        checked={anonymous}
                        onChange={() => setAnonymous(!anonymous)}
                    />

                    Adımı Gizle

                </label>

            </div>

            <div className="review-images">

                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) =>
                        setImages([...e.target.files].slice(0, 3))
                    }
                />

            </div>

            <button onClick={submitReview}>

                Yorumu Gönder

            </button>

        </div>

    );

}

export default ReviewForm;