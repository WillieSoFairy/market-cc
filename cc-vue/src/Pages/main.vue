<template>
  <a-layout>
    <a-layout-header>Header
      <a-button type="primary" @click="logout">登出</a-button>
    </a-layout-header>
    <a-layout>
      <a-layout-sider width="220" style="background-color: #fff">
        <a-menu></a-menu>
      </a-layout-sider>
      <a-layout-content :style="{ padding: '24px', minHeight: '600px' }">
        <h3>Welcome {{ alia }}</h3>
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
    <a-layout-footer>Footer</a-layout-footer>
  </a-layout>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { auth } from '../tcb/index.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const alia = ref(null);

onMounted(async () => {
  const user = await auth.getCurrenUser();
  alia.value = user.customUserId;
});

async function logout() {
  await auth.signOut();
  router.push('/login');
}
</script>