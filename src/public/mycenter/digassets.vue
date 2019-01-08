<template>
    <div class="digassets">
        <h3>{{$t('account.userDigitalAssets')}}<!--我的数字资产--></h3>
        <div class="hcontainer">
            <div class="chargeWithdraw" v-if="!showLoaing">
                <div class="balance_search">
                    <div class="total">
                        {{$t('exchange.exchange_valuation')}}：<!--总当前估值：-->
                        {{String(getBTCValuation).toMoney()}} BTC ≈ {{getCoinSign}} {{USDCNY}}
                    </div>
                    <div class="f-fr">
                        <div class="search_input">
                            <i class="icon-search"></i>
                            <input type="text" v-model="filterTitle" placeholder="BTC"/>
                        </div>
                        <div class="limit">
                            <span @click="switchTab('historyrecord')">
                              {{$t('account.userViewTheHistory')}}<!--历史记录-->
                            </span>
                        </div>
                    </div>
                </div>
                <div class="acount_tab">
                  <div class="active">主账户</div>
                  <div>投票挖矿账户</div>
                  <span>资金划转</span>
                </div>
                <ul class="accountInfo-lists header">
                  <li class="th">
                        <div class="items">
                            <div class="coin ng-binding" @click="sortAssets('symbol')">
                                {{$t('account.estimated_value_coin')}}<!--币种-->
                                <em v-if="sortActive==='symbol'">
                                  <i class="icon-arrow-up" :class="{active:sort==='asc'}"></i>
                                  <i class="icon-arrow-down" :class="{active:sort==='desc'}"></i>
                                </em>
                                <div class="icon-checkbox f-fl" @click.stop="hideZero=!hideZero">
                                    <em  :class="[hideZero?'icon-checkbox-checked':'icon-checkbox-unchecked']"></em>
                                    <label class="ng-binding">
                                      {{$t('account.estimated_value_hide')}}<!--隐藏-->&nbsp;0&nbsp;{{$t('account.estimated_value_balances')}}<!--金额-->
                                    </label>
                                </div>
                            </div>
                            <div class="fullName ng-binding" @click="sortAssets('fullName')">
                              {{$t('account.estimated_value_name')}}<!--全称-->
                              <em v-if="sortActive==='fullName'">
                                <i class="icon-arrow-up" :class="{active:sort==='asc'}"></i>
                                <i class="icon-arrow-down" :class="{active:sort==='desc'}"></i>
                              </em>
                            </div>
                            <div class="total f-right ng-binding" @click="sortAssets('total')">
                              {{$t('account.estimated_value_total')}}<!--总金额-->
                              <em v-if="sortActive==='total'">
                                <i class="icon-arrow-up" :class="{active:sort==='desc'}"></i>
                                <i class="icon-arrow-down" :class="{active:sort==='asc'}"></i>
                              </em>
                            </div>
                            <div class="useable f-right ng-binding" @click="sortAssets('available')">
                              {{$t('account.estimated_value_available')}}<!--可用余额-->
                              <em v-if="sortActive==='available'">
                                <i class="icon-arrow-up" :class="{active:sort==='desc'}"></i>
                                <i class="icon-arrow-down" :class="{active:sort==='asc'}"></i>
                              </em>
                            </div>
                            <div class="locked f-right ng-binding" @click="sortAssets('frozen')">
                              {{$t('public0.public34')}}<!--冻结金额-->
                              <em v-if="sortActive==='frozen'">
                                <i class="icon-arrow-up" :class="{active:sort==='desc'}"></i>
                                <i class="icon-arrow-down" :class="{active:sort==='asc'}"></i>
                              </em>
                            </div>
                            <div class="opreat f-right ng-binding">
                              {{$t('otc_exchange.otc_exchange_operating')}}<!--操作-->
                            </div>
                        </div>
                    </li>
                </ul>
                <ul class="accountInfo-lists">
                    <li v-for="(data, index) in filterDatas(1)" :key="data.accountId">
                        <div class="items">
                            <div class="coin ng-binding">{{data.symbol}}</div>
                            <div class="fullName ng-binding">{{$t(`symbol.${data.symbol}`)}}</div>
                            <div class="total f-right ng-binding">{{toFixed(data.totalBalance)}}</div>
                            <div class="useable f-right ng-binding">{{toFixed(data.availableBalance)}}</div>
                            <div class="locked f-right ng-binding">{{toFixed(data.frozenBalance)}}</div>
                            <div class="action f-right">
                                <span class="btn btn-deposit ng-binding ng-scope1" :class="[data.show ? 'icon-less' : 'icon-add', {disabled: Number(data.rechargeFlag) !== 1 && Number(data.withdrawFlag) !== 1}]" @click="Number(data.rechargeFlag) === 1 || Number(data.withdrawFlag) === 1 ? data.show = !data.show : false" :title="$t('account.estimated_value_title')"><!--充值与提现--></span>
                            </div>
                        </div>
                        <moreinfo v-if="data.show" :googleState="googleState" :verifyState="verifyState" :mobileState="mobileState" :symbol="data.symbol" :item="data" @updateMyAssets="getList"/>
                    </li>
                </ul>
            </div>
            <loading v-if="showLoaing"/>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import numUtils from '@/assets/js/numberUtils'
