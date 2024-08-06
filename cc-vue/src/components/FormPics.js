import { tcb, auth } from '../tcb/index.js';
import dayjs from 'dayjs';

async function get_pic(order_date, pageNum) {
    try {
        const res = await tcb.callFunction({
            name: 'query_form_pic',
            data: {
                order_date: dayjs(order_date).format('YYYY-MM-DD'),
                pageNum: pageNum
            }
        });
        const { result } = res;
        if (result.status !== 0) { throw result.info; }
        return result;
    }
    catch (err) { throw err; }
}

async function upload_pics(pics, order_date, ent_name) {
    const user_id = await auth.getCurrenUser();
    try {
        const res = await tcb.callFunction({
            name: 'upload_pictures',
            data: {
                pics: pics,
                order_date: dayjs(order_date).format('YYYY-MM-DD'),
                user_id: user_id.customUserId,
                ent_name: ent_name
            }
        });
        return res.result;
    }
    catch (err) { throw err; }
}

async function query_pic_df(page, where, order, limit) {
    try {
        const { result } = await tcb.callFunction({
            name: 'query_drafts',
            data: { page: page, where: where, order: order, limit: limit }
        });
        const fileIDs = result.data.map((x) => { return x.thumb_fileID; });
        if (fileIDs.length !== 0) {
            const { fileList } = await tcb.getTempFileURL({ fileList: fileIDs });
            for (const i in result.data) { result.data[i].thumb = fileList[i].tempFileURL; }
        }
        return result;
    }
    catch (err) { throw err; }
}

async function update_pic_info(pic_id, param) {
    try {
        const { result } = await tcb.callFunction({
            name: 'update_draft',
            data: { param: param, pic_id: pic_id }
        });
    }
    catch (err) { throw err; }
}

async function bind_ent_pic(ent_name, pic_id) {
    try {
        const { result } = await tcb.callFunction({
            name: 'bind_ent_pic',
            data: { ent_name: ent_name, pic_id: pic_id }
        });
        if (result.status !== 0) { throw result.info; }
        return result.affectedRows;
    }
    catch (err) { throw err; }
}

async function get_pic_detail(pic_id) {
    try {
        const { result } = await tcb.callFunction({
            name: 'query_pic_details',
            data: { pic_id: pic_id }
        });
        if (result.status !== 0) { throw result.info; }
        result.order_date = dayjs(result.order_date);
        return result;
    }
    catch (err) { throw err; }
}

async function del_draft(pic_id, upload_user) {
    try {
        const { result } = await tcb.callFunction({
            name: 'del_draft',
            data: { pic_id: pic_id, upload_user: upload_user }
        });
        if (result.status !== 0) { throw result.info; }
        return result;
    }
    catch (err) { throw err; }
}

async function filter_get_ent() {
    try {
        const { result } = await tcb.callFunction({
            name: 'get_ent_names_draft', data: null
        });
        if (result.status !== 0) { throw result.info; }
        const { ents } = result;
        return ents.map((x) => { return { value: x.id, label: x.ent_name }; });
    }
    catch (err) { throw err; }
}
export { get_pic, upload_pics, query_pic_df, update_pic_info, bind_ent_pic, get_pic_detail, del_draft, filter_get_ent };