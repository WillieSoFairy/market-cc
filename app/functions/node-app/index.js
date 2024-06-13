const cloudbase = require('@cloudbase/node-sdk');
const app = cloudbase.init({});
var db = app.database();


exports.main = async (event, context) => {
    db_res = db.collection("users")
        .where({
            user_name: event.user_name,
            pwd: event_pwd,
            enable: true
        })
        .field({
            alia: true,
            auth: true,
            user_name: true
        })
        .get()
    return db_res
};