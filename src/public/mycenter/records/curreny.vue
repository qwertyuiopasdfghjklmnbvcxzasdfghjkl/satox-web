<template>
  <div class="curreny">
    <div class="record">
      <div class="filtrate" >
        <div class="time">
          <label>{{$t('trade_record.trade_record_time')}}：<!--时间--></label>
          <datepicker :language="curLang" v-model="coinsParams.start" format="yyyy-MM-dd"></datepicker>
          <span class="joint">-</span>
          <datepicker :language="curLang" v-model="coinsParams.end" format="yyyy-MM-dd"></datepicker>
        </div>
        <div class="market">
          <label>{{$t('trade_record.trade_record_market')}}：<!--市场--></label>
          <select v-model="coinsParams.market">
            <option value="">{{$t('trade_record.trade_record_all')}}<!--全部--></option>
            <option v-for="m in marketArry" :value="m.market">{{m.currencySymbol}}/{{m.baseSymbol}}</option>
          </select>
        </div>
        <div class="direction">
          <label>{{$t('trade_record.trade_record_type')}}：<!--方向--></label>
          <select v-model="coinsParams.direction">
            <option value="">{{$t('trade_record.trade_record_all')}}<!--全部--></option>
            <option value="1">{{$t('trade_record.trade_record_buy')}}<!--买--></option>
            <option value="2">{{$t('trade_record.trade_record_sell')}}<!--卖--></option>
          </select>
        </div>
        <div class="button">
          <button class="search" @click="searchCur()">{{$t('trade_record.trade_record_search')}}<!--搜索--></button>
          <button class="reset" @click="clearSearchCur()">{{$t('trade_record.trade_record_reset')}}<!--重置--></button>
        </div>
        <div class="operation export" :class="{disabled: coinsEntrust.length === 0}">
          <a href="javascript:;" @click="coinsEntrust.length === 0 ? false : onExportRecord()">{{$t('trade_record.trade_record_export')}}<!--导出报表--></a>
          <i class="icon-reports"></i>
        </div>
      </div>
      <h3>{{$t('trade_record.exchange_record')}}<!--币币成交记录--></h3>
      <ul v-if="!coinsLoading && coinsEntrust.length > 0">
        <li>
          <span class="time">{{$t('exchange.exchange_date')}}<!--时间--></span>
          <span class="market">{{$t('exchange.exchange_pair')}}<!--市场--></span>
          <span class="type">{{$t('exchange.exchange_direction')}}<!--方向--></span>
          <span class="avgPrice">{{$t('exchange.exchange_Transaction_price')}} <!--成交均价--></span>
          <span class="tradeVolume">{{$t('exchange.exchange_Transaction_volume')}} <!--成交量--></span>
          <span class="tradeSum">{{$t('exchange.exchange_Transaction_amount')}}<!--成交金额--></span>
          <span class="charge">{{$t('exchange.advanced_fee')}}<!--手续费--></span>
        </li>
        <li class="list" v-for="(item, index) in coinsEntrust" :key="item.id">
          <span class="time">{{new Date(Number(item.createdAt)).format()}}</span><!--时间-->
          <span class="market">{{getMarketByType(item.direction, item.toSymbol, item.fromSymbol)}}</span><!--市场-->
          <span class="type" :class="item.direction === 1 ? 'buy' : 'sell'">{{getType(item.direction)}}</span><!--方向-->
          <span class="avgPrice">{{getPrice(item.averagePrice)}}</span><!--成交均价-->
          <span class="tradeVolume">{{toFixed(item.finishedAmount)}}</span><!--成交量-->
          <span class="tradeSum">{{toFixed(item.dealCurrency)}} {{item.direction === 1 ? item.fromSymbol : item.toSymbol}}</span><!--成交金额-->
          <span class="charge">{{toFixed(item.fee)}} {{item.toSymbol}}</span><!--手续费-->
        </li>
      </ul>
      <page v-if="!coinsLoading && coinsEntrust.length > 0" :pageIndex="coinsParams.current" :pageSize="coinsParams.limit" :total="coinsTotal" @changePageIndex="coinsPageChange"/>
      <div v-if="!coinsLoading && coinsEntrust.length === 0" class="nodata">
        <div class="nodata-icon icon-no-order"></div>
        <div class="nodata-text">{{$t('trade_record.not_exchange_record')}}<!--暂无交易记录--></div>
      </div>
      <loading v-if="coinsLoading"/>
    </div>
  </div>
</template>

