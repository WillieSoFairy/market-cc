import { tcb } from '../tcb/index.js';
import dayjs from 'dayjs';

async function get_orderData(pic_id) {
    let result = null;
    await tcb.callFunction({
        name: 'query_order',
        data: { pic_id: pic_id }
    }).then((res) => {
        result = res.result.map((x, i) => { x.key = i; x.editable = false; return x; });
    });
    return result;
}

async function add_orderData(uploadData) {
    let insertId = null;
    const upload = {
        "ent_id": uploadData.ent_id,
        "dept_name": uploadData.dept_name,
        "good_name": uploadData.good_name,
        "unit_name": uploadData.unit_name,
        "count": uploadData.count,
        "user_id": uploadData.user_id,
        "pic_id": uploadData.pic_id
    }
    await tcb.callFunction({
        name: "add_order",
        data: upload
    }).then((res) => {
        insertId = res.result;
    });
    return insertId;
}

async function del_orderData(order_id) {
    let status = null;
    await tcb.callFunction({
        name: "del_order",
        data: { "order_id": order_id }
    }).then((res) => {
        status = res.result;
    });
    return status;
}

async function update_orderData(updateData) {
    let status = null;
    const update = {
        "order_id": updateData.id,
        "dept_name": updateData.dept_name,
        "good_name": updateData.good_name,
        "unit_name": updateData.unit_name,
        "count": updateData.count,
        "user_id": updateData.user_id
    }
    await tcb.callFunction({
        name: "update_order",
        data: update
    }).then((res) => {
        status = res.result;
    });
    return status;
}

export { get_orderData, add_orderData, del_orderData, update_orderData };