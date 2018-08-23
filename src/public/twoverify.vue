<template>
    <div class="twoverify">
        <div class="twoverify-container">
            <div class="twoverify-left">
                <img src="../assets/images/logo.png" alt="">
            </div>
            <div class="twoverify-right">
                <div class="twoverify-right-item item-login">
                    <div class="caption">{{$t('account.user_center_two_auth')}}<!--二次验证--></div>
                    <div class="tabs" v-if="type === '01' || type === '10'">
                        <label :class="{checked: Number(formData.verifyType) === 0}">
                            <input v-model="formData.verifyType" type="radio" value="0"/>
                            {{$t('auth_warning.warning_SMS_auth')}}<!--短信验证-->
                        </label>
                        <label :class="{checked: Number(formData.verifyType) === 1}">
                            <input v-model="formData.verifyType" type="radio" value="1"/>
                            {{$t('auth_warning.warning_google_auth')}}<!--谷歌验证-->
                        </label>
                    </div>
                    <div class="verifyCode" :style="type === '01' || type === '10' ? null : 'margin-top:40px;'" @click="focusVerifyCode">
                        <a href="javascript:" v-if="Number(formData.verifyType) === 0" class="sendVerifyCode" :class="{disabled:disabled}" @click="sendSMSCode">{{$t('account.user_center_send_SMS')}}<!--发送验证码-->{{disabled ? `（${time}s）` : ''}}</a>
                        <inputbox name="verifyCode" ref="verifyCode" :maxLength="verifyCodeLength" v-model="formData.verifyCode" v-validate="'required'" :msgs="msgs.verifyCode" :errs="errors" :title="codeTitle"/><!--短信验证码||谷歌验证码-->
                        <ul>
                            <li :class="{active:index<=verifyCodes.length}" v-for="index in verifyCodeLength" :key="index">{{verifyCodes[index - 1]||''}}</li>
                        </ul>
                    </div>
                    <div class="button-group">
                        <buttonbox :class="{disabled:locked}" :text="$t('login_register.login')" @click="login"/><!--登录-->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapActions } from 'vuex'
