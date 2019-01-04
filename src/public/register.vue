<template>
    <div class="login">
        <div class="login-container">
            <div class="login-left">
            </div>
            <div class="login-right">
                <div class="login-right-item item-register">
                    <div class="item-registerType">
                      <label :class="{checked:formData.registerType==1}">
                        <span>
                          <input type="radio" v-model="formData.registerType" value="1"/>
                        </span>
                        {{$t('login_register.register_by_cellphone')}}<!--手机注册-->
                      </label>
                      <label :class="{checked:formData.registerType==0}">
                        <span>
                          <input type="radio" v-model="formData.registerType" value="0"/>
                        </span>
                        {{$t('login_register.register_by_email')}}<!--邮箱注册-->
                      </label>
                    </div>
                    <template v-if="formData.registerType==1">
                      <div class="mobile">
                        <select v-model="formData.countryCode">
                          <option v-for="item in areaCodeList" :value="item.code">{{$t(item.key)}}&nbsp;{{item.code}}</option>
                        </select>
                        <inputbox name="mobile" :maxLength="255" v-model="formData.mobile" v-validate="'required|telphone'" :msgs="msgs.mobile" :errs="errors" :placeholder="$t('public0.public6')"/><!--手机号-->
                      </div>
                      <div class="smsCode">
                        <inputbox name="smsCode" :maxLength="6" v-model="formData.smsCode" v-validate="'required|pInteger'" :msgs="msgs.smsCode" :errs="errors" :title="$t('account.user_center_SMS_code')" :placeholder="$t('login_register.verify_code')"/><!--短信验证码-->
                        <a href="javascript:;" :class="{disabled:btnDisabled}" @click="sendSMSCode">{{$t('account.user_center_send_SMS')}}<!--发送验证码-->{{disabled ? `（${time}s）` : ''}}</a>
                      </div>
                    </template>
                    <template v-if="formData.registerType==0">
                      <inputbox name="email" :maxLength="255" v-model="formData.email" v-validate="'required|email'" :msgs="msgs.email" :errs="errors" :title="$t('otc_exchange.otc_exchange_Email')" :placeholder="$t('login_register.email')"/><!--邮箱-->
                    </template>
                    <inputbox id="CDCC-password" type="password" name="password" v-model="formData.password" v-validate="'required|password'" :msgs="msgs.password" :errs="errors" :title="$t('exchange.exchange_password')" :placeholder="$t('login_register.password')"/><!--密码-->
                    <inputbox type="password" name="passwordConfirm" v-model="formData.passwordConfirm" v-validate="'required|passwordAgain'" :msgs="msgs.passwordConfirm" :errs="errors" :title="$t('login_register.confirm_password')" :placeholder="$t('login_register.password')"/><!--确认密码-->
                    <inputbox class="ref" name="ref" :maxLength="255" v-model="formData.ref" :title="$t('public0.public244')" :placeholder="$t('public0.public237')"/><!--邀请码-->
                    <div class="checkbox-group">
                        <i :class="[checked?'icon-checkbox-checked':'icon-checkbox-unchecked']" @click="checked=!checked"></i>
                        <span>
                          <em @click="checked=!checked">{{$t('login_register.agree_Service')}}<!--我已阅读并同意--></em>
                          <a :href="getAgreementUrl" target="_blank">{{$t('login_register.bitark_service').format('CDCC')}}<!--CDCC服务条款--></a>
                        </span>
                    </div>
                    <div class="button-group">
                        <buttonbox :class="{disabled:locked||gtLocked}" :text="$t('login_register.register')" @click="register"/><!--注册-->
                        <div class="link">
                            <a href="javascript:;" @click="loginDialog" v-html="$t('login_register.Already_registered_Login').format(`<font color='#3A76E7'>CDCC</font>`)"><!--已有CDCC账号，请登录--></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import userApi from '@/api/user'
