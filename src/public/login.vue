<template>
    <div class="login">
        <div class="login-container">
            <div class="login-left"></div>
            <div class="login-right">
                <div class="login-right-item item-login">
                    <div class="caption">{{$t('login_register.title_login').format('NEWTON')}}<!--欢迎来到NEWTON--></div>
                    <div class="prompt">
                        <i>!</i>
                        <span>{{$t('login_register.warm_prompt')}}<!--请确认您正在访问：-->www.newtonXchange.com</span>
                    </div>
                    <inputbox name="email" ref="email" v-model="formData.username" v-validate="'required'" :msgs="msgs.username" :errs="errors" :title="`${$t('otc_exchange.otc_exchange_Email')}/${$t('account.user_center_phone')}`" :placeholder="$t('public0.public246')" :autocomplete="'on'" @keyupEnter="login"/><!--邮箱/手机号-->
                    <inputbox type="password" name="password" v-model="formData.password" v-validate="'required'" :msgs="msgs.password" :errs="errors" :title="$t('exchange.exchange_password')" :placeholder="$t('login_register.password')" :autocomplete="'on'" @keyupEnter="login"/><!--密码-->
                    <div class="button-group">
                        <buttonbox :text="$t('login_register.login')" @click="login"/><!--登录-->
                        <div class="link">
                            <a href="javascript:;" @click="registerDialog">{{$t('exchange.exchange_not_account')}}<!--立即注册--></a>
                            <a href="javascript:;" @click="sendemailDialog">{{$t('login_register.forget_password')}}<!--忘记密码--></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapActions } from 'vuex'
import userApi from '@/api/user'
import myAPi from '@/api/individual'
import utils from '@/assets/js/utils'
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
        username: '',
        password: ''
      }
    }
  },
  computed: {
    msgs () {
      return {
        username: {required: this.$t('public0.public246')}, // 请输入邮箱或手机号
        password: {required: this.$t('login_register.password')} // 请输入密码
      }
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
    ...mapActions(['setApiToken', 'setUserInfo']),
    login () {
      this.$validator.validateAll().then((validResult) => {
        if (!validResult) {
          return
        }
        if (this.locked) {
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
          formData.password = utils.encryptPwd(formData.password)
          userApi.login(formData, (apiToken, res) => {
            if (apiToken) {
              this.setApiToken(apiToken)
              myAPi.addLoginHistory()
              return
            }
            // 二次验证
            this.$router.push({
              name: 'twoverify',
              params: {
                username: this.formData.username,
                type: res.type,
                mobile: res.mobile
              }
            })
          }, (msg, rst) => {
            this.locked = false
            Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)})
            if (rst === 300) {
              this.$router.push({name: 'sendemail', params: {email: this.formData.username}})
              console.log(this.formData.username)
            }
          })
        })
      })
    },
    registerDialog () {
      this.$router.push({name: 'register'})
    },
    sendemailDialog () {
      this.$router.push({name: 'findpwd'})
    }
  }
}
</script>

<style scoped>
.login{display: flex;justify-content: center;align-items: center;width: 1200px;height: calc(100% - 60px);min-height: 800px;margin-left: auto;margin-right: auto;}
.login-container{width: 1096px;height: 600px;background-color: #222121;box-shadow: -10px 10px 40px 0 rgba(0, 0, 0, .5);}
.login-left{float: left;width: 50%;height: 100%;text-align: center;background: url(../assets/images/bg-login.jpg) no-repeat center center;}
.login-left img{margin-top: 282px;}

.login-right{position: relative;float: right;width: 50%;height: 100%;}
.login-right-item{position: relative;height: 520px;padding: 40px 60px;}
.login-right-item .caption{height: 40px;font-size: 20px;line-height: 40px;color: #fff;}
.login-right-item .prompt{padding-bottom: 24px;overflow: auto;}
.login-right-item .prompt i{float: left;width: 16px;height: 16px;margin-top: 12px;font-weight: bold;font-size: 16px;line-height: 16px;color: #181b2a;text-align: center;background-color: #e53f3f;border-radius: 50%;}
.login-right-item .prompt span{float: left;width: 404px;min-height: 24px;padding: 8px 0 8px 8px;font-size: 16px;line-height: 24px;color: #8b94a9;}

.login-right-item /deep/ .inputbox{width: auto !important;min-height: auto !important;}
.login-right-item /deep/ .title{height: 34px;line-height: 34px;font-size: 16px;color: #d6dff9;text-align: left;}
.login-right-item /deep/ .inputdiv{position: relative;display: block;padding-bottom: 24px;}
.login-right-item /deep/ .input{
  width: 100% !important;height: 40px;margin: 0;padding: 0;font-size: 16px;line-height: normal;
  color: #d6dff9;background-color: transparent;border-width: 0;border-bottom: 1px solid #54616c;outline: none;
}
.login-right-item /deep/ .input:focus{background-color: transparent;border-bottom-color:#E3CB2B!important;}
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

.login-right-item .button-group{position: absolute;bottom: 40px;left: 60px;width: 428px;}
.login-right-item .button-group /deep/ .button{
  display: block;justify-content: center;align-items: center;width: 100% !important;height: 40px !important;padding: 0;margin-top: 0;
  font-weight: bold;font-size: 18px;color: #fff;background-color: #E3CB2B;border: none;border-radius: 0;cursor: pointer;
}
.login-right-item .button-group /deep/ .button:hover{background-color: #E3CB2B;}
.login-right-item .button-group /deep/ .button.disabled{background-color: #999;}
.login-right-item .button-group .link{padding-top: 6px;overflow: auto;}
.login-right-item .button-group .link a{height: 24px;line-height: 24px;color: #11a8fe;text-decoration: underline;}
.login-right-item .button-group .link a:first-of-type{float: left;}
.login-right-item .button-group .link a:last-of-type{float: right;}
.login-right-item .button-group .link a:hover{color: #15c9ff;}

.login-right-item /deep/ input::-webkit-input-placeholder{font-size: 14px;color: #8a96b2;}
.login-right-item /deep/ input::-moz-placeholder{font-size: 14px;color: #8a96b2;}
.login-right-item /deep/ input:-moz-placeholder{font-size: 14px;color: #8a96b2;}
.login-right-item /deep/ input:-ms-input-placeholder{font-size: 14px;color: #8a96b2;}
/*设置chrome浏览器自动填写用户名/密码的input样式*/
.login-right-item /deep/ input:-webkit-autofill{-webkit-text-fill-color: #d6dff9;border-width: 0 !important;border-bottom: 1px solid #404b69 !important;box-shadow: 0 0 0 1000px #181b2a inset;}
.login-right-item /deep/ input:-webkit-autofill:focus{border-bottom-color: #11a8fe !important;}
</style>
