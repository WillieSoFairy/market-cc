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
        <a-col :span="24"><a-table :columns="columns" :data-source="data">
                <template #headerCell="{ column }">
                    <template v-if="column.key === 'name'">
                        <span>
                            <smile-outlined />
                            用户名
                        </span>
                    </template>
                </template>

                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'name'">
                        <a>
                            {{ record.name }}
                        </a>
                    </template>
                    <template v-else-if="column.key === 'tags'">
                        <span>
                            <a-tag v-for="tag in record.tags" :key="tag"
                                :color="tag === '管理员' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'">
                                {{ tag.toUpperCase() }}
                            </a-tag>
                        </span>
                    </template>
                    <template v-else-if="column.key === 'action'">
                        <span>
                            <a>Invite 一 {{ record.name }}</a>
                            <a-divider type="vertical" />
                            <a>Delete</a>
                            <a-divider type="vertical" />
                            <a class="ant-dropdown-link">
                                More actions
                                <down-outlined />
                            </a>
                        </span>
                    </template>
                </template>
            </a-table></a-col>
    </a-row>
</template>
<script setup>
const columns = [
    {
        name: '用户名',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '有效',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: '创建时间',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: '用户权限',
        key: 'tags',
        dataIndex: 'tags',
    },
    {
        title: '操作',
        key: 'action',
    },
];
const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['管理员'],
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
    },
];
</script>