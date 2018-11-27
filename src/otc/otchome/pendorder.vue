<template>
  <div class="pendorder">
      <div class="pendorder-title">
          <span class="quantity">
            <i class="icon-my"></i>
            <em>{{$t('otc_exchange.otc_exchange_frequency')}}<!--交易次数-->：{{baseInfo.tradeCount}}</em>
          </span>
          <span class="praise">
            <label>{{$t('otc_ad.otc_ad_Praise')}}<!--好评-->：</label>
            <em>{{Math.floor(baseInfo.praiseRate)}}%</em>
          </span>
          <span class="type">
            <i :class="[`icon-${params.symbol.toLowerCase()}`]"></i>
            <em>{{params.symbol}}</em>
          </span>
          <span class="available">
            <label>{{$t('account.estimated_value_available')}}<!--可用余额-->：</label>
            <em>{{baseInfo.availableBalance}}</em>
          </span>
          <span class="freeze">
            <label>{{$t('public0.public34')}}<!--冻结-->：</label>
            <em>{{baseInfo.frozenBalance}}</em>
          </span>
          <span class="operate">
            <a class="notice" href="javascript:;" @click="isShowNotice = !isShowNotice">{{$t('otc_ad.otc_trade_tips')}}<!--交易须知--></a>
            <a class="werben" href="javascript:;" @click="createorder">{{$t('otc_ad.otc_post_ad')}}<!--发布广告--></a>
          </span>
      </div>
      <div class="notice-dialog" v-show="isShowNotice">
        <div class="notice-dialog-container">
          <a class="notice-dialog-close icon-close" href="javascript:;" @click="isShowNotice = false"></a>
          <div class="notice-dialog-cont">
            <p><span>1.</span>{{$t('otc_ad.otc_trade_notice1')}}<!--取消订单超过3笔将禁止1天OTC交易。--></p>
            <p><span>2.</span>{{$t('otc_ad.otc_trade_notice2')}}<!--当您需要离开电脑一段时间时，请下架您的广告，以免受到用户申诉。--></p>
            <p><span>3.</span>{{$t('otc_ad.otc_trade_notice3')}}<!--下单买入后冒充已付款，卖方可申诉举报，一经查实将封禁交易。--></p>
            <p><span>4.</span>{{$t('otc_ad.otc_trade_notice4')}}<!--收款时请仔细核实，买方的付款账户实名信息与平台实名信息是否一致。卖方收到的资金非买方本人转账，请卖方原路退回。--></p>
            <p><span>5.</span>{{$t('otc_ad.otc_trade_notice5')}}<!--已取消订单，如已付款，请及时申诉，上传付款证明等资料，说明情况。--></p>
            <p><span>6.</span>{{$t('otc_ad.otc_trade_notice6')}}<!--转账时请勿备注任何信息，以免付款被拦截。--></p>
            <p><span>7.</span>{{$t('otc_ad.otc_trade_notice7')}}<!--卖方一定要及时查看账户，并确保对方付款到账后再释放代币，否则将造成不可挽回的损失。--></p>
            <p><span>8.</span>{{$t('otc_ad.otc_trade_notice8')}}<!--更详细的交易规范请查看：--><a href="https://newtonexchange.zendesk.com/hc/zh-cn/articles/360015363071-OTC%E4%BA%A4%E6%98%93%E8%A7%84%E8%8C%83?tdsourcetag=s_pcqq_aiomsg" target="_blank">{{$t('otc_ad.otc_trade_specification')}}<!--OTC交易规范--></a></p>
          </div>
        </div>
      </div>
      <ul class="list">
          <li class="list-title" v-if="!loading && datas.length>0">
              <span class="name">
                <em>{{$t('otc_exchange.otc_exchange_username')}}<!--用户名--></em>
                <div class="tips">
                  <span class="tips-container">
                    <i class="tips-icon">?</i>
                    <em class="tips-text">{{$t('otc_ad.otc_ad_only_online')}}<!--仅展示在线用户--></em>
                  </span>
                </div>
              </span>
              <span class="trust">{{$t('otc_exchange.otc_exchange_credit')}}<!--信用--></span>
              <span class="paytype">{{$t('otc_ad.otc_ad_Payment_method')}}<!--支付方式--></span>
              <span class="limit">{{$t('otc_exchange.otc_exchange_Trading_limits')}}<!--交易限额--></span>
              <span class="price">{{$t(params.ad_type==2?'otc_exchange.otc_exchange_ask':'otc_exchange.otc_exchange_bid')}}<!--单价--></span>
              <span class="lave">{{$t('message.msg_surplus')}}<!--剩余--></span>
          </li>
          <li class="list-item" v-for="data in datas" :key="data.ad_id">
              <span class="name">
                  <img :src="data.header_image||avatarUrl" />
                  <em :title="data.nickname||data.username">{{data.nickname||data.username}}</em>
              </span>
              <span class="trust">
                  <p :title="$t('otc_exchange.otc_exchange_transactions_completed2').format(`${data.score||0}`)">{{$t('otc_exchange.otc_exchange_transactions_completed2').format(`${data.score||0}`)}}<!--交易多少笔--></p>
                  <p>{{$t('otc_ad.otc_ad_Praise')}}<!--好评-->：{{Math.floor(data.user_level||0)}}%</p>
              </span>
              <span class="paytype">
                  <em class="wechat icon-paypal" :title="$t('public0.public219')" v-if="(data.pay_type||'').indexOf('4')!==-1"></em><!--PayPal支付-->
                  <em class="wechat icon-wechat" :title="$t('otc_ad.otc_ad_WeChatPay')" v-if="(data.pay_type||'').indexOf('3')!==-1"></em><!--微信支付-->
                  <em class="zfb icon-alipay" :title="$t('otc_ad.otc_ad_Alipay_pay')" v-if="(data.pay_type||'').indexOf('2')!==-1"></em><!--支付宝支付-->
                  <em class="card icon-bank" :title="$t('otc_ad.otc_ad_BankPay')" v-if="(data.pay_type||'').indexOf('1')!==-1"></em><!--银行卡支付-->
              </span>
              <span class="limit">
                  <p :title="data.min_amount + ' - ' + data.max_amount">{{data.min_amount}} - {{data.max_amount}}</p>
                  <p>{{buyType?data.currency:data.symbol}}</p>
              </span>
              <span class="price">
                  <p :title="data.cur_price||0">{{data.cur_price||0}}</p>
                  <p>{{data.currency}}</p>
              </span>
              <span class="lave">
                  <p :title="data.remain_count||0">{{data.remain_count||0}}</p>
                  <p>{{data.symbol}}</p>
              </span>
              <span class="operation">
                  <a href="javascript:;" :class="[sellType ? 'sell' : 'buy', getUserInfo.username === data.username ? 'disabled' : '']" @click="getUserInfo.username === data.username ? false : sell(data)">{{tradeParams.tradeTxt}}</a>
              </span>
          </li>
          <li class="list-page" v-if="!loading && datas.length>0">
              <page :pageIndex="params.page" :pageSize="params.show" :total="params.total" @changePageIndex="pageChange"/>
          </li>
          <li class="list-nodata" v-if="!loading && datas.length===0">
              <div class="nd-icon icon-no-order"></div>
              <div class="nd-text">{{$t('public0.public147')}}<!--暂无广告--></div>
          </li>
          <li class="list-loading" v-if="loading">
            <loading/>
          </li>
      </ul>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import otcApi from '@/api/otc'
