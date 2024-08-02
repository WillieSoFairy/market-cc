// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import App from './App.vue'
import router from './router/index.js'
import 'ant-design-vue/dist/reset.css'
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

const app = createApp(App)

app.use(router)
app.use(createPinia())
app.use(Antd)
app.config.globalProperties.$dayjs = dayjs

app.mount('#app')
