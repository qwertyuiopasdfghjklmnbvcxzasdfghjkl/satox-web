<template>
    <div class="balance">
        <div class="balance-content" v-if="!showLoading">
            <div class="title">
                {{$t('exchange.exchange_valuation')}}<!--当前总估值-->：{{BTCValuation}} BTC / {{getCoinSign}}{{String(USDCNY).toMoney()}}
            </div>
            <ul class="list-header">
                <li class="list-header-item">
                    <span class="list-col col-currency">
                      {{$t('account.estimated_value_coin')}}<!--币种-->
                    </span>
                    <span class="list-col col-sum">
                      {{$t('account.estimated_value_total')}}<!--总金额-->
                    </span>
                    <span class="list-col col-balance">
                      {{$t('account.estimated_value_available')}}<!--可用余额-->
                    </span>
                   <span class="list-col col-fsum">
                      {{$t('public0.public34')}}<!--冻结金额-->
                    </span>
                    <span class="list-col col-operate">
                      {{$t('otc_exchange.otc_exchange_operating')}}<!--操作-->
                    </span>
                </li>
            </ul>
            <ul class="list">
                <li class="list-item" v-for="(item, index) in sortDatas" :key="index">
                    <span class="list-col col-currency">{{item.symbol}}</span><!--币种-->
                    <span class="list-col col-sum">{{toFixed(item.totalBalance).toMoney()}}</span><!--总金额-->
                    <span class="list-col col-balance">{{toFixed(item.availableBalance).toMoney()}}</span><!--可用余额-->
                    <span class="list-col col-fsum">{{toFixed(item.frozenBalance).toMoney()}}</span><!--冻结金额-->
                    <span class="list-col col-operate">
                      <a class="recharge-link" :class="{disabled:Number(item.rechargeFlag) !== 1}" href="javascript:;" @click="Number(item.rechargeFlag) !== 1 ? false : openQrCode(item)">{{$t('account.estimated_value_deposit')}}<!--充值--></a>
                      <a class="withdrawals-link" :class="{disabled:Number(item.withdrawFlag) !== 1}" href="javascript:;" @click="Number(item.withdrawFlag) !== 1 ? false : withdrawDalog(item)">{{$t('account.estimated_value_withdrawal')}}<!--提现--></a>
                    </span><!--操作-->
                </li>
            </ul>
        </div>
        <loading :size="24" v-if="showLoading"/>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import walletApi from '@/api/wallet'
