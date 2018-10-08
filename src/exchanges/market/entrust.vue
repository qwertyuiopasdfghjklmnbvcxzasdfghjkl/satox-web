<template>
  <div class="entrust" :class="{unfold:isShow}">
    <div class="title">
        <em class="menu-arrow" :class="{unfold:isShow}" @click="switchTab('current', isShow)">
          <i :class="[!isShow?'icon-arrow-up3':'icon-arrow-down2']"></i>
          <i :class="[!isShow?'icon-arrow-up3':'icon-arrow-down2']"></i>
        </em>
        <span class="menu-title" :class="{'menu-selected':isShow && active==='current'}" @click="switchTab('current')">
          {{$t('trade_record.current_entrust')}}<!--当前委托-->
        </span>
        <span class="menu-title" :class="{'menu-selected':isShow && active==='history'}" @click="switchTab('history')">
          {{$t('trade_record.history_entrust')}}<!--历史委托-->
        </span>
        <span class="menu-title" :class="{'menu-selected':isShow && active==='myassets'}" @click="switchTab('myassets')">
          {{$t('exchange.advanced_funds')}}<!--资产管理-->
        </span>
        <span class="menu-allrepeal" :class="{'disabled':cdatas.length===0}" v-if="isShow && active==='current'">
          <a href="javascript:;" @click="cancelOrder('all')">{{$t('trade_record.trade_record_repeal')}}<!--全部撤销--></a>
          <i class="icon-repeal"></i>
        </span>
    </div>
    <div v-show="isShow">
      <div class="panel panel-current" v-if="active==='current'">
          <ul class="list-header">
              <li class="list-header-item">
                  <span class="list-col col-time">
                    <div>{{$t('exchange.exchange_date')}}<!--时间--></div>
                  </span>
                  <span class="list-col col-market">
                    <div>{{$t('exchange.exchange_pair')}}<!--市场--></div>
                  </span>
                  <span class="list-col col-type">
                    <div>{{$t('exchange.exchange_direction')}}<!--方向--></div>
                  </span>
                  <span class="list-col col-price">
                    <div>{{$t('exchange.exchange_price')}}<!--价格--></div>
                  </span>
                  <span class="list-col col-tvolume">
                    <div>{{$t('exchange.exchange_Transaction_volume')}}<!--成交量--></div>
                  </span>
                  <span class="list-col col-total">
                    <div>{{$t('exchange.exchange_problem')}}<!--总量--></div>
                  </span>
                  <span class="list-col col-tsum">
                    <div>{{$t('exchange.exchange_Transaction_amount')}}<!--成交金额--></div>
                  </span>
                  <span class="list-col col-operate">
                    <div>{{$t('otc_exchange.otc_exchange_operating')}}<!--操作--></div>
                  </span>
              </li>
          </ul>
          <ul class="list"><!--当前委托数据-->
              <li class="list-item" v-for="(item, index) in cdatas" :key="index">
                  <span class="list-col col-time">
                    <div>{{new Date(Number(item.createdAt)).format()}}</div><!--时间-->
                  </span>
                  <span class="list-col col-market">
                    <div>{{currentSymbol}}/{{baseSymbol}}</div><!--市场-->
                  </span>
                  <span class="list-col col-type" :class="[Number(item.direction)===1?'ask':'bid']">
                    <div>{{getType(item.direction)}}</div><!--方向-->
                  </span>
                  <span class="list-col col-price">
                    <div>{{getPrice(item.price)}}</div><!--价格-->
                  </span>
                  <span class="list-col col-tvolume">
                    <div>{{toFixed(item.finishedAmount)}}({{getFinishedPercent(item)}}%)</div><!--成交量-->
                  </span>
                  <span class="list-col col-total">
                    <div>{{toFixed(item.totalAmount)}}</div><!--总量-->
                  </span>
                  <span class="list-col col-tsum">
                    <div>{{toFixed(item.dealCurrency)}}</div><!--成交金额-->
                  </span>
                  <span class="list-col col-operate">
                    <div><a class="cancel" @click="cancelOrder(item.orderBookId, index)">{{$t('exchange.exchange_revoked')}}<!--撤销--></a></div><!--操作-->
                  </span>
              </li>
              <li class="list-loading" v-if="cshowLoading">
                <loading :size="24"/>
              </li>
          </ul>
      </div>
      <div class="panel panel-history" v-if="active==='history'">
          <ul class="list-header">
              <li class="list-header-item">
                  <span class="list-col col-etime">
                    <div>{{$t('exchange.exchange_entrust_time')}}<!--委托时间--></div>
                    <div class="tips">
                      <i class="tips-icon">?</i>
                      <em class="tips-text">{{$t('exchange.exchange_display_today')}}<!--仅展示当前交易日--></em>
                    </div>
                  </span>
                  <span class="list-col col-market">
                    <div>{{$t('exchange.exchange_pair')}}<!--市场--></div>
                  </span>
                  <span class="list-col col-type">
                    <div>{{$t('exchange.exchange_direction')}}<!--方向--></div>
                  </span>
                  <span class="list-col col-price">
                    <div>{{$t('exchange.exchange_price')}}<!--价格--></div>
                  </span>
                  <span class="list-col col-aprice">
                    <div>{{$t('exchange.exchange_Transaction_price')}}<!--成交均价--></div>
                  </span>
                  <span class="list-col col-tquantity">
                    <div>{{$t('exchange.exchange_Transaction_volume')}}<!--成交量--></div>
                  </span>
                  <span class="list-col col-total">
                    <div>{{$t('exchange.exchange_problem')}}<!--总量--></div>
                  </span>
                  <span class="list-col col-tsum">
                    <div>{{$t('exchange.exchange_Transaction_amount')}}<!--成交金额--></div>
                  </span>
                  <span class="list-col col-state">
                    <div>{{$t('exchange.exchange_status')}}<!--状态--></div>
                  </span>
              </li>
          </ul>
          <ul class="list">
              <li class="list-item" v-for="item in hdatas" :key="item.orderBookId">
                  <span class="list-col col-etime">
                    <div>{{new Date(Number(item.createdAt)).format()}}</div><!--委托时间-->
                  </span>
                  <span class="list-col col-market">
                    <div>{{currentSymbol}}/{{baseSymbol}}</div><!--市场-->
                  </span>
                  <span class="list-col col-type" :class="[Number(item.direction)===1?'ask':'bid']">
                    <div>{{getType(item.direction)}}</div><!--方向-->
                  </span>
                  <span class="list-col col-price">
                    <div>{{getPrice(item.price)}}</div><!--价格-->
                  </span>
                  <span class="list-col col-aprice">
                    <div>{{toFixed(item.averagePrice)}}</div><!--成交均价-->
                  </span>
                  <span class="list-col col-tquantity">
                    <div>{{toFixed(item.finishedAmount)}}({{getFinishedPercent(item)}}%)</div><!--成交量-->
                  </span>
                  <span class="list-col col-total">
                    <div>{{toFixed(item.totalAmount)}}</div><!--总量-->
                  </span>
                  <span class="list-col col-tsum">
                    <div>{{toFixed(item.dealCurrency)}}</div><!--成交金额-->
                  </span>
                  <span class="list-col col-state">
                    <div>{{getStatue(item)}}</div><!--状态-->
                  </span>
              </li>
              <li class="list-loading" v-if="hshowLoading">
                <loading :size="24"/>
              </li>
          </ul>
      </div>
      <div class="panel panel-myassets" v-show="active==='myassets'">
        <balance ref="balance" :valuationCout="valuationCout" :newRmbCount="newRmbCount" :currentSymbol="currentSymbol" :baseSymbol="baseSymbol" :fixedNumber="fixedNumber" :toFixed="toFixed"/>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import market from '@/api/market'
