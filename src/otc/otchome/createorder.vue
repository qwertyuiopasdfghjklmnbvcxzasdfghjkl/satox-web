<template>
    <div class="createorder" :class="[{'sell-pend':formData.ad_type===2}, {'englishsize':getLang==='en'}]">
        <div class="title">{{$t(ad_id ? 'otc_ad.otc_edit_title' : 'otc_ad.otc_post_title').format(tradeParams.title1, formData.symbol)}}<!--发布广告||修改广告--></div>
        <div class="cont">
            <div class="cont-item exchange">
                <div class="row">
                    <label>{{$t('otc_exchange.otc_exchange_Bid')}}<!--对标交易所-->：</label>
                    <div class="value">
                        <select v-model="formData.bench_marking_id">
                            <option v-for="item in benchDatas" :key="item.bench_marking_id" :value="item.bench_marking_id">{{item.marking_name}}</option>
                        </select>
                    </div>
                </div>
                <div class="prompt"></div>
            </div>
            <div class="cont-item currentprice">
                <div class="row">
                    <label>{{$t('otc_ad.otc_ad_prompt1')}}({{formData.currency}})<!--交易所价格-->：</label>
                    <div class="value">
                        <span>{{benchItem.lowestPrice}}</span>
                    </div>
                </div>
                <div class="prompt"></div>
            </div>
            <div class="cont-item premium">
                <div class="row">
                    <label class="label-tips">
                      <span>{{$t('otc_ad.otc_ad_Premium')}}<!--溢价-->：</span>
                      <div class="tips">
                        <span class="tips-container">
                          <i class="tips-icon">?</i>
                          <em class="tips-text">{{$t('otc_exchange.otc_exchange_price_float_rate')}}<!--对交易所价格的浮动比例--></em>
                        </span>
                      </div>
                    </label>
                    <div class="value">
                        <numberbox :class="{error: errors.has('price_rate')}" v-model="formData.price_rate" :size="6" :accuracy="2" v-validate="'premiumPriceValid'" data-vv-name="price_rate"/>
                        <em>%</em>
                    </div>
                </div>
                <div class="prompt">{{getErrorMsg('price_rate')}}</div>
            </div>
            <div class="cont-item price">
                <div class="row">
                    <label>{{$t('otc_exchange.otc_exchange_price')}}<!--溢价后单价-->({{formData.currency}})：</label>
                    <div class="value">
                        <span>{{curPrice}}</span>
                    </div>
                </div>
                <div class="prompt"></div>
            </div>
            <div class="cont-item acceptable">
                <div class="row">
                    <label>{{tradeParams.title2}}<!--可接受的最低单价||可接受的最高单价-->({{formData.currency}})：</label>
                    <div class="value">
                        <numberbox :class="{error: errors.has('lowest_price')}" v-model="formData.lowest_price" :size="12" :accuracy="2" v-validate="'intOrDecimal|maxInputValue:999999999'" data-vv-name="lowest_price"/>
                    </div>
                </div>
                <div class="prompt">{{getErrorMsg('lowest_price')}}</div>
            </div>
            <div class="cont-item quantity">
                <div class="row">
                    <label>{{tradeParams.title3}}<!--我要出售多少||我要购买多少-->({{formData.symbol}})：<em class="asterisk">&nbsp;*</em></label>
                    <div class="value">
                        <numberbox :class="{error: errors.has('symbol_count')}" v-model="formData.symbol_count" :size="15" :accuracy="5" v-validate="'required|intOrDecimal|buyAmountLimitValid|maxInputValue:999999999'" data-vv-name="symbol_count" />
                    </div>
                </div>
                <div class="prompt">{{getErrorMsg('symbol_count')}}<!--请输入币种数量--></div>
            </div>
            <div class="cont-item tradelimit">
                <label>{{$t('otc_ad.otc_ad_Trading_restrictions')}}<!--交易限额-->({{formData.ad_type === 1 ? formData.symbol : formData.currency}})：<em class="asterisk">&nbsp;*</em></label>
                <div class="value">
                    <numberbox id="ads_min_amount" :class="{error: errors.has('min_amount')}" v-model="formData.min_amount" :size="tradeLimitAccuracy.size" :accuracy="tradeLimitAccuracy.accuracy" v-validate="'required|intOrDecimal|minAmountValid|minamount|maxInputValue:999999999,public0.public258'" data-vv-name="min_amount"/>
                    <em>{{$t('public0.public114')}}<!--最小限额--></em>
                </div>
                <div class="prompt">{{getErrorMsg('min_amount')}}</div>
                <div class="value">
                    <numberbox id="ads_max_amount" :class="{error: errors.has('max_amount')}" v-model="formData.max_amount" :size="tradeLimitAccuracy.size" :accuracy="tradeLimitAccuracy.accuracy" v-validate="'required|intOrDecimal|maxamount|maxInputValue:999999999,public0.public259'" data-vv-name="max_amount"/>
                    <em>{{$t('public0.public115')}}<!--最大限额--></em>
                </div>
                <div class="prompt">{{getErrorMsg('max_amount')}}</div>
            </div>
            <div class="cont-item tradetype">
                <label>{{$t('otc_exchange.otc_exchange_transaction_method')}}<!--交易方式-->：<em class="asterisk">&nbsp;*</em></label>
                <div class="value">
                    <input :class="{error: errors.has('pay_type')}" type="hidden" v-validate="'required'" data-vv-name="pay_type" v-model="formData.pay_type"/>
                    <span v-for="item in payments" :key="item.id" @click="setPayment(item)" v-if="myPayType.indexOf(item.id)!==-1">
                        <i :class="[item.checked ? 'icon-checkbox-checked' : 'icon-checkbox-unchecked']"></i>{{$t(item.key)}}
                    </span>
                </div>
                <div class="prompt">{{getErrorMsg('pay_type')}}</div>
            </div>
            <div class="cont-item dispose">
                <div class="row">
                    <label class="label-tips">
                      <span>{{$t('otc_ad.otc_ad_maximum_orders')}}<!--最大处理订单数-->：<em class="asterisk">&nbsp;*</em></span>
                      <div class="tips">
                        <span class="tips-container">
                          <i class="tips-icon">?</i>
                          <em class="tips-text">{{$t('otc_ad.otc_ad_max_uncompleted_orders')}}<!--单个广告可同时存在的未完成订单最大数量--></em>
                        </span>
                      </div>
                    </label>
                    <div class="value">
                        <numberbox :class="{error: errors.has('max_process_num')}" v-model="formData.max_process_num" :size="1" v-validate="'required|pInteger|otcProcessNumValid'" data-vv-name="max_process_num"/>
                    </div>
                </div>
                <div class="prompt">{{getErrorMsg('max_process_num')}}</div>
            </div>
            <div class="cont-item good">
                <div class="row">
                    <label class="label-tips">
                      <span>{{$t('otc_exchange.otc_exchange_Good_rating')}}<!--好评率-->：<em class="asterisk">&nbsp;*</em></span>
                      <div class="tips">
                        <span class="tips-container">
                          <i class="tips-icon">?</i>
                          <em class="tips-text">{{$t('otc_exchange.otc_exchange_good_rating')}}<!--要求对手方好评率必须大于此设定值--></em>
                        </span>
                      </div>
                    </label>
                    <div class="value">
                        <numberbox :class="{error: errors.has('praise_rate')}" v-model="formData.praise_rate" :size="4" :accuracy="1" v-validate="'required|ratingValid'" data-vv-name="praise_rate"/>
                        <em>%</em>
                    </div>
                </div>
                <div class="prompt">{{getErrorMsg('praise_rate')}}</div>
            </div>
            <div class="cont-item timelimit">
              <div class="row">
                <label>{{$t('otc_ad.otc_ad_expiration_pay')}}<!--付款期限-->：<em class="asterisk">&nbsp;*</em></label>
                <div class="value">
                  <select v-model="formData.pay_limit_time" v-validate="'required'" data-vv-name="pay_limit_time">
                    <option value="15">15</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                  </select>
                  <em>{{$t('otc_ad.otc_ad_minute')}}<!--分钟--></em>
                </div>
              </div>
              <div class="prompt">{{getErrorMsg('pay_limit_time')}}<!--请输入付款期限--></div>
            </div>
            <div class="cont-item button">
                <button class="cancel" @click="closeDalg">{{$t('otc_legal.otc_legal_cancel')}}<!--取消--></button>
                <button class="comfirm" @click="saveAds">{{$t('otc_ad.otc_ad_confirm')}}<!--确认--></button>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { Validator } from 'vee-validate'
