const tcb = require("@cloudbase/node-sdk");
const app = tcb.init({ 'env': process.env.ENV_ID });

const dbConfig = require("./db.config");
const mysql = require('mysql2/promise').createPool(dbConfig);

const filePath = 'export_sheets';

exports.main = async (event, context) => {
    const order_date = event.order_date;
    const inf = event.exportInf;
    const deliver_date = event.deliver_date;
    try {
        const batch = await get_batch(order_date);
        await insert_export_rec(inf, batch, order_date, deliver_date);
        const { files, path_date } = await create_sheets(order_date, batch, deliver_date);
        const fileIDs = await store_files(files, path_date);
        await sync_fileID_db(fileIDs);
        return { files: files, status: 0, info: null };
    }
    catch (err) { return { status: -1, info: err }; };
}

async function get_batch(order_date) {
    const sql = `SELECT MAX(batch)as current_batch FROM export_rec WHERE order_date=?;`;
    try {
        const [result] = await mysql.query(sql, [order_date]);
        return result[0].current_batch + 1;
    }
    catch (err) { console.log(err); throw "Query batch error"; }
}

async function insert_export_rec(inf, batch, order_date, deliver_date) {
    const placeholder = inf.map(x => '(?,NOW())').join(',');
    const sql = `INSERT INTO export_rec 
(dept_id,order_date,deliver_date,deliver_ent,receiver,sender,batch,id_in_batch,create_time) 
VALUES  ${placeholder};`;
    try {
        const [result] = await mysql.query(sql, inf.map(x => [x.dept_id, order_date,
            deliver_date, x.deliver_ent, x.receiver, x.sender, batch, x.id_in_batch]));
    }
    catch (err) { console.log(err); throw "Insert record error"; }
}

async function create_sheets(order_date, batch, deliver_date) {
    try {
        const { result } = await app.callFunction({
            name: 'create_delivery_xlsx', data: {
                order_date: order_date, batch: batch,
                deliver_date: deliver_date
            }
        });
        if (result.status !== 0) { throw result.info; }
        const files = result.files.map((x) => {
            return {
                export_id: x.id,
                file: Buffer.from(x.file, 'base64'),
                name: `${x.id}_${x.name}`
            }
        });
        return { files: files, path_date: result.order_date };
    }
    catch (err) { console.log(err); throw err }
}

async function store_files(files_list, path_date) {
    const fileIDs = [];
    for (const file of files_list) {
        const { fileID } = await app.uploadFile({
            cloudPath: `${filePath}/${path_date}/${file.name}`,
            fileContent: file.file
        });
        fileIDs.push({ export_id: file.export_id, fileID: fileID });
    }
    return fileIDs;
}

async function sync_fileID_db(fileIDs) {
    const sql = `UPDATE export_rec SET file_id=? WHERE id=?;`;
    try {
        for (const file of fileIDs) {
            await mysql.query(sql, [file.fileID, file.export_id]);
        }
    }
    catch { console.log(err); throw "update file error" }
}