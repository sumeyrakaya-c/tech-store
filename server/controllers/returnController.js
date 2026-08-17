const db = require("../config/db");
const sendMail = require("../emailService");


// =========================================
// İADE TALEBİ OLUŞTUR
// =========================================

const createReturn = (req, res) => {

    const {
        order_id,
        user_id,
        order_item_id,
        reason,
        description
    } = req.body;


    if (!order_id || !user_id || !reason) {

        return res.status(400).json({
            message: "Sipariş, kullanıcı ve iade nedeni zorunludur."
        });

    }


    // =========================================
    // BU SİPARİŞ KULLANICIYA AİT Mİ?
    // =========================================

    const orderCheckSql = `
        SELECT id
        FROM orders
        WHERE id = ?
        AND user_id = ?
        LIMIT 1
    `;


    db.query(
        orderCheckSql,
        [order_id, user_id],
        (orderCheckErr, orderCheckResult) => {

            if (orderCheckErr) {

                console.log(
                    "SİPARİŞ KONTROL HATASI:",
                    orderCheckErr
                );

                return res.status(500).json({
                    message: "Sipariş kontrolü yapılamadı.",
                    error: orderCheckErr.message
                });

            }


            if (orderCheckResult.length === 0) {

                return res.status(403).json({
                    message: "Bu sipariş size ait değil."
                });

            }


            // =========================================
            // DAHA ÖNCE İADE VAR MI?
            // =========================================

            const checkSql = `
                SELECT id, status
                FROM returns
                WHERE order_id = ?
                AND user_id = ?
                LIMIT 1
            `;


            db.query(
                checkSql,
                [order_id, user_id],
                (checkErr, checkResult) => {

                    if (checkErr) {

                        console.log(
                            "İADE KONTROL HATASI:",
                            checkErr
                        );

                        return res.status(500).json({
                            message: "İade kontrolü yapılamadı.",
                            error: checkErr.message
                        });

                    }


                    if (checkResult.length > 0) {

                        return res.status(400).json({
                            message:
                                "Bu sipariş için zaten bir iade talebi bulunmaktadır.",
                            status: checkResult[0].status
                        });

                    }


                    // =========================================
                    // İADE OLUŞTUR
                    // =========================================

                    const sql = `
                        INSERT INTO returns
                        (
                            order_id,
                            user_id,
                            order_item_id,
                            reason,
                            description,
                            status
                        )
                        VALUES (?, ?, ?, ?, ?, 'Bekliyor')
                    `;


                    db.query(
                        sql,
                        [
                            order_id,
                            user_id,
                            order_item_id || null,
                            reason,
                            description || ""
                        ],
                        (err, result) => {

                            if (err) {

                                console.log(
                                    "İADE OLUŞTURMA SQL HATASI:",
                                    err
                                );

                                return res.status(500).json({
                                    message: "İade talebi oluşturulamadı.",
                                    error: err.message
                                });

                            }


                            res.status(201).json({

                                message:
                                    "İade talebiniz başarıyla oluşturuldu.",

                                id: result.insertId,

                                status: "Bekliyor"

                            });

                        }
                    );

                }
            );

        }
    );

};



// =========================================
// KULLANICININ İADELERİNİ GETİR
// =========================================

const getUserReturns = (req, res) => {

    const { userId } = req.params;


    const sql = `
        SELECT
            returns.*,

            orders.total_price,
            orders.created_at AS order_date

        FROM returns

        LEFT JOIN orders
            ON returns.order_id = orders.id

        WHERE returns.user_id = ?

        ORDER BY returns.created_at DESC
    `;


    db.query(
        sql,
        [userId],
        (err, results) => {

            if (err) {

                console.log(
                    "KULLANICI İADELERİ SQL HATASI:",
                    err
                );

                return res.status(500).json({
                    message: "İade talepleri getirilemedi.",
                    error: err.message
                });

            }


            res.json(results);

        }
    );

};



// =========================================
// TÜM İADELERİ GETİR
// ADMIN
// =========================================

