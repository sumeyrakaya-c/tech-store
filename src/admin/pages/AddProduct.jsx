import { useEffect, useState } from "react";
import "../styles/AddProduct.css";

function AddProduct() {

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        brand_id: "",
        category_id: "",

        // =========================================
        // RENK
        // =========================================
        color_name: "",
        color_code: "#FFFFFF",
        variant_group_id: "",

        price: "",
        discount: "",
        stock: "",
        status: "active",
        description: "",
        description_en: "",

        image: null,
        image2: null,
        image3: null,

        // Teknik özellikler
        processor: "",
        ram: "",
        storage: "",
        display: "",
        battery: "",
        camera: "",
        operating_system: ""
    });


    // =========================================
    // INPUT DEĞİŞİKLİĞİ
    // =========================================

    const handleChange = (e) => {

        const { name, value, files } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));

    };


    // =========================================
    // ÜRÜNÜ KAYDET
    // =========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            // =========================================
            // 1. ÜRÜNÜ KAYDET
            // =========================================

            const data = new FormData();

            data.append("name", formData.name);
            data.append("brand_id", formData.brand_id);
            data.append("category_id", formData.category_id);

            // =========================================
            // RENK BİLGİLERİ
            // =========================================

            data.append("color_name", formData.color_name);
            data.append("color_code", formData.color_code);
            data.append(
                "variant_group_id",
                formData.variant_group_id
            );

            data.append("price", formData.price);
            data.append("discount", formData.discount);
            data.append("stock", formData.stock);
            data.append("status", formData.status);
            data.append("description", formData.description);
            data.append("description_en", formData.description_en);


            // =========================================
            // GÖRSELLER
            // =========================================

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


            const response = await fetch(
                "http://localhost:5000/api/products",
                {
                    method: "POST",
                    body: data
                }
            );


            const result = await response.json();


            if (!response.ok) {

                alert(
                    result.message ||
                    "Ürün eklenirken hata oluştu."
                );

                return;

            }


            // Yeni oluşturulan ürünün ID'si
            const productId = result.id;


            // =========================================
            // 2. TEKNİK ÖZELLİKLERİ KAYDET
            // =========================================

            const specsResponse = await fetch(
                "http://localhost:5000/api/product-specs",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        product_id: productId,

                        processor:
                            formData.processor,

                        ram:
                            formData.ram,

                        storage:
                            formData.storage,

                        display:
                            formData.display,

                        battery:
                            formData.battery,

                        camera:
                            formData.camera,

                        operating_system:
                            formData.operating_system

                    })
                }
            );


            const specsResult =
                await specsResponse.json();


            if (!specsResponse.ok) {

                console.log(
                    "Teknik özellik hatası:",
                    specsResult
                );

                alert(
                    "Ürün eklendi fakat teknik özellikler kaydedilemedi."
                );

                return;

            }


            alert(
                "Ürün ve teknik özellikleri başarıyla eklendi."
            );


            // =========================================
            // FORMU TEMİZLE
            // =========================================

            setFormData({
                name: "",
                brand_id: "",
                category_id: "",

                color_name: "",
                color_code: "#FFFFFF",
                variant_group_id: "",

                price: "",
                discount: "",
                stock: "",
                status: "active",
                description: "",
                description_en: "",

                image: null,
                image2: null,
                image3: null,

                processor: "",
                ram: "",
                storage: "",
                display: "",
                battery: "",
                camera: "",
                operating_system: ""
            });


        } catch (error) {

            console.error(
                "ÜRÜN EKLEME HATASI:",
                error
            );

            alert(
                "Sunucuya bağlanırken hata oluştu."
            );

        }

    };


    // =========================================
    // KATEGORİ + MARKA
    // =========================================

    useEffect(() => {

        fetch("http://localhost:5000/api/categories")
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err =>
                console.log(
                    "Kategori hatası:",
                    err
                )
            );


        fetch("http://localhost:5000/api/brands")
            .then(res => res.json())
            .then(data => setBrands(data))
            .catch(err =>
                console.log(
                    "Marka hatası:",
                    err
                )
            );

    }, []);


    return (

        <div className="add-product-page">

            <div className="page-header">

                <h1>Yeni Ürün</h1>

                <p>
                    Mağazanıza yeni bir ürün ekleyin.
                </p>

            </div>


            <form
                className="product-form"
                onSubmit={handleSubmit}
            >


                {/* =========================================
                    TEMEL BİLGİLER
                ========================================= */}

                <div className="form-group">

                    <label>
                        Ürün Adı
                    </label>

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                </div>


                <div className="form-row">

                    <div className="form-group">

                        <label>
                            Marka
                        </label>

                        <select
                            name="brand_id"
                            value={formData.brand_id}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Marka Seçiniz
                            </option>

                            {brands.map(brand => (

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
                            required
                        >

                            <option value="">
                                Kategori Seçiniz
                            </option>

                            {categories.map(category => (

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


                {/* =========================================
                    RENK / VARYANT
                ========================================= */}

                <div className="color-variant-section">

                    <h2>Renk ve Varyant</h2>

                    <p>
                        Ürünün renk bilgisini ve aynı ürüne
                        ait varyant grubunu belirleyin.
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
                                placeholder="Örn: Beyaz"
                            />

                        </div>


                        {/* RENK SEÇİCİ */}

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
                                    value={formData.color_code}
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
                                    value={formData.color_code}
                                    onChange={(e) =>
                                        setFormData(prev => ({
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
                            value={formData.variant_group_id}
                            onChange={handleChange}
                            placeholder="Örn: 1"
                        />

                        <small>
                            Aynı ürünün farklı renkleri için
                            aynı grup ID'sini kullanın.
                            Örneğin iPhone 17 Turuncu ve Beyaz
                            için ikisine de 1 yazabilirsiniz.
                        </small>

                    </div>

                </div>


                {/* =========================================
                    FİYAT + İNDİRİM
                ========================================= */}

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
                            required
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


                {/* =========================================
                    STOK + DURUM
                ========================================= */}

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
                            required
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


                {/* =========================================
                    AÇIKLAMA
                ========================================= */}

                <div className="form-group">

    <label>
        Türkçe Açıklama
    </label>

    <textarea
        rows="6"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Ürünün Türkçe açıklamasını yazın..."
    />

</div>


<div className="form-group">

    <label>
        İngilizce Açıklama
    </label>

    <textarea
        rows="6"
        name="description_en"
        value={formData.description_en}
        onChange={handleChange}
        placeholder="Enter the English product description..."
    />

</div>


                {/* =========================================
                    TEKNİK ÖZELLİKLER
                ========================================= */}

                <div className="technical-specs">

                    <h2>
                        Teknik Özellikler
                    </h2>

                    <p>
                        Ürünün teknik özelliklerini giriniz.
                    </p>


                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                İşlemci
                            </label>

                            <input
                                type="text"
                                name="processor"
                                value={formData.processor}
                                onChange={handleChange}
                                placeholder="Örn: Intel Core i7-13700H"
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                RAM
                            </label>

                            <input
                                type="text"
                                name="ram"
                                value={formData.ram}
                                onChange={handleChange}
                                placeholder="Örn: 16 GB DDR5"
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
                                value={formData.storage}
                                onChange={handleChange}
                                placeholder="Örn: 512 GB SSD"
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Ekran
                            </label>

                            <input
                                type="text"
                                name="display"
                                value={formData.display}
                                onChange={handleChange}
                                placeholder="Örn: 15.6 inç FHD 144Hz"
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
                                value={formData.battery}
                                onChange={handleChange}
                                placeholder="Örn: 70 Wh"
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Kamera
                            </label>

                            <input
                                type="text"
                                name="camera"
                                value={formData.camera}
                                onChange={handleChange}
                                placeholder="Örn: 1080p"
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
                            value={formData.operating_system}
                            onChange={handleChange}
                            placeholder="Örn: Windows 11"
                        />

                    </div>

                </div>


                {/* =========================================
                    GÖRSELLER
                ========================================= */}

                <div className="form-group">

                    <label>
                        Ürün Görseli
                    </label>

                    <input
                        type="file"
                        name="image"
                        onChange={handleChange}
                    />

                </div>


                <div className="form-group">

                    <label>
                        Ürün Görseli 2
                    </label>

                    <input
                        type="file"
                        name="image2"
                        onChange={handleChange}
                    />

                </div>


                <div className="form-group">

                    <label>
                        Ürün Görseli 3
                    </label>

                    <input
                        type="file"
                        name="image3"
                        onChange={handleChange}
                    />

                </div>


                {/* =========================================
                    BUTONLAR
                ========================================= */}

                <div className="form-buttons">

                    <button
                        type="reset"
                        onClick={() =>
                            setFormData({

                                name: "",
                                brand_id: "",
                                category_id: "",

                                color_name: "",
                                color_code: "#FFFFFF",
                                variant_group_id: "",

                                price: "",
                                discount: "",
                                stock: "",
                                status: "active",
                                description: "",
                                description_en: "",

                                image: null,
                                image2: null,
                                image3: null,

                                processor: "",
                                ram: "",
                                storage: "",
                                display: "",
                                battery: "",
                                camera: "",
                                operating_system: ""

                            })
                        }
                    >
                        Temizle
                    </button>


                    <button type="submit">
                        Kaydet
                    </button>

                </div>


            </form>

        </div>

    );

}

export default AddProduct;