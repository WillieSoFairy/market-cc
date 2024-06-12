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

export { get_account_info };