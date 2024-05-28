import { createRouter, createWebHashHistory } from 'vue-router'
import main from '../Pages/main.vue'
import FormTable from '../Pages/FormTable.vue'
import Login from '../Pages/Login.vue'
import SuperAdmin from '../Pages/SuperAdmin.vue'
import AdminUsers from '../Pages/AdminUsers.vue'
import AdminHome from '../Pages/AdminHome.vue'


const routes = [
    { path: '/', component: Login },
    {
        path: '/index',
        component: main,
        children: [
            { path: 'form', component: FormTable },
            {
                path: 'admin',
                component: SuperAdmin,
                children: [
                    { path: '', component: AdminHome },
                    { path: 'users', component: AdminUsers }
                ]
            },
        ]
    }
]
const router = createRouter({
    history: createWebHashHistory(), routes
})
export default router