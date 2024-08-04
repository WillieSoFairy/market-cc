const db = require('/opt/db')

exports.main = async (event, context) => {
    const param = event.param;
    const pic_id = event.pic_id;
    try {
        const [result] = await db.order_pictures.update(param,
            { where: { id: pic_id } });
        return { updatedID: result, status: 0, info: null };
    }
    catch (err) {
        console.log(err);
        return { status: -1, info: "Database error" };
    }
}