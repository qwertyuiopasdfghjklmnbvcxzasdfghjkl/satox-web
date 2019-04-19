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
      <ul class="header" v-if="!coinsLoading && coinsEntrust.length > 0">
        <li>
          <span class="time">{{$t('exchange.exchange_date')}}<!--时间--></span>
          <span class="market">{{$t('exchange.exchange_pair')}}<!--市场--></span>
          <span class="type">{{$t('exchange.exchange_direction')}}<!--方向--></span>
          <span class="avgPrice">{{$t('exchange.exchange_Transaction_price')}} <!--成交均价--></span>
          <span class="tradeVolume">{{$t('exchange.exchange_Transaction_volume')}} <!--成交量--></span>
          <span class="tradeSum">{{$t('exchange.exchange_Transaction_amount')}}<!--成交金额--></span>
          <span class="charge">{{$t('exchange.advanced_fee')}}<!--手续费--></span>
        </li>
      </ul>
      <ul v-if="!coinsLoading && coinsEntrust.length > 0">
        <li class="list" v-for="(item, index) in coinsEntrust" :key="item.id">
          <span class="time">{{new Date(Number(item.createdAt)).format()}}</span><!--时间-->
          <span class="market">{{getMarketByType(item.direction, item.toSymbol, item.fromSymbol)}}</span><!--市场-->
          <span class="type" :class="item.direction === 1 ? 'buy' : 'sell'">{{getType(item.direction)}}</span><!--方向-->
          <span class="avgPrice">{{getPrice(item.averagePrice)}}</span><!--成交均价-->
          <span class="tradeVolume">{{toFixed(item.finishedAmount)}}</span><!--成交量-->
          <span class="tradeSum">{{toFixed(item.dealCurrency)}} {{item.direction === 1 ? item.fromSymbol : item.toSymbol}}</span><!--成交金额-->
          <span class="charge" v-html="fee(item)"></span><!--手续费-->
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
      coinsLoading: true,
      symbolDeduction:''
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
    this.getrateSysparams()
  },
  methods: {
    fee(item){
      if(Number(item.deductionFee)){
        return `${this.toFixed(item.fee)} ${item.toSymbol}, ${this.toFixed(item.deductionFee)} ${this.symbolDeduction}`
      } else {
        return `${this.toFixed(item.fee)} ${item.toSymbol}`
      }
    },
    getrateSysparams () {
      market.rateSysparams((res) => {
        res.forEach((item) => {
          if (item.code === 'symbolDeduction') {
            this.symbolDeduction = item.value
          }
        })
      })
    },
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
        this.coinsLoading = false
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

<style scoped>
.curreny /deep/ .filtrate,
.curreny /deep/ .filtrate > div{display: flex;align-items: center;}
.curreny /deep/ .filtrate{height: 54px;background-color: #FFF; margin-left: 40px; margin-right: 40px;}
.curreny /deep/ .filtrate > div{margin-right: 14px;}
.curreny /deep/ .filtrate .operation{margin-right: 0;cursor: pointer;}
.curreny /deep/ .filtrate .allrepeal,
.curreny /deep/ .filtrate .export{margin-left: auto;}
.curreny /deep/ .filtrate label{font-size: 14px;color: #333;}
.curreny /deep/ .filtrate input{height: 22px;font: 12px/normal "Microsoft YaHei";color: #666;border: 1px solid #5699FF; border-radius: 3px;}
.curreny /deep/ .filtrate .joint{width: 12px;font-size: 12px;color: #becbe8;text-align: center;}
.curreny /deep/ .filtrate select{width: 100px;height: 24px;padding-left: 4px;padding-right: 20px;font-size: 12px;color: #666;background: url(../../../assets/images/icon_arrowdown.png) no-repeat right 4px center;border: 1px solid #5699FF;cursor: pointer; border-radius: 3px;}
.curreny /deep/ .filtrate button{float: left;min-width: 38px;height: 24px;font-size: 12px;background-color: transparent;cursor: pointer;}
.curreny /deep/ .filtrate .time /deep/ input{width: 100px;padding-right: 24px;background: url(../../../assets/images/icon_calendar.png)  no-repeat right 4px center;cursor: pointer;}
.curreny /deep/ .filtrate .market input{width: 50px;}
.curreny /deep/ .filtrate .button button {min-width: 60px; border-radius: 3px;}
.curreny /deep/ .filtrate .button .search{margin-right: 14px;color: #fff;background-color: #3283FF;}
.curreny /deep/ .filtrate .button .search:hover{background-color: #1a64d4;}
.curreny /deep/ .filtrate .button .reset{color: #999;border: 1px solid #ccc;}
.curreny /deep/ .filtrate .button .reset:hover{color: #666;border-color: #bbb;}
.curreny /deep/ .filtrate .operation a,
.curreny /deep/ .filtrate .operation i{font-size: 12px;color: #3283FF;}
.curreny /deep/ .filtrate .operation i{padding-left: 8px;margin-top: 1px;}
.curreny /deep/ .filtrate .allrepeal i,
.curreny /deep/ .filtrate .export i{font-size: 14px;}
.curreny /deep/ .filtrate .operation:hover a,
.curreny /deep/ .filtrate .operation:hover i{color: #1a64d4;}
.curreny /deep/ .filtrate .hide a,.curreny /deep/ .filtrate .hide:hover a{color:#333;}
.curreny /deep/ .filtrate .disabled a,
.curreny /deep/ .filtrate .disabled i{color: #999;cursor: not-allowed;}
.curreny /deep/ .filtrate .disabled:hover a,
.curreny /deep/ .filtrate .disabled:hover i{color: #999;}

.curreny /deep/ h3{height: 35px;font-weight: normal;font-size: 14px;line-height: 35px;color: #333;padding: 0 20px; border-top: 1px solid #e7e7e7;border-bottom: 1px solid #e7e7e7;}

.curreny /deep/ .record ul{padding-left: 20px;padding-right: 20px;}
.curreny /deep/ .record ul.header{background:#F5F5F5;}
.curreny /deep/ .record ul li{border-bottom: 1px solid #eee;}
.curreny /deep/ .record ul.header li{border-bottom:none;}
.curreny /deep/ .record ul li span{display: inline-block;height: 40px;line-height: 40px;font-size: 12px;color: #555;white-space: nowrap;text-overflow: ellipsis;vertical-align: top;overflow: hidden;}


.curreny /deep/ .record ul li span.time{width: 160px;}
.curreny /deep/ .record ul li span.market{width: 100px;}
.curreny /deep/ .record ul li span.type{width: 60px;}
.curreny /deep/ .record ul li span.avgPrice{width: 120px;}
.curreny /deep/ .record ul li span.tradeVolume{width: 120px;}
.curreny /deep/ .record ul li span.tradeSum{width: 120px;}
/*.curreny /deep/ .record ul li span.charge{width: 250px;}*/
.curreny /deep/ .record ul li.list span.buy{color: #23CD09;}
.curreny /deep/ .record ul li.list span.sell{color: #F34246;}

.curreny /deep/ .record .nodata{text-align: center;}
.curreny /deep/ .record .nodata .nodata-icon{height: 80px;line-height: 80px;font-size: 40px;color: #A1A1A1;}
.curreny /deep/ .record .nodata .nodata-text{height: 40px;line-height: 20px;color: #A1A1A1;}
</style>
