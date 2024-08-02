const tcb = require("@cloudbase/node-sdk");
const app = tcb.init({ 'env': process.env.ENV_ID });

const db = require('./db');

exports.main = async (event, context) => {
    try {
        const pictures = await db.pictures.findAll();
        console.log(pictures);
    }
    catch (err) { console.log(err); }
}