import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Products.css";
import { FiPlus, FiSearch, FiFilter } from "react-icons/fi";

function Products() {

    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        fetch("http://localhost:5000/api/products")
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.log(err));

    }, []);

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

            setProducts(products.filter(product => product.id !== id));

        } catch (error) {

            console.error(error);

        }

    };

    return (
        <div className="products-page">

            <div className="page-header">

                <div>

                    <h1>Ürün Yönetimi</h1>

                    <p>
                        Ürünleri görüntüleyebilir, düzenleyebilir ve yeni ürün
                        ekleyebilirsiniz.
                    </p>

                </div>

                <button className="add-product-btn">

                    <FiPlus />

                    Yeni Ürün

                </button>

            </div>

            <div className="toolbar">

                <div className="search-box">

                    <FiSearch />

                    <input
                        type="text"
                        placeholder="Ürün ara..."
                    />

                </div>

                <button className="filter-btn">

                    <FiFilter />

                    Filtrele

                </button>

            </div>

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

                        {products.length === 0 ? (

                            <tr>

                                <td colSpan="8" className="empty-row">
                                    Henüz ürün bulunmuyor.
                                </td>

                            </tr>

                        ) : (

                            products.map((product) => (

                                <tr key={product.id}>

                                    <td>

                                        <img
                                            src={`http://localhost:5000/uploads/${product.image}`}
                                            alt={product.name}
                                            width="60"
                                        />

                                    </td>

                                    <td>{product.name}</td>

                                    <td>{product.brand_name}</td>

                                    <td>{product.category_name}</td>

                                    <td>
                                        {Number(product.price).toLocaleString("tr-TR")} ₺
                                    </td>

                                    <td>{product.stock}</td>

                                    <td>{product.status}</td>

                                    <td>

                                       <button
                                            onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                                         >
                                             Düzenle
                                        </button>

                                        <button
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            Sil
                                        </button>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default Products;