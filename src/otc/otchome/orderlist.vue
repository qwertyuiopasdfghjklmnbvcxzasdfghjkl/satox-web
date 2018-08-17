<template>
  <div class="order-list" :style="listCss">
    <ul class="order-list-title">
        <li :class="{active: params.state === 1}" @click="params.state = 1">
            {{$t('public0.public140')}}<!--未完成订单-->
        </li>
        <li :class="{active: params.state === 2}" @click="params.state = 2">
            {{$t('otc_ad.otc_ad_Order_completed')}}<!--已完成订单-->
        </li>
        <li :class="{active: params.state === 3}" @click="params.state = 3">
            {{$t('otc_ad.otc_ad_cancelled_order')}}<!--已取消订单-->
        </li>
    </ul>
    <div v-if="getApiToken && params.state === 1" class="order-list-content">
        <div class="undone" v-for="item in datas" :key="item.order_id">
            <div class="bgh"></div>
            <div class="undone-title">
                <span class="numer">{{$t('otc_exchange.otc_exchange_order_number')}}<!--订单编号-->：{{item.order_number}}</span>
                <span class="second">
                  <em class="username">{{getBuyOrSellUser(item)}}</em>
                  <em class="realname">{{$t('otc_legal.otc_legal_Name')}}：{{item.from_user_name === getUserInfo.username ? item.to_real_name : item.from_real_name}}</em>
                  <em class="icon-chat" @click="switchOldMessage(item.order_number)"></em>
                </span>
                <span class="last">
                  <template v-if="item.state === 1">
                    <template v-if="item.pay_state === 0">
                      <i class="time-icon icon-clock"></i>
                      <i class="time-text">{{$t('public0.public62')}}：{{item.surplus_Time}}</i>
                    </template>
                    <template v-if="item.pay_state === 1">
                      <em @click="apeal(item)" v-if="item.appeal_state !== 0">{{$t('otc_exchange.otc_exchange_complaint')}}<!--发起申诉--></em>
                      <em @click="cancelApeal(item)" v-if="item.appeal_state === 0">{{$t('public0.public208')}}<!--取消申诉--></em>
                    </template>
                    <template v-if="item.pay_state === 0 && item.from_user_name !== getUserInfo.username">
                      <em @click="cancelOrderByConfirm(item)">{{$t('otc_ad.otc_ad_cancel_order')}}<!--取消订单--></em>
                    </template>
                  </template>
                </span>
            </div>
            <mycomponent :item="item" :is="getRight(item)" @cancelOrder="cancelOrder"/>
        </div>
        <page v-if="datas.length" :pageIndex="params.page" :pageSize="params.show" :total="params.total" @changePageIndex="pageChange"/>
    </div>
    <div v-if="getApiToken && params.state === 2">
        <ul class="completed" v-if="datas.length">
          <li class="completed-li">
            <span class="ordernumber">{{$t('otc_exchange.otc_exchange_order_number')}}<!--订单编号--></span>
            <span class="type">{{$t('exchange.exchange_type')}}<!--类型--></span>
            <span class="stauts">{{$t('otc_ad.otc_ad_status')}}<!--状态--></span>
            <span class="curreny">{{$t('account.estimated_value_coin')}}<!--币种--></span>
            <span class="price">{{$t('otc_exchange.otc_exchange_ask')}}<!--单价--></span>
            <span class="number">{{$t('exchange.exchange_amount')}}<!--数量--></span>
            <span class="money">{{$t('exchange.exchange_total')}}<!--金额--></span>
            <span class="time">{{$t('otc_ad.otc_ad_end_time')}}<!--完成时间--></span>
            <span class="action">{{$t('otc_exchange.otc_exchange_operating')}}<!--操作--></span>
          </li>
          <li class="completed-li" v-for="item in datas" :key="item.order_id">
            <span class="ordernumber">{{item.order_number}}</span>
            <span class="type">{{getTradeType(item)}}</span>
            <span class="stauts">{{getOrderState(item.state)}}</span>
            <span class="curreny">{{item.symbol}}</span>
            <span class="price">{{item.cur_price}} {{item.currency}}</span>
            <span class="number">{{item.symbol_count}} {{item.symbol}}</span>
            <span class="money">{{item.currency_count}} {{item.currency}}</span>
            <span class="time">{{item.updated_at}}</span>
            <span class="action">
              <a class="action-botton" @click="apeal(item)" v-if="item.appeal_state !== 0">
                {{$t('otc_exchange.otc_exchange_complaint')}}<!--发起申诉-->
              </a>
              <a class="action-botton" @click="cancelApeal(item)" v-if="item.appeal_state === 0">
                {{$t('public0.public208')}}<!--取消申诉-->
              </a>
              <em class="icon-chat" @click="switchOldMessage(item.order_number)"></em>
            </span>
          </li>
        </ul>
        <page v-if="datas.length" :pageIndex="params.page" :pageSize="params.show" :total="params.total" @changePageIndex="pageChange"/>
    </div>
    <div v-if="getApiToken && params.state === 3">
        <ul class="completed" v-if="datas.length">
          <li class="completed-li">
            <span class="ordernumber">{{$t('otc_exchange.otc_exchange_order_number')}}<!--订单编号--></span>
            <span class="type">{{$t('exchange.exchange_type')}}<!--类型--></span>
            <span class="stauts">{{$t('otc_ad.otc_ad_status')}}<!--状态--></span>
            <span class="curreny">{{$t('account.estimated_value_coin')}}<!--币种--></span>
            <span class="price">{{$t('otc_exchange.otc_exchange_ask')}}<!--单价--></span>
            <span class="number">{{$t('exchange.exchange_amount')}}<!--数量--></span>
            <span class="money">{{$t('exchange.exchange_total')}}<!--金额--></span>
            <span class="time">{{$t('otc_ad.otc_ad_cacel_time')}}<!--取消时间--></span>
          </li>
           <li class="completed-li" v-for="item in datas" :key="item.order_id">
            <span class="ordernumber">{{item.order_number}}</span>
            <span class="type">{{getTradeType(item)}}</span>
            <span class="stauts">{{getOrderState(item.state)}}</span>
            <span class="curreny">{{item.symbol}}</span>
            <span class="price">{{item.cur_price}} {{item.currency}}</span>
            <span class="number">{{item.symbol_count}} {{item.symbol}}</span>
            <span class="money">{{item.currency_count}} {{item.currency}}</span>
            <span class="time">{{item.updated_at}}</span>
          </li>
        </ul>
        <page v-if="datas.length" :pageIndex="params.page" :pageSize="params.show" :total="params.total" @changePageIndex="pageChange"/>
    </div>
    <div class="no-data" v-if="getApiToken && !show && datas.length===0">
      <em class="no-data-em icon-no-order"/>
      <p class="no-data-p">{{$t('public0.public141')}}<!--暂无订单--></p>
    </div>
    <loading v-if="getApiToken && show"/>
  </div>
