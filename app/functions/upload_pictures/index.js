const tcb = require("@cloudbase/node-sdk");
const app = tcb.init({ 'env': process.env.ENV_ID });

const dbConfig = require("./db.config");
const mysql = require('mysql2/promise').createPool(dbConfig);
const crypto = require('crypto');
const picFilePath = "draftpic/";
const thumbFilePath = "draftpic/thumb/";

exports.main = async (event, context) => {
    //base64 picture
    const pics = event.pics;

    const order_date = event.order_date;
    const user_id = event.user_id;

    let ent_id = null;

    if (event.ent_name !== null && event.ent_name !== '') {
        ent_id = await get_entID(event.ent_name);
    }

    const status = { data: [], total: pics.length };
    for (const pic of pics) {
        const buff = decode_base64_pic(pic.pic_str);
        let suffix = null;
        try { suffix = get_pic_suffix(pic.name); }
        catch (err) {
            status.data.push({ name: pic.name, status: 1, info: err });
            continue;
        }

        const md5 = get_MD5(buff);

        let insertId = null;
        try { insertId = await create_db_record(md5, order_date, user_id, ent_id); }
        catch (err) { status.fail.push({ name: pic.name, status: 2, info: err }); continue; }

        const picfile_path = `${picFilePath}${insertId}-${md5}${suffix}`;
        const pic_fileID = await upload_file(buff, picfile_path);

        const thumb_path = `${thumbFilePath}${insertId}.png`;
        const thumb_buff = decode_base64_pic(pic.thumb);
        const thumb_fileID = await upload_file(thumb_buff, thumb_path);

        try {
            await sync_fileID_db(insertId, pic_fileID, thumb_fileID);
            status.data.push({ name: pic.name, status: 0, info: null });
        }
        catch (err) {
            status.data.push({ name: pic.name, status: 2, info: err });
            await app.deleteFile({ fileList: [pic_fileID, thumb_fileID] });
            continue;
        }
    }
    return status;
}

function get_pic_suffix(file_name) {
    const patt = /^[\s\S]*\.(png|jpeg|jpg|bmp)$/i;
    try {
        const suffix = (file_name.match(patt))[1];
        console.log(suffix);
        return '.' + suffix;
    }
    catch { throw "Not normal pic format"; }
}

function decode_base64_pic(base64_pic) {
    return Buffer.from(base64_pic, 'base64');
}

function get_MD5(pic_buff) {
    const md5 = crypto.createHash('md5');
    return md5.update(pic_buff).digest('hex');
}

async function upload_file(pic_buff, file_path) {
    // const file_path = picFilePath + md5 + suffix;
    const result = await app.uploadFile({
        cloudPath: file_path,
        fileContent: pic_buff
    });
    return result.fileID;
}

async function create_db_record(md5, order_date, user_id, ent_id) {
    const sql = `INSERT INTO
    order_pictures (create_time,order_date,\`MD5\`,\`pic_fileID\`,\`thumb_fileID\`,upload_user,ent_id)
    VALUES
    (NOW(),'${order_date}','${md5}','None','None','${user_id}',${ent_id});`;

    try {
        const [results] = await mysql.query(sql);
        return results.insertId;
    }
    catch (err) {
        console.log(err);
        throw 'Database create error';
    }
}

async function sync_fileID_db(dbKey, picID, thumbID) {
    const sql = `UPDATE order_pictures SET \`pic_fileID\`='${picID}',
    \`thumb_fileID\`='${thumbID}' WHERE id=${dbKey};`;
    try { await mysql.query(sql); }
    catch (err) {
        console.log(err);
        throw 'Database update fileID error';
    }
}

async function check_exist(table, field, data) {
    const sql = `select id from ${table} WHERE ${field}='${data}';`;
    const [results] = await mysql.query(sql);
    return results;
}

async function get_entID(ent_name) {
    const db_res = await check_exist("enterprise", "ent_name", ent_name);
    if (db_res.length !== 0) { return (db_res[0]).id; }
    else {
        const fn_res = await app.callFunction({
            name: "add_ent",
            data: { "ent_name": ent_name }
        });
        return fn_res.result;
    }
}