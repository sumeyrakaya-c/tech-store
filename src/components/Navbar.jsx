import { useState } from "react";
import { Link } from "react-router-dom";

import {
  FiMenu,
  FiHeart,
  FiShoppingCart,
  FiUser,
  FiSearch,
  FiHome,
} from "react-icons/fi";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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
            <input type="text" placeholder="Ürün ara..." />
          </div>
        </div>

        <div className="nav-right">
          <Link to="/">
             <FiHome className="icon" />
          </Link>
          <FiHeart className="icon" />
          <Link to="/cart">
             <FiShoppingCart className="icon" />
          </Link>
          <FiUser className="icon" />
        </div>
      </nav>
      {isOpen && 
        <div
           className="overlay"
           onClick={() => setIsOpen(false)}
           ></div>}
      {isOpen && (
        <div className={isOpen ? "sidebar active" : "sidebar"}>
          <h3>Kategoriler</h3>

          <ul>
            <li>💻 Bilgisayar</li>
            <li>📱 Telefon</li>
            <li>🖥️ Monitör</li>
            <li>⌨️ Klavye</li>
            <li>🖱️ Mouse</li>
            <li>🎧 Kulaklık</li>
            <li>⌚ Akıllı Saat</li>
            <li>💾 Depolama</li>
            <li>🎮 Oyuncu Ekipmanları</li>
            <li>🔌 Kablo & Adaptör</li>
            <li>🧩 Aksesuarlar</li>
          </ul>
        </div>
      )}
    </>
  );
}

export default Navbar;