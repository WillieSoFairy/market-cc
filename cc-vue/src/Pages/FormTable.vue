<template>
    <a-row><a-form><a-form-item label="选择日期"><a-date-picker /></a-form-item></a-form></a-row>
    <a-row>
        <h1>1/5</h1>
    </a-row>
    <a-row>
        <a-col :span="10"><a-image :src=testImg width="32vw"/></a-col>
        <a-col :span="14">
            <a-form>
                <a-form-item label="单位名称" style="width: 30em;"><a-input /></a-form-item>
            </a-form>
            <DataTable />
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
import DataTable from '../components/DataTable.vue'
import testImg from '../images/1.jpg'
</script>