import userUtils from '@/api/wallet'
import userApi from '@/api/individual'
import moreinfo from '@/public/mycenter/moreinfo'
import loading from '@/components/loading'
export default {
  data () {
    return {
      sortActive: null,
      sort: null,
      showLoaing: true,
      hideZero: false,
      filterTitle: '',
      googleState: 0,
      verifyState: 0,
      mobileState: 0,
      myAssets: []
    }
  },
  components: {
    moreinfo,
    loading
  },
  computed: {
    ...mapGetters(['getBTCValuation', 'getUSDCNY', 'getCoinSign']),
    USDCNY () {
      return numUtils.mul(this.getBTCValuation, this.getUSDCNY).toFixed(2).toMoney()
    }
  },
  watch: {
    filterTitle (newVal, oldVal) {
      if (!newVal) {
        return
      }
      if (/[^0-9a-z]/i.test(newVal)) {
        this.$nextTick(() => {
          this.filterTitle = oldVal
        })
      }
    }
  },
  created () {
    this.getList()
    // 获取当前用户状态信息
    userApi.getUserState((data) => {
      this.googleState = data.googleState
      this.verifyState = data.verifyState
      this.mobileState = data.mobileAuthState
    }, (msg) => {
      console.error(msg)
    })
  },
  methods: {
    filterDatas (type) {
      let ndatas = this.myAssets.filter((item) => {
        if (this.hideZero) {
          if (this.filterTitle) {
            return (item.caption.toUpperCase().indexOf(this.filterTitle.toUpperCase()) !== -1 || item.symbol.indexOf(this.filterTitle.toUpperCase()) !== -1) && numUtils.BN(item.availableBalance).toString() !== numUtils.BN(0).toString()
          }
          return numUtils.BN(item.availableBalance).toString() !== numUtils.BN(0).toString()
        } else {
          if (this.filterTitle) {
            return item.caption.toUpperCase().indexOf(this.filterTitle.toUpperCase()) !== -1 || item.symbol.indexOf(this.filterTitle.toUpperCase()) !== -1
          }
          return true
        }
      })
      ndatas = ndatas.filter(item=>{
        return item.type===type
      })
      ndatas.sort((item1, item2) => {
        if (this.sortActive === 'symbol') {
          let m1 = item1.symbol
          let m2 = item2.symbol
          return this.sort === 'asc' ? (m1 < m2 ? -1 : 1) : (m1 > m2 ? -1 : 1)
        } else if (this.sortActive === 'fullName') {
          let m1 = this.$t(`symbol.${item1.symbol}`)
          let m2 = this.$t(`symbol.${item2.symbol}`)
          return this.sort === 'desc' ? (m1 < m2 ? -1 : 1) : (m1 > m2 ? -1 : 1)
        } else if (this.sortActive === 'available') {
          let m1 = numUtils.BN(item1.availableBalance)
          let m2 = numUtils.BN(item2.availableBalance)
          if (m1.equals(m2)) {
            return item1.idx < item2.idx ? -1 : 1
          } else {
            return this.sort === 'desc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
          }
        } else if (this.sortActive === 'frozen') {
          let m1 = numUtils.BN(item1.frozenBalance)
          let m2 = numUtils.BN(item2.frozenBalance)
          if (m1.equals(m2)) {
            return item1.idx < item2.idx ? -1 : 1
          } else {
            return this.sort === 'desc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
          }
        } else {
          let m1 = numUtils.BN(item1.totalBalance)
          let m2 = numUtils.BN(item2.totalBalance)
          if (m1.equals(m2)) {
            return item1.idx < item2.idx ? -1 : 1
          } else {
            return this.sort === 'desc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
          }
        }
      })
      return ndatas
    },
    sortAssets (active) {
      if (active === this.sortActive) {
        this.sort = this.sort === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortActive = active
        this.sort = 'asc'
      }
    },
    switchTab (tab) {
      this.$emit('switchTab', tab)
    },
    getList () {
      this.showLoaing = true
      userUtils.myAssets({}, (data) => {
        data.forEach((item) => {
          item.show = false
          item.frozenBalance = numUtils.add(item.frozenBalance, item.adFrozenBalance).add(item.loanBalance).toFixed(8)
        })
        this.myAssets = data
        this.showLoaing = false
      }, (data, msg) => {
        console.error(msg)
        Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        this.showLoaing = false
      })
    },
    toFixed (value, fixed) {
      return numUtils.BN(value || 0).toFixed(fixed === undefined ? 8 : fixed).toMoney()
    }
  }
}
</script>

