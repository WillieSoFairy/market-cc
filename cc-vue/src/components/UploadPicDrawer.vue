<template>
    <a-drawer v-model:open="openDrawer" title="上传文稿" placement="right" :destroyOnClose="true" size="large">
        <template #extra>
            <a-button type="primary" @click="handleUpload" :loading="uploading" v-show="!showResult"
                :disabled="disabledUpload">确认上传</a-button>
            <a-button type="link" v-show="showResult" @click="() => { showResult = false }">继续上传</a-button>
        </template>
        <a-row v-if="!showResult">
            <a-col :span="20">
                <a-spin :spinning="uploading" tip="正在上传...">
                    <a-form layout="vertical">
                        <a-form-item label="订单日期">
                            <a-date-picker placeholder="选择日期" v-model:value="uploadForm.order_date"
                                format="YYYY/MM/DD" />
                        </a-form-item>
                        <a-form-item label="企业名称">
                            <a-input placeholder="非必填" />
                        </a-form-item>
                        <a-form-item label="上传文稿">
                            <a-upload list-type="picture-card" :multiple="true" accept="image/*"
                                v-model:file-list="uploadForm.fileList" :beforeUpload="beforeUpload">
                                <div>
                                    <plus-outlined />
                                    <div style="margin-top: 8px">选择图片</div>
                                </div>
                            </a-upload>
                        </a-form-item>
                    </a-form>
                </a-spin>
            </a-col>
        </a-row>

        <a-row v-else>
            <a-table :columns="columns" :data-source="uploadResult" :pagination="false" :bordered="false"
                class="result-table">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'status'">
                        <a-tag :color="record.status === '成功' ? 'green' : 'volcano'">{{ record.status }}</a-tag>
                    </template>
                </template>
            </a-table>
        </a-row>
    </a-drawer>
</template>

<script setup>
import { PlusOutlined } from '@ant-design/icons-vue'
import { computed, ref } from 'vue';
import dayjs from 'dayjs';
import { upload_pics } from '../components/FormPics';

const now = dayjs(new Date());
const openDrawer = defineModel();
const uploading = ref(false);
const showResult = ref(false);
const uploadResult = ref(null);

const uploadForm = ref({
    order_date: now,
    fileList: []
});
const disabledUpload = computed(() => { return uploadForm.value.fileList.length === 0; });

const columns = [
    { title: '文件名', dataIndex: 'name' },
    { title: '状态', dataIndex: 'status', key: 'status' },
    { title: '信息', dataIndex: 'info' }
]

function beforeUpload(file) {
    uploadForm.fileList.value = [...(uploadForm.value.fileList || []), file];
    return false;
}

async function handleUpload() {
    uploading.value = true;
    const pics = [];
    for (const pic of uploadForm.value.fileList) {
        const base64 = await base64_encode(pic.originFileObj);
        pics.push({ pic_str: base64, name: pic.name });
    }
    const status = await upload_pics(pics, uploadForm.value.order_date);
    uploading.value = false;
    uploadResult.value = get_status_df(status).data;
    showResult.value = true;
    uploadForm.value = {
        order_date: now,
        fileList: []
    }
    console.log(uploadResult.value)
}

function base64_encode(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => { resolve(((reader.result).split(','))[1]); }
    });
}

function get_status_df(status) {
    const status_df = { data: [], total: status.total };
    for (const success of status.success) {
        status_df.data.push({ name: success, status: '成功', info: null });
    }
    for (const fail of status.fail) {
        let info = null;
        if (fail.error === "Not normal pic format") { info = "文件格式不符合"; }
        else { info = "网络错误"; }
        status_df.data.push({ name: fail.file, status: '失败', info: info });
    }
    return status_df;
}
</script>

<style scoped>
.result-table {
    width: 100%;
}
</style>