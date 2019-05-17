<template>
    <div ref="withdrawBox" class="withdrawBox" @click="showDropdown=false">
        <div class="koall-verify-all">
            <div class="koall-verify-title">
                <span @click="closeDailog" class="icon-close"></span>
                <p>
                    {{symbol}} {{$t('account.fast_withdraw')}}<!--提现-->
                </p>
            </div>
            <div class="f-fl">
                <div class="filed" v-if="symbol==='USSD'">
                    <em>
                        {{$t('public.account_info')}}<!--账户信息-->：<i class="asterisk">&nbsp;*</i>
                    </em>
                    <div class="bank-info" style="position:relative;">
                        <input type="text" maxlength="100" v-validate="'required'" data-vv-name="bankCountryCode" v-model="userBankInfo.bankCountryCode" :placeholder="$t('public.state_bank')" :class="{error:errors.has('bankCountryCode')}"/>
                        <input type="text" maxlength="100" v-validate="'required'" data-vv-name="bankProvince" v-model="userBankInfo.bankProvince" :placeholder="$t('public.bank_province')" :class="{error:errors.has('bankProvince')}"/>
                        <input type="text" maxlength="100" v-validate="'required'" data-vv-name="bankDistrict" v-model="userBankInfo.bankDistrict" :placeholder="$t('public.bank_area')" :class="{error:errors.has('bankDistrict')}"/>
                        <input type="text" maxlength="100" v-validate="'required'" data-vv-name="bankCode" v-model="userBankInfo.bankCode" :placeholder="$t('public.bank_number')" :class="{error:errors.has('bankCode')}"/>
                        <input type="text" maxlength="100" v-validate="'required'" data-vv-name="bankBranch" v-model="userBankInfo.bankBranch" :placeholder="$t('public.branch_name')" :class="{error:errors.has('bankBranch')}"/>
                        <input type="text" maxlength="100" v-validate="'required'" data-vv-name="bankRealname" v-model="userBankInfo.bankRealname" :placeholder="$t('public.account_name')" :class="{error:errors.has('bankRealname')}"/>
                        <input type="text" maxlength="100" v-validate="'required'" data-vv-name="bankNumber" v-model="userBankInfo.bankNumber" :placeholder="$t('public.bank_account')" :class="{error:errors.has('bankNumber')}"/>
                     
                    </div>
                </div>
                <div class="filed" v-if="symbol!=='SATO' && symbol!=='USSD'">
                    <em>
                        {{$t('account.user_Pick_up_address').format(symbol)}}<!--提现地址-->：<i class="asterisk">&nbsp;*</i>
                    </em>
                    <div class="withAdress" style="position:relative;" :class="{error:errors.has('selToAddress')}">
                        <input type="text" maxlength="100" v-if="!showNewAddress" v-validate="'required'" data-vv-name="selToAddress" v-model="toAddress" :disabled="showNewAddress" :placeholder="$t('public0.public209')"/>
                        <span class="dowml" @click.stop="showDropdown=!showDropdown"></span>
                        <em class="error" v-if="errors.has('selToAddress')">{{this.$t('public0.public44')}}<!--请选择地址或使用新地址--></em>
                        <ul v-show="showDropdown">
                            <li v-if="datas" class="user-addr"  @click.prevent="userSelAddress(datas)">{{datas.alias}} - {{datas.address}}
                                <!--<span class="icon-close" @click.stop="removeAddress(itemIndex,item.id)"></span>-->
                            </li>
                            <li @click="useNewAddress">
                                {{$t('account.user_new_address')}}<!--使用新地址-->
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="filed" v-show="showNewAddress" style="position:relative;">
                    <input class="isAddAddress" type="text" maxlength="15" v-validate="'required'" data-vv-name="alias" :class="{error:errors.has('alias')}" v-model="alias" :placeholder="$t('account.user_Remark_label')" /><!--备注标签-->
                    <span class="joint">-</span>
                    <input class="address" type="text" maxlength="100" v-validate="'required'" data-vv-name="toAddress" :class="{error:errors.has('toAddress')}" v-model="toAddress" :placeholder="$t('account.estimated_value_address')" /><!--地址-->
                    <em class="error" v-if="errors.has('alias') || errors.has('toAddress')">{{$t('public0.public45')}}<!--请输入新地址--></em>
                </div>
                <div class="filed memo" v-if="symbol==='EOS'">
                    <em>
                        {{$t('account.user_center_history_note')}}<!--提现备注-->：
                    </em>
                    <input type="text" maxlength="1000" v-model="memo" :placeholder="'Memo,'+$t('public0.public237')" />
                </div>
                <div class="filed">
                    <div class="filed-number">
                      <em>{{$t('account.user_Draw_the_number')}}<!--提现数量-->：<i class="asterisk">&nbsp;*</i></em>
                      <span>
                          {{$t('account.fast_withdraw_quantity')}}<!--可用余额-->：{{withdrawFastQuantityAvailable}} {{symbol}}
                      </span>
                    </div>
                    <div class="number" :class="{error:errors.has('amount')}">
                        <numberbox v-validate="'required|isLessMin|isMoreMax'" :accuracy="8" data-vv-name="amount" class="numberAll" type="text" v-model="amount" />
                        <a href="javascript:;" @click="allWithdraw">{{$t('account.user_All_cash')}}<!--全部提现--></a>
                    </div>
                    <em class="error" v-if="errors.has('amount')">{{getErrors('amount')}}</em>
                </div>
                <div class="filed">
                    <label></label>
                    <div class="withdraw-info f-cb">
                        <div class="f-fl ng-binding">{{$t('exchange.advanced_fee')}}<!--手续费-->：{{procedureFee}} {{symbol}}</div>
                        <div class="f-fr ng-binding">{{$t('account.user_Actual_arrival')}}<!--实际到账-->：{{lastMount}} {{symbol}}</div>
                    </div>
                </div>
                <div class="filed">
                    <input type="button" class="BNB-subbtn" :value="$t('account.user_submit')" @click="walletWithdraw" /><!--提交-->
                    <span class="large_withdraw" @click="changeWithdraw">{{$t('account.large_withdraw')}}</span>
                </div>
            </div>
            <div class="f-fr">
                <ul class="tips">
                    <li>{{$t('account.user_minimum_number_of_cash').format(`：${minWithdraw} ${symbol}`)}}<!--最小提现数量为{0}。--></li>
                    <li>{{$t('account.fast_withdraw_amount').format(`：${withdrawFastQuantity} ${symbol}`, `${withdrawFastCounts}`)}}<!--24小时快速提现额度为{0}，快速提现次数为 {1}次.--></li>
                    <li v-if="symbol==='USSD'">{{$t('account.user_account_fill_prompt')}}<!--请仔细填写账户信息,填写错误后将无法进行正常转账。--></li>
                    <li>{{$t('public0.public229')}}<!--您可以在充值提现历史记录页面跟踪状态。--></li>
                </ul>
            </div>
       </div>
    </div>
