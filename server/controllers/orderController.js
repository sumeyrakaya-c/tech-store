const db = require("../config/db");
const sendMail = require("../config/mail");


// =========================================
// SİPARİŞ OLUŞTUR
// =========================================

const createOrder = (req, res) => {

    const {
        userId,
        fullName,
        phone,
        city,
        district,
        address,
        note,
        subtotal,
        shippingFee,
        totalPrice
    } = req.body;


    // Sepetteki ürünleri getir
    const cartSql = `
        SELECT
            cart.product_id,
            cart.quantity,
            products.price
        FROM cart
        INNER JOIN products
            ON cart.product_id = products.id
    `;


    db.query(cartSql, (err, cartItems) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Sepet okunamadı."
            });

        }


        if (cartItems.length === 0) {

            return res.status(400).json({
                message: "Sepet boş."
            });

        }


        // Siparişi oluştur
        const orderSql = `
            INSERT INTO orders
            (
                user_id,
                full_name,
                phone,
                city,
                district,
                address,
                note,
                subtotal,
                shipping_fee,
                total_price
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;


        db.query(
            orderSql,
            [
                userId,
                fullName,
                phone,
                city,
                district,
                address,
                note,
                subtotal,
                shippingFee,
                totalPrice
            ],
            (err, result) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json({
                        message: "Sipariş oluşturulamadı."
                    });

                }


                const orderId = result.insertId;


                // Sipariş ürünlerini hazırla
                const values = cartItems.map(item => ([
                    orderId,
                    item.product_id,
                    item.quantity,
                    item.price
                ]));


                const orderItemsSql = `
                    INSERT INTO order_items
                    (
                        order_id,
                        product_id,
                        quantity,
                        price
                    )
                    VALUES ?
                `;


                db.query(
                    orderItemsSql,
                    [values],
                    (err) => {

                        if (err) {

                            console.log(err);

                            return res.status(500).json({
                                message: "Sipariş ürünleri eklenemedi."
                            });

                        }


                        // Sepeti temizle
                        db.query(
                            "DELETE FROM cart",
                            (err) => {

                                if (err) {

                                    console.log(err);

                                    return res.status(500).json({
                                        message: "Sepet temizlenemedi."
                                    });

                                }


                                res.json({
                                    message: "Sipariş başarıyla oluşturuldu."
                                });

                            }
                        );

                    }
                );

            }
        );

    });

};


// =========================================
// TÜM SİPARİŞLERİ GETİR
// =========================================

const getOrders = (req, res) => {

    const sql = `
        SELECT *
        FROM orders
        ORDER BY created_at DESC
    `;


    db.query(sql, (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Siparişler getirilemedi."
            });

        }


        res.json(results);

    });

};


// =========================================
// SİPARİŞ DURUMUNU GÜNCELLE
// =========================================

const updateOrderStatus = (req, res) => {

    const { id } = req.params;
    const { status } = req.body;


    // Önce mevcut sipariş durumunu ve kullanıcı mailini getir
    const getOrderSql = `
        SELECT
            orders.id,
            orders.status AS old_status,
            orders.full_name,
            users.email
        FROM orders
        LEFT JOIN users
            ON orders.user_id = users.id
        WHERE orders.id = ?
    `;


    db.query(
        getOrderSql,
        [id],
        async (err, results) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Sipariş bilgileri alınamadı."
                });

            }


            if (results.length === 0) {

                return res.status(404).json({
                    message: "Sipariş bulunamadı."
                });

            }


            const order = results[0];


            // Durum gerçekten değişmemişse
            // tekrar mail gönderme
            if (order.old_status === status) {

                return res.json({
                    message: "Sipariş durumunda değişiklik yapılmadı."
                });

            }


            // Yeni durumu veritabanına kaydet
            const updateSql = `
                UPDATE orders
                SET status = ?
                WHERE id = ?
            `;


            db.query(
                updateSql,
                [status, id],
                async (err) => {

                    if (err) {

                        console.log(err);

                        return res.status(500).json({
                            message: "Sipariş durumu güncellenemedi."
                        });

                    }


                    // =====================================
                    // DURUMA GÖRE MAIL
                    // =====================================

                    let subject = "";
                    let html = "";


                    if (status === "Hazırlanıyor") {

                        subject = `Siparişiniz hazırlanıyor - #${id}`;

                        html = `
                            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
                                
                                <h2>Siparişiniz hazırlanıyor 📦</h2>

                                <p>Merhaba ${order.full_name},</p>

                                <p>
                                    <strong>#${id}</strong> numaralı siparişiniz
                                    hazırlanmaya başlanmıştır.
                                </p>

                                <p>
                                    Siparişiniz kargoya verildiğinde
                                    tekrar bilgilendirileceksiniz.
                                </p>

                                <p>Teşekkür ederiz.</p>

                            </div>
                        `;

                    } else if (status === "Kargoda") {

                        subject = `Siparişiniz kargoya verildi - #${id}`;

                        html = `
                            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">

                                <h2>Siparişiniz kargoda 🚚</h2>

                                <p>Merhaba ${order.full_name},</p>

                                <p>
                                    <strong>#${id}</strong> numaralı siparişiniz
                                    kargoya verilmiştir.
                                </p>

                                <p>
                                    Siparişiniz en kısa sürede
                                    tarafınıza ulaştırılacaktır.
                                </p>

                                <p>Teşekkür ederiz.</p>

                            </div>
                        `;

                    } else if (status === "Teslim Edildi") {

                        subject = `Siparişiniz teslim edildi - #${id}`;

                        html = `
                            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">

                                <h2>Siparişiniz teslim edildi ✅</h2>

                                <p>Merhaba ${order.full_name},</p>

                                <p>
                                    <strong>#${id}</strong> numaralı siparişiniz
                                    başarıyla teslim edilmiştir.
                                </p>

                                <p>
                                    Bizi tercih ettiğiniz için teşekkür ederiz.
                                </p>

                            </div>
                        `;

                    } else if (status === "İptal Edildi") {

                        subject = `Siparişiniz iptal edildi - #${id}`;

                        html = `
                            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">

                                <h2>Siparişiniz iptal edildi ❌</h2>

                                <p>Merhaba ${order.full_name},</p>

                                <p>
                                    <strong>#${id}</strong> numaralı siparişiniz
                                    iptal edilmiştir.
                                </p>

                                <p>
                                    Detaylı bilgi için bizimle iletişime geçebilirsiniz.
                                </p>

                            </div>
                        `;

                    }


                    // =====================================
                    // MAIL GÖNDER
                    // =====================================

                    if (order.email && subject && html) {

                        try {

                            await sendMail(
                                order.email,
                                subject,
                                html
                            );

                            console.log(
                                `📧 Sipariş #${id} için mail gönderildi.`
                            );

                        } catch (mailError) {

                            console.log(
                                "MAIL GÖNDERME HATASI:",
                                mailError
                            );

                            // Sipariş güncellendi.
                            // Mail başarısız olsa bile API
                            // hata vermesin.
                        }

                    } else {

                        console.log(
                            `⚠️ Sipariş #${id} için kullanıcı maili bulunamadı.`
                        );

                    }


                    res.json({
                        message: "Sipariş durumu güncellendi ve bildirim gönderildi.",
                        status
                    });

                }
            );

        }
    );

};


// =========================================
// SİPARİŞ DETAYI
// =========================================

const getOrderDetail = (req, res) => {

    const { id } = req.params;


    const sql = `
        SELECT
            order_items.*,
            products.name,
            products.image
        FROM order_items
        INNER JOIN products
            ON order_items.product_id = products.id
        WHERE order_items.order_id = ?
    `;


    db.query(
        sql,
        [id],
        (err, results) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Sipariş detayları alınamadı."
                });

            }


            res.json(results);

        }
    );

};


// =========================================
// KULLANICININ SİPARİŞLERİ
// =========================================

const getMyOrders = (req, res) => {

    const { userId } = req.params;


    const sql = `
        SELECT *
        FROM orders
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;


    db.query(
        sql,
        [userId],
        (err, results) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Siparişler alınamadı."
                });

            }


            res.json(results);

        }
    );

};


// =========================================
// EXPORT
// =========================================

module.exports = {
    createOrder,
    getOrders,
    updateOrderStatus,
    getOrderDetail,
    getMyOrders
};