<template>
  <div class="order-list">
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
    <div class="order-list-content" v-if="getApiToken">
        <div class="uncompleted" v-if="params.state === 1">
            <ul class="uncompleted-list">
              <li class="uncompleted-item" v-for="item in data1" :key="item.order_id">
                  <div class="uncompleted-garniture"></div>
                  <div class="uncompleted-title">
                      <span class="numer">{{$t('otc_exchange.otc_exchange_order_number')}}：<!--订单编号-->{{item.order_number}}</span>
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
              </li>
            </ul>
            <page v-if="!loading1 && data1.length > 0" :pageIndex="params.page" :pageSize="params.show" :total="params.total" @changePageIndex="pageChange"/>
            <div class="nodata" v-if="!loading1 && data1.length === 0">
              <div class="nodata-icon icon-no-order"></div>
              <div class="nodata-text">{{$t('public0.public141')}}<!--暂无订单--></div>
            </div>
            <loading v-if="loading1"/>
        </div>
        <div class="completed" v-if="params.state === 2">
            <ul class="completed-list" v-if="!loading2 && data2.length > 0">
              <li class="completed-item">
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
              <li class="completed-item" v-for="item in data2" :key="item.order_id">
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
            <page v-if="!loading2 && data2.length > 0" :pageIndex="params.page" :pageSize="params.show" :total="params.total" @changePageIndex="pageChange"/>
            <div class="nodata" v-if="!loading2 && data2.length === 0">
              <div class="nodata-icon icon-no-order"></div>
              <div class="nodata-text">{{$t('public0.public141')}}<!--暂无订单--></div>
            </div>
            <loading v-if="loading2"/>
        </div>
        <div class="cancelled" v-if="params.state === 3">
            <ul class="cancelled-list" v-if="!loading3 && data3.length > 0">
              <li class="cancelled-item">
                <span class="ordernumber">{{$t('otc_exchange.otc_exchange_order_number')}}<!--订单编号--></span>
                <span class="type">{{$t('exchange.exchange_type')}}<!--类型--></span>
                <span class="stauts">{{$t('otc_ad.otc_ad_status')}}<!--状态--></span>
                <span class="curreny">{{$t('account.estimated_value_coin')}}<!--币种--></span>
                <span class="price">{{$t('otc_exchange.otc_exchange_ask')}}<!--单价--></span>
                <span class="number">{{$t('exchange.exchange_amount')}}<!--数量--></span>
                <span class="money">{{$t('exchange.exchange_total')}}<!--金额--></span>
                <span class="time">{{$t('otc_ad.otc_ad_cacel_time')}}<!--取消时间--></span>
              </li>
              <li class="cancelled-item" v-for="item in data3" :key="item.order_id">
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
            <page v-if="!loading3 && data3.length > 0" :pageIndex="params.page" :pageSize="params.show" :total="params.total" @changePageIndex="pageChange"/>
            <div class="nodata" v-if="!loading3 && data3.length === 0">
              <div class="nodata-icon icon-no-order"></div>
              <div class="nodata-text">{{$t('public0.public141')}}<!--暂无订单--></div>
            </div>
            <loading v-if="loading3"/>
        </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import otcApi from '@/api/otc'
