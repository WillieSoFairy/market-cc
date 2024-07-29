<template>
    <a-row>
        <a-col :span="24">
            <a-typography-title :level="2">订单录入</a-typography-title>
            <a-divider />
        </a-col>
    </a-row>
    <a-row>
        <a-col :span="6">
            <a-form>
                <a-form-item label="选择日期">
                    <a-date-picker v-model:value="order_date" format="YYYY/MM/DD" @change="getOrderData" />
                </a-form-item>
            </a-form>
        </a-col>
    </a-row>
    <a-row>
        <h1>{{ pic.pageNum }}/{{ pic.total }}</h1>
    </a-row>
    <a-row>
        <a-col :span="10"><a-image :src="pic.pic_url" width="32vw" /></a-col>
        <a-col :span="14">
            <a-row>
                <a-form>
                    <a-form-item label="单位名称" style="width: 30em;">
                        <a-input-search v-model:value="ent_name" @search="getOrderData">
                            <template #enterButton>
                                <a-button type="primary">
                                    <SearchOutlined v-if="!search_loading" />
                                    <LoadingOutlined v-else />
                                </a-button>
                            </template>
                        </a-input-search>
                    </a-form-item>
                </a-form>
            </a-row>
            <a-space direction="vertical" style="width: 100%;">
                <a-row>
                    <a-col :span="10">
                        <a-button type="primary" @click="handleAddItem" v-if="!isEditing"
                            :disabled="addDisabled">新增项目</a-button>
                        <State2Struct v-model="LLMData" v-else />
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="24">
                        <DataTable v-model:order-data="orderData" v-model:upload-data="LLMData"
                            :loading="search_loading" />
                    </a-col>
                </a-row>
            </a-space>
        </a-col>
    </a-row>
    <a-row style="margin-top: 30px;">
        <a-col :span="12">
            <a-space size="large">
                <a-button @click="handlePreviousPage" :disabled="disabledPrevious">上一页</a-button>
                <a-button type="primary" @click="handleNextPage" :disabled="disabledNext">下一页</a-button>
            </a-space>
        </a-col>
    </a-row>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue';
import dayjs from 'dayjs';
import DataTable from '../components/DataTable.vue';
import { auth } from '../tcb/index.js';
import { get_orderData } from '../components/FormQueryOrder';
import State2Struct from '../components/State2Struct.vue';
import { SearchOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { get_pic } from '../components/FormPics.js'
import { message } from 'ant-design-vue';


const now = dayjs(new Date());
const orderData = ref(null);
const order_date = ref(now);
const ent_name = ref(null);
const LLMData = ref(null);
const pic = ref({
    pic_url: null,
    ent_id: null,
    pageNum: 0,
    total: 0
});
const pageNum = ref(1);

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
    pic.value = await get_pic(order_date.value, 1);
    search_loading.value = false;
}

const isEditing = computed(() => {
    if (orderData.value === null || orderData.value.length === 0) {
        return false;
    }
    else {
        for (let x of orderData.value) {
            if (x.editable === true) {
                LLMData.value.dept_name = x.dept_name;
                LLMData.value.good_name = x.good_name;
                LLMData.value.count = x.count;
                LLMData.value.unit_name = x.unit_name;
                return true;
            }
        }
        return false;
    }
});

const addDisabled = computed(() => {
    if (orderData.value === null) { return true; }
    else { return false; }
});

onMounted(async () => {
    await show_picture(order_date, pageNum);
});

async function show_picture(order_date, pageNum) {
    try { pic.value = await get_pic(order_date.value, pageNum.value) }
    catch (err) {
        if (err === "Pages overflow") {
            message.error("找不到图片");
        }
        throw err;
    }
}
async function handleNextPage() {
    pageNum.value++;
    try { await show_picture(order_date, pageNum); }
    catch { pageNum.value--; }
}

async function handlePreviousPage() {
    pageNum.value--;
    try { await show_picture(order_date, pageNum); }
    catch { pageNum.value++; }
}

const disabledNext = computed(() => { return pic.value.pageNum >= pic.value.total });
const disabledPrevious = computed(() => { return pic.value.pageNum <= 1 });
</script>