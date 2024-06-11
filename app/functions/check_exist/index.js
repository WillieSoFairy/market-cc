const tcb = require("@cloudbase/node-sdk");
const app = tcb.init({
    'env': process.env.ENV_ID
});
const db = app.database();
const _ = db.command;

exports.main = async (event, context) => {
    const db_res = await db.collection(event.db)
        .where({
            [event.field]: _.eq(event.data)
        })
        .get();
    return db_res.data;
}