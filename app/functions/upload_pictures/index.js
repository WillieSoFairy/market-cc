const tcb = require("@cloudbase/node-sdk");
const app = tcb.init({ 'env': process.env.ENV_ID });

const dbConfig = require("./db.config");
const mysql = require('mysql2/promise').createPool(dbConfig);
const crypto = require('crypto');
const cloudFilePath = "draftpic/";

exports.main = async (event, context) => {
    //base64 picture
    const pics = event.pics;

    const order_date = event.order_date;
    const user_id = event.user_id;

    const status = { success: [], fail: [], total: pics.length };
    for (const pic of pics) {
        const buff = decode_base64_pic(pic.pic_str);
        let suffix = null;
        try {
            suffix = get_pic_suffix(pic.name);
        }
        catch (err) {
            status.fail.push({ file: pic.name, error: err });
            continue;
        }

        const md5 = get_MD5(buff);
        const fileID = await upload_file(buff, md5, suffix);

        try {
            await sync_db(md5, fileID, order_date, user_id);
            status.success.push(pic.name);
        }
        catch (err) {
            status.fail.push({ file: pic.name, error: err });
            await app.deleteFile({ fileList: [fileID] });
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

async function upload_file(pic_buff, md5, suffix) {
    const file_path = cloudFilePath + md5 + suffix;
    const result = await app.uploadFile({
        cloudPath: file_path,
        fileContent: pic_buff
    });
    return result.fileID;
}

async function sync_db(md5, path, order_date, user_id) {
    const sql = `INSERT INTO
    order_pictures (create_time,order_date,\`MD5\`,path,upload_user)
    VALUES
    (NOW(), '${order_date}', '${md5}', '${path}', '${user_id}');`;

    try {
        const [results] = await mysql.query(sql);
        return results.insertId;
    }
    catch (err) { throw 'Database Error'; }
}