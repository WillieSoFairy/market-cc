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
        if (result.error !== null) { throw result.error; }
        return { pic_url: result.pic_url, ent_id: result.ent_id, pageNum: result.pageNum, total: result.total }
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
        console.log(result)
        const fileIDs = result.data.map((x) => { return x.thumb_fileID; });
        if (fileIDs.length !== 0) {
            const { fileList } = await tcb.getTempFileURL({ fileList: fileIDs });
            for (const i in result.data) { result.data[i].thumb = fileList[i].tempFileURL; }
        }
        return result;
    }
    catch (err) { throw err; }
}

export { get_pic, upload_pics, query_pic_df };