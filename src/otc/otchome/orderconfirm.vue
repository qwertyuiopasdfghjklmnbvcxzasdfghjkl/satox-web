<template>
  <div class="order-confirm">
      <div class="title">{{$t(item.trade_type === 1 ? 'exchange.exchange_buy' : 'otc_exchange.otc_exchange_sell')}} {{item.symbol}}</div>
      <ul class="order-detail">
          <li class="order-row order-row-header">
              <span class="order-price">{{$t('otc_exchange.otc_exchange_bid')}}<!--单价--></span>
              <span class="order-amount">{{$t('exchange.exchange_amount')}}<!--数量--></span>
              <span class="order-money">{{$t('exchange.exchange_total')}}<!--金额--></span>
              <span class="order-pay">{{$t('otc_ad.otc_ad_Payment_method')}}<!--支付方式--></span>
          </li>
          <li class="order-row">
              <span class="order-price">{{item.cur_price}} {{item.currency}}</span>
              <span class="order-amount">{{item.symbol_count}} {{item.symbol}}</span>
              <span class="order-money">{{item.currency_count}} {{item.currency}}</span>
              <span class="order-pay">
                  <em v-for="data in paylist" :key="data.id" :class="data.css" v-if="item.matchPayType.indexOf(data.id) !== -1"></em>
              </span>
          </li>
      </ul>
  </div>
</template>

<script>
import otcConfig from '@/assets/js/otcconfig'
export default {
  props: ['item'],
  computed: {
    paylist () {
      let datas = []
      let payType = this.item.pay_type || ''
      otcConfig.payments.forEach((item) => {
        if (payType.indexOf(item.id) !== -1) {
          datas.push(item)
        }
      })
      return datas
    }
  }
}
</script>

<style scoped>
.order-confirm{width:560px;}
.title{height:34px;line-height:34px;font-weight:bold;font-size:16px;color:#11a8fe;border-bottom:1px solid #333232;}
.order-row{overflow: auto}
.order-row-header{color:#8a93a8;}
.order-row /deep/ span{float: left;min-height: 30px;line-height: 30px;padding-right: 10px;}
.order-row /deep/ span:last-of-type{padding-right:0;}
.order-price{width:150px;}
.order-amount{width:160px;}
.order-money{width:150px;}
.order-pay{width:70px;text-align: right}
.order-pay /deep/ em{margin-left:4px;}
</style>
