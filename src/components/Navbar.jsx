import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import {
  FiMenu,
  FiHeart,
  FiShoppingCart,
  FiUser,
  FiSearch,
  FiHome,
} from "react-icons/fi";

function Navbar({
    search,
    setSearch,
    category,
    setCategory
}) {

  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
 const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const [profileMenu, setProfileMenu] = useState(false);


  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/";

    

  };

  return (
    <>
      <nav className="navbar">

        <div className="nav-left">

          <FiMenu
    className="icon"
    onClick={() => setIsOpen(!isOpen)}
/>

          <h2 className="logo">
            <span>Tekno</span>Hup
          </h2>

        </div>

        <div className="nav-center">

          <div className="search-box">

            <FiSearch />

           <input
              type="text"
              placeholder="Ürün ara..."
              value={search}
              onChange={(e) => {

    console.log("Yazılan:", e.target.value);

    setSearch(e.target.value);

}}
            />

          </div>

        </div>

        <div className="nav-right">

          <Link
    to="/"
    onClick={() => {
        setSearch("");
        setCategory("");
    }}
>
    <FiHome className="icon" />
</Link>

            <Link to="/favorites">
    <FiHeart className="icon" />
</Link>

          <Link to="/cart">
            <FiShoppingCart className="icon" />
          </Link>
             
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

{!user ? (

    <>

        <Link
            to="/login"
            state={{
                from: location.pathname
            }}
            style={{
                marginLeft: "15px",
                textDecoration: "none"
            }}
        >
            Giriş Yap
        </Link>

        <span
            style={{
                margin: "0 6px",
                color: "#999"
            }}
        >
            /
        </span>

        <Link
            to="/register"
            style={{
                textDecoration: "none"
            }}
        >
            Kayıt Ol
        </Link>

    </>

) : (

            <>

              <Link
                to="/profile"
                style={{
                  marginLeft: "15px",
                  fontWeight: "600",
                  textDecoration: "none",
                  color: "inherit"
                }}
              >
              </Link>


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

      {isOpen && (

        <div
          className="overlay"
          onClick={() => setIsOpen(false)}
        />

      )}

      {isOpen && (

        <div className="sidebar active">

          <h3>Kategoriler</h3>
<ul>

    <li onClick={() => {
        setCategory("");
        setIsOpen(false);
    }}>
        🏠 Tüm Ürünler
    </li>

    <li onClick={() => {
        setCategory(2);
        setIsOpen(false);
    }}>
        💻 Bilgisayar
    </li>

    <li onClick={() => {
        setCategory(1);
        setIsOpen(false);
    }}>
        📱 Telefon
    </li>

    <li onClick={() => {
        setCategory(3);
        setIsOpen(false);
    }}>
        📱 Tablet
    </li>

    <li onClick={() => {
        setCategory(4);
        setIsOpen(false);
    }}>
        🖥️ Monitör
    </li>

    <li onClick={() => {
        setCategory(6);
        setIsOpen(false);
    }}>
        ⌨️ Klavye
    </li>

    <li onClick={() => {
        setCategory(7);
        setIsOpen(false);
    }}>
        🖱️ Mouse
    </li>

    <li onClick={() => {
        setCategory(5);
        setIsOpen(false);
    }}>
        🎧 Kulaklık
    </li>

    <li onClick={() => {
        setCategory(8);
        setIsOpen(false);
    }}>
        ⌚ Akıllı Saat
    </li>

    <li onClick={() => {
        setCategory(9);
        setIsOpen(false);
    }}>
        💾 Depolama
    </li>

    <li onClick={() => {
        setCategory(10);
        setIsOpen(false);
    }}>
        🎮 Oyuncu Ekipmanları
    </li>

    <li onClick={() => {
        setCategory(11);
        setIsOpen(false);
    }}>
        🔌 Kablo & Adaptör
    </li>

    <li onClick={() => {
        setCategory(12);
        setIsOpen(false);
    }}>
        🧩 Aksesuarlar
    </li>

</ul>
        </div>

      )}

    </>
  );

}

export default Navbar;