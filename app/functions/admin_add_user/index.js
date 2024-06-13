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
        return { code: 403 };
    }

    const now = new Date();
    const user_info = {
        "user_name": event.userInfo.user_name,
        "pwd": event.userInfo.pwd,
        "enable": event.userInfo.enable,
        "auth": event.userInfo.auth,
        "describe": event.userInfo.describe,
        "alia": event.userInfo.user_name,
        "create_date": now,
        "last_login": null,
        "visible": true
    }

    console.log(user_info)
    await app.commonService('flexdb').call({
        Action: 'PutItem',
        Param: {
            TableName: 'users',
            Tag: Databases[0].InstanceId,
            MgoDocs: [JSON.stringify(user_info)]
        }
    });
    return { code: 200 };
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