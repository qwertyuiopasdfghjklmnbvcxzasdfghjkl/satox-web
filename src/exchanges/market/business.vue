<template>
    <div class="business">
        <div class="b-content">
            <div class="panel" :class="[tradeType]">
                <div class="formel price-balance">
                    {{isBuy ? baseSymbol : currentSymbol}}
                    {{$t('exchange.exchange_balance')}}<!--余额-->：
                    <template v-if="baseSymbol=='SATO'">
                      {{toFixed(isBuy ? sellToBalance.availableBalance : buyToBalance.availableBalance).toMoney()}}
                    </template>
                    <template v-else>
                      {{toFixed(isBuy ? toBalance.availableBalance : (!currentSymbol.includes('SATO') ? buyToBalance.availableBalance : fromBalance.availableBalance)).toMoney()}}
                    </template>
                </div>
                <div class="formel price">
                    <label class="formel-label">{{$t('exchange.exchange_price')}}<!--价格--></label>
                    <div class="formel-text">
                        <!-- <numberbox ref="price" :style="baseStyle" v-if="!isMarket" :accuracy="fixedNumber" class="formel-textbox" type="text" v-model="formData.price" :readonly="isMarket"/> -->
                        <numberbox ref="price" :style="baseStyle" v-if="!isMarket" :accuracy="fixedNumber" class="formel-textbox" type="text" v-model="fixedPrice" :readonly="true"/>
                        <input v-if="isMarket" class="formel-textbox" :value="$t('exchange.exchange_market_price')" type="text" readonly="readonly"/>
                        <em class="tip-title" ref="tipBaseSymbol">{{baseSymbol}}</em>
                        <arrows v-if="false" :disabled="isMarket" :fixedNumber="fixedNumber" v-model="formData.price"/>
                        <!-- <em v-show="isShowPrice" class="error-tip icon-arrow-down">
                          <i><valuation :lastPrice="formData.price" :baseSymbol="baseSymbol"/></i>
                        </em> -->
                    </div>
                </div>
                <div class="formel amount">
                    <label class="formel-label">{{$t('exchange.exchange_amount')}}<!--数量--></label>
                    <div class="formel-text">
                        <numberbox :style="currentStyle" :accuracy="Quantityaccu" class="formel-textbox" type="text" v-model="formData.amount" />
                        <em class="tip-title" ref="tipCurrentSymbol">{{currentSymbol}}</em>
                        <arrows :fixedNumber="fixedNumber" v-model="formData.amount"/>
                    </div>
                </div>
                <div class="formel price" v-show="!isMarket">
                    <label class="formel-label">{{$t('exchange.exchange_total')}}<!--金额--></label>
                    <div class="formel-text">
                        <numberbox ref="total" :style="baseStyle" :accuracy="Amountaccu" class="formel-textbox" type="text" v-model="formData.total" />
                        <em class="tip-title">{{baseSymbol}}</em>
                        <arrows :fixedNumber="fixedNumber" v-model="formData.total"/>
                        <!-- <em v-show="isShowTotal" class="error-tip icon-arrow-down">
                          <i><valuation :lastPrice="formData.total" :baseSymbol="baseSymbol"/></i>
                        </em> -->
                    </div>
                </div>
                <div ref="percent" class="percent">
                    <div ref="dragCircle" class="drag-circle" @mousedown="mouseDown" @mousemove="showPercentTip=true" @mouseout="showPercentTip=false">
                      <em v-if="showPercentTip">
                        <i class="icon-arrow-down">{{percent}}%</i>
                      </em>
                    </div>
                    <div class="percent-light-line" :style="{width: curPercent + '%'}"></div>
                    <div class="percent-line">
                      <span class="percent-circle" :class="{'percent-circle-light':curPercent>=0}"></span>
                      <span class="percent-circle" :class="{'percent-circle-light':curPercent>=25}"></span>
                      <span class="percent-circle" :class="{'percent-circle-light':curPercent>=50}"></span>
                      <span class="percent-circle" :class="{'percent-circle-light':curPercent>=75}"></span>
                    </div>
                    <template v-if="!moveCursor">
                      <span class="percent-item percent-item-0" @click="percent=0" @mouseover="percentOver(0)" @mouseout="percentOut">
                        <em><i class="icon-arrow-down">0%</i></em>
                      </span>
                      <span class="percent-item percent-item-1" @click="percent=25" @mouseover="percentOver(25)" @mouseout="percentOut">
                        <em><i class="icon-arrow-down">25%</i></em>
                      </span>
                      <span class="percent-item percent-item-2" @click="percent=50" @mouseover="percentOver(50)" @mouseout="percentOut">
                        <em><i class="icon-arrow-down">50%</i></em>
                      </span>
                      <span class="percent-item percent-item-3" @click="percent=75" @mouseover="percentOver(75)" @mouseout="percentOut">
                        <em><i class="icon-arrow-down">75%</i></em>
                      </span>
                      <span class="percent-item percent-item-4" @click="percent=100" @mouseover="percentOver(100)" @mouseout="percentOut">
                        <em><i class="icon-arrow-down">100%</i></em>
                      </span>
                    </template>
                </div>
                <div class="formel price" v-show="isMarket">
                    <label class="formel-label"></label>
                    <div class="formel-text">
                    </div>
                </div>
                <div class="buttons">
                    <span v-if="getApiToken" :class="{disabled:lockExtrust}" @click="buyOrSell()">
                      {{$t(isBuy?'exchange.exchange_buy':'exchange.exchange_sell')}} {{currentSymbol}}
                    </span>
                    <div v-if="!getApiToken" class="not-login " :class="{sell:tradeType=='sell'}">
                      <a @click="loginDialog">{{$t('public.navigation_login')}}</a>
                      <font>or</font>
                      <a @click="registerDialog">{{$t('public.navigation_register')}}</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import marketApi from '@/api/market'
