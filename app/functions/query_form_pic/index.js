const tcb = require("@cloudbase/node-sdk");
const app = tcb.init({ 'env': process.env.ENV_ID });

const dbConfig = require("./db.config");
const mysql = require('mysql2/promise').createPool(dbConfig);

const maxAge = 5 * 60 * 1000;

exports.main = async (event, context) => {
    const order_date = event.order_date;
    const page = event.pageNum;

    try {
        const total = await query_pages(order_date);
        if (page > total) { throw "Pages overflow"; }
        const details = await get_pic_detail(order_date, page);
        const pic_url = await get_pic_url(details.fileID);
        return { pic_url: pic_url, ent_id: details.ent_id, pageNum: page, total: total, error: null }
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
        return { fileID: result[0].path, ent_id: result[0].ent_id };
    }
    catch { throw "Query detail error"; }
}

async function get_pic_url(fileID) {
    const result = await app.getTempFileURL({
        fileList: [{ fileID: fileID, maxAge: maxAge }]
    });
    return result.fileList[0].tempFileURL;
}