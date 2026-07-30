import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/AddProduct.css";

function EditProduct() {

    const { id } = useParams();

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        brand_id: "",
        category_id: "",
        price: "",
        discount: "",
        stock: "",
        status: "active",
        description: "",
        image: null
    });

    const handleChange = (e) => {

    const { name, value, files } = e.target;

    setFormData({
        ...formData,
        [name]: files ? files[0] : value
    });

};

async function handleSubmit(e) {

    e.preventDefault();

    const data = new FormData();

    data.append("name", formData.name);
    data.append("brand_id", formData.brand_id);
    data.append("category_id", formData.category_id);
    data.append("price", formData.price);
    data.append("discount", formData.discount);
    data.append("stock", formData.stock);
    data.append("status", formData.status);
    data.append("description", formData.description);

    if (formData.image) {
        data.append("image", formData.image);
    }

    try {

        const response = await fetch(
            `http://localhost:5000/api/products/${id}`,
            {
                method: "PUT",
                body: data
            }
        );

        const result = await response.json();

        alert(result.message);

    } catch (error) {

        console.error(error);

    }

}


    useEffect(() => {


    // Kategorileri getir
    fetch("http://localhost:5000/api/categories")
        .then(res => res.json())
        .then(data => setCategories(data))
        .catch(err => console.log(err));

    // Markaları getir
    fetch("http://localhost:5000/api/brands")
        .then(res => res.json())
        .then(data => setBrands(data))
        .catch(err => console.log(err));

    // Ürün bilgilerini getir
    fetch(`http://localhost:5000/api/products/${id}`)
        .then(res => res.json())
        .then(data => {

            setFormData({
                name: data.name,
                brand_id: data.brand_id,
                category_id: data.category_id,
                price: data.price,
                discount: data.discount,
                stock: data.stock,
                status: data.status,
                description: data.description,
                image: null
            });

        })
        .catch(err => console.log(err));

}, [id]);

    return (
        <div className="add-product-page">

            <div className="page-header">
                <h1>    ü   rün Düzenle</h1>
                <p>Ürün bilgilerini güncelleyin.</p>
            </div>

            <form className="product-form" onSubmit={handleSubmit}>

                <div className="form-group">
                    <label>Ürün Adı</label>

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-row">

                    <div className="form-group">
                        <label>Marka</label>

                        <select
                            name="brand_id"
                            value={formData.brand_id}
                            onChange={handleChange}
                        >
                            <option value="">Marka Seçiniz</option>

                            {brands.map((brand) => (
                                <option key={brand.id} value={brand.id}>
                                    {brand.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Kategori</label>

                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                        >
                            <option value="">Kategori Seçiniz</option>

                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>

                <div className="form-row">

                    <div className="form-group">
                        <label>Fiyat</label>

                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>İndirim (%)</label>

                        <input
                            type="number"
                            name="discount"
                            value={formData.discount}
                            onChange={handleChange}
                        />
                    </div>

                </div>

                <div className="form-row">

                    <div className="form-group">
                        <label>Stok</label>

                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Durum</label>

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="active">Aktif</option>
                            <option value="inactive">Pasif</option>
                        </select>

                    </div>

                </div>

                <div className="form-group">

                    <label>Açıklama</label>

                    <textarea
                        rows="6"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />

                </div>

                <div className="form-group">

                    <label>Ürün Görseli</label>

                    <input
                        type="file"
                        name="image"
                        onChange={handleChange}
                    />

                </div>

                <div className="form-buttons">

                    <button type="reset">
                        Temizle
                    </button>

                    <button type="submit">
                        Güncelle
                    </button>

                </div>

            </form>

        </div>
    );

}

export default EditProduct;