const qf = require("@baiducloud/qianfan");
qf.setEnvVariable('QIANFAN_ACCESS_KEY', process.env.QIANFAN_ACCESS_KEY);
qf.setEnvVariable('QIANFAN_SECRET_KEY', process.env.QIANFAN_SECRET_KEY);

const client = new qf.ChatCompletion();
const system_promt = '你是一个生成json的机器人，我提供一个陈述句，你分析句子的主语以及宾语中的名词、数量词和量词，并将结果输出为单行（不换行）的json。json数据有且仅有以下4个字段：department（主语）、item（宾语的名词）、count（数量词，输出阿拉伯数字）和unit（量词），如果句子缺少某个语素，对应key的value为null。（例：输入：“ABC部门采购了10个苹果”；输出：{"department": "ABC部门","item": "苹果","count": 10,"unit": "个"}（输出使用markdown格式的json，且严格禁止换行））。';

exports.main = async (event, context) => {
    let history = event.history;
    history.push({ role: 'user', content: event.new_chat });
    const resp = await client.chat({
        temperature: 0.01,
        top_p: 0,
        system: system_promt,
        messages: history,
    }, 'ERNIE-Speed-8K');
    console.log(resp);
    const result = resp.result;
    history.push({ role: 'assistant', content: result });
    const struct_data = parse_JSON(result);
    return { data: struct_data, history: history };
};

function parse_JSON(res_str) {
    const patt = /```json({.*?})```/;
    let result = res_str.replace(/[\r\n]/g, '');
    result = (result.match(patt))[1];
    return JSON.parse(result);
}