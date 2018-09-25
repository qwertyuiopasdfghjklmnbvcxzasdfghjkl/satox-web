<template>
    <div class="home">
        <div class="center">
          <div class="home-left">
            <left ref="markets" :baseSymbol="baseSymbol" v-model="accuracy" :symbol="symbol" :toFixed="toFixed" @changeSymbol="changeSymbol"></left>
          </div>
          <div class="home-center">
            <div class="home-center-top">
              <div class="top-left-header">
                <ul>
                  <li class="last-item">
                    <img class="symbol-icon" :src="iconUrl"/>
                    <span>{{currentSymbol}}/{{baseSymbol}}</span>
                    <em class="icon-introduction" :title="$t('public.introduction')" @click="showCoinInfo"></em>
                  </li>
                </ul>
                <ul class="top-left-header-right">
                  <li class="last-item">
                    <span class="last-price market-symbol" :class="[(getLast24h.direction===1  || getLast24h.direction===0) ? 'font-green':'font-red']">
                      {{toFixed(getLast24h.close)}}
                      <font class="last-valuation-price"> ≈ <valuation :lastPrice="getLast24h.close" :baseSymbol="baseSymbol"/></font>
                    </span>
                  </li>
                  <li class="last-item last-change">
                    <span class="last-title">{{$t('home.home_change_24h')}}<!--24h涨跌--></span>
                    <span class="last-price" :class="[getLast24h.isDown?'last-number-down':'last-number']">{{getLast24h.rfvol}} {{getLast24h.percent}}%</span>
                  </li>
                  <li class="last-item">
                    <span class="last-title">{{$t('home.home_high_24h')}}<!--24h最高价--></span>
                    <span class="last-price">{{toFixed(getLast24h.high)}}</span>
                  </li>
                  <li class="last-item">
                    <span class="last-title">{{$t('home.home_low_24h')}}<!--24h最低价--></span>
                    <span class="last-price">{{toFixed(getLast24h.bottom)}}</span>
                  </li>
                  <li class="last-item">
                    <span class="last-title">{{$t('home.home_volume_24h')}}<!--24h成交量--></span>
                    <span class="last-price">{{toFixed(getLast24h.vol, 2)}} {{baseSymbol}}</span>
                  </li>
                </ul>
              </div>
              <div class="market-container">
                <market ref="kline" :iconUrl="iconUrl" :klineData="klineData" :baseSymbol="baseSymbol" :currentSymbol="currentSymbol" :symbol="symbol" @switchPeriod="switchPeriod" :closeMainLoading="closeMainLoading"/>
              </div>
            </div>
            <div class="home-center-bottom">
              <businesspanel ref="businesspanel" :accuracy="accuracy" :fixedNumber="fixedNumber" :baseSymbol="baseSymbol" :currentSymbol="currentSymbol" :toFixed="toFixed" :fromWallet="fromWallet" :toWallet="toWallet"/>
              <entrust ref="entrust" :valuationCout="valuationCout" :newRmbCount="newRmbCount" :currentSymbol="currentSymbol" :baseSymbol="baseSymbol" :fixedNumber="fixedNumber" :symbol="symbol" :toFixed="toFixed" :mul="mul" :changeEntrustData="changeEntrustData"/>
            </div>
          </div>
          <div class="home-right">
            <depth ref="depth" :currentSymbol="currentSymbol" :baseSymbol="baseSymbol" :fixedNumber="fixedNumber"/>
            <lastdeal ref="lastdeal" :currentSymbol="currentSymbol" :baseSymbol="baseSymbol" :fixedNumber="fixedNumber" :symbol="symbol" :toFixed="toFixed"/>
          </div>
        </div>
    </div>
</template>
<script>
import left from '@/exchanges/market/market'
import market from '@/exchanges/market'
import depth from '@/exchanges/market/depth'
import lastdeal from '@/exchanges/market/lastdeal'
import entrust from '@/exchanges/market/entrust'
import businesspanel from '@/exchanges/market/businesspanel'
import KLineWebSocket from '@/assets/js/websocket'
import marketApi from '@/api/market'
import numUtils from '@/assets/js/numberUtils'
import { mapGetters, mapActions } from 'vuex'
import config from '@/assets/js/config'
import valuation from '@/components/valuation'
let chartSettings = window.localStorage.getItem('chartSettings')
chartSettings && (chartSettings = JSON.parse(chartSettings))