const getReturns = (req, res) => {

    const sql = `
        SELECT
            returns.*,

            orders.total_price,
            orders.created_at AS order_date,

            users.full_name AS user_name,
            users.email AS user_email

        FROM returns

        LEFT JOIN orders
            ON returns.order_id = orders.id

        LEFT JOIN users
            ON returns.user_id = users.id

        ORDER BY returns.created_at DESC
    `;


    db.query(
        sql,
        (err, results) => {

            if (err) {

                console.log(
                    "İADELERİ GETİRME SQL HATASI:",
                    err
                );

                return res.status(500).json({
                    message: "İade talepleri getirilemedi.",
                    error: err.message
                });

            }


            res.json(results);

        }
    );

};



// =========================================
// İADE DURUMUNU GÜNCELLE
// ADMIN
// =========================================

// =========================================
// İADE DURUMUNU GÜNCELLE
// ADMIN
// =========================================

const updateReturnStatus = (req, res) => {

    const { id } = req.params;

    const {
        status,
        admin_note
    } = req.body;


const allowedStatuses = [
    "Bekliyor",
    "Onaylandı",
    "Ürün Bekleniyor",
    "Ürün Kontrol Ediliyor",
    "Para İadesi Yapıldı",
    "Reddedildi",
    "Tamamlandı"
];


    if (!allowedStatuses.includes(status)) {

        return res.status(400).json({
            message: "Geçersiz iade durumu."
        });

    }


    // =========================================
    // İADE BİLGİLERİNİ VE KULLANICI MAILİNİ GETİR
    // =========================================

    const getReturnSql = `
        SELECT
            returns.id,
            returns.order_id,
            returns.reason,
            returns.status AS old_status,

            users.email AS user_email,
            users.full_name AS user_name

        FROM returns

        LEFT JOIN users
            ON returns.user_id = users.id

        WHERE returns.id = ?

        LIMIT 1
    `;


    db.query(
        getReturnSql,
        [id],
        async (getErr, returnResult) => {

            if (getErr) {

                console.log(
                    "İADE BİLGİLERİ GETİRME HATASI:",
                    getErr
                );

                return res.status(500).json({
                    message: "İade bilgileri alınamadı.",
                    error: getErr.message
                });

            }


            if (returnResult.length === 0) {

                return res.status(404).json({
                    message: "İade talebi bulunamadı."
                });

            }


            const returnData =
                returnResult[0];


            // =========================================
            // İADE DURUMUNU GÜNCELLE
            // =========================================

            const updateSql = `
    UPDATE returns
    SET
        status = ?,
        admin_note = ?
    WHERE id = ?
`;


            db.query(
                updateSql,
                [
                    status,
                    admin_note || null,
                    id
                
                ],
                async (err, result) => {

                    if (err) {

                        console.log(
                            "İADE DURUMU GÜNCELLEME HATASI:",
                            err
                        );

                        return res.status(500).json({
                            message: "İade durumu güncellenemedi.",
                            error: err.message
                        });

                    }


                    if (result.affectedRows === 0) {

                        return res.status(404).json({
                            message: "İade talebi bulunamadı."
                        });

                    }


                    // =========================================
                    // MAIL İÇERİĞİ
                    // =========================================

                    let subject = "";
                    let title = "";
                    let message = "";
                    let color = "#2563eb";


                    if (status === "Onaylandı") {

                        subject =
                            "TeknoHup - İade Talebiniz Onaylandı";

                        title =
                            "İade Talebiniz Onaylandı";

                        message =
                            "İade talebiniz incelenmiş ve onaylanmıştır. İade işleminiz başlatılmıştır.";

                        color = "#16a34a";

                    }


                    else if (status === "Reddedildi") {

                        subject =
                            "TeknoHup - İade Talebiniz Reddedildi";

                        title =
                            "İade Talebiniz Reddedildi";

                        message =
                            "İade talebiniz yapılan değerlendirme sonucunda reddedilmiştir.";

                        color = "#dc2626";

                    }


                    else if (status === "Tamamlandı") {

                        subject =
                            "TeknoHup - İade İşleminiz Tamamlandı";

                        title =
                            "İade İşleminiz Tamamlandı";

                        message =
                            "İade işleminiz başarıyla tamamlanmıştır. İade tutarınız ödeme yönteminize göre hesabınıza aktarılacaktır.";

                        color = "#16a34a";

                    }


                    else if (status === "Bekliyor") {

                        subject =
                            "TeknoHup - İade Talebiniz Alındı";

                        title =
                            "İade Talebiniz Alındı";

                        message =
                            "İade talebiniz başarıyla alınmıştır. Talebiniz incelenerek en kısa sürede sonuçlandırılacaktır.";

                        color = "#d97706";

                    }


                    // =========================================
                    // MAIL GÖNDER
                    // =========================================

                    if (returnData.user_email) {

                        const html = `

                            <div
                                style="
                                    font-family: Arial, sans-serif;
                                    max-width: 600px;
                                    margin: auto;
                                    padding: 30px;
                                    background: #f8fafc;
                                "
                            >

                                <div
                                    style="
                                        background: #172554;
                                        color: white;
                                        padding: 20px;
                                        border-radius: 10px 10px 0 0;
                                        text-align: center;
                                    "
                                >

                                    <h1 style="margin: 0;">
                                        TeknoHup
                                    </h1>

                                    <p style="margin: 8px 0 0;">
                                        İade Bilgilendirmesi
                                    </p>

                                </div>


                                <div
                                    style="
                                        background: white;
                                        padding: 30px;
                                        border-radius: 0 0 10px 10px;
                                    "
                                >

                                    <p>
                                        Merhaba
                                        <strong>
                                            ${returnData.user_name || "Değerli Müşterimiz"}
                                        </strong>,
                                    </p>


                                    <h2
                                        style="
                                            color: ${color};
                                        "
                                    >
                                        ${title}
                                    </h2>


                                    <p
                                        style="
                                            color: #374151;
                                            line-height: 1.6;
                                        "
                                    >
                                        ${message}
                                    </p>


                                    <div
                                        style="
                                            background: #f1f5f9;
                                            padding: 15px;
                                            border-radius: 8px;
                                            margin: 20px 0;
                                        "
                                    >

                                        <p style="margin: 5px 0;">
                                            <strong>İade No:</strong>
                                            #${returnData.id}
                                        </p>

                                        <p style="margin: 5px 0;">
                                            <strong>Sipariş No:</strong>
                                            #${returnData.order_id}
                                        </p>

                                        <p style="margin: 5px 0;">
                                            <strong>Durum:</strong>
                                            ${status}
                                        </p>

                                        <p style="margin: 5px 0;">
                                            <strong>İade Nedeni:</strong>
                                            ${returnData.reason}
                                        </p>

                                        ${status === "Reddedildi" && admin_note ? `
    <p
        style="
            margin: 15px 0 5px;
            padding-top: 12px;
            border-top: 1px solid #e5e7eb;
        "
    >
        <strong>Red Nedeni:</strong>
        ${admin_note}
    </p>
` : ""}

                                    </div>


                                    <p
                                        style="
                                            color: #6b7280;
                                            font-size: 14px;
                                            line-height: 1.5;
                                        "
                                    >
                                        Bu e-posta TeknoHup iade süreci
                                        hakkında bilgilendirme amacıyla
                                        otomatik olarak gönderilmiştir.
                                    </p>


                                    <p>
                                        İyi günler dileriz.<br>
                                        <strong>TeknoHup</strong>
                                    </p>

                                </div>

                            </div>

                        `;


                        try {

                            await sendMail(
                                returnData.user_email,
                                subject,
                                html
                            );


                            console.log(
                                "İADE MAILİ GÖNDERİLDİ:",
                                returnData.user_email
                            );

                        } catch (mailError) {

                            console.log(
                                "İADE MAILİ GÖNDERİLEMEDİ:",
                                mailError
                            );

                            // Mail gitmese bile
                            // veritabanındaki durum güncel kalır.

                        }

                    }


                    // =========================================
                    // BAŞARILI CEVAP
                    // =========================================

                    res.json({

                        message:
                            "İade durumu başarıyla güncellendi.",

                        status: status,

                        emailSent:
                            !!returnData.user_email

                    });

                }
            );

        }
    );

};



// =========================================
// EXPORT
// =========================================

module.exports = {
    createReturn,
    getUserReturns,
    getReturns,
    updateReturnStatus
};