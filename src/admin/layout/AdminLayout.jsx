import { Routes, Route } from "react-router-dom";

import Sidebar from "../components/Sidebar";

import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import AddProduct from "../pages/AddProduct";
import Orders from "../pages/Orders";
import Users from "../pages/Users";

import "../styles/AdminLayout.css";

function AdminLayout() {
    return (
        <div className="admin-layout">

            <Sidebar />

            <main className="admin-content">

                <Routes>

                    <Route index element={<Dashboard />} />

                    <Route path="products" element={<Products />} />

                    <Route path="add-product" element={<AddProduct />} />

                    <Route path="orders" element={<Orders />} />

                    <Route path="users" element={<Users />} />

                </Routes>

            </main>

        </div>
    );
}

export default AdminLayout;