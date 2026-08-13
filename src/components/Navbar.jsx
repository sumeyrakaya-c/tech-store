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

  const user = JSON.parse(localStorage.getItem("user"));
  const [profileMenu, setProfileMenu] = useState(false);


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
        (sum, item) => sum + Number(item.quantity || 0),
        0
      );

      setCartCount(total);

    } catch (error) {

      console.log("Sepet sayısı alınamadı:", error);

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

      <nav className="navbar">

        {/* =========================
            SOL
        ========================= */}

        <div className="nav-left">

          <FiMenu
            className="icon"
            onClick={() => setIsOpen(!isOpen)}
          />

          <h2 className="logo">
            <span>Tekno</span>Hup
          </h2>

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


          {/* ANA SAYFA */}

          <Link
            to="/"
            onClick={() => {

              setSearch("");
              setCategory("");

            }}
          >

            <FiHome className="icon" />

          </Link>


          {/* FAVORİLER */}

          <Link to="/favorites">

            <FiHeart className="icon" />

          </Link>


          {/* =========================
              SEPET
          ========================= */}

          <Link
            to="/cart"
            className="cart-nav-link"
          >

            <FiShoppingCart className="icon" />


            {/* SEPET SAYISI */}

            {cartCount > 0 && (

              <span className="cart-badge">

                {cartCount}

              </span>

            )}

          </Link>


          {/* =========================
              KULLANICI
          ========================= */}

          <FiUser
            className="icon"
            style={{ cursor: "pointer" }}
            onClick={() => {

              if (user) {

                navigate("/profile");

              } else {

                navigate("/login", {
                  state: {
                    from: location.pathname
                  }
                });

              }

            }}
          />


          {/* =========================
              GİRİŞ / KAYIT
          ========================= */}

          {!user ? (

            <>

              <Link
                to="/login"
                state={{
                  from: location.pathname
                }}
                className="auth-link login-link"
              >
                Giriş Yap
              </Link>

              <span className="auth-separator">
                /
              </span>

              <Link
                to="/register"
                state={{
                  from: location.pathname
                }}
                className="nav-auth-link"
              >
                Kayıt Ol
              </Link>

            </>

          ) : (

            <>

              {/* ÇIKIŞ */}

              <button
                className="logout-icon"
                onClick={logout}
                title="Çıkış Yap"
              >

                <FiLogOut />

              </button>


              {/* ADMİN */}

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


      {/* =========================
          OVERLAY
      ========================= */}

      {isOpen && (

        <div
          className="overlay"
          onClick={() => setIsOpen(false)}
        />

      )}


      {/* =========================
          SIDEBAR
      ========================= */}

      {isOpen && (

        <div className="sidebar active">

          <h3>Kategoriler</h3>

          <ul>

            <li
              onClick={() => {

                setCategory("");
                setIsOpen(false);

              }}
            >
              🏠 Tüm Ürünler
            </li>


            <li
              onClick={() => {

                setCategory(2);
                setIsOpen(false);

              }}
            >
              💻 Bilgisayar
            </li>


            <li
              onClick={() => {

                setCategory(1);
                setIsOpen(false);

              }}
            >
              📱 Telefon
            </li>


            <li
              onClick={() => {

                setCategory(3);
                setIsOpen(false);

              }}
            >
              📱 Tablet
            </li>


            <li
              onClick={() => {

                setCategory(4);
                setIsOpen(false);

              }}
            >
              🖥️ Monitör
            </li>


            <li
              onClick={() => {

                setCategory(6);
                setIsOpen(false);

              }}
            >
              ⌨️ Klavye
            </li>


            <li
              onClick={() => {

                setCategory(7);
                setIsOpen(false);

              }}
            >
              🖱️ Mouse
            </li>


            <li
              onClick={() => {

                setCategory(5);
                setIsOpen(false);

              }}
            >
              🎧 Kulaklık
            </li>


            <li
              onClick={() => {

                setCategory(8);
                setIsOpen(false);

              }}
            >
              ⌚ Akıllı Saat
            </li>


            <li
              onClick={() => {

                setCategory(9);
                setIsOpen(false);

              }}
            >
              💾 Depolama
            </li>


            <li
              onClick={() => {

                setCategory(10);
                setIsOpen(false);

              }}
            >
              🎮 Oyuncu Ekipmanları
            </li>


            <li
              onClick={() => {

                setCategory(11);
                setIsOpen(false);

              }}
            >
              🔌 Kablo & Adaptör
            </li>


            <li
              onClick={() => {

                setCategory(12);
                setIsOpen(false);

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