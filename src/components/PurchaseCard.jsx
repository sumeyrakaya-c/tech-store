import "../styles/PurchaseCard.css";
import {
    FiTruck,
    FiShield,
    FiRefreshCw,
    FiShare2
} from "react-icons/fi";

function PurchaseCard() {

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

                <button className="add-cart">
                    🛒 Sepete Ekle
                </button>

            </div>

        </div>

    );
}

export default PurchaseCard;

