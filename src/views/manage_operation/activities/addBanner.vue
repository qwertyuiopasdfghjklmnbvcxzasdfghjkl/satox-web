<template>
    <div class="addBanner">
        <Card>
            <p slot="title">{{vm.$t('common.tj')}}</p>
            <Form ref="formItem" :model="formLeft" :rules="ruleInline" label-position="left" :label-width="100" style="max-height:680px;overflow:auto;">
                    <FormItem :label="vm.$t('operation.ggw')" prop="adPosition">
                        <InputNumber style="width:100%;" v-model="formLeft.adPosition" name="adPosition"></InputNumber>
                        <!-- <Input v-model="formLeft.adPosition" name="adPosition"></Input> -->
                    </FormItem>
                    <FormItem :label="vm.$t('operation.zwtp')" prop="img">
                        <input type="file" ref="img" name="img" @change="iconValidator('img', $event)"/>
                    </FormItem>
                    <FormItem :label="vm.$t('operation.zwtutzdz')" prop="jumpAddress">
                        <Input v-model="formLeft.jumpAddress" name="jumpAddress" @change="checkUrl('jumpAddress', $event)"></Input>
                    </FormItem>
                    <FormItem :label="vm.$t('operation.ywtp')" prop="imgEn">
                        <input type="file" ref="imgEn" name="imgEn" @change="iconValidator('imgEn', $event)"/>
                    </FormItem>
                    <FormItem :label="vm.$t('operation.ywtptzdz')" prop="jumpAddressEn">
                        <Input v-model="formLeft.jumpAddressEn" name="jumpAddressEn" @change="checkUrl('jumpAddressEn', $event)"></Input>
                    </FormItem>
                    <FormItem :label="vm.$t('operation.fttp')" prop="imgCht">
                        <input type="file" ref="imgCht" name="imgCht" @change="iconValidator('imgCht', $event)"/>
                    </FormItem>
                    <FormItem :label="vm.$t('operation.fttptzdz')" prop="jumpAddressCht">
                        <Input v-model="formLeft.jumpAddressCht" name="jumpAddressCht" @change="checkUrl('jumpAddressCht', $event)"></Input>
                    </FormItem>
                    <div class="bannerBtn">
                        <Button type="primary" @click="addCurreny()">{{vm.$t('common.tj')}}</Button>
                         <Button  @click="closeDialog()">{{vm.$t('common.qx')}}</Button>
                    </div>
            </Form>
        </Card>
    </div>
</template>
<script>
import extendApi from '../../../api/extend'
import util from '../../../libs/util'
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
        let self = this
        const xxx1 = (rule, value, callback) => {
            var reg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/
            if (reg.test(value) === false) {
                return callback(new Error())
            } else {
                return callback()
            }
        }
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
        const vm = window.vm;
        return {
            vm: vm,
            formLeft: {
                adPosition: null,
                img: '',
                jumpAddress: '',
                imgEn: '',
                jumpAddressEn: '',
                imgCht: '',
                jumpAddressCht: ''
            },
            ruleInline: {
                adPosition: [
                    { required: true, message: vm.$t('common.qsr')+vm.$t('operation.ggw') },
                    { validator: customValidator, message: vm.$t('common.qsr')+vm.$t('operation.ggw'), trigger: 'blur' },
                ],
                img: [
                    { required: true, message: vm.$t('common.qsr')+vm.$t('operation.zwtp'), trigger: 'blur' },
                ],
                jumpAddress: [
                    { required: true, message: vm.$t('common.qsr')+vm.$t('operation.zwtutzdz'), trigger: 'blur' },
                    { validator: xxx1, message: vm.$t('operation.qsryhttpktwz'), trigger: 'blur' }
                ],
                imgEn: [
                    { required: true, message: vm.$t('common.qsr')+vm.$t('operation.ywtp'), trigger: 'blur' },
                    { validator: xxx, message: vm.$t('kyc.znscpnghjpeghbmpdtp'), trigger: 'blur' }
                ],
                jumpAddressEn: [
                    { required: true, message: vm.$t('common.qsr')+vm.$t('operation.ywtptzdz'), trigger: 'blur' },
                    { validator: xxx1, message: vm.$t('operation.qsryhttpktwz'), trigger: 'blur' }
                ],
                imgCht: [
                    { required: true, message: vm.$t('common.qsr')+vm.$t('operation.fttp'), trigger: 'blur' },
                    { validator: xxx, message: vm.$t('kyc.znscpnghjpeghbmpdtp'), trigger: 'blur' }
                ],
                jumpAddressCht: [
                    { required: true, message: vm.$t('common.qsr')+vm.$t('operation.fttptzdz'), trigger: 'blur' },
                    { validator: xxx1, message: vm.$t('operation.qsryhttpktwz'), trigger: 'blur' }
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
        },
        checkUrl (prop, e) {
          this.formLeft[prop] = e.target.value
        }
    }
}
</script>
<style>
.addBanner{width: 500px;}
.bannerBtn{text-align: center;}
</style>
