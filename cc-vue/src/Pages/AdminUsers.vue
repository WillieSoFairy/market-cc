<template>
    <a-row>
        <a-col :span="24">
            <a-typography-title :level="2">用户管理</a-typography-title>
            <a-divider />
        </a-col>
    </a-row>
    <a-space direction="vertical" style="width: 100%;" size="large">
        <a-row>
            <a-col :span="24"><a-button type="primary" @click="showNewUserModal">新增用户</a-button></a-col>
        </a-row>
        <a-row>
            <a-col :span="24">
                <a-table :columns="columns" :data-source="users_list" :loading="loading" :pagination="false">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.dataIndex === 'user_name'">
                            {{ record.user_name }}
                            <span v-if="user_id === record._id">
                                <a-divider type="vertical" />
                                <a-tag color="purple">我</a-tag>
                            </span>
                        </template>
                        <template v-if="column.dataIndex === 'create_date'">
                            {{ dayjs(record.create_date).format("YYYY/MM/DD HH:mm:ss") }}
                        </template>
                        <template v-if="column.dataIndex === 'auth'">
                            <span>
                                <a-tag
                                    :color="record.enable === false ? 'gray' : (record.auth === 0 ? 'orange' : 'blue')">
                                    {{ record.auth === 0 ? "管理员" : "普通用户" }}
                                </a-tag>
                            </span>
                        </template>
                        <template v-if="column.key === 'action'">
                            <a-typography-link @click="showModifyUserModal(record)">修改</a-typography-link>
                            <span v-if="user_id !== record._id">
                                <a-divider type="vertical" />
                                <a-popconfirm :title="'删除用户 ' + record.user_name + ' ？'" cancel-text="取消">
                                    <template #okButton><a-button type="primary" danger size="small"
                                            @click="delUser(record)" :loading="deleting">删除</a-button></template>
                                    <a-typography-link type="danger">删除</a-typography-link>
                                </a-popconfirm>
                            </span>
                        </template>
                    </template>
                </a-table>
            </a-col>
        </a-row>
    </a-space>
    <a-modal v-model:open="openModal" :title="(addNewUser ? '新增' : '修改') + '用户'" :destroyOnClose="true" :footer="null">
        <admin-modify-user v-model="openModal" :user-info="userInfo" :is-new-user="addNewUser"
            @modified="get_users_list" />
    </a-modal>
</template>
<script setup>
import { tcb, auth } from '../tcb/index.js';
import { onMounted, ref } from 'vue';
import dayjs from 'dayjs';
import AdminModifyUser from '../components/AdminModifyUser.vue';
import { message } from 'ant-design-vue';

const users_list = ref(null);
const user_id = ref(null)

const loading = ref(false);
async function get_users_list() {
    loading.value = true;
    const auth_current = await auth.getCurrenUser();
    user_id.value = auth_current.customUserId;
    await tcb.callFunction({
        name: "admin_get_users_list",
        data: { "customUserId": user_id.value }
    }).then((res) => {
        users_list.value = res.result.data.map((x) => { return JSON.parse(x); });
    });
    loading.value = false;
}
onMounted(async () => {
    await get_users_list();
})

const columns = [
    {
        title: '用户名',
        dataIndex: 'user_name',
        key: 'user_name',
        width:'15em'
    },
    // {
    //     title: '昵称',
    //     dataIndex: 'alia'
    // },
    {
        title: '创建时间',
        dataIndex: 'create_date',
        width:'15em'
    },
    {
        title: '用户权限',
        dataIndex: 'auth',
        width:'10em'
    },
    {
        title: '操作',
        key: 'action',
        width:'15em'
    },
    {
        title: '描述',
        dataIndex: 'describe'
    }
];

const openModal = ref(false);
const addNewUser = ref(false);
const userInfo = ref(null);
function showNewUserModal() {
    openModal.value = true;
    addNewUser.value = true;
    userInfo.value = null;
};

function showModifyUserModal(rec) {
    openModal.value = true;
    addNewUser.value = false;
    userInfo.value = rec;
}

const deleting = ref(false);
async function delUser(rec) {
    deleting.value = true;
    const { customUserId } = await auth.getCurrenUser();
    const update_userInfo = {
        "user_name": rec.user_name,
        "pwd": rec.pwd,
        "enable": false,
        "auth": rec.auth,
        "describe": rec.describe,
        "create_date": rec.create_date,
        "last_login": rec.last_login,
        "visible": false
    }
    console.log(update_userInfo)
    await tcb.callFunction({
        "name": "admin_update_user",
        "data": {
            "customUserId": customUserId,
            "updateId": rec._id,
            "userInfo": update_userInfo
        }
    }).then((res) => {
        console.log(res);
        get_users_list();
    })
    deleting.value = false;
    message.success("已删除",1.5);
}

</script>