<style scoped>
.icon-checkbox em{color: #0D66EF;cursor: pointer;}
.icon-checkbox:hover em{color: #0D66EF;}
.icon-checkbox label{cursor: pointer;}

.digassets{background-color: #FFF; border-radius: 4px; box-shadow: 0 1px 3px #e2e2e2;}
.digassets h3{height: 55px; padding-left: 20px; font-weight: normal;font-size: 18px;line-height: 55px;color: #333;text-indent: 8px;border-bottom: 1px solid #e7e7e7;}
.balance_search {display: flex;justify-content: space-between;position: relative;padding-left: 20px;padding-right: 20px;border-bottom: 1px solid #e7e7e7;}
.balance_search .total{color: #333;height: 65px;line-height: 65px; font-size: 16px;}
.balance_search i{position: absolute;right: 10px;top: 8px;color: #0D66EF; font-size: 20px;}
.balance_search input{width: 190px;height: 32px; box-sizing: border-box; padding-left: 5px;padding-right: 25px; border: 1px solid #9EC2F9;}
.balance_search .checkbox{position: relative;margin-left: 24px;color: #d6dff9;}
.balance_search .checkbox label{color: #d6dff9;margin-left: 8px;}
.balance_search .checkbox em{display: inline-block;width: 14px;height: 14px;}
.balance_search .checkbox em:before{position: absolute;}
.balance_search .f-fr{display: flex; position: absolute; right: 20px; top: 50%; margin-top: -15px;}
.balance_search .f-fr .search_input{position: relative;}
.balance_search .f-fr .total{color: #333;font-size: 18px;font-weight: bold;}
.balance_search .f-fr .limit{height: 32px;line-height: 32px; margin-left: 20px;}
.balance_search .f-fr .limit span{color: #0D66EF; cursor: pointer;}
.balance_search .f-fr .limit span:hover{color: #0a4fb9;}
.accountInfo-lists{padding: 0 8px 50px 8px;}
.accountInfo-lists.header{padding-bottom:0px;background:#fff; border-top: 1px solid #e7e7e7; border-bottom: 1px solid #e7e7e7;}
.accountInfo-lists li.th > .items > div{align-items:center;}
.accountInfo-lists li.th > .items > div > em{position:relative;display:inline-block;width:8px;height:26px;line-height:0px;flex:initial;display:flex;margin-left:2px;}
.accountInfo-lists li.th > .items > div > em i{position:absolute;top:0px;left:0px; color: #999;}
.accountInfo-lists li.th > .items > div > em i.icon-arrow-down{top:inherit;bottom:0px;}
.accountInfo-lists li.th > .items > div > em i.active{color:#0D66EF;}
.accountInfo-lists li{padding: 0;border-bottom: 1px solid #eee;}
.accountInfo-lists li a{color: #eeba42;}
.accountInfo-lists li a:hover a{text-decoration: underline;}
.accountInfo-lists li.bg{background-color: rgba(232,179,66,0.05);}
.accountInfo-lists li .items{overflow: hidden;min-height: 40px;display:flex;}
.accountInfo-lists li .items>div{
  font-size: 14px;color: #333;text-align: left;box-sizing: border-box;min-height: 50px;line-height:22px;
  display: flex;align-items: center;white-space:normal;word-break:break-all;padding:0 4px;
}
.accountInfo-lists.header li{border-bottom:none;}
.accountInfo-lists.header li .items>div{color:#261003;}
.accountInfo-lists li .items>div .btn{display: inline-block;height: 22px;padding: 0;line-height: 22px;font-size: 24px;color: #0D66EF;text-align: left;cursor: pointer;}
.accountInfo-lists li .items>div .btn:hover{color: #0847a9;}
.accountInfo-lists li .items>div .cur{background-color: #e8b342;border-color: #e8b342;color: #fff;}
.accountInfo-lists li .items>div .disabled{cursor: not-allowed;color: #ababab;}
.accountInfo-lists li .items>div .disabled:hover{color: #ababab;}
.accountInfo-lists li .items>div .active{border: none;color: #fdb902;}
.accountInfo-lists li .items>div.coin{flex:1;text-align: left;}
.accountInfo-lists li .items>div.coin .icon-checkbox{margin-left: 14px;}
.accountInfo-lists li .items>div.coin img{vertical-align: middle;height: 16px;margin-right: 6px;}
.accountInfo-lists li .items>div.fullName{width: 130px;}
.accountInfo-lists li .items>div.fullName a{color: #666;}
.accountInfo-lists li .items>div.fullName a:visited{color: #666;}
.accountInfo-lists li .items>div.coin>img{display: inline-block;width: 20px;height: 20px;vertical-align: middle;}
.accountInfo-lists li .items>div.total{width: 180px;}
.accountInfo-lists li .items>div.useable{width: 180px;}
.accountInfo-lists li .items>div.locked{width: 180px;}
.accountInfo-lists li .items>div.opreat{width: 80px;}
.accountInfo-lists li .items>div.action{width: 80px;color: #fdb902;}
.acount_tab {height: 50px; display: flex; font-size: 16px; position: relative;}
.acount_tab > div {width: 190px; border-top: 1px solid #eee; border-right: 1px solid #eee; border-top-right-radius: 10px; text-align: center; line-height: 50px; color: #808080; cursor: pointer;}
.acount_tab > div.active {background-color: #1571FF; border-color: #1571FF; color: #fff;}
.acount_tab > div:hover {color: #333;}
.acount_tab > div.active:hover {color: #fff;}
.acount_tab > span {position: absolute; right: 20px; height: 50px; line-height: 50px; color: #1571FF; cursor: pointer;}
</style>

