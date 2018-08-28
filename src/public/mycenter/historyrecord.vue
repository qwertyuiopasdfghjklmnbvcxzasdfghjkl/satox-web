<template>
    <div class="history-record">
        <div class="recharge">
            <h3>
              <span>{{$t('account.user_center_history_deposit')}}<!--充值记录--></span>
              <a href="javascript:;" @click="switch_tab('digassets')">{{$t('public0.public11')}}<!--返回--></a>
            </h3>
            <ul v-if="!rechargeLoading && rechargeHistory.length > 0">
                <li>
                    <span class="id">{{$t('account.user_center_history_tradeID')}}<!--交易ID--></span>
                    <span class="currency">{{$t('account.user_center_history_coin')}}<!--币种--></span>
                    <span class="quantity">{{$t('account.user_center_history_amount')}}<!--数量--></span>
                    <span class="address">{{$t('account.user_center_history_address')}}<!--转入地址--></span>
                    <span class="progress">{{$t('account.user_center_history_progress')}}<!--区块进度--></span>
                    <span class="status">{{$t('account.user_center_history_status')}}<!--状态--></span>
                    <span class="time">{{$t('account.user_center_history_receiveTime')}}<!--到账时间--></span>
                </li>
                <li v-for="(item, index) in rechargeHistory" :key="index">
                    <span class="id" :title="item.txId">{{item.txId}}</span>
                    <span class="currency">{{item.symbol}}</span>
                    <span class="quantity">{{toFixed(item.amount)}}</span>
                    <span class="address" :title="item.fromAddress">{{item.fromAddress}}</span>
                    <span class="progress">{{Math.min(item.confirmation, item.blockConfirm)}}/{{item.blockConfirm}}</span>
                    <span class="status" :class="getRechargeState(item.status)['className']">{{getRechargeState(item.status)['value']}}</span>
                    <span class="time">{{item.competedAt ? new Date(Number(item.competedAt)).format() : '--'}}</span>
                </li>
            </ul>
            <page v-if="!rechargeLoading && rechargeHistory.length > 0" :pageIndex="params.page" :pageSize="params.show" :total="params.total" @changePageIndex="pageChange"/>
            <div class="nodata" v-if="!rechargeLoading && rechargeHistory.length === 0">
                <div class="nodata-icon icon-no-order"></div>
                <div class="nodata-text">{{$t('account.user_center_history_noDeposit')}}<!--暂无充值记录--></div>
            </div>
            <loading v-if="rechargeLoading"/>
        </div>
        <div class="withdrawal">
            <h3>{{$t('account.user_center_history_withdrawal')}}<!--提现记录--></h3>
            <ul v-if="!withdrawalLoading && withdrawalHistory.length > 0">
                <li>
                    <span class="id">{{$t('account.user_center_history_tradeID')}}<!--交易ID--></span>
                    <span class="currency">{{$t('account.user_center_history_coin')}}<!--币种--></span>
                    <span class="quantity">{{$t('account.user_center_history_amount')}}<!--数量--></span>
                    <span class="address">{{$t('account.user_center_history_address')}}<!--转入地址--></span>
                    <span class="status">{{$t('account.user_center_history_status')}}<!--状态--></span>
                    <span class="time">{{$t('account.user_center_history_sendTime')}}<!--发送时间--></span>
                </li>
                <li v-for="(item, index) in withdrawalHistory" :key="index">
                    <span class="id" :title="item.txId">{{item.txId || '--'}}</span>
                    <span class="currency">{{item.symbol}}</span>
                    <span class="quantity">{{toFixed(item.amount)}}</span>
                    <span class="address" :title="item.toAddress">{{item.toAddress}}</span>
                    <span class="status" :class="getWithdrawalState(item.status)['className']">{{getWithdrawalState(item.status)['value']}}</span>
                    <span class="time">{{item.updatedAt ? new Date(Number(item.updatedAt)).format() : '--'}}</span>
                </li>
            </ul>
            <page v-if="!withdrawalLoading && withdrawalHistory.length > 0" :pageIndex="params2.page" :pageSize="params2.show" :total="params2.total" @changePageIndex="pageChange2"/>
            <div class="nodata" v-if="!withdrawalLoading && withdrawalHistory.length === 0">
                <div class="nodata-icon icon-no-order"></div>
                <div class="nodata-text">{{$t('account.user_center_history_noWithdrawal')}}<!--暂无提现记录--></div>
            </div>
            <loading v-if="withdrawalLoading"/>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import userUtils from '@/api/wallet'
