<template>
  <div class="delegate">
    <div class="record entrust-current">
      <div class="filtrate" >
        <div class="time">
          <label>{{$t('trade_record.trade_record_time')}}：<!--时间--></label>
          <datepicker :language="curLang" v-model="curParams.start" format="yyyy-MM-dd"></datepicker>
          <span class="joint">-</span>
          <datepicker :language="curLang" v-model="curParams.end" format="yyyy-MM-dd"></datepicker>
        </div>
        <div class="market">
          <label>{{$t('trade_record.trade_record_market')}}：<!--市场--></label>
          <select v-model="curParams.market" >
            <option value="">{{$t('trade_record.trade_record_all')}}<!--全部--></option>
            <option v-for="m in marketArry" :value="m.market">{{m.currencySymbol}}/{{m.baseSymbol}}</option>
          </select>
        </div>
        <div class="direction">
          <label>{{$t('trade_record.trade_record_type')}}：<!--方向--></label>
          <select v-model="curParams.direction">
            <option value="">{{$t('trade_record.trade_record_all')}}<!--全部--></option>
            <option value="1">{{$t('trade_record.trade_record_buy')}}<!--买--></option>
            <option value="2">{{$t('trade_record.trade_record_sell')}}<!--卖--></option>
          </select>
        </div>
        <div class="button">
          <button class="search" @click="searchCur('cur')">{{$t('trade_record.trade_record_search')}}<!--搜索--></button>
          <button class="reset" @click="clearSearchCur('cur')">{{$t('trade_record.trade_record_reset')}}<!--重置--></button>
        </div>
        <div class="operation allrepeal" :class="{disabled: currentEntrust.length === 0}">
          <a href="javascript:;" @click="currentEntrust.length === 0 ? false : cancelOrder('all')">{{$t('trade_record.trade_record_repeal')}}<!--全部撤销--></a>
          <i class="icon-repeal"></i>
        </div>
      </div>
      <h3>{{$t('trade_record.current_entrust')}}<!--当前委托--></h3>
      <ul class="header" v-if="!currentLoading && currentEntrust.length > 0">
        <li>
          <span class="time">{{$t('exchange.exchange_date')}}<!--时间--></span>
          <span class="market">{{$t('exchange.exchange_pair')}}<!--市场--></span>
          <span class="type">{{$t('exchange.exchange_direction')}}<!--方向--></span>
          <span class="price">{{$t('exchange.exchange_price')}}<!--价格--></span>
          <span class="tradeVolume">{{$t('exchange.exchange_Transaction_volume')}}<!--成交量--></span>
          <span class="volume">{{$t('exchange.exchange_problem')}}<!--总量--></span>
          <span class="sum">{{$t('exchange.exchange_total')}}<!--金额--></span>
          <span class="operation">{{$t('otc_exchange.otc_exchange_operating')}}<!--操作--></span>
        </li>
      </ul>
      <ul v-if="!currentLoading && currentEntrust.length > 0">
        <li class="list" v-for="(item, index) in currentEntrust" :key="item.id">
          <span class="time">{{new Date(Number(item.createdAt)).format()}}</span><!--时间-->
          <span class="market">{{getMarketByType(item.direction, item.toSymbol, item.fromSymbol)}}</span><!--市场-->
          <span class="type" :class="item.direction === 1 ? 'buy' : 'sell'">{{getType(item.direction)}}</span><!--方向-->
          <span class="price">{{getPrice(item.price)}}</span><!--价格-->
          <span class="tradeVolume">{{toFixed(item.finishedAmount)}}({{getFinishedPercent(item)}}%)</span><!--成交量-->
          <span class="volume">{{toFixed(item.totalAmount)}}</span><!--总量-->
          <span class="sum">{{toFixed(item.dealCurrency)}}</span><!--金额-->
          <span class="operation"><a href="javascript:;" @click="cancelOrder(item.orderBookId, index)">{{$t('exchange.exchange_revoked')}}<!--撤销--></a></span>
        </li>
      </ul>
      <page v-if="!currentLoading && currentEntrust.length > 0" :pageIndex="curParams.current" :pageSize="curParams.limit" :total="curTotal" @changePageIndex="curPageChange"/>
      <div v-if="!currentLoading && currentEntrust.length === 0" class="nodata">
        <div class="nodata-icon icon-no-order"></div>
        <div class="nodata-text">{{$t('trade_record.not_current_entrust')}}<!--暂无当前委托--></div>
      </div>
      <loading v-if="currentLoading"/>
    </div>
    <div class="record entrust-history">
      <div class="filtrate" >
        <div class="time">
          <label>{{$t('trade_record.trade_record_time')}}：<!--时间--></label>
          <datepicker v-model="historyParams.start" :language="curLang" format="yyyy-MM-dd"></datepicker>
          <span class="joint">-</span>
          <datepicker v-model="historyParams.end" :language="curLang" format="yyyy-MM-dd"></datepicker>
        </div>
        <div class="market">
          <label>{{$t('trade_record.trade_record_market')}}：<!--市场--></label>
          <select v-model="historyParams.market">
            <option value="">{{$t('trade_record.trade_record_all')}}<!--全部--></option>
            <option v-for="m in marketArry" :value="m.market">{{m.currencySymbol}}/{{m.baseSymbol}}</option>
          </select>
        </div>
        <div class="direction">
          <label>{{$t('trade_record.trade_record_type')}}：<!--方向--></label>
          <select v-model="historyParams.direction" >
            <option value="">{{$t('trade_record.trade_record_all')}}<!--全部--></option>
            <option value="1">{{$t('trade_record.trade_record_buy')}}<!--买--></option>
            <option value="2">{{$t('trade_record.trade_record_sell')}}<!--卖--></option>
          </select>
        </div>
        <div class="button">
          <button class="search" @click="searchCur('his')">{{$t('trade_record.trade_record_search')}}<!--搜索--></button>
          <button class="reset" @click="clearSearchCur('his')">{{$t('trade_record.trade_record_reset')}}<!--重置--></button>
        </div>
        <div class="operation hide" :class="{disabled: historyEntrust.length === 0 && !historyParams.hideCancelled}" @click="historyEntrust.length === 0 && !historyParams.hideCancelled ? false : hisHideCancellFun(historyParams.hideCancelled)">
          <a href="javascript:;">{{$t('trade_record.trade_record_hide')}}<!--隐藏已取消记录--></a>
          <i class="icon-checkbox" :class="[historyParams.hideCancelled === 0 ? 'icon-checkbox-unchecked':'icon-checkbox-checked']"></i>
        </div>
        <div class="operation export" :class="{disabled: historyEntrust.length === 0}">
          <a href="javascript:;" @click="historyEntrust.length === 0 ? false : onExportRecord()">{{$t('trade_record.trade_record_export')}}<!--导出报表--></a>
          <i class="icon-reports"></i>
        </div>
      </div>
      <h3>{{$t('trade_record.history_entrust')}}<!--历史委托记录--></h3>
      <ul class="header" v-if="!historyLoading && historyEntrust.length > 0">
        <li>
          <span class="entrustTime">{{$t('exchange.exchange_entrust_time')}}<!--委托时间--></span>
          <span class="market">{{$t('exchange.exchange_pair')}}<!--市场--></span>
          <span class="type">{{$t('exchange.exchange_direction')}}<!--方向--></span>
          <span class="price">{{$t('exchange.exchange_price')}}<!--价格--></span>
          <span class="avgPrice">{{$t('exchange.exchange_Transaction_price')}}<!--成交均价--></span>
          <span class="tradeVolume">{{$t('exchange.exchange_Transaction_volume')}}<!--成交量--></span>
          <span class="volume">{{$t('exchange.exchange_problem')}}<!--总量--></span>
          <span class="tradeSum">{{$t('exchange.exchange_Transaction_amount')}}<!--成交金额--></span>
          <span class="status">{{$t('exchange.exchange_status')}}<!--状态--></span>
        </li>
      </ul>
      <ul v-if="!historyLoading && historyEntrust.length > 0">
        <li class="list" v-for="(item, index) in historyEntrust" :key="item.id">
          <span class="entrustTime">{{new Date(Number(item.createdAt)).format()}}</span><!--委托时间-->
          <span class="market">{{getMarketByType(item.direction, item.toSymbol, item.fromSymbol)}}</span><!--市场-->
          <span class="type" :class="item.direction === 1 ? 'buy' : 'sell'">{{getType(item.direction)}}</span><!--方向-->
          <span class="price">{{getPrice(item.price)}}</span><!--价格-->
          <span class="avgPrice">{{toFixed(item.averagePrice)}}</span><!--成交均价-->
          <span class="tradeVolume">{{toFixed(item.finishedAmount)}}({{getFinishedPercent(item)}}%)</span><!--成交量-->
          <span class="volume">{{toFixed(item.totalAmount)}}</span><!--总量-->
          <span class="tradeSum">{{toFixed(item.dealCurrency)}}</span><!--成交金额-->
          <span class="status">{{getStatue(item)}}</span><!--状态-->
        </li>
      </ul>
      <page v-if="!historyLoading && historyEntrust.length > 0" :pageIndex="historyParams.current" :pageSize="historyParams.limit" :total="historyTotal" @changePageIndex="hisPageChange"/>
      <div v-if="!historyLoading && historyEntrust.length === 0" class="nodata">
        <div class="nodata-icon icon-no-order"></div>
        <div class="nodata-text">{{$t('trade_record.not_history_entrust')}}<!--暂无历史委托--></div>
      </div>
      <loading v-if="historyLoading"/>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import Datepicker from 'vuejs-datepicker'
