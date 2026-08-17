import { useState } from "react";
import "../styles/AIChat.css";

function AIChat() {

    const [isOpen, setIsOpen] = useState(false);

    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState([]);

    const [loading, setLoading] = useState(false);


    // =========================================
    // MESAJ GÖNDER
    // =========================================

    const sendMessage = async () => {

        if (!message.trim() || loading) {
            return;
        }


        const userMessage = message.trim();


        // Kullanıcı mesajını ekrana ekle

        setMessages((prev) => [

            ...prev,

            {
                role: "user",
                text: userMessage
            }

        ]);


        setMessage("");

        setLoading(true);


        try {

            console.log(
                "AI'ya gönderiliyor:",
                userMessage
            );


            // =========================================
            // API İSTEĞİ
            // =========================================

            const response = await fetch(
                "http://localhost:5000/api/ai/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },

                    body: JSON.stringify({
                        message: userMessage
                    })
                }
            );


            // =========================================
            // CEVABI ÖNCE TEXT OLARAK AL
            // =========================================

            const responseText =
                await response.text();


            console.log(
                "AI API HAM CEVAP:",
                responseText
            );


            // =========================================
            // JSON'A ÇEVİR
            // =========================================

            let data;


            try {

                data =
                    JSON.parse(responseText);

            } catch (jsonError) {

                console.error(
                    "AI JSON PARSE HATASI:",
                    jsonError
                );

                console.error(
                    "Sunucudan gelen cevap:",
                    responseText
                );

                throw new Error(
                    "Sunucudan geçerli JSON cevabı alınamadı."
                );

            }


            // =========================================
            // HTTP HATASI
            // =========================================

            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    data?.error ||
                    "AI yanıt veremedi."
                );

            }


            // =========================================
            // AI CEVABINI AL
            // =========================================

            const aiAnswer =
                data?.answer ||
                data?.response ||
                data?.message;


            if (!aiAnswer) {

                console.error(
                    "AI cevabı bulunamadı:",
                    data
                );

                throw new Error(
                    "AI cevabı boş geldi."
                );

            }


            console.log(
                "AI CEVABI:",
                aiAnswer
            );


            // =========================================
            // AI MESAJINI EKLE
            // =========================================

            setMessages((prev) => [

                ...prev,

                {
                    role: "ai",
                    text: aiAnswer
                }

            ]);

        }


        // =========================================
        // HATA
        // =========================================

        catch (error) {

            console.error(
                "AI CHAT HATASI:",
                error
            );


            setMessages((prev) => [

                ...prev,

                {
                    role: "ai",
                    text:
                        "Şu anda yanıt veremiyorum. Lütfen tekrar deneyin."
                }

            ]);

        }


        // =========================================
        // LOADING BİTİR
        // =========================================

        finally {

            setLoading(false);

        }

    };


    // =========================================
    // ENTER İLE GÖNDER
    // =========================================

    const handleKeyDown = (e) => {

        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {

            e.preventDefault();

            sendMessage();

        }

    };


    // =========================================
    // ÖNERİ BUTONUNA BASINCA
    // =========================================

    const selectSuggestion = (text) => {

        setMessage(text);

    };


    return (

        <>

            {/* =================================
                AI ASİSTAN BUTONU
            ================================= */}

            {!isOpen && (

                <button
                    className="ai-assistant-button"
                    onClick={() =>
                        setIsOpen(true)
                    }
                    aria-label="AI Asistan"
                >

                    <div className="ai-icon">
                        ✨
                    </div>


                    <div className="ai-button-text">

                        <strong>
                            AI Asistan
                        </strong>

                        <span>
                            Size nasıl yardımcı olabilirim?
                        </span>

                    </div>

                </button>

            )}


            {/* =================================
                CHAT PENCERESİ
            ================================= */}

            {isOpen && (

                <div className="ai-chat-window">


                    {/* =================================
                        HEADER
                    ================================= */}

                    <div className="ai-chat-header">

                        <div className="ai-header-info">

                            <div className="ai-avatar">
                                ✨
                            </div>


                            <div>

                                <strong>
                                    TeknoHup AI
                                </strong>

                                <span>
                                    Mağaza Asistanı
                                </span>

                            </div>

                        </div>


                        <button
                            className="ai-close-button"
                            onClick={() =>
                                setIsOpen(false)
                            }
                            aria-label="Kapat"
                        >
                            ×
                        </button>

                    </div>


                    {/* =================================
                        MESAJLAR
                    ================================= */}

                    <div className="ai-chat-messages">


                        {/* HOŞ GELDİN MESAJI */}

                        {messages.length === 0 && (

                            <div className="ai-welcome">

                                <div className="ai-welcome-icon">
                                    ✨
                                </div>


                                <h3>
                                    Merhaba!
                                </h3>


                                <p>
                                    Ürünlerimiz hakkında
                                    sana yardımcı olabilirim.
                                </p>


                                <div className="ai-suggestions">


                                    <button
                                        onClick={() =>
                                            selectSuggestion(
                                                "Bana mağazadaki telefonlardan birini öner"
                                            )
                                        }
                                    >
                                        📱 Telefon öner
                                    </button>


                                    <button
                                        onClick={() =>
                                            selectSuggestion(
                                                "Bana uygun fiyatlı bir ürün öner"
                                            )
                                        }
                                    >
                                        💰 Uygun fiyatlı ürün
                                    </button>


                                    <button
                                        onClick={() =>
                                            selectSuggestion(
                                                "Mağazadaki en iyi ürünü öner"
                                            )
                                        }
                                    >
                                        ⭐ En iyi ürün
                                    </button>


                                </div>

                            </div>

                        )}


                        {/* =================================
                            MESAJLAR
                        ================================= */}

                        {messages.map(
                            (item, index) => (

                                <div
                                    key={index}
                                    className={
                                        item.role === "user"
                                            ? "ai-message user-message"
                                            : "ai-message bot-message"
                                    }
                                >
                                    {item.text}
                                </div>

                            )
                        )}


                        {/* =================================
                            AI YAZIYOR
                        ================================= */}

                        {loading && (

                            <div
                                className="
                                    ai-message
                                    bot-message
                                    ai-loading
                                "
                            >

                                <span></span>
                                <span></span>
                                <span></span>

                            </div>

                        )}

                    </div>


                    {/* =================================
                        INPUT
                    ================================= */}

                    <div className="ai-chat-input-area">

                        <textarea
                            value={message}
                            onChange={(e) =>
                                setMessage(
                                    e.target.value
                                )
                            }
                            onKeyDown={handleKeyDown}
                            placeholder="Ürün hakkında bir şey sor..."
                            rows="1"
                            disabled={loading}
                        />


                        <button
                            className="ai-send-button"
                            onClick={sendMessage}
                            disabled={
                                loading ||
                                !message.trim()
                            }
                            aria-label="Gönder"
                        >
                            ➤
                        </button>

                    </div>

                </div>

            )}

        </>

    );

}


export default AIChat;