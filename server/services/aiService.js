const { GoogleGenAI } = require("@google/genai");


// =========================================
// GEMINI CLIENT
// =========================================

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("GEMINI_API_KEY bulunamadı.");
}

const ai = new GoogleGenAI({
    apiKey: apiKey
});


// =========================================
// GEMINI MODEL
// =========================================

const MODEL = "gemini-3.5-flash-lite";


// =========================================
// TEKNOHUP MAĞAZA BİLGİLERİ
// =========================================
// BURADAKİ BİLGİLERİ KENDİ MAĞAZANA GÖRE
// DEĞİŞTİREBİLİRSİN.
//
// AI bu bilgilerin dışında kargo,
// iade, ödeme vb. bilgi UYDURMAYACAK.
// =========================================

const STORE_INFO = {

    // -----------------------------------------
    // KARGO
    // -----------------------------------------

    shipping: {
        available: true,

        description:
            "TeknoHup üzerinden verilen siparişler kargo ile gönderilir.",

        shippingTime:
            "Kargo teslimat süresi mağazanın güncel teslimat politikasına göre değişebilir.",

        shippingFee:
            "Kargo ücreti hakkında kesin bilgi sipariş aşamasında gösterilir.",

        tracking:
            "Sipariş kargoya verildiğinde kargo takip bilgisi sağlanır."
    },


    // -----------------------------------------
    // İADE
    // -----------------------------------------

    returns: {

        available: true,

        description:
            "Ürün iadeleri mağazanın iade koşullarına göre gerçekleştirilir.",

        period:
            "İade süresi mağazanın güncel iade politikasına göre belirlenir.",

        condition:
            "İade koşulları ürünün durumuna ve mağazanın iade politikasına göre değişebilir."
    },


    // -----------------------------------------
    // ÖDEME
    // -----------------------------------------

    payment: {

        methods:
            "Ödeme yöntemleri ödeme aşamasında kullanıcıya gösterilir.",

        security:
            "Ödeme işlemleri güvenli ödeme altyapısı üzerinden gerçekleştirilir."
    },


    // -----------------------------------------
    // SİPARİŞ
    // -----------------------------------------

    orders: {

        description:
            "Kullanıcılar ürünleri sepete ekleyerek sipariş oluşturabilir.",

        tracking:
            "Sipariş durumu kullanıcı hesabındaki siparişler bölümünden takip edilebilir."
    },


    // -----------------------------------------
    // HESAP
    // -----------------------------------------

    account: {

        register:
            "Kullanıcılar kayıt olarak TeknoHup hesabı oluşturabilir.",

        login:
            "Kayıtlı kullanıcılar hesaplarına giriş yapabilir.",

        password:
            "Şifre unutulması durumunda şifre yenileme özelliği kullanılabilir."
    },


    // -----------------------------------------
    // SEPET
    // -----------------------------------------

    cart: {

        description:
            "Kullanıcılar ürünleri sepete ekleyebilir, miktarlarını değiştirebilir ve sipariş oluşturabilir."
    },


    // -----------------------------------------
    // FAVORİLER
    // -----------------------------------------

    favorites: {

        description:
            "Kullanıcılar beğendikleri ürünleri favorilerine ekleyebilir."
    },


    // -----------------------------------------
    // GENEL
    // -----------------------------------------

    general: {

        storeName:
            "TeknoHup",

        category:
            "Teknoloji ürünleri",

        support:
            "AI mağaza asistanı ürünler ve mağaza kullanımı hakkında yardımcı olur."
    }

};


// =========================================
// AI ASİSTAN
// =========================================

