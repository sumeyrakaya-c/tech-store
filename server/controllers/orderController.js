const db = require("../config/db");

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

    // Sepetteki ürünleri al
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

        // Sipariş oluştur
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
    ],   // <-- BURADA VİRGÜL VAR
    (err, result) => {

                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Sipariş oluşturulamadı."
                    });
                }

                const orderId = result.insertId;

                // Sipariş ürünlerini ekle
                const values = cartItems.map(item => ([
                    orderId,
                    item.product_id,
                    item.quantity,
                    item.price
                ]));

                const orderItemsSql = `
                    INSERT INTO order_items
                    (order_id, product_id, quantity, price)
                    VALUES ?
                `;

                db.query(orderItemsSql, [values], (err) => {

                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            message: "Sipariş ürünleri eklenemedi."
                        });
                    }

                    // Sepeti temizle
                    db.query("DELETE FROM cart", (err) => {

                        if (err) {
                            console.log(err);
                            return res.status(500).json({
                                message: "Sepet temizlenemedi."
                            });
                        }

                        res.json({
                            message: "Sipariş başarıyla oluşturuldu."
                        });

                    });

                });

            }
        );

    });

};

// Tüm siparişleri getir
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

// Sipariş durumunu güncelle
const updateOrderStatus = (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    const sql = `
        UPDATE orders
        SET status = ?
        WHERE id = ?
    `;

    db.query(sql, [status, id], (err) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Sipariş durumu güncellenemedi."
            });
        }

        res.json({
            message: "Sipariş durumu güncellendi."
        });

    });

};

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

    db.query(sql, [id], (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Sipariş detayları alınamadı."
            });
        }

        res.json(results);

    });

};

const getMyOrders = (req, res) => {

    const { userId } = req.params;

    const sql = `
        SELECT *
        FROM orders
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Siparişler alınamadı."
            });

        }

        res.json(results);

    });

};

module.exports = {
    createOrder,
    getOrders,
    updateOrderStatus,
    getOrderDetail,
    getMyOrders
};