<template>
    <div class="addBanner">
        <Card>
            <p slot="title">添加</p>
            <Form ref="formItem" :model="formLeft" :rules="ruleInline" label-position="left" :label-width="100" style="max-height:680px;overflow:auto;">
                    <FormItem label="广告位" prop="adPosition">
                        <Input v-model="formLeft.adPosition" name="adPosition"></Input>
                    </FormItem>
                    <FormItem label="中文图片" prop="img">
                        <input type="file" ref="img" name="img" @change="iconValidator('img', $event)"/>
                    </FormItem>
                    <FormItem label="中文图片跳转地址" prop="jumpAddress">
                        <Input v-model="formLeft.jumpAddress" name="jumpAddress"></Input>
                    </FormItem>
                    <FormItem label="英文图片" prop="imgEn">
                        <input type="file" ref="imgEn" name="imgEn" @change="iconValidator('imgEn', $event)"/>
                    </FormItem>
                    <FormItem label="英文图片跳转地址" prop="jumpAddressEn">
                        <Input v-model="formLeft.jumpAddressEn" name="jumpAddressEn"></Input>
                    </FormItem>
                    <FormItem label="繁体图片" prop="imgCht">
                        <input type="file" ref="imgCht" name="imgCht" @change="iconValidator('imgCht', $event)"/>
                    </FormItem>
                    <FormItem label="繁体图片跳转地址" prop="jumpAddressCht">
                        <Input v-model="formLeft.jumpAddressCht" name="jumpAddressCht"></Input>
                    </FormItem>
                    <div class="bannerBtn">
                        <Button type="primary" @click="addCurreny()">添加</Button>
                         <Button  @click="closeDialog()">取消</Button>
                    </div>
            </Form>
        </Card>
    </div>
</template>
<script>
import extendApi from '../../api/extend'
import util from '../../libs/util'
export default {
    data () {
        const customValidator = (rule, value, callback) => {
            if (this.formLeft[rule.field] === null) {
            return callback(new Error('error'))
            } else {
            return callback()
            }
        }
        const xxx = (rule, value, callback) => {
            if (/\.(jpg|png|jpeg|bmp|ico)/i.test(value) === false) {
                return callback(new Error())
            } else {
                return callback()
            }
        }
        // let self = this
        // const xxx1 = (rule, value, callback) => {
        //     let isTrue = util.limitUploadImage(self.$refs.img)
        //         if (!isTrue) {
        //             return callback(new Error())
        //         }
        //         return callback()
        // }
        // const xxx2 = (rule, value, callback) => {
        //     let isTrue = util.limitUploadImage(self.$refs.imgEn)
        //         if (!isTrue) {
        //             return callback(new Error())
        //         }
        //         return callback()
        // }
        // const xxx3 = (rule, value, callback) => {
        //     let isTrue = util.limitUploadImage(self.$refs.imgCht)
        //         if (!isTrue) {
        //             return callback(new Error())
        //         }
        //         return callback()
        // }
        return {
            formLeft: {
                adPosition: '',
                img: '',
                jumpAddress: '',
                imgEn: '',
                jumpAddressEn: '',
                imgCht: '',
                jumpAddressCht: ''
            },
            ruleInline: {
                adPosition: [
                    { required: true, message: '请输入广告位', trigger: 'blur' }
                ],
                img: [
                    { required: true, message: '请输入中文图片', trigger: 'blur' },
                    // { validator: xxx, message: '只能上传PNG或JPG或JPEG或bmp或ICO格式的图片', trigger: 'blur' },
                    // { validator: xxx1, message: '图片不能超过2M', trigger: 'blur' }
                ],
                jumpAddress: [
                    { required: true, message: '请输入中文图片跳转地址', trigger: 'blur' }
                ],
                imgEn: [
                    { required: true, message: '请输入英文图片', trigger: 'blur' },
                    { validator: xxx, message: '只能上传PNG或JPG或JPEG或bmp或ICO格式的图片', trigger: 'blur' },
                    // { validator: xxx2, message: '图片不能超过2M', trigger: 'blur' }
                ],
                jumpAddressEn: [
                    { required: true, message: '请输入英文图片跳转地址', trigger: 'blur' }
                ],
                imgCht: [
                    { required: true, message: '请输入繁体图片', trigger: 'blur' },
                    { validator: xxx, message: '只能上传PNG或JPG或JPEG或bmp或ICO格式的图片', trigger: 'blur' },
                    // { validator: xxx3, message: '图片不能超过2M', trigger: 'blur' }
                ],
                jumpAddressCht: [
                    { required: true, message: '请输入繁体图片跳转地址', trigger: 'blur' }
                ],
            }
        }
    },
    methods: {
        closeDialog () {
            this.$emit('removeDialog')
        },
        addCurreny () {
            let form = this.$refs.formItem;
            form.validate((valid) => {
                if (valid) {
                    var formData = new FormData(form.$el)
                    extendApi.addBannerPage(formData, (res) => {
                        this.$Message.success({content: '添加成功'})
                        this.$emit('removeDialog')
                        this.$emit('okCallback')
                    }, (msg) => {
                        this.$Message.error({content: msg})
                    })
                }
            })
        },
        iconValidator (prop, e) {
         this.formLeft[prop] = e.target.value
        }
    }
}
</script>
<style>
.addBanner{width: 500px;}
.bannerBtn{text-align: center;}
</style>
