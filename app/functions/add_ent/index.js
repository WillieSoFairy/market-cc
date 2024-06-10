const dbConfig = require("./db.config");
const mysql = require('mysql2/promise').createPool(dbConfig);

exports.main = async (event, context) => {
    const ent_name = event.ent_name;
    const sql = `INSERT INTO
    enterprise (create_time, ent_name, \`enable\`)
VALUES
    (NOW(), '${ent_name}', TRUE);`
    try {
        const [results] = await mysql.query(sql);
        return results.insertId;
    }
    catch (err) {
        console.log(err);
        return -1;
    }
}