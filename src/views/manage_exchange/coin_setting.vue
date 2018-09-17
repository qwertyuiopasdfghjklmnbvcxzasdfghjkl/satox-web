<template>
 <div class="coin_setting" style="width:635px;background: #fff;position:relative;">
    <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
     <Tabs style="backgroung:#fff;">
        <TabPane label="提币设置">
            <Card style="width:500px;">
                <Row style="border-bottom:1px solid #e9eaec;height:30px; line-height:30px;">
                  <Col span="8">代号</Col>
                  <Col span="8">{{this.data1.symbol}}</Col>
                  <Col span="8"></Col>
                </Row>
                <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:40px; line-height:40px;">
                  <Col span="8">权限名称</Col>
                  <Col span="8">当前状态</Col>
                  <Col span="8">修改</Col>
                </Row>
                <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:40px; line-height:40px;">
                  <Col span="8">权限状态</Col>
                  <Col span="8">{{this.item.withdrawFlag===1?'正常':'暂停'}}</Col>
                  <Col span="8" style="text-align:right;margin-left:-15px;">
                    <Button type="primary" @click="updataInsertSymbol">{{this.item.withdrawFlag===2?'正常':'暂停'}}</Button>
                  </Col>
                </Row>
                <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:40px; line-height:40px;">
                  <Col span="8">最小提币数量</Col>
                  <Col span="8">{{data1.minWithdrawQuantity2 || 0}}</Col>
                  <Col span="8">
                  <!-- <numberbox ref="price" :style="baseStyle" v-if="!isMarket" :accuracy="fixedNumber" class="formel-textbox" type="text" v-model="formData.price" :readonly="isMarket"/> -->
                    <numberbox ref="price" type="text" v-model="minWithdrawQuantity" style="width:80px;border:1px solid #dddee1;"/>
                    <!-- <InputNumber v-model="minWithdrawQuantity" ></InputNumber> -->
                    <Button type="primary" @click="tabs('minWithdrawQuantity')">保存</Button>
                  </Col>
                </Row>
                <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:40px; line-height:40px; display:none">
                  <Col span="8">换算数量</Col>
                  <Col span="8">{{data1.convertQuantity || 0}}</Col>
                  <Col span="8">
                    <InputNumber v-model="convertQuantity"></InputNumber>
                    <Button type="primary" @click="tabs('convertQuantity')">保存</Button>
                  </Col>
                </Row>
                <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:40px; line-height:40px; display:none">
                  <Col span="8">上浮百分比</Col>
                  <Col span="8">{{data1.riseRatio || 0}}</Col>
                  <!-- <Col span="8">
                    <InputNumber v-model="riseRatio"></InputNumber>
                    <Button type="primary"  @click="tabs('riseRatio')">保存</Button>
                  </Col> -->
                </Row>
                <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:40px; line-height:40px; display:none">
                  <Col span="8">最佳矿工费</Col>
                  <Col span="8">{{data1.bestMinerFee || 0}}</Col>
                  <Col span="8">
                  </Col>
                </Row>
                <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:40px; line-height:40px;">
                  <Col span="8">手续费固定额度</Col>
                  <Col span="8">{{data1.feeFixedAmount || 0}}</Col>
                  <Col span="8">
                    <InputNumber v-model="feeFixedAmount"></InputNumber>
                    <Button type="primary"  @click="tabs('feeFixedAmount')">保存</Button>
                  </Col>
                </Row>

               <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:40px; line-height:40px;" v-if="this.item.symbolType !== 2">
                  <Col span="8">矿工费</Col>
                  <Col span="8">{{data1.minerFee || 0}}</Col>
                  <Col span="8">
                    <InputNumber v-model="minerFee"></InputNumber>
                    <Button type="primary"  @click="tabs('minerFee')">保存</Button>
                  </Col>
                </Row>
                <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:40px; line-height:40px; " v-if="this.item.symbolType === 2">
                  <Col span="8">GASPrice</Col>
                  <Col span="8">{{data1.gasprice || 0}}</Col>
                  <Col span="8">
                    <InputNumber v-model="gasprice"></InputNumber>
                    <Button type="primary"  @click="tabs('gasprice')">保存</Button>
                  </Col>
                </Row>
                <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:40px; line-height:40px;" v-if="this.item.symbolType === 2">
                  <Col span="8">GASNumber</Col>
                  <Col span="8">{{data1.gaslimit || 0}}</Col>
                  <Col span="8">
                    <InputNumber v-model="gaslimit"></InputNumber>
                    <Button type="primary"  @click="tabs('gaslimit')">保存</Button>
                  </Col>
                </Row>
            </Card>
        </TabPane>
        <TabPane label="充值设置">
             <Card class="recharge_settings" style="width:500px;">
                <Row style="border-bottom:1px solid #e9eaec;height:30px; line-height:30px;">
                    <Col span="8">代号</Col>
                    <Col span="8">{{this.item.symbol}}</Col>
                    <Col span="8"></Col>
                </Row>
                <Row style="margin-top:10px;border-top:1px solid #e9eaec;line-height:50px;">
                    <Col span="8">权限名称</Col>
                    <Col span="8">当前状态</Col>
                    <Col span="8" style="text-align:right;margin-left:-14px;">修改</Col>
                </Row>
                <Row style="margin-top:10px;border-top:1px solid #e9eaec;line-height:50px;">
                    <Col span="8">权限状态</Col>
                    <Col span="8">{{this.item.rechargeFlag===1?'正常': '暂停'}}</Col>
                    <Col span="8" style="text-align:right;margin-left:-14px;">
                        <Button type="primary" @click="competence()">{{this.item.rechargeFlag===2?'正常': '暂停'}}</Button>
                    </Col>
                </Row>
                <Row style="margin-top:10px;border-top:1px solid #e9eaec;line-height:50px;">
                    <Col span="8">等待区块数</Col>
                    <Col span="8">{{this.item.confirmBlock || 0}}</Col>
                    <Col span="8">
                        <InputNumber :max="999" :min="1" v-model="confirmBlock"></InputNumber>
                        <Button type="primary" @click="tabs1()">保存</Button>
                    </Col>
                </Row>
            </Card>
        </TabPane>
  </Tabs>
 </div>
