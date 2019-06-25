<template>
  <div class="updaImge">
      <Card>
          <p slot="title">{{vm.$t('operation.bnxg')}}
              <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
          </p>
          <div class="allUpdata">
            <span>{{vm.$t('operation.zwbn')}}</span>
            <Row style="width:100%;">
                <Col span="4">
                    <div class="allUpdata-left" style="width:150px;height:150px;background:#ccc;">
                        <img :src="image" />
                    </div>
                </Col>
                <Form ref="formItem" :model="formLeft"  label-position="left" :label-width="100" style="max-height:680px;overflow:auto;display: flex;justify-content: space-around;">
                    <Col span="5">
                        <FormItem label="" prop="img">
                            <input type="file" ref="img" name="img" @change="iconValidator('img', $event)"/>
                        </FormItem>
                    </Col>
                    <Col span="5">
                        <FormItem label="" >
                            {{this.item.activityImgName}}
                        </FormItem>
                    </Col>
                    <Col span="5">
                        <FormItem label="" >
                            {{vm.$t('operation.tzdz')}}
                        </FormItem>
                    </Col>
                    <Col span="5">
                        <FormItem label="" prop="jumpAddress">
                            <Input v-model="formLeft.jumpAddress" name="jumpAddress"></Input>
                        </FormItem>
                    </Col>
                    <Button type="primary" @click="updaImg">{{vm.$t('common.qd')}}</Button>
                </Form>
            </Row>
        </div>
        <div class="allUpdata">
            <span>{{vm.$t('operation.ywbn')}}</span>
            <Row style="width:100%;">
                <Col span="4">
                    <div class="allUpdata-left" style="width:150px;height:150px;background:#ccc;">
                        <img :src="image1" />
                    </div>
                </Col>
                    <Form ref="formItem1" :model="formLeft1" label-position="left" :label-width="100" style="max-height:680px;overflow:auto;display: flex;justify-content: space-around;">
                       <Col span="5">
                           <FormItem label="" prop="imgEn">
                                <input type="file" ref="imgEn" name="imgEn" @change="iconValidator1('imgEn', $event)"/>
                            </FormItem>
                       </Col>
                        <Col span="5">
                           <FormItem label="" >
                                {{this.item.activityImgNameEn}}
                            </FormItem>
                       </Col>
                       <Col span="5">
                           <FormItem label="" >
                               {{vm.$t('operation.tzdz')}}
                            </FormItem>
                       </Col>
                       <Col span="5">
                           <FormItem label="" prop="jumpAddressEn">
                                <Input v-model="formLeft1.jumpAddressEn" name="jumpAddressEn"></Input>
                            </FormItem>
                       </Col>
                        <Button type="primary" @click="updaImgEn">{{vm.$t('common.qd')}}</Button>
                    </Form>
            </Row>
        </div>
        <div class="allUpdata">
            <span>{{vm.$t('operation.ftbn')}}</span>
            <Row style="width:100%;">
                <Col span="4">
                    <div class="allUpdata-left" style="width:150px;height:150px;background:#ccc;">
                        <img :src="image2" />
                    </div>
                </Col>
                <Form ref="formItem2" :model="formLeft2" label-position="left" :label-width="100" style="max-height:680px;overflow:auto;display: flex;justify-content: space-around;">
                    <Col span="5">
                        <FormItem label="" prop="imgCht">
                            <input type="file" ref="imgCht" name="imgCht" @change="iconValidator2('imgCht', $event)"/>
                        </FormItem>
                    </Col>
                    <Col span="5">
                        <FormItem label="" >
                            {{this.item.activityImgNameCht}}
                        </FormItem>
                    </Col>
                    <Col span="5">
                        <FormItem label="" >
                            {{vm.$t('operation.tzdz')}}
                        </FormItem>
                    </Col>
                    <Col span="5">
                        <FormItem label="" prop="jumpAddressCht">
                            <Input v-model="formLeft2.jumpAddressCht" name="jumpAddressCht"></Input>
                        </FormItem>
                    </Col>
                    <Button type="primary" @click="updaImgCht">{{vm.$t('common.qd')}}</Button>
                </Form>
            </Row>
        </div>
      </Card>
  </div>
