<template>
    <a-page-header title="文稿管理" class="plain-title" />
    <a-row :gutter="[16, 16]">
        <a-col :xs="24" :xl="7" :xxl="5">
            <a-card title="筛选器" :bordered="false">
                <a-form layout="vertical">
                    <a-form-item label="订单日期">
                        <a-range-picker size="small" v-model:value="filters.order_date"
                            :placeholder="['开始日期', '结束日期']" />
                    </a-form-item>
                    <a-form-item label="企业名称">
                        <a-select mode="multiple" :options="filter_ents_options" size="small"
                            :filter-option="filter_options" :allowClear="true" v-model:value="filters.ent_id" />
                    </a-form-item>
                    <a-form-item label="流程进度">
                        <a-select mode="multiple" :options="filter_flow" size="small" :allowClear="true"
                            v-model:value="filters.flow" />
                    </a-form-item>
                </a-form>
                <a-form-item>
                    <a-space>
                        <a-button type="primary" size="small" @click="handleFilter">筛选</a-button>
                        <a-button size="small" @click="handleResetFilter">还原</a-button>
                    </a-space>
                </a-form-item>
            </a-card>
        </a-col>
        <a-col :xs="24" :xl="17" :xxl="19">
            <a-row :gutter="[16, 16]" justify="space-between">
                <a-col :xs="24" :md="4" :xxl="3">
                    <a-space>
                        <a-button type="primary" @click="handleDrawerOpen">上传</a-button>
                        <a-button :icon="h(ReloadOutlined)" @click="get_pics_list" />
                    </a-space>
                </a-col>
                <a-col flex="auto">
                    <a-pagination v-model:current="pages.current" :total="pages.total" v-model:pageSize="pages.pageSize"
                        show-size-changer @change="get_pics_list" :showTotal="t => `共${t}项符合条件的文稿`"
                        :pageSizeOptions="['5', '10', '15', '20']" />
                </a-col>
                <a-col :xs="24">
                    <a-table :dataSource="draft_df" :columns="columns" :pagination="false" :loading="loading">
                        <template #bodyCell="{ column, text, record }">
                            <template v-if="column.key === 'thumb'">
                                <a @click="handlePicClick(record.id)">
                                    <a-image :src="text" :preview="false" width="100px" />
                                </a>
                            </template>
                            <template v-if="column.key === 'ent_name'">
                                <span v-if="text !== null">{{ text }}</span>
                                <span v-else class="undefined-ent">未指定</span>
                            </template>
                            <template v-if="column.key === 'create_time'">
                                {{ $dayjs(text).format('YYYY-MM-DD HH:mm:ss') }}
                            </template>
                        </template>
                    </a-table>
                </a-col>
            </a-row>
        </a-col>
    </a-row>
    <upload-pic-drawer v-model:openDrawer="openDrawer" v-model:uploading="uploading" />
    <update-pic-modal v-model:open="openModal" :pic-id="detail_picID" @submit="handleModalSubmitted"
        :ents="filter_ents_options" />

</template>
<script setup>
import { h, onMounted, ref, watch } from 'vue';
import UploadPicDrawer from '../components/UploadPicDrawer.vue';
import UpdatePicModal from '../components/UpdatePicModal.vue';
import { filter_get_ent, query_pic_df } from '../components/FormPics';
import { ReloadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
const openDrawer = ref(false);
const openModal = ref(false);
const draft_df = ref(null);
const pages = ref({
    current: 1,
    total: 0,
    pageSize: 5
});
const loading = ref(false);

const filter_ents_options = ref(null);
const filter_flow = ref([
    { value: 0, label: '未标记' },
    { value: 1, label: '已标记' },
    { value: 2, label: '录入中' }]);
function filter_options(input, option) {
    return option.label.indexOf(input) >= 0;
}
const filters = ref({
    order_date: [],
    ent_id: [],
    flow: []
});
async function handleFilter() {
    pages.value.current = 1;
    await get_pics_list();
}

async function handleResetFilter() {
    filters.value = {
        order_date: [],
        ent_id: [], flow: []
    }
    pages.value.current = 1;
    await get_pics_list();
}

onMounted(async () => { await get_pics_list(); });

function handleDrawerOpen() {
    openDrawer.value = true;
}
const uploading = ref(false);
watch(uploading, async (newV, oldV) => { if (oldV === true && newV === false) { await get_pics_list(); } });

async function get_pics_list() {
    loading.value = true;
    const where = {
        order_date: filters.value.order_date?.map((x) => { return x.format("YYYY-MM-DD"); }),
        ent_id: JSON.parse(JSON.stringify(filters.value.ent_id)),
        flow: JSON.parse(JSON.stringify(filters.value.flow))
    }
    try {
        const { data, totalNum } = await query_pic_df(pages.value.current, where, [['create_time', 'DESC']], pages.value.pageSize);
        filter_ents_options.value = await filter_get_ent();
        draft_df.value = data;
        pages.value.total = totalNum;
    }
    catch { message.error("获取文稿失败"); }
    loading.value = false;
}

async function handleModalSubmitted() { await get_pics_list(); }

const detail_picID = ref(0);
function handlePicClick(pic_id) {
    openModal.value = true;
    detail_picID.value = pic_id;
}

const columns = [
    { key: 'thumb', dataIndex: 'thumb', width: '100px' },
    { key: 'ent_name', dataIndex: 'ent_name', title: '企业名称' },
    { key: 'order_date', dataIndex: 'order_date', title: '订单日期' },
    { key: 'create_time', dataIndex: 'create_time', title: '上传时间' }
]
</script>

<style scoped>
.undefined-ent {
    font-style: italic;
    color: gray;
}

.plain-title {
    padding-top: 0;
    padding-left: 0;
    padding-bottom: 0;
    margin-bottom: 20px;
    border-bottom: 1px solid rgb(235, 237, 240);
}
</style>