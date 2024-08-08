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
        const pic_url = await get_pic_url(details.pic_fileID);
        return {
            pic_id: details.pic_id,
            pic_url: pic_url,
            ent_id: details.ent_id,
            ent_name: details.ent_name,
            remark: details.remark,
            pageNum: page, total: total, status: 0, info: null
        }
    }
    catch (err) { return { status: -1, info: err }; }
}

async function query_pages(order_date) {
    const sql = `select count(*) as pages from pictures WHERE order_date=?`;
    try {
        const [result] = await mysql.query(sql, [order_date]);
        return result[0].pages;
    }
    catch { throw "Query pages error"; }
}

async function get_pic_detail(order_date, pageNum) {
    const sql = `SELECT * FROM pictures WHERE order_date=? ORDER BY id LIMIT 1 OFFSET ?;`;
    try {
        const [result] = await mysql.query(sql, [order_date, pageNum - 1]);
        return result[0];
    }
    catch { throw "Query detail error"; }
}

async function get_pic_url(fileID) {
    const result = await app.getTempFileURL({
        fileList: [{ fileID: fileID, maxAge: maxAge }]
    });
    return result.fileList[0].tempFileURL;
}