import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "../styles/AddProduct.css";
import "../styles/EditProduct.css";

function EditProduct() {

    const { id } = useParams();
    const navigate = useNavigate();

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


    // =========================================
    // INPUT DEĞİŞİKLİĞİ
    // =========================================

    const handleChange = (e) => {

        const { name, value, files } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value
        }));

    };


    // =========================================
    // ÜRÜNÜ GÜNCELLE
    // =========================================

    const handleSubmit = async (e) => {

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

            if (response.ok) {
                navigate("/admin/products");
            }

        } catch (error) {

            console.error(error);

            alert(
                "Ürün güncellenirken bir hata oluştu."
            );

        }

    };


    // =========================================
    // VERİLERİ GETİR
    // =========================================

    useEffect(() => {

        // Kategoriler

        fetch("http://localhost:5000/api/categories")
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.log(err));


        // Markalar

        fetch("http://localhost:5000/api/brands")
            .then(res => res.json())
            .then(data => setBrands(data))
            .catch(err => console.log(err));


        // Ürün

        fetch(`http://localhost:5000/api/products/${id}`)
            .then(res => res.json())
            .then(data => {

                setFormData({
                    name: data.name || "",
                    brand_id: data.brand_id || "",
                    category_id: data.category_id || "",
                    price: data.price || "",
                    discount: data.discount || "",
                    stock: data.stock || "",
                    status: data.status || "active",
                    description: data.description || "",
                    image: null
                });

            })
            .catch(err => console.log(err));

    }, [id]);


    return (

        <div className="add-product-page edit-product-page">


            {/* =================================
                HEADER
            ================================= */}

            <div className="page-header">

                <div>

                    <span className="page-eyebrow">
                        ÜRÜN YÖNETİMİ
                    </span>

                    <h1>
                        Ürün Düzenle
                    </h1>

                    <p>
                        Ürün bilgilerini güncelleyin.
                    </p>

                </div>

            </div>


            {/* =================================
                FORM
            ================================= */}

            <form
                className="product-form edit-product-form"
                onSubmit={handleSubmit}
            >


                {/* ÜRÜN ADI */}

                <div className="form-group">

                    <label>
                        Ürün Adı
                    </label>

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />

                </div>


                {/* MARKA + KATEGORİ */}

                <div className="form-row">

                    <div className="form-group">

                        <label>
                            Marka
                        </label>

                        <select
                            name="brand_id"
                            value={formData.brand_id}
                            onChange={handleChange}
                        >

                            <option value="">
                                Marka Seçiniz
                            </option>

                            {brands.map((brand) => (

                                <option
                                    key={brand.id}
                                    value={brand.id}
                                >
                                    {brand.name}
                                </option>

                            ))}

                        </select>

                    </div>


                    <div className="form-group">

                        <label>
                            Kategori
                        </label>

                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                        >

                            <option value="">
                                Kategori Seçiniz
                            </option>

                            {categories.map((category) => (

                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </option>

                            ))}

                        </select>

                    </div>

                </div>


                {/* FİYAT + İNDİRİM */}

                <div className="form-row">

                    <div className="form-group">

                        <label>
                            Fiyat
                        </label>

                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            İndirim (%)
                        </label>

                        <input
                            type="number"
                            name="discount"
                            value={formData.discount}
                            onChange={handleChange}
                        />

                    </div>

                </div>


                {/* STOK + DURUM */}

                <div className="form-row">

                    <div className="form-group">

                        <label>
                            Stok
                        </label>

                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Durum
                        </label>

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >

                            <option value="active">
                                Aktif
                            </option>

                            <option value="inactive">
                                Pasif
                            </option>

                        </select>

                    </div>

                </div>


                {/* AÇIKLAMA */}

                <div className="form-group">

                    <label>
                        Açıklama
                    </label>

                    <textarea
                        rows="6"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />

                </div>


                {/* GÖRSEL */}

                <div className="form-group edit-image-group">

                    <label>
                        Yeni Ürün Görseli
                    </label>

                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                    />

                    <small>
                        Yeni görsel seçmezseniz mevcut ürün görseli korunur.
                    </small>

                </div>


                {/* BUTONLAR */}

                <div className="form-buttons">

                    <button
                        type="button"
                        className="edit-cancel-btn"
                        onClick={() => navigate("/admin/products")}
                    >
                        İptal
                    </button>


                    <button
                        type="submit"
                        className="edit-submit-btn"
                    >
                        Güncelle
                    </button>

                </div>

            </form>

        </div>

    );

}

export default EditProduct;