import utils from '@/assets/js/utils'
import numUtils from '@/assets/js/numberUtils'
import appeal from '@/otc/otchome/appeal'
import buyitem from '@/otc/otchome/list/buy'
import sellitem from '@/otc/otchome/list/sell'
import loading from '@/components/loading'
import page from '@/components/page'
export default {
  props: ['hparams'],
  components: {
    loading,
    page
  },
  data () {
    return {
      data1: [], // 未完成订单
      data2: [], // 已完成订单
      data3: [], // 已取消订单
      loading1: true,
      loading3: true,
      loading2: true,
      intervals: [],
      params: {
        state: 1,
        page: 1,
        total: 0
      }
    }
  },
  computed: {
    ...mapGetters(['getApiToken', 'getUserInfo']),
    paramsChange () {
      return {
        state: this.params.state,
        page: this.params.page,
        show: this.params.state === 1 ? 6 : 10
      }
    }
  },
  watch: {
    getApiToken () {
      this.getOrderList()
    },
    'params.state' () {
      // 监听顺序：params.state > paramsChange可避免代码重复执行
      this.params.page = 1
    },
    paramsChange () {
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
              this.data1.forEach((item) => {
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
              this.data1.forEach((item) => {
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
      if (!this.getApiToken) {
        return
      }
      this.data1 = this.data2 = this.data3 = []
      this.loading1 = this.loading2 = this.loading3 = true
      this.intervals.forEach((interval) => {
        clearInterval(interval)
      })
      this.intervals = []
      otcApi.getOrdersList(this.paramsChange, (data, serverTime, total) => {
        data.forEach((item) => {
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
          let diffTime = Math.floor((ndate - date) / 1000)
          let surplusTime = item.pay_apply_time * 60 - diffTime
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
        switch (this.params.state) {
          case 1:
            this.data1 = data
            this.loading1 = false
            break
          case 2:
            this.data2 = data
            this.loading2 = false
            break
          case 3:
            this.data3 = data
            this.loading3 = false
            break
          default:
            return
        }
        this.params.total = total
      }, (msg) => {
        console.error(msg)
      })
    },
    getRight (item) { // 获取购买/出售模板
      return item.from_user_name === this.getUserInfo.username ? sellitem : buyitem
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
    cancelOrderByConfirm (item) { // 取消订单 - 确认提示
      Vue.$confirmDialog({
        content: this.$t('error_code.CANCEL_ORDER_CONFIRM'),
        autoClose: true,
        okCallback: () => {
          this.cancelOrder(item)
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
    switchOldMessage (orderNumber) { // 显示已完成订单聊天记录
      this.$emit('switchOldMessage', orderNumber)
    },
    pageChange (currentIndex) {
      this.params.page = currentIndex
    }
  }
}
</script>

<style scoped>
.order-list{margin-bottom:8px;background-color: #FFF; border-radius: 4px; box-shadow: 0 1px 3px #e2e2e2;}
.order-list-title{height: 49px;padding: 0 20px;border-bottom:1px solid #eee;}
.order-list-title li{float: left;height: 48px;margin: 0 40px -2px 0;line-height: 49px;color: #666;border-bottom:2px solid transparent;cursor: pointer;}
.order-list-title li.active{color: #3283FF;border-bottom-color: #3283FF;}
.order-list-title li:hover{color: #3283FF;}

.uncompleted-list{padding: 8px 8px 0 8px;}
.uncompleted-item{position: relative;margin-top: 8px; border-top-right-radius: 6px; border-bottom-right-radius: 6px; overflow: hidden;}
.uncompleted-item:first-of-type{margin-top: 0;}
.uncompleted-garniture{position: absolute;top: 0;left: 0;z-index: 1;width: 8px;height: 100%;background-color: #3283FF; border-top-left-radius: 6px; border-bottom-left-radius: 6px;}
.uncompleted-title{display: flex;justify-content: space-between;height: 30px;line-height: 30px;padding-left: 16px;border-bottom:1px solid #e6e6e6;padding-right: 16px;background-color: #f5f5f5;}
.uncompleted-title span{display: flex;align-items: center;font-size: 12px;color: #333;}
.uncompleted-title span.numer{width:250px;}
.uncompleted-title span.second{margin-left: 206px;margin-right: auto;}
.uncompleted-title span.last{justify-content: flex-end;width: 230px;margin-left: 18px;}
.uncompleted-title span em{color: #3283FF;padding-left: 10px;cursor: pointer;}
.uncompleted-title span em:hover{color: #2565c5;}
.uncompleted-title span em.disabled{color: #999;cursor: not-allowed;}
.uncompleted-title span.second em{height: 24px;line-height: 24px;}
.uncompleted-title span.second em.username,
.uncompleted-title span.second em.realname{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
.uncompleted-title span.second em.username{max-width: 170px;padding-left: 0;color: #333;}
.uncompleted-title span.second em.realname{max-width: 216px;color: #333;}
.uncompleted-title span.second em.icon-chat{font-size: 20px;}
.uncompleted-title span.last i{color: #F34246;}
.uncompleted-title span.last i.time-text{text-indent: 6px;}

.completed-list,
.cancelled-list{padding-left: 20px;padding-right: 20px;}
.completed-item,
.cancelled-item{display: flex;justify-content: space-between;height: 40px;line-height: 40px;color: #333;border-bottom: 1px solid #eee;cursor: pointer;}
.completed-item span,
.cancelled-item span{font-size: 12px;color: #333;}
.completed-item:first-of-type span,
.cancelled-item:first-of-type span{font-size: 12px;color: #999;}
.completed-item span.ordernumber,
.cancelled-item span.ordernumber{width: 160px}
.completed-item span.type,
.cancelled-item span.type{width: 60px;}
.completed-item span.stauts,
.cancelled-item span.stauts{width: 80px;}
.completed-item span.curreny,
.cancelled-item span.curreny{width: 60px;}
.completed-item span.price,
.cancelled-item span.price{width: 130px;}
.completed-item span.number,
.cancelled-item span.number{width: 160px;}
.completed-item span.money,
.cancelled-item span.money{width: 130px;}
.completed-item span.time,
.cancelled-item span.time{width: 130px;}
.completed-item span.action{width: 130px;}
.completed-item span.action .action-botton{height: 24px;padding: 0 8px;line-height: 24px;text-align: center;color: #3283FF;background-color: transparent;border: 1px solid #3283FF;border-radius: 4px;cursor: pointer;}
.completed-item span.action .action-botton:hover{color: #2565c5;border-color: #2565c5;}
.completed-item span.action em.icon-chat{font-size: 20px;color: #3283FF;vertical-align: middle;}
.completed-item span.action em.icon-chat:hover{color: #2565c5;}

.nodata{text-align: center;}
.nodata-icon{height: 80px;line-height: 80px;font-size: 40px;color: #A1A1A1;}
.nodata-text{height: 40px;line-height: 20px;color: #8b94a9;}
</style>
