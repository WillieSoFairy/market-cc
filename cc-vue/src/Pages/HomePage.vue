<template>
    <a-row>
        <a-col :span="20" :offset="2"><a-typography-title :level="2">Welcome {{ userAlia }}!</a-typography-title></a-col>
    </a-row>
    <a-row>
        <a-col :span="22"><a-skeleton active :paragraph="{ rows: 6 }" /></a-col>
    </a-row>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { get_account_info } from '../components/UserAccount.js';
import { auth } from '../tcb/index.js'

const userAlia = ref(null);
onMounted(async () => {
    const { customUserId } = await auth.getCurrenUser();
    const { alia } = await get_account_info(customUserId);
    userAlia.value = alia;
});
</script>