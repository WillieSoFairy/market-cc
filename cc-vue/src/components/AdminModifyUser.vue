<template>
    <a-form>
        <a-form-item label="用户ID" v-if="!props.isNewUser">
            <a-input v-model:value="userInfo._id" :disabled="true" />
        </a-form-item>
        <a-form-item label="用户名">
            <a-input v-model:value="userInfo.user_name" />
        </a-form-item>
        <a-form-item label="密码">
            <a-input-password v-model:value="userInfo.pwd" />
        </a-form-item>
        <a-form-item label="激活">
            <a-switch v-model:checked="userInfo.enable" :disabled="currentUser === userInfo._id" />
        </a-form-item>
        <a-form-item label="用户权限">
            <a-radio-group v-model:value="userInfo.auth" button-style="solid" :disabled="currentUser === userInfo._id">
                <a-radio-button :value="0">管理员</a-radio-button>
                <a-radio-button :value="1">普通用户</a-radio-button>
            </a-radio-group>
        </a-form-item>
        <a-form-item label="描述">
            <a-textarea v-model:value="userInfo.describe" />
        </a-form-item>
        <a-form-item>
            <a-button type="primary" @click="clickSubmit" :loading="button_loading">确认{{ props.isNewUser ? "新增" :
                "修改" }}</a-button>
            <a-button style="margin-left: 10px" @click="closeModel">取消</a-button>
        </a-form-item>
    </a-form>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { tcb, auth } from '../tcb/index.js';
import { message } from 'ant-design-vue';

const props = defineProps({
    userInfo: Object,
    isNewUser: Boolean
});
const emits = defineEmits(['modified']);

const userInfo = ref({
    _id: null,
    user_name: null,
    enable: true,
    auth: 1,
    describe: null,
    pwd: null
});
const currentUser = ref(null);
onMounted(async () => {
    const currentAuth = await auth.getCurrenUser();
    currentUser.value = currentAuth.customUserId;
    if (props.userInfo !== null) {
        userInfo.value._id = props.userInfo._id;
        userInfo.value.user_name = props.userInfo.user_name;
        userInfo.value.enable = props.userInfo.enable;
        userInfo.value.auth = props.userInfo.auth;
        userInfo.value.describe = props.userInfo.describe;
    }
});

const openModal = defineModel();
function closeModel() {
    openModal.value = false;
}

async function submitUpdate() {
    let pwd = props.userInfo.pwd;
    if (userInfo.value.pwd !== null && userInfo.value.pwd !== "") {
        pwd = userInfo.value.pwd;
    }
    console.log(pwd)
    const { customUserId } = await auth.getCurrenUser();
    const update_userInfo = {
        "user_name": userInfo.value.user_name,
        "pwd": pwd,
        "enable": userInfo.value.enable,
        "auth": userInfo.value.auth,
        "describe": userInfo.value.describe,
        "create_date": props.userInfo.create_date,
        "last_login": props.userInfo.last_login,
        "alia": props.userInfo.alia,
        "visible": true
    }
    await tcb.callFunction({
        "name": "admin_update_user",
        "data": {
            "customUserId": customUserId,
            "updateId": userInfo.value._id,
            "userInfo": update_userInfo
        }
    }).then((res) => {
        console.log(res);
    });
    message.success('更新成功', 1.5);
}

async function submitAdd() {
    const { customUserId } = await auth.getCurrenUser();
    await tcb.callFunction({
        "name": "admin_add_user",
        "data": {
            "customUserId": customUserId,
            "userInfo": {
                "user_name": userInfo.value.user_name,
                "pwd": userInfo.value.pwd,
                "enable": userInfo.value.enable,
                "auth": userInfo.value.auth,
                "describe": userInfo.value.describe
            }
        }
    }).then((res) => {
        console.log(res);
    });
    message.success('添加成功', 1.5);
}

const button_loading = ref(false);
async function clickSubmit() {
    button_loading.value = true;
    if (!props.isNewUser) {
        await submitUpdate();
    }
    else {
        await submitAdd();
    }
    button_loading.value = false;
    emits('modified');
    openModal.value = false;
}
</script>