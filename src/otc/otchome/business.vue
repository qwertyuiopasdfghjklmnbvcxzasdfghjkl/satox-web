<template>
  <div class="bus">
    <ul>
        <li class="buy">
            <a :class="{current: params.ad_type === 2}" href="javascript:;" @click="switchSymbol(2, coins[0].symbol)">{{$t('otc_exchange.otc_exchange_want_buy')}}<!--我要买币--></a>
            <div class="bus-ul-li-div">
                <span v-for="coin in coins" :key="coin.symbol">
                    <a :class="{active: params.ad_type === 2 && params.symbol === coin.symbol}" href="javascript:;" @click="switchSymbol(2, coin.symbol)">
                      <i :class="[`icon-${coin.symbol.toLowerCase()}`]"></i>{{coin.symbol}}
                    </a>
                </span>
            </div>
        </li>
        <li class="sell">
            <a :class="{current: params.ad_type === 1}" href="javascript:;" @click="switchSymbol(1, coins[0].symbol)">{{$t('otc_exchange.otc_exchange_want_sell')}}<!--我要卖币--></a>
            <div class="bus-ul-li-div">
                <span v-for="coin in coins" :key="coin.symbol">
                    <a :class="{active: params.ad_type === 1 && params.symbol === coin.symbol}" href="javascript:;" @click="switchSymbol(1, coin.symbol)">
                      <i :class="[`icon-${coin.symbol.toLowerCase()}`]"></i>{{coin.symbol}}
                    </a>
                </span>
            </div>
        </li>
    </ul>
  </div>
</template>

<script>
import otcConfig from '@/assets/js/otcconfig'
export default {
  props: ['params'],
  data () {
    return {
      coins: otcConfig.coins
    }
  },
  methods: {
    switchSymbol (adType, symbol) {
      this.params.ad_type = adType
      this.params.symbol = symbol
    }
  }
}
</script>


<style scoped>
.bus{min-height: 110px;margin-bottom: 8px;background-color: #FFF;}
.bus ul{display: flex;justify-content: space-between;}
.bus ul li{text-align: center;}
.bus ul li.buy{width: 150px;}
.bus ul li.sell{width: 149px;border-left: 1px solid #333232;}
.bus ul li > a{display: block;height: 30px;line-height: 30px;color: #aeb7d0;background-color: #333232;}
.bus ul li.buy > a.current{color: #261003;background-color: #fdb902;}
.bus ul li.sell > a.current{color: #261003;background-color: #fdb902;}
.bus-ul-li-div span{display: block;}
.bus-ul-li-div span a{display: block;height: 40px;line-height: 40px;font-weight: bold;font-size: 14px;color: #261003;font-weight:bold;}
.buy .bus-ul-li-div span a:hover,
.buy .bus-ul-li-div span a.active{color: #fdb902;}
.sell .bus-ul-li-div span a:hover,
.sell .bus-ul-li-div span a.active{color: #fdb902;}
.bus-ul-li-div span i{padding-right: 16px;}
</style>

