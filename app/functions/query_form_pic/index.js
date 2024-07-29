const dbConfig = require("./db.config");
const mysql = require('mysql2/promise').createPool(dbConfig);

exports.main = async (event, context) => {
    const order_date = event.order_date;
    const page = event.pageNum;

    try {
        const total = await query_pages(order_date);
        console.log(total)
        if (page > total) { throw "Pages overflow"; }
        const details = await get_pic_detail(order_date, page);
        return details;
    }
    catch (err) { return { error: err }; }
}

async function query_pages(order_date) {
    const sql = `select count(*) as pages from order_pictures WHERE order_date='${order_date}'`;
    try {
        const [result] = await mysql.query(sql);
        return result[0].pages;
    }
    catch { throw "Query pages error"; }
}

async function get_pic_detail(order_date, pageNum) {
    const sql = `SELECT * FROM order_pictures WHERE order_date='${order_date}' ORDER BY id LIMIT 1 OFFSET ${pageNum - 1};`;
    try {
        const [result] = await mysql.query(sql);
        return { path: result[0].path, ent_id: result[0].ent_id };
    }
    catch { throw "Query detail error"; }
}