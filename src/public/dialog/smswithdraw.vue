<template>
  <div class="dialog">
      <div class="top">
        <div class="title">{{$t('auth_warning.warning_SMS_auth')}}<!--短信验证--></div>
        <a class="icon-close" href="javascript:;" @click="closeDialog"></a>
      </div>
      <div class="form">
        <inputbox ref="box" type="password" v-validate="'required'" name="password" :msgs="msgs.password" :errs="errors" v-model="formData.password" :title="$t('account.user_center_login_password') + '：'"  @keyupEnter="auth"/><!--登录密码-->
        <div class="smsCode">
          <inputbox v-validate="'required|pInteger'" :maxLength="6" name="smsCode" :msgs="msgs.smsCode" :errs="errors" v-model="formData.smsCode" :title="$t('account.user_center_SMS_code') + '：'"  @keyupEnter="auth"/><!--短信验证码-->
          <buttonbox :class="{disabled:disabled}" :text="sendTitle" @click="sendSMSCode"/><!--确定-->
        </div>
        <div class="buttons">
          <buttonbox :text="$t('exchange.exchange_determine')" @click="auth"/><!--确定-->
          <buttonbox :text="$t('otc_legal.otc_legal_cancel')" @click="closeDialog"/><!--取消-->
        </div>
      </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import pdialog from '@/public/dialog/dialog'
import inputbox from '@/components/formel/inputbox'
import buttonbox from '@/components/formel/buttonbox'
import myApi from '@/api/individual'
export default {
  props: ['username', 'authType'],
  components: {
    pdialog,
    inputbox,
    buttonbox
  },
  data () {
    return {
      locked: false,
      formData: {
        type: 1,
        password: '',
        smsCode: ''
      },
      disabled: false,
      time: 60
    }
  },
  computed: {
    ...mapGetters(['getUserInfo']),
    msgs () {
      return {
        password: {required: this.$t('login_register.password')}, // 请输入密码
        smsCode: {required: this.$t('login_register.verify_code'), pInteger: this.$t('error_code.NUMERIC')} // 请输入验证码
      }
    },
    sendTitle () {
      return this.$t('account.user_center_send_SMS') + (this.disabled ? `（${this.time}s）` : '') // 发送验证码
    }
  },
  created () {
    this.$nextTick(() => {
      setTimeout(() => {
        this.$refs.box.$refs.input.focus()
      }, 10)
    })
  },
  methods: {
    auth () {
      this.$validator.validateAll().then((validResult) => {
        if (!validResult) {
          setTimeout(() => {
            this.$refs.box.$refs.input.focus()
          }, 10)
          return
        }
        if (this.authType === 'getCode') {
          this.$emit('okCallback', this.formData)
          this.$emit('removeDialog')
        }
      })
    },
    closeDialog () {
      this.$emit('errCallback')
      this.$emit('removeDialog')
    },
    sendSMSCode () {
      if (this.disabled) {
        return
      }
      this.disabled = true
      myApi.sendAuthSMSCode({
        countryCode: this.getUserInfo.countryCode,
        phoneNumber: this.getUserInfo.mobile
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
        this.time = 60
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
.dialog{width:370px;height:auto;min-height:200px;display:flex;justify-content:center;flex-flow:column;background-color:#222121;}
.top{width:100%;height:30px;position:relative;background-color:#333232;}
.icon-close{position:absolute;text-decoration:none;font-size:14px;color:#becbe8;top:calc(50% - 7px);right:10px;}
.icon-close:hover{color: #fdb902;}
.title{width:100%;height:30px;line-height:30px;text-align:center;font-size:14px;color:#becbe8;}
.form{display:flex;justify-content:center;align-items:center;flex-flow:column;width:100%;margin:30px 0;}
.form /deep/ .title{color:#becbe8;}
.form /deep/ .input,.form /deep/ .input.error{background-color:#FFF;border-color:#54616c;color:#261003;}
.form /deep/ .input:focus{background-color:#FFF;}
.smsCode{position: relative;}
.smsCode /deep/ input{width:120px!important;}
.smsCode /deep/ .button{position:absolute;top:20px;right:0;}
.smsCode /deep/ .disabled{background:#999;color:#FFF;cursor:not-allowed;}
.buttons{display:flex;justify-content:space-between;align-items:center;width:272px;}
.buttons input{width:100px !important;}
.buttons input:first-child{margin-right:20px;}
.buttons input:last-child{border:1px solid #fdb902;color:#fdb902;;background:transparent;}
.buttons input:last-child:hover{border-color:#fdb902;color:#fdb902;}
</style>
