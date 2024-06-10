const dbConfig = require("./db.config");
const mysql = require('mysql2/promise').createPool(dbConfig);

exports.main = async (event, context) => {
    const order_date = new Date(event.order_date).toISOString().slice(0, 10);
    const sql = `select * from order_view where order_date='${order_date}';`
    const [results] = await mysql.query(sql);
    return results;
}   