</template>

<script>
import Vue from 'vue'
import otcApi from '@/api/otc'
import loading from '@/components/loading'
import { mapGetters, mapActions } from 'vuex'
import numUtils from '@/assets/js/numberUtils'
import utils from '@/assets/js/utils'
import buyitem from '@/otc/otchome/list/buy'
import sellitem from '@/otc/otchome/list/sell'
import application from './application'
import appeal from './appeal'
import page from '@/components/page'
export default {
  props: ['hparams'],
  components: {
    loading,
    page
  },
  data () {
    return {
      loading: true,
      show: true,
      datas: [],
      intervals: [],
      params: {
        page: 1,
        state: 1,
        total: 0
      }
    }
  },
  computed: {
    ...mapGetters(['getApiToken', 'getUserInfo']),
    paramsChange () {
      return {
        page: this.params.page,
        show: this.getApiToken && this.params.state === 1 ? 6 : 10,
        state: this.params.state
      }
    },
    listCss () {
      if (this.getApiToken) {
        return {'min-height': '100px'}
      } else {
        return {}
      }
    }
  },
  watch: {
    'params.state' () {
      // 监听顺序：params.state > paramsChange可避免代码重复执行
      this.params.page = 1
    },
    paramsChange () {
      this.getOrderList()
    },
    getApiToken () {
      this.getOrderList()
    },
    'hparams.newOrderCount' () {
      this.getOrderList()
    }
  },
  created () {
    this.getOrderList()
    this.$nextTick(() => {
      this.addEvents({
        name: 'updateOrderList',
        fun: this.getOrderList
      })
    })
    this.addOtcSocketEvent(this.systemEvent)
  },
  beforeDestroy () {
    this.intervals.forEach((interval) => {
      clearInterval(interval)
    })
    this.removeEvents('updateOrderList')
    this.removeOtcSocketEvent(this.systemEvent)
  },
  methods: {
    ...mapActions(['addOtcSocketEvent', 'removeOtcSocketEvent', 'addEvents', 'removeEvents', 'tiggerEvents']),
    systemEvent (data) {
      let optType = parseInt(data.operate_type)
      let childType = parseInt(data.child_type)
      if (optType === 1) { // 系统消息
        switch (childType) {
          case 31: // 新建订单消息
          case 32: // 取消订单消息
          case 33: // 系统自动取消订单消息
          case 34: // 买家付款消息
          case 35: // 正常放币消息
          case 36: // 强制放币买家消息
          case 37: // 强制放币卖家消息
          case 38: // 解除锁币消息
            let orderNumber = JSON.parse(data.link).order_number
            if (childType === 34) {
              Vue.$confirmDialog({
                id: 'pay_success_tip',
                showCancel: false,
                content: this.$t('error_code.CONFIRM_PAYMENT') // 买方已经标记确认付款，请查收！
              })
              this.datas.forEach((item) => {
                if (orderNumber === item.order_number) {
                  item.pay_state = 1
                }
              })
            } else if (childType === 35) {
              Vue.$confirmDialog({
                id: 'put_coin_success_tip',
                showCancel: false,
                content: this.$t('error_code.CONFIRM_PAYMENT_RECEIPT') // 卖方确认收款，已放币！请进行评价！
              })
              this.datas.forEach((item) => {
                if (orderNumber === item.order_number) {
                  item.state = 2
                }
              })
            } else {
              this.getOrderList()
            }
            break
        }
      }
    },
    getOrderList () { // 获取订单列表
      this.show = true
      if (!this.getApiToken) {
        this.datas = []
        this.params.total = 0
        this.show = false
        return
      }
      this.intervals.forEach((interval) => {
        clearInterval(interval)
      })
      this.intervals = []
      this.datas = []
      otcApi.getOrdersList(this.paramsChange, (res, serverTime, total) => {
        res.forEach((item) => {
          // 类型转换
          item.state = parseInt(item.state)
          item.pay_state = parseInt(item.pay_state)
          item.to_user_apply = parseInt(item.to_user_apply)
          item.trade_type = parseInt(item.trade_type)
          item.from_user_comment = parseInt(item.from_user_comment)
          item.to_user_comment = parseInt(item.to_user_comment)

          item.pay_type = `${item.pay_type || ''}`
          item.cur_price = utils.removeEndZero(numUtils.BN(item.cur_price).toFixed(2))
          item.symbol_count = utils.removeEndZero(numUtils.BN(item.symbol_count).toFixed(8))
          item.total_price = utils.removeEndZero(numUtils.BN(item.currency_count).toFixed(2))
          item.surplus_Time = '00:00'
          let date = utils.formatDate(item.apply_time).getTime()
          let ndate = utils.formatDate(serverTime).getTime()
          var diffTime = Math.floor((ndate - date) / 1000)
          var surplusTime = item.pay_apply_time * 60 - diffTime
          let interval = utils.countDown(surplusTime, (time) => {
            if (time === '00:00') {
              item.isExpire = true
            } else if (time === '05:00' && item.to_user_name === this.getUserInfo.username && item.pay_state === 0) {
              // 您的付款确认时间还剩5分钟，5分钟后系统将自动取消订单！请付款并标记确认付款！
              Vue.$confirmDialog({
                id: 'count_down_tip',
                showCancel: false,
                content: this.$t('error_code.PAYMENT_TIMEOUT_REMIND')
              })
              // 添加系统消息
              this.$emit('addSystemMessage', item.order_number, 'PAYMENT_TIMEOUT_REMIND')
            }
            item.surplus_Time = time
          })
          this.intervals.push(interval)
          item.isExpire = surplusTime <= 0
        })
        this.datas = res
        this.params.total = total
        this.show = false
      }, (res) => {
        this.datas = []
        this.show = false
      })
    },
    isShow (data) {
      return data.trade_type === 1 && data.from_user_name === this.getUserInfo.username
    },
    getTradeType (data) { // 交易类型
      if (data.to_user_name === this.getUserInfo.username) {
        return this.$t('otc_exchange.otc_exchange_buy')
      }
      return this.$t('otc_exchange.otc_exchange_sell')
    },
    getBuyOrSellUser (data) {
      if (data.from_user_name === this.getUserInfo.username) {
        return `${this.$t('public0.public148')}：${data.to_user_name}`
      }
      return `${this.$t('public0.public149')}：${data.from_user_name}`
    },
    getOrderState (state) { // 获取订单状态
      if (state === 1) {
        return this.$t('public0.public14') // 交易中
      } else if (state === 2) {
        return this.$t('otc_ad.otc_ad_completed') // 已完成
      } else if (state === 3) {
        return this.$t('public0.public25') // 已取消
      } else {
        return ''
      }
    },
    cancelOrder (item, noMsg) { // 取消订单
      otcApi.cancelOrder(item.order_id, {
        system_cancel: noMsg || false
      }, (msg) => {
        this.tiggerEvents({
          name: 'chatEvent',
          params: {
            type: 'markReadOnly',
            orderNumber: item.order_number
          }
        })
        this.getOrderList()
        !noMsg && Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
      }, (msg) => {
        !noMsg && Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
      })
    },
    cancelOrderByConfirm (item) {
      Vue.$confirmDialog({
        content: this.$t('error_code.CANCEL_ORDER_CONFIRM'),
        autoClose: true,
        okCallback: () => {
          this.cancelOrder(item)
        }
      })
    },
    getRight (item) {
      return item.from_user_name === this.getUserInfo.username ? sellitem : buyitem
    },
    showDelay (item) {
      if (!item.surplus_Time) {
        return false
      }
      var sp = item.surplus_Time.split(':')
      var surplusTime = sp[0] * 60 + sp[1] * 1
      return surplusTime <= 5 * 60
    },
    delay (item) {
      if (item && item.to_user_apply === 1) {
        return
      }
      utils.setDialog(application, {
        id: item.id,
        okCallback: () => {
          this.getOrderList()
        }
      })
    },
    apeal (item) { // 发起申诉
      utils.setDialog(appeal, {
        orderNumber: item.order_number,
        okCallback: () => {
          this.getOrderList()
        }
      })
    },
    cancelApeal (item) { // 取消申诉
      otcApi.cancelAppeal(item.appeal_manage_id, (msg) => {
        this.getOrderList()
        Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
      }, (msg) => {
        Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
      })
    },
    switchOldMessage (orderNumber) {
      this.$emit('switchOldMessage', orderNumber)
    },
    pageChange (currentIndex) {
      this.params.page = currentIndex
    }
  }
}
</script>