import utils from '@/assets/js/utils'
import numUtils from '@/assets/js/numberUtils'
import page from '@/components/page'
import loading from '@/components/loading'
import createorder from '@/otc/otchome/createorder'
import buy from '@/otc/otchome/buy'
import avatar from '@/assets/images/touxiang.png'
export default {
  props: ['params'],
  components: {
    page,
    loading
  },
  data () {
    return {
      loading: true,
      datas: [],
      baseInfo: {
        tradeCount: 0,
        praiseRate: 0,
        availableBalance: 0,
        frozenBalance: 0
      },
      isShowNotice: false,
      avatarUrl: avatar,
      matchPayType: null,
      isAdParamsChange: false
    }
  },
  computed: {
    ...mapGetters(['getApiToken', 'getUserInfo', 'getLang']),
    paramsChange () {
      return {
        ad_type: this.params.ad_type,
        symbol: this.params.symbol,
        currency: this.params.currency,
        pay_type: this.params.pay_type || null,
        sort_mode: this.params.sort_mode === 2 ? 2 : (this.params.ad_type === 2 ? 1 : 3), // 广告排序：1价格升序，2信用降序，3价格降序
        page: this.params.page,
        show: this.params.show
      }
    },
    adParams () {
      return {
        symbol: this.params.symbol,
        currency: this.params.currency,
        ad_type: this.params.ad_type
      }
    },
    buyType () { // 卖的广告是买
      return this.params.ad_type === 2
    },
    sellType () { // 买的广告是卖
      return this.params.ad_type === 1
    },
    tradeParams () {
      if (this.buyType) {
        return {
          tradeTxt: this.$t('otc_exchange.otc_exchange_buy'), // 购买
          priceTxt: this.$t('otc_exchange.otc_exchange_lowestPrice_sort'), // 以价格最低排序
          sortTxt: '↓'
        }
      } else if (this.sellType) {
        return {
          tradeTxt: this.$t('otc_exchange.otc_exchange_sell'), // 出售
          priceTxt: this.$t('otc_exchange.otc_exchange_highestPrice_sort'), // 以价格最高排序
          sortTxt: '↑'
        }
      }
    }
  },
  watch: {
    adParams () {
      if (this.params.page !== 1) {
        this.isAdParamsChange = true
        this.params.page = 1
      }
      this.init()
    },
    getApiToken () {
      this.init()
    },
    'params.newAdCount' () {
      this.init()
    },
    'params.page' () {
      if (!this.isAdParamsChange) {
        this.getList()
      }
      this.isAdParamsChange = false
    }
  },
  created () {
    this.init()
    this.$nextTick(() => {
      this.addEvents({
        name: 'updateWallet',
        fun: this.getBaseInfo
      })
    })
    this.addOtcSocketEvent(this.systemEvent)
  },
  beforeDestroy () {
    this.removeEvents('updateWallet')
    this.removeOtcSocketEvent(this.systemEvent)
  },
  methods: {
    ...mapActions(['addOtcSocketEvent', 'removeOtcSocketEvent', 'addEvents', 'removeEvents']),
    init () {
      this.getList()
      this.getBaseInfo()
    },
    systemEvent (data) {
      let optType = parseInt(data.operate_type)
      let childType = parseInt(data.child_type)
      if (optType === 1) { // 系统消息
        switch (childType) {
          case 35: // 正常放币消息
          case 36: // 强制放币买家消息
          case 37: // 强制放币卖家消息
            // 更新用户OTC基本交易信息
            if (this.params.symbol === JSON.parse(data.link).symbol) {
              this.getBaseInfo()
            }
            break
        }
      }
    },
    checkSetState (successCallback, message, isCheckPaySet, isCheckPayType, id) {
      if (!this.getApiToken) {
        Vue.$koallTipBox({icon: 'notification', message: this.$t(message)}) // 请登录后再发布广告||请登录后再交易
        return
      }
      otcApi.getVerifyState((msg) => {
        if (isCheckPaySet) {
          otcApi.getPaySettings((res) => {
            if (isCheckPayType) {
              otcApi.matchPayTypes(id, (data2) => {
                this.matchPayType = data2
                successCallback && successCallback()
              }, (msg3) => {
                if (msg3 === 'PAY_TYPE_UNMATCH') {
                  Vue.$confirmDialog({
                    id: 'PAY_TYPE_UNMATCH',
                    content: this.$t('error_code.PAY_TYPE_UNMATCH'), // 支付方式不匹配，请设置对应的支付方式
                    okCallback: () => {
                      this.$emit('goToSettings')
                      this.$emit('removeDialog')
                    }
                  })
                } else {
                  Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg3}`)})
                }
              })
            } else {
              successCallback && successCallback(res.data.pay_type)
            }
          }, (res) => {
            if (res.msg === 'NO_PAY_TYPE') {
              Vue.$confirmDialog({
                id: 'NO_PAY_TYPE',
                content: this.$t('error_code.SET_PAY_TYPE_FIRST'), // 请先设置支付方式
                okCallback: () => {
                  this.$emit('goToSettings')
                  this.$emit('removeDialog')
                }
              })
            } else {
              Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
            }
          })
        } else {
          successCallback && successCallback()
        }
      }, (msg) => {
        if (msg === 'KYC_AUTH_FIRST') {
          Vue.$confirmDialog({
            id: 'KYC_AUTH_FIRST',
            content: this.$t('error_code.KYC_AUTH_FIRST'), // 请先完成实名验证
            okCallback: () => {
              this.$emit('goToMyCenter')
              this.$emit('removeDialog')
            }
          })
        } else {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        }
      })
    },
    createorder () {
      this.checkSetState((myPayType) => {
        utils.setDialog(createorder, {
          id: 'dialog_createorder',
          myPayType: myPayType,
          params: this.params,
          okCallback: () => {
          },
          errCallback: () => {
          }
        })
      }, 'public0.public109', true, false)
    },
    sell (data) {
      let isCheckPaySet = parseInt(data.ad_type) === 1
      this.matchPayType = parseInt(data.ad_type) === 1 ? void 0 : data.pay_type

      this.checkSetState(() => {
        if (this.getUserInfo.username === data.username) {
          return
        }
        utils.setDialog(buy, {
          id: 'create_order_dialog',
          params: this.params,
          ad_id: data.ad_id,
          matchPayType: this.matchPayType,
          okCallback: (id) => {
            this.getList()
            this.$emit('createNewOrder', id)
          },
          errCallback: () => {
          }
        })
      }, 'public0.public15', isCheckPaySet, true, data.ad_id)
    },
    pageChange (currentIndex) {
      this.params.page = currentIndex
    },
    getList () { // 获取广告列表
      this.datas = []
      this.loading = true
      otcApi.getAdvertisementList(this.paramsChange, (res) => {
        res.data.forEach((item) => { // 广告列表数据格式化处理
          item.cur_price = item.cur_price ? utils.removeEndZero(parseFloat(item.cur_price).toFixed(2)) : 0
          if (this.params.ad_type === 2) {
            item.min_amount = utils.removeEndZero(parseFloat(item.min_amount).toFixed(2))
            item.max_amount = utils.removeEndZero(parseFloat(item.max_amount).toFixed(2))
          } else {
            item.min_amount = utils.removeEndZero(numUtils.BN(item.min_amount).toFixed(8))
            item.max_amount = utils.removeEndZero(numUtils.BN(item.max_amount).toFixed(8))
          }
          item.remain_count = utils.removeEndZero(numUtils.BN(item.remain_count).toFixed(8))
        })
        this.datas = res.data
        this.params.total = res.total
        this.loading = false
      }, (msg) => {
        this.loading = false
        console.error(msg)
      })
    },
    getBaseInfo () { // 获取用户OTC基本交易信息
      if (!this.getApiToken) {
        this.baseInfo = {
          tradeCount: 0,
          praiseRate: 0,
          availableBalance: 0,
          frozenBalance: 0
        }
        return
      }
      otcApi.getBaseInfo(this.paramsChange.symbol, (data) => {
        this.baseInfo = {
          tradeCount: data.tradeCount,
          praiseRate: data.praiseRate,
          availableBalance: utils.removeEndZero(numUtils.BN(data.availableBalance).toFixed(8)),
          frozenBalance: utils.removeEndZero(numUtils.BN(data.frozenBalance).toFixed(8))
        }
      }, (msg) => {
        console.error(msg)
      })
    }
  }
}
</script>
<style scoped>
.pendorder{position: relative;display:flex;flex-direction:column;flex:1;}
.pendorder-title{display: flex;justify-content: space-between;align-items: center;height: 50px;padding-left: 16px;padding-right: 16px;margin-bottom: 8px;background-color: ##222121;}
.pendorder-title span{font-size: 12px;color: #aeb7d0;}
.pendorder-title span.quantity,
.pendorder-title span.type,
.pendorder-title span.available,
.pendorder-title span.freeze,
.pendorder-title span.operate{display: flex;}
.pendorder-title span.quantity{align-items: center;}
.pendorder-title span.quantity i{padding-right: 8px;font-size: 16px;}
.pendorder-title span.type{align-items: center;font-weight: bold;font-size: 14px;}
.pendorder-title span.type i{padding-right: 8px;font-size: 16px;}
.pendorder-title span.available,
.pendorder-title span.freeze {align-items: flex-start;}
.pendorder-title span.available em,
.pendorder-title span.freeze em{max-width: 123px;word-wrap: break-word;}
.pendorder-title span.transfer{width: 55px;}
.pendorder-title span.operate{align-items: center;}
.pendorder-title span.operate .notice{margin-right: 24px;font-size: 12px;color: #fdb902;}
.pendorder-title span.operate .notice:hover{color: #fdb902;}
.pendorder-title span.operate .werben{width: 84px;height: 22px;line-height: 22px;font-size: 12px;text-align: center;color: #fdb902;border: 1px solid #fdb902;border-radius: 4px;}
.pendorder-title span.operate .werben:hover{color: #fdb902;border-color: #fdb902;}

.notice-dialog{position: absolute;top: 58px;right: 0;bottom: 0;left: 0;z-index: 2;display: flex;justify-content: center;align-items: center;background-color: rgba(0, 0, 0, 0.5);}
.notice-dialog-container{position: relative;width: 732px;padding: 12px 24px;background-color: #222121;border-radius: 4px;}
.notice-dialog-close{position: absolute;top: 10px;right: 10px;}
.notice-dialog-close:hover{color: #fdb902;}
.notice-dialog-cont p{min-height: 24px;padding: 12px 0 12px 24px;line-height: 24px;color: #ececec;}
.notice-dialog-cont p span{display: inline-block;width: 24px;height: 24px;margin-left: -24px;line-height: 24px;vertical-align: top;}
.notice-dialog-cont p a{color: #fdb902;text-decoration: underline;}
.notice-dialog-cont p a:hover{color: #fdb902;}

.list{min-height: 540px;background-color: #222121;flex:1;}
.list li{display: flex;}
.list-title{align-items: center;height: 24px;padding-left: 20px;padding-right: 20px;border-bottom: 1px solid #404b69;}
.list-title span{font-size: 12px;color: #8b94a9;}
.list-title span.name{width: 140px;font-size: 0;}
.list-title span.trust{width: 130px;}
.list-title span.paytype{width: 120px;}
.list-title span.limit{width: 160px;}
.list-title span.price{width: 130px;}
.list-title span.lave{width: 120px;}
.list-title span.name em{font-size: 12px;}
.list-title span.name .tips{display: inline-block;margin-top: 2px;margin-left: 6px;vertical-align: top;}
.list-title span.name .tips-container{display: flex;justify-content: center;position: relative;z-index: 1;width: 12px;height: 12px;}
.list-title span.name .tips-icon{width: 12px;height: 12px;font-weight: bold;font-size: 12px;line-height: 12px;color: #181b2a;text-align: center;background-color: #fff;border-radius: 50%;cursor: help;}
.list-title span.name .tips-text{display: none;position: absolute;top: -30px;height: 24px;padding-left: 12px;padding-right: 12px;font-size: 12px;line-height: 24px;color: #181b2a;white-space: nowrap;background-color: #fff;border-radius: 4px;}
.list-title span.name .tips-text:before{content: "";position: absolute;bottom: -6px;left: 50%;width: 0;height: 0;margin-left: -6px;border-width: 6px 6px 0 6px;border-style: solid;border-color: #fff transparent transparent transparent;}
.list-title span.name .tips-icon:hover + .tips-text{display: block;}

.list-item{align-items: center;height: 62px;padding-left: 20px;padding-right: 20px;border-bottom: 1px solid #fff;}
.list-item:nth-of-type(odd){background-color: #333232;border-bottom-color: #333232;}
.list-item:nth-of-type(even){background-color: #222121;border-bottom-color: #222121;}
.list-item span{margin-right: 20px;}
.list-item span.name{display: flex;align-items: center;width: 120px;}
.list-item span.trust{width: 110px;}
.list-item span.paytype{width: 100px;}
.list-item span.limit{width: 140px;}
.list-item span.price{width: 110px;}
.list-item span.lave{width: 100px;}
.list-item span.operation{width: 52px;margin-right: 0;}
.list-item span p{height: 24px;line-height: 24px;}
.list-item span p:first-of-type{font-size: 14px;color: #ececec;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
.list-item span p:last-of-type{font-size: 12px;color: #aeb7d0;}
.list-item span.name img{width: 28px;height: 28px;border:1px solid #fdb902;border-radius: 50%;}
.list-item span.name em{width: 88px;font-size: 14px;color: #ececec;white-space: nowrap;text-indent: 10px;text-overflow: ellipsis;overflow: hidden;}
.list-item span.paytype{display: flex;line-height: 0;}
.list-item span.paytype em{margin-left: 10px;font-size: 16px;color: #fff;}
.list-item span.paytype em:first-of-type{margin-left: 0;}
.list-item span.operation a{display: block;width: 50px;height: 22px;line-height: 22px;font-size: 12px;text-align: center;border: 1px solid #fff;border-radius: 4px;}
.list-item span.operation a.buy{color: #0ee7a5;border-color: #0ee7a5;}
.list-item span.operation a.buy:hover{color: #0ee7a5;border-color: #0ee7a5;}
.list-item span.operation a.sell{color: #ff7342;border-color: #ff7342;}
.list-item span.operation a.sell:hover{color: #ff7342;border-color: #ff7342;}
.list-item span.operation a.disabled{color: #959eb7;border-color: #959eb7;cursor: not-allowed;}
.list-item span.operation a.disabled:hover{color: #959eb7;border-color: #959eb7;}
.list li.list-page{display: block}
.list li.list-nodata{display: block;text-align: center;}
.list li.list-nodata .nd-icon{height: 80px;line-height: 80px;font-size: 40px;color: #8b94a9;}
.list li.list-nodata .nd-text{height: 40px;line-height: 20px;color: #8b94a9;}
.list li.list-loading{display: block;}
</style>

