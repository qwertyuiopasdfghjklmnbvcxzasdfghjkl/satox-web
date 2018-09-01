<style lang="less">
    @import './own-space.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="person"></Icon>
                修改密码
            </p>
             <Form  ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right" :rules="passwordValidate">
                <!-- <FormItem label="原密码" prop="oldPassword" :error="oldPasswordError">
                    <Input v-model="editPasswordForm.oldPassword" placeholder="请输入现在使用的密码" ></Input>
                </FormItem> -->
                <!-- <FormItem label="新密码" prop="password" :error="passwordError">
                    <Input v-model="editPasswordForm.password" placeholder="请输入新密码，至少6位字符" ></Input>
                </FormItem>
                <FormItem label="确认新密码" prop="confirmPassword" :error="confirmPasswordError">
                    <Input v-model="editPasswordForm.confirmPassword" placeholder="请再次输入新密码" ></Input>
                </FormItem> -->
                <FormItem label="原密码" prop="oldPassword">
                    <Input type="password" v-model="editPasswordForm.oldPassword" name="oldPassword"></Input>
                </FormItem>
                <FormItem label="新密码" prop="password">
                    <Input type="password" v-model="editPasswordForm.password" name="password"></Input>
                </FormItem>
                <FormItem label="确认密码" prop="confirmPassword">
                    <Input type="password" v-model="editPasswordForm.confirmPassword" name="confirmPassword"></Input>
                </FormItem>
                
            </Form>
            <div class="footer">
                <Button type="text" @click="cancelEditPass">取消</Button>
                <Button type="primary" :loading="savePassLoading" @click="saveEditPass('editPasswordForm')">保存</Button>
            </div>
        </Card>
    </div>
</template>

