<template>
    <a-page-header title="文稿管理" class="plain-title" />
    <a-row :gutter="[16, 16]">
        <a-col :xs="24" :xl="7" :xxl="5">
            <a-card title="筛选器" :bordered="false">
                <a-form layout="vertical">
                    <a-form-item label="订单日期">
                        <a-range-picker size="small" :placeholder="['开始日期', '结束日期']" />
                    </a-form-item>
                    <a-form-item label="企业名称">
                        <a-select mode="multiple" placeholder="Please select"
                            :options="[...Array(25)].map((_, i) => ({ value: (i + 10).toString(36) + (i + 1) }))"
                            size="small" />
                    </a-form-item>
                    <a-form-item label="流程进度">
                        <a-select mode="multiple" placeholder="Please select"
                            :options="[...Array(25)].map((_, i) => ({ value: (i + 10).toString(36) + (i + 1) }))"
                            size="small" />
                    </a-form-item>
                </a-form>
                <a-form-item>
                    <a-space>
                        <a-button type="primary" size="small">筛选</a-button>
                        <a-button size="small">还原</a-button>
                    </a-space>
                </a-form-item>
            </a-card>
        </a-col>
        <a-col :xs="24" :xl="17" :xxl="19">
            <a-flex vertical gap="small">
                <a-space>
                    <a-button type="primary" @click="handleDrawerOpen">上传</a-button>
                    <a-button :icon="h(ReloadOutlined)" @click="get_pics_list" />
                    <a-pagination v-model:current="pages.current" :total="pages.total" v-model:pageSize="pages.pageSize"
                        show-size-changer @change="get_pics_list" :showTotal="t => `共${t}项符合条件的文稿`"
                        :pageSizeOptions="['5', '10', '15', '20']" />
                </a-space>
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
            </a-flex>
        </a-col>
    </a-row>
    <upload-pic-drawer v-model:openDrawer="openDrawer" v-model:uploading="uploading" />
    <update-pic-modal v-model:open="openModal" :pic-id="detail_picID" />

</template>
<script setup>
import { h, onMounted, ref, watch } from 'vue';
import UploadPicDrawer from '../components/UploadPicDrawer.vue';
import UpdatePicModal from '../components/UpdatePicModal.vue';
import { query_pic_df } from '../components/FormPics';
import { ReloadOutlined } from '@ant-design/icons-vue';
const openDrawer = ref(false);
const openModal = ref(false);
const draft_df = ref(null);
const pages = ref({
    current: 1,
    total: 0,
    pageSize: 5
});
const loading = ref(false);
onMounted(async () => { await get_pics_list(); });

function handleDrawerOpen() {
    openDrawer.value = true;
}
const uploading = ref(false);
watch(uploading, async (newV, oldV) => { if (oldV === true && newV === false) { await get_pics_list(); } });

async function get_pics_list() {
    loading.value = true;
    const { data, totalNum } = await query_pic_df(pages.value.current, null, [['create_time', 'DESC']], pages.value.pageSize);
    draft_df.value = data;
    pages.value.total = totalNum;
    loading.value = false;
}

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