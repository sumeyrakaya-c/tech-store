import { useState } from "react";
import "./App.css";

import {
    BrowserRouter,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";

// Language
import { LanguageProvider } from "./context/LanguageContext";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/profile";
import Favorites from "./pages/Favorites";
import MyOrders from "./pages/MyOrders";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Compare from "./pages/Compare";

// Components
import Navbar from "./components/Navbar";
import AIChat from "./components/AIChat.jsx";

// Admin
import AdminLayout from "./admin/layout/AdminLayout";


function AppContent() {

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");

    const location = useLocation();

    const isAdmin =
        location.pathname.startsWith("/admin");


    return (
        <>

            {/* Admin sayfalarında normal Navbar gösterme */}

            {!isAdmin && (

                <Navbar
                    search={search}
                    setSearch={setSearch}
                    category={category}
                    setCategory={setCategory}
                />

            )}


            <Routes>

                {/* =========================
                    NORMAL SAYFALAR
                ========================= */}

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
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/verify-email"
                    element={<VerifyEmail />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />

                <Route
                    path="/profile"
                    element={<Profile />}
                />

                <Route
                    path="/favorites"
                    element={<Favorites />}
                />

                <Route
                    path="/my-orders"
                    element={<MyOrders />}
                />

                <Route
                    path="/product/:id"
                    element={<ProductDetail />}
                />

                <Route
                    path="/cart"
                    element={<Cart />}
                />


                {/* =========================
                    ADMIN PANEL
                ========================= */}

                <Route
                    path="/admin/*"
                    element={<AdminLayout />}
                />

                <Route
    path="/compare"
    element={<Compare />}
/>

            </Routes>


            {/* AI ASİSTAN */}

            {!isAdmin && <AIChat />}

        </>
    );

}


function App() {

    return (

        <LanguageProvider>

            <BrowserRouter>

                <AppContent />

            </BrowserRouter>

        </LanguageProvider>

    );

}


export default App;