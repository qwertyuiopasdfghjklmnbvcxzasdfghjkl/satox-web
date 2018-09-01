<!-- 添加 -->
<template>
  <Card style="width:430px;">
      <p slot="title">
          KYC添加
          <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
      </p>
      <Form ref="formValidate" :model="formValidate" :rules="ruleInline" :label-width="80" style="margin:0 20px;">
        <FormItem label="账号" prop="account">
            <Input v-model="formValidate.account" name="account"></Input>
        </FormItem>
        <FormItem label="地区" prop="cn">
            <Input v-model="formValidate.cn" name="cn"></Input>
        </FormItem>
        <FormItem label="姓名" prop="verifySurname">
            <Input v-model="formValidate.verifySurname" name="verifySurname"></Input>
        </FormItem>
        <FormItem label="性别" prop="verifySex">
            <Select v-model="formValidate.verifySex" name="verifySex">
                <Option value="1">男</Option>
                <Option value="0">女</Option>
            </Select>
        </FormItem>
        <FormItem label="证件类型" prop="verifyClass">
            <Select v-model="formValidate.verifyClass" name="verifyClass">
                <Option value="2">二代身份证</Option>
                <Option value="0">驾照</Option>
                <Option value="1">护照</Option>
            </Select>
        </FormItem>
        <FormItem label="证件号" prop="verifyIdCard">
            <Input v-model="formValidate.verifyIdCard" name="verifyIdCard"></Input>
        </FormItem>
        <FormItem label="状态" prop="verifyStatus">
            <Select v-model="formValidate.verifyStatus" name="verifyStatus">
                <Option value="2">已通过</Option>
                <Option value="3">不通过</Option>
            </Select>
        </FormItem>
        <FormItem label="时间" prop="verifyAddTime">
            <DatePicker type="date" placeholder="请选择时间" name="verifyAddTime" v-model="formValidate.verifyAddTime" width="100%"></DatePicker>
        </FormItem>
        <FormItem label="照片" prop="frontImg">
            <input type="file" ref="frontImg" name="frontImg" @change="iconValidator('frontImg', $event)"/>
        </FormItem>
         <FormItem label="" prop="backImg">
             <input type="file" ref="backImg" name="backImg" @change="iconValidator('backImg', $event)"/>
        </FormItem>
         <FormItem label="" prop="handImg">
             <input type="file" ref="handImg" name="handImg" @change="iconValidator('handImg', $event)"/>
        </FormItem>
        <FormItem>
            <Button type="primary" style="width:100%;" @click="addVerify">添加</Button>
        </FormItem>
    </Form>
  </Card>
</template>

<script>
import kycApi from '../../api/kyc'
import until from '../../libs/util'
export default {
    data () { 
        const customValidator = (rule, value, callback) => {
            if (this.formValidate[rule.field] === null) {
            return callback(new Error('error'))
            } else {
            return callback()
            }
        }
        const xxx = (rule, value, callback) => {
            if (/\.(jpg|png|jpeg|bmp)/i.test(value) === false) {
                return callback(new Error())
            } else {
                return callback()
            }
        }
        let self = this
        const xxx1 = (rule, value, callback) => {
            let isTrue = until.limitUploadImage(self.$refs.frontImg)
            if (!isTrue) {
                return callback(new Error())
            }
            return callback()
        }
        const xxx2 = (rule, value, callback) => {
            let isTrue = until.limitUploadImage(self.$refs.backImg)
            if (!isTrue) {
                return callback(new Error())
            }
            return callback()
        }
        const xxx3 = (rule, value, callback) => {
            let isTrue = until.limitUploadImage(self.$refs.handImg)
            if (!isTrue) {
                return callback(new Error())
            }
            return callback()
        }
        return {
            formValidate: {
                account: '',
                verifyClass: '',
                verifySex: '1',
                verifyClass: '',
                verifyIdCard: null,
                verifyStatus: null,
                verifyAddTime: '',
                verifyUserID: null,
                frontImg: '',
                backImg: '',
                handImg: '',
                verifyCountryId: null,
                cn: '',
                verifySurname: ''
            },
            ruleInline: {
                verifyAddTime: [
                    { required: true, type: 'date', message: '请输入时间', trigger: 'change' }
                ],
                account: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                cn: [
                    { required: true, message: '请输入地区', trigger: 'blur' },
                ],
                verifySurname: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                verifySex: [
                    { required: true, message: '请选择性别', trigger: 'blur' }
                ],
                verifyClass: [
                    { required: true, message: '请选择证件类型', trigger: 'blur' },
                ],
                verifyIdCard: [
                    { required: true, message: '请输入证件号', trigger: 'blur' },
                ],
                verifyStatus: [
                    { required: true, message: '请选择状态', trigger: 'blur' },
                ],
                frontImg: [
                    { required: true, message: '请上传本人证件正面照', trigger: 'blur' },
                    { validator: xxx, message: '只能上传PNG或JPG或JPEG或bmp格式的图片', trigger: 'blur' },
                    { validator: xxx1, message: '图片不能超过2M', trigger: 'blur' }
                ],
                backImg: [
                    { required: true, message: '请上传本人证件背面照', trigger: 'blur' },
                    { validator: xxx, message: '只能上传PNG或JPG或JPEG或bmp格式的图片', trigger: 'blur' },
                    { validator: xxx2, message: '图片不能超过2M', trigger: 'blur' }
                ],
                handImg: [
                    { required: true, message: '请上传本人手持证件照片', trigger: 'blur' },
                    { validator: xxx, message: '只能上传PNG或JPG或JPEG或bmp格式的图片', trigger: 'blur' },
                    { validator: xxx3, message: '图片不能超过2M', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        iconValidator (prop, e) {
            this.formValidate[prop] = e.target.value
        },
        closeDialog () {
            this.$emit('removeDialog')
        },
        addVerify () {
            this.$refs.formValidate.validate((valid) => {
                if (valid) {
                    let formData = new FormData(this.$refs.formValidate.$el);
                    formData.append('verifyClass', this.formValidate.verifyClass);
                    formData.append('verifyCountryId', '1');
                    formData.append('verifySex', this.formValidate.verifySex)
                    // formData.append('verifyUserID', this.formItem.verifyUserID);
                    kycApi.insertVerify(formData, (res) => {
                        this.$Message.success({content: '添加成功'})
                        this.$emit('okCallback')
                        this.$emit('removeDialog')
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
