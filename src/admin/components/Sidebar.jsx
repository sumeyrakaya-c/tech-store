import { NavLink } from "react-router-dom";
import {
    FiHome,
    FiBox,
    FiPlusCircle,
    FiShoppingBag,
    FiUsers,
    FiMessageCircle,
    FiLogOut
} from "react-icons/fi";

import "../styles/Sidebar.css";

function Sidebar() {

    return (
        <aside className="admin-sidebar">

            <div className="admin-sidebar-logo">

                <h2>TeknoHup</h2>

                <span>Admin Panel</span>

            </div>


            <div className="admin-sidebar-links">

                <span className="sidebar-title">
                    ANA MENÜ
                </span>


                <nav className="admin-sidebar-menu">

                    <NavLink to="/admin" end>

                        <FiHome />

                        <span>
                            Dashboard
                        </span>

                    </NavLink>


                    <NavLink to="/admin/products">

                        <FiBox />

                        <span>
                            Ürünler
                        </span>

                    </NavLink>


                    <NavLink to="/admin/add-product">

                        <FiPlusCircle />

                        <span>
                            Ürün Ekle
                        </span>

                    </NavLink>


                    <NavLink to="/admin/orders">

                        <FiShoppingBag />

                        <span>
                            Siparişler
                        </span>

                    </NavLink>


                    <NavLink to="/admin/users">

                        <FiUsers />

                        <span>
                            Kullanıcılar
                        </span>

                    </NavLink>


                    <NavLink to="/admin/questions">

                        <FiMessageCircle />

                        <span>
                            Sorular
                        </span>

                    </NavLink>

                </nav>

            </div>


            <div className="admin-sidebar-footer">

                <button className="logout-btn">

                    <FiLogOut />

                    <span>
                        Çıkış Yap
                    </span>

                </button>

            </div>

        </aside>
    );
}

export default Sidebar;