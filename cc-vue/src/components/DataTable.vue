<template>
    <a-table :columns="columns" :data-source="dataSource" bordered>
        <template #bodyCell="{ column, text, record }">
            <template v-if="['name', 'quantity', 'unit', 'dept'].includes(column.dataIndex)">
                <div>
                    <a-input v-if="editableData[record.key]" v-model:value="editableData[record.key][column.dataIndex]"
                        style="margin: -5px 0" />
                    <template v-else>
                        {{ text }}
                    </template>
                </div>
            </template>
            <template v-else-if="column.dataIndex === 'operation'">
                <div class="editable-row-operations">
                    <span v-if="editableData[record.key]">
                        <a-typography-link @click="save(record.key)">保存</a-typography-link>
                        <a @click="cancel(record.key)">取消</a>
                    </span>
                    <span v-else>
                        <a @click="edit(record.key)">修改</a>
                        <a>删除</a>
                    </span>
                </div>
            </template>
        </template>
    </a-table>
</template>
<script setup>
import { cloneDeep } from 'lodash-es';
import { reactive, ref } from 'vue';
const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        width: '25%',
    },
    {
        title: '单位',
        dataIndex: 'unit',
        width: '10%',
    },
    {
        title: '数量',
        dataIndex: 'quantity',
        width: '10%',
    },
    {
        title: '部门',
        dataIndex: 'dept',
        width: '20%',
    },
    {
        title: '操作',
        dataIndex: 'operation',
    },
];
const data = [];
for (let i = 0; i < 100; i++) {
    data.push({
        key: i.toString(),
        name: `生菜 ${i + 1}`,
        unit: 'kg',
        quantity: 1,
        dept: '津津员工'
    });
}
const dataSource = ref(data);
const editableData = reactive({});
const edit = key => {
    editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
};
const save = key => {
    Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]);
    delete editableData[key];
};
const cancel = key => {
    delete editableData[key];
};
</script>
<style scoped>
.editable-row-operations a {
    margin-right: 8px;
}
</style>