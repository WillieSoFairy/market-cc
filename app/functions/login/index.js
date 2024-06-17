const tcb = require("@cloudbase/node-sdk");
const app = tcb.init({
    'env': process.env.ENV_ID,
    'credentials': require(process.env.KEY_PATH)
});
var db = app.database();


exports.main = async (event, context) => {
    db_res = await db.collection("users")
        .where({
            user_name: event.user_name,
            pwd: event.pwd,
            enable: true
        })
        .field({
            _id: true,
            alia: true,
            auth: true,
            user_name: true
        })
        .get();
    data = db_res.data;
    let ticket = '';
    let code = 1;
    if (data.length !== 0) {
        code = 0;
        const customUserID = data[0]._id;
        ticket = app.auth().createTicket(customUserID);

        await db.collection("users")
            .where({ _id: customUserID })
            .update({ last_login: new db.serverDate() });
    }

    return {
        "ticket": ticket,
        "code": code,
        "user_info": data
    }
};