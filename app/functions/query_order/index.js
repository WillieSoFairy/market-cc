const dbConfig = require("./db.config");
const mysql = require('mysql2/promise').createPool(dbConfig);

exports.main = async (event, context) => {
    const pic_id = event.pic_id;
    try {
        const sql = `SELECT id,ent_name,dept_name,good_name,count,unit_name,order_date,pic_id from order_view2 where pic_id=?;`;
        const [results] = await mysql.query(sql, [pic_id]);
        return results;
    } catch {
        return null;
    }
}   