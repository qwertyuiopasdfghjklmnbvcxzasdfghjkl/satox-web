<template>
  <div>
    <div class="type_symbol">
      <div class="type_symbol_wrap">
        <ul>
          <li v-for="(item, index) in products" :key="index">
            <div class="currency">
              <span><img :src="`data:image/png;base64,${item.iconBase64}`"/>{{item.currencySymbol}}/{{item.baseSymbol}}</span>
              <i :class="[{infotip:true}, (getDirection(item.direction)===1 || getDirection(item.direction)===0)?'font-green':'font-red']"
              v-html="percent(item)"></i>
            </div>
            <div class="ticker-list">
              <p class="price"
                 :class="[(getDirection(item.direction)===1 || getDirection(item.direction)===0)?'font-green':'font-red']">
                {{toFixed(item.lastPrice, item.accuracy)}}</p>
              <p class="value">≈
                <valuation :lastPrice="item.lastPrice" :baseSymbol="item.baseSymbol"/>
              </p>
              <p class="volume">Volume: {{toFixed(item.dealAmount, 2)}}{{item.baseSymbol}}</p>
            </div>
            <div class="line-box">
              <v-chart class="echart" :options="getBar(item.kline||[])"/>
            </div>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>
<script>
  import Vue from 'vue'
  import marketApi from '@/api/market'
  import numUtils from '@/assets/js/numberUtils'
  import valuation from '@/components/valuation'
  import getBar from '@/assets/js/bar'

  export default {
    components: {
      valuation
    },
    data() {
      return {
        fixedNumber: 8,
        products: [],
        getBar: getBar,
      }
    },
    created() {
      this.getMarketCom()
    },
    methods: {
      getDirection(direction) { //  1 买  绿色  2 卖 红色
        return parseInt(direction || 0)
      },
      toFixed(value, fixed) {
        return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.fixedNumber : fixed)
      },
      getMarketCom() {
        // 获取推荐市场
        marketApi.marketListCom(1, (res) => {
          this.products = res.filter(item => {
            return item.baseSymbol === 'USDT'
          })

          for (let item of this.products) {
            this.getKlineData(item.market)
          }

        }, () => {
        })
      },
      getKlineData(symbol) {
        let data = {
          symbol: symbol,
          period: '1h',
          size: 24
        }
        marketApi.getKlineData(data, res => {
          for (let item of this.products) {
            if (item.market === symbol) {
              Vue.set(item, 'kline', res)
              break
            }
          }
        })
      },
      percent(item) {
        if (numUtils.BN(item.openingPrice).equals(0)) {
          return '0.00%'
        } else if (item.openingPrice && item.lastPrice) {
          var percent = numUtils.mul(numUtils.BN(item.change24h).div(item.openingPrice), 100)
          return `<font color="${percent < 0 ? '#E44242' : '#00CC74'}">` + percent.toFixed(2) + '%</font>'
        } else {
          return '0.00%'
        }
      }
    }
  }
</script>
<style scoped>
  .container .font-white {
    color: #becbe8;
  }

  .container .font-red {
    color: #E44242;
  }

  .container .font-green {
    color: #00CC74;
  }

  .container {
    width: 100%;
    height: 895px;
  }

  .currency {
    color: #BA8D35;
    font-size: 18px;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .currency span{
    display: flex;
    align-items: center;
  }
  .currency span img{
    width: 30px;
    margin-right: 10px;
  }
  .ticker-list {
    /*margin-top: 30px;*/
    padding: 0 20px;
  }

  .ticker-list .price {
    font-size: 24px;
  }

  .ticker-list .value {
    font-size: 16px;
    margin-top: 14px;
    color: #CBCBCB;
  }

  .ticker-list .volume {
    font-size: 16px;
    margin-top: 6px;
    color: #CBCBCB;
  }

  .ticker-list em {
    font-size: 14px;
    color: #727272;
  }

  .type_symbol {
    width: 100%;
    background-color: #262525;
    overflow: hidden;
    min-height: 20px;
    /*border-top: 1px solid #fff;*/
  }

  .type_symbol ul {
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    flex-flow: wrap;
    padding: 20px;
  }

  .type_symbol ul li {
    font-size: 14px;
    width: 23%;
    text-align: left;
    background: #202020;
    border-radius: 10px;
    margin-right: 20px;
    overflow: hidden;
  }
  .type_symbol ul li:last-child{
    margin-right: 0;
  }


  .infotip {
    float: right;
    font-size: 16px;
    padding: 9px 6px;
    border-radius: 3px;
  }

  .volume {
    font-size: 12px;
  }

  .type_symbol_wrap {
    min-width: 1190px;
    max-width: 1360px;
    margin: 0 auto;
    background: #121212;
    margin-top: 20px;
  }

  .type_symbol ul li div {
    line-height: 21px;
  }

  .currency .icon-btc, .currency .icon-eth {
    vertical-align: middle;
    line-height: 21px;
  }
  .line-box{
    height: 80px;
  }
  .echart{
    width: 100%;
    height: 80px;
  }
</style>
