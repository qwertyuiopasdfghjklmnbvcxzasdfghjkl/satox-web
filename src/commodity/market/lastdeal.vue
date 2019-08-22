<template>
  <div class="lastdeal">
    <div class="title">{{$t('exchange.exchange_trade_history')}}<!--最新成交--></div>
    <ul class="list-header">
        <li class="list-header-item">
            <span class="list-col time">{{$t('exchange.exchange_date')}}<!--时间--></span>
            <span class="list-col price">{{$t('exchange.exchange_price')}}<!--价格-->({{toCoin}})</span>
            <span class="list-col volume">{{$t('exchange.exchange_amount')}}<!--数量-->({{fromCoin}})</span>
        </li>
    </ul>
    <div class="container">
      <ul class="list">
          <li class="list-item" v-for="(item, index) in datas" :key="index" @click="clickChangeValue(item)">
              <span class="list-col time">{{formatDate(item.createdAt)}}</span>
              <span class="list-col price" :class="[Number(item.direction)===1 ? 'ask' : 'bid']">{{toFixed(item.price)}}</span>
              <span class="list-col volume">{{toFixed(item.amount, Quantityaccu)}}</span>
          </li>
          <li class="list-loading" v-if="showLoading">
            <loading :size="24"/>
          </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import market from '@/api/market'
import loading from '@/components/loading'
import numUtils from '@/assets/js/numberUtils'
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
    },
    Quantityaccu: {
      type: Number
    },
    symbol: {
      type: String
    }
  },
  components: {
    loading
  },
  data () {
    return {
      showLoading: true,
      datas: []
    }
  },
  computed: {
    ...mapGetters(['getApiToken']),
    fromCoin () {
      return this.currentSymbol
    },
    toCoin () {
      return this.baseSymbol
    }
  },
  watch: {
    getApiToken () {
      this.changeLogin()
    },
    symbol () {
      this.changeLogin()
    },
    datas () {
      if (this.datas.length) {
        this.tiggerEvents({
          name: 'depthEvent',
          params: {
            type: 'direction',
            value: this.datas[0].direction
          }
        })
      }
    }
  },
  created () {
    this.$nextTick(() => {
      this.addEvents({
        name: 'lastdealEvent',
        fun: this.lastdealEvent
      })
    })
    this.changeLogin()
  },
  beforeDestroy () {
    this.removeEvents('lastdealEvent')
  },
  methods: {
    ...mapActions(['setEntrustNewPrice', 'addEvents', 'removeEvents', 'tiggerEvents']),
    lastdealEvent (res) {
      if (res && res.type === 'updateData') {
        this.datas = res.data
      }
    },
    clickChangeValue (item) {
      this.setEntrustNewPrice(item.price)
    },
    changeLogin () {
      this.showLoading = true
      let tempSymbol = this.symbol
      // 最近交易记录
      market.getNearestTradeRecords(this.symbol, (res) => {
        this.showLoading = false
        if (tempSymbol !== this.symbol) {
          console.log(`lastdeal-symbol不匹配${tempSymbol}-${this.symbol}`)
          return
        }
        this.datas = res
      }, (msg) => {
        console.log(msg)
        this.showLoading = false
      })
    },
    toFixed (price, fixed) {
      return numUtils.BN(price).toFixed(fixed || this.fixedNumber)
    },
    formatDate (date) {
      return (new Date(Number(date))).format('HH:mm:ss')
    }
  }
}
</script>

<style scoped>
.lastdeal{height:334px;padding:10px;background-color:#FFF;margin-top:10px;}
.title{height:24px;line-height:24px;font-size:16px;margin-bottom:10px;color:#333;text-indent:10px;}
.container{height:calc(100% - 54px);overflow:hidden;}
.list{height:100%;margin-right:-17px;overflow-x:hidden;overflow-y:scroll;}
.list::-webkit-scrollbar{width:17px;}
.list-header-item,
.list-item{height:20px;line-height:20px;display:flex;font-size:12px;}
.list-header-item{color:#A1A1A1;}
.list-item{color:#4A4A4A;cursor:default;}
.price.bid{color:#F34246;}
.price.ask{color:#23CD09;}
.list-item:hover{font-weight:bold;color:#333;}
.list-col{flex: 1 1 auto;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;}
.time{text-align:left;padding:0 10px 0 10px;width:110px;}
.price{width:110px;padding-right:10px;text-align:center;}
.volume{text-align:right;width:100px;}
@media screen and (max-width: 1600px) {
  .lastdeal{height:274px;margin-top:4px;}
  .title{font-size:14px;}
  .time{width:107px;}
  .price{width:107px;}
  .volume{width:96px;}
}
@media screen and (max-width: 1500px) {
  .time{width:104px;}
  .price{width:104px;}
  .volume{width:92px;}
}
@media screen and (max-width: 1400px) {
  .time{width:101px;}
  .price{width:101px;}
  .volume{width:88px;}
}
@media screen and (max-width: 1300px) {
  .time{width:98px;}
  .price{width:98px;}
  .volume{width:84px;}
}
@media screen and (max-width: 1200px) {
  .time{width:74px;}
  .price{width:80px;}
  .volume{width:80px;}
}
</style>
