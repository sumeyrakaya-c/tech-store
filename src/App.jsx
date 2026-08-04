import { useState } from "react";
import Profile from "./pages/profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";
import Navbar from "./components/Navbar";
import MyOrders from "./pages/MyOrders";
import Favorites from "./pages/Favorites";

import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import AdminLayout from "./admin/layout/AdminLayout";

import {
    BrowserRouter,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";

function AppContent() {

     const [search, setSearch] = useState("");

     console.log("App search:", search);
     const [category, setCategory] = useState("");

    const location = useLocation();

    const isAdmin = location.pathname.startsWith("/admin");

    return (
        <>

            {!isAdmin && (
            <Navbar
    search={search}
    setSearch={setSearch}
    category={category}
    setCategory={setCategory}
/>
)}


            <Routes>

                <Route
    path="/my-orders"
    element={<MyOrders />}
/>

                <Route
    path="/favorites"
    element={<Favorites />}
/>

                <Route
    path="/profile"
    element={<Profile />}
/>

                <Route
                    path="/login"
                    element={<Login />}
                />

               <Route
                    path="/register"
                    element={<Register />}
                />
               <Route
                   path="/"
                   element={
                   <Home
            search={search}
            category={category}
        />
    }
/>

                <Route
                    path="/product/:id"
                    element={<ProductDetail />}
                />

                <Route
                    path="/cart"
                    element={<Cart />}
               />

                <Route
                    path="/admin/*"
                    element={<AdminLayout />}
                />

            </Routes>

        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;