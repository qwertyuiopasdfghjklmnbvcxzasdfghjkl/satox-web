<template>
  <div class="buy">
    <div class="title">{{tradeParams.tradeTxt}}</div>
    <div class="buy-cont">
      <p>
        <span class="label-left">{{$t(params.ad_type==2?'otc_exchange.otc_exchange_ask':'otc_exchange.otc_exchange_bid')}}<!--单价--></span>
        <span>{{detailData.cur_price}}<em class="unit">&nbsp;{{params.currency}}</em></span>
      </p>
      <p>
        <span class="label-left">{{$t('message.msg_surplus')}}<!--剩余--></span>
        <span>{{detailData.remain_count}}<em class="unit">&nbsp;{{params.symbol}}</em></span>
      </p>
      <p>
        <span class="label-left">{{$t('otc_exchange.otc_exchange_Trading_limits')}}<!--交易限额--></span>
        <span class="trade-limit"><em>{{detailData.min_amount}} - {{detailData.max_amount}}</em><em class="unit">&nbsp;{{tradeParams.limit}}</em></span>
      </p>
      <p>
        <span class="label-left">{{$t('exchange.exchange_amount')}}<!--数量--><em class="asterisk">&nbsp;*</em></span>
        <span><em class="unit">&nbsp;{{params.symbol}}</em></span>
      </p>
      <p>
        <numberbox :class="{error: errors.has('symbol_count')}" v-model="symbol_count" v-validate="`required|intOrDecimal|buyOrSellNotLargeRemainCount${sellType ? '|minTradeLimit:1|maxTradeLimit:1' : ''}`" data-vv-name="symbol_count" :accuracy="4"/>
        <a href="javascript:;" @click="buyAll">{{$t('otc_exchange.otc_exchange_Buy_all')}}<!--一键扫货--></a>
      </p>
      <p class="msg">
        {{errors.has('symbol_count')?getErrorMsg('symbol_count'):''}}
      </p>
      <p>
        <span class="label-left">{{$t('exchange.exchange_total')}}<!--金额--><em class="asterisk">&nbsp;*</em></span>
        <span><em class="unit">&nbsp;{{params.currency}}</em></span>
      </p>
      <p>
        <numberbox :class="{error: errors.has('currency_count')}" v-model="currency_count" v-validate="`required|intOrDecimal${buyType ? '|minTradeLimit:2|maxTradeLimit:2' : ''}`" data-vv-name="currency_count" :accuracy="2"/>
      </p>
      <p class="msg">
        {{errors.has('currency_count')?getErrorMsg('currency_count'):''}}
      </p>
      <div class="btn">
        <span class="cancel" @click="cancel">{{$t('otc_legal.otc_legal_cancel')}}<!--取消--></span>
        <span class="cimfir" :class="{disabled:locked}" @click="createOrder">{{$t('otc_ad.otc_ad_confirm')}}<!--确认--></span>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Validator } from 'vee-validate'
