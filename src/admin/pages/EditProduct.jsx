import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "../styles/AddProduct.css";
import "../styles/EditProduct.css";

function EditProduct() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    // =========================================
    // TEKNİK ÖZELLİKLER
    // =========================================

    const [specs, setSpecs] = useState({
        processor: "",
        ram: "",
        storage: "",
        display: "",
        battery: "",
        camera: "",
        operating_system: ""
    });

    // =========================================
    // ÜRÜN BİLGİLERİ
    // =========================================

    const [formData, setFormData] = useState({
        name: "",
        brand_id: "",
        category_id: "",

        // Renk / Varyant
        color_name: "",
        color_code: "#FFFFFF",
        variant_group_id: "",

        price: "",
        discount: "",
        stock: "",
        status: "active",
        description: "",

        image: null,
        image2: null,
        image3: null
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
    // TEKNİK ÖZELLİK DEĞİŞİKLİĞİ
    // =========================================

    const handleSpecChange = (e) => {

        const { name, value } = e.target;

        setSpecs((prev) => ({
            ...prev,
            [name]: value
        }));

    };

    // =========================================
    // ÜRÜNÜ + TEKNİK ÖZELLİKLERİ GÜNCELLE
    // =========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            // =====================================
            // 1. ÜRÜNÜ GÜNCELLE
            // =====================================

            const data = new FormData();

            data.append("name", formData.name);
            data.append("brand_id", formData.brand_id);
            data.append("category_id", formData.category_id);

            // =====================================
            // RENK / VARYANT
            // =====================================

            data.append(
                "color_name",
                formData.color_name
            );

            data.append(
                "color_code",
                formData.color_code
            );

            data.append(
                "variant_group_id",
                formData.variant_group_id
            );

            // =====================================
            // DİĞER BİLGİLER
            // =====================================

            data.append("price", formData.price);
            data.append("discount", formData.discount);
            data.append("stock", formData.stock);
            data.append("status", formData.status);
            data.append("description", formData.description);

            // =====================================
            // GÖRSELLER
            // =====================================

            if (formData.image) {

                data.append(
                    "image",
                    formData.image
                );

            }

            if (formData.image2) {

                data.append(
                    "image2",
                    formData.image2
                );

            }

            if (formData.image3) {

                data.append(
                    "image3",
                    formData.image3
                );

            }

            // =====================================
            // API'YE GÖNDER
            // =====================================

            const productResponse = await fetch(
                `http://localhost:5000/api/products/${id}`,
                {
                    method: "PUT",
                    body: data
                }
            );

            const productResult =
                await productResponse.json();

            if (!productResponse.ok) {

                throw new Error(
                    productResult.message ||
                    "Ürün güncellenemedi."
                );

            }

            // =====================================
            // 2. TEKNİK ÖZELLİKLERİ GÜNCELLE
            // =====================================

            const specsResponse = await fetch(
                `http://localhost:5000/api/product-specs/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(specs)
                }
            );

            const specsResult =
                await specsResponse.json();

            if (!specsResponse.ok) {

                throw new Error(
                    specsResult.message ||
                    "Teknik özellikler güncellenemedi."
                );

            }

            // =====================================
            // BAŞARILI
            // =====================================

            alert(
                "Ürün ve teknik özellikler başarıyla güncellendi."
            );

            navigate("/admin/products");

        } catch (error) {

            console.error(
                "GÜNCELLEME HATASI:",
                error
            );

            alert(
                error.message ||
                "Ürün güncellenirken bir hata oluştu."
            );

        }

    };

    // =========================================
    // VERİLERİ GETİR
    // =========================================

    useEffect(() => {

        // =====================================
        // KATEGORİLER
        // =====================================

        fetch(
            "http://localhost:5000/api/categories"
        )
            .then((res) => res.json())
            .then((data) => {

                setCategories(data);

            })
            .catch((err) => {

                console.log(
                    "Kategoriler alınamadı:",
                    err
                );

            });

        // =====================================
        // MARKALAR
        // =====================================

        fetch(
            "http://localhost:5000/api/brands"
        )
            .then((res) => res.json())
            .then((data) => {

                setBrands(data);

            })
            .catch((err) => {

                console.log(
                    "Markalar alınamadı:",
                    err
                );

            });

        // =====================================
        // ÜRÜN
        // =====================================

        fetch(
            `http://localhost:5000/api/products/${id}`
        )
            .then((res) => res.json())
            .then((data) => {

                setFormData({

                    name:
                        data.name || "",

                    brand_id:
                        data.brand_id || "",

                    category_id:
                        data.category_id || "",

                    // =================================
                    // RENK / VARYANT
                    // =================================

                    color_name:
                        data.color_name || "",

                    color_code:
                        data.color_code || "#FFFFFF",

                    variant_group_id:
                        data.variant_group_id || "",

                    // =================================
                    // DİĞER
                    // =================================

                    price:
                        data.price || "",

                    discount:
                        data.discount || "",

                    stock:
                        data.stock || "",

                    status:
                        data.status || "active",

                    description:
                        data.description || "",

                    // Yeni dosya seçilmediği için
                    // null bırakıyoruz.
                    image: null,
                    image2: null,
                    image3: null

                });

            })
            .catch((err) => {

                console.log(
                    "Ürün alınamadı:",
                    err
                );

            });

        // =====================================
        // TEKNİK ÖZELLİKLER
        // =====================================

        fetch(
            `http://localhost:5000/api/product-specs/${id}`
        )
            .then((res) => res.json())
            .then((data) => {

                if (data) {

                    setSpecs({

                        processor:
                            data.processor || "",

                        ram:
                            data.ram || "",

                        storage:
                            data.storage || "",

                        display:
                            data.display || "",

                        battery:
                            data.battery || "",

                        camera:
                            data.camera || "",

                        operating_system:
                            data.operating_system || ""

                    });

                }

            })
            .catch((err) => {

                console.log(
                    "Teknik özellikler alınamadı:",
                    err
                );

            });

    }, [id]);

    return (

        <div className="add-product-page edit-product-page">

            {/* =================================
                BAŞLIK
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
                        Ürün bilgilerini ve teknik
                        özelliklerini güncelleyin.
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

                {/* =================================
                    ÜRÜN ADI
                ================================= */}

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

                {/* =================================
                    MARKA + KATEGORİ
                ================================= */}

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

                {/* =================================
                    RENK / VARYANT
                ================================= */}

                <div className="color-variant-section">

                    <h2>
                        Renk ve Varyant
                    </h2>

                    <p>
                        Ürünün renk bilgisini ve aynı
                        ürüne ait varyant grubunu düzenleyin.
                    </p>

                    <div className="form-row">

                        {/* RENK ADI */}

                        <div className="form-group">

                            <label>
                                Renk Adı
                            </label>

                            <input
                                type="text"
                                name="color_name"
                                value={formData.color_name}
                                onChange={handleChange}
                                placeholder="Örn: Turuncu"
                            />

                        </div>

                        {/* RENK KODU */}

                        <div className="form-group">

                            <label>
                                Renk
                            </label>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px"
                                }}
                            >

                                <input
                                    type="color"
                                    name="color_code"
                                    value={
                                        formData.color_code ||
                                        "#FFFFFF"
                                    }
                                    onChange={handleChange}
                                    style={{
                                        width: "60px",
                                        height: "45px",
                                        padding: "3px",
                                        cursor: "pointer"
                                    }}
                                />

                                <input
                                    type="text"
                                    value={
                                        formData.color_code ||
                                        "#FFFFFF"
                                    }
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            color_code:
                                                e.target.value
                                        }))
                                    }
                                    placeholder="#FFFFFF"
                                />

                            </div>

                        </div>

                    </div>

                    {/* VARYANT GRUBU */}

                    <div className="form-group">

                        <label>
                            Varyant Grup ID
                        </label>

                        <input
                            type="number"
                            name="variant_group_id"
                            value={
                                formData.variant_group_id
                            }
                            onChange={handleChange}
                            placeholder="Örn: 1"
                        />

                        <small>
                            Aynı ürünün farklı renkleri
                            için aynı grup ID'sini kullanın.
                        </small>

                    </div>

                </div>

                {/* =================================
                    FİYAT + İNDİRİM
                ================================= */}

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

                {/* =================================
                    STOK + DURUM
                ================================= */}

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

                {/* =================================
                    AÇIKLAMA
                ================================= */}

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

                {/* =================================
                    TEKNİK ÖZELLİKLER
                ================================= */}

                <div className="spec-edit-section">

                    <div className="spec-edit-header">

                        <h2>
                            Teknik Özellikler
                        </h2>

                        <p>
                            Ürünün teknik özelliklerini
                            buradan düzenleyebilirsiniz.
                        </p>

                    </div>

                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                İşlemci
                            </label>

                            <input
                                type="text"
                                name="processor"
                                value={specs.processor}
                                onChange={handleSpecChange}
                                placeholder="Örn: Apple A17 Pro"
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                RAM
                            </label>

                            <input
                                type="text"
                                name="ram"
                                value={specs.ram}
                                onChange={handleSpecChange}
                                placeholder="Örn: 8 GB"
                            />

                        </div>

                    </div>

                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                Depolama
                            </label>

                            <input
                                type="text"
                                name="storage"
                                value={specs.storage}
                                onChange={handleSpecChange}
                                placeholder="Örn: 256 GB"
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Ekran
                            </label>

                            <input
                                type="text"
                                name="display"
                                value={specs.display}
                                onChange={handleSpecChange}
                                placeholder="Örn: 6.3 inç OLED"
                            />

                        </div>

                    </div>

                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                Pil
                            </label>

                            <input
                                type="text"
                                name="battery"
                                value={specs.battery}
                                onChange={handleSpecChange}
                                placeholder="Örn: 4000 mAh"
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Kamera
                            </label>

                            <input
                                type="text"
                                name="camera"
                                value={specs.camera}
                                onChange={handleSpecChange}
                                placeholder="Örn: 48 MP"
                            />

                        </div>

                    </div>

                    <div className="form-group">

                        <label>
                            İşletim Sistemi
                        </label>

                        <input
                            type="text"
                            name="operating_system"
                            value={specs.operating_system}
                            onChange={handleSpecChange}
                            placeholder="Örn: iOS 18"
                        />

                    </div>

                </div>

                {/* =================================
                    GÖRSELLER
                ================================= */}

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
                        Yeni görsel seçmezseniz mevcut
                        ürün görseli korunur.
                    </small>

                </div>

                <div className="form-group edit-image-group">

                    <label>
                        Yeni Ürün Görseli 2
                    </label>

                    <input
                        type="file"
                        name="image2"
                        accept="image/*"
                        onChange={handleChange}
                    />

                    <small>
                        Yeni görsel seçmezseniz mevcut
                        ikinci görsel korunur.
                    </small>

                </div>

                <div className="form-group edit-image-group">

                    <label>
                        Yeni Ürün Görseli 3
                    </label>

                    <input
                        type="file"
                        name="image3"
                        accept="image/*"
                        onChange={handleChange}
                    />

                    <small>
                        Yeni görsel seçmezseniz mevcut
                        üçüncü görsel korunur.
                    </small>

                </div>

                {/* =================================
                    BUTONLAR
                ================================= */}

                <div className="form-buttons">

                    <button
                        type="button"
                        className="edit-cancel-btn"
                        onClick={() =>
                            navigate("/admin/products")
                        }
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