<template>
    <div class="login">
        <div class="login-container">
            <div class="login-left">
            </div>
            <div class="login-right">
                <div class="login-right-item item-findpwd">
                    <div class="item-registerType">
                      <label :class="{checked:registerType==1}">
                        <span>
                          <input type="radio" v-model="registerType" value="1"/>
                          <i></i>
                        </span>
                        {{$t('login_register.retrieved_by_cellphone')}}<!--手机找回-->
                      </label>
                      <label :class="{checked:registerType==0}">
                        <span>
                          <input type="radio" v-model="registerType" value="0"/>
                          <i></i>
                        </span>
                        {{$t('login_register.retrieved_by_email')}}<!--邮箱找回-->
                      </label>
                    </div>
                    <template v-if="registerType==1">
                      <div class="mobile">
                        <select v-model="countryCode">
                          <option v-for="item in areaCodeList" :value="item.code">{{$t(item.key)}}&nbsp;{{item.code}}</option>
                        </select>
                        <inputbox name="phoneNumber" ref="email" :maxLength="255" v-model="mobileFormData.phoneNumber" v-validate="'required|telphone'" :msgs="msgs.phoneNumber" :errs="errors" :placeholder="$t('public0.public6')"/><!--手机号-->
                      </div>
                      <div class="smsCode">
                        <inputbox name="smsCode" :maxLength="6" v-model="mobileFormData.smsCode" v-validate="'required'" :msgs="msgs.smsCode" :errs="errors" :title="$t('account.user_center_SMS_code')" :placeholder="$t('login_register.verify_code')"/><!--短信验证码-->
                        <a href="javascript:;" :class="{disabled:btnDisabled}" @click="sendSMSCode">{{$t('account.user_center_send_SMS')}}<!--发送验证码-->{{disabled ? `（${time}s）` : ''}}</a>
                      </div>
                      <inputbox id="CDCC-password" v-validate="'required|password'" type="password" name="password" :msgs="msgs.password" :errs="errors" v-model="mobileFormData.password" :title="$t('account.user_center_new_password')" :placeholder="$t('account.user_center_Please_new_password')"/><!--新密码-->
                      <inputbox v-validate="'required|passwordAgain'" type="password" name="passwordConfirm" :msgs="msgs.passwordConfirm" :errs="errors" v-model="mobileFormData.passwordConfirm" :title="$t('login_register.confirm_new_password')" :placeholder="$t('account.user_center_Please_new_password')"/><!--确认新密码-->
                    </template>
                    <inputbox name="username" ref="email" v-show="registerType==0" :maxLength="255" v-model="formData.username" v-validate="'required|email'" :msgs="msgs.username" :errs="errors" :title="$t('otc_exchange.otc_exchange_Email')" :placeholder="$t('login_register.email')"/>
                    <div class="button-group">
                        <buttonbox :class="{disabled:locked||gtLocked}" v-if="registerType==1" :text="$t('exchange.exchange_determine')" @click="updatePwd"/><!--确定-->
                        <buttonbox :class="{disabled:locked||gtLocked}" v-if="registerType==0" :text="$t('login_register.Next_step')" @click="next"/><!--下一步-->
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
import myApi from '@/api/individual'
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
      registerType: 1,
      areaCodeList: commonConfig.areaCodeList,
      countryCode: commonConfig.defaultCode,
      mobileFormData: {
        phoneNumber: '',
        smsCode: '',
        password: '',
        passwordConfirm: ''
      },
      formData: {
        username: ''
      },
      disabled: false,
      time: 60
    }
  },
  computed: {
    ...mapGetters(['getLang']),
    msgs () {
      return {
        phoneNumber: {required: this.$t('public0.public6')}, // 请输入手机号
        smsCode: {required: this.$t('login_register.verify_code')}, // 请输入验证码
        password: {required: this.$t('account.user_center_Please_new_password')}, // 请输入新密码
        passwordConfirm: {required: this.$t('account.user_center_Please_new_password')}, // 请输入新密码
        username: {required: this.$t('login_register.email'), email: this.$t('exchange.exchange_Email_format_error')} // 请输入邮箱||邮箱格式错误
      }
    },
    btnDisabled () {
      if (!this.mobileFormData.phoneNumber) {
        return true
      } else if (this.errors.has('phoneNumber')) {
        return true
      } else {
        return this.disabled
      }
    }
  },
  watch: {
    registerType () {
      this.$nextTick(() => {
        this.$validator.reset()
      })
    }
  },
  created () {
    this.$nextTick(() => {
      setTimeout(() => {
        this.$refs.email.$refs.input.focus()
      }, 10)
    })
  },
  methods: {
    next () {
      if (this.locked) {
        return
      }
      this.$validator.validateAll(this.formData).then((validResult) => {
        if (!validResult) {
          return
        }
        this.gtLocked = true
        utils.gtValidate((gtParams) => {
          this.locked = true
          let formData = {}
          for (let i in this.formData) {
            formData[i] = this.formData[i]
          }
          for (let i in gtParams) {
            formData[i] = gtParams[i]
          }
          formData.lang = this.getLang === 'zh-CN' || this.getLang === 'cht' ? 'cn' : 'en'
          userApi.forgetPwdSendEmail(formData, () => {
            Vue.$koallTipBox({icon: 'success', message: this.$t('login_register.Mail_sent_successfully')}) // 邮件发送成功
            setTimeout(() => {
              this.locked = false
              this.$router.push({name: 'login'})
            }, 1500)
          }, (msg) => {
            this.locked = false
            Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)})
          })
        }, () => {
          this.gtLocked = false
        })
      })
    },
    updatePwd () {
      if (this.locked) {
        return
      }
      this.$validator.validateAll(this.mobileFormData).then((validResult) => {
        if (!validResult) {
          return
        }
        this.gtLocked = true
        utils.gtValidate((gtParams) => {
          this.locked = true
          let formData = {}
          for (let i in this.mobileFormData) {
            formData[i] = this.mobileFormData[i]
          }
          for (let i in gtParams) {
            formData[i] = gtParams[i]
          }
          userApi.getRsaPublicKey((rsaPublicKey) => {
            formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
            formData.passwordConfirm = utils.encryptPwd(rsaPublicKey, formData.passwordConfirm)
            formData.rsaPublicKey = rsaPublicKey
            userApi.mobileResetPwd(formData, () => {
              Vue.$koallTipBox({icon: 'success', message: this.$t('account.user_center_Successful')}) // 邮件发送成功
              setTimeout(() => {
                this.locked = false
                this.$router.push({name: 'login'})
              }, 1500)
            }, (msg) => {
              this.locked = false
              Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)})
            })
          }, () => {
            this.locked = false
          })
        }, () => {
          this.gtLocked = false
        })
      })
    },
    sendSMSCode () {
      if (this.btnDisabled) {
        return
      }
      this.disabled = true
      myApi.sendAuthSMSCode({
        countryCode: this.countryCode,
        phoneNumber: this.mobileFormData.phoneNumber
      }, (msg) => {
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
        Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
      }, (msg) => {
        this.disabled = false
        Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
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
.login-right-item{position: relative;height: 600px;padding:80px 60px 40px; box-sizing: border-box;}
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
.login-right-item /deep/ .input.error{background-color: #F5F5F5;border-bottom-color: #e53f3f;}
.login-right-item /deep/ .errorinfo{position: absolute;bottom: 0;left: 0;width: auto;height: 24px;padding-top: 0;color: #e53f3f;font-style: normal;line-height: 24px;white-space: nowrap;}

.login-right-item .captcha{overflow: auto;}
.login-right-item .captcha /deep/ .inputbox{float: left;width: 280px !important;}
.login-right-item .captcha img{float: right;margin-top: 34px;cursor: pointer;}


.login-right-item .checkbox-group{overflow: auto;}
.login-right-item .checkbox-group i{float: left;width: 14px;height: 14px;margin-top: 8px;color: #3A76E7;text-indent: 1px;cursor: pointer;}
.login-right-item .checkbox-group i:hover{color: #fdb902;}
.login-right-item .checkbox-group span{float: left;width: 406px;min-height: 30px;padding-left: 8px;line-height: 30px;}
.login-right-item .checkbox-group span em{color: #999999;}
.login-right-item .checkbox-group span a{color: #3A76E7;text-decoration: underline;}
.login-right-item .checkbox-group span a:hover{color: #3A76E7;}


.login-right-item .button-group{position: absolute;bottom: 80px;left: 60px;width: 428px;}
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

.item-registerType{width: 320px; margin: auto; display: flex; color: #0472E9; font-size: 18px; padding-bottom: 30px;}
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

