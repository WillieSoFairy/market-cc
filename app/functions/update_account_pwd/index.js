const tcb = require("@cloudbase/node-sdk");
const app = tcb.init({
    'env': process.env.ENV_ID,
});
const db = app.database();
const _ = db.command;

exports.main = async (event, context) => {
    const user_id = event.user_id;
    const pre_pwd = event.pre_pwd;
    const new_pwd = event.new_pwd;
    const confirm = event.confirm;
    if ((pre_pwd == null) || (new_pwd == null) || (confirm == null)) { return { code: -1, msg: "Missing parameters" }; }
    if (new_pwd !== confirm) { return { code: -3, msg: "Unequal both new passwords" }; }

    const { pwd } = await get_prePwd(user_id);
    if (pwd !== pre_pwd) { return { code: -2, msg: "Invalid old passwords" }; }
    if (pre_pwd === new_pwd) { return { code: 0, msg: "Pwd unchanged" }; }

    const { updated } = await db.collection("users")
        .where({ _id: event.user_id })
        .update({ pwd: confirm });
    return { code: updated, msg: "Authorized" };
};

async function get_prePwd(user_id) {
    const { data } = await db.collection("users")
        .where({
            _id: _.eq(user_id)
        })
        .field({
            _id: 0,
            pwd: 1
        })
        .get();
    return data[0];
}