<script>
import userApi from '../../api/user'
export default {
    data () {
        const passwordCheck = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.editPasswordForm.confirmPassword !== '') {
                    // 对第二个密码框单独验证
                    this.$refs.editPasswordForm.validateField('confirmPassword');
                }
                callback();
            }
        }
        const passwordAgainCheck = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.editPasswordForm.password) {
                callback(new Error('密码不一致'));
            } else {
                callback();
            }
        }
        return {
            userForm: {
                name: '',
                cellphone: '',
                company: '',
                department: ''
            },
            uid: '',  // 登录用户的userId
            securityCode: '',  // 验证码
            phoneHasChanged: false,  // 是否编辑了手机
            save_loading: false,
            identifyError: '',  // 验证码错误
            editPasswordModal: false, // 修改密码模态框显示
            savePassLoading: false,
            // oldPasswordError: '',
            // passwordError: '',
            // confirmPasswordError: '',
            identifyCodeRight: false,  // 验证码是否正确
            hasGetIdentifyCode: false,  // 是否点了获取验证码
            canGetIdentifyCode: false,  // 是否可点获取验证码
            checkIdentifyCodeLoading: false,
            // inforValidate: {
            //     name: [
            //         { required: true, message: '请输入姓名', trigger: 'blur' }
            //     ],
            //     cellphone: [
            //         { required: true, message: '请输入手机号码' },
            //         { validator: validePhone }
            //     ]
            // },
            editPasswordForm: {
                oldPassword: '',
                password: '',
                confirmPassword: ''
            },
            passwordValidate: {
                oldPassword: [
                    { required: true, message: '请输入原密码', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    {validator: passwordCheck, trigger: 'blur' }
                    // { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
                    // { max: 32, message: '最多输入32个字符', trigger: 'blur' }
                ],
                confirmPassword: [
                    { required: true, message: '请输入确认密码', trigger: 'blur' },
                    {validator: passwordAgainCheck, trigger: 'blur' }
                ],
                // password: [
                //     { required: true, message: '请输入新密码', trigger: 'blur' },
                //     { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
                //     { max: 32, message: '最多输入32个字符', trigger: 'blur' }
                // ],
                // confirmPassword: [
                //     { required: true, message: '请再次输入新密码', trigger: 'blur' },
                //     { validator: valideRePassword, trigger: 'blur' }
                // ]
            },
            inputCodeVisible: false, // 显示填写验证码box
            initPhone: '',
            gettingIdentifyCodeBtnContent: '获取验证码'  // “获取验证码”按钮的文字
        };
    },
    methods: {
        goto () {
            name = this.$route.name
            this.$store.commit('removeTag', name);
            localStorage.pageOpenedList = JSON.stringify(this.$store.state.pageOpenedList);
            let lastPageName = '';
            if (this.$store.state.pageOpenedList.length > 1) {
                lastPageName = this.$store.state.pageOpenedList[1].name;
            } else {
                lastPageName = this.$store.state.pageOpenedList[0].name;
            }
            this.$router.push({
                name: lastPageName
            });
        },
        getIdentifyCode () {
            this.hasGetIdentifyCode = true;
            this.$refs['userForm'].validate((valid) => {
                if (valid) {
                    this.canGetIdentifyCode = true;
                    let timeLast = 60;
                    let timer = setInterval(() => {
                        if (timeLast >= 0) {
                            this.gettingIdentifyCodeBtnContent = timeLast + '秒后重试';
                            timeLast -= 1;
                        } else {
                            clearInterval(timer);
                            this.gettingIdentifyCodeBtnContent = '获取验证码';
                            this.canGetIdentifyCode = false;
                        }
                    }, 1000);
                    this.inputCodeVisible = true;
                    // you can write ajax request here
                }
            });
        },
        showEditPassword () {
            this.editPasswordModal = true;
        },
        cancelEditUserInfor () {
            this.$store.commit('removeTag', 'ownspace_index');
            localStorage.pageOpenedList = JSON.stringify(this.$store.state.pageOpenedList);
            let lastPageName = '';
            if (this.$store.state.pageOpenedList.length > 1) {
                lastPageName = this.$store.state.pageOpenedList[1].name;
            } else {
                lastPageName = this.$store.state.pageOpenedList[0].name;
            }
            this.$router.push({
                name: lastPageName
            });
        },
        saveEdit () {
            this.$refs['userForm'].validate((valid) => {
                if (valid) {
                    if (this.phoneHasChanged && this.userForm.cellphone !== this.initPhone) {  // 手机号码修改过了而且修改之后的手机号和原来的不一样
                        if (this.hasGetIdentifyCode) { // 判断是否点了获取验证码
                            if (this.identifyCodeRight) {  // 判断验证码是否正确
                                this.saveInfoAjax();
                            } else {
                                this.$Message.error('验证码错误，请重新输入');
                            }
                        } else {
                            this.$Message.warning('请先点击获取验证码');
                        }
                    } else {
                        this.saveInfoAjax();
                    }
                }
            });
        },
        cancelEditPass () {
            this.goto()
        },
        saveEditPass(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    userApi.updateUserPwd(this.editPasswordForm, (res) => {
                        this.$Message.success({content: '修改成功'})
                        this.goto()
                    }, (msg) => {
                        this.$Message.error({content: msg})
                    })
                } else {}
            })
        },
        init () {
            this.userForm.name = 'Lison';
            this.userForm.cellphone = '17712345678';
            this.initPhone = '17712345678';
            this.userForm.company = 'TalkingData';
            this.userForm.department = '可视化部门';
        },
        cancelInputCodeBox () {
            this.inputCodeVisible = false;
            this.userForm.cellphone = this.initPhone;
        },
        submitCode () {
            let vm = this;
            vm.checkIdentifyCodeLoading = true;
            if (this.securityCode.length === 0) {
                this.$Message.error('请填写短信验证码');
            } else {
                setTimeout(() => {
                    this.$Message.success('验证码正确');
                    this.inputCodeVisible = false;
                    this.checkIdentifyCodeLoading = false;
                }, 1000);
            }
        },
        hasChangePhone () {
            this.phoneHasChanged = true;
            this.hasGetIdentifyCode = false;
            this.identifyCodeRight = false;
        },
        saveInfoAjax () {
            this.save_loading = true;
            setTimeout(() => {
                this.$Message.success('保存成功');
                this.save_loading = false;
            }, 1000);
        }
    },
    mounted () {
        this.init();
    }
};
</script>
<style scoped>
.ivu-card-body form{width: 400px;}
.ivu-card-body form .ivu-form-item-label{text-align: left;}
.footer{width: 400px;text-align: center;}
</style>

