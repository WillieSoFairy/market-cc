const tcb = require("@cloudbase/node-sdk");
const app = tcb.init({
    'env': process.env.ENV_ID
});

const dbConfig = require("./db.config");
const mysql = require('mysql2/promise').createPool(dbConfig);

exports.main = async (event, context) => {
    const order_id = event.order_id;

    //enterprise
    const ent_id = await get_entID(order_id);

    //department
    const dept_id = await get_deptID(event.dept_name, ent_id);
    console.log(dept_id)

    //good
    const good_id = await get_goodID(event.good_name);

    //unit
    const unit_id = await get_unitID(event.unit_name);

    const count = event.count;
    const user_id = event.user_id;

    const sql = `UPDATE order_details 
set good_id=?,count=?,unit_id=?,dept_id=?,user_id=?,create_time=NOW() WHERE id=?;`;

    try {
        const [results] = await mysql.query(sql, [good_id, count, unit_id, dept_id, user_id, order_id]);
        return results.affectedRows;
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

async function get_entID(order_id) {
    const sql = `select ent_id from order_view2 WHERE id=?;`;
    const [result] = await mysql.query(sql, [order_id]);
    console.log(result)
    return (result[0]).ent_id;
}

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