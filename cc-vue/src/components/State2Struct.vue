<template>
    <a-input-search placeholder="AI识别：如“小明采购苹果两个”" v-model:value="new_chat" @search="handleSent">
        <template #enterButton>
            <a-button type="primary">
                <SendOutlined v-if="!loading" />
                <LoadingOutlined v-else />
            </a-button>
        </template>
    </a-input-search>
</template>

<script setup>
import { SendOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';
import { tcb } from '../tcb/index.js';
import { message } from 'ant-design-vue';

const loading = ref(false);
let chat_history = [];
const new_chat = ref(null);
const res_data = defineModel();
res_data.value = { dept_name: null, good_name: null, count: null, unit_name: null };

async function handleSent() {
    loading.value = true;
    try {
        await get_data_from_LLM(chat_history, new_chat.value);
    }
    catch (err) {
        message.error(err)
    }
    loading.value = false;
    console.log(res_data.value);
    console.log(chat_history)
}

async function get_data_from_LLM(history, new_chat) {
    if (new_chat === null || new_chat == '') {
        throw '请输入识别内容'
    }
    const data = {
        history: history,
        new_chat: new_chat
    };
    console.log(data)
    await tcb.callFunction({
        name: 'get_struct_order',
        data: data
    }).then((res) => {
        console.log(res)
        const result = res.result;
        chat_history = result.history;
        const struct_data = result.data;
        res_data.value.dept_name = struct_data.department;
        res_data.value.good_name = struct_data.item;
        res_data.value.count = struct_data.count;
        res_data.value.unit_name = struct_data.unit;
    }).catch((err) => {
        console.log(err);
        throw '智能识别失败';
    });
}


</script>