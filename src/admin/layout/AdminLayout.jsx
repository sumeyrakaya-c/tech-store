import { Routes, Route } from "react-router-dom";
import EditProduct from "../pages/EditProduct";
import Sidebar from "../components/Sidebar";

import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import AddProduct from "../pages/AddProduct";
import Orders from "../pages/Orders";
import Users from "../pages/Users";
import Questions from "../pages/Questions";
import Returns from "../pages/Returns";
import "../styles/AdminLayout.css";

function AdminLayout() {
    return (
        <div className="admin-layout">

            <Sidebar />

            <main className="admin-content">

                <Routes>

                    <Route index element={<Dashboard />} />

                    <Route path="products" element={<Products />} />

                    <Route
                     path="products/edit/:id"
                      element={<EditProduct />}
                   />             

                    <Route path="add-product" element={<AddProduct />} />

                    <Route path="orders" element={<Orders />} />

                    <Route path="users" element={<Users />} />

                    <Route path="questions" element={<Questions />} />

                    <Route
    path="returns"
    element={<Returns />}
/>

                </Routes>

            </main>

        </div>
    );
}

export default AdminLayout;