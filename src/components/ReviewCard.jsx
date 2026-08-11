import { useState } from "react";
import "../styles/ReviewCard.css";
import { FaThumbsUp, FaStar, FaTrash } from "react-icons/fa";

function ReviewCard({ review, onDelete }) {

    const user = JSON.parse(localStorage.getItem("user"));

    const [selectedImage, setSelectedImage] = useState(null);

    // =========================================
    // KULLANICI ADI
    // =========================================

const formatName = () => {

    const fullName = review.full_name || "Kullanıcı";

    if (!review.anonymous) {
        return fullName;
    }

    const words = fullName.split(" ");

    return words
        .map(word =>
            word[0] + "*".repeat(Math.max(word.length - 1, 1))
        )
        .join(" ");

};


    // =========================================
    // YORUM SİL
    // =========================================

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

            alert(
                data.message ||
                "Yorum silindi."
            );

            if (response.ok && onDelete) {
                onDelete();
            }

        } catch (error) {

            console.log("Yorum silme hatası:", error);

            alert(
                "Yorum silinirken bir hata oluştu."
            );

        }

    };


    // =========================================
    // YORUM GÖRSELLERİ
    // =========================================

    const reviewImages = [
        review?.image1,
        review?.image2,
        review?.image3
    ].filter(Boolean);


    return (

        <>

            <div className="review-card">

                {/* =================================
                    ÜST KISIM
                ================================= */}

                <div className="card-top">

                    <div className="card-stars">

                        {[1, 2, 3, 4, 5].map((star) => (

                            <FaStar
                                key={star}
                                color={
                                    star <= Number(review?.rating || 0)
                                        ? "#FFC107"
                                        : "#ddd"
                                }
                            />

                        ))}

                    </div>


                    <span className="review-date">

                        {review?.created_at
                            ? new Date(
                                review.created_at
                            ).toLocaleDateString("tr-TR")
                            : ""
                        }

                    </span>

                </div>


                {/* =================================
                    KULLANICI
                ================================= */}

                <h4>
                    {formatName()}
                </h4>


                {/* =================================
                    YORUM
                ================================= */}

                <p>
                    {review?.comment || ""}
                </p>


                {/* =================================
                    GÖRSELLER
                ================================= */}

                {reviewImages.length > 0 && (

                    <div className="review-card-images">

                        {reviewImages.map((image, index) => {

                            const imageUrl =
                                `http://localhost:5000/uploads/${image}`;

                            return (

                                <img
                                    key={index}
                                    className="review-image-thumb"
                                    src={imageUrl}
                                    alt="Yorum görseli"
                                    onClick={() =>
                                        setSelectedImage(imageUrl)
                                    }
                                />

                            );

                        })}

                    </div>

                )}


                {/* =================================
                    BEĞENİ + SİL
                ================================= */}

                <div className="review-like">

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px"
                        }}
                    >

                        <FaThumbsUp />

                        <span>
                            {review?.helpful_count || 0}
                        </span>

                    </div>


                    {user?.id === review?.user_id && (

                        <button
                            className="delete-review"
                            onClick={deleteReview}
                            title="Yorumu sil"
                        >

                            <FaTrash />

                        </button>

                    )}

                </div>

            </div>


            {/* =================================
                BÜYÜK FOTOĞRAF
            ================================= */}

            {selectedImage && (

                <div
                    className="image-modal"
                    onClick={() =>
                        setSelectedImage(null)
                    }
                >

                    <button
                        className="image-modal-close"
                        onClick={() =>
                            setSelectedImage(null)
                        }
                    >
                        ×
                    </button>


                    <img
                        src={selectedImage}
                        alt="Büyük yorum görseli"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    />

                </div>

            )}

        </>

    );

}

export default ReviewCard;