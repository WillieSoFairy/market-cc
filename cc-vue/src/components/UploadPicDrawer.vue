<template>
    <a-drawer v-model:open="openDrawer" title="上传文稿" placement="right">
        <template #extra>
            <a-space>
                <a-button type="primary" @click="handleUpload">确认上传</a-button>
            </a-space>
        </template>
        <a-form layout="vertical">
            <a-form-item label="订单日期">
                <a-date-picker placeholder="选择日期" v-model:value="order_date" format="YYYY/MM/DD" />
            </a-form-item>
            <a-form-item label="企业名称">
                <a-input placeholder="非必填" />
            </a-form-item>
            <a-form-item label="上传文稿">
                <a-upload list-type="picture-card" :multiple="true" accept="image/*" v-model:file-list="fileList"
                    @change="handleChange" :beforeUpload="beforeUpload">
                    <div>
                        <plus-outlined />
                        <div style="margin-top: 8px">选择图片</div>
                    </div>
                </a-upload>
            </a-form-item>
        </a-form>
    </a-drawer>
</template>

<script setup>
import { PlusOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue';
import dayjs from 'dayjs';
import { upload_pics } from '../components/FormPics';

const now = dayjs(new Date());
const openDrawer = defineModel();
const order_date = ref(now);
const fileList = ref([])
function handleChange() {
    console.log(fileList.value.name);
}
function beforeUpload(file) {
    fileList.value = [...(fileList.value || []), file];
    return false;
}

async function handleUpload() {
    const pics = [];
    for (const pic of fileList.value) {
        const base64 = await base64_encode(pic.originFileObj);
        pics.push({ pic_str: base64, name: pic.name });
    }
    const status = await upload_pics(pics, order_date.value);
    console.log(status);
}

function base64_encode(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => { resolve(((reader.result).split(','))[1]); }
    });
}
</script>