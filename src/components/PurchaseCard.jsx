import "../styles/PurchaseCard.css";
import {
    FiTruck,
    FiShield,
    FiRefreshCw,
    FiShare2
} from "react-icons/fi";

  function PurchaseCard({ product }) {

const addToCart = async () => {

    try {

        const response = await fetch("http://localhost:5000/api/cart", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                product_id: product.id,
                quantity: 1

            })

        });

        const data = await response.json();

        alert(data.message);

    } catch (error) {

        console.log(error);

    }

};

    return (

        <div className="purchase-wrapper">

            <button className="share-btn">
                <FiShare2 />
            </button>

            <div className="purchase-card">

                <div className="service">

                    <FiTruck />
                    <span>Ücretsiz Kargo</span>

                </div>

                <div className="service">

                    <FiShield />
                    <span>Güvenli Ödeme</span>

                </div>

                <div className="service">

                    <FiRefreshCw />
                    <span>Kolay İade</span>

                </div>

                <button className="buy-now">
                    ⚡ Hızlı Al
                </button>

                <button
    className="add-cart"
    onClick={addToCart}
>
    🛒 Sepete Ekle
</button>

            </div>

        </div>

    );
}

export default PurchaseCard;

