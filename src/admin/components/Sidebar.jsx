import { NavLink } from "react-router-dom";
import "./../styles/Sidebar.css";

function Sidebar() {
    return (
        <aside className="admin-sidebar">

            <div className="admin-sidebar-logo">
                <h2>TeknoHup</h2>
                <span>Admin Panel</span>
            </div>

            <nav className="admin-sidebar-menu">

                <NavLink to="/admin" end>
                    📊 Dashboard
                </NavLink>

                <NavLink to="/admin/products">
                    📦 Ürünler
                </NavLink>

                <NavLink to="/admin/add-product">
                    ➕ Ürün Ekle
                </NavLink>

                <NavLink to="/admin/orders">
                    🛒 Siparişler
                </NavLink>

                <NavLink to="/admin/users">
                    👥 Kullanıcılar
                </NavLink>

            </nav>

        </aside>
    );
}

export default Sidebar;