<template>
  <div class="container">
    <div class="resetpwd-title">{{$t('error_code.RESETCODE_FAIL')}}<!--重置密码--></div>
    <div class="resetpwd-cont">
      <inputbox id="newton-password" v-validate="'required|password'" type="password" name="password" :msgs="msgs.password" :errs="errors" v-model="formData.password" :title="$t('account.user_center_new_password')"/><!--新密码-->
      <inputbox v-validate="'required|passwordAgain'" type="password" name="passwordAgain" :msgs="msgs.passwordAgain" :errs="errors" v-model="formData.passwordConfirm" :title="$t('account.user_center_confirm_password')"/><!--确认新密码-->
      <buttonbox :text="$t('exchange.exchange_determine')" @click="resetPwd"/>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import userApi from '@/api/user'
import utils from '@/assets/js/utils'
import inputbox from '@/components/formel/inputbox'
import buttonbox from '@/components/formel/buttonbox'
export default {
  name: 'app',
  components: {
    inputbox,
    buttonbox
  },
  data () {
    return {
      locked: false,
      formData: {
        resetCode: utils.getUrlHashParams().code,
        password: '',
        passwordConfirm: ''
      }
    }
  },
  computed: {
    msgs () {
      return {
        password: {required: this.$t('account.user_center_Please_new_password')}, // 请输入新密码
        passwordAgain: {required: this.$t('account.user_center_Please_new_password')} // 请输入新密码
      }
    }
  },
  methods: {
    resetPwd () {
      this.$validator.validateAll().then((validResult) => {
        if (!validResult) {
          return
        }
        if (this.locked) {
          return
        }
        this.locked = true
        let formData = {}
        for (let i in this.formData) {
          formData[i] = this.formData[i]
        }
        userApi.getRsaPublicKey((rsaPublicKey) => {
          formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
          formData.passwordConfirm = utils.encryptPwd(rsaPublicKey, formData.passwordConfirm)
          formData.rsaPublicKey = rsaPublicKey
          userApi.forgetPwdChangePwd(formData, () => {
            Vue.$koallTipBox({icon: 'success', message: this.$t('account.user_center_Successful')}) // 操作成功
            setTimeout(() => {
              this.$router.push({name: 'login'})
            }, 1500)
          }, (msg) => {
            this.locked = false
            Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)})
            setTimeout(() => {
              this.$router.push({name: 'findpwd'})
            }, 1500)
          })
        }, () => {
          this.locked = false
        })
      })
    }
  }
}
</script>

<style scoped>
.container{width: 1000px;margin-left: auto;margin-right: auto;padding-top: 10px;}
.resetpwd-title{height: 24px;line-height: 24px;color: #becbe8;text-indent: 8px;background-color: #1e2233;}
.resetpwd-cont{display: flex;flex-flow: column;align-items: center;justify-content: center;height: 320px;background-color: #181b2a;}
.resetpwd-cont /deep/ .button{margin-top: 12px;}
</style>

