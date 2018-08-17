<template>
  <div class="ad-confirm">
      <div class="title">{{$t(item.ad_type === 1 ? 'otc_exchange.otc_exchange_buy' : 'otc_exchange.otc_exchange_sell')}} {{item.symbol}}</div>
      <ul class="ad-detail">
          <li class="ad-row ad-row-header">
              <span class="ad-price">{{$t('public0.public256')}}<!--当前价格--></span>
              <span class="ad-amount">{{$t('otc_ad.otc_ad_Premium')}}<!--溢价--></span>
              <span class="ad-money">{{tradeParams.title}}</span>
              <span class="ad-pay">{{$t('otc_ad.otc_ad_Payment_method')}}<!--支付方式--></span>
          </li>
          <li class="ad-row">
              <span class="ad-price">{{item.lowestPrice}} {{item.currency}}</span>
              <span class="ad-amount">{{item.price_rate || '--'}}%</span>
              <span class="ad-money">{{item.lowest_price || '--'}} {{item.currency}}</span>
              <span class="ad-pay">
                  <em v-for="item in paylist" :key="item.id" :class="item.css"></em>
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
    },
    tradeParams () {
      if (this.item.ad_type === 2) {
        return {
          title: this.$t('public0.public137') // 可接受的最高单价
        }
      } else if (this.item.ad_type === 1) {
        return {
          title: this.$t('public0.public136') // 可接受的最低单价
        }
      }
    }
  }
}
</script>

<style scoped>
.ad-confirm{width:560px;}
.title{height:34px;line-height:34px;font-weight:bold;font-size:16px;color:#11a8fe;border-bottom:1px solid #283149;}
.ad-row{overflow: auto}
.ad-row-header{color:#8a93a8;}
.ad-row /deep/ span{float: left;min-height: 30px;line-height: 30px;padding-right: 10px;}
.ad-row /deep/ span:last-of-type{padding-right:0;}
.ad-price{width:150px;}
.ad-amount{width:130px;}
.ad-money{width:150px;}
.ad-pay{width:100px;text-align: right}
.ad-pay /deep/ em{margin-left:4px;}
</style>
