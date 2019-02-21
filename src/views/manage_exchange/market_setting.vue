<template>
    <Card class="market_setting" style="width:500px;">
      <p slot="title">
        市场设置
        <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
      </p>
      <Row style="border-bottom:1px solid #e9eaec;height:30px; line-height:30px;">
          <Col span="6">市场名称</Col>
          <Col span="6">{{item.market}}</Col>
          <Col span="12"></Col>
      </Row>
      <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
        <Col span="6">权限名称</Col>
        <Col span="6">当前状态</Col>
        <Col span="12" style="text-align:right;">修改</Col>
      </Row>
      <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
        <Col span="6">上线状态</Col>
        <Col span="6">{{item.state === 1 ? '上线': '下线'}}</Col>
        <Col span="12" style="text-align:right;">
          <Button type="primary"  @click="update">{{this.item.state === 1 ? '下线': '上线'}}</Button>
        </Col>
      </Row>

      <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
        <Col span="6">标的币种</Col>
        <Col span="6">{{item.currencySymbol}}</Col>
        <Col span="6">
          <Input v-model="currencySymbol"></Input>
        </Col>
        <Col span="6" style="text-align:right;">
          <Button type="primary" @click="tabs('currencySymbol')">保存</Button>
        </Col>
      </Row>
      <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
        <Col span="6">基本币种</Col>
        <Col span="6">{{item.baseSymbol}}</Col>
        <Col span="6">
          <Input v-model="baseSymbol"></Input>
        </Col>
        <Col span="6" style="text-align:right;">
          <Button type="primary"  @click="tabs('baseSymbol')">保存</Button>
        </Col>
      </Row>
      <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
        <Col span="6">开盘价格</Col>
        <Col span="6">{{item.openingPrice}}</Col>
        <Col span="6">
          <InputNumber style="width:113px;" :min="0" v-model="openingPrice"></InputNumber>
        </Col>
        <Col span="6" style="text-align:right;">
          <Button type="primary"  @click="tabs('openingPrice')">保存</Button>
        </Col>
      </Row>

      <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
        <Col span="6">价格精度</Col>
        <Col span="6">{{item.accuracy}}</Col>
        <Col span="6">
          <InputNumber style="width:113px;" :min="0.1" v-model="accuracy"></InputNumber>
        </Col>
        <Col span="6" style="text-align:right;">
          <Button type="primary"  @click="tabs('accuracy')">保存</Button>
        </Col>
      </Row>
      <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
        <Col span="6">深度合并精度</Col>
        <Col span="6">{{item.digit}}</Col>
        <Col span="6">
          <InputNumber style="width:113px;" :min="0.1" v-model="digit"></InputNumber>
        </Col>
        <Col span="6" style="text-align:right;">
          <Button type="primary"  @click="tabs('digit')">保存</Button>
        </Col>
      </Row>
      <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
        <Col span="6">最小下单金额</Col>
        <Col span="6">{{item.minPlaceOrderAmount || 0}}</Col>
        <Col span="6">
          <InputNumber style="width:113px;" :min="0.001" v-model="minPlaceOrderAmount"></InputNumber>
        </Col>
        <Col span="6" style="text-align:right;">
          <Button type="primary" @click="tabs('minPlaceOrderAmount')">保存</Button>
        </Col>
      </Row>
      <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
        <Col span="6">最小交易数量</Col>
        <Col span="6">{{item.minPlaceOrderQuantity || 0}}</Col>
        <Col span="6">
          <InputNumber style="width:113px;" :min="0.001" v-model="minPlaceOrderQuantity"></InputNumber>
        </Col>
        <Col span="6" style="text-align:right;">
          <Button type="primary" @click="tabs('minPlaceOrderQuantity')">保存</Button>
        </Col>
      </Row>
      <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
        <Col span="6">固定价格</Col>
        <Col span="6">{{item.fixedPrice || 0}}</Col>
        <Col span="6">
          <InputNumber style="width:113px;" v-model="fixedPrice"></InputNumber>
        </Col>
        <Col span="6" style="text-align:right;">
          <Button type="primary" @click="tabs('fixedPrice')">保存</Button>
        </Col>
      </Row>
      <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
        <Col span="6">自动委托笔数</Col>
        <Col span="6">{{item.autoEntrustCount || 0}}</Col>
        <Col span="6">
          <InputNumber style="width:113px;" v-model="autoEntrustCount"></InputNumber>
        </Col>
        <Col span="6" style="text-align:right;">
          <Button type="primary" @click="tabs('autoEntrustCount')">保存</Button>
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
      curPage: 1,
      total: 0,
      value1: null,
      data1: [],
      accuracy: null,
      digit: null,
      minPlaceOrderAmount: null,
      minPlaceOrderQuantity: null,
      currencySymbol: '',
      baseSymbol: '',
      fixedPrice: '',
      autoEntrustCount: 0,
      openingPrice: null
    }
  },
  created() {
    this.findMarketList()
  },
  methods: {
    closeDialog () {
        this.$emit('removeDialog')
    },
    findMarketList() {
        currenyApi.findMarketList({}, this.curPage, (res, total) => {
            this.total = total
            this.data2 = res
        }, (msg) => {
            this.$Messags.error({content: msg})
        })
    },
    tabs(propName) {
        if (!this[propName] && this[propName] !== 0) {
          this.$Message.error({content: '请输入值'})
          return
        }
        let data = {
           marketId: this.item.marketId
         }
        data[propName] = this[propName]
          currenyApi.updateMarket(data, (res) =>{
              this.item[propName] = this[propName]
              this.$emit('okCallback')
              this.$Message.success({content: '修改成功'})
              this[propName] = ''
          }, (msg) => {
              this.$Message.error({content: msg})
          })
    },
    update() {
      currenyApi.updateMarket({
          version: this.item.version,
          marketId: this.item.marketId,
          state: this.item.state === 2 ? 1 : 2
      }, (res) =>{
        this.item.state = this.item.state === 2 ? 1 : 2
        this.findMarketList()
        this.$Message.success({content: '修改成功'})
      }, (msg) => {
        this.$Message.error({content: msg})
      })
    }
  }
}
</script>
<style lang="less" scoped>
.market_setting{
    background:#fff;padding:8px;
    .title{font-size: 14px;font-weight: bold;color: #000;}
    .ivu-table-cell input{width: 50px;}
    .ivu-table-cell>div{display: flex;}
    .ivu-btn-primary{margin-left: 12px;}
    // .ivu-input-number-input{width: 72%;}
}
</style>
