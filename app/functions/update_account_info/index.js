const tcb = require("@cloudbase/node-sdk");
const app = tcb.init({
    'env': process.env.ENV_ID,
});
const db = app.database();

exports.main = async (event, context) => {
    const { updated } = await db.collection("users")
        .where({ _id: event.user_id })
        .update({ alia: event.new_alia });
    return updated;
};