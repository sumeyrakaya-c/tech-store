import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Products.css";

import {
    FiPlus,
    FiSearch,
    FiFilter,
    FiEdit2,
    FiTrash2
} from "react-icons/fi";

function Products() {

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");

    const navigate = useNavigate();


    // =========================================
    // ÜRÜNLERİ GETİR
    // =========================================

    useEffect(() => {

        fetch("http://localhost:5000/api/products")
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.log(err));

    }, []);


    // =========================================
    // ÜRÜN SİL
    // =========================================

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Bu ürünü silmek istediğinize emin misiniz?"
        );

        if (!confirmDelete) return;

        try {

            const response = await fetch(
                `http://localhost:5000/api/products/${id}`,
                {
                    method: "DELETE"
                }
            );

            const result = await response.json();

            alert(result.message);

            setProducts((prev) =>
                prev.filter((product) => product.id !== id)
            );

        } catch (error) {

            console.error(error);

            alert("Ürün silinirken bir hata oluştu.");

        }

    };


    // =========================================
    // ARAMA
    // =========================================

    const filteredProducts = products.filter((product) => {

        const searchText = search.toLowerCase();

        return (
            product.name?.toLowerCase().includes(searchText) ||
            product.brand_name?.toLowerCase().includes(searchText) ||
            product.category_name?.toLowerCase().includes(searchText)
        );

    });


    return (

        <div className="products-page">


            {/* =========================
                HEADER
            ========================= */}

            <div className="page-header">

                <div>

                    <span className="page-eyebrow">
                        ÜRÜN YÖNETİMİ
                    </span>

                    <h1>Ürünler</h1>

                    <p>
                        Ürünleri görüntüleyebilir, düzenleyebilir ve
                        yeni ürün ekleyebilirsiniz.
                    </p>

                </div>


                <button
                    className="add-product-btn"
                    onClick={() => navigate("/admin/add-product")}
                >

                    <FiPlus />

                    <span>
                        Yeni Ürün
                    </span>

                </button>

            </div>



            {/* =========================
                TOOLBAR
            ========================= */}

            <div className="toolbar">

                <div className="product-search-box">

                    <FiSearch />

                    <input
                        type="text"
                        placeholder="Ürün, marka veya kategori ara..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </div>


                <button className="filter-btn">

                    <FiFilter />

                    <span>
                        Filtrele
                    </span>

                </button>

            </div>



            {/* =========================
                TABLO
            ========================= */}

            <div className="products-table">

                <table>

                    <thead>

                        <tr>

                            <th>Görsel</th>
                            <th>Ürün</th>
                            <th>Marka</th>
                            <th>Kategori</th>
                            <th>Fiyat</th>
                            <th>Stok</th>
                            <th>Durum</th>
                            <th>İşlem</th>

                        </tr>

                    </thead>


                    <tbody>

                        {filteredProducts.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="8"
                                    className="empty-row"
                                >

                                    {search
                                        ? "Aramanızla eşleşen ürün bulunamadı."
                                        : "Henüz ürün bulunmuyor."
                                    }

                                </td>

                            </tr>

                        ) : (

                            filteredProducts.map((product) => (

                                <tr key={product.id}>


                                    {/* GÖRSEL */}

                                    <td>

                                        <div className="product-image-wrapper">

                                            <img
                                                src={`http://localhost:5000/uploads/${product.image}`}
                                                alt={product.name}
                                                className="product-table-image"
                                            />

                                        </div>

                                    </td>


                                    {/* ÜRÜN */}

                                    <td>

                                        <div className="product-name-cell">

                                            <strong>
                                                {product.name}
                                            </strong>

                                            <span>
                                                #{product.id}
                                            </span>

                                        </div>

                                    </td>


                                    {/* MARKA */}

                                    <td>

                                        {product.brand_name || "-"}

                                    </td>


                                    {/* KATEGORİ */}

                                    <td>

                                        <span className="category-badge">

                                            {product.category_name || "-"}

                                        </span>

                                    </td>


                                    {/* FİYAT */}

                                    <td>

                                        <strong className="product-price">

                                            {Number(product.price).toLocaleString(
                                                "tr-TR"
                                            )}

                                            {" "}₺

                                        </strong>

                                    </td>


                                    {/* STOK */}

                                    <td>

                                        <span
                                            className={
                                                Number(product.stock) > 0
                                                    ? "stock-badge stock-in"
                                                    : "stock-badge stock-out"
                                            }
                                        >

                                            {Number(product.stock) > 0
                                                ? `${product.stock} adet`
                                                : "Stok Yok"
                                            }

                                        </span>

                                    </td>


                                    {/* DURUM */}

                                    <td>

                                        <span
                                            className={
                                                product.status === "Aktif"
                                                    ? "status-badge status-active"
                                                    : "status-badge status-passive"
                                            }
                                        >

                                            <span className="status-dot"></span>

                                            {product.status}

                                        </span>

                                    </td>


                                    {/* İŞLEMLER */}

                                    <td>

                                        <div className="product-actions">


                                            <button
                                                className="edit-product-btn"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/products/edit/${product.id}`
                                                    )
                                                }
                                                title="Ürünü Düzenle"
                                            >

                                                <FiEdit2 />

                                                <span>
                                                    Düzenle
                                                </span>

                                            </button>


                                            <button
                                                className="delete-product-btn"
                                                onClick={() =>
                                                    handleDelete(product.id)
                                                }
                                                title="Ürünü Sil"
                                            >

                                                <FiTrash2 />

                                                <span>
                                                    Sil
                                                </span>

                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>


            {/* ÜRÜN SAYISI */}

            <div className="products-footer">

                <span>

                    Toplam{" "}
                    <strong>
                        {filteredProducts.length}
                    </strong>{" "}
                    ürün gösteriliyor.

                </span>

            </div>

        </div>

    );

}

export default Products;