import otcApi from '@/api/otc'
import otcConfig from '@/assets/js/otcconfig'
import numUtils from '@/assets/js/numberUtils'
import utils from '@/assets/js/utils'
import numberbox from '@/components/formel/numberInput'
import adconfirm from '@/otc/otchome/adconfirm'
export default {
  props: ['params', 'ad_id', 'myPayType'],
  components: {
    numberbox
  },
  data () {
    return {
      coins: otcConfig.coins,
      currency: otcConfig.currencys,
      payments: JSON.parse(JSON.stringify(otcConfig.payments)),
      isClickPayments: false,
      formData: {
        ad_type: Number(this.params.ad_type) === 2 ? 1 : 2,
        symbol: this.params.symbol || otcConfig.symbol,
        currency: this.params.currency || 'CNY',
        bench_marking_id: null,
        price_rate: null,
        price_type: 1,
        lowest_price: null,
        symbol_count: null,
        min_amount: null,
        max_amount: null,
        pay_type: null,
        max_process_num: 2,
        praise_rate: 50,
        pay_limit_time: 15
      },
      benchItem: {
        price: null,
        lowestPrice: null
      },
      benchDatas: [] // 对标交易所
    }
  },
  computed: {
    ...mapGetters(['getLang']),
    msgs () {
      return {
        lowest_price: {required: this.$t('public0.public113')}, // 请输入单价
        min_amount: {required: this.$t('otc_ad.otc_ad_minimum_amount')}, // 请输入最小限额
        max_amount: {required: this.$t('otc_ad.otc_ad_maximum_amount')}, // 请输入最大限额
        pay_limit_time: {required: this.$t('otc_ad.otc_ad_payment_period')}, // 请输入付款期限
        symbol_count: {required: this.$t('public0.public112')}, // 请输入币种数量
        praise_rate: {required: this.$t('public0.public186')}, // 请输入好评率
        pay_type: {required: this.$t('public0.public118')}, // 请选择交易方式
        max_process_num: {required: this.$t('public0.public163')} // 请输入整数1~5
      }
    },
    benchSymbolParams () {
      return {
        ad_type: this.formData.ad_type,
        symbol: this.formData.symbol,
        currency: this.formData.currency,
        bench_marking_id: this.formData.bench_marking_id
      }
    },
    tradeParams () {
      if (this.formData.ad_type === 2) {
        return {
          title1: this.$t('otc_exchange.otc_exchange_sell'), // 出售
          title2: this.$t('public0.public137'), // 可接受的最低单价
          title3: this.$t('public0.public117') // 我要出售多少
        }
      } else if (this.formData.ad_type === 1) {
        return {
          title1: this.$t('otc_exchange.otc_exchange_buy'), // 购买
          title2: this.$t('public0.public136'), // 可接受的最高单价
          title3: this.$t('public0.public116') // 我要购买多少
        }
      }
    },
    curPrice () {
      if (this.benchItem.lowestPrice && this.formData.price_rate) {
        return numUtils.mul(this.benchItem.lowestPrice, numUtils.div(100 + this.formData.price_rate * 1, 100)).toFixed(2)
      } else {
        return this.benchItem.lowestPrice
      }
    },
    coinMinLimit () {
      for (let i = 0; i < this.coins.length; i++) {
        if (this.coins[i].symbol === this.formData.symbol) {
          return this.coins[i].minLimit
        }
      }
      return null
    },
    currencyMinLimit () {
      for (let i = 0; i < this.currency.length; i++) {
        if (this.currency[i].value === this.formData.currency) {
          return this.currency[i].minLimit
        }
      }
      return null
    },
    tradeLimitAccuracy () {
      return this.formData.ad_type === 1 ? {size: 15, accuracy: 5} : {size: 12, accuracy: 2}
    }
  },
  watch: {
    'formData.pay_type' () {
      if (this.isClickPayments) {
        this.isClickPayments = false
      } else {
        this.payments.forEach((item) => {
          if (this.formData.pay_type.indexOf(item.id) !== -1) {
            item.checked = true
          } else {
            item.checked = false
          }
        })
      }
    },
    benchSymbolParams () {
      this.getBenchSymbolInfo()
    }
  },
  created () {
    Validator.extend('minAmountValid', {
      getMessage: (field, args) => {
        if (this.formData.ad_type === 1) {
          return this.$t('public0.public110').format(this.coinMinLimit)
        } else {
          return this.$t('public0.public110').format(this.currencyMinLimit)
        }
      },
      validate: (value, args) => {
        value = parseFloat(value)
        if (this.formData.ad_type === 1) {
          return value >= this.coinMinLimit
        } else {
          return value >= this.currencyMinLimit
        }
      }
    })
    Validator.extend('buyAmountLimitValid', {
      getMessage: (field, args) => this.$t('public0.public111'), // 购买量必须大于等于最小限额
      validate: (value, args) => {
        if (!value || !this.formData.min_amount) {
          return true
        }
        if (this.formData.ad_type === 1) {
          value = parseFloat(value)
          var max = parseFloat(this.formData.min_amount || 0)
          return value >= max
        } else {
          return true
        }
      }
    })
    this.$nextTick(() => {
      this.fnGetBenchExchange()
      this.fnGetAdvertisementDetail()
    })
  },
  methods: {
    fnGetBenchExchange () { // 获取对标交易所
      otcApi.getBenchExchange((res) => {
        this.benchDatas = res
        if (res.length) {
          this.formData.bench_marking_id = res[0].bench_marking_id
        }
      })
    },
    fnGetAdvertisementDetail () { // 修改广告 - 获取广告详情
      if (this.ad_id) {
        otcApi.getAdvertisementDetail(this.ad_id, (res) => {
          for (var i in this.formData) {
            if (i === 'price_rate' && utils.removeEndZero(res[i] || '0') === '0') {
              continue
            } else if (i === 'lowest_price' && numUtils.BN(0).equals(res[i])) {
              continue
            } else if (i === 'min_amount' || i === 'max_amount' || i === 'lowest_price') {
              res[i] = utils.removeEndZero(res[i])
            } else if (i === 'pay_type') {
              let tempArray = []
              res[i].split(',').forEach((item) => {
                if (this.myPayType.indexOf(item) !== -1) {
                  tempArray.push(item)
                }
              })
              res[i] = tempArray.join(',')
            }
            this.formData[i] = res[i]
          }
          this.formData.symbol_count = numUtils.BN(res.symbol_count.toFixed(5))
          this.formData.min_amount = numUtils.BN(res.min_amount.toFixed(parseInt(res.ad_type) === 1 ? 5 : 2))
          this.formData.max_amount = numUtils.BN(res.max_amount.toFixed(parseInt(res.ad_type) === 1 ? 5 : 2))
          // 类型转换
          this.formData.ad_type = parseInt(res.ad_type)
          this.formData.bench_marking_id = parseInt(res.bench_marking_id)
        })
      } else {
        this.formData.min_amount = this.formData.ad_type === 1 ? this.coinMinLimit : this.currencyMinLimit
        this.formData.max_amount = this.formData.ad_type === 1 ? null : 20000
        this.formData.pay_type = this.myPayType
      }
    },
    getBenchSymbolInfo () {
      otcApi.getBenchSymbolInfo(this.benchSymbolParams, (res) => {
        this.benchItem.price = numUtils.BN(res.cur_price || 0).toFixed(2)
        this.benchItem.lowestPrice = numUtils.BN(res.market_price || 0).toFixed(2)
      })
    },
    setPayment (item) {
      this.isClickPayments = true
      item.checked = !item.checked
      var arr = []
      this.payments.forEach((item) => {
        item.checked && arr.push(item.id)
      })
      this.formData.pay_type = arr.join(',')
    },
    getErrorMsg (name) {
      return this.msgs[name] && this.msgs[name][this.errors.firstRule(name)] ? this.msgs[name][this.errors.firstRule(name)] : this.$t(this.errors.first(name))
    },
    closeDalg () {
      this.$emit('removeDialog')
    },
    saveAds () {
      this.$validator.validateAll(this.formData).then((validResult) => {
        if (!validResult) {
          return
        }
        var formData = JSON.parse(JSON.stringify(this.formData))
        formData.lowestPrice = this.benchItem.lowestPrice
        Vue.$confirmDialog({
          id: 'ads_create_or_edit_confirm',
          title: this.$t(this.ad_id ? 'public0.public253' : 'public0.public254'), // 修改广告确认；发布广告确认
          isComponent: true,
          content: adconfirm,
          btnPosition: 'right',
          width: 620,
          item: formData,
          okCallback: () => {
            if (this.ad_id) {
              this.updateAds()
            } else {
              this.createAds()
            }
          }
        })
      })
    },
    createAds () {
      var formData = JSON.parse(JSON.stringify(this.formData))
      otcApi.createAdvertisement(formData, (msg) => {
        Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
        this.params.newAdCount++
        this.$emit('removeDialog')
      }, (msg) => {
        let errMsg = typeof msg === 'string' ? msg : msg[0]
        let errArr = errMsg.split(' ')
        errMsg = errArr.length === 1 ? this.$t(`error_code.${errArr[0]}`) : this.$t(`error_code.${errArr[0]}`) + this.$t('public0.public260') + this.$t(`error_code.${errArr[1]}`)
        if (errArr.length === 2 && errArr[0] === 'MIN_TRADE_SUM_TIP') {
          errMsg += '\u0020' + this.formData.currency
        } else if (errArr.length === 2 && errArr[0] === 'MIN_TRADE_COUNT_TIP') {
          errMsg += '\u0020' + this.formData.symbol
        }
        Vue.$confirmDialog({showCancel: false, content: errMsg})
      })
    },
    updateAds () {
      var formData = JSON.parse(JSON.stringify(this.formData))
      otcApi.updateAdvertisement(this.ad_id, formData, (msg) => {
        Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
        this.params.newAdCount++
        this.$emit('removeDialog')
      }, (msg) => {
        let errMsg = typeof msg === 'string' ? msg : msg[0]
        let errArr = errMsg.split(' ')
        errMsg = errArr.length === 1 ? this.$t(`error_code.${errArr[0]}`) : this.$t(`error_code.${errArr[0]}`) + this.$t('public0.public260') + this.$t(`error_code.${errArr[1]}`)
        if (errArr.length === 2 && errArr[0] === 'MIN_TRADE_SUM_TIP') {
          errMsg += '\u0020' + this.formData.currency
        } else if (errArr.length === 2 && errArr[0] === 'MIN_TRADE_COUNT_TIP') {
          errMsg += '\u0020' + this.formData.symbol
        }
        Vue.$confirmDialog({showCancel: false, content: errMsg})
      })
    }
  }
}
</script>