</template>
<script>
import Vue from 'vue'
import userUtils from '@/api/wallet'
import userApi from '@/api/individual'
import myApi from '@/api/user'
import numUtils from '@/assets/js/numberUtils'
import { Validator } from 'vee-validate'
import numberbox from '@/components/formel/numberbox'
import utils from '@/assets/js/utils'
import googleAuth from '@/public/dialog/googleauth'
import smswithdraw from '@/public/dialog/smswithdraw'
export default {
  props: {
    withdrawDalog:{
      type: Function
    },
    symbol: {
      type: String
    },
    symbolType: {
      type: Number
    },
    fromAccount: {
      type: String
    },
    available: {
      type: String
    },
    fromAddress: {
      type: String
    },
    withdrawFastCounts:null,
    withdrawFastQuantity:null,
    withdrawFastQuantityAvailable:null,
    withdrawFastCountsAvailable:null,
    procedure: null,
    minWithdraw: null
  },
  components: {
    numberbox
  },
  data () {
    return {
      mobileState: null,
      fixedNumber: 8,
      datas: {},
      showDropdown: false,
      showNewAddress: false,
      memo:'', //提现备注
      alias: '', // 别名
      amount: '', // 提现金额
      toAddress: '', // 提现地址
      userBankInfo:{
        bankCountryCode:'',
        bankCode:'',
        bankBranch:'',
        bankProvince:'',
        bankDistrict:'',
        bankRealname:'',
        bankNumber:''
      },
      msgs: {
        amount: {required: this.$t('public0.public46')} // 请输入提现金额
      }
    }
  },
  watch: {
    amount (newVal) {
      if (newVal.length > 18) {
        this.$nextTick(() => {
          this.amount = newVal.substring(0, 18)
        })
      }
    },
    'alias' (newVal) {
      if (newVal.length > 15) {
        this.alias = newVal.substring(0, 15)
      }
    },
    'toAddress' (newVal) {
      if (newVal.length > 100) {
        this.toAddress = newVal.substring(0, 100)
      }
    }
  },
  computed: {
    procedureFee () { // 手续费 提现数量-固定手续费
      if(this.symbol==='USSD'){
        return utils.removeEndZero(numUtils.mul(this.amount, 0.05).toFixed(8))
      } else {
        return utils.removeEndZero(numUtils.BN(this.procedure).toFixed(8))
      }
    },
    lastMount () { // 实际到账
      if (this.amount === '' || this.amount === 0) {
        return 0
      } else {
        return utils.removeEndZero(numUtils.minus(this.amount, this.procedureFee).toFixed(8, 1))
      }
    },
    isLessMin () { // 是否小于最小额度
      return numUtils.BN(this.amount).gte(numUtils.BN(this.minWithdraw))
    },
    isMoreMax () { // 是否大于可用余额
      return numUtils.BN(this.amount).lte(numUtils.BN(this.withdrawFastQuantityAvailable))
    }
  },
  created () {
    console.log(this.withdrawFastCounts, this.withdrawFastQuantity)
    this.getUserState()
    this.getBank()
    Validator.extend('isLessMin', {
      getMessage: (field, args) => this.$t('account.user_minimum_number_of_cash').format(`${this.minWithdraw}`),
      validate: (files, args) => {
        return this.isLessMin
      }
    })
    Validator.extend('isMoreMax', {
      getMessage: (field, args) => this.$t('account.input_number_gt_withdraw_quantity'), // 输入数量大于最大可快速提现数量
      validate: (files, args) => {
        return this.isMoreMax
      }
    })
    this.$nextTick(() => {
      userUtils.listWithdraws( // 获取提现地址列表
        this.symbol, (res) => {
          this.datas = res
        }, (msg) => {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
    })
  },
  methods: {
    changeWithdraw(){
      let data = {
        symbol:this.symbol,
        symbolType:this.symbolType,
        availableBalance:this.available,
        procedureFee:this.procedure,
        minWithdraw:this.minWithdraw,
        accountId:this.fromAccount,
      }
      this.withdrawDalog(data)
      this.$emit('okCallback')
      this.$emit('removeDialog')
    },
    getBank(){
      userApi.getBank(data=>{
        this.userBankInfo.bankCountryCode = data.bankCountryCode
        this.userBankInfo.bankCode = data.bankCode
        this.userBankInfo.bankBranch = data.bankBranch
        this.userBankInfo.bankProvince = data.bankProvince
        this.userBankInfo.bankDistrict = data.bankDistrict
        this.userBankInfo.bankRealname = data.bankRealname
        this.userBankInfo.bankNumber = data.bankNumber
      })
    },
    getUserState () {
      // 获取当前用户状态信息
      userApi.getUserState((data) => {
        this.mobileState = data.mobileAuthState
      }, (msg) => {
        console.error(msg)
      })
    },
    toFixed (value, fixed) {
      return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.fixedNumber : fixed)
    },
    getErrors (name) {
      return this.msgs[name][this.errors.firstRule(name)] || this.$t(this.errors.first(name)) || null
    },
    closeDailog () {
      this.$emit('removeDialog')
    },
    removeAddress (itemIndex, id) { // 移除提现地址
      userUtils.removeWithdraws({
        id: id
      }, (msg) => {
        Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
        this.datas.splice(itemIndex, 1)
      }, (msg) => {
        Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
      })
    },
    userSelAddress (item) { // 现在现有地址
      this.toAddress = item.address
      this.showNewAddress = false
      this.showDropdown = false
    },
    useNewAddress () { // 使用新地址
      this.toAddress = ''
      this.showNewAddress = true
      this.showDropdown = false
      this.errors.clear()
    },
    allWithdraw () {
      this.amount = this.withdrawFastQuantityAvailable
    },
    walletWithdraw () { // 提现请求
      let validData = {}
      if (!this.showNewAddress) {
        validData = {
          selToAddress: this.toAddress,
          amount: this.amount
        }
      } else {
        validData = {
          alias: this.alias,
          toAddress: this.toAddress,
          amount: this.amount
        }
      }
      if(this.symbol==='USSD'){
        let userBankInfo = {
          bankCountryCode:this.userBankInfo.bankCountryCode,
          bankCode:this.userBankInfo.bankCode,
          bankBranch:this.userBankInfo.bankBranch,
          bankProvince:this.userBankInfo.bankProvince,
          bankDistrict:this.userBankInfo.bankDistrict,
          bankRealname:this.userBankInfo.bankRealname,
          bankNumber:this.userBankInfo.bankNumber
        }
        validData = Object.assign(validData, userBankInfo)
      }
      this.$validator.validateAll(validData).then((validResult) => {
        if (!validResult) {
          return
        }
      /*  if (this.showNewAddress) {
          userUtils.postWithdraws({ // 保存新地址
            symbol: this.symbol,
            address: this.toAddress,
            alias: this.alias
          })
        } */
        // 二次验证
        utils.setDialog(this.mobileState === 1 ? smswithdraw : googleAuth, {
          authType: 'getCode',
          isWithdrawal: true,
          okCallback: (code) => {
            let formData = { // 提现
              symbol: this.symbol,
              symbolType: this.symbolType,
              amount: this.amount,
              fromAccount: this.fromAccount, // 用户id
              toAddress: this.toAddress,
              alias: this.alias,
              fee: this.procedureFee,
              userBankInfo: this.userBankInfo,
              memo: this.memo,
              withdrawFast: true,
              lang: window.localStorage.getItem('lang') === 'zh-CN' ? 'cn' : 'en'
            }
            let saveFun = () => {
              userUtils.walletWithdraw(formData, () => {
                let msg = typeof code === 'object' && code.type === 1 ? this.$t('message.WITHDRAWALS_SUCCESS') : this.$t('message.WITHDRAWALS_SUCCESS')
                Vue.$koallTipBox({icon: 'success', message: msg}) // 邮件发送成功
                this.$emit('okCallback')
                this.$emit('removeDialog')
              }, (msg) => {
                Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
              })
            }
            if (typeof code === 'string') {
              // 谷歌验证提现
              formData.googleCode = code
              formData.type = 0
              saveFun()
            } else {
              // 手机短信验证提现
              for (let i in code) {
                formData[i] = code[i]
              }
              myApi.getRsaPublicKey((rsaPublicKey) => {
                formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
                formData.rsaPublicKey = rsaPublicKey
                saveFun()
              })
            }
          }
        })
      })
    }
  }
}
</script>
<style scoped>
.large_withdraw {margin-left: 30px; color: #BA8D35; cursor: pointer; font-size: 15px;}
div.error,input.error{border-color: #e53f3f !important;}
em.error{position:absolute;left:0px;bottom:-16px;color: #e53f3f !important;height:18px!important;line-height:18px;font-size:12px!important;}
.withdrawBox { width: 802px; background-color: #fff; border-top-left-radius: 10px; border-top-right-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px #5d5d5d; position: relative;}
.withdrawBox .filed{margin-bottom: 20px;position: relative;margin-left: 22px;height: 40px;height: auto;}
.withdrawBox .filed .joint{color: #283149;}
.withdrawBox .filed em{font-size: 14px; display: inline-block;height: 40px;line-height: 40px;}
.withdrawBox .filed em i.asterisk{position: relative;top: 5px;line-height: 0;font-size: 18px;color: red;}
.withdrawBox .filed label{display: inline-block;font-size: 12px;color: #999; width: 150px;height: 30px;line-height: 30px;text-align: right;position: absolute;left: -25px;top: 0;}
.withdrawBox .filed .withdraw-info{
  display: inline-block;box-sizing: border-box; padding: 0px;width: 100%;height: 30px;line-height: 30px;
  background-color: transparent;font-size: 14px;color: #0b0c0e;
}
.withdrawBox .filed .withdraw-info>div{color: #818fae;}
.withdrawBox .filed .BNB-subbtn{display: inline-block;box-sizing: border-box;vertical-align: middle;width: 180px;height: 40px;line-height: 40px;font-size: 14px;text-align: center;color: #fff;background-color: #BA8D35;border-radius: 4px;cursor: pointer;}
.withdrawBox .filed .BNB-subbtn:hover{background-color: #BA8D35;}
.withdrawBox .filed .withAdress{
  position: relative; color:#999;font-size: 0; width: 500px;height:30px;
  background-color: #FFF;border:1px solid rgba(186,141,53,0.5);
}
.withdrawBox .filed.memo {display: flex; padding-top: 10px; margin-bottom: 5px;}
.withdrawBox .filed.memo em {width: 50px; height: 28px; line-height: 28px;}
.withdrawBox .filed.memo input {flex: 1; height: 28px; border:1px solid #ccc;}
.withAdress span.dowml{position: relative;cursor: pointer; vertical-align: top; width: 29px;height: 30px;border-left: 1px solid transparent; display: inline-block;float:right;}
.withAdress span.dowml:before{content:"";display: inline-block; width: 0px;height: 0px;border-left: 9px solid transparent;border-bottom:9px solid transparent;border-right:9px solid transparent;border-top: 9px solid #aeb7d0;position: absolute;top:10px;left:5px;}
.withAdress span.dowml:hover:before{border-top-color: #BA8D35;}
.withAdress input{color: #333; width: 452px;padding-left: 12px;padding-right: 6px;background-color: transparent;height: 30px;}
.withAdress ul{position: absolute;z-index: 22;width: 500px;top: 30px;left: -1px;border: 1px solid #283149;}
.withAdress ul li{height: 30px;line-height: 30px;font-size: 12px;color: #fff;text-indent: 12px;background-color: #BA8D35;cursor: pointer;}
.withAdress ul li:hover{background-color: #BA8D35;}
.withAdress ul li span{font-size: 16px;position: absolute; right: 7px;top: 8px;cursor: pointer;}
.withAdress ul li img{width: 16px;height: 16px;vertical-align: middle;}
.withdrawBox .fee{margin-bottom: -10px;}
.tixian{margin-bottom: 5px;height: 30px;}
.isAddAddress{width:130px;box-sizing: border-box;height: 30px;padding-left: 12px;padding-right: 12px;line-height: 28px;
  color: #261003;background-color:transparent; border: 1px solid #ccc;}
.address{width: 357px;box-sizing: border-box;height: 30px;padding-left: 12px;padding-right: 12px;line-height: 28px;
  color: #261003;background-color:transparent; border: 1px solid #ccc;}
.number {
  position: relative; box-sizing: border-box;width: 502px;height: 30px;padding: 0 12px;
  border: 1px solid rgba(186,141,53,0.5);color: #aeb7d0;margin-top: 0px;text-align: right;line-height: 30px;
  background:#FFF;
}
.bank-info {position: relative; box-sizing: border-box;width: 502px; text-align: right; 
  background:#FFF; display: flex; flex-wrap: wrap;}
.bank-info input {border: 1px solid rgba(186,141,53,0.5); color: #333; padding: 0 10px; margin-bottom: 10px; margin-right: 25px; height:30px; line-height: 30px; width: 150px; box-sizing: border-box;}
.bank-info input:nth-of-type(3n){margin-right: 0;}
.bank-info input:last-of-type{width: 502px; margin-right: 0; margin-bottom: 0;}
.number a{color: #BA8D35;}
.number a:hover{color: #BA8D35;}
.number .numberAll{
  position: absolute;left: 0;width: 408px;height: 28px;padding-left: 12px;padding-right: 12px;line-height: 28px;
  color: #333;background-color:transparent;
}
.withdrawBox:after{content:".";display:block;clear:both;visibility:hidden;height:0;}
.withdrawBox .tips{width: 226px;margin-top:18px;}
.withdrawBox .tips li{line-height:1.5;list-style-type:square;font-size:14px;color:#666;padding:5px 0;border:none;width: 190px;}
.withdrawBox .tips li a{color: #aeb7d0;text-decoration: underline;font-size: 14px;}
/* .koall-verify-title{width: 100%;height: 16px;line-height: 16px;margin-top: 2px;} */
.koall-verify-title{position: relative;}
.koall-verify-title p{height: 50px;line-height: 50px;color: #fff;font-size: 20px;  text-align: center;background-color: #BA8D35;}
.koall-verify-title span{position:absolute;text-decoration:none;font-size:16px;color:#fff;top:17px;right:15px; opacity: 0.8; cursor: pointer;}
.koall-verify-title span:hover{opacity: 1;}
.koall-verify-all{display: block;width: 100%;}
.filed-number{display: flex;justify-content: space-between;}
.filed-number span{line-height: 30px;color: #999;}
input::-webkit-input-placeholder { /* WebKit browsers */color:#818fae;}
input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */color:#818fae;}
input::-moz-placeholder { /* Mozilla Firefox 19+ */color:#818fae;}
input:-ms-input-placeholder { /* Internet Explorer 10+ */color:#818fae;}
</style>
