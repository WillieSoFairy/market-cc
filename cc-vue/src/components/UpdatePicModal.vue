<template>
    <a-modal title="更改文稿信息" v-model:open="openModal" :footer="null" width="70%" :destroyOnClose="true">
        <a-spin :spinning="loading">
            <a-row :gutter="[16, 16]">
                <a-col :xs="{ order: 2, span: 24 }" :lg="{ order: 1, span: 12 }">
                    <a-image :src="pic_details.pic_url" />
                </a-col>
                <a-col :xs="{ order: 1, span: 24 }" :lg="{ order: 2, span: 12 }">
                    <a-form>
                        <a-form-item label="企业名称"><a-input v-model:value="pic_details.ent_name"
                                :disabled="isOrderEntry" /></a-form-item>
                        <a-form-item label="订单日期"><a-date-picker v-model:value="pic_details.order_date" /></a-form-item>
                        <a-form-item label="备注"><a-input v-model:value="pic_details.remark" /></a-form-item>
                        <a-form-item>
                            <a-space>
                                <a-popconfirm title="确认删除？">
                                    <template #icon>
                                        <DeleteOutlined style="color: red" />
                                    </template>
                                    <template #okButton>
                                        <a-button danger size="small" type="primary" @click="handleDel">确认</a-button>
                                    </template>
                                    <a-button danger :disabled="isOrderEntry">删除文稿</a-button>
                                </a-popconfirm>
                                <a-button type="primary">确认更改</a-button>
                            </a-space>
                        </a-form-item>
                    </a-form>
                </a-col>
            </a-row>
        </a-spin>
    </a-modal>
</template>

<script setup>
import { computed, onBeforeUpdate, onUpdated, ref } from 'vue';
import { get_pic_detail, del_draft } from '../components/FormPics';
import { message } from 'ant-design-vue';
import { DeleteOutlined } from '@ant-design/icons-vue'
const openModal = defineModel('open');
const props = defineProps(['picId']);
const pic_details = ref(null);
const loading = ref(false);
onBeforeUpdate(async () => {
    if (openModal.value) {
        await get_details();
    }
});

async function get_details() {
    loading.value = true;
    pic_details.value = reset_details();
    try { pic_details.value = await get_pic_detail(props.picId); }
    catch (err) { message.error("获取详情失败"); }
    finally { loading.value = false; }
}

async function handleDel() {
    loading.value = true;
    const hide = message.loading("删除中...", 0);
    try {
        await del_draft(props.picId, pic_details.value.user);
        hide();
        message.success("删除成功");
    }
    catch {
        hide();
        message.error("删除失败");
    }
    loading.value = false;
    openModal.value = false;
}

function reset_details() {
    return {
        ent_id: null,
        ent_name: null,
        remark: null,
        pic_url: null,
        order_date: null,
        entered_orders: null,
        user: null
    };
}

const isOrderEntry = computed(() => {
    return pic_details.value.entered_orders > 0;
});
</script>