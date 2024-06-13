<template>
    <a-menu :items="menuItems" mode="inline" @click="handleClickMenu" v-model:selectedKeys="selected"></a-menu>
</template>

<script setup>
import { computed, onMounted, ref, watch, h } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { HomeOutlined, DiffOutlined, SettingOutlined, EyeOutlined, UsergroupAddOutlined } from '@ant-design/icons-vue';

const menu = [
    {
        label: '首页',
        key: '/',
        adminOnly: false,
        icon: () => h(HomeOutlined)
    },
    {
        label: '订单管理',
        key: '/form',
        adminOnly: false,
        icon: () => h(DiffOutlined)
    },
    {
        key: '/admin/index',
        label: '管理员',
        icon: () => h(SettingOutlined),
        children: [
            {
                label: '概览',
                key: '/admin',
                icon: () => h(EyeOutlined)
            },
            {
                label: '用户管理',
                key: '/admin/users',
                icon: () => h(UsergroupAddOutlined)
            }
        ],
        adminOnly: true
    }
];

const router = useRouter();
const auth = defineModel('auth');

const route = useRoute();
const nowPath = computed(() => { return route.path; });
const selected = ref(null);
onMounted(() => {
    selected.value = [route.path];
});
watch(nowPath, (newx) => { selected.value = [newx]; });

const menuItems = computed(() => {
    return auth.value !== 0 ? menu.filter((item) => { return item.adminOnly === false; }) : menu
});

function handleClickMenu(e) {
    const { keyPath } = e;
    let clickItem = menuItems.value.filter((item) => { return item.key === keyPath[0]; });
    if (keyPath.length > 1) {
        for (const i in keyPath) {
            if (i !== '0') {
                clickItem = (clickItem[0]).children.filter((item) => { return item.key === keyPath[i]; });
            }
        }
    }
    router.push(clickItem[0].key);
}
</script>