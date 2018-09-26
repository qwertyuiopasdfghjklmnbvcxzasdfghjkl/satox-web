<template>
    <Card class="recharge_settings" style="width:500px;">
        <p slot="title">
            充值设置
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Row style="border-bottom:1px solid #e9eaec;height:30px; line-height:30px;">
            <Col span="8">代号</Col>
            <Col span="8">{{item.symbol}}</Col>
            <Col span="8"></Col>
        </Row>
        <Row>
            <Col span="8">权限名称</Col>
            <Col span="8">当前状态</Col>
            <Col span="8" style="text-align:right;margin-left:-14px;">修改</Col>
        </Row>
        <Row style="margin-top:10px;border-top:1px solid #e9eaec;line-height:50px;">
            <Col span="8">权限状态</Col>
            <Col span="8">{{item.rechargeFlag===1?'正常': '暂停'}}</Col>
            <Col span="8" style="text-align:right;margin-left:-14px;">
                <Button type="primary" @click="competence()">{{item.rechargeFlag===2?'正常': '暂停'}}</Button>
            </Col>
        </Row>
        <Row style="margin-top:10px;border-top:1px solid #e9eaec;line-height:50px;">
            <Col span="8">等待区块数</Col>
            <Col span="8">{{item.confirmBlock || 0}}</Col>
            <Col span="8">
                <InputNumber :max="999" :min="1" v-model="confirmBlock"></InputNumber>
                <Button type="primary" @click="tabs()">保存</Button>
            </Col>
        </Row>
    </Card>
</template>

<script>
import currenyApi from '../../api/currency'
export default {
  props: ['item'],
  data () {
    return {
      confirmBlock:null,
      rechargeFlag: null,
      data1: []
    }
  },
  methods: {
      competence() {
        currenyApi.updateSymbol({
            symbolId: this.item.symbolId,
            version: this.item.version,
            rechargeFlag: this.item.rechargeFlag === 2 ? 1 : 2
        }, (res) =>{
            this.item.rechargeFlag = this.item.rechargeFlag === 2 ? 1 : 2
            this.$Message.success({content: '修改成功'})
        }, (msg) => {
            this.$Message.error({content: msg})
        })
    },
    getchangeInfoList() {
      currenyApi.findSymbolWithdrawFees({
        id: this.id,
        symbolId: this.symbolId
      }, (res) => {
        this.data1 = res || {}
      }, (msg) => {
        this.$Message.error({content: msg})
      })
    },
    closeDialog () {
      this.$emit('removeDialog')
    },
    tabs() {
        currenyApi.updateSymbol({
            symbolId: this.item.symbolId,
            confirmBlock: this.confirmBlock
        }, (res) =>{
            this.item.confirmBlock = this.confirmBlock
            this.$Message.success({content: '修改成功'})
        }, (msg) => {
            this.$Message.error({content: msg})
        })
    }
    }
  }
</script>
<style lang="less" scoped>
.recharge_settings{
    .title{font-size: 14px;font-weight: bold;padding: 5px;}
    .ivu-input-small{margin-left: -11px;}
}
</style>
