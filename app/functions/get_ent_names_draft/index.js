const dbConfig = require("./db.config");
const mysql = require('mysql2/promise').createPool(dbConfig);

exports.main = async (event, context) => {
    const sql = `SELECT id,ent_name from enterprise WHERE enable=1;`;
    try {
        const [result] = await mysql.query(sql);
        return { ents: result, status: 0, info: null };
    }
    catch (err) { return { status: -1, info: "Database error" }; }
}