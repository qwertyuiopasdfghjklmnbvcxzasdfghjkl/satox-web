<template>
    <div class="undone-detail">
        <div class="undone-left">
            <span :class="{active: step >= 0}">
                1.{{$t('public0.public143')}}
                <!--新建交易-->
            </span>
            <span :class="{active: step >= 1}">
                2.{{$t('public0.public144')}}
                <!--请先付款-->
            </span>
            <span :class="{active: step >= 2}">
                3.{{$t('public0.public145')}}
                <!--等待放币-->
            </span>
            <span :class="{active: step >= 3}">
                4.{{$t('public0.public146')}}
                <!--完成交易-->
            </span>
        </div>
        <div class="undone-center" v-if="item.state === 1">
            <div class="undone-center-buys">
                <p>{{$t('otc_exchange.otc_exchange_buy')}}<!--购买--></p>
                <p>{{item.symbol}}</p>
            </div>
            <div class="undone-center-number">
                <p class="undone-center-number-font">{{item.total_price}} {{item.currency}}</p>
                <p>{{$t('otc_exchange.otc_exchange_ask')}}<!--单价--> {{item.cur_price}} {{item.currency}}</p>
                <p>{{$t('exchange.exchange_amount')}}<!--数量--> {{item.symbol_count}} {{item.symbol}}</p>
            </div>
            <div class="undone-center-type">
                <select v-model="formData.pay_type" :disabled="isDisabled">
                    <option v-for="item in paylist" :value="item.id" :key="item.id">{{$t(item.key)}}</option>
                </select>
            </div>
            <div class="undone-center-adress">
                <p>{{$t('public0.public65')}}<!--收款人-->：{{payInfo.name}}</p>
                <p v-if="formData.pay_type === 1">{{$t('otc_legal.otc_legal_Bank')}}：<!--开户行-->{{payInfo.bank}}</p>
                <p v-if="formData.pay_type === 1">{{$t('otc_legal.otc_legal_Bank_number')}}：<!--银行卡号-->{{payInfo.number}}</p>
                <p v-if="formData.pay_type === 2">{{$t('otc_legal.otc_legal_Alipay_number')}}：<!--支付宝账号-->{{payInfo.number}}</p>
                <p v-if="formData.pay_type === 3">{{$t('otc_legal.otc_legal_Wechat_number')}}：<!--微信账号-->{{payInfo.number}}</p>
                <p v-if="formData.pay_type === 4">{{$t('public0.public221')}}：<!--PayPal账号-->{{payInfo.number}}</p>
            </div>
            <div class="undoneimg" v-if="formData.pay_type === 2 || formData.pay_type === 3">
                <img :src="payInfo.url" @click="openQrCode"/>
            </div>
        </div>
        <div class="undone-center" v-if="item.state === 2">
            <div class="undone-center-buys">
                <p>{{$t('otc_exchange.otc_exchange_buy')}}<!--购买--></p>
                <p>{{item.symbol}}</p>
            </div>
            <div class="undone-center-type" v-if="!item.from_user_comment">
                {{$t('otc_ad.otc_ad_prompt9')}}<!--交易成功！请评价对方-->
            </div>
            <div class="undone-center-adress">
                <div class="evaluate" >
                    <ul>
                        <li @click="commentType = 1" v-if="!item.from_user_comment || item.from_user_comment === 1">
                            <em class="icon-praise" :class="{active: commentType === 1}"></em>
                            <p>{{$t('otc_ad.otc_ad_Praise')}}<!--好评--></p>
                        </li>
                        <li @click="commentType = 2" v-if="!item.from_user_comment || item.from_user_comment === 2">
                            <em class="icon-average" :class="{active: commentType === 2}"></em>
                            <p>{{$t('otc_ad.otc_ad_Average')}}<!--中评--></p>
                        </li>
                        <li @click="commentType = 3" v-if="!item.from_user_comment || item.from_user_comment === 3">
                            <em class="icon-bad-review" :class="{active: commentType === 3}"></em>
                            <p>{{$t('otc_ad.otc_ad_Bad_review')}}<!--差评--></p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="undone-right">
            <p>{{stateTitle}}</p>
            <a href="javascript:;" v-if="item.state === 1" :class="{disabled: item.pay_state !== 0}" @click="confirm">{{$t('public0.public154')}}<!--已支付--></a>
            <a href="javascript:;" v-if="item.state === 2" :class="{disabled: item.from_user_comment}" @click="evaluation">{{$t('otc_ad.otc_ad_confirm')}}<!--确认--></a>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import otcApi from '@/api/otc'
