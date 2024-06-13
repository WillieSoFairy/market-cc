const dbConfig = require("./db.config");
const mysql = require('mysql2/promise').createPool(dbConfig);

exports.main = async (event, context) => {
    const order_id = event.order_id;
    try {
        const sql = `DELETE FROM order_details WHERE id=${order_id};`;
        const [results] = await mysql.query(sql);
        if (results.affectedRows === 1) {
            return true;
        }
        else {
            return false;
        }
    } catch (err) {
        console.log(err);
        return null;
    }
}   