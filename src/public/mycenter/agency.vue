<template>
  <!--商家管理 begin-->
  <div class="container">
    <section>
      <h3 class="">{{$t('business.MERCHANT_MANAGE')}}</h3>
      <div class="info">
        <div class="avatar">
          <img :src="'aaa'" @error="setDefaultAvatar($event)" />
          <i></i>
        </div>
        <div class="detail">
          <p>昵称：<span class="gray">用户12315123123</span> <span class="ml20"><i class="edit"></i> <span class="blue">修改昵称</span></span></p>
          <p class="mt18">等级：<span class="gray">普通商家</span><span class="ml50">手续费率：<span class="gray">1%</span></span></p>
          <p class="mt18">归属社区：<span class="gray">麒麟山庄</span></p>
          <p class="mt18">总成交量：<span class="blue">231,245.12 CNY</span><span class="ml50">总成交笔数：<span class="blue">231</span></span></p>
        </div>
      </div>
    </section>
    <section class="mt8 curreny">
      <div class="filtrate" >
        <div class="time">
          <label>{{$t('trade_record.trade_record_time')}}：<!--时间--></label>
          <datepicker :language="curLang" v-model="coinsParams.start" format="yyyy-MM-dd"></datepicker>
          <span class="joint">-</span>
          <datepicker :language="curLang" v-model="coinsParams.end" format="yyyy-MM-dd"></datepicker>
        </div>
        <div class="market ml50">
          <label>{{$t('trade_record.trade_record_market')}}：<!--市场--></label>
          <select v-model="coinsParams.market">
            <option value="">{{$t('trade_record.trade_record_all')}}<!--全部--></option>
            <option v-for="m in marketArry" :value="m.market">{{m.currencySymbol}}/{{m.baseSymbol}}</option>
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
      <div class="statistics">
        <span>成交量：231,245.12 CNY</span>
        <span class="ml50">成交笔数：231</span>
      </div>
      <div class="record">
        <ul class="header">
          <li>
            <span class="market">{{$t('business.TRANSACTION_TYPE')}}<!--交易类别--></span>
            <span class="time">{{$t('business.ORDER_TIME')}}<!--下单时间--></span>
            <span class="orderNum">{{$t('business.ORDER_NUM')}}<!--订单号--></span>
            <span class="type">{{$t('business.TYPE')}}<!--类型--></span>
            <span class="price">{{$t('business.UNIT_PRICE')}} <!--单价--></span>
            <span class="amount">{{$t('business.QUANTITY')}} <!--数量--></span>
            <span class="sum">{{$t('business.SUM')}}<!--总额--></span>
            <span class="charge">{{$t('business.FEE')}}<!--手续费--></span>
            <span class="status">{{$t('business.STATUS')}}<!--手续费--></span>
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
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import utils from '@/assets/js/utils'
import merchantApply from '@/public/dialog/merchantApply'
import defaultAvatar from '@/assets/images/icon-merchant.png'
import Datepicker from 'vuejs-datepicker'
import { en, zh } from 'vuejs-datepicker/dist/locale'
import page from '@/components/page'
import loading from '@/components/loading'

export default {
  components: {
    Datepicker,
    page,
    loading
  },
  data () {
    return {
      merchantInfo:{},
      marketArry: [], // 市场列表
      coinsTotal: 0, // 总数
      coinsEntrust: [],
      coinsParams: {
        history: '1', // 0 当前，1 历史
        start: '', // 开始时间
        end: '', // 结束时间
        market: '', // 市场
        hideCancelled: 0, // 1是, 0否显示
        tp: 1, // 0 委托记录 1 币币成交记录
        current: 1, // 当前第几页 默认为"" 为第一页
        limit: 6 // limit每页记录数，“”默认20条
      },
      coinsLoading: false
    }
  },
  computed: {
    ...mapGetters(['getLang', 'getApiToken']),
    curLang () {
      return this.getLang === 'en' ? en : zh
    }
  },
  watch: {
    
  },
  methods: {
    setDefaultAvatar(e){ //图片加载失败用默认头像
      let tar = e.currentTarget
      tar.src = defaultAvatar
    },
  }
}
</script>

