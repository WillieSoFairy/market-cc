const tcb = require("@cloudbase/node-sdk");
const app = tcb.init({
    'env': process.env.ENV_ID
});
const db = app.database();

exports.main = async (event, context) => {
    const db_res = await db.collection("goods")
        .add({
            "good_name": event.good_name
        });
    return db_res;
}