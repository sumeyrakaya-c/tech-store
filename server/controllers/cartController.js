const db = require("../config/db");

// Sepete ürün ekle
const addToCart = (req, res) => {

    const { product_id, quantity } = req.body;

    const checkSql = `
        SELECT * FROM cart
        WHERE product_id = ?
    `;

    db.query(checkSql, [product_id], (err, results) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Bir hata oluştu."
            });
        }

        if (results.length > 0) {

            const updateSql = `
                UPDATE cart
                SET quantity = quantity + ?
                WHERE product_id = ?
            `;

            db.query(updateSql, [quantity, product_id], (err) => {

                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Sepet güncellenemedi."
                    });
                }

                return res.json({
                    message: "Ürün adedi artırıldı."
                });

            });

        } else {

            const insertSql = `
                INSERT INTO cart (product_id, quantity)
                VALUES (?, ?)
            `;

            db.query(insertSql, [product_id, quantity], (err) => {

                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Ürün sepete eklenemedi."
                    });
                }

                return res.status(201).json({
                    message: "Ürün sepete eklendi."
                });

            });

        }

    });

};

// Sepetteki ürünleri getir
const getCart = (req, res) => {

    const sql = `
        SELECT
            cart.id,
            cart.quantity,
            products.id AS product_id,
            products.name,
            products.price,
            products.image
        FROM cart
        INNER JOIN products
        ON cart.product_id = products.id
        ORDER BY cart.id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Sepet getirilemedi."
            });
        }

        res.json(results);

    });

};

// Adet güncelle
const updateCartQuantity = (req, res) => {

    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
        return res.status(400).json({
            message: "Adet 1'den küçük olamaz."
        });
    }

    const sql = `
        UPDATE cart
        SET quantity = ?
        WHERE id = ?
    `;

    db.query(sql, [quantity, id], (err) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Adet güncellenemedi."
            });
        }

        res.json({
            message: "Adet güncellendi."
        });

    });

};

// Sepetten sil
const deleteCartItem = (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM cart
        WHERE id = ?
    `;

    db.query(sql, [id], (err) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Ürün silinemedi."
            });
        }

        res.json({
            message: "Ürün sepetten silindi."
        });

    });

};

module.exports = {
    addToCart,
    getCart,
    updateCartQuantity,
    deleteCartItem
};