import page from '@/components/page'
import loading from '@/components/loading'
import numUtils from '@/assets/js/numberUtils'
export default {
  components: {
    page,
    loading
  },
  data () {
    return {
      params: {
        page: 1,
        show: 10,
        total: 0
      },
      params2: {
        page: 1,
        show: 10,
        total: 0
      },
      rechargeHistory: [],
      withdrawalHistory: [],
      rechargeLoading: true,
      withdrawalLoading: true
    }
  },
  computed: {
    paramsChange () {
      return {
        direction: 1,
        page: this.params.page,
        pageSize: this.params.show
      }
    },
    params2Change () {
      return {
        direction: 2,
        page: this.params2.page,
        pageSize: this.params2.show
      }
    }
  },
  watch: {
    paramsChange () {
      this.getListDepositHistory()
    },
    params2Change () {
      this.getListWithdrawHistory()
    }
  },
  created () {
    this.getListDepositHistory()
    this.getListWithdrawHistory()
  },
  methods: {
    switch_tab (tab) {
      this.$emit('switchTab', tab)
    },
    getListDepositHistory () { // 获取充值记录
      this.rechargeLoading = true
      userUtils.listDepositHistory(this.paramsChange, (res) => {
        this.rechargeHistory = res.data
        this.params.total = res.total
        this.rechargeLoading = false
      }, (msg) => {
        console.error(msg)
        Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
      })
    },
    getListWithdrawHistory () { // 获取提现记录
      this.withdrawalLoading = true
      userUtils.listDepositHistory(this.params2Change, (res) => {
        this.withdrawalHistory = res.data
        this.params2.total = res.total
        this.withdrawalLoading = false
      }, (msg) => {
        console.error(msg)
        Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
      })
    },
    getRechargeState (state) { // 获取充值状态
      if (state === 1) {
        return {
          className: 'underway',
          value: this.$t('account.user_center_history_status_wait') // 等待中
        }
      } else if (state === 2) {
        return {
          className: 'success',
          value: this.$t('account.user_center_history_status_success') // 成功
        }
      } else {
        return {
          className: null,
          value: null
        }
      }
    },
    getWithdrawalState (state) { // 获取提现状态
      switch (state) {
        case 1:
          return {
            className: 'underway',
            value: this.$t('account.user_center_history_status_review') // 审核中
          }
        case 2:
        case 3:
          return {
            className: 'underway',
            value: this.$t('account.user_center_history_status_withdrawal') // 提现中
          }
        case 4:
          return {
            className: 'fail',
            value: this.$t('account.user_center_history_status_repeal') // 已撤销
          }
        case 5:
          return {
            className: 'fail',
            value: this.$t('account.user_center_history_status_fail') // 失败
          }
        case 6:
          return {
            className: 'success',
            value: this.$t('account.user_center_history_status_complete') // 已完成
          }
        default:
          return {
            className: null,
            value: null
          }
      }
    },
    pageChange (currentIndex) {
      this.params.page = currentIndex
    },
    pageChange2 (currentIndex) {
      this.params2.page = currentIndex
    },
    toFixed (v1) {
      return numUtils.BN(v1).toFixed(8)
    }
  }
}
</script>

<style scoped>
.recharge{background-color: #222121;}
.recharge h3{position: relative;height: 24px;line-height: 24px;background-color: #333232;}
.recharge h3 span{margin-left: 8px;font-weight: normal;font-size: 14px;color: #cbd4ec;}
.recharge h3 a{position: absolute;top: 0;right: 8px;height: 24px;font-weight: normal;font-size: 14px;line-height: 24px;color: #11a8fe;text-decoration: underline;}
.recharge h3 a:hover{color: #15c9ff;}
.recharge ul{padding-left: 8px;padding-right: 8px;}
.recharge ul li{display: flex;justify-content: space-between;min-height: 30px;line-height: 30px;border-bottom: 1px solid #404b69;}
.recharge ul li span{color: #8b94a9;}
.recharge ul li span.id{width: 170px;padding-right: 12px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
.recharge ul li span.currency{width: 80px;}
.recharge ul li span.quantity{width: 160px;}
.recharge ul li span.address{width: 190px;padding-right: 12px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
.recharge ul li span.progress{width: 120px;}
.recharge ul li span.status{width: 100px;}
.recharge ul li span.time{width: 140px;}
.recharge ul li span.status.underway{color: #11a8fe;}
.recharge ul li span.status.success{color: #03c087;}

.withdrawal{margin-top: 8px;background-color: #222121;}
.withdrawal h3{height: 24px;font-weight: normal;font-size: 14px;line-height: 24px;color: #cbd4ec;text-indent: 8px;background-color: #333232;}
.withdrawal ul{padding-left: 8px;padding-right: 8px;}
.withdrawal ul li{display: flex;justify-content: space-between;min-height: 30px;line-height: 30px;border-bottom: 1px solid #404b69;}
.withdrawal ul li span{color: #8b94a9;}
.withdrawal ul li span.id{width: 230px;padding-right: 12px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
.withdrawal ul li span.currency{width: 80px;}
.withdrawal ul li span.quantity{width: 160px;}
.withdrawal ul li span.address{width: 250px;padding-right: 12px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
.withdrawal ul li span.status{width: 100px;}
.withdrawal ul li span.time{width: 140px;}
.withdrawal ul li span.status.underway{color: #11a8fe;}
.withdrawal ul li span.status.fail{color: #e76d42;}
.withdrawal ul li span.status.success{color: #03c087;}

.nodata{text-align: center;}
.nodata .nodata-icon{height: 80px;line-height: 80px;font-size: 40px;color: #8b94a9;}
.nodata .nodata-text{height: 40px;line-height: 20px;color: #8b94a9;}
</style>

