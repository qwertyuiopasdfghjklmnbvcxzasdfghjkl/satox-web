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
.bus{min-height: 110px;margin-bottom: 8px;background-color: #FFF; border-radius: 4px; box-shadow: 0 1px 3px #e2e2e2; overflow: hidden;}
.bus ul{display: flex;justify-content: space-between;}
.bus ul li{text-align: center;}
.bus ul li.buy{width: 150px;}
.bus ul li.sell{width: 149px;border-left: 1px solid #eee;}
.bus ul li > a{display: block;height: 70px;line-height: 70px;color: #666;background-color: #fff; font-size: 18px; border-bottom: 1px solid #eee;}
.bus ul li.buy > a.current{color: #fff;background-color: #3283FF;}
.bus ul li.sell > a.current{color: #fff;background-color: #3283FF;}
.bus-ul-li-div span{display: block;}
.bus-ul-li-div span a{display: block;height: 65px;line-height: 65px;font-weight: bold;font-size: 16px;color: #666;font-weight:bold;}
.buy .bus-ul-li-div span a:hover,
.buy .bus-ul-li-div span a.active{color: #3182FF;}
.sell .bus-ul-li-div span a:hover,
.sell .bus-ul-li-div span a.active{color: #3182FF;}
.bus-ul-li-div span i{padding-right: 16px; font-size: 30px; vertical-align: middle;}
</style>

