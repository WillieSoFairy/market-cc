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
                <a-form-item label="订单日期">
                    <a-date-picker v-model:value="order_date" format="YYYY/MM/DD" @change="getOrderData"
                        :disabled-date="disabledDate" :show-today="false" />
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
            <a-space direction="vertical" style="width: 100%;">
                <a-row>
                    <a-form layout="inline">
                        <a-form-item label="单位名称" style="width: 30em;">
                            <a-input v-model:value="pic.ent_name" :disabled="!undefinedEntName"
                                placeholder="指定企业名称" /></a-form-item>
                        <a-form-item v-show="undefinedEntName">
                            <a-button type="primary" @click="handleDefineEnt">确认</a-button>
                        </a-form-item>
                    </a-form>
                </a-row>
                <a-row>
                    <a-col :span="10">
                        <a-button type="primary" @click="handleAddItem" v-if="!isEditing"
                            :disabled="addDisabled || undefinedEntName">新增项目</a-button>
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
import { get_orderData, get_disabled_dates } from '../components/FormQueryOrder';
import State2Struct from '../components/State2Struct.vue';
import { get_pic, bind_ent_pic } from '../components/FormPics.js'
import { message } from 'ant-design-vue';


// const now = dayjs(new Date());
const orderData = ref(null);
const order_date = ref(null);
const undefinedEntName = ref(false);
const LLMData = ref(null);
let disabled_dates_list = [];
const pic = ref({
    ent_name: null,
    pic_id: null,
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
        "ent_id": pic.value.ent_id,
        "pic_id": pic.value.pic_id,
        "user_id": customUserId,
        "editable": true
    });
}

const search_loading = ref(false);
async function getOrderData() {
    search_loading.value = true;
    try {
        disabled_dates_list = await get_disabled_dates();
    }
    catch { message.error("网络错误"); }
    try {
        pic.value = await get_pic(order_date.value, pageNum.value);
        if (pic.value.ent_name === null) { undefinedEntName.value = true; }
        else { undefinedEntName.value = false; }

    }
    catch {
        message.error("找不到图片");
        pic.value = {
            ent_name: null,
            pic_id: null,
            pic_url: null,
            ent_id: null,
            pageNum: 0,
            total: 0
        };
    }
    try { orderData.value = await get_orderData(pic.value.pic_id); }
    catch {
        message.error("加载订单信息失败");
        orderData.value = null;
    }
    search_loading.value = false;
}

async function handleDefineEnt() {
    try {
        await bind_ent_pic(pic.value.ent_name, pic.value.pic_id);
        await getOrderData();
        message.success(`成功匹配企业：${pic.value.ent_name}`);
    }
    catch (err) { message.error(`企业匹配失败`); }
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
    try {
        disabled_dates_list = await get_disabled_dates();
        order_date.value = disabled_dates_list[0];
    }
    catch { message.error("网络错误"); } await getOrderData();
});

async function handleNextPage() {
    pageNum.value++;
    try { await getOrderData(); }
    catch { pageNum.value--; }
}

async function handlePreviousPage() {
    pageNum.value--;
    try { await getOrderData(); }
    catch { pageNum.value++; }
}

function disabledDate(current) {
    return !disabled_dates_list.some((x) => { return x.isSame(current, 'day'); });
}

const disabledNext = computed(() => { return pic.value.pageNum >= pic.value.total });
const disabledPrevious = computed(() => { return pic.value.pageNum <= 1 });
</script>