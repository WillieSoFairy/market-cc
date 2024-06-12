const tcb = require("@cloudbase/manager-node");

const app = tcb.init({
    'envId': process.env.ENV_ID,
    'region': process.env.REGION
});

const { env } = app;
const limit = 10;

exports.main = async (event, context) => {
    const user_id = event.customUserId;
    const { EnvInfo } = await env.getEnvInfo();
    const { Databases } = EnvInfo;
    if (!await is_admin(user_id, Databases)) {
        return { code: 403, ModifiedNum: 0 };
    }

    const update_id = event.updateId;
    const user_info = {
        "user_name": event.userInfo.user_name,
        "enable": event.userInfo.enable,
        "auth": event.userInfo.auth,
        "describe": event.userInfo.describe,
        "pwd": event.userInfo.pwd,
        "create_date": event.userInfo.create_date,
        "last_login": event.userInfo.last_login,
        "visible": event.userInfo.visible,
        "alia": event.userInfo.alia
    }
    console.log(user_info)
    const { ModifiedNum } = await app.commonService('flexdb').call({
        Action: 'UpdateItem',
        Param: {
            TableName: 'users',
            Tag: Databases[0].InstanceId,
            MgoQuery: JSON.stringify({ "_id": update_id }),
            MgoUpdate: JSON.stringify(user_info)
        }
    });
    return { code: 200, "ModifiedNum": ModifiedNum };
}

async function is_admin(user_id, Databases) {
    const res = await app.commonService('flexdb').call({
        Action: 'Query',
        Param: {
            TableName: 'users',
            MgoOffset: 0,
            Tag: Databases[0].InstanceId,
            MgoLimit: limit,
            MgoQuery: JSON.stringify({ "_id": user_id, "auth": 0, "enable": true })
        }
    });
    if (res.Data.length === 0) {
        return false;
    }
    else {
        return true;
    }
}