</template>

<script>
import currenyApi from '../../api/currency'
import numberbox from '../components/dialog/numberbox'
export default {
  props: ['item'],
  data () {
    return {
      version: null,
      value1: null,
      minWithdrawQuantity2: null,
      minWithdrawQuantity: null,
      convertQuantity: null,
      riseRatio: null,
      feeFixedAmount: null,
      data1: [],
      minerFee: null,
      gasprice: null,
      gaslimit: null,
      confirmBlock:null,
      rechargeFlag: null,
      data2: []
    }
  },
  components: {
    numberbox
  },
  created () {
    this.getchangeInfoList()
  },
  methods: {
    // getchangeInfoList() {
    //   console.log(this.item)
    //   currenyApi.findSymbolWithdrawFees({
    //        id: this.id,
    //        symbolId: this.symbolId
    //   }, (res) => {
    //        this.data1 = res || 0
    //   }, (msg) => {
    //       this.$Message.error({content: msg})
    //   })
    // },
    tabs(propName) {
      if (!this[propName]) {
        this.$Message.error({content: '不能为空'})
        return
      }
      let data = {
        symbolFeeId: this.data1.symbolFeeId,
      }
      data[propName] = this[propName]
      currenyApi.updateSymbolWithdrawFees(data, (res) =>{
          this.getchangeInfoList()
          this.$Message.success({content: '修改成功'})
      }, (msg) => {
          this.$Message.error({content: msg})
      }) 
    },
    closeDialog () {
      this.$emit('removeDialog')
    },
    updataInsertSymbol() {
      currenyApi.updateSymbol({
        symbolId: this.item.symbolId,
        version: this.version || this.item.version,
        withdrawFlag: this.item.withdrawFlag === 2 ? 1 : 2
      }, (res) =>{
        this.item.withdrawFlag = this.item.withdrawFlag === 2 ? 1 : 2
        this.$Message.success({content: '修改成功'})
        currenyApi.coinFindSymbolInfo({
          symbolId: this.item.symbolId
        },(res) => {
          this.version = res.version
        })
      }, (msg) => {
        this.$Message.error({content: msg})
      })
    },
    competence() {
        currenyApi.updateSymbol({
            symbolId: this.item.symbolId,
            version: this.version || this.item.version,
            rechargeFlag: this.item.rechargeFlag === 2 ? 1 : 2
        }, (res) =>{
            this.item.rechargeFlag = this.item.rechargeFlag === 2 ? 1 : 2
            this.$Message.success({content: '修改成功'})
             currenyApi.coinFindSymbolInfo({
              symbolId: this.item.symbolId
            },(res) => {
              this.version = res.version
            })
        }, (msg) => {
            this.$Message.error({content: msg})
        })
    },
    getchangeInfoList() {
      currenyApi.findSymbolWithdrawFees({
        id: this.id,
        symbolId: this.item.symbolId
      }, (res) => {
        this.data1 = res || {}
      }, (msg) => {
        this.$Message.error({content: msg})
      })
    },
    closeDialog () {
      this.$emit('removeDialog')
    },
    tabs1() {
        currenyApi.updateSymbol({
            symbolId: this.item.symbolId,
            confirmBlock: this.confirmBlock
        }, (res) =>{
            this.item.confirmBlock = this.confirmBlock
            this.$Message.success({content: '修改成功'})
            this.getchangeInfoList()
        }, (msg) => {
            this.$Message.error({content: msg})
        })
    }
  }
}
</script>
<style lang="less" scoped>
.ivu-tabs{background: #fff;width: 600px;padding-bottom: 50px;}
.ivu-card-bordered{margin: 0 auto;}
.ivu-icon-close{position: absolute;right: 12px;top: 10px;}
</style>
