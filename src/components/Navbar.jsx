import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import "../styles/Navbar.css";

import {
  FiMenu,
  FiHeart,
  FiShoppingCart,
  FiUser,
  FiSearch,
  FiHome,
  FiLogOut,
  FiColumns,
} from "react-icons/fi";


function Navbar({
  search,
  setSearch,
  category,
  setCategory
}) {

  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [profileMenu, setProfileMenu] =
    useState(false);


  // =========================================
  // SEPET SAYISINI GETİR
  // =========================================

  const loadCartCount = async () => {

    try {

      const response = await fetch(
        "http://localhost:5000/api/cart"
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      const total = data.reduce(
        (sum, item) =>
          sum + Number(item.quantity || 0),
        0
      );

      setCartCount(total);

    } catch (error) {

      console.log(
        "Sepet sayısı alınamadı:",
        error
      );

    }

  };


  // =========================================
  // NAVBAR AÇILINCA + SEPET DEĞİŞİNCE
  // =========================================

  useEffect(() => {

    loadCartCount();

    const handleCartUpdate = () => {
      loadCartCount();
    };

    window.addEventListener(
      "cartUpdated",
      handleCartUpdate
    );

    return () => {

      window.removeEventListener(
        "cartUpdated",
        handleCartUpdate
      );

    };

  }, []);


  // =========================================
  // ÇIKIŞ
  // =========================================

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/";

  };


  return (

    <>

      {/* =====================================
          NAVBAR
      ===================================== */}

      <nav className="navbar">


        {/* =========================
            SOL
        ========================= */}

        <div className="nav-left">

          <FiMenu
            className="icon"
            onClick={() =>
              setIsOpen(!isOpen)
            }
          />


          <Link
            to="/"
            style={{
              textDecoration: "none"
            }}
          >

            <h2 className="logo">

              <span>Tekno</span>Hup

            </h2>

          </Link>

        </div>


        {/* =========================
            ARAMA
        ========================= */}

        <div className="nav-center">

          <div className="search-box">

            <FiSearch />

            <input
              type="text"
              placeholder="Ürün ara..."
              value={search}
              onChange={(e) => {

                setSearch(e.target.value);

              }}
            />

          </div>

        </div>


        {/* =========================
            SAĞ
        ========================= */}

        <div className="nav-right">


          {/* =========================
              ANA SAYFA
          ========================= */}

          <Link
            to="/"
            onClick={() => {

              setSearch("");
              setCategory("");

            }}
            title="Ana Sayfa"
          >

            <FiHome className="icon" />

          </Link>


          {/* =========================
              FAVORİLER
          ========================= */}

          <Link
            to="/favorites"
            title="Favoriler"
          >

            <FiHeart className="icon" />

          </Link>


          {/* =========================
              SEPET
          ========================= */}

          <Link
            to="/cart"
            className="cart-nav-link"
            title="Sepet"
          >

            <FiShoppingCart className="icon" />


            {cartCount > 0 && (

              <span className="cart-badge">

                {cartCount}

              </span>

            )}

          </Link>


          {/* =========================
              KULLANICI / GİRİŞ
          ========================= */}

          {!user ? (

            <>

              {/* KULLANICI İKONU */}

              <FiUser
                className="auth-user-icon"
              />


              {/* GİRİŞ YAP */}

              <Link
                to="/login"
                state={{
                  from: location.pathname
                }}
                className={`auth-link ${
                  location.pathname === "/login"
                    ? "active"
                    : ""
                }`}
              >

                Giriş Yap

              </Link>


              {/* AYIRICI */}

              <span className="auth-separator">
                /
              </span>


              {/* KAYIT OL */}

              <Link
                to="/register"
                state={{
                  from: location.pathname
                }}
                className={`auth-link ${
                  location.pathname === "/register"
                    ? "active"
                    : ""
                }`}
              >

                Kayıt Ol

              </Link>


              {/* =========================
                  KARŞILAŞTIRMA
              ========================= */}

              <Link
                to="/compare"
                className="compare-nav-link"
                title="Ürün Karşılaştır"
              >

                <FiColumns className="icon" />

              </Link>

            </>

          ) : (

            <>


              {/* =========================
                  PROFİL
              ========================= */}

              <FiUser
                className="auth-user-icon"
                onClick={() =>
                  navigate("/profile")
                }
                style={{
                  cursor: "pointer"
                }}
                title="Profil"
              />


              {/* =========================
                  KARŞILAŞTIRMA
                  ÇIKIŞTAN HEMEN ÖNCE
              ========================= */}

              <Link
                to="/compare"
                className="compare-nav-link"
                title="Ürün Karşılaştır"
              >

                <FiColumns className="icon" />

              </Link>


              {/* =========================
                  ÇIKIŞ
              ========================= */}

              <button
                className="logout-icon"
                onClick={logout}
                title="Çıkış Yap"
              >

                <FiLogOut />

              </button>


              {/* =========================
                  ADMİN PANELİ
              ========================= */}

              {user?.role === "admin" && (

                <Link
                  to="/admin"
                  style={{
                    marginLeft: "20px",
                    textDecoration: "none",
                    color: "inherit"
                  }}
                >

                  Admin Paneli

                </Link>

              )}

            </>

          )}

        </div>

      </nav>


      {/* =====================================
          OVERLAY
      ===================================== */}

      {isOpen && (

        <div
          className="overlay"
          onClick={() =>
            setIsOpen(false)
          }
        />

      )}


{/* =========================
    SIDEBAR
========================= */}

{isOpen && (

  <div className="sidebar active">

    <h3>Kategoriler</h3>

    <ul>

      {/* TÜM ÜRÜNLER */}

      <li
        onClick={() => {

          setCategory("");
          setSearch("");
          setIsOpen(false);

          navigate("/");

        }}
      >
        🏠 Tüm Ürünler
      </li>


      {/* BİLGİSAYAR */}

      <li
        onClick={() => {

          setCategory(2);
          setSearch("");
          setIsOpen(false);

          navigate("/");

        }}
      >
        💻 Bilgisayar
      </li>


      {/* TELEFON */}

      <li
        onClick={() => {

          setCategory(1);
          setSearch("");
          setIsOpen(false);

          navigate("/");

        }}
      >
        📱 Telefon
      </li>


      {/* TABLET */}

      <li
        onClick={() => {

          setCategory(3);
          setSearch("");
          setIsOpen(false);

          navigate("/");

        }}
      >
        📱 Tablet
      </li>


      {/* MONİTÖR */}

      <li
        onClick={() => {

          setCategory(4);
          setSearch("");
          setIsOpen(false);

          navigate("/");

        }}
      >
        🖥️ Monitör
      </li>


      {/* KLAVYE */}

      <li
        onClick={() => {

          setCategory(6);
          setSearch("");
          setIsOpen(false);

          navigate("/");

        }}
      >
        ⌨️ Klavye
      </li>


      {/* MOUSE */}

      <li
        onClick={() => {

          setCategory(7);
          setSearch("");
          setIsOpen(false);

          navigate("/");

        }}
      >
        🖱️ Mouse
      </li>


      {/* KULAKLIK */}

      <li
        onClick={() => {

          setCategory(5);
          setSearch("");
          setIsOpen(false);

          navigate("/");

        }}
      >
        🎧 Kulaklık
      </li>


      {/* AKILLI SAAT */}

      <li
        onClick={() => {

          setCategory(8);
          setSearch("");
          setIsOpen(false);

          navigate("/");

        }}
      >
        ⌚ Akıllı Saat
      </li>


      {/* DEPOLAMA */}

      <li
        onClick={() => {

          setCategory(9);
          setSearch("");
          setIsOpen(false);

          navigate("/");

        }}
      >
        💾 Depolama
      </li>


      {/* OYUNCU EKİPMANLARI */}

      <li
        onClick={() => {

          setCategory(10);
          setSearch("");
          setIsOpen(false);

          navigate("/");

        }}
      >
        🎮 Oyuncu Ekipmanları
      </li>


      {/* KABLO & ADAPTÖR */}

      <li
        onClick={() => {

          setCategory(11);
          setSearch("");
          setIsOpen(false);

          navigate("/");

        }}
      >
        🔌 Kablo & Adaptör
      </li>


      {/* AKSESUARLAR */}

      <li
        onClick={() => {

          setCategory(12);
          setSearch("");
          setIsOpen(false);

          navigate("/");

        }}
      >
        🧩 Aksesuarlar
      </li>

    </ul>

  </div>

)}

    </>

  );

}


export default Navbar;