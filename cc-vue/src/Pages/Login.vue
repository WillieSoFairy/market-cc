<template>
    <a-row>
        <a-col :span="6" :offset="9">
            <h1>请登录</h1>
        </a-col>
    </a-row>
    <a-row>
        <a-col :span="6" :offset="6">
            <a-form :model="formState" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
                autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
                <a-form-item label="用户名" name="username" :rules="[{ required: true, message: '请输入用户名' }]">
                    <a-input v-model:value="formState.username" />
                </a-form-item>

                <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码' }]">
                    <a-input-password v-model:value="formState.password" />
                </a-form-item>

                <!-- <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
                    <a-checkbox v-model:checked="formState.remember">下次自动登入</a-checkbox>
                </a-form-item> -->

                <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                    <a-button type="primary" html-type="submit" @click="login">登入</a-button>
                </a-form-item>
            </a-form>
        </a-col>
    </a-row>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { tcb, auth } from '../tcb/index.js'
import { message } from 'ant-design-vue';

const formState = ref({
    username: '',
    password: '',
    remember: true,
});

const router = useRouter();

async function login() {
    if (formState.value.username === '' || formState.value.password === '') {
        return;
    }
    const loginState = await auth.getLoginState();
    let loginRes;
    if (!loginState) {
        await tcb.callFunction({
            name: "login",
            data: { "user_name": formState.value.username, "pwd": formState.value.password }
        }).then((res) => {
            loginRes = res.result;
        });
        if (loginRes.ticket !== '') {
            await auth.customAuthProvider().signIn(loginRes.ticket);
            message.success("登入成功");
            router.push('/');
        }
        else {
            message.error("用户名或密码错误")
        }
    }
    else {
        router.push('/');
    }
}
</script>