<template>
    <a-row><a-form><a-form-item label="选择日期"><a-date-picker v-model:value="order_date" format="YYYY/MM/DD"
                    @change="getOrderData" /></a-form-item></a-form></a-row>
    <a-row>
        <h1>1/5</h1>
    </a-row>
    <a-row>
        <a-col :span="10"><a-image :src=testImg width="32vw" /></a-col>
        <a-col :span="14">
            <a-form>
                <a-form-item label="单位名称" style="width: 30em;"><a-input-search v-model:value="ent_name" enter-button
                        @search="getOrderData" :loading="search_loading" /></a-form-item>
            </a-form>
            <a-button type="primary" @click="handleAddItem">新增项目</a-button>
            <DataTable v-model="orderData" />
        </a-col>
    </a-row>
    <a-row style="margin-top: 30px;">
        <a-col :span="12">
            <a-space size="large">
                <a-button>上一页</a-button>
                <a-button type="primary">下一页</a-button>
            </a-space>
        </a-col>
    </a-row>
</template>
<script setup>
import { ref } from 'vue';
import dayjs from 'dayjs';
import DataTable from '../components/DataTable.vue';
import { auth } from '../tcb/index.js';
import testImg from '../images/1.jpg';
import { get_orderData } from '../components/FormQueryOrder';

const now = dayjs(new Date());
const orderData = ref(null);
const order_date = ref(now);
const ent_name = ref(null)

async function handleAddItem() {
    let newKey = null;
    if (orderData.value.length === 0) {
        newKey = 0;
    }
    else if (orderData.value.at(-1).id !== null) {
        newKey = orderData.value.at(-1).key + 1;
    }
    else { return; }
    const { customUserId } = await auth.getCurrenUser();
    orderData.value.push({
        "key": newKey,
        "id": null,
        "ent_name": ent_name.value,
        "user_id": customUserId,
        "order_date": order_date.value,
        "editable": true
    });
}

const search_loading = ref(false);
async function getOrderData() {
    search_loading.value = true;
    orderData.value = await get_orderData(order_date.value, ent_name.value);
    search_loading.value = false;
}
</script>