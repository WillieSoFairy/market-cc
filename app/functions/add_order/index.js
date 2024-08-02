const tcb = require("@cloudbase/node-sdk");
const app = tcb.init({ 'env': process.env.ENV_ID });

const dbConfig = require("./db.config");
const mysql = require('mysql2/promise').createPool(dbConfig);

exports.main = async (event, context) => {
    //enterprise
    // const ent_id = await get_entID(event.ent_name);
    const ent_id = event.ent_id;

    //department
    const dept_id = await get_deptID(event.dept_name, ent_id);

    //good
    const good_id = await get_goodID(event.good_name);

    //unit
    const unit_id = await get_unitID(event.unit_name);

    const count = event.count;
    const user_id = event.user_id;
    // const order_date = event.order_date;
    const pic_id = event.pic_id;

    const sql = `INSERT INTO
order_details (create_time,pic_id,dept_id,good_id,unit_id,count,user_id)
VALUES
(NOW(), ?, ?, ?, ?, ?, ?);`;

    try {
        const [results] = await mysql.query(sql, [pic_id, dept_id, good_id, unit_id, count, user_id]);
        await update_pic_ent(pic_id, ent_id);
        return results.insertId;
    }
    catch (err) {
        console.log(err);
        return -1;
    }
}

async function check_exist(table, field, data) {
    const sql = `select id from ${table} WHERE ${field}=?;`;
    const [results] = await mysql.query(sql, [data]);
    return results;
}

// async function get_entID(ent_name) {
//     const db_res = await check_exist("enterprise", "ent_name", ent_name);
//     if (db_res.length !== 0) {
//         return (db_res[0]).id;
//     }
//     else {
//         const fn_res = await app.callFunction({
//             name: "add_ent",
//             data: { "ent_name": ent_name }
//         });
//         return fn_res.result;
//     }
// }

async function get_deptID(dept_name, ent_id) {
    const sql = `select id from department WHERE dept_name=? and ent_id=?;`
    const [db_res] = await mysql.query(sql, [dept_name, ent_id]);
    if (db_res.length !== 0) {
        return (db_res[0]).id;
    }
    else {
        const fn_res = await app.callFunction({
            name: "add_dept",
            data: {
                "dept_name": dept_name,
                "ent_id": ent_id
            }
        });
        return fn_res.result;
    }
}

async function get_goodID(good_name) {
    const db_res = await check_exist("goods", "good_name", good_name);
    if (db_res.length !== 0) {
        return (db_res[0]).id;
    }
    else {
        const fn_res = await app.callFunction({
            name: "add_good",
            data: { "good_name": good_name }
        });
        return fn_res.result;
    }
}

async function get_unitID(unit_name) {
    const db_res = await check_exist("unit", "unit_name", unit_name);
    if (db_res.length !== 0) {
        return (db_res[0]).id;
    }
    else {
        const fn_res = await app.callFunction({
            name: "add_unit",
            data: { "unit_name": unit_name }
        });
        return fn_res.result;
    }
}