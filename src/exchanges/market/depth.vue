<template>
  <div class="depth">
        <div class="top">
            <div class="top-layout">
                <em class="top-stats-dots bid-color" :class="{active:active==='bid'}" @click="active='bid'"></em>
                <em class="top-stats-dots ask-color" :class="{active:active==='ask'}" @click="active='ask'"></em>
                <em class="top-stats-dots askbid-color" :class="{active:active==='askbid'}" @click="active='askbid'"></em>
            </div>
            <div class="top-right">
                <span>{{$t('exchange.exchange_Deep_merger')}}<!--深度合并--></span>
                <select class="top-select" v-model="mergeValue">
                    <option v-for="n in 4" :key="n + 4" :value="n + 4">{{n + 4}}{{$t('exchange.exchange_decimals')}}<!--位小数--></option>
                </select>
            </div>
        </div>
        <ul class="list">
            <li class="list-header list-item">
                <span class="list-col price" style="white-space:nowrap;">{{$t('exchange.exchange_price')}}<!--价格-->({{toCoin}})</span>
                <span class="list-col amount">{{$t('exchange.exchange_amount')}}<!--数量-->({{fromCoin}})</span>
                <span class="list-col sum">{{$t('exchange.exchange_Transaction_amount')}}<!--成交金额-->({{toCoin}})</span>
            </li>
        </ul>
        <div ref="parentListAsk" class="list-ask" v-if="active !== 'bid'" :style="askStyle">
            <ul ref="listAsk" class="list" :class="{'list-overflow': active === 'ask'}">
                <li class="list-item ask" v-for="n in askLength" :key="n">
                    <span class="list-col price price-ask ask-color">--</span>
                    <span class="list-col amount">--</span>
                    <span class="list-col sum">--</span>
                </li>
                <li class="list-item ask" :class="{'icon-arrow-right2':checkEntrustPrice(item)}" :style="listItemStyle(item, 'ask')" v-for="item in filterAsks" :key="item.orderBookId">
                    <span @click="clickChangeValue(toFixed(item.price), 'price')" class="list-col price price-ask ask-color">{{toFixed(item.price)}}</span>
                    <span @click="clickChangeValue(toFixed(item.avaliableAmount), 'amount')" class="list-col amount" :title="getAmountTitle(item.avaliableAmount)">{{toFixed(item.avaliableAmount, 2)}}</span>
                    <span @click="clickChangeValue(item, 'total')" class="list-col sum">{{muldepth(item.price, item.avaliableAmount)}}</span>
                </li>
            </ul>
        </div>
        <div class="lastprice" :class="{'lastprice-aob':active==='ask','lastprice-ask':getLast24h.direction===2,'lastprice-bid':(getLast24h.direction===1||getLast24h.direction===0)}">
            {{toFixed(this.getLast24h.close)}} {{curArrow}}
            <span class="lastprice-cny">{{getCoinSign}}{{curPrice}}</span>
            <em class="network-signal" :class="['signal-' + getNetworkSignal]" :title="getNetworkTitle"></em>
        </div>
        <div ref="parentListBid" class="list-bid" v-if="active !== 'ask'" :style="bidStyle">
            <ul class="list" :class="{'list-overflow': active === 'bid'}">
                <li class="list-item bid" :class="{'icon-arrow-right2':checkEntrustPrice(item)}" :style="listItemStyle(item, 'bid')" v-for="item in filterBids" :key="item.orderBookId" @click="clickChangeValue(item)">
                    <span @click="clickChangeValue(toFixed(item.price), 'price')" class="list-col price price-bid bid-color">{{toFixed(item.price)}}</span>
                    <span @click="clickChangeValue(toFixed(item.avaliableAmount), 'amount')" class="list-col amount" :title="getAmountTitle(item.avaliableAmount)">{{toFixed(item.avaliableAmount, 2)}}</span>
                    <span @click="clickChangeValue(item, 'total')" class="list-col sum">{{muldepth(item.price, item.avaliableAmount)}}</span>
                </li>
                <li class="list-item bid" v-for="n in bidLength" :key="n">
                    <span class="list-col price price-bid bid-color">--</span>
                    <span class="list-col amount">--</span>
                    <span class="list-col sum">--</span>
                </li>
            </ul>
        </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import numUtils from '@/assets/js/numberUtils'
