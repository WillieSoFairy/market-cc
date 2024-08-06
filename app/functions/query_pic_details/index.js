const tcb = require("@cloudbase/node-sdk");
const app = tcb.init({ 'env': process.env.ENV_ID });

const dbConfig = require("./db.config");
const mysql = require('mysql2/promise').createPool(dbConfig);

const maxAge = 5 * 60 * 1000;

exports.main = async (event, context) => {
    const pic_id = event.pic_id;
    try {
        const db_res = await get_pic_detail(pic_id);
        const { pic_fileID } = db_res;
        const url = await get_pic_url(pic_fileID);
        return {
            pic_id: db_res.id, ent_id: db_res.ent_id, ent_name: db_res.ent_name,
            order_date: db_res.order_date, pic_url: url, user: db_res.upload_user,
            remark: db_res.remark, entered_orders: db_res.entered_orders,
            status: 0, info: null
        }
    }
    catch (err) { return { status: -1, info: err }; }
}

async function get_pic_detail(pic_id) {
    const sql = `SELECT * FROM pictures WHERE id=?;`;
    try {
        const [result] = await mysql.query(sql, [pic_id]);
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