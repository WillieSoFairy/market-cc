<template>
    <a-row>
        <a-col :span="24">
            <h1>用户管理</h1>
        </a-col>
    </a-row>
    <a-row>
        <a-col :span="24"><a-button type="primary">新增用户</a-button></a-col>
    </a-row>
    <a-row>
        <a-col :span="24">
            <a-table :columns="columns" :data-source="users_list">
            </a-table>
        </a-col>
    </a-row>
</template>
<script setup>
import { tcb, auth } from '../tcb/index.js'
import { onMounted, ref } from 'vue';

const users_list = ref(null);

onMounted(async () => {
    const { customUserId } = await auth.getCurrenUser();
    await tcb.callFunction({
        name: "admin_get_users_list",
        data: { "customUserId": customUserId }
    }).then((res) => {
        users_list.value = res.result.data.map((x) => { return JSON.parse(x); });
    });
    // console.log(users_list.value)
})

const columns = [
    {
        title: '用户名',
        dataIndex: 'user_name',
        key: 'user_name'
    },
    {
        title: '昵称',
        dataIndex: 'alia'
    },
    {
        title: '创建时间',
        dataIndex: 'create_date'
    },
    {
        title: '用户权限',
        dataIndex: 'auth'
    }
];
const data = ref([
    { "_id": "e6b39ba86623cf5f002826996a0c69c6", "alia": "Wil", "auth": 0, "create_date": { "$date": 1713622824009 }, "enable": true, "last_login": { "$date": 1713622841277 }, "pwd": "123", "user_name": "admin" },
    { "_id": "eb644727665864f3000169990bfcba94", "alia": "Wil_B", "auth": 1, "create_date": { "$date": 1713622824009 }, "enable": true, "last_login": { "$date": 1713622841277 }, "pwd": "123", "user_name": "aaa" }
]);
</script>