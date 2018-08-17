<template>
    <div class="login">
        <div class="login-container">
            <div class="login-left">
                <img src="../assets/images/logo.png" alt="">
            </div>
            <div class="login-right">
                <div class="login-right-item item-findpwd">
                    <div class="caption">{{$t('login_register.Retrieve_password')}}</div>
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
                      <inputbox name="phoneNumber" ref="email" :maxLength="255" v-model="mobileFormData.phoneNumber" v-validate="'required|telphone'" :msgs="msgs.phoneNumber" :errs="errors" :title="$t('account.user_center_phone')" :placeholder="$t('public0.public6')"/><!--手机号-->
                      <div class="smsCode">
                        <inputbox name="smsCode" :maxLength="6" v-model="mobileFormData.smsCode" v-validate="'required'" :msgs="msgs.smsCode" :errs="errors" :title="$t('account.user_center_SMS_code')" :placeholder="$t('login_register.verify_code')"/><!--短信验证码-->
                        <a href="javascript:;" :class="{disabled:btnDisabled}" @click="sendSMSCode">{{$t('account.user_center_send_SMS')}}<!--发送验证码-->{{disabled ? `（${time}s）` : ''}}</a>
                      </div>
                      <inputbox id="newton-password" v-validate="'required|password'" type="password" name="password" :msgs="msgs.password" :errs="errors" v-model="mobileFormData.password" :title="$t('account.user_center_new_password')" :placeholder="$t('account.user_center_Please_new_password')"/><!--新密码-->
                      <inputbox v-validate="'required|passwordAgain'" type="password" name="passwordConfirm" :msgs="msgs.passwordConfirm" :errs="errors" v-model="mobileFormData.passwordConfirm" :title="$t('login_register.confirm_new_password')" :placeholder="$t('account.user_center_Please_new_password')"/><!--确认新密码-->
                    </template>
                    <inputbox name="username" ref="email" v-show="registerType==0" :maxLength="255" v-model="formData.username" v-validate="'required|email'" :msgs="msgs.username" :errs="errors" :title="$t('otc_exchange.otc_exchange_Email')" :placeholder="$t('login_register.email')"/>
                    <div class="button-group">
                        <buttonbox v-if="registerType==1" :text="$t('exchange.exchange_determine')" @click="updatePwd"/><!--确定-->
                        <buttonbox v-if="registerType==0" :text="$t('login_register.Next_step')" @click="next"/><!--下一步-->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import userApi from '@/api/user'
