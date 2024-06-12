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
                                <a-input v-else style="width: 10em;" placeholder="输入新的名称"
                                    v-model:value="accInfo.alia" />
                            </span>
                            <a-divider type="vertical" />
                            <span v-if="!aliaEditing">
                                <a @click="handleEditAlia">
                                    <EditOutlined />
                                </a>
                            </span>
                            <span v-else>
                                <a>
                                    <CheckCircleOutlined style="color:#52c41a" />
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
import { get_account_info } from "../components/UserAccount.js";
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
    accInfo.value = await get_account_info(customUserId);
    avatarFill.value = (accInfo.value.alia)[0].toUpperCase();
    accCard.value[0].desc = accInfo.value.auth === 0 ? "管理员" : "普通用户";
    accCard.value[1].desc = dayjs(accInfo.value.create_date).format('YYYY/MM/DD HH:mm:ss');
    accCard.value[2].desc = dayjs(accInfo.value.last_login).format('YYYY/MM/DD HH:mm:ss');
    cardLoading.value = false;
});

const aliaEditing = ref(false);
function handleEditAlia() {
    aliaEditing.value = true;
}
function handleCancelAlia() {
    aliaEditing.value = false;
}

</script>