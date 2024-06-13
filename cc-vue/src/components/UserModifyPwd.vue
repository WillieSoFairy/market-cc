<template>
    <a-form :label-col="{ style: { width: '6em' } }">
        <a-form-item label="旧密码"><a-input-password v-model:value="pwds.pre_pwd" /></a-form-item>
        <a-form-item label="新密码"><a-input-password v-model:value="pwds.new_pwd" /></a-form-item>
        <a-form-item label="确认新密码"><a-input-password v-model:value="pwds.confirm" /></a-form-item>
        <a-form-item>
            <a-button type="primary" @click="handleSubmit" :loading="loading">确认</a-button>
            <a-button style="margin-left: 10px" @click="closeModel">取消</a-button>
        </a-form-item>
    </a-form>
</template>

<script setup>
import { update_pwd } from "../components/UserAccount.js";
import { ref } from "vue";
import { auth } from '../tcb/index.js';
import { message } from 'ant-design-vue';
import { useRouter } from "vue-router";
const router = useRouter();
const openModal = defineModel();
const props = defineProps(['userId']);
const pwds = ref({
    "pre_pwd": null,
    "new_pwd": null,
    "confirm": null
})

const loading = ref(false);
function closeModel() { openModal.value = false; }
async function handleSubmit() {
    loading.value = true;
    console.log(pwds.value)
    const status = await update_pwd(props.userId, pwds.value);
    loading.value = false;
    console.log(status)
    if (status.code > 0) {
        auth.signOut();
        message.success("密码修改成功，请重新登入");
        router.push({ name: 'Login' });
    }
}
</script>