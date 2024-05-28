<template>
    <a-layout>
      <a-layout-header>Header</a-layout-header>
      <a-layout>
        <a-layout-sider width="220" style="background-color: #fff">
          <a-menu></a-menu>
        </a-layout-sider>
        <a-layout-content :style="{ padding: '24px', minHeight: '600px' }">
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
      <a-layout-footer>Footer</a-layout-footer>
    </a-layout>
  </template>
  
  <script setup>
  </script>