const tcb = require("@cloudbase/node-sdk");
const app = tcb.init({ 'env': process.env.ENV_ID });

const dbConfig = require("./db.config");
const mysql = require('mysql2/promise').createPool(dbConfig);

exports.main = async (event, context) => {
    const pic_id = event.pic_id;
    const user = event.upload_user;
    try {
        const fileIDs = await verift_del(pic_id, user);
        if (!fileIDs) { throw "Forbidden: Order entered"; }
        const delrow = await del_db(pic_id, fileIDs);
        if (delrow !== 1) { throw "Delete row error" }
        await del_store(fileIDs);
        return { pic_id: pic_id, status: 0, info: null };
    }
    catch (err) { return { status: -1, info: err }; }
}

async function verift_del(pic_id, user) {
    const sql = `SELECT \`pic_fileID\`,\`thumb_fileID\` FROM pictures WHERE id=? AND upload_user=? AND \`entered_orders\`=0;`;
    try {
        const [result] = await mysql.query(sql, [pic_id, user]);
        if (result.length !== 0) {
            return [result[0].pic_fileID, result[0].thumb_fileID]
        }
        return false;
    }
    catch (err) {
        console.log(err);
        throw "Query detail error"
    }
}

async function del_db(pic_id, fileIDs) {
    const sql = `DELETE FROM order_pictures WHERE id=? AND pic_fileID=? AND thumb_fileID=?;`
    try {
        const [result] = await mysql.query(sql, [pic_id].concat(fileIDs));
        return result.affectedRows;
    }
    catch (err) {
        console.log(err);
        throw "Connect db error";
    }
}

async function del_store(fileIDs) {
    const result = await app.deleteFile({
        fileList: fileIDs
    });
    if (result.fileList.some((x) => { x.code !== 'SUCCESS' })) {
        throw "Del store error"
    }
}