import otcConfig from '@/assets/js/otcconfig'
import utils from '@/assets/js/utils'
import qrcode from '@/otc/otchome/list/qrcode'
import warnDialog from '@/otc/otchome/dialog/warnDialog'
export default {
  props: ['item'],
  data () {
    return {
      datas: [],
      params: {
        page: 1,
        state: 1,
        total: 0
      },
      payTypes: {
        real_name: '',
        data: {}
      },
      commentType: 1,
      formData: {
        pay_type: parseInt(this.item.pay_type.split(',')[0])
      }
    }
  },
  computed: {
    ...mapGetters(['getApiToken', 'getUserInfo']),
    isDisabled () {
      if (this.item.pay_state === 0) {
        return this.item.pay_type.split(',').length <= 1
      } else {
        return true
      }
    },
    paramsChange () {
      return {
        page: this.params.page,
        state: this.params.state
      }
    },
    step () {
      if (this.item.state === 1 && this.item.pay_state === 0) {
        return 1 // 未付款
      } else if (this.item.state === 1 && this.item.pay_state === 1) {
        return 2 // 已付款
      } else if (this.item.state === 2) {
        return 3 // 已放币，交易完成
      } else {
        return 0
      }
    },
    tradeType () {
      return this.item.to_user_name === this.getUserInfo.username
    },
    paylist () {
      let datas = []
      otcConfig.payments.forEach((item) => {
        let bool = this.item.pay_type && this.item.pay_type.indexOf(item.id) !== -1
        if (bool) {
          datas.push({id: item.id, key: item.key})
        }
      })
      return datas
    },
    payInfo () {
      switch (this.formData.pay_type) {
        case 1:
          return { // 银行卡
            name: this.payTypes.real_name,
            bank: this.payTypes.data.card_bank,
            number: this.payTypes.data.card_number
          }
        case 2:
          return { // 支付宝
            name: this.payTypes.real_name,
            number: this.payTypes.data.alipay_number,
            url: this.payTypes.data.alipay_image_path
          }
        case 3:
          return { // 微信
            name: this.payTypes.real_name,
            number: this.payTypes.data.wechat_number,
            url: this.payTypes.data.wechat_image_path
          }
        case 4:
          return { // PayPal
            name: this.payTypes.real_name,
            number: this.payTypes.data.paypal_number
          }
        default:
          return {}
      }
    },
    stateTitle () {
      if (this.item.state === 2) {
        return this.$t('public0.public146')
      } else if (this.item.pay_state === 0) {
        return this.$t('public0.public152')
      } else if (this.item.pay_state === 1) {
        return this.$t('public0.public145')
      } else {
        return null
      }
    }
  },
  watch: {
    'item.isExpire' (newVal) {
      if (newVal && this.item.pay_state === 0) {
        console.log(`自动取消订单`)
        // 由于您在规定时间内未标记确认付款，系统已经自动取消了您的订单！
        Vue.$confirmDialog({
          id: 'cancel_order_tip',
          content: this.$t('error_code.AUTOMATICALLY_CANCEL'),
          showCancel: false,
          okCallback: () => {
            utils.setDialog(warnDialog)
          }
        })
        this.$emit('cancelOrder', this.item, true)
      }
    }
  },
  created () {
    this.getPays()
  },
  methods: {
    getPays () {
      otcApi.getPaySettingsNoToken({
        user_id: this.item.from_user_id
      }, (res) => {
        this.payTypes = {
          real_name: res.real_name,
          data: res.data
        }
      })
    },
    openQrCode () { // 二维码
      utils.setDialog(qrcode, {
        imageUrl: this.payInfo.url
      })
    },
    confirm () { // 确认付款
      if (this.item.pay_state !== 0) {
        return
      }
      otcApi.payFinish(this.item.order_id, {
        pay_type: this.formData.pay_type
      }, (msg) => {
        this.item.pay_state = 1
        Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
      }, (msg) => {
        Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
      })
    },
    evaluation () { // 评价
      if (!this.item.order_id || this.item.from_user_comment) {
        return
      }
      otcApi.commentOrder(this.item.order_id, {
        comment_type: this.commentType
      }, (msg) => {
        this.item.from_user_comment = this.commentType
        Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
      }, (msg) => {
        Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
      })
    },
    remarkDialog (item) {
      let rs = (item.remark || '').split('\n')
      Vue.$confirmDialog({
        showCancel: false,
        content: rs
      })
    }
  }
}
</script>

