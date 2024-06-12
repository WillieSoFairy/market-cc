<template>
    <a-row>
        <a-col :span="12">
            <a-card :bordered="false" style="width: 500px" :loading="cardLoading">
                <a-card-meta :description="'@' + accInfo.user_name">
                    <template #title>
                        <span>
                            <span>
                                <a-typography-text strong style="font-size: 1.5em;" v-if="!aliaEditing">
                                    {{ accInfo.alia }}</a-typography-text>
                                <a-input v-else style="width: 10em;" placeholder="输入新的名称" v-model:value="newAlia" />
                            </span>
                            <a-divider type="vertical" />
                            <span v-if="!aliaEditing">
                                <a @click="handleEditAlia">
                                    <EditOutlined />
                                </a>
                            </span>
                            <span v-else>
                                <a>
                                    <CheckCircleOutlined @click="handleUpdateAlia" style="color:#52c41a" />
                                </a>
                                <a-divider type="vertical" />
                                <a>
                                    <CloseCircleOutlined @click="handleCancelAlia" style="color:#eb2f96" />
                                </a>
                            </span>
                        </span>
                    </template>
                    <template #avatar>
                        <a-avatar size="large" style="color: #f56a00; background-color: #fde3cf">
                            {{ avatarFill }}</a-avatar>
                    </template>
                </a-card-meta>
                <a-divider />
                <a-list item-layout="horizontal" :dataSource="accCard" :split="false" size="small">
                    <template #header>
                        <a-typography-text strong>用户信息</a-typography-text>
                    </template>
                    <template #renderItem="{ item }">
                        <a-list-item>
                            <a-list-item-meta :description="item.desc">
                                <template #title>
                                    <a-typography-text>{{ item.title }}</a-typography-text>
                                </template>
                            </a-list-item-meta>
                        </a-list-item>
                    </template>
                </a-list>
                <template #actions>
                    <a-typography-link target="_blank">
                        <KeyOutlined style="font-size: 1em;" />
                        <span>修改密码</span>
                    </a-typography-link>
                </template>
            </a-card>
        </a-col>
    </a-row>

</template>

<script setup>
import { auth } from '../tcb/index.js';
import { get_account_info, update_info } from "../components/UserAccount.js";
import { onMounted, ref } from 'vue';
import { EditOutlined, KeyOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs';

const acc = {
    "_id": null,
    "auth": null,
    "create_date": null,
    "last_login": null,
    "user_name": null,
    "alia": null
}

const accInfo = ref(acc);
const avatarFill = ref();
const accCard = ref([
    {
        title: '用户权限',
        desc: ''
    },
    {
        title: '用户创建时间',
        desc: ''
    },
    {
        title: '上次登入时间',
        desc: ''
    }
]);
const cardLoading = ref(false);

onMounted(async () => {
    cardLoading.value = true;
    const { customUserId } = await auth.getCurrenUser();
    await load_cardInfo(customUserId);
    cardLoading.value = false;
});

const aliaEditing = ref(false);
const newAlia = ref(accInfo.value.alia);
function handleEditAlia() {
    newAlia.value = accInfo.value.alia;
    aliaEditing.value = true;
}
function handleCancelAlia() {
    aliaEditing.value = false;
    newAlia.value = accInfo.value.alia;
}

async function handleUpdateAlia() {
    cardLoading.value = true
    const { customUserId } = await auth.getCurrenUser();
    const result = await update_info(customUserId, newAlia.value);
    await load_cardInfo(customUserId);
    aliaEditing.value = false;
    cardLoading.value = false;
    console.log(result);
}

async function load_cardInfo(user_id) {
    accInfo.value = await get_account_info(user_id);
    avatarFill.value = (accInfo.value.alia)[0].toUpperCase();
    accCard.value[0].desc = accInfo.value.auth === 0 ? "管理员" : "普通用户";
    accCard.value[1].desc = dayjs(accInfo.value.create_date).format('YYYY/MM/DD HH:mm:ss');
    accCard.value[2].desc = dayjs(accInfo.value.last_login).format('YYYY/MM/DD HH:mm:ss');
}

</script>