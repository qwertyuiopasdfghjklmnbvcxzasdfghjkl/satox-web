<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <!-- <FormItem prop="verifyCode" class="login-verifyCode">
                            <Input v-model="form.verifyCode">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                                <span slot="append"> -->
                                    <!--
                                    <img width="80" height="40" :src="baseUrl+'api/v1/manage/otc/verifyCode?_t='+imageT" @click="imageT = Date.now()"/>
                                    -->
                                <!-- </span>
                            </Input>
                        </FormItem> -->
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">输入任意用户名和密码即可</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import hexmd5 from '../libs/hex_md5';
import util from '../libs/util';
import userApi from '../api/user';
export default {
    data () {
        return {
            baseUrl: util.baseURL,
            imageT: Date.now(),
            form: {
                userName: '',
                password: '',
                verifyCode: ''
            },
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ],
                verifyCode: [
                    { required: true, message: '验证码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    watch: {
        imageT () {
            this.form.verifyCode = '';
        }
    },
    methods: {
        handleSubmit () {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    userApi.login({
                        // code: this.form.verifyCode,
                        username: this.form.userName,
                        password: this.form.password
                    }, (res) => {
                        Cookies.set('username', this.form.userName);
                        Cookies.set('password', hexmd5(this.form.password));
                        Cookies.set('user_id', res.id);
                        Cookies.set('permissions', res.permissions);
                        Cookies.set('Authorization', res.Authorization);
                        Cookies.set('roles', res.roles)
                        console.log(res.roles)
                        console.log(res.Authorization)
                        this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
                        Cookies.set('access', 0);
                        this.$router.push({name: 'home_index'});
                    }, (error) => {
                        this.imageT = Date.now();
                        this.$Message.error(error);
                        window.console.log(error);
                    });
                }
            });
        }
    }
};
</script>

