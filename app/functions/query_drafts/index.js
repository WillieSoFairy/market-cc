const db = require('/opt/db')

exports.main = async (event, context) => {
    const currPage = event.page;
    const where = event.where;
    const order = event.order;
    let limit = 5;
    if (event.limit != undefined) { limit = event.limit; }

    const offset = (currPage - 1) * limit;
    try {
        const { totalNum, data } = await query_data(where, limit, offset, order);
        const totalPages = Math.ceil(totalNum / limit);
        if (totalPages < currPage && totalNum !== 0) { throw "Page Overflow"; }
        return { data: data, totalNum: totalNum, totalPages: totalPages, limit: limit, page: currPage, status: 0, info: null };
    }
    catch (err) {
        console.log(err);
        return { status: -1, info: err };
    }
}

async function query_data(where, limit, offset, order) {
    try {
        const { count, rows } = await db.pictures.findAndCountAll({
            limit: limit,
            where: where,
            offset: offset,
            order: order
        });
        pictures = rows.map((x) => {
            return {
                id: x.id,
                ent_id: x.ent_id,
                ent_name: x.ent_name,
                order_date: x.order_date,
                create_time: x.create_time,
                thumb_fileID: x.thumb_fileID
            };
        });
        return { totalNum: count, data: pictures };
    }
    catch (err) {
        console.log(err);
        throw "Database query error!"
    }
}