<template>
    <div class="business-panel" :class="{unfold:isShow}">
        <ul class="tabs">
            <li class="arrow-item">
              <em :class="{unfold:isShow}" @click="switchTab('limit', isShow)">
                <i :class="[!isShow?'icon-arrow-up3':'icon-arrow-down2']"></i>
              </em>
            </li>
            <li class="tab-item" :class="{selected:isShow && active==='limit'}" @click="switchTab('limit')">
              {{$t('exchange.exchange_limit')}}<!--限价委托-->
            </li>
            <li class="tab-item" :class="{selected:isShow && active==='current'}" @click="switchTab('current')">
              {{$t('trade_record.current_entrust')}}<!--当前委托-->
            </li>
            <li class="tab-item" :class="{selected:isShow && active==='history'}" @click="switchTab('history')">
              {{$t('trade_record.history_entrust')}}<!--历史委托-->
            </li>
            <!--市价委托-->
            <!-- <li class="tab-item" :class="{selected:isShow && active==='market'}" @click="switchTab('market')">
              {{$t('exchange.exchange_market')}}
            </li> -->
            <li class="procedure-item" v-if="isShow">{{$t('public.fee_rate')}}：{{rateData}}%<!--手续费率--></li>
        </ul>
        <div class="business-panel-form" v-show="isShow">
            <div class="business-panel-left">
                <business ref="business_buy" :active="active" tradeType="buy" :accuracy="accuracy" :fixedNumber="fixedNumber" :baseSymbol="baseSymbol" :currentSymbol="currentSymbol" :toFixed="toFixed" :fromWallet="fromWallet" :toWallet="toWallet" :buyToWallet="buyToWallet" :marketList="marketList"/>
            </div>
            <div class="business-panel-right">
                <business ref="business_sell" :active="active" tradeType="sell" :accuracy="accuracy" :fixedNumber="fixedNumber" :baseSymbol="baseSymbol" :currentSymbol="currentSymbol" :toFixed="toFixed" :fromWallet="fromWallet" :toWallet="toWallet" :buyToWallet="buyToWallet" :marketList="marketList"/>
            </div>
        </div>
    </div>
</template>

<script>
import marketApi from '@/api/market'
import { mapActions } from 'vuex'
import business from '@/exchanges/market/business'
export default {
  props: ['accuracy', 'fixedNumber', 'baseSymbol', 'currentSymbol', 'toFixed', 'fromWallet', 'toWallet', 'buyToWallet', 'marketList'],
  components: {
    business
  },
  data () {
    return {
      isShow: true,
      active: 'limit',
      rateData: null
    }
  },
  watch: {
    isShow () {
      this.$nextTick(() => {
        this.tiggerEvents({
          name: 'klineEvent',
          params: {type: 'resize', value: this.isShow}
        })
      })
    }
  },
  created () {
    this.getrateSysparams()
  },
  methods: {
    ...mapActions(['tiggerEvents']),
    switchTab (tab, isShow) {
      this.isShow = !isShow
      this.active = tab
      if(tab!=='limit'){
        this.$parent.isEntrust = true
        this.$parent.$refs.entrust.isShow = true
        this.$parent.$refs.entrust.active = tab
      }
    },
    getrateSysparams () {
      marketApi.rateSysparams((res) => {
        res.forEach((item) => {
          if (item.code === 'transactionRate') {
            this.rateData = item.value * 100
          }
        })
      })
    }
  }
}
</script>

<style scoped>
.business-panel{margin-bottom: 10px;background-color: #fff;}
.business-panel.unfold{height: 304px;}
.tabs{background-color: #fff;overflow: auto;}
.business-panel.unfold .tabs{background-color:#FFF; border: 1px solid #e7e7e7;}
.tabs .tab-item{
  float: left;min-width: 76px;height: 38px;padding: 0 40px;margin-right:2px;font-size: 16px;
  line-height: 38px;color: #666;text-align: center;cursor: pointer; border-bottom: 2px solid transparent;
}
.business-panel.unfold .tabs .tab-item{color:#666;}
.tabs .tab-item:hover,
.tabs .tab-item.selected{color: #3A76E7;}
.tabs .tab-item.selected {border-color: #3A76E7;}
.tabs .arrow-item{position: relative;float: left;width: 50px;height: 40px;}
.tabs .arrow-item em{position: absolute;top: 50%;left: 50%; width: 20px;height: 20px; margin-left:-8px; margin-top: -8px;overflow: hidden;cursor: pointer;}
.tabs .arrow-item em i{position: absolute;left: 0;font-size: 16px;color: #3A76E7;}
.tabs .arrow-item em:hover i,
.tabs .arrow-item em.unfold i{color: #3A76E7;}
.business-panel.unfold .tabs .arrow-item em:hover i,
.business-panel.unfold .tabs .arrow-item em.unfold i{color: #3A76E7;}
.tabs .procedure-item{float: right;height: 24px;margin-top: 8px;margin-right: 30px;line-height: 24px;color: #3A76E7;}

.business-panel-form{display: flex;}
.business-panel-left,
.business-panel-right{flex: 1;margin: 0 25px;}

@media screen and (max-width: 1600px) {
  .business-panel.unfold{height: 290px;}
  .tabs .tab-item{height: 28px;margin-right: 30px;font-size: 14px;line-height: 28px;}
  .tabs .arrow-item{width: 50px;height: 30px;}
  .tabs .procedure-item{margin-top: 3px;margin-right: 20px;font-size: 12px;}
  .business-panel-left,
  .business-panel-right{margin: 0 15px;}
  .business-panel{margin-bottom:4px;}
}
@media screen and (max-width: 1400px) {
  .tabs .procedure-item{margin-right: 15px;}
  .business-panel-left,
  .business-panel-right{margin:0 10px;}
}
@media screen and (max-width: 1300px) {
  .tabs .procedure-item{margin-right: 10px;}
  .business-panel-left,
  .business-panel-right{margin: 0 5px;}
}
@media screen and (max-width: 1200px) {
  .tabs .procedure-item{margin-right: 5px;}
  .business-panel-left,
  .business-panel-right{margin: 0;}
}
</style>
