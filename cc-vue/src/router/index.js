import { createRouter, createWebHashHistory } from 'vue-router';
import main from '../Pages/main.vue';
import FormTable from '../Pages/FormTable.vue';
import Login from '../Pages/Login.vue';
import SuperAdmin from '../Pages/SuperAdmin.vue';
import AdminUsers from '../Pages/AdminUsers.vue';
import AdminHome from '../Pages/AdminHome.vue';
import Account from '../Pages/Account.vue';
import HomePage from '../Pages/HomePage.vue'
import { auth } from '../tcb/index.js';


const routes = [
    { path: '/login', component: Login, name: 'Login' },
    {
        path: '/',
        component: main,
        children: [
            { path: '', component: HomePage },
            { path: 'form', component: FormTable },
            {
                path: 'admin',
                component: SuperAdmin,
                children: [
                    { path: '', component: AdminHome },
                    { path: 'users', component: AdminUsers, name: 'adminUsers' }
                ]
            },
            { path: 'account', component: Account }
        ]
    }
]
const router = createRouter({
    history: createWebHashHistory(), routes
})

router.beforeEach(async (to, from) => {
    if ((to.name !== 'Login') && (await auth.getLoginState() === null)) {
        return { name: 'Login' };
    }
    else {
        return true;
    }
});

export default router