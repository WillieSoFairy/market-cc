<template>
    <a-table :columns="columns" :data-source="orderData" bordered :pagination="false" :loading="props.loading">
        <template #bodyCell="{ column, text, record }">
            <template v-if="column.dataIndex === 'good_name'">
                <template v-if="record.editable === false">{{ text }}</template>
                <a-input v-else v-model:value="uploadData.good_name" />
            </template>
            <template v-if="column.dataIndex === 'count'">
                <template v-if="record.editable === false">{{ text }}</template>
                <a-input-number v-else v-model:value="uploadData.count" />
            </template>
            <template v-if="column.dataIndex === 'unit_name'">
                <template v-if="record.editable === false">{{ text }}</template>
                <a-input v-else v-model:value="uploadData.unit_name" />
            </template>
            <template v-if="column.dataIndex === 'dept_name'">
                <template v-if="record.editable === false">{{ text }}</template>
                <a-input v-else v-model:value="uploadData.dept_name" />
            </template>
            <template v-if="column.key === 'operation'">
                <span v-if="record.editable === false">
                    <a-typography-link @click="handleEdit(record.key)" :disabled="isEditing">修改</a-typography-link>
                    <a-divider type="vertical" />
                    <a-typography-link type="danger" @click="showDeleteConfirm(record.id)"
                        :disabled="isEditing">删除</a-typography-link>
                </span>
                <span v-else>
                    <a-typography-link type="success" v-if="record.id === null"
                        @click="handleInsert(record.key)">保存</a-typography-link>
                    <a-typography-link type="success" v-else @click="handleUpdate(record.key)">保存</a-typography-link>
                    <a-divider type="vertical" />
                    <a-typography-link @click="handleCancel(record.key)">取消</a-typography-link>
                </span>
            </template>
        </template>
    </a-table>
</template>
<script setup>
import { computed, ref } from 'vue';
import { auth } from '../tcb/index.js';
import { get_orderData, add_orderData, del_orderData, update_orderData } from '../components/FormQueryOrder';
import { Modal, message } from 'ant-design-vue';

const props = defineProps(['loading'])
const orderData = defineModel('orderData');
const columns = [
    {
        title: '名称',
        dataIndex: 'good_name',
        width: '25%',
    },
    {
        title: '数量',
        dataIndex: 'count',
        width: '14%'
    },
    {
        title: '单位',
        dataIndex: 'unit_name',
        width: '10%',
    },
    {
        title: '部门',
        dataIndex: 'dept_name',
        width: '20%',
    },
    {
        title: '操作',
        key: 'operation',
    },
];

const uploadData = defineModel('uploadData');
uploadData.value = resetInput();

async function handleInsert(key) {
    const hide = message.loading('更新中...', 0);
    const keyItem = { ...orderData.value[key] };
    uploadData.value.ent_name = keyItem.ent_name;
    uploadData.value.user_id = keyItem.user_id;
    uploadData.value.order_date = keyItem.order_date;

    await add_orderData(uploadData.value);
    orderData.value = await get_orderData(keyItem.order_date, keyItem.ent_name);
    hide();
    message.success('添加成功', 1.5);

    uploadData.value = resetInput();
}

function handleCancel(key) {
    if (orderData.value[key].id === null) {
        orderData.value.pop();
    }
    else {
        orderData.value[key].editable = false;
    }
    uploadData.value = resetInput();
}

async function handleUpdate(key) {
    const hide = message.loading('更新中...', 0);
    const { customUserId } = await auth.getCurrenUser();
    const updateRow = orderData.value[key];
    const updateData = {
        "id": updateRow.id,
        "dept_name": uploadData.value.dept_name,
        "good_name": uploadData.value.good_name,
        "unit_name": uploadData.value.unit_name,
        "count": uploadData.value.count,
        "user_id": customUserId
    }
    const status = await update_orderData(updateData);
    updateRow.editable = false;
    orderData.value = await get_orderData(updateRow.order_date, updateRow.ent_name);
    hide();
    if (status === 1) { message.success('更新成功', 1.5); }
    else { message.error('更新失败', 1.5); }
}

function handleEdit(key) {
    const keyItem = { ...orderData.value[key] };
    uploadData.value = {
        "dept_name": keyItem.dept_name,
        "good_name": keyItem.good_name,
        "unit_name": keyItem.unit_name,
        "count": keyItem.count,
    };
    orderData.value[key].editable = true;
}

const deleting = ref(false);
async function handleDel(order_id) {
    deleting.value = true;
    const keyItem = { ...orderData.value[0] };
    const result = await del_orderData(order_id);
    if (result) { message.success("删除成功"); }
    else { message.error("删除失败"); }
    orderData.value = await get_orderData(keyItem.order_date, keyItem.ent_name);
    deleting.value = false;
}

function showDeleteConfirm(id) {
    Modal.confirm({
        title: '确认删除这一项？',
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
            handleDel(id);
        },
        onCancel() {
            console.log('Cancel');
        },
    });
}

function resetInput() {
    return {
        "ent_name": null,
        "dept_name": null,
        "good_name": null,
        "unit_name": null,
        "count": null,
        "user_id": null,
        "order_date": null
    };
}

const isEditing = computed(() => {
    if (orderData.value === null || orderData.value.length === 0) {
        return false;
    }
    else {
        for (let x of orderData.value) {
            if (x.editable === true) { return true; }
        }
        return false;
    }
});

</script>


<style scoped>
.editable-row-operations a {
    margin-right: 8px;
}
</style>