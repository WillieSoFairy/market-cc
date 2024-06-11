const dbConfig = require("./db.config");
const mysql = require('mysql2/promise').createPool(dbConfig);

exports.main = async (event, context) => {
    const dept_name = event.dept_name;
    const ent_id = event.ent_id;
    const sql = `INSERT INTO
    department (create_time, dept_name, ent_id, \`enable\`)
VALUES
    (NOW(), '${dept_name}', '${ent_id}', TRUE);`
    try {
        const [results] = await mysql.query(sql);
        return results.insertId;
    }
    catch (err) {
        console.log(err);
        return -1;
    }
}