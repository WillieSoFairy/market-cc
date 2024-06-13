const dbConfig = require("./db.config");
const mysql = require('mysql2/promise').createPool(dbConfig);

exports.main = async (event, context) => {
    const unit_name = event.unit_name;
    const sql = `INSERT INTO
    unit (create_time, unit_name)
VALUES
    (NOW(), '${unit_name}');`
    try {
        const [results] = await mysql.query(sql);
        return results.insertId;
    }
    catch (err) {
        console.log(err);
        return -1;
    }
}