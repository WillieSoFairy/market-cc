import { tcb } from '../tcb/index.js';

async function get_account_info(user_id) {
    let result = null;
    await tcb.callFunction({
        name: 'get_current_account',
        data: { "user_id": user_id }
    }).then((res) => {
        result = res.result;
    });
    return result;
}

async function update_info(user_id, new_alia) {
    let result = null;
    await tcb.callFunction({
        name: 'update_account_info',
        data: {
            "user_id": user_id,
            "new_alia": new_alia
        }
    }).then((res) => {
        result = res.result;
    });
    return result;
}

export { get_account_info, update_info };