export default {
  components: {
    left,
    market,
    depth,
    lastdeal,
    entrust,
    valuation,
    businesspanel
  },
  data () {
    return {
      isFirst: true,
      accuracy: 8,
      fixedNumber: 8,
      klineData: [], // k线数据
      socket: null,
      fromWallet: null,
      toWallet: null,
      changeEntrustData: {},
      closeMainLoading: false,
      valuationCout: 0, // 当前估值
      newRmbCount: 0 // 最新人民币估值
    }
  },
  computed: {
    ...mapGetters(['getApiToken', 'getLast24h', 'getMarketConfig']),
    baseSymbol () {
      let symbol = this.$route.params.symbol
      if (symbol) {
        symbol = symbol.split('_')[1]
        return symbol ? symbol.toUpperCase() : 'BTC'
      } else {
        return 'BTC'
      }
    },
    currentSymbol () {
      let symbol = this.$route.params.symbol
      if (symbol) {
        symbol = symbol.split('_')[0]
        return symbol ? symbol.toUpperCase() : 'ETH'
      } else {
        return 'ETH'
      }
    },
    symbol () {
      return `${this.currentSymbol}${this.baseSymbol}`
    },
    iconUrl () {
      if (!this.getMarketConfig) {
        return null
      }
      let d = this.getMarketConfig[this.symbol]
      if (!d) {
        return null
      }
      return d.iconBase64 ? `data:image/png;base64,${d.iconBase64}` : config.origin + d.iconUrl
    }
  },
  watch: {
    getApiToken () {
      this.socket && this.socket.changeLogin()
    },
    symbol () {
      this.get24hPrice()
      this.socket && this.socket.switchPeriod && this.socket.switchSymbol(this.symbol)
    }
  },
  created () {
    this.socket = KLineWebSocket({
      symbol: this.symbol,
      period: chartSettings ? chartSettings.charts.period : null,
      callback: (res) => {
        if (res.symbol && res.symbol !== this.symbol) {
          console.log(`市场数据不匹配...`)
          return
        }
        // K线图数据
        if (res.dataType === 'kline') { // K线图数据
          let klineDatas = this.klineData
          let datas = res.data && res.data.constructor === Array ? res.data : []
          let newArray = []
          datas.forEach((item) => {
            newArray.push([Number(item[0]), parseFloat(item[1]) || 0, parseFloat(item[2]) || 0, parseFloat(item[3]) || 0, parseFloat(item[4]) || 0, parseFloat(item[5]) || 0])
          })
          if (!this.isFirst) {
            let tempObj = {}
            newArray.forEach((item) => {
              tempObj[String(item[0])] = item
            })
            for (let i = 0; i < klineDatas.length; i++) {
              let td = klineDatas[i]
              if (tempObj[String(td[0])]) {
                klineDatas.splice(i, 1, tempObj[String(td[0])])
                delete tempObj[String(td[0])]
              }
            }
            newArray.forEach((item) => {
              if (tempObj[String(item[0])]) {
                klineDatas.push(item)
              }
            })
          } else {
            this.isFirst = false
            this.klineData = newArray
          }
        } else if (res.dataType === 'LastOrderBook') {
          // 深度数据
          let data = res.data
          this.tiggerEvents({
            name: 'depthEvent',
            params: {
              type: 'updateDatas',
              asks: data.asks || [],
              bids: data.bids || []
            }
          })
          this.tiggerEvents({
            name: 'klineEvent',
            params: {
              type: 'depth',
              asks: data.asks || [],
              bids: data.bids || []
            }
          })
        } else if (res.dataType === 'LastPrice') {
          // 24小时最新信息
          this.setLast24h(res.data)
        } else if (res.dataType === 'LastAccounts') {
          // 用户账户余额
          this.tiggerEvents({
            name: 'balanceEvent',
            params: {
              type: 'updateData',
              data: res.data
            }
          })
        } else if (res.dataType === 'LastUserOrderBook') {
          // 当前委托
          this.tiggerEvents({
            name: 'extrustEvent',
            params: {
              type: 'current',
              data: res.data
            }
          })
        } else if (res.dataType === 'LastHistoryBook') {
          // 历史委托
          this.tiggerEvents({
            name: 'extrustEvent',
            params: {
              type: 'history',
              data: res.data
            }
          })
        } else if (res.dataType === 'LastTrades') {
          // 最新交易记录
          this.tiggerEvents({
            name: 'lastdealEvent',
            params: {
              type: 'updateData',
              data: res.data
            }
          })
        } else if (res.dataType === 'markets') {
          // 市场信息
          this.tiggerEvents({
            name: 'marketEvent',
            params: {
              type: 'updateData',
              data: res.data
            }
          })
        }
      },
      onClose: () => {
        this.isFirst = true
        this.closeMainLoading = true
      }
    })

    this.get24hPrice()
  },
  methods: {
    ...mapActions(['setLast24h', 'tiggerEvents']),
    get24hPrice () {
      // 获取24小时最新价格
      marketApi.get24hPrice({
        symbol: this.symbol
      }, (res) => {
        // 24小时最新信息
        this.setLast24h(res)
      })
    },
    toFixed (value, fixed) {
      return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.fixedNumber : fixed)
    },
    mul (price, v1, v2) {
      if (numUtils.BN(price).equals(numUtils.BN(-1))) {
        return '暂无'// 市价
      }
      return numUtils.mul(v1, v2).toFixed(this.fixedNumber)
    },
    switchPeriod (period) {
      this.isFirst = true
      this.socket && this.socket.switchPeriod && this.socket.switchPeriod(period)
    },
    changeSymbol (baseSymbol, currentSymbol) {
      this.klineData = []
      this.$router.push({name: 'exchange_index', params: {symbol: `${currentSymbol}_${baseSymbol}`}})
    },
    showCoinInfo () {
      this.tiggerEvents({
        name: 'klineEvent',
        params: {
          type: 'showCoinInfo'
        }
      })
    }
  },
  beforeDestroy () {
    this.setLast24h()
    this.socket && this.socket.close()
  }
}
</script>
<style scoped>
/* 红涨绿跌 */
.home{min-width:1200px;min-height:500px;height:calc(100% - 60px);}
.center{display:flex;justify-content:space-between;height:100%;}
.home-left{display:flex;width:15.7%;margin:10px 0 10px 10px;}
.home-center{flex:1;display:flex;flex-flow:column;min-width:500px;margin:10px;}
.home-center-top{flex:1;display:flex;flex-flow:column;min-height:0;}
.home-center-bottom{margin-top:10px;}
.top-left-header{display:flex;font-size:18px;color:#fff;height:50px;margin-bottom: 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;align-items:center;background-color:#333232;justify-content:space-between;}
.top-left-header > ul{display:flex;align-items:center;height:100%;}
.top-left-header-right{flex:1;justify-content:space-between;}
/*.symbol-icon{background-color:#fff;width:32px;height:32px;border-radius:50%;color:#181b2a;display:flex;justify-content:center;align-items:center;font-size:26px;margin-right:10px;}*/
.symbol-icon{width:32px;height:32px;margin-right:10px;border-radius:50%;}
.market-symbol{font-size:18px;}
.last-item{display:flex;padding-right:10px;flex-flow:column;}
.last-item:not(:first-child){margin-left:40px;justify-self:flex-end;}
.top-left-header > ul:first-child .last-item:first-child{flex-flow:initial;margin-left:10px;font-weight:bold;align-items:center;font-size:20px;}
.last-title{font-size:12px;color:#a1a8bb;}
.last-price{font-size:16px;font-weight:bold;color:#cbd4ec;}
.last-valuation-price{font-size:16px;font-weight:normal;color:#cbd4ec;}
.last-number,.font-green{color:#0ee7a5;}
.last-number-down,.font-red{color:#ff7342;}
.market-container{width:100%;display:flex;flex:1;min-height:0;overflow:hidden;}
.top-right{height:100%;margin-right:10px;}
.bottom{width:100%;height:290px;margin-top:10px;display:flex;justify-content:space-between;}
.bottom-left{width:calc(100% - 400px);height:100%;display:flex;justify-content:space-between;}
.bottom-right{height:100%;}
.home-right{width:20.7%;display:flex;flex-flow:column;margin:10px 10px 10px 0;}
.icon-introduction{width: 24px;height: 24px;margin-left: 4px;background: url(../assets/images/tips_icon.png) no-repeat center center / 18px 18px;cursor: pointer;}

@media screen and (max-width: 1600px) and (max-height: 900px) {
  .home{height:calc(100% - 54px)}
  .top-left-header{height:40px;}
  .symbol-icon{width:26px;height:26px;font-size:22px;}
  .top-left-header > ul:first-child .last-item:first-child{font-size:16px;}
  .last-item:not(:first-child){margin-left:10px;}
  .last-title{font-size:12px;}
  .last-price{font-size:14px;}
  .market-symbol{font-size:16px;}
  .last-valuation-price{font-size:12px;}
}
@media screen and (max-width: 1600px){
  .home-left{margin:4px 0 4px 4px;}
  .home-center{margin:4px;}
  .home-right{margin:4px 4px 4px 0;}
  .home-center-bottom{margin-top:4px;}
}
</style>