<script>
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
      marketArry: [], // 市场列表
      fixedNumber: 8,
      coinsTotal: 0, // 总数
      coinsEntrust: [ ],
      coinsParams: {
        history: '1', // 0 当前，1 历史
        start: '', // 开始时间
        end: '', // 结束时间
        market: '', // 市场
        direction: '', // 0 全部 1买 2卖
        hideCancelled: 0, // 1是, 0否显示
        tp: 1, // 0 委托记录 1 币币成交记录
        current: 1, // 当前第几页 默认为"" 为第一页
        limit: 6 // limit每页记录数，“”默认20条
      },
      coinsLoading: true
    }
  },
  computed: {
    ...mapGetters(['getLang', 'getApiToken']),
    curLang () {
      return this.getLang === 'en' ? en : zh
    }
  },
  created () {
    this.getCoinsHistory()
    this.getMarket()
  },
  methods: {
    getMarketByType (type, toSymbol, fromSymbol) {
      if (numUtils.BN(type).equals(numUtils.BN(1))) {
        return `${toSymbol}/${fromSymbol}` // 买
      } else if (numUtils.BN(type).equals(numUtils.BN(2))) {
        return `${fromSymbol}/${toSymbol}` // 卖
      }
    },
    getMarket () { // 获取市场列表
      market.marketList((res) => {
        this.marketArry = res
      })
    },
    coinsPageChange (currentIndex) {
      this.coinsParams.current = currentIndex
      this.getCoinsHistory()
    },
    onExportRecord () {
      utils.setDialog(exportRecord, {
        exportMarket: 'exchange',
        conisetype: 1,
        lang: this.getLang === 'zh-CN' ? 'cn' : this.getLang
      })
    },
    getCoinsHistory () { // 委托当前记录
      this.coinsLoading = true
      market.getCurrentEntrustByParams(this.coinsParams, (res) => {
        this.coinsTotal = res.total
        this.coinsEntrust = res.data
        this.coinsLoading = false
      }, (msg) => {
        console.error(msg)
      })
    },
    searchCur () { // 查询
      this.coinsParams.start = this.coinsParams.start.format('yyyy-MM-dd')
      this.coinsParams.end = this.coinsParams.end.format('yyyy-MM-dd')
      this.coinsParams.current = 1
      this.getCoinsHistory()
    },
    clearSearchCur () { // 重置
      Object.keys(this.coinsParams).forEach((key) => {
        if (key !== 'history' && key !== 'current' && key !== 'limit' && key !== 'tp' && key !== 'hideCancelled') this.coinsParams[key] = ''
      })
      this.coinsParams.current = 1
      this.searchCur()
    },
    getType (type) { // 买、卖
      if (numUtils.BN(type).equals(numUtils.BN(1))) {
        return this.$t('exchange.exchange_buys') // 买
      } else if (numUtils.BN(type).equals(numUtils.BN(2))) {
        return this.$t('exchange.exchange_sells') // 卖
      }
    },
    getPrice (price) { // 价格
      if (numUtils.BN(price).equals(numUtils.BN(-1))) {
        return this.$t('exchange.exchange_market_price') // 市价
      }
      return this.toFixed(price)
    },
    toFixed (value, fixed) {
      return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.fixedNumber : fixed)
    }
  }
}
</script>

<style>
.curreny .filtrate,
.curreny .filtrate > div{display: flex;align-items: center;}
.curreny .filtrate{height: 54px;background-color: #262a42;}
.curreny .filtrate > div{margin-right: 14px;}
.curreny .filtrate .operation{margin-right: 0;cursor: pointer;}
.curreny .filtrate .allrepeal,
.curreny .filtrate .export{margin-left: auto;}
.curreny .filtrate label{font-size: 12px;color: #becbe8;}
.curreny .filtrate input{height: 22px;font: 12px/normal "Microsoft YaHei";color: #becbe8;background-color: transparent;border: 1px solid #777f96;}
.curreny .filtrate .joint{width: 12px;font-size: 12px;color: #becbe8;text-align: center;}
.curreny .filtrate select{width: 100px;height: 24px;padding-left: 4px;padding-right: 20px;font-size: 12px;color: #becbe8;background: url(../../../assets/images/icon_arrowdown.png) no-repeat right 4px center;border: 1px solid #777f96;cursor: pointer;}
.curreny .filtrate button{float: left;min-width: 38px;height: 24px;font-size: 12px;background-color: transparent;cursor: pointer;}
.curreny .filtrate .time input{width: 100px;padding-right: 24px;background: url(../../../assets/images/icon_calendar.png) no-repeat right 4px center;cursor: pointer;}
.curreny .filtrate .market input{width: 50px;border: 1px solid #777f96;}
.curreny .filtrate .button .search{margin-right: 14px;color: #fff;background-color: #11a8fe;}
.curreny .filtrate .button .search:hover{background-color: #15c9ff;}
.curreny .filtrate .button .reset{color: #11a8fe;border: 1px solid #11a8fe;}
.curreny .filtrate .button .reset:hover{color: #15c9ff;border-color: #15c9ff;}
.curreny .filtrate .operation a,
.curreny .filtrate .operation i{font-size: 12px;color: #11a8fe;}
.curreny .filtrate .operation i{padding-left: 8px;margin-top: 1px;}
.curreny .filtrate .allrepeal i,
.curreny .filtrate .export i{font-size: 14px;}
.curreny .filtrate .operation:hover a,
.curreny .filtrate .operation:hover i{color: #15c9fe;}
.curreny .filtrate .disabled a,
.curreny .filtrate .disabled i{color: #999;cursor: not-allowed;}
.curreny .filtrate .disabled:hover a,
.curreny .filtrate .disabled:hover i{color: #999;}

.curreny h3{height: 24px;font-weight: normal;font-size: 14px;line-height: 24px;color: #cbd4ec;text-indent: 8px;background-color: #1e2233;}

.curreny .record{background-color: #181b2a;}
.curreny .record ul{padding-left: 8px;padding-right: 8px;}
.curreny .record ul li{height: 32px;line-height: 32px;border-bottom: 1px solid #404b69;}
.curreny .record ul li span{display: inline-block;font-size: 12px;color: #8b94a9;}
.curreny .record ul li span.time{width: 160px;}
.curreny .record ul li span.market{width: 100px;}
.curreny .record ul li span.type{width: 80px;}
.curreny .record ul li span.avgPrice{width: 160px;}
.curreny .record ul li span.tradeVolume{width: 160px;}
.curreny .record ul li span.tradeSum{width: 160px;}
.curreny .record ul li span.charge{width: 130px;}
.curreny .record ul li.list span.buy{color: #03c087;}
.curreny .record ul li.list span.sell{color: #e76d42;}

.curreny .record .nodata{text-align: center;}
.curreny .record .nodata .nodata-icon{height: 80px;line-height: 80px;font-size: 40px;color: #8b94a9;}
.curreny .record .nodata .nodata-text{height: 40px;line-height: 20px;color: #8b94a9;}
</style>
