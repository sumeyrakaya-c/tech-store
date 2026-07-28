import "../styles/Products.css";
import { FiPlus, FiSearch, FiFilter } from "react-icons/fi";

function Products() {
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

            <tr>

                <td colSpan="8" className="empty-row">

                    Henüz ürün bulunmuyor.

                </td>

            </tr>

        </tbody>

    </table>

</div>

        </div>
    );
}

export default Products;