<style scoped>
.createorder{width: 340px; background-color: #222121;max-height:calc(100% - 20px);overflow-y:auto;}
.createorder.englishsize{width: 360px;}
.createorder .title{height: 30px;line-height: 30px;text-align: center;color: #becbe8;background-color: #333232;}
.createorder .cont{padding: 20px 30px 20px 30px;}
.cont-item .row{display: flex;justify-content: space-between;align-items: center;}
.cont-item label{display: block;height: 24px;line-height: 24px;font-size: 12px;color: #becbe8;}
.cont-item label em.asterisk{position: relative;top: 6px;line-height: 0;font-size: 18px;color: #11a8fe;}
.cont-item label.label-tips{font-size: 0;}
.cont-item label.label-tips > span{font-size: 12px;}
.cont-item label.label-tips .tips{display: inline-block;margin-top: 6px;margin-left: 6px;vertical-align: top;}
.cont-item label.label-tips .tips-container{display: flex;justify-content: center;position: relative;z-index: 1;width: 12px;height: 12px;}
.cont-item label.label-tips .tips-icon{width: 12px;height: 12px;font-weight: bold;font-size: 12px;line-height: 12px;color: #181b2a;text-align: center;background-color: #fff;border-radius: 50%;cursor: help;}
.cont-item label.label-tips .tips-text{display: none;position: absolute;top: -30px;height: 24px;padding-left: 12px;padding-right: 12px;font-size: 12px;line-height: 24px;color: #181b2a;white-space: nowrap;background-color: #fff;border-radius: 4px;}
.cont-item label.label-tips .tips-text:before{content: "";position: absolute;bottom: -6px;left: 50%;width: 0;height: 0;margin-left: -6px;border-width: 6px 6px 0 6px;border-style: solid;border-color: #fff transparent transparent transparent;}
.cont-item label.label-tips .tips-icon:hover + .tips-text{display: block;}
.cont-item .value{position: relative;}
.cont-item.tradetype .value{display: flex; justify-content: space-between;align-items: center;height: 24px;}
.cont-item .value select{
  height: 24px;padding-left: 12px;padding-right: 16px;font-size: 12px;color: #becbe8;background-position: right 4px center;
  border: 1px solid #54616c;cursor: pointer;
}
.cont-item.exchange .value select{width: 124px;}
.cont-item.timelimit .value select{position: relative; z-index: 1;width: 80px;}
.cont-item .value span{font-size: 12px;color: #becbe8;}
.cont-item.tradetype .value span{cursor: pointer;}
.cont-item.tradetype .value span i{padding-right: 4px;color: #11a8fe;}
.cont-item.tradetype .value span i:hover{color: #15c9ff;}
.cont-item .value input{box-sizing: border-box;width: 100%;height: 30px;padding-left: 12px;padding-right: 12px;font: 12px/normal 'Microsoft YaHei';color: #becbe8;background-color: transparent;border: 1px solid #54616c;}
.cont-item .value input.error{border-color: #e53f3f;}
.cont-item.premium .value input,
.cont-item.dispose .value input,
.cont-item.timelimit .value input,
.cont-item.good .value input{width: 80px;}
.cont-item.acceptable .value input,
.cont-item.quantity .value input{width: 124px;}
.cont-item .value em{position: absolute;top: 0;right: 13px;height: 30px;line-height: 30px;font-size: 12px;color: #7b87aa;}
.cont-item.timelimit .value em{right: 21px;height: 24px;line-height: 24px;}
.cont-item .prompt{height: 20px;line-height: 20px;font-size: 12px;color: #e53f3f;white-space: nowrap;}
.cont-item.button{line-height: 0;font-size: 0;text-align: right;}
.cont-item.button button{width: 74px;height: 30px;font-size: 12px;border-radius: 4px;cursor: pointer;}
.cont-item.button button.cancel{margin-right: 10px;color: #11a8fe;background-color: transparent;border: 1px solid #11a8fe;}
.cont-item.button button.cancel:hover{color: #15c9ff;border-color: #15c9ff;}
.cont-item.button button.comfirm{color: #fff;background-color: #11a8fe;}
.cont-item.button button.comfirm:hover{background-color: #15c9ff;}
</style>