import numUtils from '@/assets/js/numberUtils'
import regUtils from '@/assets/js/regex'
import utils from '@/assets/js/utils'
import numberbox from '@/components/formel/numberbox'
import arrows from './arrows'
import valuation from '@/components/valuation'
export default {
  props: {
    tradeType: {
      type: String,
      default: 'buy'
    },
    active: {
      type: String,
      default: 'limit'
    },
    fixedNumber: {
      type: Number
    },
    Quantityaccu: {
      type: Number
    },
    Amountaccu: {
      type: Number
    },
    currentSymbol: {
      type: String,
      default: ''
    },
    baseSymbol: {
      type: String,
      default: ''
    },
    fromWallet: {
      type: Object
    },
    toWallet: {
      type: Object
    },
    buyToWallet: {
      type: Object
    },
    sellToWallet: {
      type: Object
    },
    marketList: {
      type: Array,
      default: []
    }
  },
  components: {
    numberbox,
    valuation,
    arrows
  },
  data () {
    return {
      isShowPrice: false,
      isShowTotal: false,
      lockExtrust: false,
      changeInput: '',
      errorObj: {},
      percent: 0,
      showPercentTip: false,
      hoverPercent: 0,
      moveCursor: false,
      updateValue: true,
      formData: {
        price: 0,
        amount: '',
        total: ''
      },
      tipBaseSymbolWidth: 34,
      tipCurrentSymbolWidth: 34
    }
  },
  computed: {
    ...mapGetters(['getApiToken', 'getMarketConfig', 'getLast24h', 'getEntrustNewPrice']),
    symbol () {
      return `${this.currentSymbol}${this.baseSymbol}`
    },
    isBuy () {
      return this.tradeType === 'buy'
    },
    isMarket () {
      return this.active === 'market'
    },
    toBalance () {
      if (this.toWallet) {
        return this.toWallet
      } else {
        return {}
      }
    },
    fromBalance () {
      if (this.fromWallet) {
        return this.fromWallet
      } else {
        return {}
      }
    },
    buyToBalance () {
      if (this.buyToWallet) {
        return this.buyToWallet
      } else {
        return {}
      }
    },
    sellToBalance () {
      if (this.buyToWallet) {
        return this.buyToWallet
      } else {
        return {}
      }
    },
    marketPrice () {
      return this.$t('exchange.exchange_market_price') // 市价
    },
    baseStyle () {
      return {
        'padding-right': `${this.tipBaseSymbolWidth + 35}px`,
        width: `calc(100% - ${this.tipBaseSymbolWidth + 45}px)`
      }
    },
    currentStyle () {
      return {
        'padding-right': `${this.tipCurrentSymbolWidth + 35}px`,
        width: `calc(100% - ${this.tipCurrentSymbolWidth + 45}px)`
      }
    },
    curPercent () {
      return Math.max(this.hoverPercent, this.percent)
    },
    fixedPrice(){
      let fixedPrice = 0, fixedBuyOrSellPrice = 0
      for(let item of this.marketList){
        if(item.market===this.symbol){
          fixedPrice = Number(item.fixedPrice)
          fixedBuyOrSellPrice = Number(this.isBuy?item.fixedBuyPrice:item.fixedSellPrice)
          break
        }
      }
      return fixedBuyOrSellPrice?fixedBuyOrSellPrice:fixedPrice
    }
  },
  watch: {
    active () {
      this.percent = 0
      this.formData.amount = ''
    },
    tradeType () {
      this.formData.amount = ''
    },
    'formData.price' (newVal, oldVal) {
      this.changeValue(newVal, oldVal, 'price')
    },
    'formData.amount' (newVal, oldVal) {
      this.changeValue(newVal, oldVal, 'amount')
    },
    'formData.total' (newVal, oldVal) {
      this.changeValue(newVal, oldVal, 'total')
    },
    getLast24h (newVal) {
      if (this.updateValue) {
        this.updateValue = false
        setTimeout(()=>{
          this.formData.price = this.toFixed(utils.removeEndZero(this.getLast24h.close))
        },200)
      }
    },
    symbol () {
      this.updateValue = true
      this.$nextTick(() => {
        this.tipBaseSymbolWidth = this.$refs.tipBaseSymbol.clientWidth + parseInt(this.$refs.tipBaseSymbol.style.right.replace('px', ''))
        this.tipCurrentSymbolWidth = this.$refs.tipCurrentSymbol.clientWidth + parseInt(this.$refs.tipCurrentSymbol.style.right.replace('px', ''))
      })
    },
    percent (newVal) {
      this.switchPercent(newVal)
      this.$nextTick(() => {
        this.$refs.dragCircle.style.left = `calc(${newVal}% - 7px)`
      })
    },
    getEntrustNewPrice () {
      this.formData.price = this.toFixed(this.getEntrustNewPrice)
    },
    isMarket (newVal) {
      if (!newVal) {
        this.bindEvent()
      }
    }
  },
  created () {
    this.$nextTick(() => {
      this.addEvents({
        name: 'businessEvent',
        fun: this.businessEvent
      })
    })
    this.bindEvent()
    this.$nextTick(() => {
      this.tipBaseSymbolWidth = this.$refs.tipBaseSymbol.clientWidth
      this.tipCurrentSymbolWidth = this.$refs.tipCurrentSymbol.clientWidth
    })
  },
  beforeDestroy () {
    this.removeEvents('businessEvent')
  },
  methods: {
    ...mapActions(['addEvents', 'removeEvents']),
    businessEvent (res) {
      if (res && res.type === 'price') {
        this.formData.price = res.value
      } else if (res && res.type === 'amount') {
        this.formData.amount = res.value
      } else if (res && res.type === 'total') {
        this.formData.total = res.value
      }
    },
    bindEvent () {
      this.$nextTick(() => {
        let price = this.$refs.price.$el
        price.addEventListener('focus', () => {
          this.isShowPrice = true
        }, false)
        price.addEventListener('blur', () => {
          this.isShowPrice = false
        }, false)
        let total = this.$refs.total.$el
        total.addEventListener('focus', () => {
          this.isShowTotal = true
        }, false)
        total.addEventListener('blur', () => {
          this.isShowTotal = false
        }, false)
      })
    },
    changeValue (newVal, oldVal, type) {
      if (numUtils.BN(newVal).equals(numUtils.BN(oldVal))) {
        this.changeInput = ''
        return
      }
      if (numUtils.BN(newVal).equals(numUtils.BN(0))) {
        if (this.changeInput) {
          return
        }
        this.changeInput = type
        if (type === 'amount' || type === 'price') {
          this.formData.total = ''
        }
        if (type === 'total' || type === 'price') {
          this.formData.amount = ''
        }
        this.$nextTick(() => {
          this.changeInput = ''
        })
        return
      }
      if (this.changeInput && this.changeInput !== type) {
        this.changeInput = ''
        return
      }
      this.changeInput = type
      if (type === 'total' && numUtils.BN(this.fixedPrice).gt(0)) {
        this.formData.amount = this.toFixed(numUtils.div(this.formData.total, this.fixedPrice), this.Quantityaccu)
      } else if (type === 'total' && numUtils.BN(this.formData.amount).gt(0)) {
        this.formData.price = this.toFixed(numUtils.div(this.formData.total, this.formData.amount))
      } else if (numUtils.BN(this.fixedPrice).gt(0) && numUtils.BN(this.formData.amount).gt(0)) {
        this.formData.total = this.toFixed(numUtils.mul(this.fixedPrice, this.formData.amount), this.Amountaccu)
      } else if (numUtils.BN(this.fixedPrice).gt(0) && numUtils.BN(this.formData.total).gt(0)) {
        this.formData.amount = this.toFixed(numUtils.div(this.formData.total, this.fixedPrice), this.Quantityaccu)
      } else {
        this.changeInput = ''
      }
    },
    switchPercent (p) {
      let amount
      p = p / 100
      if(this.baseSymbol.includes('SATO')){
        amount = numUtils.mul(this.isBuy ? this.sellToBalance.availableBalance : this.buyToBalance.availableBalance, p).toFixed(this.fixedNumber)
      } else {
        amount = numUtils.mul(this.isBuy ? this.toBalance.availableBalance : (!this.symbol.includes('SATO') ? this.buyToBalance.availableBalance : this.fromBalance.availableBalance), p).toFixed(this.fixedNumber)
      }
      
      if (this.active === 'market' && this.tradeType === 'buy') {
        this.formData.amount = Number(amount)?numUtils.div(amount, this.getLast24h.close).toFixed(this.fixedNumber, 1):''
        return
      }
      if (this.tradeType === 'buy') {
        this.formData.total = Number(amount)?amount:''
      } else {
        this.formData.amount = Number(amount)?amount:''
      }
    },
    buyOrSell () {
      this.errorObj = {}
      if (!this.getApiToken) {
        Vue.$koallTipBox({icon: 'notification', message: this.$t('exchange.exchange_Not_logged')}) // 未登录
        return
      }
      let price = 0
      let msg = null
      let amount = this.formData.amount
      let balance = null
      let fromAccountId = null
      let toAccountId = null
      let direction = null// 1买 2卖
      if (this.active === 'limit') { // 限价
        price = this.fixedPrice
        if (!price) {
          msg = this.$t('exchange.exchange_price_empty') // 价格不能为空
        } else if (numUtils.BN(price).equals(numUtils.BN(0))) {
          msg = this.$t('exchange.exchange_price_ont') // 价格不能为0
        } else if (!regUtils.intOrDecimal.test(price)) {
          msg = this.$t('exchange.exchange_price_decimal_int') // 价格只能为整数或小数
        }
        if (msg) {
          this.errorObj = {
            type: 'price',
            msg: msg
          }
          Vue.$koallTipBox({icon: 'notification', message: `${msg}`})
          return
        }
      } else { // 市价
        price = -1
      }
      if (!amount) {
        msg = this.$t('exchange.exchange_number_empty') // 数量不能为空
      } else if (numUtils.BN(amount).equals(numUtils.BN(0))) {
        msg = this.$t('exchange.exchange_number_ont') // 数量不能为0
      } else if (!regUtils.intOrDecimal.test(amount)) {
        msg = this.$t('exchange.exchange_number_decimal_int') // 数量只能为整数或小数
      }
      if (msg) {
        this.errorObj = {
          type: 'amount',
          msg: msg
        }
        Vue.$koallTipBox({icon: 'notification', message: `${msg}`})
        return
      }
      if (!this.getMarketConfig) {
        Vue.$koallTipBox({icon: 'notification', message: `${msg}`})
        return
      }
      let minQuantity = numUtils.BN(this.getMarketConfig[this.symbol].minQuantity).toString()
      let minAmount = numUtils.BN(this.getMarketConfig[this.symbol].minAmount).toString()
      // 限价 最小金额控制
      if (this.active === 'limit' && numUtils.BN(this.formData.total).lt(minAmount)) {
        // 最小金额必须大于等于{0}{1}
        Vue.$koallTipBox({icon: 'notification', message: this.$t('public.min_total_greater_than').format(minAmount, this.baseSymbol)})
        return
      }

      // 限价\市价 最小数量控制
      // this.active === 'market' &&
      if (numUtils.BN(this.formData.amount).lt(minQuantity)) {
        // 最小数量必须大于等于{0}{1}
        Vue.$koallTipBox({icon: 'notification', message: this.$t('public.min_amount_greater_than').format(minQuantity, this.currentSymbol)})
        return
      }

      direction = this.tradeType === 'buy' ? 1 : 2

      if(this.baseSymbol.includes('SATO')){
        balance = this.tradeType === 'buy' ? this.sellToBalance.availableBalance : this.buyToBalance.availableBalance
        fromAccountId = this.tradeType === 'buy' ? this.sellToBalance.accountId : this.buyToBalance.accountId
        toAccountId = this.tradeType === 'buy' ? this.buyToBalance.accountId : this.toBalance.accountId
      } else {
        balance = this.tradeType === 'buy' ? this.toBalance.availableBalance : (!this.currentSymbol.includes('SATO') ? this.buyToBalance.availableBalance : this.fromBalance.availableBalance)
        fromAccountId = this.tradeType === 'buy' ? this.toBalance.accountId : (!this.currentSymbol.includes('SATO') ? this.buyToBalance.accountId : this.fromBalance.accountId)
        toAccountId = this.tradeType === 'buy' ? this.buyToBalance.accountId : this.toBalance.accountId
      }
      if (this.tradeType === 'buy') { // 买
        /*direction = 1 // 买
        balance = this.toBalance.availableBalance // 金额
        fromAccountId = this.toBalance.accountId // baseSymbol帐号id
        toAccountId = this.buyToBalance.accountId // currentSymbol帐号id*/
        if (numUtils.BN(amount).mul(numUtils.BN((price === -1 ? this.getLast24h.close : price))).gt(numUtils.BN(balance)) || numUtils.BN(balance).isZero()) {
          Vue.$koallTipBox({icon: 'notification', message: this.$t('exchange.exchange_Insufficient_balance')}) // 余额不足
          return
        }
      } else if (this.tradeType === 'sell') {
       /* direction = 2 // 卖
        balance = (!this.symbol.includes('SATO') ? this.buyToBalance.availableBalance : this.fromBalance.availableBalance)  // 金额
        console.log('balance===',balance)
        fromAccountId = (!this.symbol.includes('SATO') ? this.buyToBalance.accountId : this.fromBalance.accountId) // 帐号id
        toAccountId = this.toBalance.accountId // 帐号id*/
        if (numUtils.BN(amount).gt(numUtils.BN(balance)) || numUtils.BN(balance).isZero()) {
          Vue.$koallTipBox({icon: 'notification', message: this.$t('exchange.exchange_Insufficient_balance')}) // 余额不足
          return
        }
      }
      let data = {
        price: this.fixedPrice, // 表示价格‘-1’表示市价
        amount: amount, //
        fromAccountId: fromAccountId,
        toAccountId: toAccountId,
        market: this.symbol,
        // marketId: 2, // 市场id
        direction: direction // 1买 2卖
      }

      /*if (this.active === 'limit' && this.tradeType === 'sell' && numUtils.BN(this.formData.price).lt(numUtils.mul(this.getLast24h.close, 0.95))) {
        // 您委托价格低于最新成交价5%，是否确认下单？
        Vue.$confirmDialog({
          content: this.$t('public.entrustment_price_lower_5'),
          okCallback: () => {
            this.okCallback(data)
          }
        })
        return
      } else if (this.active === 'limit' && this.tradeType === 'buy' && numUtils.BN(this.formData.price).gt(numUtils.mul(this.getLast24h.close, 1.05))) {
        // 您委托价格高于最新成交价5%，是否确认下单？
        Vue.$confirmDialog({
          content: this.$t('public.entrustment_price_higher_5'),
          okCallback: () => {
            this.okCallback(data)
          }
        })
        return
      }*/
      this.okCallback(data)
    },
    okCallback (data) {
      if (this.lockExtrust) {
        return
      }
      this.lockExtrust = true
      marketApi.marketBuyorSell(data, (res) => {
        this.formData.amount = ''
        this.formData.total = ''
        this.lockExtrust = false

        Vue.$koallTipBox({icon: 'success', message: this.$t('exchange.exchange_Commissioned_success')}) // 委托成功
      }, (msg) => {
        this.lockExtrust = false
        if (msg === 'AMOUNT_ERROR') {
          // 最小金额必须大于等于{0}{1}
          let minAmount = numUtils.BN(this.getMarketConfig[this.symbol].minAmount).toString()
          Vue.$koallTipBox({icon: 'notification', message: this.$t('public.min_total_greater_than').format(minAmount, this.baseSymbol)})
        } else {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        }
      })
    },
    changePriceValue (price) {
      if (this.active === 'limit') {
        this.formData.price = this.toFixed(price)
      }
    },
    toFixed (value, fixed) {
      return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.fixedNumber : fixed, 1)
    },
    loginDialog () {
      this.$router.push({name: 'login'})
    },
    registerDialog () {
      this.$router.push({name: 'register'})
    },
    percentOver (p) {
      this.hoverPercent = p
    },
    percentOut () {
      this.hoverPercent = 0
    },
    mouseDown (e) { // 拖动
      let left = this.$refs.dragCircle.offsetLeft
      let startX = e.pageX
      let self = this
      let width = this.$refs.percent.clientWidth
      this.moveCursor = true
      function mm (ev) {
        ev.preventDefault()
        let cw = Math.min(Math.max(0, left + ev.pageX - startX), width)
        self.percent = Math.floor(cw / width * 100)
        self.$refs.dragCircle.style.left = `calc(${self.percent}% - 7px)`
        self.showPercentTip = true
        document.body.style.cursor = 'pointer'
      }
      function mp (ev) {
        ev.preventDefault()
        self.moveCursor = false
        self.showPercentTip = false
        document.body.style.cursor = null
        document.removeEventListener('mousemove', mm, false)
        document.removeEventListener('mouseup', mp, false)
      }
      document.addEventListener('mousemove', mm, false)
      document.addEventListener('mouseup', mp, false)
    }
  }
}
</script>

