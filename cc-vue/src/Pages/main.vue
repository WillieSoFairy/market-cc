<template>
  <a-layout>
    <a-layout-header>
      <a-dropdown>
        <a-avatar size="large" style="color: #f56a00; background-color: #fde3cf">
          {{ avatarFill }}
        </a-avatar>
        <template #overlay>
          <a-menu>
            <a-menu-item><router-link to="/account">账户设置</router-link></a-menu-item>
            <a-menu-item danger @click="logout">退出</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
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
import { get_account_info } from "../components/UserAccount.js";

const router = useRouter();
const accInfo = ref(null);
const alia = ref(null);
const avatarFill = ref(null);

onMounted(async () => {
  const { customUserId } = await auth.getCurrenUser();
  accInfo.value = await get_account_info(customUserId);
  alia.value = accInfo.value.alia;
  avatarFill.value = alia.value[0].toUpperCase();
});

async function logout() {
  await auth.signOut();
  router.push('/login');
}
</script>