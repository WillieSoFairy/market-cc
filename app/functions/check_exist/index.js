const dbConfig = require("./db.config");
const mysql = require('mysql2/promise').createPool(dbConfig);

exports.main = async (event, context) => {
    const table = event.table;
    const field = event.field;
    const data = event.data;
    const sql = `select id from ${table} WHERE ${field}='${data}';`;
    try {
        const [results, field] = await mysql.query(sql);
        console.log(field);
        return results;
    }
    catch (err) {
        console.log(err);
        return -1;
    }
}