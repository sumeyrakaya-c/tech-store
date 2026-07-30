import { useEffect, useState } from "react";
import "../styles/Dashboard.css";

import StatCard from "../components/StatCard";

import {
    FiBox,
    FiShoppingBag,
    FiUsers,
    FiDollarSign,
} from "react-icons/fi";

function Dashboard() {

    const [stats, setStats] = useState({
        totalProducts: 0,
        totalCategories: 0,
        totalBrands: 0,
    });

    const [latestProducts, setLatestProducts] = useState([]);

    useEffect(() => {

        fetch("http://localhost:5000/api/dashboard")
            .then((res) => res.json())
            .then((data) => {

                setStats(data.stats);
                setLatestProducts(data.latestProducts);

            })
            .catch((err) => console.log(err));

    }, []);

    return (
        <div className="dashboard">

            <div className="dashboard-header">

                <h1>Dashboard</h1>

                <p>
                    Hoş geldin, Admin 👋
                    <br />
                    Bugün mağazanın genel durumunu buradan takip edebilirsin.
                </p>

            </div>

            {/* İstatistik Kartları */}

            <div className="stats-grid">

                <StatCard
                    title="Toplam Ürün"
                    value={stats.totalProducts}
                    icon={<FiBox />}
                />

                <StatCard
                    title="Kategoriler"
                    value={stats.totalCategories}
                    icon={<FiShoppingBag />}
                />

                <StatCard
                    title="Markalar"
                    value={stats.totalBrands}
                    icon={<FiUsers />}
                />

                <StatCard
                    title="Toplam Gelir"
                    value="0 ₺"
                    icon={<FiDollarSign />}
                />

            </div>

            {/* Son Eklenen Ürünler */}

            <div className="dashboard-section">

                <div className="section-header">

                    <h2>Son Eklenen Ürünler</h2>

                    <button>Hepsini Gör</button>

                </div>

                <div className="latest-products">

                    {latestProducts.length === 0 ? (

                        <p>Henüz ürün bulunmuyor.</p>

                    ) : (

                        latestProducts.map((product) => (

                            <div
                                className="latest-product"
                                key={product.id}
                            >

                                <img
                                    src={`http://localhost:5000/uploads/${product.image}`}
                                    alt={product.name}
                                    width="60"
                                />

                                <div>

                                    <h4>{product.name}</h4>

                                    <p>
                                        {Number(product.price).toLocaleString("tr-TR")} ₺
                                    </p>

                                </div>

                            </div>

                        ))

                    )}

                </div>

            </div>

        </div>
    );
}

export default Dashboard;