import inputbox from '@/components/formel/inputbox_horizontal'
import buttonbox from '@/components/formel/buttonbox'
import utils from '@/assets/js/utils'
import commonConfig from '@/assets/js/commonConfig'
export default {
  components: {
    inputbox,
    buttonbox
  },
  data () {
    return {
      locked: false,
      gtLocked: false,
      checked: false,
      disabled: false,
      areaCodeList: commonConfig.areaCodeList,
      formData: {
        registerType: 1,
        countryCode: commonConfig.defaultCode,
        mobile: '',
        smsCode: '',
        username: '',
        email: '',
        password: '',
        passwordConfirm: '',
        ref: ''
      },
      time: 60
    }
  },
  computed: {
    ...mapGetters(['getLang']),
    msgs () {
      return {
        mobile: {required: this.$t('public0.public6')}, // 请输入手机号
        smsCode: {required: this.$t('login_register.verify_code'), pInteger: this.$t('error_code.NUMERIC')}, // 请输入验证码
        email: {required: this.$t('login_register.email'), email: this.$t('exchange.exchange_Email_format_error')}, // 请输入邮箱||邮箱格式错误
        password: {required: this.$t('login_register.password')}, // 请输入密码
        passwordConfirm: {required: this.$t('login_register.password')} // 请输入密码
      }
    },
    btnDisabled () {
      if (this.formData.mobile === '') {
        return true
      } else if (this.errors.has('mobile')) {
        return true
      } else {
        return this.disabled
      }
    },
    getAgreementUrl () {
      if (this.getLang === 'zh-CN' || this.getLang === 'cht') {
        return 'https://CDCCexchange.zendesk.com/hc/zh-cn/articles/360015235052-%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE'
      } else {
        return 'https://CDCCexchange.zendesk.com/hc/en-us/articles/360015235052-Terms-of-Use'
      }
    }
  },
  watch: {
    'formData.registerType' () {
      this.$nextTick(() => {
        this.$validator.reset()
      })
    },
    $route () {
      this.formData.ref = utils.getUrlHashParams().ref
    }
  },
  created () {
    this.formData.ref = utils.getUrlHashParams().ref
  },
  methods: {
    register () {
      let formData = {}
      for (let i in this.formData) {
        formData[i] = this.formData[i]
      }
      if (Number(formData.registerType) === 0) {
        delete formData.countryCode
        delete formData.mobile
        delete formData.smsCode
        formData.username = formData.email
      } else {
        formData.username = formData.mobile
        delete formData.email
      }
      formData.lang = this.getLang === 'zh-CN' || this.getLang === 'cht' ? 'cn' : 'en'
      this.$validator.validateAll(formData).then((validResult) => {
        if (!validResult) {
          return
        }
        if (!this.checked) {
          Vue.$koallTipBox({icon: 'notification', message: this.$t('public0.public122')})
          return
        }
        if (this.locked) {
          return
        }
        this.gtLocked = true
        utils.gtValidate((gtParams) => {
          for (let i in gtParams) {
            formData[i] = gtParams[i]
          }
          this.locked = true
          userApi.getRsaPublicKey((rsaPublicKey) => {
            formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
            formData.passwordConfirm = utils.encryptPwd(rsaPublicKey, formData.passwordConfirm)
            formData.rsaPublicKey = rsaPublicKey
            userApi.register(formData, (msg) => {
              this.locked = false
              Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
              setTimeout(() => {
                this.$router.push({name: 'login'})
              }, 1500)
            }, (msg) => {
              this.locked = false
              Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
            })
          }, () => {
            this.locked = false
          })
        }, () => {
          this.gtLocked = false
        })
      })
    },
    loginDialog () {
      this.$router.push({name: 'login'})
    },
    sendSMSCode () {
      if (this.btnDisabled) {
        return
      }
      this.disabled = true
      userApi.sendSMSCode({
        countryCode: this.formData.countryCode,
        phoneNumber: this.formData.mobile
      }, (res) => {
        let timeOut = () => {
          this.time--
          if (this.time === 0) {
            this.disabled = false
            this.time = 60
            return
          }
          setTimeout(timeOut, 1000)
        }
        setTimeout(timeOut, 1000)
        Vue.$koallTipBox({icon: 'success', message: this.$t('error_code.SEND_CODE_SUCCESS')})
      }, (msg) => {
        this.disabled = false
        Vue.$koallTipBox({icon: 'notification', message: msg})
      })
    }
  }
}
</script>