const askAI = async (message, products = []) => {

    if (!message || !message.trim()) {

        return "Size nasıl yardımcı olabilirim?";

    }


    // =========================================
    // ÜRÜN VERİLERİ
    // =========================================

    const productData = products.map((product) => ({

        id: product.id,

        name: product.name,

        brand: product.brand_name,

        category: product.category_name,

        color: product.color_name,

        price: product.price,

        discount: product.discount,

        stock: product.stock,

        description: product.description

    }));


    // =========================================
    // PROMPT
    // =========================================

    const prompt = `

Sen TeknoHup teknoloji mağazasının
AI alışveriş ve mağaza asistanısın.

Görevin kullanıcıya mağaza, ürünler,
sipariş, kargo, iade, ödeme, sepet,
favoriler ve hesap işlemleri hakkında
yardımcı olmaktır.


=========================================
ÇOK ÖNEMLİ KURALLAR
=========================================

1. SADECE verilen mağaza ürünlerini kullan.

2. Listede olmayan bir ürünü TeknoHup'ta
varmış gibi gösterme.

3. Ürün önerirken ürünün:
   - adını
   - fiyatını
   belirt.

4. Stok değeri 0 ise ürünün stokta
olmadığını belirt.

5. Fiyat UYDURMA.

6. Teknik özellik UYDURMA.

7. Kullanıcı bir ürün hakkında bilgi
istediğinde verilen ürün bilgilerinden
yararlan.

8. Kullanıcı bütçe belirtirse ürünleri
bütçesine göre değerlendir.

9. Kullanıcı telefon isterse öncelikle
telefon kategorisindeki ürünleri değerlendir.

10. Kullanıcı karşılaştırma isterse
verilen ürün bilgilerine göre karşılaştır.

11. Kullanıcı Türkçe konuşuyorsa Türkçe
cevap ver.

12. Kullanıcı İngilizce konuşuyorsa
İngilizce cevap ver.

13. Cevapları doğal, anlaşılır ve mümkün
olduğunca kısa tut.

14. Kullanıcının sorusu mağaza bilgileriyle
ilgiliyse STORE INFO bölümünü kullan.

15. STORE INFO bölümünde bulunmayan
kesin bir bilgi varsa bilgi UYDURMA.

16. Bilgi mevcut değilse açıkça:
"Bu konuda mağazamızın güncel bilgisine
sahip değilim." şeklinde belirt.

17. Kullanıcı genel sohbet yaparsa doğal
bir şekilde cevap ver.

18. Kullanıcı ürün önerisi isterse mümkünse
doğrudan ürün öner.

19. Kullanıcı kargo hakkında sorarsa
kargo bölümünü kullan.

20. Kullanıcı iade hakkında sorarsa
iade bölümünü kullan.

21. Kullanıcı ödeme hakkında sorarsa
ödeme bölümünü kullan.

22. Kullanıcı sipariş hakkında sorarsa
sipariş bölümünü kullan.

23. Kullanıcı hesap hakkında sorarsa
hesap bölümünü kullan.

24. Kullanıcı sepet hakkında sorarsa
sepet bölümünü kullan.

25. Kullanıcı favoriler hakkında sorarsa
favoriler bölümünü kullan.


=========================================
MAĞAZA BİLGİLERİ
=========================================

${JSON.stringify(STORE_INFO, null, 2)}


=========================================
MAĞAZADAKİ AKTİF ÜRÜNLER
=========================================

${JSON.stringify(productData, null, 2)}


=========================================
KULLANICI MESAJI
=========================================

${message}


=========================================
CEVAP
=========================================

Kullanıcıya doğrudan cevap ver.
Gereksiz açıklama yapma.
`;


    // =========================================
    // GEMINI
    // =========================================

    try {

        console.log(
            `🤖 Gemini modeli kullanılıyor: ${MODEL}`
        );


        const response =
            await ai.models.generateContent({

                model: MODEL,

                contents: prompt

            });


        const answer =
            response.text;


        if (
            answer &&
            answer.trim()
        ) {

            console.log(
                "✅ Gemini cevap verdi."
            );


            return answer;

        }


        return "Şu anda cevap oluşturamadım.";


    } catch (error) {

        console.error(
            "❌ GEMINI AI HATASI:",
            error
        );

        throw error;

    }

};


module.exports = {
    askAI
};