<template>
  <div class="login">
    <div class="login-container">
      <div class="login-left"></div>
      <div class="login-right">
        <div class="login-right-item item-login">
          <div class="caption">{{$t('login_register.title_login').format('SATOX')}}<!--欢迎来到SATOX--></div>
          <div class="prompt">
            <i>!</i>
            <span>{{$t('login_register.warm_prompt')}}<!--请确认您正在访问：-->www.satox.io</span>
          </div>
          <inputbox name="email" ref="email" v-model="formData.username" v-validate="'required'" :msgs="msgs.username"
                    :errs="errors"
                    :title="`${$t('otc_exchange.otc_exchange_Email')}/${$t('account.user_center_phone')}/${$t('otc_exchange.otc_exchange_username')}`"
                    :placeholder="usernamePlaceholder" :autocomplete="'on'" @keyupEnter="login"/><!--邮箱/手机号-->
          <inputbox type="password" name="password" v-model="formData.password" v-validate="'required'"
                    :msgs="msgs.password" :errs="errors" :title="$t('exchange.exchange_password')"
                    :placeholder="$t('login_register.password')" :autocomplete="'on'" @keyupEnter="login"/><!--密码-->
          <div class="button-group">
            <buttonbox :class="{disabled:locked||gtLocked}" :text="$t('login_register.login')" @click="login"/><!--登录-->
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
  import {mapActions} from 'vuex'
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
    data() {
      return {
        locked: false,
        gtLocked: false,
        formData: {
          username: '',
          password: ''
        }
      }
    },
    computed: {
      usernamePlaceholder() {
        return `${this.$t('public0.public287')} ${this.$t('otc_exchange.otc_exchange_Email')}/${this.$t('account.user_center_phone')}/${this.$t('otc_exchange.otc_exchange_username')}`
      },
      msgs() {
        return {
          username: {required: this.usernamePlaceholder}, // 请输入邮箱或手机号
          password: {required: this.$t('login_register.password')} // 请输入密码
        }
      }
    },
    created() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.email.$refs.input.focus()
        }, 10)
      })
    },
    methods: {
      ...mapActions(['setApiToken', 'setUserInfo']),
      login() {
        this.$validator.validateAll().then((validResult) => {
          if (!validResult) {
            return
          }
          if (this.locked) {
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
            userApi.getRsaPublicKey((rsaPublicKey) => {
              formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
              formData.rsaPublicKey = rsaPublicKey
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
                    countryCode: res.countryCode,
                    mobile: res.mobile
                  }
                })
              }, (msg, rst) => {
                this.locked = false
                Vue.$koallTipBox({
                  icon: 'notification',
                  message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)
                })
                if (rst === 300) {
                  this.$router.push({name: 'sendemail', params: {email: this.formData.username}})
                  console.log(this.formData.username)
                }
              })
            }, () => {
              this.locked = false
            })
          }, () => {
            this.gtLocked = false
          })
        })
      },
      registerDialog() {
        this.$router.push({name: 'register'})
      },
      sendemailDialog() {
        this.$router.push({name: 'findpwd'})
      }
    }
  }
</script>

