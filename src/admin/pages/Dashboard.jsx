import "../styles/Dashboard.css";

import StatCard from "../components/StatCard";

import {
    FiBox,
    FiShoppingBag,
    FiUsers,
    FiDollarSign,
} from "react-icons/fi";

function Dashboard() {
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

            <div className="stats-grid">

                <div className="dashboard-section">

    <div className="section-header">

        <h2>Son Eklenen Ürünler</h2>

        <button>Hepsini Gör</button>

    </div>

    <div className="empty-table">

        <p>Henüz ürün bulunmuyor.</p>

    </div>

</div>

                <StatCard
                    title="Toplam Ürün"
                    value="0"
                    icon={<FiBox />}
                />

                <StatCard
                    title="Siparişler"
                    value="0"
                    icon={<FiShoppingBag />}
                />

                <StatCard
                    title="Kullanıcılar"
                    value="1"
                    icon={<FiUsers />}
                />

                <StatCard
                    title="Toplam Gelir"
                    value="0 ₺"
                    icon={<FiDollarSign />}
                />

            </div>

        </div>
    );
}

export default Dashboard;