<style scoped>
.login{display: flex;justify-content: center;align-items: center;height: calc(100% - 70px);min-height: 800px;margin-left: auto;margin-right: auto; background: url('../assets/images/login_bg.jpg') no-repeat center; background-size: cover;}
@media screen and (max-width: 1600px) {
  .login {height: calc(100% - 60px);}
}
.login-container{width: 1096px;height: 600px;background-color: #fff;box-shadow: 0 3px 20px 0 rgba(0, 0, 0, .2); border-radius: 15px;}
.login-left{float: left;width: 50%;height: 100%;text-align: center;background: url(../assets/images/bg-login.png) no-repeat center center;}
.login-left img{margin-top: 282px;}

.login-right{position: relative;float: right;width: 50%;height: 100%;}
.login-right-item{position: relative;height: 600px;padding:40px 60px; box-sizing: border-box;}
.login-right-item .caption{height: 40px;font-size: 38px;line-height: 40px;color: #3A76E7;}
.login-right-item .prompt{padding-bottom: 24px;overflow: auto;}
.login-right-item .prompt i{float: left;width: 24px;height: 24px;margin-top: 12px;font-weight: bold;font-size: 16px;line-height: 24px;color: #fff;text-align: center;background-color: #FF4022;border-radius: 50%;}
.login-right-item .prompt span{float: left;min-height: 24px;padding: 11px 0 8px 8px;font-size: 18px;line-height: 24px;color: #3A76E7;}

.login-right-item /deep/ .inputbox{width: auto !important;min-height: auto !important;}
.login-right-item /deep/ .title{height: 34px;line-height: 34px;font-size: 16px;color: #000;text-align: left;}
.login-right-item /deep/ .inputdiv{position: relative;display: block;padding-bottom: 24px;}
.login-right-item /deep/ .input{
  width: 100% !important; box-sizing: border-box; height: 40px;margin: 0;font-size: 16px;line-height: normal;
  color: #555;background-color: #F5F5F5; border: 1px solid #F5F5F5;outline: none; padding-left: 15px; padding-right: 15px; border-radius: 4px;
}
.login-right-item /deep/ .input:focus{background-color: #F5F5F5; border-color:#3A76E7!important;}
.login-right-item /deep/ .input.error{background-color: #F5F5F5;border-color: #e53f3f;}
.login-right-item /deep/ .errorinfo{position: absolute;bottom: 0;left: 0;width: auto;height: 24px;padding-top: 0;color: #e53f3f;font-style: normal;line-height: 24px;white-space: nowrap;}

.login-right-item .captcha{overflow: auto;}
.login-right-item .captcha /deep/ .inputbox{float: left;width: 280px !important;}
.login-right-item .captcha img{float: right;margin-top: 34px;cursor: pointer;}

.login-right-item .checkbox-group{overflow: auto;}
.login-right-item .checkbox-group i{float: left;width: 14px;height: 14px;margin-top: 8px;color: #3A76E7;text-indent: 1px;cursor: pointer;}
.login-right-item .checkbox-group i:hover{color: #2565c5;}
.login-right-item .checkbox-group span{float: left;width: 406px;min-height: 30px;padding-left: 8px;line-height: 30px;}
.login-right-item .checkbox-group span em{color: #999999;}
.login-right-item .checkbox-group span a{color: #3A76E7;text-decoration: underline;}
.login-right-item .checkbox-group span a:hover{color: #3A76E7;}

.login-right-item .button-group{position: absolute;bottom: 35px;left: 60px;width: 428px;}
.login-right-item .button-group /deep/ .button{
  display: block;justify-content: center;align-items: center;width: 100% !important;height: 55px !important;padding: 0;margin-top: 0;
  font-weight: bold;font-size: 18px;color: #fff;border: none;border-radius: 4px;cursor: pointer; background: -webkit-linear-gradient(left, #0589F6, #0240CF);  background: linear-gradient(left, #0589F6, #0240CF);
}
.login-right-item .button-group /deep/ .button.disabled{background: -webkit-linear-gradient(left, #999, #666);  background: linear-gradient(left, #999, #666);}
.login-right-item .button-group .link{padding-top: 10px;overflow: auto; text-align: center;}
.login-right-item .button-group .link a{height: 24px;line-height: 24px;color: #999;}
.login-right-item .button-group .link a:hover{color: #999;}

.login-right-item /deep/ input::-webkit-input-placeholder{font-size: 14px;color: #8a96b2;}
.login-right-item /deep/ input::-moz-placeholder{font-size: 14px;color: #8a96b2;}
.login-right-item /deep/ input:-moz-placeholder{font-size: 14px;color: #8a96b2;}
.login-right-item /deep/ input:-ms-input-placeholder{font-size: 14px;color: #8a96b2;}

.item-registerType{width: 320px; margin: auto; display: flex; color: #0472E9; font-size: 18px; padding-bottom: 20px;}
.item-registerType /deep/ label{cursor: pointer; border: 1px solid #0472E9;  flex: 1; height: 54px; box-sizing: border-box; text-align: center; line-height: 54px;}
.item-registerType /deep/ label:first-child {border-top-left-radius: 6px; border-bottom-left-radius: 6px;}
.item-registerType /deep/ label:last-child {border-top-right-radius: 6px; border-bottom-right-radius: 6px;}
.item-registerType /deep/ label.checked{color:#fff; background-color: #0472E9;}
.item-registerType /deep/ input{width:0;height:0;opacity:0;}

.ref /deep/ .inputdiv{padding-bottom:10px;}
.mobile{position:relative;}
.mobile /deep/ select{
  position: absolute;top: 0;left: 0;z-index: 1;width: 35%;height: 38px;padding-right: 20px;color: #000;
  background-position: right 4px center; font-size: 16px;
}
.mobile /deep/ .inputdiv{position: relative; width: 60%; margin-left: 40%;}
.smsCode{position: relative; }
.smsCode /deep/ a{position: absolute;top: 5px;right: 5px; padding:5px; height: 22px;line-height: 22px;color: #0472E9; background-color: #F5F5F5;}
.smsCode /deep/ a.disabled{color: #999;cursor: not-allowed;}
</style>

