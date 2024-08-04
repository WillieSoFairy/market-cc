const tcb = require("@cloudbase/node-sdk");
const app = tcb.init({ 'env': process.env.ENV_ID });

const dbConfig = require("./db.config");
const mysql = require('mysql2/promise').createPool(dbConfig);

exports.main = async (event, context) => {
    const pic_id = event.pic_id;
    const ent_name = event.ent_name;
    try {
        const ent_id = await get_entID(ent_name);
        const affectedRows = await bind(ent_id, pic_id);
        return { affectedRows: affectedRows, status: 0, info: null };
    }
    catch (err) {
        return { status: -1, info: err };
    }
}

async function check_exist(ent_name) {
    const sql = `select id from enterprise WHERE ent_name=?;`;
    try {
        const [results] = await mysql.query(sql, [ent_name]);
        return results;
    }
    catch (err) {
        console.log(err);
        throw "Check error";
    }
}

async function get_entID(ent_name) {
    try {
        const db_res = await check_exist(ent_name);
        if (db_res.length !== 0) { return db_res[0].id; }
        else {
            const { result } = await app.callFunction({
                name: 'add_ent',
                data: { ent_name: ent_name }
            });
            return result;
        }
    }
    catch (err) {
        console.log(err);
        throw "get ID error";
    }
}

async function bind(ent_id, pic_id) {
    const sql = `UPDATE order_pictures SET ent_id=? WHERE id=?;`
    try {
        const [results] = await mysql.query(sql, [ent_id, pic_id]);
        return results.affectedRows;
    }
    catch (err) {
        console.log(err);
        throw "Bind error";
    }
}