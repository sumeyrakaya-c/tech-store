const {
    translateToEnglish
} = require("../services/translationService");


// =========================================
// TÜM STRING DEĞERLERİ MERKEZİ OLARAK ÇEVİR
// =========================================

const translateData = async (data) => {

    if (data === null || data === undefined) {
        return data;
    }


    // =========================================
    // STRING
    // =========================================

    if (typeof data === "string") {

        if (!data.trim()) {
            return data;
        }

        return await translateToEnglish(data);
    }


    // =========================================
    // ARRAY
    // =========================================

    if (Array.isArray(data)) {

        return await Promise.all(
            data.map(item =>
                translateData(item)
            )
        );

    }


    // =========================================
    // OBJECT
    // =========================================

    if (typeof data === "object") {

        const result = {};

        for (const key of Object.keys(data)) {

            result[key] =
                await translateData(data[key]);

        }

        return result;

    }


    // =========================================
    // NUMBER / BOOLEAN
    // =========================================

    return data;

};


// =========================================
// EXPRESS MIDDLEWARE
// =========================================

const translationMiddleware =
    (req, res, next) => {

        const originalJson =
            res.json.bind(res);


        res.json = async (data) => {

            const language =
                req.headers["accept-language"]
                    ?.toLowerCase()
                    .startsWith("en")
                    ? "en"
                    : "tr";


            // =========================================
            // TÜRKÇE
            // =========================================

            if (language === "tr") {

                return originalJson(data);

            }


            // =========================================
            // İNGİLİZCE
            // =========================================

            try {

                const translatedData =
                    await translateData(data);


                return originalJson(
                    translatedData
                );

            } catch (error) {

                console.log(
                    "MERKEZİ ÇEVİRİ HATASI:",
                    error
                );

                return originalJson(data);

            }

        };


        next();

    };


module.exports =
    translationMiddleware;