import { en, zh } from 'vuejs-datepicker/dist/locale'
import market from '@/api/market'
import utils from '@/assets/js/utils'
import numUtils from '@/assets/js/numberUtils'
import page from '@/components/page'
import loading from '@/components/loading'
import exportRecord from '@/public/dialog/exportrecord'
export default {
  components: {
    Datepicker,
    page,
    loading
  },
  data () {
    return {
      fixedNumber: 8,
      currentEntrust: [], // 当前委托
      historyEntrust: [], // 历史委托
      marketArry: [], // 市场列表
      curTotal: 0, // 当前委托总数
      historyTotal: 0, // 历史委托总数
      curParams: { // 当前委托
        history: '0', // 0 当前，1 历史
        start: '', // 开始时间
        end: '', // 结束时间
        market: '', // 全部
        direction: '', // ‘’空字符串 全部 1买 2卖
        hideCancelled: 0, // 1是, 0否显示
        tp: 0, // 0 委托记录 1 币币成交记录
        current: 1, // 当前第几页 默认为"" 为第一页
        limit: 6 // limit每页记录数，“”默认20条
      },
      historyParams: { // 历史委托
        history: '1', // 0 当前，1 历史
        start: '', // 开始时间
        end: '', // 结束时间
        market: '',
        direction: '', // ‘’空字符串 全部 1买 2卖
        hideCancelled: 0, // 1是, 0否显示
        tp: 0, // 0 委托记录 1 币币成交记录
        current: 1, // 当前第几页 默认为"" 为第一页
        limit: 6 // limit每页记录数，“”默认20条
      },
      currentLoading: true,
      historyLoading: true
    }
  },
  computed: {
    ...mapGetters(['getLang', 'getApiToken']),
    curLang () {
      return this.getLang === 'en' ? en : zh
    }
  },
  created () {
    this.getCurHistory()
    this.getDealBookHistory()
    this.getMarket()
  },
  methods: {
    hisHideCancellFun (hideCancelled) {
      if (hideCancelled === 0) { // 否
        this.historyParams.hideCancelled = 1
      } else if (hideCancelled === 1) {
        this.historyParams.hideCancelled = 0
      }
      this.getDealBookHistory()
    },
    curPageChange (currentIndex) {
      this.curParams.current = currentIndex
      this.getCurHistory()
    },
    hisPageChange (currentIndex) {
      this.historyParams.current = currentIndex
      this.getDealBookHistory()
    },
    searchCur (v) { // 查询
      if (v === 'cur') {
        this.curParams.start = this.curParams.start.format('yyyy-MM-dd')
        this.curParams.end = this.curParams.end.format('yyyy-MM-dd')
        this.curParams.current = 1
        this.getCurHistory()
      } else if (v === 'his') {
        this.historyParams.start = this.historyParams.start.format('yyyy-MM-dd')
        this.historyParams.end = this.historyParams.end.format('yyyy-MM-dd')
        this.historyParams.current = 1
        this.getDealBookHistory()
      }
    },
    clearSearchCur (v) { // 重置
      if (v === 'cur') {
        Object.keys(this.curParams).forEach((key) => {
          if (key !== 'history' && key !== 'current' && key !== 'limit' && key !== 'tp' && key !== 'hideCancelled') this.curParams[key] = ''
        })
        this.curParams.current = 1
        this.searchCur(v)
      } else if (v === 'his') {
        Object.keys(this.historyParams).forEach((key) => {
          if (key !== 'history' && key !== 'current' && key !== 'limit' && key !== 'tp' && key !== 'hideCancelled') this.historyParams[key] = ''
        })
        this.historyParams.current = 1
        this.searchCur(v)
      }
    },
    cancelOrder (orderBookId, index) {
      if (!this.getApiToken) {
        return
      }
      if (orderBookId === 'all') {
        market.cancelAll(this.symbol, () => {
          this.currentEntrust = []
          Vue.$koallTipBox({icon: 'success', message: this.$t('account.user_center_Successful')})
        }, (msg) => {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
        return
      }
      market.cancelOrder(orderBookId, () => {
        this.currentEntrust.splice(index, 1)
        Vue.$koallTipBox({icon: 'success', message: this.$t('account.user_center_Successful')})
        this.getDealBookHistory()
      }, (msg) => {
        Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
      })
    },
    onExportRecord () {
      utils.setDialog(exportRecord, {
        exportMarket: 'exchange',
        conisetype: 0,
        lang: this.getLang === 'zh-CN' ? 'cn' : this.getLang
      })
    },
    getCurHistory () { // 委托当前记录
      this.currentLoading = true
      market.getCurrentEntrustByParams(this.curParams, (res) => {
        this.curTotal = res.total
        this.currentEntrust = res.data
        this.currentLoading = false
      }, (msg) => {
        this.currentLoading = false
        console.error(msg)
      })
    },
    getMarket () { // 获取市场列表
      market.marketList((res) => {
        this.marketArry = res
      })
    },
    getDealBookHistory () { // 委托历史记录
      this.historyLoading = true
      market.getCurrentEntrustByParams(this.historyParams, (res) => {
        this.historyTotal = res.total
        this.historyEntrust = res.data
        this.historyLoading = false
      }, (msg) => {
        this.historyLoading = false
        console.error(msg)
      })
    },
    getType (type) { // 买、卖
      if (numUtils.BN(type).equals(numUtils.BN(1))) {
        return this.$t('exchange.exchange_buys') // 买
      } else if (numUtils.BN(type).equals(numUtils.BN(2))) {
        return this.$t('exchange.exchange_sells') // 卖
      }
    },
    getMarketByType (type, toSymbol, fromSymbol) {
      if (numUtils.BN(type).equals(numUtils.BN(1))) {
        return `${toSymbol}/${fromSymbol}` // 买
      } else if (numUtils.BN(type).equals(numUtils.BN(2))) {
        return `${fromSymbol}/${toSymbol}` // 卖
      }
    },
    getPrice (price) { // 价格
      if (numUtils.BN(price).equals(numUtils.BN(-1))) {
        return this.$t('exchange.exchange_market_price') // 市价
      }
      return this.toFixed(price)
    },
    getStatue (item) { // 状态
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
    getFinishedPercent (item) {
      return numUtils.div(item.finishedAmount, item.totalAmount).mul(100).toFixed(2)
    },
    toFixed (value, fixed) {
      return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.fixedNumber : fixed)
    }
  }
}
</script>

<style scoped>
.delegate /deep/ .filtrate,
.delegate /deep/ .filtrate > div{display: flex;align-items: center;}
.delegate /deep/ .filtrate{height: 54px;background-color: #FFF; margin-left: 40px; margin-right: 40px;}
.delegate /deep/ .filtrate > div{margin-right: 14px;}
.delegate /deep/ .filtrate .operation{margin-right: 0;cursor: pointer;}
.delegate /deep/ .filtrate .allrepeal,
.delegate /deep/ .filtrate .export{margin-left: auto;}
.delegate /deep/ .filtrate label{font-size: 14px;color: #333;}
.delegate /deep/ .filtrate input{height: 22px;font: 12px/normal "Microsoft YaHei";color: #666;border: 1px solid #5699FF; border-radius: 3px;}
.delegate /deep/ .filtrate .joint{width: 12px;font-size: 12px;color: #becbe8;text-align: center;}
.delegate /deep/ .filtrate select{width: 100px;height: 24px;padding-left: 4px;padding-right: 20px;font-size: 12px;color: #666;background: url(../../../assets/images/icon_arrowdown.png) no-repeat right 4px center;border: 1px solid #5699FF;cursor: pointer; border-radius: 3px;}
.delegate /deep/ .filtrate button{float: left;min-width: 38px;height: 24px;font-size: 12px;background-color: transparent;cursor: pointer;}
.delegate /deep/ .filtrate .time /deep/ input{width: 100px;padding-right: 24px;background: url(../../../assets/images/icon_calendar.png)  no-repeat right 4px center;cursor: pointer;}
.delegate /deep/ .filtrate .market input{width: 50px;}
.delegate /deep/ .filtrate .button button {min-width: 60px; border-radius: 3px;}
.delegate /deep/ .filtrate .button .search{margin-right: 14px;color: #fff;background-color: #3283FF;}
.delegate /deep/ .filtrate .button .search:hover{background-color: #1a64d4;}
.delegate /deep/ .filtrate .button .reset{color: #999;border: 1px solid #ccc;}
.delegate /deep/ .filtrate .button .reset:hover{color: #666;border-color: #bbb;}
.delegate /deep/ .filtrate .operation a,
.delegate /deep/ .filtrate .operation i{font-size: 12px;color: #3283FF;}
.delegate /deep/ .filtrate .operation i{padding-left: 8px;margin-top: 1px;}
.delegate /deep/ .filtrate .allrepeal i,
.delegate /deep/ .filtrate .export i{font-size: 14px;}
.delegate /deep/ .filtrate .operation:hover a,
.delegate /deep/ .filtrate .operation:hover i{color: #1a64d4;}
.delegate /deep/ .filtrate .hide a,.delegate /deep/ .filtrate .hide:hover a{color:#333;}
.delegate /deep/ .filtrate .disabled a,
.delegate /deep/ .filtrate .disabled i{color: #999;cursor: not-allowed;}
.delegate /deep/ .filtrate .disabled:hover a,
.delegate /deep/ .filtrate .disabled:hover i{color: #999;}

.delegate /deep/ h3{height: 35px;font-weight: normal;font-size: 14px;line-height: 35px;color: #333;padding: 0 20px; border-top: 1px solid #e7e7e7;border-bottom: 1px solid #e7e7e7;}

.delegate /deep/ .record ul{padding-left: 20px;padding-right: 20px;}
.delegate /deep/ .record ul.header{background:#F5F5F5;}
.delegate /deep/ .record ul li{border-bottom: 1px solid #eee;}
.delegate /deep/ .record ul.header li{border-bottom:none;}
.delegate /deep/ .record ul li span{display: inline-block;height: 40px;line-height: 40px;font-size: 12px;color: #555;white-space: nowrap;text-overflow: ellipsis;vertical-align: top;overflow: hidden;}

.delegate /deep/ .entrust-current ul li span.time{width: 140px;}
.delegate /deep/ .entrust-current ul li span.market{width: 100px;}
.delegate /deep/ .entrust-current ul li span.type{width: 50px;}
.delegate /deep/ .entrust-current ul li span.price{width: 140px;}
.delegate /deep/ .entrust-current ul li span.tradeVolume{width: 150px;}
.delegate /deep/ .entrust-current ul li span.volume{width: 140px;}
.delegate /deep/ .entrust-current ul li span.sum{width: 140px;}
.delegate /deep/ .entrust-current ul li span.operation{width: 60px;}

.delegate /deep/ .entrust-history ul li span.entrustTime{width: 140px;}
.delegate /deep/ .entrust-history ul li span.market{width: 80px;}
.delegate /deep/ .entrust-history ul li span.type{width: 50px;}
.delegate /deep/ .entrust-history ul li span.price{width: 100px;}
.delegate /deep/ .entrust-history ul li span.avgPrice{width: 120px;}
.delegate /deep/ .entrust-history ul li span.tradeVolume{width: 130px;}
.delegate /deep/ .entrust-history ul li span.volume{width: 120px;}
.delegate /deep/ .entrust-history ul li span.tradeSum{width: 120px;}
.delegate /deep/ .entrust-history ul li span.status{width: 60px;}

.delegate /deep/ .record ul li.list span.buy{color: #23CD09;}
.delegate /deep/ .record ul li.list span.sell{color: #F34246;}
.delegate /deep/ .record ul li.list span.operation a{color: #8DB9FF;}
.delegate /deep/ .record ul li.list span.operation a:hover{color: #5c87cc;}

.delegate /deep/ .record .nodata{text-align: center;}
.delegate /deep/ .record .nodata .nodata-icon{height: 80px;line-height: 80px;font-size: 40px;color: #A1A1A1;}
.delegate /deep/ .record .nodata .nodata-text{height: 40px;line-height: 20px;color: #A1A1A1;}
</style>