import loading from '@/components/loading'
import utils from '@/assets/js/utils'
import adressCava from '@/public/mycenter/adresscava'
import withdrawInfo from '@/public/mycenter/withdrawInfo'
import numUtils from '@/assets/js/numberUtils'
import userApi from '@/api/individual'
export default {
  props: {
    toFixed: null,
    fixedNumber: null,
    baseSymbol: {
      type: String
    },
    currentSymbol: {
      type: String
    }
  },
  components: {
    loading
  },
  data () {
    return {
      googleState: 0,
      verifyState: 0,
      mobileState: 0,
      showLoading: true,
      datas: [],
      tradeAct: []
    }
  },
  computed: {
    ...mapGetters(['getApiToken', 'getUSDCNY', 'getBTCValuation', 'getCoinSign', 'getUserInfo']),
    BTCValuation () {
      if (!this.getApiToken) {
        return numUtils.BN(0).toFixed(this.fixedNumber)
      }
      return numUtils.BN(this.getBTCValuation).toFixed(this.fixedNumber).toMoney()
    },
    USDCNY () {
      if (!this.getApiToken) {
        return numUtils.BN(0).toFixed(2)
      }
      return numUtils.mul(this.getBTCValuation, this.getUSDCNY).toFixed(2)
    },
    fromWallet () {
      let w = null
      this.tradeAct.forEach((item) => {
        if (item.symbol === this.currentSymbol) {
          w = item
        }
      })
      return w
    },
    toWallet () {
      let w = null
      this.datas.forEach((item) => {
        if (item.symbol === this.baseSymbol) {
          w = item
        }
      })
      return w
    },
    buyToWallet () {
      let w = null
      this.datas.forEach((item) => {
        if (item.symbol === this.currentSymbol) {
          w = item
        }
      })
      return w
    },
    sortDatas () {
      let ndatas = this.datas.sort((item1, item2) => {
        let m1 = numUtils.BN(item1.totalBalance)
        let m2 = numUtils.BN(item2.totalBalance)
        if (m1.equals(m2)) {
          return 0
        }
        return this.sort === 'desc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
      })
      return ndatas
    }
  },
  watch: {
    getApiToken () {
      this.changeLogin()
    },
    fromWallet () {
      this.$parent.$parent.fromWallet = this.fromWallet
    },
    toWallet () {
      this.$parent.$parent.toWallet = this.toWallet
    },
    buyToWallet (){
      this.$parent.$parent.buyToWallet = this.buyToWallet
    }
  },
  created () {
    this.$nextTick(() => {
      this.addEvents({
        name: 'balanceEvent',
        fun: this.balanceEvent
      })
    })
    this.changeLogin()
  },
  beforeDestroy () {
    this.removeEvents('balanceEvent')
  },
  methods: {
    ...mapActions(['addEvents', 'removeEvents']),
    balanceEvent (res) {
      // 已退出登录后，返回的数据不在处理
      if (!this.getApiToken) {
        return
      }
      if (res && res.type === 'updateData') {
        let temp = {}, temp2 = {}
        res.data[0].forEach((item) => {
          temp[item.accountName] = item
        })
        this.datas.forEach((item) => {
          let d = temp[item.accountName]
          if (d) {
            item.availableBalance = d.availableBalance
            item.frozenBalance = numUtils.add(d.frozenBalance, d.adFrozenBalance).add(d.loanBalance).toFixed(8)
            item.totalBalance = d.totalBalance
          }
        })

        res.data[1].forEach((item) => {
          temp2[item.accountName] = item
        })
        this.tradeAct.forEach((item) => {
          let d = temp2[item.accountName]
          if (d) {
            item.availableBalance = d.availableBalance
            item.frozenBalance = numUtils.add(d.frozenBalance, d.adFrozenBalance).add(d.loanBalance).toFixed(8)
            item.totalBalance = d.totalBalance
          }
        })
      }
    },
    changeLogin () {
      if (this.getApiToken) {
        this.showLoading = true
        walletApi.myAssets({}, (data) => {
          let datas = [], tradeAct = []
          data.forEach((item) => {
            item.frozenBalance = numUtils.add(item.frozenBalance, item.adFrozenBalance).add(item.loanBalance).toFixed(8)
          })
          for(let item of data){
            if(item.type===1){
              datas.push(item)
            } else {
              tradeAct.push(item)
            }
          }
          this.datas = datas
          this.tradeAct = tradeAct
          this.showLoading = false
        }, (data, msg) => {
          console.error(msg)
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
          this.showLoaing = false
        })
        // 获取当前用户状态信息
        userApi.getUserState((data) => {
          this.googleState = data.googleState
          this.verifyState = data.verifyState
          this.mobileState = data.mobileAuthState
        }, (msg) => {
          console.error(msg)
        })
      } else {
        this.googleState = 0
        this.verifyState = 0
        this.mobileState = 0
        this.showLoading = false
        this.datas = []
      }
    },
    openQrCode (item) { // 充值地址
      utils.setDialog(adressCava, {
        addr: item.address,
        symbol: item.symbol
      })
    },
    withdrawDalog (item) {
      if (this.verifyState !== 2) {
        Vue.$confirmDialog({
          id: 'KYC_AUTH_FIRST',
          showCancel: false,
          content: this.$t(`error_code.KYC_AUTH_FIRST`), // 请先完成实名认证
          okCallback: () => {
            this.$router.push({name: 'mycenter_menu', params: {menu: 'mycenter'}})
          }
        })
        return
      }
      if (this.googleState !== 1 && this.mobileState !== 1) {
        Vue.$confirmDialog({
          id: 'GOOGLEAUTH_OR_SMSAUTH_FIRST',
          showCancel: false,
          content: this.$t('error_code.GOOGLE_CELLPHONE_AUTH_FIRST'), // 请先进行谷歌验证或短信验证
          okCallback: () => {
            this.$router.push({name: 'mycenter_menu', params: {menu: 'safety'}})
          }
        })
        return
      }
      if (!this.getUserInfo.email && this.mobileState !== 1) {
        Vue.$confirmDialog({
          id: 'SMS_AUTH_FIRST',
          showCancel: false,
          content: this.$t('error_code.CELLPHONE_AUTH_FIRST'), // 请先进行短信验证
          okCallback: () => {
            this.$router.push({name: 'mycenter_menu', params: {menu: 'safety'}})
          }
        })
        return
      }
      utils.setDialog(withdrawInfo, {
        symbol: item.symbol,
        available: item.availableBalance,
        fromAddress: item.address,
        procedure: item.procedureFee,  // 手续费费率
        minWithdraw: item.minWithdraw, // 最小数量
        fromAccount: item.accountId // 用户id
      })
    }
  }
}
</script>

<style scoped>
.balance{height: 150px;}
.title{height: 36px;line-height: 36px;color: #333;font-size: 16px;}
.list{height: 94px;overflow-x: hidden;overflow-y: auto;}
.list-header-item,
.list-item{display: flex;font-size: 12px;line-height: 20px;}
.list-header-item{color: #A1A1A1;}
.list-item{color: #333;}
.list-item:hover{background-color: #e7e7e7;}
.list-col{flex: 1 1 auto;padding-right: 10px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
.col-currency{width: 140px;}
.col-sum,
.col-balance,
.col-fsum{width: 240px;text-align: right;}
.col-operate{width: 240px;text-align: right;}
.col-operate a{margin-left: 10px;font-size: 12px;color: #3A76E7;}
.col-operate a:hover{color: #3A76E7;}
.col-operate a.disabled{color: #ababab;cursor: not-allowed;}
.col-operate a.disabled:hover{color: #ababab;}
@media screen and (max-width: 1600px) and (max-height: 900px) {
  .title{height: 30px;line-height: 30px;font-size: 14px;}
  .list{height: 90px;}
}
</style>
