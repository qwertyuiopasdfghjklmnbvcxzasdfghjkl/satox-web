<template>
  <div class="addPlacard">
      <Card>
            <p slot="title">添加公告</p>
            <Form ref="formItem" :model="formLeft" :rules="ruleInline" label-position="left" :label-width="100" style="max-height:680px;overflow:auto;">
                    <FormItem label="顺序" prop="sequence">
                        <InputNumber style="width:100%;" v-model="formLeft.sequence" name="sequence"></InputNumber>
                        <!-- <Input v-model="formLeft.adPosition" name="adPosition"></Input> -->
                    </FormItem>
                    <FormItem label="简体公告标题" prop="title">
                        <Input v-model="formLeft.title" name="title"></Input>
                    </FormItem>
                    <FormItem label="简体公告链接" prop="link">
                        <Input v-model="formLeft.link" name="link" @change="checkUrl('link', $event)"></Input>
                    </FormItem>
                    <FormItem label="英文公告标题" prop="titleEn">
                        <Input v-model="formLeft.titleEn" name="titleEn"></Input>
                    </FormItem>
                    <FormItem label="英文公告链接" prop="linkEn">
                        <Input v-model="formLeft.linkEn" name="linkEn" @change="checkUrl('linkEn', $event)"></Input>
                    </FormItem>
                    <FormItem label="繁体公告标题" prop="titleCht">
                         <Input v-model="formLeft.titleCht" name="titleCht"></Input>
                    </FormItem>
                    <FormItem label="繁体公告链接" prop="linkCht">
                        <Input v-model="formLeft.linkCht" name="linkCht" @change="checkUrl('linkCht', $event)"></Input>
                    </FormItem>
                    <FormItem label="状态" prop="displayStatus">
                        <RadioGroup ref="displayStatus" v-model="formLeft.displayStatus">
                            <Radio label="1">
                                    <span>展示</span>
                                </Radio>
                                <Radio label="0">
                                    <span>不展示</span>
                                </Radio>
                            </RadioGroup>
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
        let self = this
        const xxx1 = (rule, value, callback) => {
            var reg=/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/
            if (reg.test(value) === false) {
                return callback(new Error())
            } else {
                return callback()
            }
        }
        return {
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
                    { required: true, message: '请输入广告位' },
                    { validator: customValidator, message: '请输入广告位', trigger: 'blur' },
                ],
                title: [
                    { required: true, message: '请输入中文公告标题', trigger: 'blur' },
                ],
                link: [
                    { required: true, message: '请输入中文公告链接', trigger: 'blur' },
                    { validator: xxx1, message: '请输入以http:或者//https://开头的网址', trigger: 'blur' }
                ],
                titleEn: [
                    { required: true, message: '请输入英文公告标题', trigger: 'blur' }
                ],
                linkEn: [
                    { required: true, message: '请输入英文公告链接', trigger: 'blur' },
                    { validator: xxx1, message: '请输入以http:或者//https://开头的网址', trigger: 'blur' }
                ],
                titleCht: [
                    { required: true, message: '请输入繁体公告标题', trigger: 'blur' }
                ],
                linkCht: [
                    { required: true, message: '请输入繁体公告链接', trigger: 'blur' },
                    { validator: xxx1, message: '请输入以http:或者//https://开头的网址', trigger: 'blur' }
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
.addPlacard{}
</style>

