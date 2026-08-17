const translate = require("translate").default;


// =========================================
// TÜRKÇE → İNGİLİZCE
// =========================================

const translateToEnglish = async (text) => {

    // Metin değilse olduğu gibi döndür
    if (
        typeof text !== "string" ||
        !text.trim()
    ) {
        return text;
    }


    try {

        const translatedText =
            await translate(text, {
                from: "tr",
                to: "en"
            });


        return translatedText;

    } catch (error) {

        console.log(
            "ÇEVİRİ HATASI:",
            error
        );


        // Çeviri başarısız olursa
        // orijinal metni bozma
        return text;

    }

};


// =========================================
// EXPORT
// =========================================

module.exports = {
    translateToEnglish
};