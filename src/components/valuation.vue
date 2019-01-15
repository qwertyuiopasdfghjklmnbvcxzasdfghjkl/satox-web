<template>
  <font>{{getCoinSign}}{{curPrice}}</font>
</template>

<script>
import { mapGetters } from 'vuex'
import numUtils from '@/assets/js/numberUtils'
export default {
  props: ['lastPrice', 'baseSymbol'],
  computed: {
    ...mapGetters(['getCoinSign', 'getUSDCNY', 'getUsdRate', 'getBtcValues', 'getLang']),
    curPrice () {
      let lastPrice = this.lastPrice
      if (lastPrice && this.getUSDCNY) {
        if (this.baseSymbol === 'USDT') {
          if (this.getLang === 'en') {
            return numUtils.BN(lastPrice).toFixed(6).toMoney()
          }
          return numUtils.div(lastPrice, this.getUsdRate).toFixed(6).toMoney()
        } else if (this.baseSymbol === 'ATN') {
          if (this.getLang === 'en') {
            return numUtils.mul(lastPrice, '0.1').toFixed(6).toMoney()
          }
          return numUtils.div(numUtils.mul(lastPrice, '0.1'), this.getUsdRate).toFixed(6).toMoney()
        } else if (this.baseSymbol === 'MECoin') {
          if (this.getLang === 'en') {
            return numUtils.mul(lastPrice, '0.25').toFixed(6).toMoney()
          }
          return numUtils.div(numUtils.mul(lastPrice, '0.25'), this.getUsdRate).toFixed(6).toMoney()
        }
        let curMarketBtc = this.getBtcValues[this.baseSymbol]
        if (!curMarketBtc && this.baseSymbol !== 'BTC') {
          return '--'
        }
        let curMarketPrice = curMarketBtc ? numUtils.mul(curMarketBtc, this.getUSDCNY).toFixed(6) : this.getUSDCNY
        return numUtils.mul(lastPrice, curMarketPrice).toFixed(6).toMoney()
      } else {
        return '0.000000'
      }
    }
  }
}
</script>
