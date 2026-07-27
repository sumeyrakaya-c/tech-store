import "../styles/Dashboard.css";
import {
    HiOutlineCube
} from "react-icons/hi2";

import {
    FiShoppingCart,
    FiUsers,
    FiDollarSign
} from "react-icons/fi";
import StatCard from "../components/StatCard";

function Dashboard() {

    return (
        <div className="stats-grid">

    <StatCard
        title="Toplam Ürün"
        value="0"
        icon={<HiOutlineCube />}
    />

    <StatCard
        title="Siparişler"
        value="0"
        icon={<FiShoppingCart />}
    />

    <StatCard
        title="Kullanıcılar"
        value="1"
        icon={<FiUsers />}
    />

    <StatCard
        title="Gelir"
        value="0 ₺"
        icon={<FiDollarSign />}
    />

</div>
    );
}

export default Dashboard;