<template>
  <div class="addPlacard">
      <Card>
            <p slot="title">{{vm.$t('operation.tjgg')}}</p>
            <Form ref="formItem" :model="formLeft" :rules="ruleInline" label-position="left" :label-width="100" style="max-height:680px;overflow:auto;">
                    <FormItem :label="vm.$t('operation.sx')" prop="sequence">
                        <InputNumber style="width:100%;" v-model="formLeft.sequence" name="sequence"></InputNumber>
                        <!-- <Input v-model="formLeft.adPosition" name="adPosition"></Input> -->
                    </FormItem>
                    <FormItem :label="vm.$t('operation.jtggbt')" prop="title">
                        <Input v-model="formLeft.title" name="title"></Input>
                    </FormItem>
                    <FormItem :label="vm.$t('operation.jtgglj')" prop="link">
                        <Input v-model="formLeft.link" name="link" @change="checkUrl('link', $event)"></Input>
                    </FormItem>
                    <FormItem :label="vm.$t('operation.ywggbt')" prop="titleEn">
                        <Input v-model="formLeft.titleEn" name="titleEn"></Input>
                    </FormItem>
                    <FormItem :label="vm.$t('operation.ywgglj')" prop="linkEn">
                        <Input v-model="formLeft.linkEn" name="linkEn" @change="checkUrl('linkEn', $event)"></Input>
                    </FormItem>
                    <FormItem :label="vm.$t('operation.ftggbt')" prop="titleCht">
                         <Input v-model="formLeft.titleCht" name="titleCht"></Input>
                    </FormItem>
                    <FormItem :label="vm.$t('operation.ftgglj')" prop="linkCht">
                        <Input v-model="formLeft.linkCht" name="linkCht" @change="checkUrl('linkCht', $event)"></Input>
                    </FormItem>
                    <FormItem :label="vm.$t('common.zt')" prop="displayStatus">
                        <RadioGroup ref="displayStatus" v-model="formLeft.displayStatus">
                            <Radio label="1">
                                    <span>{{vm.$t('operation.zs')}}</span>
                                </Radio>
                                <Radio label="0">
                                    <span>{{vm.$t('operation.bzs')}}</span>
                                </Radio>
                            </RadioGroup>
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
            var reg=/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/
            if (reg.test(value) === false) {
                return callback(new Error())
            } else {
                return callback()
            }
        }
        const vm = window.vm;
        return {
            vm: vm,
            formLeft: {
                sequence: null,
                title: '',
                link: '',
                titleEn: '',
                linkEn: '',
                titleCht: '',
                linkCht: '',
                displayStatus: '1'
            },
            ruleInline: {
                sequence: [
                    { required: true, message: vm.$t('common.qsr')+vm.$t('operation.ggw') },
                    { validator: customValidator, message: vm.$t('common.qsr')+vm.$t('operation.ggw'), trigger: 'blur' },
                ],
                title: [
                    { required: true, message: vm.$t('common.qsr')+vm.$t('operation.jtggbt'), trigger: 'blur' },
                ],
                link: [
                    { required: true, message: vm.$t('common.qsr')+vm.$t('operation.jtgglj'), trigger: 'blur' },
                    { validator: xxx1, message: vm.$t('common.qsryhttpktwz'), trigger: 'blur' }
                ],
                titleEn: [
                    { required: true, message: vm.$t('common.qsr')+vm.$t('operation.ywggbt'), trigger: 'blur' }
                ],
                linkEn: [
                    { required: true, message: vm.$t('common.qsr')+vm.$t('operation.ywgglj'), trigger: 'blur' },
                    { validator: xxx1, message: vm.$t('common.qsryhttpktwz'), trigger: 'blur' }
                ],
                titleCht: [
                    { required: true, message: vm.$t('common.qsr')+vm.$t('operation.ftggbt'), trigger: 'blur' }
                ],
                linkCht: [
                    { required: true, message: vm.$t('common.qsr')+vm.$t('operation.ftgglj'), trigger: 'blur' },
                    { validator: xxx1, message: vm.$t('common.qsryhttpktwz'), trigger: 'blur' }
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
                    // var formData = new FormData(form.$el)
                    extendApi.addAnnouncement(this.formLeft, (res) => {
                        this.$Message.success({content: this.vm.$t('common.tjcg')})
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
.addPlacard{}
</style>

