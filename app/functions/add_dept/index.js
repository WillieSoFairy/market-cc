const tcb = require("@cloudbase/node-sdk");
const app = tcb.init({
    'env': process.env.ENV_ID
});
const db = app.database();

exports.main = async (event, context) => {
    const db_res = await db.collection("depart")
        .add({
            "dept_name": event.dept_name,
            "ent_id": event.ent_id,
            "enable": true
        });
    return db_res;
}