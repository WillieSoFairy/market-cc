const tcb = require("@cloudbase/manager-node");

const app = tcb.init({
    'envId': process.env.ENV_ID,
    'region': process.env.REGION
});

const { env } = app;
const limit = 1;

exports.main = async (event, context) => {
    const user_id = event.customUserId;
    const { EnvInfo } = await env.getEnvInfo();
    const { Databases } = EnvInfo;
    if (!await is_admin(user_id, Databases)) {
        return { code: 403, data: null };
    }

    const query_param = {
        TableName: 'users',
        MgoOffset: 0,
        Tag: Databases[0].InstanceId,
        MgoLimit: limit
    }
    const init_res = await app.commonService('flexdb').call({
        Action: 'Query',
        Param: query_param
    });
    const { Pager } = init_res;
    let data = init_res.Data;
    const pages = Pager.Total % limit !== 0 ? (Pager.Total / limit) + 1 : Pager.Total / limit;
    for (let i = 1; i < pages; i++) {
        const current_offset = i * limit;
        query_param.MgoOffset = current_offset;
        const res = await app.commonService('flexdb').call({
            Action: 'Query',
            Param: query_param
        });
        data = data.concat(res.Data);
    }
    return { code: 200, data: data };
};

async function is_admin(user_id, Databases) {
    const query_param = {
        TableName: 'users',
        MgoOffset: 0,
        Tag: Databases[0].InstanceId,
        MgoLimit: limit,
        MgoQuery: JSON.stringify({ "_id": user_id, "auth": 0 })
    }
    const res = await app.commonService('flexdb').call({
        Action: 'Query',
        Param: query_param
    });
    if (res.Data.length === 0) {
        return false;
    }
    else {
        return true;
    }
}