const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", (req, res) => {

    db.query("SELECT * FROM brands ORDER BY name ASC", (err, results) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(results);

    });

});

module.exports = router;