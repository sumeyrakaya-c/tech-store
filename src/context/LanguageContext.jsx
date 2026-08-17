import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

const translations = {
    tr: {

        // =========================
        // NAVBAR
        // =========================

        home: "Ana Sayfa",
        favorites: "Favoriler",
        cart: "Sepet",
        login: "Giriş Yap",
        register: "Kayıt Ol",
        logout: "Çıkış Yap",
        adminPanel: "Admin Paneli",
        search: "Ürün ara...",

        // =========================
        // KATEGORİLER
        // =========================

        categories: "Kategoriler",
        allProducts: "Tüm Ürünler",
        computer: "Bilgisayar",
        phone: "Telefon",
        tablet: "Tablet",
        monitor: "Monitör",
        keyboard: "Klavye",
        mouse: "Mouse",
        headphones: "Kulaklık",
        smartwatch: "Akıllı Saat",
        storage: "Depolama",
        gaming: "Oyuncu Ekipmanları",
        cables: "Kablo & Adaptör",
        accessories: "Aksesuarlar",

        // =========================
        // GENEL
        // =========================

        save: "Kaydet",
        cancel: "Vazgeç",
        delete: "Sil",
        edit: "Düzenle",
        loading: "Yükleniyor...",
        confirm: "Onayla",
        close: "Kapat",
        back: "Geri",

        // =========================
        // ÜRÜN
        // =========================

        product: "Ürün",
        thisProduct: "Bu ürüne",
        checkItOut: "göz at!",
        productDescription: "Ürün Açıklaması",
        comments: "Yorumlar",
        addToCart: "Sepete Ekle",
        buyNow: "Hemen Al",
        price: "Fiyat",

        productLoading: "Ürün yükleniyor...",
        productCouldNotLoad: "Ürün yüklenemedi",
        productNotFound: "Ürün bulunamadı.",
        invalidProduct: "Geçerli bir ürün verisi alınamadı.",
        productLoadError: "Ürün yüklenirken hata oluştu.",
        productIdNotFound: "Ürün ID bulunamadı.",

        // =========================
        // PURCHASE CARD
        // =========================

        freeShipping: "Ücretsiz Kargo",
        securePayment: "Güvenli Ödeme",
        easyReturn: "Kolay İade",
        shareProduct: "Ürünü paylaş",

        productAddedToCart: "Ürün sepete eklendi.",
        productCouldNotBeAdded: "Ürün sepete eklenemedi.",
        addToCartError: "Ürün sepete eklenirken bir hata oluştu.",
        quickBuyError: "Hızlı Al işlemi sırasında bir hata oluştu.",
        productLinkCopied: "Ürün bağlantısı kopyalandı!",
        productCouldNotBeShared: "Ürün bağlantısı paylaşılamadı.",

        // =========================
        // ÜRÜN AÇIKLAMASI
        // =========================

        listen: "Dinle",
        stop: "Durdur",

        // =========================
        // TEKNİK ÖZELLİKLER
        // =========================

        technicalSpecifications: "Teknik Özellikler",
        processor: "İşlemci",
        ram: "RAM",
        storageSpec: "Depolama",
        display: "Ekran",
        battery: "Pil",
        camera: "Kamera",
        operatingSystem: "İşletim Sistemi",
        noInformation: "Bilgi eklenmedi",
        specificationsCouldNotLoad: "Teknik özellikler alınamadı.",

        // =========================
        // SORULAR
        // =========================

        productQuestions: "Ürün Soruları & Cevapları",
        questionCount: "soru soruldu",
        questionCountShort: "soru",
        seeAll: "Tümü",
        askQuestion: "Soru Sor",

        questionPlaceholder:
            "Ürün hakkında merak ettiğiniz soruyu yazın...",

        submitQuestion: "Soruyu Gönder",
        questionSending: "Soru gönderiliyor...",
        questionSent: "Sorunuz gönderildi.",
        questionCouldNotBeSent: "Soru gönderilemedi.",
        questionSendError:
            "Soru gönderilirken bir hata oluştu.",

        loginToAsk:
            "Soru sormak için giriş yapmalısınız.",

        writeQuestion:
            "Lütfen sorunuzu yazınız.",

        noQuestions:
            "Bu ürün için henüz soru sorulmamış.",

        storeAnswer: "Mağaza Yanıtı",
        waitingForAnswer: "Cevap bekleniyor.",
        questionDeleted: "Soru silindi.",
        questionCouldNotBeDeleted: "Soru silinemedi.",
        questionDeleteError:
            "Soru silinirken bir hata oluştu.",

        questionDeleteConfirm:
            "Bu soruyu silmek istediğinize emin misiniz?",

        userNotFound:
            "Kullanıcı bilgisi bulunamadı.",

        questionsCouldNotLoad:
            "Sorular alınamadı.",

        questionsLoadError:
            "Sorular yüklenirken bir hata oluştu.",

        // =========================
        // SEPET
        // =========================

        shoppingCart: "Sepetim",
        emptyCart: "Sepetiniz boş.",
        total: "Toplam",

        // =========================
        // SİPARİŞ
        // =========================

        myOrders: "Siparişlerim",
        orderNumber: "Sipariş No",
        date: "Tarih",
        orderStatus: "Sipariş Durumu",

        // =========================
        // PROFİL
        // =========================

        profile: "Profil",
        deliveryAddress: "Teslimat Adresi",
        phoneNumber: "Telefon Numarası",

        // =========================
        // DİL
        // =========================

        language: "Dil",
        turkish: "Türkçe",
        english: "English"
    },


    // =====================================================
    // ENGLISH
    // =====================================================

    en: {

        // =========================
        // NAVBAR
        // =========================

        home: "Home",
        favorites: "Favorites",
        cart: "Cart",
        login: "Login",
        register: "Register",
        logout: "Logout",
        adminPanel: "Admin Panel",
        search: "Search products...",

        // =========================
        // CATEGORIES
        // =========================

        categories: "Categories",
        allProducts: "All Products",
        computer: "Computer",
        phone: "Phone",
        tablet: "Tablet",
        monitor: "Monitor",
        keyboard: "Keyboard",
        mouse: "Mouse",
        headphones: "Headphones",
        smartwatch: "Smart Watch",
        storage: "Storage",
        gaming: "Gaming Equipment",
        cables: "Cables & Adapters",
        accessories: "Accessories",

        // =========================
        // GENERAL
        // =========================

        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        edit: "Edit",
        loading: "Loading...",
        confirm: "Confirm",
        close: "Close",
        back: "Back",

        // =========================
        // PRODUCT
        // =========================

        product: "Product",
        thisProduct: "This product",
        checkItOut: "check it out!",
        productDescription: "Product Description",
        comments: "Comments",
        addToCart: "Add to Cart",
        buyNow: "Buy Now",
        price: "Price",

        productLoading: "Loading product...",
        productCouldNotLoad: "Could not load product",
        productNotFound: "Product not found.",
        invalidProduct: "Invalid product data.",
        productLoadError: "An error occurred while loading the product.",
        productIdNotFound: "Product ID not found.",

        // =========================
        // PURCHASE CARD
        // =========================

        freeShipping: "Free Shipping",
        securePayment: "Secure Payment",
        easyReturn: "Easy Returns",
        shareProduct: "Share product",

        productAddedToCart: "Product added to cart.",
        productCouldNotBeAdded: "Product could not be added to cart.",
        addToCartError:
            "An error occurred while adding the product to the cart.",
        quickBuyError:
            "An error occurred during Quick Buy.",
        productLinkCopied: "Product link copied!",
        productCouldNotBeShared:
            "Product link could not be shared.",

        // =========================
        // PRODUCT DESCRIPTION
        // =========================

        listen: "Listen",
        stop: "Stop",

        // =========================
        // SPECIFICATIONS
        // =========================

        technicalSpecifications: "Technical Specifications",
        processor: "Processor",
        ram: "RAM",
        storageSpec: "Storage",
        display: "Display",
        battery: "Battery",
        camera: "Camera",
        operatingSystem: "Operating System",
        noInformation: "No information available",
        specificationsCouldNotLoad:
            "Technical specifications could not be loaded.",

        // =========================
        // QUESTIONS
        // =========================

        productQuestions: "Product Questions & Answers",
        questionCount: "questions asked",
        questionCountShort: "questions",
        seeAll: "See All",
        askQuestion: "Ask a Question",

        questionPlaceholder:
            "Write your question about the product...",

        submitQuestion: "Submit Question",
        questionSending: "Sending question...",
        questionSent: "Your question has been submitted.",
        questionCouldNotBeSent:
            "The question could not be submitted.",
        questionSendError:
            "An error occurred while submitting the question.",

        loginToAsk:
            "You must log in to ask a question.",

        writeQuestion:
            "Please write your question.",

        noQuestions:
            "No questions have been asked about this product yet.",

        storeAnswer: "Store Answer",
        waitingForAnswer: "Waiting for an answer.",
        questionDeleted: "Question deleted.",
        questionCouldNotBeDeleted:
            "The question could not be deleted.",
        questionDeleteError:
            "An error occurred while deleting the question.",

        questionDeleteConfirm:
            "Are you sure you want to delete this question?",

        userNotFound:
            "User information could not be found.",

        questionsCouldNotLoad:
            "Questions could not be loaded.",

        questionsLoadError:
            "An error occurred while loading questions.",

        // =========================
        // CART
        // =========================

        shoppingCart: "Shopping Cart",
        emptyCart: "Your cart is empty.",
        total: "Total",

        // =========================
        // ORDERS
        // =========================

        myOrders: "My Orders",
        orderNumber: "Order No",
        date: "Date",
        orderStatus: "Order Status",

        // =========================
        // PROFILE
        // =========================

        profile: "Profile",
        deliveryAddress: "Delivery Address",
        phoneNumber: "Phone Number",

        // =========================
        // LANGUAGE
        // =========================

        language: "Language",
        turkish: "Turkish",
        english: "English"
    }

};


// =====================================================
// PROVIDER
// =====================================================

export function LanguageProvider({ children }) {

    const [language, setLanguage] = useState(
        localStorage.getItem("language") || "tr"
    );


    const changeLanguage = (newLanguage) => {

        setLanguage(newLanguage);

        localStorage.setItem(
            "language",
            newLanguage
        );

    };


    const t = (key) => {

        return (
            translations[language]?.[key] ||
            translations.tr?.[key] ||
            key
        );

    };


    return (

        <LanguageContext.Provider
            value={{
                language,
                changeLanguage,
                t
            }}
        >

            {children}

        </LanguageContext.Provider>

    );

}


// =====================================================
// HOOK
// =====================================================

export function useLanguage() {

    return useContext(LanguageContext);

}