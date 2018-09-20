<template>
  <div >
    <div class="type_symbol">
      <div class="type_symbol_wrap">
        <ul>
          <li v-for="(item, index) in products" :key="index">
            <div class="currency">
              {{item.currencySymbol}}/{{item.baseSymbol}} <i :class="[{infotip:true}, (getDirection(item.direction)===1 || getDirection(item.direction)===0)?'font-green':'font-red']" v-html="percent(item)"></i>
            </div>
            <div  class="ticker-list">
              <p><span :class="[(getDirection(item.direction)===1 || getDirection(item.direction)===0)?'font-green':'font-red']">{{toFixed(item.lastPrice)}} </span> <span class="t-right">{{getCoinSign}} {{getCurPrice(item)}}</span></p>
              <span class="volume">Volume: {{toFixed(item.dealAmount,2)}}BTC</span>
            </div>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import marketApi from '@/api/market'
  import numUtils from '@/assets/js/numberUtils'
  export default {
    data () {
      return {
        fixedNumber: 8,
        products: []
      }
    },
    computed: {
      ...mapGetters(['getUSDCNY', 'getCoinSign', 'getBtcValues', 'getUsdRate', 'getLang'])
    },
    created () {
      this.getMarketCom()
    },
    methods: {
      getDirection (direction) { //  1 买  绿色  2 卖 红色
        return parseInt(direction || 0)
      },
      toFixed (value, fixed) {
        return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.fixedNumber : fixed)
      },
      getMarketCom () {
        // 获取推荐市场
        marketApi.marketListCom(1, (res) => {
          this.products = res
        }, () => {
        })
      },
      percent (item) {
        if (numUtils.BN(item.openingPrice).equals(0)) {
          return '0.00%'
        } else if (item.openingPrice && item.lastPrice) {
          var percent = numUtils.mul(numUtils.BN(item.change24h).div(item.openingPrice), 100)
          return `<font color="${percent < 0 ? '#990000' : '#009933'}">` + percent.toFixed(2) + '%</font>'
        } else {
          return '0.00%'
        }
      },
      getCurPrice (data) {
        if (data.lastPrice && this.getUSDCNY) {
          if (data.baseSymbol === 'USDT') {
            if (this.getLang === 'en') {
              return numUtils.BN(data.lastPrice).toFixed(2).toMoney()
            }
            return numUtils.div(data.lastPrice, this.getUsdRate).toFixed(2).toMoney()
          } else if (data.baseSymbol === 'ATN') {
            if (this.getLang === 'en') {
              return numUtils.mul(data.lastPrice, '0.1').toFixed(2).toMoney()
            }
            return numUtils.div(numUtils.mul(data.lastPrice, '0.1'), this.getUsdRate).toFixed(2).toMoney()
          }
          let curMarketBtc = this.getBtcValues[data.baseSymbol]
          let curMarketPrice = curMarketBtc ? numUtils.mul(curMarketBtc, this.getUSDCNY).toFixed(2) : this.getUSDCNY
          return numUtils.mul(data.lastPrice, curMarketPrice).toFixed(2).toMoney()
        } else {
          return '0.00'
        }
      }
    }
  }
</script>
<style scoped>
  .container .font-white{color:#becbe8;}
  .container .font-red{color:#990000;}
  .container .font-green{color:#009933;}
  .container{width:100%;height:895px;}
  .currency{color:#000000;font-size: 16px;}
  .ticker-list {font-size: 14px;color: #000000;margin-top: 10px;}
  .ticker-list em{font-size: 14px;color: #727272;}
  .type_symbol{width: 100%;background-color:#100E0E;overflow: hidden;min-height:16px;}
  .type_symbol ul{display:flex;text-align:center;justify-content:center;align-items: center;flex-flow: wrap}
  .type_symbol ul li{font-size: 14px;background-color: #FFF;padding: 10px;width: 210px;text-align: left;margin: 16px 0;margin-right:12.5px;}
  .type_symbol ul li:last-child{margin-right:0;}
  .infotip{float: right;font-size: 12px;}
  .volume{font-size: 12px;}
  .type_symbol_wrap{width:1200px; margin: 0 auto}
  .type_symbol ul li div{line-height: 21px;}
  .currency .icon-btc,.currency .icon-eth{vertical-align: middle;line-height: 21px;}
</style>