<style scoped>
input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{-webkit-appearance:none !important;margin: 0;}
.order-list{position:relative;margin-bottom:8px;background-color:#181b2a;}
.order-list ul {display: flex;}
.order-list .order-list-title{padding: 0 20px;border-bottom:1px solid #404b69;}
.order-list ul li{height: 24px;line-height: 24px;color: #8b94a9;cursor: pointer;margin: 0 20px 0 20px;display: flex;justify-content: space-between;border-bottom:1px solid #404b69;}
.order-list .order-list-title > li{margin: 0 40px -1px 0;}
.order-list > ul > li:hover,
.order-list > ul > li.active{border-bottom:1px solid #11a8fe;color:#11a8fe;}
.order-list-content{display:flex;flex-flow:column;}
.undone{position: relative;padding: 0 8px;margin-top:10px;}
.undone-title{height: 24px;line-height: 24px;background-color: #2d344e;padding-left: 18px; border-bottom:1px solid #404b69;padding-right: 16px;display: flex;justify-content: space-between;}
.undone-title span{display:flex;align-items:center;color:#8a93a8;font-size: 12px;}
.undone-title span::before{padding-right:2px;}
.undone-title span.numer{margin-left:18px;width:250px;}
.undone-title span.second{margin-left: 206px;margin-right: auto;}
.undone-title span.last{justify-content:flex-end;width:230px;margin-left: 18px;}
.undone-title span.last i{color:#0ee7a5;}
.undone-title span.last i.time-text{text-indent: 6px;}
.undone-title span em{color: #11a8fe;padding-left: 10px;cursor: pointer;}
.undone-title span em:hover{color: #15c9ff;}
.undone-title span em.disabled{color:#afb9ce;cursor:not-allowed;}
.undone-title span.second em{height: 24px;line-height: 24px;}
.undone-title span.second em.username,
.undone-title span.second em.realname{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
.undone-title span.second em.username{max-width: 170px;padding-left: 0;color: #8a93a8;}
.undone-title span.second em.realname{max-width: 216px;color: #aeb7d0;}
.bgh{width: 8px;height: 100%;position: absolute;background-color: #11a8fe;z-index: 99;left: 8px;}
.order-list ul.completed{display: block;}
.completed-li span{display: inline-block;color: #8b94a9;font-size: 12px;line-height:22px;}
.completed-li span.ordernumber{width: 160px}
.completed-li span.type{width: 60px;}
.completed-li span.stauts{width: 80px;}
.completed-li span.curreny{width: 60px;}
.completed-li span.price{width: 130px;}
.completed-li span.number{width: 160px;}
.completed-li span.money{width: 130px;}
.completed-li span.time{width: 130px;}
.completed-li span.action{width: 130px;}
.completed-li span.action .action-botton{height: 24px;padding: 0 8px;line-height: 24px;text-align: center;color: #11a8fe;background-color: transparent;border: 1px solid #11a8fe;border-radius: 4px;cursor: pointer;}
.completed-li span.action .action-botton:hover{color: #15c9ff;border-color: #15c9ff;}

.icon-chat{color:#11a8fe;font-size:20px;vertical-align:middle;}
.icon-chat:hover{color:#15c9ff;}
.no-data{width:100%;text-align: center;display:flex;flex-flow:column;}
.no-data-em{margin:30px 0px 20px 0px;font-size:40px;color:#8b94a9;}
.no-data-p{color:#8b94a9;font-size:14px;padding-bottom: 30px;}
</style>