</template>
<script>
import extendApi from '../../../api/extend'
import until from '../../../libs/util'
export default {
    props: ['item'],
    data () {
        const vm = window.vm;
        return {
            vm: vm,
            formLeft: {
                img: '',
                jumpAddress: ''
            },
            formLeft1: {
                imgEn: '',
                jumpAddressEn: ''
            },
            formLeft2: {
                imgCht: '',
                jumpAddressCht: ''
            },
        }
    },
    computed: {
        image () {
            return this.item.activityImgUrl
        },
        image1 () {
            return this.item.activityImgUrlEn
        },
        image2 () {
            return this.item.activityImgUrlCht
        }
    },
    methods: {
        closeDialog () {
            this.$emit('removeDialog')
        },
        iconValidator (prop, e) {
            this.formLeft[prop] = e.target.value
        },
        iconValidator1 (prop, e) {
            this.formLeft1[prop] = e.target.value
        },
        iconValidator2 (prop, e) {
            this.formLeft2[prop] = e.target.value
        },
        closeDialog () {
            this.$emit('removeDialog')
        },
        updaImg () {
            let form = this.$refs.formItem;
            if (this.formLeft.img == '' && this.formLeft.jumpAddress == '') {
                this.$Message.error({content:　this.vm.$t('operation.qsrzwbnxgdz')})
                return
            }
            var formData = new FormData(form.$el)
            formData.append('adPosition', this.item.adPosition)
            formData.append('version', this.item.version)
            extendApi.updatePromotionActivity(formData, (res) => {
                this.$Message.success({content: this.vm.$t('common.xgcg')})
                this.$emit('removeDialog')
                this.$emit('okCallback')
            }, (msg) => {
                this.$Message.error({content:　msg})
            })
        },
        updaImgEn () {
            let form = this.$refs.formItem1
            if (this.formLeft1.imgEn == '' && this.formLeft1.jumpAddressEn == '') {
                this.$Message.error({content:　this.vm.$t('operation.qsrywbnxgdz')})
                return
            }
            var formData = new FormData(form.$el)
            formData.append('adPosition', this.item.adPosition)
            formData.append('version', this.item.version)
            extendApi.updatePromotionActivity(formData, (res) => {
                this.$Message.success({content:　this.vm.$t('common.xgcg')})
                this.$emit('removeDialog')
                this.$emit('okCallback')
            }, (msg) => {
                this.$Message.error({content:　msg})
            })
        },
        updaImgCht () {
            debugger
            let form = this.$refs.formItem2
            if (this.formLeft2.imgCht == '' && this.formLeft2.jumpAddressCht == '') {
                this.$Message.error({content:　this.vm.$t('operation.qsrftbnxgdz')})
                return
            }
            var formData = new FormData(form.$el)
            formData.append('adPosition', this.item.adPosition)
            formData.append('version', this.item.version)
            extendApi.updatePromotionActivity(formData, (res) => {
                this.$Message.success({content:　this.vm.$t('common.xgcg')})
                this.$emit('removeDialog')
                this.$emit('okCallback')
            }, (msg) => {
                this.$Message.error({content:　msg})
            })
        }
    }
}
</script>
<style scoped>
.updaImge{width: 1000px;background: #fff;padding: 20px;}
.allUpdata{ display: flex;padding-bottom: 20px;border-bottom: 1px solid #ccc;padding-top: 10px;}
.updaBtn{display: flex;justify-content: space-around;}
.allUpdata-left img{width: 150px;height: 150px;}
.ivu-form-item-content{margin-left: 0px !important; }
Button{height: 30px !important;}
</style>

