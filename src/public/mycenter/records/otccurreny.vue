<template>
  <div class="otccurreny">
    <div class="record">
      <div class="filtrate" >
        <div class="time">
          <label>{{$t('trade_record.trade_record_time')}}：<!--时间--></label>
          <datepicker :language="curLang" format="yyyy-MM-dd" v-model="dateTimeBegin"></datepicker>
          <span class="joint">-</span>
          <datepicker :language="curLang" format="yyyy-MM-dd" v-model="dateTimeEnd"></datepicker>
        </div>
        <div class="market">
          <label>{{$t('trade_record.trade_record_currency')}}：<!--币种--></label>
          <select v-model="symbol">
            <option value="">{{$t('trade_record.trade_record_all')}}<!--全部--></option>
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
          </select>
        </div>
        <div class="direction">
          <label>{{$t('trade_record.trade_record_type')}}：<!--方向--></label>
          <select v-model="trade_type">
            <option value="">{{$t('trade_record.trade_record_all')}}<!--全部--></option>
            <option value="1">{{$t('trade_record.trade_record_buy')}}<!--买--></option>
            <option value="2">{{$t('trade_record.trade_record_sell')}}<!--卖--></option>
          </select>
        </div>
        <div class="button">
          <button class="search" @click="getTrade">{{$t('trade_record.trade_record_search')}}<!--搜索--></button>
          <button class="reset" @click="clearTrade">{{$t('trade_record.trade_record_reset')}}<!--重置--></button>
        </div>
        <div class="operation export" :class="{disabled: tradeData.length === 0}">
          <a href="javascript:;" @click="tradeData.length === 0 ? false : onExportRecord()">{{$t('trade_record.trade_record_export')}}<!--导出报表--></a>
          <i class="icon-reports"></i>
        </div>
      </div>
      <h3>{{$t('trade_record.otc_record')}}<!--OTC交易记录--></h3>
      <ul class="otc" v-if="!tradeLoading && tradeData.length > 0">
        <li>
          <span class="number">{{$t('otc_exchange.otc_exchange_order_number')}}<!--订单编号--></span>
          <span class="type">{{$t('exchange.exchange_type')}}<!--类型--></span>
          <span class="status">{{$t('exchange.exchange_status')}}<!--状态--></span>
          <span class="currency">{{$t('account.estimated_value_coin')}}<!--币种--></span>
          <span class="price">{{$t('otc_exchange.otc_exchange_ask')}}<!--单价--></span>
          <span class="volume">{{$t('exchange.exchange_amount')}}<!--数量--></span>
          <span class="sum">{{$t('exchange.exchange_total')}}<!--金额--></span>
          <span class="ordersTime">{{$t('otc_ad.otc_ad_end_time')}}<!--完成时间--></span>
        </li>
        <li class="list" v-for="data in tradeData" :key="data.id">
          <span class="number">{{data.order_number}}<!--订单编号--></span>
          <span class="type" :class="data.to_user_name === getUserInfo.username ? 'buy' : 'sell'">{{data.to_user_name === getUserInfo.username ? $t('otc_exchange.otc_exchange_buy') : $t('otc_exchange.otc_exchange_sell')}}<!--类型--></span>
          <span class="status">{{getOrderState(data.state)}}<!--状态--></span>
          <span class="currency">{{data.symbol}}<!--币种--></span>
          <span class="price">{{toFixed(data.cur_price, 2)}}{{data.currency}}<!--单价--></span>
          <span class="volume">{{toFixed(data.symbol_count)}} {{data.symbol}}<!--数量--></span>
          <span class="sum">{{toFixed(data.currency_count, 2)}} {{data.currency}}<!--金额--></span>
          <span class="ordersTime">{{data.updated_at}}<!--完成时间--></span>
        </li>
      </ul>
      <page v-if="!tradeLoading && tradeData.length > 0" :pageIndex="params.page" :pageSize="params.show" :total="params.total" @changePageIndex="pageChange"/>
      <div class="nodata" v-if="!tradeLoading && tradeData.length === 0">
        <div class="nodata-icon icon-no-order"></div>
        <div class="nodata-text">{{$t('trade_record.not_otc_record')}}<!--暂无OTC交易记录--></div>
      </div>
      <loading v-if="tradeLoading"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Datepicker from 'vuejs-datepicker'
