<template>
  <div >
    <div class="type_symbol">
      <div class="type_symbol_wrap">
        <ul>
          <li v-for="(item, index) in products" :key="index">
            <div class="currency">
              {{item.currencySymbol}}/{{item.baseSymbol}} <i :class="[{infotip:true}, (getDirection(item.direction)===1 || getDirection(item.direction)===0)?'font-green':'font-red']" v-html="percent(item)"></i>
            </div>
            <div class="ticker-list">
              <p class="price" :class="[(getDirection(item.direction)===1 || getDirection(item.direction)===0)?'font-green':'font-red']">{{toFixed(item.lastPrice)}}</p>
              <p class="value">≈<valuation :lastPrice="item.lastPrice" :baseSymbol="item.baseSymbol"/></p>
              <p class="volume">Volume: {{toFixed(item.dealAmount,2)}}{{item.baseSymbol}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>
<script>
  import marketApi from '@/api/market'
  import numUtils from '@/assets/js/numberUtils'
  import valuation from '@/components/valuation'
  export default {
    components: {
      valuation
    },
    data () {
      return {
        fixedNumber: 8,
        products: []
      }
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
          this.products = res.filter(item=>{
            return item.baseSymbol === 'USDS'
          })
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
      }
    }
  }
</script>
<style scoped>
  .container .font-white{color:#becbe8;}
  .container .font-red{color:#f34246;}
  .container .font-green{color:#56cf43;}
  .container{width:100%;height:895px;}
  .currency{color:#9ba6e6;font-size: 22px;}
  .ticker-list {margin-top: 30px;}
  .ticker-list .price {font-size: 24px;}
  .ticker-list .value {font-size: 24px; margin-top: 10px; color: #9ba6e6;}
  .ticker-list .volume {font-size: 20px; margin-top: 30px; color: #9ba6e6;}
  .ticker-list em{font-size: 14px;color: #727272;}
  .type_symbol{width: 100%;background-color:#0c151d;overflow: hidden;min-height:20px; border-top: 1px solid #fff;}
  .type_symbol ul{display:flex;text-align:center;justify-content:center;align-items: center;flex-flow: wrap}
  .type_symbol ul li{font-size: 14px; padding: 20px 10px 40px;width: 20%;text-align: left; border-right: 1px solid #fff;}
  .type_symbol ul li:last-child{border-right: none;}
  .infotip{float: right; font-size: 18px; padding: 9px 6px; border-radius: 3px;}
  .infotip.font-green {background-color: rgba(243,66,70,.3)}
  .infotip.font-red {background-color: rgba(86,207,67,.3)}
  .volume{font-size: 12px;}
  .type_symbol_wrap{min-width:1190px; max-width:1360px; margin: 0 auto;}
  .type_symbol ul li div{line-height: 21px;}
  .currency .icon-btc,.currency .icon-eth{vertical-align: middle;line-height: 21px;}
</style>