<style scoped>
.mt8 {margin-top: 8px;}
.mt18 {margin-top: 18px;}
.ml20 {margin-left: 20px;}
.ml50 {margin-left: 50px;}
.container section{background-color: #FFF; border-radius: 4px; box-shadow: 0 1px 3px #e2e2e2;}
section > h3{height: 55px; padding-left: 20px; font-weight: normal;font-size: 18px;line-height: 55px;color: #333;text-indent: 8px;border-bottom: 1px solid #e7e7e7;}
section  .info {padding: 25px 35px 40px; color: #333; display: flex;}
section  .info .avatar { width: 130px; height: 130px; background-color: #F5F5F5; position: relative;}
section  .info .avatar img {width: 100%; height: 100%; object-fit: cover; object-position: center top; display: block; }
section  .info .avatar i {position: absolute; z-index: 1; width: 28px; height: 28px; bottom: 0; right: 0; background: url('../../assets/images/avatar_upload.png') no-repeat center;}
section  .info .detail { flex: 1; margin-left: 35px; color: #333;}
section  .info .detail span {display: inline-block;}
section  .info .detail span.gray {color: #666;}
section  .info .detail span.blue {color: #0D66EF;}
section  .info .detail .edit {display: inline-block; width: 20px; height: 20px; background: url('../../assets/images/icon-edit.png') no-repeat center; vertical-align: middle;}

.curreny /deep/ .filtrate,
.curreny /deep/ .filtrate > div{display: flex;align-items: center;}
.curreny /deep/ .filtrate{height: 54px;background-color: #FFF; padding-left: 40px; padding-right: 40px; border-bottom: 1px solid #e7e7e7;}
.curreny /deep/ .filtrate > div{margin-right: 14px;}
.curreny /deep/ .filtrate .operation{margin-right: 0;cursor: pointer;}
.curreny /deep/ .filtrate .allrepeal,
.curreny /deep/ .filtrate .export{margin-left: auto;}
.curreny /deep/ .filtrate label{font-size: 14px;color: #333;}
.curreny /deep/ .filtrate input{height: 22px;font: 12px/normal "Microsoft YaHei";color: #666;border: 1px solid #5699FF; border-radius: 3px;}
.curreny /deep/ .filtrate .joint{width: 12px;font-size: 12px;color: #becbe8;text-align: center;}
.curreny /deep/ .filtrate select{width: 100px;height: 24px;padding-left: 4px;padding-right: 20px;font-size: 12px;color: #666;background: url(../../assets/images/icon_arrowdown.png) no-repeat right 4px center;border: 1px solid #5699FF;cursor: pointer; border-radius: 3px;}
.curreny /deep/ .filtrate button{float: left;min-width: 38px;height: 24px;font-size: 12px;background-color: transparent;cursor: pointer;}
.curreny /deep/ .filtrate .time /deep/ input{width: 100px;padding-right: 24px;background: url(../../assets/images/icon_calendar.png)  no-repeat right 4px center;cursor: pointer;}
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

.statistics {margin-left: 40px; margin-right: 40px; height: 40px; line-height: 40px; color: #555;}
.statistics span {display: inline-block;}

.curreny /deep/ .record{background-color: #fff;}
.curreny /deep/ .record ul{padding-left: 20px;padding-right: 20px;}
.curreny /deep/ .record ul.header{background:#F5F5F5;}
.curreny /deep/ .record ul li{border-bottom: 1px solid #eee;}
.curreny /deep/ .record ul.header li{border-bottom:none;}
.curreny /deep/ .record ul li span{display: inline-block;height: 40px;line-height: 40px;font-size: 12px;color: #555;white-space: nowrap;text-overflow: ellipsis;vertical-align: top;overflow: hidden;}

.curreny /deep/ .record ul li span.time{width: 160px;}
.curreny /deep/ .record ul li span.market{width: 100px;}
.curreny /deep/ .record ul li span.orderNum{width: 150px;}
.curreny /deep/ .record ul li span.type{width: 60px;}
.curreny /deep/ .record ul li span.price{width: 120px;}
.curreny /deep/ .record ul li span.amount{width: 60px;}
.curreny /deep/ .record ul li span.sum{width: 120px;}
.curreny /deep/ .record ul li span.charge{width: 130px;}
.curreny /deep/ .record ul li.list span.buy{color: #23CD09;}
.curreny /deep/ .record ul li.list span.sell{color: #F34246;}

.curreny /deep/ .record .nodata{text-align: center;}
.curreny /deep/ .record .nodata .nodata-icon{height: 80px;line-height: 80px;font-size: 40px;color: #A1A1A1;}
.curreny /deep/ .record .nodata .nodata-text{height: 40px;line-height: 20px;color: #A1A1A1;}
</style>

