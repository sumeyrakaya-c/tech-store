import "./App.css";
import Navbar from "./components/Navbar";

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

    const location = useLocation();

    const isAdmin = location.pathname.startsWith("/admin");

    return (
        <>

            {!isAdmin && <Navbar />}

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
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