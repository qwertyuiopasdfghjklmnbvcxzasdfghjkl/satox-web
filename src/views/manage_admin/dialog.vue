<template>
    <Card style="width:440px">
        <p slot="title">
            {{vm.$t('admin.tjgly')}}
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Form ref="formItem" :model="formItem" :rules="ruleInline" :label-width="80" style="margin:0 20px;">
            <FormItem :label="vm.$t('common.xm')" prop="userRealName">
                <Input v-model="formItem.userRealName" name="userRealName"></Input>
            </FormItem>
            <FormItem :label="vm.$t('common.zh')" prop="username">
                <Input v-model="formItem.username" name="username"></Input>
            </FormItem>
            <FormItem :label="vm.$t('admin.mm')" prop="password">
                <Input type="password" v-model="formItem.password" name="password"></Input>
            </FormItem>
            <FormItem :label="vm.$t('admin.qrmm')" prop="passwordAgain">
                <Input type="password" v-model="formItem.passwordAgain" name="passwordAgain"></Input>
            </FormItem>
            <FormItem :label="vm.$t('admin.qxlx')" prop="type">
                <Select v-model="model12" filterable multiple>
                    <Option v-for="item in cityList" :value="item.roleId" :key="item.roleId">{{ item.roleNameCn }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem>
                <Button type="primary" style="width:150px" @click="addUsername()">{{vm.$t('common.tj')}}</Button>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
    import author from '../../api/author';

    export default {
        props: ['id'],
        data () {
            const passwordCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error(vm.$t('common.qsr')+vm.$t('admin.mm')));
                } else {
                    if (this.formItem.passwordAgain !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.formItem.validateField('passwordAgain');
                    }
                    callback();
                }
            };
            const passwordAgainCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error(vm.$t('admin.qzcsrmm')));
                } else if (value !== this.formItem.password) {
                    callback(new Error(vm.$t('admin.mmbyz')));
                } else {
                    callback();
                }
            };
            const vm = window.vm;
            return {
                vm: vm,
                cityList: [],
                model12: [],
                formItem: {
                    userRealName: '',
                    username: '',
                    password: '',
                    passwordAgain: '',
                    status: 1,
                    roleList: []
                },
                ruleInline: {
                    userRealName: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('common.xm'), trigger: 'blur'}
                    ],
                    username: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('common.zh'), trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('admin.mm'), trigger: 'blur'},
                        {validator: passwordCheck, trigger: 'blur'}
                    ],
                    passwordAgain: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('admin.qrmm'), trigger: 'blur'},
                        {validator: passwordAgainCheck, trigger: 'blur'},
                    ],
                    model12: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('admin.qxlx'), trigger: 'blur'}
                    ]
                }
            };
        },
        created () {
            this.role();
        },
        methods: {
            role () {
                author.findAllRoleList({}, (res) => {
                    this.cityList = res;
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            closeDialog () {
                this.$emit('removeDialog');
            },
            addUsername () {
                this.$refs.formItem.validate((valid) => {
                    if (valid) {
                        let a = ',' + this.model12.join(',') + ',';
                        let roleList = [];
                        this.cityList.forEach((item) => {
                            if (a.indexOf(',' + item.roleId + ',') !== -1) {
                                roleList.push(item);
                            }
                        });
                        this.formItem.roleList = roleList;
                        author.addUser(this.formItem, (res) => {
                            this.$Message.success({content: this.vm.$t('common.tjcg')});
                            this.$emit('okCallback');
                            this.$emit('removeDialog');
                        }, (msg) => {
                            this.$Message.error({content: msg});
                        });
                    }
                });
            }
        }
    };
</script>

<style>

</style>
