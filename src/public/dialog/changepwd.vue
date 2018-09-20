<template>
  <div class="dialog">
      <div class="top">
        <div class="title">{{$t('account.user_center_change_password')}}<!--修改密码--></div>
        <a class="icon-close" href="javascript:;" @click="closeDialog"></a>
      </div>
      <div class="form">
        <inputbox v-validate="'required'" type="password" name="passwordOld" :msgs="msgs.passwordOld" :errs="errors" v-model="formData.passwordOld" :title="$t('account.user_center_old_password')"/><!--原密码-->
        <inputbox id="newton-password" v-validate="'required|password'" type="password" name="password" :msgs="msgs.password" :errs="errors" v-model="formData.password" :title="$t('account.user_center_new_password')"/><!--新密码-->
        <inputbox v-validate="'required|passwordAgain'" type="password" name="passwordAgain" :msgs="msgs.passwordAgain" :errs="errors" v-model="formData.passwordConfirm" :title="$t('login_register.confirm_new_password')"/><!--确认新密码-->
        <div class="row">
          <p>{{$t('public0.public242')}}:</p>
          <p>{{$t('error_code.CHANGE_PASSWORD_SUCCESS')}}</p>
        </div>
        <buttonbox :text="$t('exchange.exchange_determine')" @click="changePwd"/><!--确定-->
      </div>
  </div>
</template>

<script>
import Vue from 'vue'
import pdialog from '@/public/dialog/dialog'
import inputbox from '@/components/formel/inputbox'
import buttonbox from '@/components/formel/buttonbox'
import userApi from '@/api/user'
import utils from '@/assets/js/utils'
export default {
  components: {
    pdialog,
    inputbox,
    buttonbox
  },
  data () {
    return {
      locked: false,
      formData: {
        passwordOld: '',
        password: '',
        passwordConfirm: ''
      }
    }
  },
  computed: {
    msgs () {
      return {
        passwordOld: {required: this.$t('account.user_center_Please_old_password')}, // 请输入旧密码
        password: {required: this.$t('account.user_center_Please_new_password')}, // 请输入新密码
        passwordAgain: {required: this.$t('account.user_center_Please_new_password')} // 请输入新密码
      }
    }
  },
  methods: {
    changePwd () {
      this.$validator.validateAll().then((validResult) => {
        if (!validResult) {
          return
        }
        if (this.locked) {
          return
        }
        utils.gtValidate((gtParams) => {
          let formData = {}
          for (let i in this.formData) {
            formData[i] = this.formData[i]
          }
          for (let i in gtParams) {
            formData[i] = gtParams[i]
          }
          this.locked = true
          userApi.getRsaPublicKey((rsaPublicKey) => {
            formData.passwordOld = utils.encryptPwd(rsaPublicKey, formData.passwordOld)
            formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
            formData.passwordConfirm = utils.encryptPwd(rsaPublicKey, formData.passwordConfirm)
            formData.rsaPublicKey = rsaPublicKey
            userApi.changePwd(formData, (msg) => {
              this.locked = false
              Vue.$koallTipBox({icon: 'success', message: this.$t('error_code.CHANGE_PASSWORD_SUCCESS')})
              this.$emit('removeDialog')
            }, (msg) => {
              this.locked = false
              Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)})
            })
          }, () => {
            this.locked = false
          })
        })
      })
    },
    closeDialog () {
      this.$emit('removeDialog')
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
.captcha /deep/ em.errorinfo{white-space:nowrap!important;}
.captcha,.bottom{display:flex;justify-content:space-between;width:272px;}
.code-image{width:100px;height:32px;cursor:pointer;}
.bottom{margin-top:5px;}
.row{display:flex;flex-direction:column;width:272px;padding-bottom:20px;color:#becbe8;}
.row p:last-child{line-height:24px;}
</style>
