const tcb = require("@cloudbase/node-sdk");
const app = tcb.init({
    'env': process.env.ENV_ID
});
const db = app.database();

exports.main = async (event, context) => {
    const db_res = await db.collection("enterprise")
        .add({
            "ent_name": event.ent_name,
            "enable": true
        });
    return db_res;
}