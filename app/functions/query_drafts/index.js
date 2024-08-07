const db = require('/opt/db');
const { Op } = require('sequelize');

exports.main = async (event, context) => {
    const currPage = event.page;
    const where = event.where;
    const filter = new Filter(where);
    const order = event.order;
    let limit = 5;
    if (event.limit != undefined) { limit = event.limit; }

    const offset = (currPage - 1) * limit;
    try {
        const { totalNum, data } = await query_data(filter.where(), limit, offset, order);
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
                thumb_fileID: x.thumb_fileID,
                remark: x.remark,
                entered_orders: x.entered_orders
            };
        });
        return { totalNum: count, data: pictures };
    }
    catch (err) {
        console.log(err);
        throw "Database query error!"
    }
}

class Filter {
    constructor(param) {
        this.order_date_ge = param?.order_date?.[0];
        this.order_date_le = param?.order_date?.[1];
        this.ent_id = param?.ent_id;
        this.flow = param?.flow;
    }
    constcuct_orderDate() {
        if (this.order_date_ge && this.order_date_le) {
            return {
                order_date: {
                    [Op.and]: {
                        [Op.gte]: this.order_date_ge,
                        [Op.lte]: this.order_date_le
                    }
                }
            };
        }
        else { return {}; }
    }
    construct_entIDs() {
        if (this.ent_id && this.ent_id?.length !== 0) {
            return { ent_id: { [Op.or]: this.ent_id } };
        }
        else { return {}; }
    }
    constuct_flow() {
        if (this.flow && this.flow?.length !== 0) {
            let criteria = [];
            for (const x of this.flow) {
                if (x === 0) { criteria.push({ ent_name: { [Op.is]: null } }); }
                if (x === 1) { criteria.push({ ent_name: { [Op.not]: null } }); }
                if (x === 2) { criteria.push({ entered_orders: { [Op.gt]: 0 } }); }
            }
            return { [Op.or]: criteria };
        }
        else { return {}; }
    }
    where() {
        return {
            ...this.constcuct_orderDate(),
            ...this.construct_entIDs(),
            ...this.constuct_flow()
        };
    }
}