<style scoped>
  .login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100% - 70px);
    min-height: 800px;
    margin-left: auto;
    margin-right: auto;
    background: url('../assets/images/login_bg.jpg') no-repeat center;
    background-size: cover;
  }

  @media screen and (max-width: 1600px) {
    .login {
      height: calc(100% - 60px);
    }
  }

  .login-container {
    width: 1096px;
    height: 600px;
    background-color: #fff;
    box-shadow: 0 3px 20px 0 rgba(0, 0, 0, .2);
    border-radius: 15px;
  }

  .login-left {
    float: left;
    width: 50%;
    height: 100%;
    text-align: center;
    background: url(../assets/images/bg-login.png) no-repeat center center;
  }

  .login-left img {
    margin-top: 282px;
  }

  .login-right {
    position: relative;
    float: right;
    width: 50%;
    height: 100%;
  }

  .login-right-item {
    position: relative;
    box-sizing: border-box;
    height: 560px;
    padding: 80px 60px 40px;
  }

  .login-right-item .caption {
    height: 40px;
    font-size: 38px;
    line-height: 40px;
    color: #3A76E7;
  }

  .login-right-item .prompt {
    padding-bottom: 24px;
    overflow: auto;
  }

  .login-right-item .prompt i {
    float: left;
    width: 24px;
    height: 24px;
    margin-top: 12px;
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    background-color: #FF4022;
    border-radius: 50%;
  }

  .login-right-item .prompt span {
    float: left;
    min-height: 24px;
    padding: 11px 0 8px 8px;
    font-size: 18px;
    line-height: 24px;
    color: #3A76E7;
  }

  .login-right-item /deep/ .inputbox {
    width: auto !important;
    min-height: auto !important;
  }

  .login-right-item /deep/ .title {
    height: 34px;
    line-height: 34px;
    font-size: 16px;
    color: #3A76E7;
    text-align: left;
  }

  .login-right-item /deep/ .inputdiv {
    position: relative;
    display: block;
    padding-bottom: 24px;
  }

  .login-right-item /deep/ .input {
    width: 100% !important;
    height: 40px;
    margin: 0;
    font-size: 16px;
    line-height: normal;
    color: #555;
    background-color: #fff;
    border-bottom: 1px solid #DFDFDF;
    outline: none;
  }

  .login-right-item /deep/ .input:focus {
    background-color: transparent;
    border-bottom-color: #3A76E7 !important;
    outline: none;
  }

  .login-right-item /deep/ .input.error {
    background-color: transparent;
    border-bottom-color: #e53f3f;
  }

  .login-right-item /deep/ .errorinfo {
    position: absolute;
    bottom: 0;
    left: 0;
    width: auto;
    height: 24px;
    padding-top: 0;
    color: #e53f3f;
    font-style: normal;
    line-height: 24px;
    white-space: nowrap;
  }

  .login-right-item .captcha {
    overflow: auto;
  }

  .login-right-item .captcha /deep/ .inputbox {
    float: left;
    width: 280px !important;
  }

  .login-right-item .captcha img {
    float: right;
    margin-top: 34px;
    cursor: pointer;
  }

  .login-right-item .checkbox-group {
    overflow: auto;
  }

  .login-right-item .checkbox-group i {
    float: left;
    width: 14px;
    height: 14px;
    margin-top: 8px;
    color: #fdb902;
    text-indent: 1px;
    cursor: pointer;
  }

  .login-right-item .checkbox-group i:hover {
    color: #fdb902;
  }

  .login-right-item .checkbox-group span {
    float: left;
    width: 406px;
    min-height: 30px;
    padding-left: 8px;
    line-height: 30px;
  }

  .login-right-item .checkbox-group span em {
    color: #d6dff9;
  }

  .login-right-item .checkbox-group span a {
    color: #fdb902;
    text-decoration: underline;
  }

  .login-right-item .checkbox-group span a:hover {
    color: #fdb902;
  }

  .login-right-item .button-group {
    position: absolute;
    bottom: 40px;
    left: 60px;
    width: 428px;
  }

  .login-right-item .button-group /deep/ .button {
    display: block;
    justify-content: center;
    align-items: center;
    width: 100% !important;
    height: 55px !important;
    padding: 0;
    margin-top: 0;
    font-weight: bold;
    font-size: 18px;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background: -webkit-linear-gradient(left, #0589F6, #0240CF);
    background: linear-gradient(left, #0589F6, #0240CF);
  }

  .login-right-item .button-group /deep/ .button.disabled {
    background: -webkit-linear-gradient(left, #999, #666);
    background: linear-gradient(left, #999, #666);
  }

  .login-right-item .button-group .link {
    padding-top: 6px;
    overflow: auto;
  }

  .login-right-item .button-group .link a {
    height: 24px;
    line-height: 24px;
    color: #3368DA;
    text-decoration: underline;
  }

  .login-right-item .button-group .link a:first-of-type {
    float: left;
  }

  .login-right-item .button-group .link a:last-of-type {
    float: right;
  }

  .login-right-item .button-group .link a:hover {
    color: #3368DA;
  }


</style>
