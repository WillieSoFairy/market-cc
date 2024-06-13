<template>
    <a-row>
        <a-col :span="24">
            <a-typography-title :level="2">管理员后台</a-typography-title>
            <a-divider />
        </a-col>
    </a-row>
    <a-space direction="vertical" style="width: 100%;" size="large">
        <a-row :gutter="32">
            <a-col :span="6">
                <a-card class="card" title="用户量" :bordered="false">
                    <a-statistic :value="2" style="margin: auto 0;"/>
                </a-card>
            </a-col>
            <a-col :span="6">
                <a-card class="card" title="订单量" :bordered="false">
                    <a-skeleton active />
                </a-card>
            </a-col>
            <a-col :span="6">
                <a-card class="card" title="在线人数" :bordered="false">
                    <a-skeleton active />
                </a-card>
            </a-col>
        </a-row>
        <a-row :gutter="32">
            <a-col :span="6">
                <a-card class="card" title="待办工单" :bordered="false">
                    <a-skeleton active />
                </a-card>
            </a-col>
            <a-col :span="12">
                <a-card class="card" title="近7日访问" :bordered="false">
                    <a-skeleton active />
                </a-card>
            </a-col>
        </a-row>
    </a-space>
</template>
<style scoped>
.card {
    height: 250px;
}
</style>