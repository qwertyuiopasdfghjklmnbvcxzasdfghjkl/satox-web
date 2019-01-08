<template>
    <div class="undone-detail">
        <div class="undone-left">
            <span :class="{active:step>=0}">
                1.{{$t('public0.public143')}}
                <!--新建交易-->
            </span>
            <span :class="{active:step>=1}">
                2.{{$t('public0.public150')}}
                <!--等待付款-->
            </span>
            <span :class="{active:step>=2}">
                3.{{$t('otc_ad.otc_ad_prompt8')}}
                <!--释放货币-->
            </span>
            <span :class="{active:step>=3}">
                4.{{$t('public0.public146')}}
                <!--完成交易-->
            </span>
        </div>
        <div class="undone-center" v-if="item.state === 1">
            <div class="undone-center-sells">
                <p>{{$t('otc_exchange.otc_exchange_sell')}}</p>
                <p>{{item.symbol}}</p>
            </div>
            <div class="undone-center-number">
                <p class="undone-center-number-font">{{item.total_price}} {{item.currency}}</p>
                <p>{{$t(params.ad_type==2?'otc_exchange.otc_exchange_ask':'otc_exchange.otc_exchange_bid')}}
                    <!--单价-->{{item.cur_price}} {{item.currency}}</p>
                <p>{{$t('exchange.exchange_amount')}} {{item.symbol_count}} {{item.symbol}}</p>
            </div>
            <div class="undone-center-type">
              <p>{{payTypeTitle}}</p>
            </div>
            <div class="undone-center-adress">
                <p>{{$t('public0.public28')}}<!--耐心等待买家付款--></p>
                <p>{{$t('public0.public29')}}<!--确认付款后，请尽快放币--></p>
            </div>
        </div>
        <div class="undone-center" v-if="item.state === 2">
            <div class="undone-center-sells">
                <p>{{$t('otc_exchange.otc_exchange_sell')}}</p>
                <p>{{item.symbol}}</p>
            </div>
            <div class="undone-center-type" v-if="!item.to_user_comment">
                {{$t('otc_ad.otc_ad_prompt9')}}
            </div>
            <div class="undone-center-adress">
                <div class="evaluate" >
                    <ul>
                        <li @click="commentType=1" v-if="!item.to_user_comment || item.to_user_comment === 1">
                            <em class="icon-praise" :class="{active:commentType===1}"></em>
                            <p>{{$t('otc_ad.otc_ad_Praise')}}<!--好评--></p>
                        </li>
                        <li @click="commentType=2" v-if="!item.to_user_comment ||item.to_user_comment === 2">
                            <em class="icon-average" :class="{active:commentType===2}"></em>
                            <p>{{$t('otc_ad.otc_ad_Average')}}<!--中评--></p>
                        </li>
                        <li @click="commentType=3" v-if="!item.to_user_comment || item.to_user_comment === 3">
                            <em class="icon-bad-review" :class="{active:commentType===3}"></em>
                            <p>{{$t('otc_ad.otc_ad_Bad_review')}}<!--差评--></p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="undone-right">
            <p>{{stateTitle}}</p>
            <a href="javascript:;" v-if="item.state === 1" :class="{disabled:item.state === 1 && item.pay_state === 0}" @click="confirm">{{$t('otc_ad.otc_ad_prompt8')}}<!--释放货币--></a>
            <a href="javascript:;" v-if="item.state === 2" :class="{disabled:item.to_user_comment}" @click="evaluation">{{$t('otc_ad.otc_ad_confirm')}}<!--确认--></a>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import otcApi from '@/api/otc'
export default {
  props: ['item'],
  data () {
    return {
      datas: [],
      commentType: 1,
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
    payTypeTitle () {
      if (this.item.pay_type === 1) {
        return this.$t('otc_ad.otc_ad_BankPay')
      } else if (this.item.pay_type === 2) {
        return this.$t('otc_ad.otc_ad_Alipay_pay')
      } else if (this.item.pay_type === 3) {
        return this.$t('otc_ad.otc_ad_WeChatPay')
      } else {
        return null
      }
    },
    stateTitle () {
      if (this.item.state === 2) {
        return this.$t('public0.public146')
      } else if (this.item.pay_state === 0) {
        return this.$t('public0.public150')
      } else if (this.item.pay_state === 1) {
        return this.$t('otc_ad.otc_ad_prompt8')
      } else {
        return null
      }
    }
  },
  methods: {
    ...mapActions(['tiggerEvents']),
    confirm () {
      if (this.item.state === 1 && this.item.pay_state === 0) {
        return
      }
      Vue.$confirmDialog({
        color: '#e53f3f',
        title: this.$t('otc_ad.otc_ad_confirm'),
        content: this.$t('public0.public288'),
        autoClose: true,
        okCallback: () => {
          Vue.$confirmDialog({
            color: '#e53f3f',
            title: this.$t('otc_ad.otc_ad_confirm'),
            content: this.$t('public0.public289'),
            autoClose: true,
            okCallback: () => {
              otcApi.finishOrder(this.item.order_id, (msg) => {
                this.item.state = 2
                this.tiggerEvents({
                  name: 'chatEvent',
                  params: {
                    type: 'markReadOnly',
                    orderNumber: this.item.order_number
                  }
                })
                this.tiggerEvents({
                  name: 'updateWallet'
                })
                this.tiggerEvents({
                  name: 'updateMyAds'
                })
                Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
              }, (msg) => {
                Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
              })
            }
          })
        }
      })
    },
    evaluation () { // 评价
      if (!this.item.order_id || this.item.to_user_comment) {
        return
      }
      otcApi.commentOrder(this.item.order_id, {
        comment_type: this.commentType
      }, (msg) => {
        this.item.to_user_comment = this.commentType
        Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
      }, (msg) => {
        Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
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
.undone-center-sells{color:#F34246;font-size:14px;font-weight:bold;}
.undone-center-sells p{line-height:32px;width:46px;}

.undone-center-number p{color: #666;font-size: 12px;line-height:24px;width:140px;}
.undone-center-number-font{font-size: 16px;font-weight: bold;color:#aeb7d0;}
.undone-center-buys p{line-height:32px;}
.undone-center-adress{font-size:12px;color: #666;line-height: 22px;}
.undone-right{width:145px;display:flex;flex-flow:column;align-items:center;justify-content:center;}
.undone-right p{color: #F34246;font-size: 14px;font-weight: bold;line-height:16px;text-align: center;margin-bottom:10px;}
.undone-right a{display: inline-block;min-width: 80px;height: 30px;line-height: 30px;color: #fff;text-align: center;background-color: #3283FF;border-radius: 4px;}
.undone-right a:hover{background-color: #2565c5;}
.undone-right a.disabled{color: #999;background-color: #ccc;cursor: not-allowed;}

.undone-center-type{line-height:22px;color:#aeb7d0;}
.undone-center-type p{width:100px;}
.evaluate ul{display: flex;text-align: center;justify-content: space-around;}
.evaluate ul li{width: 70px;cursor: pointer;}
.evaluate ul li em{font-size: 24px;cursor: pointer;}
.evaluate ul li em:hover,
.evaluate ul li em.active{color: #fdb902;}


</style>
