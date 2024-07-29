<template>
    <a-space direction="vertical" style="width: 100%;">
        <a-row>
            <a-col :span="24"><a-button type="primary" @click="handleDrawerOpen">上传</a-button></a-col>
        </a-row>
        <a-row :gutter="16">
            <a-col :span="3">
                <a-card title="筛选器" :bordered="false">
                    <a-form layout="vertical">
                        <a-form-item label="日期">
                            <a-range-picker size="small" :placeholder="['开始', '结束']" />
                        </a-form-item>
                        <a-form-item label="企业">
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
            <a-col :span="21">
                <a-tabs>
                    <a-tab-pane key="1" tab="按日期归类">Content of Tab Pane 1</a-tab-pane>
                    <a-tab-pane key="2" tab="按企业归类" force-render>Content of Tab Pane 2</a-tab-pane>
                </a-tabs>
            </a-col>
        </a-row>
    </a-space>
    <upload-pic-drawer v-model="openDrawer" />

</template>
<script setup>
import { ref } from 'vue';
import UploadPicDrawer from '../components/UploadPicDrawer.vue';
const openDrawer = ref(false);
function handleDrawerOpen() {
    openDrawer.value = true;
}
const items = ref(['jack', 'lucy']);
</script>