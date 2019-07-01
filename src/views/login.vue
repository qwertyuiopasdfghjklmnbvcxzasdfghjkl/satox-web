<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <h2 slot="title" class="title">
                    {{$t('login.welcome')}}
                    <span class="red">{{$t('login.v')}}</span>
                </h2>
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
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>{{$t('login.login')}}</Button>
                        </FormItem>
                    </Form>
                    <p class="sw">
                        {{$t('login.changeLang')}}：<span @click="changeLang()" class="langBtn">中文/English</span>
                    </p>

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
    import extendApi from '../api/extend';

    export default {
        data () {
            return {
                baseUrl: util.baseURL,
                imageT: Date.now(),
                form: {
                    userName: '',
                    password: '',
                },
                rules: {
                    userName: [
                        {required: true, message: '账号不能为空', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'blur'}
                    ]
                },
                lange: null
            };
        },
        watch: {
            imageT () {
                this.form.verifyCode = '';
            }
        },
        created () {
            this.getL();
            this.getList();
        },
        methods: {
            handleSubmit () {
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        userApi.login({
                            username: this.form.userName,
                            password: this.form.password
                        }, (res) => {
                            Cookies.set('username', this.form.userName);
                            Cookies.set('password', hexmd5(this.form.password));
                            Cookies.set('user_id', res.id);
                            Cookies.set('permissions', res.permissions);
                            Cookies.set('Authorization', res.Authorization);
                            Cookies.set('roles', res.roles);
                            this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
                            Cookies.set('access', 0);
                            userApi.getSymbolTypes((res) => {
                                window.localStorage.symbolTypes = JSON.stringify(res);
                            });
                            this.$router.push({name: 'home_index'});
                        }, (error) => {
                            this.imageT = Date.now();
                            this.$Message.error(error);
                            window.console.log(error);
                        });
                    }
                });
            },
            getL () {
                let data = {
                    l: '',
                    m: '5'
                };
                userApi.getLang(data, res => {
                    console.log(res);
                });
            },
            getList () {
                userApi.getLangType((res) => {
                    // this.data1 = res;
                    console.log(res)
                });
            },
            changeLang () {
                if (this.$i18n.locale === 'zh-CN') {
                    this.$i18n.locale = 'en-US';//关键语句
                } else {
                    this.$i18n.locale = 'zh-CN';//关键语句
                }
                window.localStorage['language'] = this.$i18n.locale;
            }
        }
    };
</script>

