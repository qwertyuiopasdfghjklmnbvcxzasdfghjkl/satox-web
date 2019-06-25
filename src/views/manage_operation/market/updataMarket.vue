<template>
  <div class="updataMarket">
      <Card>
          <p slot="title">{{vm.$t('common.xg')}}
              <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
          </p>
          <Row style="margin-bottom: 20px;">
              <Col span="3">
                  {{vm.$t('exchange.sc')}}
              </Col>
              <Col span="3">
                {{item.market}}
              </Col>
              <Col span="10">
                <Input style="width:200px" v-model="market"></Input>
              </Col>
              <Col span="6">
                <Button type="primary" @click="upMarket('market', '1')">{{vm.$t('common.xg')}}</Button>
              </Col>
          </Row>
          <Row>
              <Col span="3">
                  {{vm.$t('common.bz')}}
              </Col>
              <Col span="3">
                {{item.remark}}
              </Col>
              <Col span="10">
                <Input style="width:200px" v-model="remark"></Input>
              </Col>
              <Col span="6">
                <Button type="primary" @click="upMarket('remark','2')">{{vm.$t('common.xg')}}</Button>
              </Col>
          </Row>
      </Card>
  </div>
</template>
<script>
import extendApi from '../../../api/extend'
export default {
    props: ['item'],
    data () {
        const vm = window.vm;
        return{
            vm: vm,
            market: '',
            remark: ''
        }
    },
    methods: {
        upMarket(propName, code) {
            if (!this[propName]) {
                this.$Message.error({content: this.vm.$t('exchange.qsrz')})
                return
            }
            if (code == '1') {
                let data = {
                    oldMarketId: this.item.marketId,
                    oldMarket: this.item.market,
                    oldVersion: this.item.version,
                    oldRemark: this.item.remark,
                    oldIdx:this.item.idx
                }
                data.newMarket = this[propName]
                extendApi.updateSpecialMarket(data, (res) =>{
                    debugger
                    this.item[propName] = this[propName]
                    this.$emit('okCallback')
                    this.$Message.success({content: this.vm.$t('common.xgcg')})
                    this[propName] = ''
                }, (msg) => {
                    this.$Message.error({content: msg})
                })
            } else {
                let data1 = {
                    oldMarketId: this.item.marketId,
                    oldVersion: this.item.version
                }
                data1[propName] = this[propName]
                extendApi.updateSpecialMarket(data1, (res) =>{
                    this.item[propName] = this[propName]
                    this.$emit('okCallback')
                    this.$Message.success({content: this.vm.$t('common.xgcg')})
                    this[propName] = ''
                }, (msg) => {
                    this.$Message.error({content: msg})
                })
            }
        },
        closeDialog () {
            this.$emit('removeDialog')
        }
    }
}
</script>
<style>
.updataMarket{width: 700px;padding: 10px;background: #fff;}
</style>