import numUtils from '@/assets/js/numberUtils'
import loading from '@/components/loading'
import balance from '@/exchanges/market/balance'
export default {
  props: {
    valuationCout: null,
    newRmbCount: null,
    currentSymbol: null,
    baseSymbol: null,
    fixedNumber: {
      type: Number
    },
    symbol: {
      type: String,
      default: ''
    },
    toFixed: {
      type: Function
    },
    mul: {
      type: Function
    },
    changeEntrustData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {
    balance,
    loading
  },
  data () {
    return {
      isShow: false,
      b: Date.now(),
      active: 'current',
      cdatas: [],
      cshowLoading: true,
      hdatas: [],
      marketId: 0, // 市场id
      hshowLoading: true
    }
  },
  computed: {
    ...mapGetters(['getApiToken'])
  },
  watch: {
    getApiToken () {
      this.changeLogin()
    },
    symbol () {
      this.changeLogin()
    },
    changeEntrustData (obj) {
      this.cdatas = obj.current
      this.hdatas = obj.history
    },
    cdatas () {
      this.setEntrustPrices(this.cdatas)
    },
    isShow () {
      this.$nextTick(() => {
        this.tiggerEvents({
          name: 'klineEvent',
          params: {type: 'resize', value: this.isShow}
        })
      })
    }
  },
  created () {
    this.$nextTick(() => {
      this.addEvents({
        name: 'extrustEvent',
        fun: this.extrustEvent
      })
    })
    this.changeLogin()
  },
  beforeDestroy () {
    this.removeEvents('extrustEvent')
  },
  methods: {
    ...mapActions(['setEntrustPrices', 'addEvents', 'removeEvents', 'tiggerEvents']),
    extrustEvent (res) {
      // 已退出登录后，返回的数据不在处理。
      if (!this.getApiToken) {
        return
      }
      if (res && res.type === 'current') {
        // 当前委托
        this.cdatas = res.data
      } else if (res && res.type === 'history') {
        // 历史委托
        this.hdatas = res.data
      }
    },
    switchTab (tab, isShow) {
      this.isShow = !isShow
      this.active = tab
    },
    getFinishedPercent (item) {
      return numUtils.div(item.finishedAmount, item.totalAmount).mul(100).toFixed(2)
    },
    changeLogin () {
      if (this.getApiToken) {
        // 根据symbol获取当前委托
        this.cshowLoading = true
        let tempSymbol = this.symbol
        market.getCurrentEntrustBySymbol(0, this.symbol, (res) => {
          this.cshowLoading = false
          if (tempSymbol !== this.symbol) {
            console.log(`extrust-current-symbol不匹配${tempSymbol}-${this.symbol}`)
            return
          }
          this.cdatas = res
        }, () => {
          this.cshowLoading = false
        })
        // 历史成交
        this.hshowLoading = true
        market.getHistoryDeal(1, this.symbol, (res) => {
          this.hshowLoading = false
          if (tempSymbol !== this.symbol) {
            console.log(`extrust-history-symbol不匹配${tempSymbol}-${this.symbol}`)
            return
          }
          this.hdatas = res
        }, () => {
          this.hshowLoading = false
        })
      } else {
        this.cdatas = []
        this.cshowLoading = false
        this.hdatas = []
        this.hshowLoading = false
      }
    },
    getType (type) {
      if (numUtils.BN(type).equals(numUtils.BN(1))) {
        return this.$t('exchange.exchange_buys') // 买
      } else if (numUtils.BN(type).equals(numUtils.BN(2))) {
        return this.$t('exchange.exchange_sells') // 卖
      }
    },
    getPrice (price) {
      if (numUtils.BN(price).equals(numUtils.BN(-1))) {
        return this.$t('exchange.exchange_market_price') // 市价
      }
      return this.toFixed(price)
    },
    getStatue (item) {
      let state = Number(item.state)
      if (state === 0) {
        if (numUtils.BN(item.finishedAmount).gt(0)) {
          return this.$t('exchange.exchange_partial_transaction') // 部分成交
        }
        return this.$t('exchange.exchange_cancelled') // 已撤销
      } else if (state === 2) {
        return this.$t('exchange.exchange_partial_transaction') // 部分成交
      } else if (state === 3 || state === 4) {
        return this.$t('exchange.exchange_complete_transaction') // 完全成交
      } else {
        return '--'
      }
    },
    minus (v1, v2) {
      return numUtils.minus(v1, v2).toFixed(this.fixedNumber)
    },
    div (v1, v2) {
      return numUtils.div(v1, v2).toFixed(2)
    },
    cancelOrder (orderBookId, index) {
      if (this.cdatas.length === 0) {
        return
      }
      if (!this.getApiToken) {
        return
      }
      if (orderBookId === 'all') {
        market.cancelAllOrder(this.symbol, () => {
          this.cdatas = []
          Vue.$koallTipBox({icon: 'success', message: this.$t('account.user_center_Successful')})
        }, (msg) => {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
        return
      }
      market.cancelOrder(orderBookId, () => {
        this.cdatas.splice(index, 1)
        Vue.$koallTipBox({icon: 'success', message: this.$t('account.user_center_Successful')})
      }, (msg) => {
        Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
      })
    }
  }
}
</script>

<style scoped>
.entrust{background-color: #222121;}
.entrust.unfold{height: 200px;}
.title{position: relative;background-color: #333232;overflow: auto;}
.entrust.unfold .title{background:#FFF;}
.menu-arrow{position: absolute;top: 50%;left: 10px;width: 16px;height: 16px;margin-top: -8px;overflow: hidden;cursor: pointer;}
.menu-arrow i{position: absolute;left: 0;font-size: 16px;color: #FFF;}
.menu-arrow i:first-of-type{top: -3px;}
.menu-arrow i:last-of-type{top: 3px;}
.menu-arrow:hover i,
.menu-arrow.unfold i{color: #FFDE00;}
.entrust.unfold .menu-arrow:hover i,
.entrust.unfold .menu-arrow.unfold i{color:#000;}
.menu-title{
  float: left;min-width: 76px;height: 38px;padding: 0 40px;margin-left: 2px;font-size: 16px;
  line-height: 38px;color: #FFF;text-align: center;border-top: 2px solid #333232;cursor: pointer;
}
.entrust.unfold .menu-title{color:#000;border-top-color:#FFF;}
.menu-title:first-of-type{margin-left:40px;}
.menu-title:hover,
.menu-title.menu-selected{color: #FFDE00!important;border-top-color: #FFDE00!important;background:#222121;}
.menu-allrepeal{display: flex;align-items: center;float: right;height: 24px;margin-top: 8px;margin-right: 10px;cursor: pointer;}
.menu-allrepeal a{color:#FFDE00;}
.menu-allrepeal i{padding-left: 8px;margin-top: 1px;font-size: 14px;color: #FFDE00;}
.menu-allrepeal:hover a,
.menu-allrepeal:hover i{color: #FFDE00;}
.menu-allrepeal.disabled a,
.menu-allrepeal.disabled i{color: #a1a8bb;cursor: not-allowed;}
.menu-allrepeal.disabled:hover a,
.menu-allrepeal.disabled:hover i{color: #a1a8bb;}

.panel{padding: 0 10px;}
.list-header{margin-top: 10px;}
.list{height: 120px;overflow-x: hidden;overflow-y: auto;}
.list-header-item,
.list-item{display: flex;}
.list-header-item{color: #a1a8bb;}
.list-item{color: #cbd4ec;}
.list-item:hover{background-color: #333232;}
.list-col{flex: 1 1 auto;}
.col-time,
.col-etime{width: 170px;}
.col-market{width: 140px;}
.col-type{width: 100px;}
.col-price,
.col-aprice,
.col-tvolume,
.col-total,
.col-tsum{width: 130px;}
.col-operate{width: 80px;}
.col-tquantity{width: 180px;}
.col-state{width: 70px;}
.col-type.bid{color: #e76d42;}
.col-type.ask{color: #03c087}

.list-col div:first-of-type{float: left;max-width: calc(100% - 10px);height: 20px;font-size: 12px;line-height: 20px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
.col-operate div:first-of-type,
.col-state div:first-of-type{float: right;}
.col-operate div:first-of-type .cancel{color: #FFDE00;cursor: pointer;}
.list-header-item .col-etime div:first-of-type{max-width: calc(100% - 28px);}
.list-header-item .col-etime .tips{display: flex;justify-content: center;position: relative;float: left;width: 12px;height: 12px;margin: 4px 10px 0 6px;}
.list-header-item .col-etime .tips-icon{width: 12px;height: 12px;font-weight: bold;font-size: 12px;line-height: 12px;color: #181b2a;text-align: center;background-color: #fff;border-radius: 50%;cursor: help;}
.list-header-item .col-etime .tips-text{display: none;position: absolute;top: -30px;height: 24px;padding-left: 12px;padding-right: 12px;font-size: 12px;line-height: 24px;color: #181b2a;white-space: nowrap;background-color: #fff;border-radius: 4px;}
.list-header-item .col-etime .tips-text:before{content: "";position: absolute;bottom: -6px;left: 50%;width: 0;height: 0;margin-left: -6px;border-width: 6px 6px 0 6px;border-style: solid;border-color: #fff transparent transparent transparent;}
.list-header-item .col-etime .tips-icon:hover + .tips-text{display: block;}
@media screen and (max-width: 1600px) and (max-height: 900px) {
  .entrust.unfold{height: 180px;}
  .menu-title{height: 28px;margin-left: 30px;font-size: 14px;line-height: 28px;}
  .menu-allrepeal{margin-top: 3px;}
  .list{height: 110px;}
  .col-market{display: none;}
}
</style>
