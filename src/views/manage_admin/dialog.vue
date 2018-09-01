<template>
    <Card style="width:440px">
        <p slot="title">
            添加管理员
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Form ref="formItem" :model="formItem" :rules="ruleInline" :label-width="80" style="margin:0 20px;">
            <FormItem label="姓名" prop="userRealName">
                <Input v-model="formItem.userRealName" name="userRealName"></Input>
            </FormItem>
            <FormItem label="账号" prop="username">
                <Input v-model="formItem.username" name="username"></Input>
            </FormItem>
            <FormItem label="密码" prop="password">
                <Input type="password" v-model="formItem.password" name="password"></Input>
            </FormItem>
            <FormItem label="确认密码" prop="passwordAgain">
                <Input type="password" v-model="formItem.passwordAgain" name="passwordAgain"></Input>
            </FormItem>
            <FormItem label="权限类型" prop="type">
                <Select v-model="model12" filterable multiple>
                    <Option v-for="item in cityList" :value="item.roleId" :key="item.roleId">{{ item.roleNameCn }}</Option>
            </Select>
            </FormItem>
            <FormItem>
                <Button type="primary" style="width:150px" @click="addUsername()">创建</Button>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
import author from '../../api/author'
export default {
    props: ['id'],
    data () {
        const passwordCheck = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.formItem.passwordAgain !== '') {
                    // 对第二个密码框单独验证
                    this.$refs.formItem.validateField('passwordAgain');
                }
                callback();
            }
        }
        const passwordAgainCheck = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.formItem.password) {
                callback(new Error('密码不一致'));
            } else {
                callback();
            }
        }
        return {
            cityList: [],
            model12: [],
            formItem:{
                userRealName: '',
                username: '',
                password: '',
                passwordAgain: '',
                status: 1,
                roleList: []
            },
            ruleInline: {
                userRealName: [
                { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                username: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    {validator: passwordCheck, trigger: 'blur' }
                ],
                passwordAgain: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    {validator: passwordAgainCheck, trigger: 'blur' },
                ],
                model12: [
                    { required: true, message: '请输入权限类型', trigger: 'blur' }
                ]
            }
        }
    },
    created () {
        this.role()
    },
    methods: {
        role () {
          author.findAllRoleList({}, (res) => {
            this.cityList = res
          }, (msg) => {
            this.$Message.error({content: msg})
          })
        },
        closeDialog () {
            this.$emit('removeDialog');
        },
        addUsername() {
            this.$refs.formItem.validate((valid) => {
                if (valid) {
                    let a = ',' + this.model12.join(',') + ','
                    let roleList = []
                    this.cityList.forEach((item) => {
                        if (a.indexOf(','+item.roleId+',') !== -1) {
                            roleList.push(item)
                        }
                    })
                    this.formItem.roleList = roleList
                    author.addUser(this.formItem, (res) => {
                        this.$Message.success({content: '添加成功'})
                        this.$emit('okCallback')
                        this.$emit('removeDialog');
                    }, (msg) => {
                        this.$Message.error({content: msg})
                    })
                }
            })        
        }
    }
}
</script>

<style>

</style>
