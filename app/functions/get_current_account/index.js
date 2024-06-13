const tcb = require("@cloudbase/node-sdk");
const app = tcb.init({
    'env': process.env.ENV_ID,
});
const db = app.database();
const _ = db.command;


exports.main = async (event, context) => {
    const { data } = await db.collection("users")
        .where({
            _id: _.eq(event.user_id)
        })
        .field({
            describe: 0,
            pwd: 0,
            visible: 0,
            enable: 0
        })
        .get()
    return data[0];
};