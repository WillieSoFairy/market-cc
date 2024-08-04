const dbConfig = require("./db.config");
const mysql = require('mysql2/promise').createPool(dbConfig);

exports.main = async (event, context) => {
    const sql = `SELECT DISTINCT order_date FROM pictures ORDER BY order_date DESC;`;
    try {
        const [results] = await mysql.query(sql);
        return {
            dates: results.map((x) => { return x.order_date; }),
            status: 0,
            info: null
        };
    }
    catch (err) {
        console.log(err);
        return { status: -1, info: "Database error" };
    }
}