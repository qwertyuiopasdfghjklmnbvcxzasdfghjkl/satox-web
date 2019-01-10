<template>
  <div class="dialog">
      <div class="top">
        <div class="title">{{$t('auth_warning.warning_google_auth')}}<!--谷歌认证--></div>
        <a class="icon-close" href="javascript:;" @click="closeDialog"></a>
      </div>
      <div class="form">
        <inputbox ref="box" v-validate="'required|pInteger'" :maxLength="6" name="verifyCode" :msgs="msgs.verifyCode" :errs="errors" v-model="formData.verifyCode" :title="$t('account.user_center_Google_verification_code')"  @keyupEnter="auth"/><!--谷歌验证码-->
        <buttonbox :text="$t('exchange.exchange_determine')" @click="auth"/><!--确定-->
        <div class="warm-prompt" v-if="isWithdrawal">
          <p>{{$t('public0.public243')}}：<!--温馨提示--></p>
          <p>{{$t('account.user_prompt8')}}<!--提现请求申请成功后，请去邮箱点击链接确认本次提现请求。--></p>
        </div>
      </div>
  </div>
</template>

<script>
import Vue from 'vue'
import pdialog from '@/public/dialog/dialog'
import inputbox from '@/components/formel/inputbox'
import buttonbox from '@/components/formel/buttonbox'
import myApi from '@/api/individual'
export default {
  props: ['username', 'authType', 'isWithdrawal'],
  components: {
    pdialog,
    inputbox,
    buttonbox
  },
  data () {
    return {
      locked: false,
      formData: {
        verifyCode: ''
      }
    }
  },
  computed: {
    msgs () {
      return {
        verifyCode: {required: this.$t('login_register.verify_code'), pInteger: this.$t('error_code.NUMERIC')} // 请输入验证码
      }
    }
  },
  watch: {
    'formData.verifyCode' (newVal) {
      if (newVal.length > 6) {
        this.$nextTick(() => {
          this.formData.verifyCode = newVal.substring(0, 6)
        })
      }
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
          this.$emit('okCallback', this.formData.verifyCode)
          this.$emit('removeDialog')
          return
        }
        if (this.locked) {
          return
        }
        this.locked = true
        myApi.loginTwo({
          verifyCode: this.formData.verifyCode,
          username: this.username
        }, (apiToken) => {
          this.$emit('okCallback', apiToken)
          this.$emit('removeDialog')
        }, (msg) => {
          this.locked = false
          this.formData.verifyCode = ''
          setTimeout(() => {
            this.$refs.box.$refs.input.focus()
          }, 10)
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
      })
    },
    closeDialog () {
      this.$emit('errCallback')
      this.$emit('removeDialog')
    }
  }
}
</script>

<style scoped>
.dialog{width:370px;background-color: #fff; border-top-left-radius: 10px; border-top-right-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px #5d5d5d;}
.top{height: 40px;line-height: 40px;color: #fff;font-size: 18px;  text-align: center;background-color: #0D66EF; position: relative;}
.icon-close{position:absolute;text-decoration:none;font-size:14px;color:#fff;top:13px;right:13px; opacity: 0.8;}
.icon-close:hover{opacity: 1;}
/*.title{width:100%;height:30px;line-height:30px;text-align:center;font-size:14px;color:#becbe8;}*/
.form{display:flex;justify-content:center;align-items:center;flex-flow:column;width:100%;margin:30px 0;}
.form /deep/ .input,.form /deep/ .input.error{color:#333; background-color: transparent; border: 1px solid #ccc; height: 32px; box-sizing: border-box;}
.form /deep/ .input:focus{background-color:#FFF;}
.warm-prompt{width: 272px;padding-top: 20px;}
.warm-prompt p{min-height: 20px;line-height: 20px;color: #666;}
</style>