import myApi from '@/api/individual'
import inputbox from '@/components/formel/inputbox'
import buttonbox from '@/components/formel/buttonbox'
import utils from '@/assets/js/utils'
export default {
  components: {
    inputbox,
    buttonbox
  },
  data () {
    return {
      locked: false,
      registerType: 1,
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
        utils.gtValidate((gtParams) => {
          this.locked = true
          let formData = {}
          for (let i in this.formData) {
            formData[i] = this.formData[i]
          }
          for (let i in gtParams) {
            formData[i] = gtParams[i]
          }
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
        utils.gtValidate((gtParams) => {
          this.locked = true
          let formData = {}
          for (let i in this.mobileFormData) {
            formData[i] = this.mobileFormData[i]
          }
          for (let i in gtParams) {
            formData[i] = gtParams[i]
          }
          formData.password = utils.encryptPwd(formData.password)
          formData.passwordConfirm = utils.encryptPwd(formData.passwordConfirm)
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
        })
      })
    },
    sendSMSCode () {
      if (this.btnDisabled) {
        return
      }
      this.disabled = true
      myApi.sendAuthSMSCode({
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
.login{display: flex;justify-content: center;align-items: center;width: 1200px;height: calc(100% - 60px);min-height: 800px;margin-left: auto;margin-right: auto;}
.login-container{width: 1096px;height: 600px;background-color: #181b2a;box-shadow: -10px 10px 40px 0 rgba(0, 0, 0, .5);}
.login-left{float: left;width: 50%;height: 100%;text-align: center;background: url(../assets/images/bg-login.jpg) no-repeat center center;}
.login-left img{margin-top: 282px;}

.login-right{position: relative;float: right;width: 50%;height: 100%;}
.login-right-item{position: relative;height: 520px;padding: 40px 60px;}
.login-right-item .caption{height: 40px;font-size: 20px;line-height: 40px;color: #fff;}
.login-right-item .prompt{padding-bottom: 24px;overflow: auto;}
.login-right-item .prompt i{float: left;width: 16px;height: 16px;margin-top: 12px;font-weight: bold;font-size: 16px;line-height: 16px;color: #181b2a;text-align: center;background-color: #e53f3f;border-radius: 50%;}
.login-right-item .prompt span{float: left;width: 404px;min-height: 24px;padding: 8px 0 8px 8px;font-size: 16px;line-height: 24px;color: #8b94a9;}

.login-right-item /deep/ .inputbox{width: auto !important;min-height: auto !important;}
.login-right-item /deep/ .title{height: 26px;line-height: 26px;font-size: 16px;color: #d6dff9;text-align: left;}
.login-right-item /deep/ .inputdiv{position: relative;display: block;padding-bottom: 24px;}
.login-right-item /deep/ .input{width: 100% !important;height: 40px;margin: 0;padding: 0;font-size: 16px;line-height: normal;color: #d6dff9;background-color: transparent;border-width: 0;border-bottom: 1px solid #404b69;outline: none;}
.login-right-item /deep/ .input:focus{background-color: transparent;}
.login-right-item /deep/ .input.error{background-color: transparent;border-bottom-color: #e53f3f;}
.login-right-item /deep/ .errorinfo{position: absolute;bottom: 0;left: 0;width: auto;height: 24px;padding-top: 0;color: #e53f3f;font-style: normal;line-height: 24px;white-space: nowrap;}

.login-right-item .captcha{overflow: auto;}
.login-right-item .captcha /deep/ .inputbox{float: left;width: 280px !important;}
.login-right-item .captcha img{float: right;margin-top: 34px;cursor: pointer;}

.login-right-item .checkbox-group{overflow: auto;}
.login-right-item .checkbox-group i{float: left;width: 14px;height: 14px;margin-top: 8px;color: #11a8fe;text-indent: 1px;cursor: pointer;}
.login-right-item .checkbox-group i:hover{color: #15c9ff;}
.login-right-item .checkbox-group span{float: left;width: 406px;min-height: 30px;padding-left: 8px;line-height: 30px;}
.login-right-item .checkbox-group span em{color: #d6dff9;}
.login-right-item .checkbox-group span a{color: #11a8fe;text-decoration: underline;}
.login-right-item .checkbox-group span a:hover{color: #15c9ff;}

.login-right-item .button-group{position: absolute;bottom:30px;left: 60px;width: 428px;}
.login-right-item .button-group /deep/ .button{display: block;justify-content: center;align-items: center;width: 100% !important;height: 40px !important;padding: 0;margin-top: 0;font-weight: bold;font-size: 18px;color: #fff;background-color: #11a8fe;border: none;border-radius: 0;cursor: pointer;}
.login-right-item .button-group /deep/ .button:hover{background-color: #15c9ff;}
.login-right-item .button-group /deep/ .button.disabled{background-color: #999;}
.login-right-item .button-group .link{padding-top: 6px;overflow: auto;}
.login-right-item .button-group .link a{height: 24px;line-height: 24px;color: #11a8fe;text-decoration: underline;}
.login-right-item .button-group .link a:first-of-type{float: left;}
.login-right-item .button-group .link a:last-of-type{float: right;}
.login-right-item .button-group .link a:hover{color: #15c9ff;}

.login-right-item /deep/ input::-webkit-input-placeholder{font-size: 14px;color: #404b69;}
.login-right-item /deep/ input::-moz-placeholder{font-size: 14px;color: #404b69;}
.login-right-item /deep/ input:-moz-placeholder{font-size: 14px;color: #404b69;}
.login-right-item /deep/ input:-ms-input-placeholder{font-size: 14px;color: #404b69;}

.item-registerType{font-size:16px;color:#d6dff9;margin:20px 0;}
.item-registerType /deep/ label{cursor: pointer}
.item-registerType /deep/ label:last-of-type{margin-left:20px;}
.item-registerType /deep/ label.checked{color:#11A8FE;}
.item-registerType /deep/ span{position:relative;vertical-align:middle;padding-right:8px;}
.item-registerType /deep/ input{width:0;height:0;opacity:0;}
.item-registerType /deep/ input + i::before{
  position:absolute;content:"";display:block;width:12px;height:12px;top:0;left:0;border:2px solid #d6dff9;border-radius:50%;
}
.item-registerType /deep/ input:checked + i::before {
  border-color:#11A8FE;
}
.item-registerType /deep/ input:checked + i::after {
  position:absolute;content:"";display:block;width:8px;height:8px;top:4px;left:4px;border-radius:50%;
  background:#11A8FE;
}
.mobile{position:relative;}
.mobile /deep/ select{position:absolute;height:39px;top:0;color:#3F4D6E;width:90px;padding-right:15px;z-index:10;}
.mobile /deep/ .inputdiv{position:relative;}
.smsCode{position:relative;}
.smsCode /deep/ a{position:absolute;height:22px;line-height:22px;color:#11A8FE;right:0;top:34px;}
.smsCode /deep/ a.disabled{color:#999;cursor:not-allowed;}
</style>

