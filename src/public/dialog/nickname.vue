<template>
    <div class="nickname-dialog">
        <div class="nickname-dialog-title">{{$t('public0.public40')}}<!--修改昵称--></div>
        <div class="nickname-dialog-form">
            <div class="nickname-dialog-row">
                <label class="nickname-dialog-label">{{$t('public0.public187')}}（{{$t('account.user_center_set_username')}}）<!--请输入昵称（昵称只能设置一次）--><em class="asterisk">&nbsp;*</em></label>
                <input class="nickname-dialog-input" :class="{error: errors.has('nickname')}" type="text" v-model="nicknameValue" v-validate="'required'" data-vv-name="nickname"/>
                <span class="nickname-dialog-prompt">{{errors.has('nickname') ? $t('public0.public73') : ''}}<!--请输入昵称--></span>
            </div>
            <div class="nickname-dialog-row">
                <button class="nickname-dialog-cancel" @click="closeDialog">{{$t('otc_legal.otc_legal_cancel')}}<!--取消--></button>
                <button class="nickname-dialog-confirm" @click="submit">{{$t('exchange.exchange_determine')}}<!--确定--></button>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import userApi from '@/api/individual'
export default {
  props: ['nickname'],
  data () {
    return {
      nicknameValue: this.nickname
    }
  },
  watch: {
    nickname () {
      this.nicknameValue = this.nickname
    },
    nicknameValue (newVal, oldVal) {
      if (newVal.length > 50) {
        this.nicknameValue = oldVal
      }
    }
  },
  methods: {
    closeDialog () {
      this.$emit('removeDialog')
    },
    submit () {
      this.$validator.validateAll().then((valid) => {
        if (!valid) {
          return
        }
        userApi.editNickname({
          nickname: this.nicknameValue
        }, (msg) => {
          this.$emit('okCallback', this.nicknameValue)
          Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
          this.closeDialog()
        }, (msg) => {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
      })
    }
  }
}
</script>

<style scoped>
.nickname-dialog{width: 400px;background-color: #222121;}
.nickname-dialog-title{height: 30px;line-height: 30px;color: #becbe8;text-align: center;background-color: #333232;}
.nickname-dialog-form{padding: 30px;}
.nickname-dialog-row:last-of-type{padding-top: 10px;font-size: 0;line-height: 0;text-align: center;}
.nickname-dialog-label{display: block;min-height: 24px;margin-bottom: 10px;line-height: 24px;color: #becbe8;}
.nickname-dialog-label em.asterisk{position: relative;top: 5px;line-height: 0;font-size: 18px;color: #e53f3f;}
.nickname-dialog-input{
  display: block;width: 330px;height: 28px;color:#261003;background-color: transparent;border: 1px solid #54616c;
  background:#FFF;
}
.nickname-dialog-input.error{border-color: #e53f3f;}
.nickname-dialog-prompt{display: block;height: 30px;line-height: 30px;color: #e53f3f;}
.nickname-dialog-confirm,
.nickname-dialog-cancel{min-width: 80px;height: 30px;padding-left: 24px;padding-right: 24px;border-radius: 4px;cursor: pointer;}
.nickname-dialog-confirm{color: #261003;background-color: #fdb902;}
.nickname-dialog-confirm:hover{background-color: #fdb902;}
.nickname-dialog-cancel{margin-right: 24px;color: #fdb902;background-color: transparent;border:1px solid #fdb902;}
.nickname-dialog-cancel:hover{color: #fdb902;border-color: #fdb902;}
</style>