import marketApi from '@/api/market'
export default {
  props: {
    baseSymbol: {
      type: String,
      default: ''
    },
    currentSymbol: {
      type: String,
      default: ''
    },
    fixedNumber: {
      type: Number
    }
  },
  data () {
    return {
      asks: [],
      bids: [],
      mergeLen: 0,
      mergeValue: 8,
      price: '0',
      active: 'askbid',
      direction: null
    }
  },
  computed: {
    ...mapGetters(['getLast24h', 'getUSDCNY', 'getEntrustPrices', 'getCoinSign', 'getNetworkSignal']),
    fromCoin () {
      return this.currentSymbol
    },
    toCoin () {
      return this.baseSymbol
    },
    curPrice () {
      if (this.getUSDCNY && this.getLast24h.close) {
        return numUtils.mul(this.getUSDCNY, this.getLast24h.close).toFixed(2).toMoney()
      } else {
        return '0.00'
      }
    },
    bidStyle () {
      return this.active === 'bid' ? {height: 'calc(100% - 94px)'} : {}
    },
    askStyle () {
      return this.active === 'ask' ? {height: 'calc(100% - 94px)'} : {}
    },
    filterAsks () {
      let asks = this.mergeDatas(this.asks)
      return asks.sort((item1, item2) => {
        return numUtils.BN(item1.price).lt(item2.price) ? 1 : -1
      })
    },
    filterBids () {
      return this.mergeDatas(this.bids)
    },
    askMax () {
      return this.getMaxAmount(this.filterAsks)
    },
    bidMax () {
      return this.getMaxAmount(this.filterBids)
    },
    askLength () {
      return Math.max(this.mergeLen - this.filterAsks.length, 0)
    },
    bidLength () {
      return Math.max(this.mergeLen - this.filterBids.length, 0)
    },
    keysEntrust () {
      let keys = {}
      this.getEntrustPrices.forEach((item) => {
        let price = this.toFixed(item[0])
        let direction = item[1]
        let key = price + '_' + direction
        keys[key] = true
      })
      return keys
    },
    curArrow () {
      if (Number(this.getLast24h.direction) === 2) {
        return '↓'
      } else if (Number(this.getLast24h.direction) === 1) {
        return '↑'
      } else {
        return null
      }
    },
    symbol () {
      return `${this.currentSymbol}${this.baseSymbol}`
    },
    getNetworkTitle () {
      if (!this.getNetworkSignal) {
        return this.$t('public.market_status_running')
      } else {
        return this.$t('public.market_status_delay')
      }
    }
  },
  watch: {
    filterAsks () {
      this.resize()
    },
    active () {
      this.resize()
    },
    symbol () {
      this.getDepthList()
    }
  },
  created () {
    this.$nextTick(() => {
      this.addEvents({
        name: 'depthEvent',
        fun: this.depthEvent
      })
    })
    this.getDepthList()
    window.addEventListener('resize', this.resize, false)
  },
  beforeDestroy () {
    this.removeEvents('depthEvent')
    window.removeEventListener('resize', this.resize, false)
  },
  methods: {
    ...mapActions(['setEntrustNewPrice', 'addEvents', 'removeEvents', 'tiggerEvents']),
    getDepthList () {
      // 获取深度信息
      marketApi.getDepths(this.symbol, (res) => {
        this.asks = res.asks //  卖
        this.bids = res.bids // 买
      })
    },
    mergeDatas (datas) {
      let mergeDatas = []
      let temp = {}
      datas.forEach((item) => {
        let key = this.toFixed(item.price)
        let tempItem = temp[key]
        if (!tempItem) {
          temp[key] = {
            price: key,
            avaliableAmount: item.avaliableAmount,
            direction: item.direction
          }
          mergeDatas.push(temp[key])
        } else {
          tempItem.avaliableAmount = numUtils.add(tempItem.avaliableAmount, item.avaliableAmount).toString()
        }
      })
      return mergeDatas
    },
    getMaxAmount (datas) {
      let len = datas.length
      if (!len) {
        return 0
      }
      let max = 0
      datas.forEach((item) => {
        max = Math.max(max, item.avaliableAmount)
      })
      return max
    },
    getAmountTitle (amount) {
      let a = this.toFixed(amount, 2)
      return numUtils.BN(a).equals(0) ? amount : null
    },
    depthEvent (res) {
      if (res && res.type === 'depthEvent') {
        this.direction = res.value
      } else if (res && res.type === 'updateDatas') {
        this.asks = res.asks
        this.bids = res.bids
      }
    },
    listItemStyle (item, type) {
      if (type === 'ask') { // 卖
        if (numUtils.BN(this.askMax).equals(0)) {
          return {}
        }
        let percent = Math.max(1, Math.min(100, numUtils.div(item.avaliableAmount, this.askMax).mul(100).toFixed(2)))
        return {'background-size': `${percent}% 90%`}
      } else if (type === 'bid') { // 买
        if (numUtils.BN(this.bidMax).equals(0)) {
          return {}
        }
        let percent = Math.max(1, Math.min(100, numUtils.div(item.avaliableAmount, this.bidMax).mul(100).toFixed(2)))
        return {'background-size': `${percent}% 90%`}
      }
    },
    checkEntrustPrice (item) {
      let price = this.toFixed(item.price)
      let direction = String(item.direction)
      let key = price + '_' + direction
      return this.keysEntrust[key]
    },
    resize () {
      this.$nextTick(() => {
        let h = this.active === 'ask' ? this.$refs.parentListAsk.clientHeight : this.$refs.parentListBid.clientHeight
        this.mergeLen = Math.floor(h / 20)
      })
    },
    clickChangeValue (item, type) {
      if (type !== 'total') {
        this.tiggerEvents({
          name: 'businessEvent',
          params: {
            type: type,
            value: item
          }
        })
      } else {
        this.tiggerEvents({
          name: 'businessEvent',
          params: {
            type: 'price',
            value: this.toFixed(item.price)
          }
        })
        this.tiggerEvents({
          name: 'businessEvent',
          params: {
            type: 'amount',
            value: this.toFixed(item.avaliableAmount)
          }
        })
      }
    },
    toFixed (value, fixed) {
      return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.mergeValue : fixed, 1)
    },
    muldepth (v1, v2) {
      return numUtils.mul(v1, v2).toFixed(this.mergeValue, 1)
    }
  }
}
</script>

