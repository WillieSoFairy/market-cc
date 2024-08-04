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
        console.log(result)
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

// async function update_pic_info(pic_id, param) {
//     try {
//         const { result } = await tcb.callFunction({
//             name: 'update_draft',
//             data: { param: param, pic_id: pic_id }
//         });
//         console.log(result);
//     }
//     catch (err) { throw err; }
// }

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
export { get_pic, upload_pics, query_pic_df, update_pic_info, bind_ent_pic };