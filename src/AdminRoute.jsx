import { Navigate, Outlet } from "react-router-dom";

function AdminRoute() {

    const user = JSON.parse(localStorage.getItem("user"));

    // Giriş yapılmamışsa login sayfasına gönder
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Kullanıcı admin değilse ana sayfaya gönder
    if (user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    // Admin ise alt route'u göster
    return <Outlet />;
}

export default AdminRoute;