import { en, zh } from 'vuejs-datepicker/dist/locale'
import otcApi from '@/api/otc'
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
      order_number: '',
      trade_type: '', // 交易类型 1 购买 2 出售
      state: '',
      cur_price: '',
      currency: '',
      symbol_count: '',
      currency_count: '',
      updated_at: '',
      dateTimeEnd: null,
      dateTimeBegin: null,
      symbol: '', // 币种
      ad_id: '',
      tradeData: [],
      params: {
        page: 1,
        show: 6,
        total: 0
      },
      tradeLoading: true
    }
  },
  computed: {
    ...mapGetters(['getLang', 'getApiToken', 'getUserInfo']),
    curLang () {
      return this.getLang === 'en' ? en : zh
    },
    paramsChange () {
      return {
        direction: 2,
        page: this.params.page,
        pageSize: this.params.show
      }
    }
  },
  created () {
    this.chooseTrade()
  },
  methods: {
    toFixed (value, fixed) {
      return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.fixedNumber : fixed, 1)
    },
    clearTrade () {
      this.dateTimeBegin = null
      this.dateTimeEnd = null
      this.trade_type = ''
      this.symbol = ''
      this.params.page = 1
      this.chooseTrade()
    },
    pageChange (currentIndex) {
      this.params.page = currentIndex
      this.chooseTrade()
    },
    onExportRecord () {
      utils.setDialog(exportRecord, {
        exportMarket: 'OTC',
        lang: this.getLang === 'zh-CN' ? 'chs' : this.getLang
      })
    },
    getTrade () {
      this.params.page = 1
      this.chooseTrade()
    },
    chooseTrade () {
      this.tradeLoading = true
      otcApi.getOrdersList({
        state: 2, // 已完成
        begin_date: this.dateTimeBegin ? this.dateTimeBegin.format('yyyy-MM-dd') : null,
        end_date: this.dateTimeEnd ? this.dateTimeEnd.format('yyyy-MM-dd') : null,
        trade_type: this.trade_type ? this.trade_type : null, // 买 卖
        symbol: this.symbol ? this.symbol : null, // 市场
        page: this.params.page,
        show: this.params.show
      }, (data, time, total) => {
        this.params.total = total
        this.tradeData = data
        this.tradeLoading = false
      }, (msg) => {
        console.error(msg)
      })
    },
    getOrderState (state) { // 获取订单状态
      if (parseInt(state) === 1) {
        return this.$t('public0.public14') // 交易中
      } else if (parseInt(state) === 2) {
        return this.$t('otc_ad.otc_ad_completed') // 已完成
      } else if (parseInt(state) === 3) {
        return this.$t('public0.public25') // 已取消
      } else {
        return ''
      }
    }
  }
}
</script>

<style>
.otccurreny .filtrate,
.otccurreny .filtrate > div{display: flex;align-items: center;}
.otccurreny .filtrate{height: 54px;background-color: #222121;}
.otccurreny .filtrate > div{margin-right: 14px;}
.otccurreny .filtrate .operation{margin-right: 0;cursor: pointer;}
.otccurreny .filtrate .allrepeal,
.otccurreny .filtrate .export{margin-left: auto;}
.otccurreny .filtrate label{font-size: 12px;color: #becbe8;}
.otccurreny .filtrate input{height: 22px;font: 12px/normal "Microsoft YaHei";color: #becbe8;background-color: transparent;border: 1px solid #777f96;}
.otccurreny .filtrate .joint{width: 12px;font-size: 12px;color: #becbe8;text-align: center;}
.otccurreny .filtrate select{width: 100px;height: 24px;padding-left: 4px;padding-right: 20px;font-size: 12px;color: #becbe8;background: url(../../../assets/images/icon_arrowdown.png) no-repeat right 4px center;border: 1px solid #777f96;cursor: pointer;}
.otccurreny .filtrate button{float: left;min-width: 38px;height: 24px;font-size: 12px;background-color: transparent;cursor: pointer;}
.otccurreny .filtrate .time input{width: 100px;padding-right: 24px;background: url(../../../assets/images/icon_calendar.png) no-repeat right 4px center;cursor: pointer;}
.otccurreny .filtrate .market input{width: 50px;border: 1px solid #777f96;}
.otccurreny .filtrate .button .search{margin-right: 14px;color: #fff;background-color: #11a8fe;}
.otccurreny .filtrate .button .search:hover{background-color: #15c9ff;}
.otccurreny .filtrate .button .reset{color: #11a8fe;border: 1px solid #11a8fe;}
.otccurreny .filtrate .button .reset:hover{color: #15c9ff;border-color: #15c9ff;}
.otccurreny .filtrate .operation a,
.otccurreny .filtrate .operation i{font-size: 12px;color: #11a8fe;}
.otccurreny .filtrate .operation i{padding-left: 8px;margin-top: 1px;}
.otccurreny .filtrate .allrepeal i,
.otccurreny .filtrate .export i{font-size: 14px;}
.otccurreny .filtrate .operation:hover a,
.otccurreny .filtrate .operation:hover i{color: #15c9fe;}
.otccurreny .filtrate .disabled a,
.otccurreny .filtrate .disabled i{color: #999;cursor: not-allowed;}
.otccurreny .filtrate .disabled:hover a,
.otccurreny .filtrate .disabled:hover i{color: #999;}

.otccurreny h3{height: 24px;font-weight: normal;font-size: 14px;line-height: 24px;color: #cbd4ec;text-indent: 8px;background-color: #333232;}

.otccurreny .record{background-color: #222121;}
.otccurreny .record ul{padding-left: 8px;padding-right: 8px;}
.otccurreny .record ul li{height: 32px;line-height: 32px;border-bottom: 1px solid #404b69;}
.otccurreny .record ul li span{display: inline-block;font-size: 12px;color: #8b94a9;}
.otccurreny .record ul li span.number{width: 170px;overflow: hidden;text-overflow: ellipsis;vertical-align: middle;}
.otccurreny .record ul li span.type{width: 60px;}
.otccurreny .record ul li span.status{width: 80px;}
.otccurreny .record ul li span.currency{width: 80px;}
.otccurreny .record ul li span.price{width: 140px;}
.otccurreny .record ul li span.volume{width: 160px;}
.otccurreny .record ul li span.sum{width: 140px;}
.otccurreny .record ul li span.ordersTime{width: 120px;}
.otccurreny .record ul li.list span.buy{color: #03c087;}
.otccurreny .record ul li.list span.sell{color: #e76d42;}

.otccurreny .record .nodata{text-align: center;}
.otccurreny .record .nodata .nodata-icon{height: 80px;line-height: 80px;font-size: 40px;color: #8b94a9;}
.otccurreny .record .nodata .nodata-text{height: 40px;line-height: 20px;color: #8b94a9;}
</style>

