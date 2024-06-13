const dbConfig = require("./db.config");
const mysql = require('mysql2/promise').createPool(dbConfig);

exports.main = async (event, context) => {
    const order_date = event.order_date;
    const ent_name = event.ent_name;
    try {
        const sql = `SELECT id,ent_name,dept_name,good_name,count,unit_name,order_date from order_view where order_date='${order_date}' and ent_name='${ent_name}';`;
        const [results] = await mysql.query(sql);
        return results;
    } catch {
        return null;
    }
}   