import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FiTrash2,
    FiArrowLeft,
    FiShoppingCart
} from "react-icons/fi";

import "../styles/Compare.css";


function Compare() {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    const [loadingSpecs, setLoadingSpecs] = useState(false);


    // =========================================
    // KARŞILAŞTIRMA LİSTESİNİ GETİR
    // =========================================

    const loadCompareProducts = () => {

        try {

            const saved =
                JSON.parse(
                    localStorage.getItem("compareProducts")
                ) || [];

            setProducts(saved);

        } catch (error) {

            console.error(
                "Karşılaştırma ürünleri okunamadı:",
                error
            );

            setProducts([]);

        }

    };


    useEffect(() => {

        loadCompareProducts();

    }, []);


    // =========================================
    // TEKNİK ÖZELLİKLERİ API'DAN AL
    // =========================================

    useEffect(() => {

        const loadSpecs = async () => {

            if (!products.length) {
                return;
            }

            setLoadingSpecs(true);

            try {

                const updatedProducts =
                    await Promise.all(

                        products.map(
                            async (product) => {

                                // Eğer zaten specs varsa tekrar
                                // API çağrısı yapma
                                if (
                                    product.specs &&
                                    typeof product.specs === "object" &&
                                    !Array.isArray(product.specs)
                                ) {

                                    return product;

                                }


                                try {

                                    let response =
                                        await fetch(
                                            `http://localhost:5000/api/product-specs/product/${product.id}`
                                        );


                                    // İlk endpoint yoksa alternatif endpoint
                                    if (!response.ok) {

                                        response =
                                            await fetch(
                                                `http://localhost:5000/api/product-specs/${product.id}`
                                            );

                                    }


                                    if (!response.ok) {

                                        return {
                                            ...product,
                                            specs: {}
                                        };

                                    }


                                    const data =
                                        await response.json();


                                    let specs = data;


                                    // API { specs: {...} } döndürüyorsa
                                    if (
                                        data &&
                                        data.specs
                                    ) {

                                        specs =
                                            data.specs;

                                    }


                                    // API array döndürüyorsa
                                    // key/value yapısına çevir
                                    if (
                                        Array.isArray(specs)
                                    ) {

                                        const specObject = {};

                                        specs.forEach(
                                            (item) => {

                                                const key =
                                                    item.name ||
                                                    item.spec_name ||
                                                    item.key;

                                                const value =
                                                    item.value ||
                                                    item.spec_value;

                                                if (
                                                    key &&
                                                    value !== undefined &&
                                                    value !== null
                                                ) {

                                                    specObject[key] =
                                                        value;

                                                }

                                            }
                                        );

                                        specs =
                                            specObject;

                                    }


                                    return {
                                        ...product,
                                        specs:
                                            specs &&
                                            typeof specs === "object"
                                                ? specs
                                                : {}
                                    };

                                } catch (error) {

                                    console.log(
                                        `Ürün ${product.id} teknik özellikleri alınamadı:`,
                                        error
                                    );

                                    return {
                                        ...product,
                                        specs: {}
                                    };

                                }

                            }
                        )

                    );


                setProducts(updatedProducts);

            } catch (error) {

                console.error(
                    "Teknik özellikler alınamadı:",
                    error
                );

            } finally {

                setLoadingSpecs(false);

            }

        };


        loadSpecs();

    }, [products.length]);


    // =========================================
    // ÜRÜN SİL
    // =========================================

    const removeProduct = (id) => {

        const updated =
            products.filter(
                (product) =>
                    Number(product.id) !== Number(id)
            );


        setProducts(updated);


        localStorage.setItem(
            "compareProducts",
            JSON.stringify(updated)
        );

    };


    // =========================================
    // TÜMÜNÜ TEMİZLE
    // =========================================

    const clearAll = () => {

        setProducts([]);

        localStorage.removeItem(
            "compareProducts"
        );

    };


    // =========================================
    // RESİM BUL
    // =========================================

    const getProductImage = (product) => {

        const image =
            product.image ||
            product.image_url ||
            product.imageUrl ||
            product.main_image ||
            product.mainImage ||
            product.photo ||
            product.product_image;


        if (!image) {

            return null;

        }


        if (
            typeof image === "string" &&
            (
                image.startsWith("http://") ||
                image.startsWith("https://")
            )
        ) {

            return image;

        }


        if (
            typeof image === "string" &&
            image.startsWith("/")
        ) {

            return `http://localhost:5000${image}`;

        }


        return `http://localhost:5000/uploads/${image}`;

    };


    // =========================================
    // DEĞER GÖSTER
    // =========================================

    const displayValue = (value) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            return "—";

        }


        if (typeof value === "boolean") {

            return value
                ? "Evet"
                : "Hayır";

        }


        return String(value);

    };


    // =========================================
    // SADECE GERÇEK TEKNİK ÖZELLİKLER
    // =========================================

    const getSpecs = (product) => {

        if (
            !product.specs ||
            typeof product.specs !== "object" ||
            Array.isArray(product.specs)
        ) {

            return {};

        }


        const excludedFields = [

            // Ürün temel bilgileri
            "id",
            "product_id",
            "name",
            "price",
            "discount",
            "stock",
            "description",

            // Resimler
            "image",
            "image_url",
            "imageUrl",
            "main_image",
            "mainImage",
            "photo",
            "product_image",
            "image2",
            "image3",
            "image_2",
            "image_3",

            // Kategori / marka
            "brand",
            "brand_id",
            "brand_name",
            "category",
            "category_id",
            "category_name",

            // Renk
            "color",
            "color_id",
            "color_name",
            "color_code",

            // Varyant
            "variant_group_id",
            "variantGroupId",

            // Sistem alanları
            "status",
            "created_at",
            "updated_at"

        ];


        const specs = {};


        Object.entries(product.specs).forEach(
            ([key, value]) => {

                const lowerKey =
                    key.toLowerCase();


                if (
                    excludedFields.includes(
                        lowerKey
                    )
                ) {

                    return;

                }


                if (
                    value === null ||
                    value === undefined ||
                    value === ""
                ) {

                    return;

                }


                if (
                    typeof value === "object"
                ) {

                    return;

                }


                specs[key] = value;

            }
        );


        return specs;

    };


    // =========================================
    // TÜM TEKNİK ÖZELLİK İSİMLERİNİ BUL
    // =========================================

    const allSpecNames = [];


    products.forEach(
        (product) => {

            const specs =
                getSpecs(product);


            Object.keys(specs).forEach(
                (name) => {

                    if (
                        !allSpecNames.includes(name)
                    ) {

                        allSpecNames.push(name);

                    }

                }
            );

        }
    );


    // =========================================
    // TEKNİK ÖZELLİK DEĞERİ
    // =========================================

    const getSpecValue = (
        product,
        specName
    ) => {

        const specs =
            getSpecs(product);


        if (
            specs[specName] !== undefined
        ) {

            return specs[specName];

        }


        return "—";

    };


    // =========================================
    // TEKNİK ÖZELLİK İSMİNİ GÜZELLEŞTİR
    // =========================================

    const formatSpecName = (name) => {

        const names = {

            ram: "RAM",

            ram_size: "RAM",

            storage: "Depolama",

            storage_size: "Depolama",

            storage_capacity: "Depolama Kapasitesi",

            screen_size: "Ekran Boyutu",

            display_size: "Ekran Boyutu",

            display_type: "Ekran Tipi",

            resolution: "Çözünürlük",

            refresh_rate: "Yenileme Hızı",

            processor: "İşlemci",

            cpu: "İşlemci",

            processor_model: "İşlemci Modeli",

            gpu: "Ekran Kartı",

            graphics_card: "Ekran Kartı",

            camera: "Kamera",

            front_camera: "Ön Kamera",

            rear_camera: "Arka Kamera",

            battery: "Batarya",

            battery_capacity: "Batarya Kapasitesi",

            operating_system: "İşletim Sistemi",

            os: "İşletim Sistemi",

            weight: "Ağırlık",

            warranty: "Garanti",

            connectivity: "Bağlantı",

            connection: "Bağlantı",

            usb: "USB",

            bluetooth: "Bluetooth",

            wifi: "Wi-Fi",

            nfc: "NFC",

            color: "Renk",

            brand: "Marka",

            category: "Kategori"

        };


        const lowerName =
            name.toLowerCase();


        if (
            names[lowerName]
        ) {

            return names[lowerName];

        }


        return name
            .replaceAll("_", " ")
            .replace(
                /\w\S*/g,
                (word) =>
                    word.charAt(0).toUpperCase() +
                    word.slice(1)
            );

    };


    // =========================================
    // BOŞ LİSTE
    // =========================================

    if (products.length === 0) {

        return (

            <div className="compare-empty">

                <div className="compare-empty-icon">
                    ⚖️
                </div>


                <h2>
                    Karşılaştırma listen boş
                </h2>


                <p>
                    Ürün detay sayfasından
                    karşılaştırmak istediğin ürünleri
                    ekleyebilirsin.
                </p>


                <button
                    onClick={() => navigate("/")}
                >

                    <FiArrowLeft />

                    Ürünlere Git

                </button>

            </div>

        );

    }


    // =========================================
    // SAYFA
    // =========================================

    return (

        <div className="compare-page">


            {/* =================================
                BAŞLIK
            ================================= */}

            <div className="compare-top">

                <div>

                    <button
                        className="compare-back"
                        onClick={() => navigate(-1)}
                    >

                        <FiArrowLeft />

                        Geri

                    </button>


                    <h1>
                        Ürün Karşılaştırma
                    </h1>


                    <p>
                        {products.length} ürün
                        karşılaştırılıyor
                    </p>

                </div>


                <button
                    className="clear-all-button"
                    onClick={clearAll}
                >

                    <FiTrash2 />

                    Tümünü Temizle

                </button>

            </div>


            {/* =================================
                KARŞILAŞTIRMA TABLOSU
            ================================= */}

            <div className="compare-wrapper">

                <table className="compare-table">


                    {/* =================================
                        ÜRÜN BAŞLIKLARI
                    ================================= */}

                    <thead>

                        <tr>

                            <th className="feature-column">

                                Özellik

                            </th>


                            {products.map(
                                (product) => {

                                    const image =
                                        getProductImage(
                                            product
                                        );


                                    return (

                                        <th
                                            key={
                                                product.id
                                            }
                                            className="product-column"
                                        >

                                            <div className="compare-product-card">


                                                {/* SİL */}

                                                <button
                                                    className="remove-product"
                                                    onClick={() =>
                                                        removeProduct(
                                                            product.id
                                                        )
                                                    }
                                                    title="Karşılaştırmadan çıkar"
                                                >

                                                    <FiTrash2 />

                                                </button>


                                                {/* FOTOĞRAF */}

                                                <div className="compare-image-wrapper">

                                                    {image ? (

                                                        <img
                                                            src={image}
                                                            alt={
                                                                product.name
                                                            }
                                                            className="compare-product-image"
                                                            onError={(
                                                                e
                                                            ) => {

                                                                e.currentTarget.style.display =
                                                                    "none";

                                                                if (
                                                                    e.currentTarget
                                                                        .nextElementSibling
                                                                ) {

                                                                    e.currentTarget
                                                                        .nextElementSibling
                                                                        .style.display =
                                                                        "flex";

                                                                }

                                                            }}
                                                        />

                                                    ) : null}


                                                    <div
                                                        className="compare-no-image"
                                                        style={{
                                                            display:
                                                                image
                                                                    ? "none"
                                                                    : "flex"
                                                        }}
                                                    >

                                                        📱

                                                    </div>

                                                </div>


                                                {/* MARKA */}

                                                <span className="compare-brand">

                                                    {displayValue(
                                                        product.brand_name ||
                                                        product.brand
                                                    )}

                                                </span>


                                                {/* ÜRÜN ADI */}

                                                <h3>

                                                    {displayValue(
                                                        product.name
                                                    )}

                                                </h3>

                                            </div>

                                        </th>

                                    );

                                }
                            )}

                        </tr>

                    </thead>


                    {/* =================================
                        TABLO
                    ================================= */}

                    <tbody>


                        {/* FİYAT */}

                        <tr>

                            <th>
                                💰 Fiyat
                            </th>


                            {products.map(
                                (product) => (

                                    <td
                                        key={
                                            product.id
                                        }
                                        className="price-cell"
                                    >

                                        {Number(
                                            product.price || 0
                                        ).toLocaleString(
                                            "tr-TR",
                                            {
                                                minimumFractionDigits: 2
                                            }
                                        )}

                                        ₺

                                    </td>

                                )
                            )}

                        </tr>


                        {/* MARKA */}

                        <tr>

                            <th>
                                🏷️ Marka
                            </th>


                            {products.map(
                                (product) => (

                                    <td
                                        key={
                                            product.id
                                        }
                                    >

                                        {displayValue(
                                            product.brand_name ||
                                            product.brand
                                        )}

                                    </td>

                                )
                            )}

                        </tr>


                        {/* KATEGORİ */}

                        <tr>

                            <th>
                                📂 Kategori
                            </th>


                            {products.map(
                                (product) => (

                                    <td
                                        key={
                                            product.id
                                        }
                                    >

                                        {displayValue(
                                            product.category_name ||
                                            product.category
                                        )}

                                    </td>

                                )
                            )}

                        </tr>


                        {/* RENK */}

                        <tr>

                            <th>
                                🎨 Renk
                            </th>


                            {products.map(
                                (product) => (

                                    <td
                                        key={
                                            product.id
                                        }
                                    >

                                        <span className="color-value">

                                            {displayValue(
                                                product.color_name ||
                                                product.color
                                            )}

                                        </span>

                                    </td>

                                )
                            )}

                        </tr>


                        {/* STOK */}

                        <tr>

                            <th>
                                📦 Stok
                            </th>


                            {products.map(
                                (product) => (

                                    <td
                                        key={
                                            product.id
                                        }
                                        className={
                                            Number(
                                                product.stock
                                            ) > 0
                                                ? "stock-available"
                                                : "stock-empty"
                                        }
                                    >

                                        {Number(
                                            product.stock || 0
                                        ) > 0

                                            ? `${product.stock} adet`

                                            : "Stokta yok"}

                                    </td>

                                )
                            )}

                        </tr>


                        {/* =================================
                            TEKNİK ÖZELLİKLER
                        ================================= */}

                        {loadingSpecs &&
                        allSpecNames.length === 0 ? (

                            <tr>

                                <th>
                                    🔧 Teknik Özellikler
                                </th>


                                {products.map(
                                    (product) => (

                                        <td
                                            key={
                                                product.id
                                            }
                                            className="missing-spec"
                                        >

                                            Yükleniyor...

                                        </td>

                                    )
                                )}

                            </tr>

                        ) : (

                            allSpecNames.map(
                                (specName) => (

                                    <tr
                                        key={
                                            specName
                                        }
                                    >

                                        <th>

                                            🔧{" "}

                                            {formatSpecName(
                                                specName
                                            )}

                                        </th>


                                        {products.map(
                                            (product) => {

                                                const value =
                                                    getSpecValue(
                                                        product,
                                                        specName
                                                    );


                                                return (

                                                    <td
                                                        key={
                                                            product.id
                                                        }
                                                        className={
                                                            value !== "—"
                                                                ? "spec-value"
                                                                : "missing-spec"
                                                        }
                                                    >

                                                        {displayValue(
                                                            value
                                                        )}

                                                    </td>

                                                );

                                            }
                                        )}

                                    </tr>

                                )
                            )

                        )}


                        {/* AÇIKLAMA */}

                        <tr>

                            <th>
                                📝 Açıklama
                            </th>


                            {products.map(
                                (product) => (

                                    <td
                                        key={
                                            product.id
                                        }
                                        className="description-cell"
                                    >

                                        {displayValue(
                                            product.description
                                        )}

                                    </td>

                                )
                            )}

                        </tr>


                        {/* =================================
                            İŞLEM
                        ================================= */}

                        <tr className="last-row">

                            <th>
                                İşlem
                            </th>


                            {products.map(
                                (product) => (

                                    <td
                                        key={
                                            product.id
                                        }
                                    >

                                        <button
                                            className="compare-buy-button"
                                            onClick={() =>
                                                navigate(
                                                    `/product/${product.id}`
                                                )
                                            }
                                        >

                                            <FiShoppingCart />

                                            Ürünü İncele

                                        </button>

                                    </td>

                                )
                            )}

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>

    );

}


export default Compare;