<style scoped>
.depth{flex:1;display:flex;flex-flow:column;min-height:0;padding:10px 10px 10px 0;background-color:#181b2a;}
.top{display:flex;justify-content:space-between;min-height:24px;height:24px;margin-bottom:10px;}
.top-layout{display:flex;justify-content:space-between;width:90px;margin-left:20px;}
.top-stats-dots{width:22px;height:22px;border:1px solid #181b2a;cursor:pointer;}
.top-stats-dots.ask-color{background-color:#ff7342;}
.top-stats-dots.bid-color{background-color:#0ee7a5;}
.top-stats-dots.askbid-color{background-color:#cbd4ec;}
.top-stats-dots:hover,
.top-stats-dots.active{border-color:#cbd4ec;}
.top-stats-dots.ask-color::after,
.top-stats-dots.bid-color::after,
.top-stats-dots.askbid-color::after{content:"";display:block;width:20px;height:20px;background-color:transparent;border:1px solid transparent;}
.top-stats-dots.askbid-color::before{content:"";display:block;width:0;height:0;margin-bottom:-22px;font-size:0;line-height:0;border-width:11px;border-style:solid;border-color:#0ee7a5 #ff7342 #ff7342 #0ee7a5;overflow:hidden;}
.top-stats-dots.ask-color:hover::after,
.top-stats-dots.bid-color:hover::after,
.top-stats-dots.askbid-color:hover::after,
.top-stats-dots.ask-color.active::after,
.top-stats-dots.bid-color.active::after,
.top-stats-dots.askbid-color.active::after{border-color:#cbd4ec #181b2a #181b2a #cbd4ec;}

.top-right{color:#c6cfe5;display:flex;}
.top-right /deep/ span{display:inline-block;max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-right:14px;}
.top-select{height:18px;line-height:18px;border-bottom:1px solid #c6cfe5;color:#c6cfe5;cursor: pointer;}

.list-bid,.list-ask{width:100%;height:calc((100% - 104px) / 2);overflow-x:visible;overflow-y:hidden;display:flex;flex-flow:column;}
.list-ask{justify-content:flex-end;}
.list{width:calc(100% - 10px);padding-left:10px;}
.list-overflow{overflow:auto;max-height:100%;}
.list-item{
  display:flex;height:20px;line-height:20px;font-size:12px;color:#d6dff9;cursor:pointer;
  background-size:0 98%;background-repeat:no-repeat;background-position:center right;
}
.list-header{color:#a1a8bb!important;}
.list-item.bid:hover,.list-item.ask:hover{background-color:#252e44;font-weight:bold;}
.list-item .ask-color{color:#e76d42;}
.list-item .bid-color{color:#03c087;}
.list-item:hover .ask-color{color:#ff7342;}
.list-item:hover .bid-color{color:#0ee7a5;}
.list-item.bid:hover /deep/ .amount,.list-item.ask:hover /deep/ .amount{color:#fff;}
.list-item.bid:hover /deep/ .sum,.list-item.ask:hover /deep/ .sum{color:#fff;}
.list-item.ask{background-image:url(../../assets/images/depth-bid-bg.png);}
.list-item.bid{background-image:url(../../assets/images/depth-ask-bg.png);}
.list-col{flex: 1 1 auto;}
.price,.price-bid,.price-ask,.amount,.sum{white-space:nowrap;text-overflow:ellipsis;overflow:hidden;}
.price{width:110px;padding:0 10px;}
.amount{width:110px;padding-right:10px;text-align:center;}
.sum{width:100px;text-align:right;}
/*.sum{text-align:right;}*/
.lastprice{position:relative;height:30px;margin:10px 0 10px 10px;font-weight:bold;font-size:18px;line-height:30px;color:#d6dff9;text-align:center;background-color:#12141f;}
.lastprice-ask{color:#ff7342;}
.lastprice-bid{color:#0ee7a5;}
.lastprice-aob{margin-bottom:0px;}
.lastprice-cny{display:none;font-weight:normal;font-size:16px;}
/*网络信号*/
.network-signal{border-right:4px solid #03c087;height:20px;display:flex;flex:initial;position:absolute;right:10px;top:calc(50% - 10px);align-items:flex-end;cursor: pointer;}
.network-signal::before,.network-signal::after{content:"";display:flex;width:4px;height:8px;background-color:#03c087;margin-right:2px;}
.network-signal::after{height:14px;margin-right:2px;}
/*信号中*/
.signal-1{border-right-color:#717788;}
.signal-1::after,.signal-1::before{background-color:#ffc81f;}
/*信号弱*/
.signal-2{border-right-color:#717788;}
.signal-2::after{background-color:#717788;}
.signal-2::before{background-color:#de6941;}
/*无信号*/
.signal-3{border-right-color:#717788;}
.signal-3::after,.signal-3::before{background-color:#717788;}
.icon-arrow-right2{position:relative;}
.icon-arrow-right2::before{position:absolute;left:-10px;z-index:1;color:#fff;}
.ask.icon-arrow-right2::before{color:#ffd21e;}
.bid.icon-arrow-right2::before{color:#ffd21e;}
@media screen and (min-width: 1800px) {
  .top-select{width:104px;}
}
@media screen and (max-width: 1600px) {
  .price{width:107px;}
  .amount{width:107px;}
  .sum{width:96px;}
}
@media screen and (max-width: 1500px) {
  .price{width:104px;}
  .amount{width:104px;}
  .sum{width:92px;}
}
@media screen and (max-width: 1400px) {
  .price{width:101px;}
  .amount{width:101px;}
  .sum{width:88px;}
  .top-right span{margin-right: 7px;}
}
@media screen and (max-width: 1300px) {
  .top-layout{width:80px;}
  .price{width:98px;}
  .amount{width:98px;}
  .sum{width:84px;}
}
@media screen and (max-width: 1200px) {
  .top-stats-dots{width:16px;height:16px;}
  .top-stats-dots.ask-color::after,
  .top-stats-dots.bid-color::after,
  .top-stats-dots.askbid-color::after{width:14px;height:14px;}
  .top-stats-dots.askbid-color::before{margin-bottom:-16px;border-width:8px;}
  .askbid-color::before{border-width:8px;}
  .top-right{margin-right:0;}
  .top-layout{width:60px;}
  .top-select{width:80px;}
  .price{width:74px;}
  .amount{width:80px;}
  .sum{width:80px;}
}
</style>