<style scoped>
.b-content{padding:5px;}
.select{width:100%;height:24px;line-height:24px;border:1px solid #636e87;font-size:14px;color:#d6dff9;}
.formel{width:100%;display:flex;position:relative;height:36px;margin-bottom:10px;}
.price-balance{height:44px;line-height:44px;justify-content:flex-end;color:#333;font-size:16px;margin-bottom:0;}
.formel-label{width:70px;line-height:36px;text-align:right;color:#333;overflow: hidden;text-overflow: ellipsis;padding-right:20px;}
.formel-text{width:calc(100% - 90px);position:relative;color:#333;}
.formel-textbox{width:calc(100% - 18px);height:34px;line-height:34px;border:1px solid #ccc;padding:0 8px;background:transparent;color:#333;font-size:16px;}
.formel-textbox[readonly='readonly']{cursor:not-allowed; background-color: #eee;}
.formel-textbox:focus{border-color:#3A76E7;}
.tip-title{height:22px;line-height:22px;position:absolute;z-index:1;right:51px;top:calc(50% - 10px);padding:0 4px;background:transparent;}
.percent{width:calc(100% - 104px);height:4px;display:flex;background:#eee;margin:18px 0 18px 97px;position:relative;}
.percent-line{width:100%;height:100%;display:flex;}
.percent-light-line{height:100%;background:#3A76E7;position:absolute;z-index:1;}
.percent-circle{flex:1;position:relative;}
.percent-circle::before,.percent-circle:last-child::after{
  display:block;content:"";position:absolute;width:10px;height:10px;border-radius:50%;
  background:#eee;top:-3px;left:-5px;z-index:4;
}
.percent-circle-light::before{background:#3A76E7;}
.percent-circle:last-child::after{left:initial;right:-5px;}
.percent-item,.drag-circle{width:14px;height:14px;position:absolute;background:#fff;border-radius:50%;top:-6px;left:-7px;z-index:10;cursor: pointer;display:flex;align-items:center;justify-content:center;}
.percent-item::before,.drag-circle::before{display:block;content:"";width:10px;height:10px;border-radius:50%;background:#3A76E7;}
.drag-circle /deep/ em{position:relative;}
.drag-circle /deep/ em i{display:flex;width:42px;height:27px;line-height:27px;text-align:center;background:#2F3D45;color:#fff;font-size:12px;border-radius:4px;position:absolute;top:-45px;left:-26px;justify-content:center;}
.drag-circle /deep/ em i::before{color:#2F3D45;position:absolute;bottom:-15px;left:calc(50% - 10px);font-size:20px;}
.percent-item{z-index:5;opacity:0;transition:100ms;overflow:hidden;}
.percent-item:hover{opacity:1;overflow:visible;}
.percent-item-0{left:-7px;}
.percent-item-1{left:calc(25% - 7px);}
.percent-item-2{left:calc(50% - 7px);}
.percent-item-3{left:calc(75% - 7px);}
.percent-item-4{left:calc(100% - 7px);}
.percent-item /deep/ em{position:relative;}
.percent-item /deep/ em i{display:flex;width:42px;height:27px;line-height:27px;text-align:center;background:#2F3D45;color:#fff;font-size:12px;border-radius:4px;position:absolute;top:-45px;left:-26px;justify-content:center;}
.percent-item /deep/ em i::before{color:#2F3D45;position:absolute;bottom:-15px;left:calc(50% - 10px);font-size:20px;}
.sum{width:100%;height:25px;line-height:25px;}
.buttons{width:100%;height:36px;display:flex;text-align:center;color:#fff;font-size:16px;font-weight:bold;}
.buttons /deep/ span{flex:1;height:36px;line-height:36px;cursor:pointer;margin-left:90px; border-radius: 3px;}
.panel.buy /deep/ .buttons span{background-color: #24C08A;}
.panel.sell /deep/ .buttons span{background-color: #F1595C;}
.panel.buy /deep/ .buttons span:hover{background-color: #13a271;}
.panel.sell /deep/ .buttons span:hover{background-color: #d43f42;}
.buttons /deep/ span.disabled{background-color:#999!important;;color:#FFF!important;cursor:not-allowed;}
.buttons /deep/ div{width:calc(100% - 92px); margin-left:90px;display:flex;justify-content:center;align-items:center; background-color: #24C08A; border-radius: 3px;}
.buttons /deep/ div.sell {background-color: #F1595C;}
.buttons /deep/ div.redbtn {background-color: #F1595C;}
.buttons /deep/ div a{font-size:18px;color:#fff;cursor: pointer;font-weight:normal;}
.buttons /deep/ div font{padding:0 8px;font-size:16px;}
.error-tip{position:absolute;z-index:999;top:-30px;left:50px;height:24px;line-height:24px;background:#3A76E7;padding:0 20px;font-size:12px;color: #fff;border-radius:4px;}
.error-tip::before{left:calc(50% - 6px);bottom:-15px;position:absolute;color:#3A76E7;}
.error-tip i{display:block;max-width:100px;overflow: hidden;white-space: nowrap;text-overflow:ellipsis;}
@media screen and (max-width: 1600px) and (max-height: 900px) {
  .tip-title{right:31px;}
  .formel{height:30px;}
  .price-balance{height:36px;line-height:36px;font-size:14px;}
  .formel-textbox{height:28px;line-height:28px;font-size:14px;}
  .buttons{font-size:14px;height:30px;}
  .buttons /deep/ span{height:30px;line-height:30px;}
  .buttons /deep/ div a{font-size:14px;}
  .buttons /deep/ div font{font-size:12px;}
}
</style>
