<template>
    <a-modal title="文稿详情" v-model:open="openModal" :footer="null" width="70%" :destroyOnClose="true">
        <a-spin :spinning="loading">
            <a-row :gutter="[16, 16]">
                <a-col :xs="{ order: 2, span: 24 }" :lg="{ order: 1, span: 12 }">
                    <a-image :src="pic_details.pic_url" />
                </a-col>
                <a-col :xs="{ order: 1, span: 24 }" :lg="{ order: 2, span: 12 }">
                    <a-form>
                        <a-form-item label="企业名称">
                            <a-tooltip :title="disabledTip" placement="topLeft">
                                <a-select v-model:value="edit_details.ent_name" :options="ents_list"
                                    :disabled="isOrderEntry" show-search>
                                    <template #dropdownRender="{ menuNode: menu }">
                                        <v-nodes :vnodes="menu" />
                                        <a-divider style="margin: 4px 0" />
                                        <a-space style="padding: 4px 8px">
                                            <a-input v-model:value="newEnt" placeholder="新增企业" ref="inputRef"
                                                @pressEnter="add_ent" />
                                            <a-button type="text" @click="add_ent">
                                                <template #icon><plus-outlined /></template>
                                                添加
                                            </a-button>
                                        </a-space>
                                    </template>
                                </a-select>
                            </a-tooltip>
                        </a-form-item>
                        <a-form-item label="订单日期">
                            <a-date-picker v-model:value="edit_details.order_date" />
                        </a-form-item>
                        <a-form-item label="备注"><a-textarea v-model:value="edit_details.remark" /></a-form-item>
                        <a-form-item label="已录入订单">{{ pic_details.entered_orders }}</a-form-item>
                        <a-form-item>
                            <a-space>
                                <a-popconfirm title="确认删除？" :disabled="isOrderEntry" v-model:open="pop_open">
                                    <template #icon>
                                        <DeleteOutlined style="color: red" />
                                    </template>
                                    <template #okButton>
                                        <a-button danger size="small" type="primary" @click="handleDel">确认</a-button>
                                    </template>
                                    <a-tooltip :title="disabledTip">
                                        <a-button danger :disabled="isOrderEntry">删除文稿</a-button>
                                    </a-tooltip>
                                </a-popconfirm>
                                <a-button type="primary" :disabled="!isEdited" @click="handleModify">确认更改</a-button>
                            </a-space>
                        </a-form-item>
                    </a-form>
                </a-col>
            </a-row>
        </a-spin>
    </a-modal>
</template>

<script setup>
import { computed, defineComponent, ref, watch } from 'vue';
import { get_pic_detail, del_draft, bind_ent_pic, update_pic_info } from '../components/FormPics';
import { message } from 'ant-design-vue';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue'
const openModal = defineModel('open');
const props = defineProps(['picId', 'ents']);
const emits = defineEmits(['submit']);
const pic_details = ref(null);
const edit_details = ref(null);
const loading = ref(false);
const ents_list = ref([]);

watch(openModal, async (newV, oldV) => {
    if (newV === true && oldV === false) {
        await get_details();
        ents_list.value = props.ents.map((x) => {
            return {
                key: props.ents.indexOf(x),
                value: x.label
            };
        });
    }
})

async function get_details() {
    loading.value = true;
    pic_details.value = reset_details();
    edit_details.value = reset_details();
    try {
        pic_details.value = await get_pic_detail(props.picId);
        if (pic_details.value.remark == null) {
            pic_details.value.remark = '';
        }
        edit_details.value = { ...pic_details.value };
    }
    catch (err) { message.error("获取详情失败"); }
    finally { loading.value = false; }
}

const pop_open = ref(false);
async function handleDel() {
    pop_open.value = false;
    loading.value = true;
    const hide = message.loading("删除中...", 0);
    try {
        await del_draft(props.picId, pic_details.value.user);
        hide(); message.success("删除成功");
    }
    catch { hide(); message.error("删除失败"); }
    loading.value = false;
    emits('submit');
    openModal.value = false;
}

async function handleModify() {
    loading.value = true;
    const hide = message.loading("更新中...", 0);
    try {
        if (entName_edited.value) {
            await bind_ent_pic(edit_details.value.ent_name, pic_details.value.pic_id);
        }
        if (remark_edited.value || orderDate_edited.value) {
            const param = {};
            if (remark_edited.value) { param.reamrk = edit_details.value.remark; }
            if (orderDate_edited.value) { param.order_date = edit_details.value.order_date; }
            await update_pic_info(pic_details.value.pic_id, param);
        }
        hide(); message.success("修改成功");
    }
    catch { hide(); message.error("修改失败"); }
    loading.value = false;
    emits('submit');
    openModal.value = false;
}

const VNodes = defineComponent({
    props: { vnodes: { type: Object, required: true } },
    render() { return this.vnodes; }
});
const newEnt = ref('');
const inputRef = ref();
async function add_ent() {
    if (newEnt.value !== '') {
        if (ents_list.value.length !== 0) {
            ents_list.value.push({ value: newEnt.value, key: ents_list.value[ents_list.value.length - 1].key });
        }
        else {
            ents_list.value.push({ value: newEnt.value, key: 0 })
        }
        newEnt.value = '';
        await inputRef.value?.focus();
    }
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

const disabledTip = computed(() => {
    if (isOrderEntry.value) { return "已有订单录入，无法操作"; }
    else { return null; }
});

const isEdited = computed(() => { return orderDate_edited.value || remark_edited.value || entName_edited.value; });
const orderDate_edited = computed(() => {
    try {
        if (!edit_details.value.order_date.isSame(pic_details.value.order_date)) {
            return true;
        }
        return false;
    }
    catch { return false; }
});
const remark_edited = computed(() => {
    try {
        if (edit_details.value.remark !== pic_details.value.remark) {
            return true;
        }
        return false;
    }
    catch { return false; }
});
const entName_edited = computed(() => {
    try {
        if (edit_details.value.ent_name !== pic_details.value.ent_name) {
            return true;
        }
        return false;
    }
    catch { return false; }
});
</script>