const dbConfig = require("./db.config");
const mysql = require('mysql2/promise').createPool(dbConfig);

exports.main = async (event, context) => {
    const good_name = event.good_name;
    const sql = `INSERT INTO
    goods (create_time, good_name)
VALUES
    (NOW(), '${good_name}');`
    try {
        const [results] = await mysql.query(sql);
        return results.insertId;
    }
    catch (err) {
        console.log(err);
        return -1;
    }
}