import myApi from '@/api/individual'
import inputbox from '@/components/formel/inputbox'
import buttonbox from '@/components/formel/buttonbox'
export default {
  components: {
    inputbox,
    buttonbox
  },
  data () {
    return {
      locked: false,
      formData: {
        verifyType: 0,
        username: '',
        mobile: '',
        verifyCode: ''
      },
      disabled: false,
      time: 60,
      type: ''
    }
  },
  computed: {
    msgs () {
      return {
        verifyCode: {required: this.$t('login_register.verify_code')} // 请输入验证码
      }
    },
    verifyCodeLength () {
      return Number(this.formData.verifyType) === 0 ? 6 : 6
    },
    verifyCodes () {
      let arr = (this.formData.verifyCode || '').split('')
      return arr
    },
    codeTitle () {
      // 短信验证码||谷歌验证码
      return Number(this.formData.verifyType) === 0 ? this.$t('account.user_center_SMS_code') : this.$t('account.user_center_Google_verification_code')
    }
  },
  watch: {
    'formData.verifyType' () {
      this.formData.verifyCode = ''
      this.$nextTick(() => {
        this.$refs.verifyCode.$refs.input.focus()
      })
    },
    type (val) {
      if (String(val).indexOf('0') !== -1) {
        this.formData.verifyType = 0
      } else {
        this.formData.verifyType = 1
      }
    }
  },
  created () {
    let username = this.$route.params.username
    if (username) {
      this.formData.username = username
      window.localStorage.setItem('$twoverify_username', username)
    } else {
      username = window.localStorage.getItem('$twoverify_username')
      if (username) {
        this.formData.username = username
      } else {
        this.$router.push({name: 'login'})
      }
    }
    let mobile = this.$route.params.mobile
    if (mobile) {
      this.formData.mobile = mobile
      window.localStorage.setItem('$twoverify_mobile', mobile)
    } else {
      mobile = window.localStorage.getItem('$twoverify_mobile')
      if (mobile) {
        this.formData.mobile = mobile
      }
    }
    let type = this.$route.params.type
    if (type) {
      this.type = type
      window.localStorage.setItem('$twoverify_type', type)
    } else {
      type = window.localStorage.getItem('$twoverify_type')
      if (type) {
        this.type = type
      }
    }
  },
  methods: {
    ...mapActions(['setApiToken', 'setUserInfo']),
    login () {
      this.$validator.validateAll().then((validResult) => {
        if (!validResult) {
          return
        }
        if (this.locked) {
          return
        }
        let m = Number(this.formData.verifyType) === 0 ? 'loginMobileVerify' : 'loginTwo'
        let formData = Number(this.formData.verifyType) === 0 ? {
          smsCode: this.formData.verifyCode,
          username: this.formData.username
        } : {
          verifyCode: this.formData.verifyCode,
          username: this.formData.username
        }
        this.locked = true
        myApi[m](formData, (apiToken) => {
          window.localStorage.removeItem('$twoverify_username')
          this.locked = false
          this.setApiToken(apiToken)
          myApi.addLoginHistory()
        }, (msg) => {
          this.locked = false
          this.formData.verifyCode = ''
          setTimeout(() => {
            this.$refs.verifyCode.$refs.input.focus()
          }, 10)
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
      })
    },
    registerDialog () {
      this.$router.push({name: 'register'})
    },
    sendemailDialog () {
      this.$router.push({name: 'findpwd'})
    },
    focusVerifyCode () {
      this.$refs.verifyCode.$refs.input.focus()
    },
    sendSMSCode () {
      if (this.disabled) {
        return
      }
      if (!this.formData.mobile) {
        Vue.$koallTipBox({icon: 'notification', message: this.$t('public0.public6')}) // 请输入手机号
        return
      }
      this.disabled = true
      myApi.sendAuthSMSCode({
        phoneNumber: this.formData.mobile
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
.twoverify{display: flex;justify-content: center;align-items: center;width: 1200px;height: calc(100% - 60px);min-height: 800px;margin-left: auto;margin-right: auto;}
.twoverify-container{width: 1096px;height: 600px;background-color: #222121;box-shadow: -10px 10px 40px 0 rgba(0, 0, 0, .5);}
.twoverify-left{float: left;width: 50%;height: 100%;text-align: center;background: url(../assets/images/bg-login.jpg) no-repeat center center;}
.twoverify-left img{margin-top: 282px;}

.twoverify-right{position: relative;float: right;width: 50%;height: 100%;}
.twoverify-right-item{position: relative;height: 520px;padding: 40px 60px;}
.twoverify-right-item .caption{height: 40px;font-size: 20px;line-height: 40px;color: #fff;}
.twoverify-right-item .tabs{display:flex;height:45px;margin:60px 0;}
.twoverify-right-item .tabs label{display:flex;flex:1;align-items:center;justify-content:center;font-size:16px;color:#A1A8BB;border:1px solid #3F4D6E;cursor:pointer;}
.twoverify-right-item .tabs label.checked{border-color:#11A8FE;color:#11A8FE;}
.twoverify-right-item .tabs label input{display:none;}
.twoverify-right-item .prompt{padding-bottom: 24px;overflow: auto;}
.twoverify-right-item .prompt i{float: left;width: 16px;height: 16px;margin-top: 12px;font-weight: bold;font-size: 16px;line-height: 16px;color: #181b2a;text-align: center;background-color: #e53f3f;border-radius: 50%;}
.twoverify-right-item .prompt span{float: left;width: 404px;min-height: 24px;padding: 8px 0 8px 8px;font-size: 16px;line-height: 24px;color: #8b94a9;}

.twoverify-right-item /deep/ .inputbox{width: auto !important;min-height: auto !important;}
.twoverify-right-item /deep/ .title{height: 34px;line-height: 34px;font-size: 16px;color: #d6dff9;text-align: left;}
.twoverify-right-item /deep/ .inputdiv{position: relative;display: block;padding-bottom: 24px;}
.twoverify-right-item /deep/ .input{width:100% !important;height: 40px;margin: 0;padding: 0;font-size:26px;line-height:normal;color: #d6dff9;background-color: transparent;border-width: 0;border-bottom: 1px solid #404b69;outline:none;font-weight:bold;opacity:0;}
.twoverify-right-item /deep/ .input:focus{background-color: transparent;}
.twoverify-right-item /deep/ .input.error{background-color: transparent;border-bottom-color: #e53f3f;}
.twoverify-right-item /deep/ .errorinfo{position: absolute;bottom: 0;left: 0;width: auto;height: 24px;padding-top: 0;color: #e53f3f;font-style: normal;line-height: 24px;white-space: nowrap;}

.twoverify-right-item .captcha{overflow: auto;}
.twoverify-right-item .captcha /deep/ .inputbox{float: left;width: 280px !important;}
.twoverify-right-item .captcha img{float: right;margin-top: 34px;cursor: pointer;}

.twoverify-right-item .checkbox-group{overflow: auto;}
.twoverify-right-item .checkbox-group i{float: left;width: 14px;height: 14px;margin-top: 8px;color: #11a8fe;text-indent: 1px;cursor: pointer;}
.twoverify-right-item .checkbox-group i:hover{color: #15c9ff;}
.twoverify-right-item .checkbox-group span{float: left;width: 406px;min-height: 30px;padding-left: 8px;line-height: 30px;}
.twoverify-right-item .checkbox-group span em{color: #d6dff9;}
.twoverify-right-item .checkbox-group span a{color: #11a8fe;text-decoration: underline;}
.twoverify-right-item .checkbox-group span a:hover{color: #15c9ff;}

.twoverify-right-item .button-group{position: absolute;bottom: 40px;left: 60px;width: 428px;}
.twoverify-right-item .button-group /deep/ .button{
  display: block;justify-content: center;align-items: center;width: 100% !important;height: 40px !important;padding: 0;margin-top: 0;
  font-weight: bold;font-size: 18px;color: #fff;background-color: #E3CB2B;border: none;border-radius: 0;cursor: pointer;
}
.twoverify-right-item .button-group /deep/ .button:hover{background-color: #E3CB2B;}
.twoverify-right-item .button-group /deep/ .button.disabled{background-color: #999;}
.twoverify-right-item .button-group .link{padding-top: 6px;overflow: auto;}
.twoverify-right-item .button-group .link a{height: 24px;line-height: 24px;color: #11a8fe;text-decoration: underline;}
.twoverify-right-item .button-group .link a:first-of-type{float: left;}
.twoverify-right-item .button-group .link a:last-of-type{float: right;}
.twoverify-right-item .button-group .link a:hover{color: #15c9ff;}

.twoverify-right-item /deep/ input::-webkit-input-placeholder{font-size: 14px;color: #404b69;}
.twoverify-right-item /deep/ input::-moz-placeholder{font-size: 14px;color: #404b69;}
.twoverify-right-item /deep/ input:-moz-placeholder{font-size: 14px;color: #404b69;}
.twoverify-right-item /deep/ input:-ms-input-placeholder{font-size: 14px;color: #404b69;}

.verifyCode{position: relative;}
.verifyCode /deep/ ul{display:flex;width:100%;height:41px;position:absolute;top:34px;left:0px;justify-content:space-between;}
.verifyCode /deep/ ul li{display:flex;margin-right:8px;border-bottom:1px solid #54616c;height:100%;flex:1;font-size:24px;font-weight:bold;color:#CBD4EC;align-items:center;justify-content:center;}
.verifyCode /deep/ ul li.active{border-bottom-color:#E3CB2B;}
.verifyCode /deep/ ul li:last-child{margin-right:0;}
.sendVerifyCode{height:34px;line-height:34px;cursor:pointer;position:absolute;z-index:10;right:0;top:0;color:#11a8fe;}
.sendVerifyCode:hover{color:#15c9ff;}
.sendVerifyCode.disabled,.sendVerifyCode.disabled:hover{color:#999;cursor:not-allowed;}
</style>