import otcApi from '@/api/otc'
import utils from '@/assets/js/utils'
import numUtils from '@/assets/js/numberUtils'
import numberbox from '@/components/formel/numberInput'
import orderconfirm from '@/otc/otchome/orderconfirm'
export default {
  props: ['params', 'ad_id', 'matchPayType'],
  components: {
    numberbox
  },
  data () {
    return {
      locked: true,
      detailData: {},
      symbol_count: '',
      currency_count: '',
      changeInput: ''
    }
  },
  computed: {
    msgs () {
      return {
        symbol_count: {required: this.$t('public0.public12')}, // 请输入数量
        currency_count: {required: this.$t('public0.public13')} // 请输入金额
      }
    },
    buyType () { // 卖的广告是买
      return this.params.ad_type === 2
    },
    sellType () { // 买的广告是卖
      return this.params.ad_type === 1
    },
    tradeParams () {
      if (this.buyType) {
        return {
          tradeTxt: this.$t('otc_exchange.otc_exchange_buy'), // 购买
          limit: this.params.currency // 交易限额
        }
      } else if (this.sellType) {
        return {
          tradeTxt: this.$t('otc_exchange.otc_exchange_sell'), // 出售
          limit: this.params.symbol // 交易限额
        }
      } else {
        return {}
      }
    }
  },
  watch: {
    currency_count (val, oldVal) {
      if (numUtils.BN(val).equals(numUtils.BN(0)) || this.changeInput === 'symbol') {
        this.changeInput = ''
        return
      }
      this.changeInput = 'currency'
      this.symbol_count = val ? utils.removeEndZero(numUtils.div(val, this.detailData.cur_price).toFixed(5)) : ''
    },
    symbol_count (val, oldVal) {
      if (numUtils.BN(val).equals(numUtils.BN(0)) || this.changeInput === 'currency') {
        this.changeInput = ''
        return
      }
      this.changeInput = 'symbol'
      this.currency_count = val ? utils.removeEndZero(numUtils.mul(val, this.detailData.cur_price).toFixed(2)) : ''
    }
  },
  created () {
    Validator.extend('minTradeLimit', {
      getMessage: (field, args) => 'error_code.ORDER_TRADE_LT_COUNT',
      validate: (value, args) => {
        return parseFloat(value) >= parseFloat(this.detailData.min_amount)
      }
    })
    Validator.extend('maxTradeLimit', {
      getMessage: (field, args) => 'error_code.ORDER_TRADE_GT_COUNT',
      validate: (value, args) => {
        return parseFloat(value) <= parseFloat(this.detailData.max_amount)
      }
    })
    Validator.extend('buyOrSellNotLargeRemainCount', {
      getMessage: (field, args) => 'error_code.SYMBOL_AD_REMAIN_LACK',
      validate: (value, args) => {
        return parseFloat(value) <= parseFloat(this.detailData.remain_count)
      }
    })
    this.fnGetAdvertisementDetail()
  },
  methods: {
    fnGetAdvertisementDetail () {
      otcApi.getAdvertisementDetail(this.ad_id, (res) => {
        this.detailData = res || {}
        this.detailData.cur_price = utils.removeEndZero(numUtils.BN(this.detailData.cur_price).toFixed(2))
        this.detailData.min_amount = utils.removeEndZero(numUtils.BN(this.detailData.min_amount).toFixed(8))
        this.detailData.max_amount = utils.removeEndZero(numUtils.BN(this.detailData.max_amount).toFixed(8))
        this.detailData.remain_count = utils.removeEndZero(numUtils.BN(this.detailData.remain_count).toFixed(8))
      })
    },
    buyAll () {
      if (this.buyType) {
        if (numUtils.mul(this.detailData.remain_count, this.detailData.cur_price).gt(numUtils.BN(this.detailData.max_amount))) {
          this.currency_count = this.detailData.max_amount
        } else {
          this.symbol_count = this.detailData ? this.detailData.remain_count : 0
        }
      } else if (this.sellType) {
        if (numUtils.BN(this.detailData.remain_count).gt(numUtils.BN(this.detailData.max_amount))) {
          this.symbol_count = this.detailData.max_amount
        } else {
          this.symbol_count = this.detailData ? this.detailData.remain_count : 0
        }
      }
    },
    cancel () {
      this.$emit('removeDialog')
    },
    createOrder () {
      this.$validator.validateAll().then((valid) => {
        if (!valid) {
          return
        }
        Vue.$confirmDialog({
          id: 'create_order_confirm',
          title: this.$t('public0.public255'), // 下单确认信息
          isComponent: true,
          content: orderconfirm,
          btnPosition: 'right',
          width: 620,
          item: {
            trade_type: this.params.ad_type === 1 ? 2 : 1,
            cur_price: this.detailData.cur_price,
            symbol: this.detailData.symbol,
            currency: this.detailData.currency,
            symbol_count: this.symbol_count,
            currency_count: this.currency_count,
            pay_type: this.detailData.pay_type,
            matchPayType: this.matchPayType
          },
          okCallback: () => {
            if (this.locked) {
              return
            }
            this.locked = true
            otcApi.createOrders({
              ad_id: this.ad_id,
              trade_type: this.params.ad_type === 1 ? 2 : 1,
              symbol: this.detailData.symbol,
              currency: this.detailData.currency,
              symbol_count: this.symbol_count,
              currency_count: this.currency_count
            }, (id, msg) => {
              this.locked = false
              this.params.newOrderCount++
              this.$emit('okCallback', id)
              Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
              this.$emit('removeDialog')
            }, (msg) => {
              this.locked = false
              let errMsg = typeof msg === 'string' ? msg : msg[0]
              Vue.$confirmDialog({showCancel: false, content: this.$t(`error_code.${errMsg}`)})
            })
          }
        })
      })
    },
    getErrorMsg (name) {
      return this.msgs[name] && this.msgs[name][this.errors.firstRule(name)] ? this.msgs[name][this.errors.firstRule(name)] : this.$t(this.errors.first(name))
    }
  }
}
</script>

<style scoped>
input::-webkit-outer-spin-button,input::-webkit-inner-spin-button {appearance:none !important;margin: 0;}
.buy{width: 320px;background-color: #222121;color: #aeb7d0;}
.title{text-align: center;font-size: 14px;color: #aeb7d0;height: 24px;line-height: 24px;background-color: #333232;text-transform: uppercase;}
.buy-cont{padding: 10px 30px 30px 30px;}
.buy-cont p{display: flex;justify-content: space-between;line-height: 30px;position: relative;}
.buy-cont p input{display: block;width: 100%;height: 30px;background-color: transparent;border: 1px solid #54616c;color: #aeb7d0;}
.buy-cont p input.error{border-color: #e53f3f;}
.buy-cont p em.asterisk{position: relative;top: 5px;line-height: 0;font-size: 18px;color:#11a8fe;}
.buy-cont p em.unit{font-size: 12px;color: #11a8fe}
.buy-cont p a{position: absolute;z-index: 10;top: 1px;right: 5px;color: #11a8fe;}
.buy-cont p a:hover{color: #15c9ff;}
.buy-cont p .label-left{min-width:60px;}
.buy-cont p .trade-limit{padding-top: 5px;padding-bottom: 5px;line-height: 0;}
.buy-cont p .trade-limit em{display: inline-block;line-height: 20px;vertical-align: top;}
.buy-cont p .trade-limit em:first-of-type{max-width: 168px;text-align: right;}
.btn {text-align: right;}
.btn span{display: inline-block;vertical-align: top;width: 74px;height: 30px;line-height: 30px;text-align: center;border-radius: 4px;cursor: pointer;}
.cancel{box-sizing: border-box;color: #11a8fe;border: 1px solid #11a8fe;}
.cancel:hover{color: #15c9ff;border-color: #15c9ff;}
.cimfir{color: #fff;background-color: #11a8fe;}
.cimfir:hover{background-color: #15c9ff;}
.cimfir.disabled{background-color: #999;cursor:not-allowed;}
.cimfir.disabled:hover{background-color: #999;}
.msg{height: 30px;color: #e53f3f;}
</style>

