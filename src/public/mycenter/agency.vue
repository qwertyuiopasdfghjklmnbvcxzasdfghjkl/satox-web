<template>
  <!--商家管理 begin-->
  <div class="container">
    <section>
      <h3 class="">{{$t('business.MERCHANT_MANAGE')}}</h3>
      <div class="info">
        <div class="avatar">
          <img :src="shopsInfo.headerImage" @error="setDefaultAvatar($event)" />
          <template v-if="!shopsInfo.headerImage">
            <i ></i>
            <input class="file" type="file" @change="uploadImage" name="source" />
          </template>
        </div>
        <span class="tips" v-if="!shopsInfo.headerImage">{{$t('account.user_center_set_photo')}}</span>
        <div class="detail">
          <p>{{$t('public0.public190')}}：<span class="gray" v-if="shopsInfo.nickname">{{shopsInfo.nickname}}</span> <span class="pointer" @click="nicknameDialog" v-else><i class="edit"></i> <span class="blue">{{$t('public0.public40')}}</span></span></p>
          <p class="mt18">{{$t('business.LEVEL')}}：<span class="gray">{{shopsInfo.levelName}}</span><span class="ml50">{{$t('public.fee_rate')}}：<span class="gray">{{shopsInfo.feeRate*100}}%</span></span></p>
          <p class="mt18">{{$t('business.ATTRIBUTION_COMMUNITY')}}：<span class="gray">{{shopsInfo.community}}</span></p>
          <p class="mt18">{{$t('business.TOTAL_VOLUME')}}：<span class="blue">{{(shopsInfo.totalCurrency+'').toMoney()}} CNY</span><span class="ml50">{{$t('business.TOTAL_TRANSACTIONS')}}：<span class="blue">{{shopsInfo.totalNumber}}</span></span></p>
        </div>
      </div>
    </section>
    <section class="mt8 curreny">
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
      <div class="statistics">
        <span>成交量：{{total}} CNY</span>
        <span class="ml50">成交笔数：{{tradeData.length}}</span>
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
        <ul v-if="!tradeLoading && tradeData.length > 0">
          <li class="list" v-for="data in tradeData" :key="data.id">
            <span class="market">{{data.symbol}} <!--交易类别--></span>
            <span class="time">{{data.updated_at}}<!--下单时间--></span>
            <span class="orderNum">{{data.order_number}}<!--订单号--></span>
            <span class="type" :class="data.to_user_name === getUserInfo.username ? 'buy' : 'sell'">{{data.to_user_name === getUserInfo.username ? $t('otc_exchange.otc_exchange_buy') : $t('otc_exchange.otc_exchange_sell')}}<!--类型--></span>
            <span class="price">{{toFixed(data.cur_price, 2)}} {{data.currency}} <!--单价--></span>
            <span class="amount">{{toFixed(data.symbol_count)}} {{data.symbol}} <!--数量--></span>
            <span class="sum">{{toFixed(data.currency_count, 2)}} {{data.currency}} <!--总额--></span>
            <span class="charge">{{toFixed(data.order_fee, 8)}} {{data.symbol}} <!--手续费--></span>
            <span class="status">{{getOrderState(data.state)}}<!--状态--></span>
          </li>
        </ul>
        <page v-if="!tradeLoading && tradeData.length > 0" :pageIndex="params.page" :pageSize="params.show" :total="params.total" @changePageIndex="pageChange"/>
        <div class="nodata" v-if="!tradeLoading && tradeData.length === 0">
          <div class="nodata-icon icon-no-order"></div>
          <div class="nodata-text">{{$t('trade_record.not_otc_record')}}<!--暂无OTC交易记录--></div>
        </div>
        <loading v-if="tradeLoading"/>
      </div>
    </section>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import utils from '@/assets/js/utils'
import merchantApply from '@/public/dialog/merchantApply'
import defaultAvatar from '@/assets/images/icon-merchant.png'
import Datepicker from 'vuejs-datepicker'
import { en, zh } from 'vuejs-datepicker/dist/locale'
import page from '@/components/page'
import loading from '@/components/loading'
import shopsApi from '@/api/shops'
import Config from '@/assets/js/config'
import userUtils from '@/api/individual'
import nickName from '@/public/dialog/nickname'
import otcApi from '@/api/otc'
import exportRecord from '@/public/dialog/exportrecord'
import numberUtils from '@/assets/js/numberUtils'

export default {
  components: {
    Datepicker,
    page,
    loading
  },
  data () {
    return {
      shopsInfo:{headerImage:''},
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
    ...mapGetters(['getLang', 'getApiToken']),
    curLang () {
      return this.getLang === 'en' ? en : zh
    },
    paramsChange () {
      return {
        direction: 2,
        page: this.params.page,
        pageSize: this.params.show
      }
    },
    total(){
      let total = 0
      this.tradeData.forEach(v=>{
        total = numberUtils.add(total, v.currency_count)
      })
      return total.toFixed(2).toMoney()
    }
  },
  created() {
    this.getShopsApply()
    this.chooseTrade()
  },
  methods: {
    getShopsApply(){
      shopsApi.getShopsApply(res=>{
        if(res.data){
          this.shopsInfo = res.data
        }
      })
    },
    setDefaultAvatar(e){ //图片加载失败用默认头像
      let tar = e.currentTarget
      tar.src = defaultAvatar
    },
    uploadImage (e) {
      // 上传头像
      var target = e.target
      if (Config.imageType.test(target.files.item(0).name) === false) {
        return Vue.$koallTipBox({icon: 'notification', message: this.$t('public0.public43')}) // 请上传JPG、PNG、JPEG、BMP格式的图片
      }
      let isTrue = utils.limitUploadImage(target, (msg) => {
        Vue.$koallTipBox({icon: 'notification', message: this.$t(msg)}) // 图片不能超过1M
      }, 1)
      if (!isTrue) {
        target.value = ''
        return
      }
      this.shopsInfo.headerImage = window.URL.createObjectURL(target.files[0])
      var formData = new FormData()
      formData.append('source',target.files[0])
      userUtils.uploadHeader(formData, (msg) => {}, (msg) => {
        Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
      })
    },
    nicknameDialog () {
      // 修改呢称
      utils.setDialog(nickName, {
        nickname: this.nickname,
        okCallback: (aNickName) => {
          this.shopsInfo.nickname = aNickName
        }
      })
    },
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

<style scoped>
.mt8 {margin-top: 8px;}
.mt18 {margin-top: 18px;}
.ml20 {margin-left: 20px;}
.ml50 {margin-left: 50px;}
.pointer {cursor: pointer;}
.container section{background-color: #FFF; border-radius: 4px; box-shadow: 0 1px 3px #e2e2e2;}
section > h3{height: 55px; padding-left: 20px; font-weight: normal;font-size: 18px;line-height: 55px;color: #333;text-indent: 8px;border-bottom: 1px solid #e7e7e7;}
section  .info {padding: 25px 35px 40px; color: #333; display: flex; position: relative;}
section  .info .avatar { width: 130px; height: 130px; background-color: #F5F5F5; position: relative; overflow: hidden;}
section  .info .avatar input {font-size: 95px; position: absolute; z-index: 1; left: 0;top: 0; opacity: 0; }
section  .info .avatar + .tips{position: absolute; z-index: 1; left: 0; width: 200px; text-align: center; top: 4px; display: none;}
section  .info .avatar:hover + .tips{display: block;}
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

