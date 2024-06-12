import { tcb } from '../tcb/index.js';

async function get_orderData(order_date, ent_name) {
    let result = null;
    await tcb.callFunction({
        name: 'query_order',
        data: {
            "order_date": order_date,
            "ent_name": ent_name
        }
    }).then((res) => {
        result = res.result.map((x, i) => { x.key = i; x.editable = false; return x; });
    });
    return result;
}

async function add_orderData(uploadData) {
    let insertId = null;
    await tcb.callFunction({
        name: "add_order",
        data: uploadData
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
    await tcb.callFunction({
        name: "update_order",
        data: updateData
    }).then((res) => {
        status = res.result;
    });
    return status;
}

export { get_orderData, add_orderData, del_orderData, update_orderData };