<style scoped>
.undone-detail{display: flex;justify-content:space-between;padding:16px;background-color: #f5f5f5;position: relative;}
.undone-center{display: flex;width: 560px;align-items:center;}
.undone-center > *{padding:0 8px;}
.undone-left{width:464px;display:flex;align-items:center;}
.undone-left span{color:#999;height:40px;line-height:16px;position:relative;flex:1;text-align:center;}
.undone-left span::after{content:" ";display:flex;position:absolute;width:100%;height:4px;background-color:#ccc;left:0;bottom:-2px;}
.undone-left span::before{content:" ";display:flex;position:absolute;z-index:1;width:10px;height:10px;background-color:#ccc;left:calc(50% - 5px);bottom:-5px;border-radius:50%;}
.undone-left span.active{color:#3283FF;}
.undone-left span.active::after,.undone-left span.active::before{background-color:#3283FF;}
.undone-center-buys{color:#23CD09;font-size:14px;font-weight:bold;}
.undone-center-buys p{width:46px;}
.undone-center-number p{color: #666;font-size: 12px;line-height:24px;width:140px;}
.undone-center-number-font{font-size: 16px;font-weight: bold;color:#aeb7d0;}
.undone-center-buys p{line-height:32px;}
.undone-center-adress p{font-size:12px;color: #666;line-height: 22px;white-space:normal;word-break:break-all;max-width:200px;}
.undone-center-adress p em{color:#3283FF;cursor: pointer;}
.undone-center-adress .remark{color:#3283FF;cursor: pointer; }
.undone-right{width:145px;display:flex;flex-flow:column;align-items:center;justify-content:center;}
.undone-right p{color: #23CD09;font-size: 14px;font-weight: bold;line-height:16px;text-align: center;margin-bottom:10px;}
.undone-right a{display: inline-block;min-width: 80px;height: 30px;line-height: 30px;color: #fff;text-align: center;background-color: #3283FF;border-radius: 4px;}
.undone-right a:hover{background-color: #2565c5;}
.undone-right a.disabled{color: #999;background-color: #ccc;cursor: not-allowed;}
.undone-center-type select{color: #666;width:100px;}
.undone-center-type select[disabled]{background-image:none;}
.undone-center-type{line-height:22px;}
.undoneimg img{width:64px;height:64px;cursor:pointer;}
.undone-center-type{color: #aeb7d0;}
.evaluate ul{display: flex;text-align: center;justify-content: space-around;}
.evaluate ul li{width: 70px;cursor: pointer;}
.evaluate ul li em{font-size: 24px;cursor: pointer;}
.evaluate ul li em:hover,
.evaluate ul li em.active{color: #fdb902;}
</style>
