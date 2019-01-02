<template>
    <div class="nickname-dialog">
        <div class="nickname-dialog-title">{{$t('public0.public40')}}<!--修改昵称--></div>
        <div class="nickname-dialog-form">
            <div class="nickname-dialog-row">
                <label class="nickname-dialog-label"><em class="asterisk">*&nbsp;</em>{{$t('public0.public187')}}（{{$t('account.user_center_set_username')}}）<!--请输入昵称（昵称只能设置一次）--></label>
                <input class="nickname-dialog-input" :class="{error: errors.has('nickname')}" type="text" v-model="nicknameValue" v-validate="'required'" data-vv-name="nickname"/>
                <span class="nickname-dialog-prompt">{{errors.has('nickname') ? $t('public0.public73') : ''}}<!--请输入昵称--></span>
            </div>
            <div class="nickname-dialog-btns">
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
.nickname-dialog{width: 400px;background-color: #fff; border-top-left-radius: 10px; border-top-right-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px #5d5d5d;}
.nickname-dialog-title{height: 60px;line-height: 60px;color: #fff;font-size: 18px;  text-align: center;background-color: #0D66EF;}
.nickname-dialog-form{padding: 30px 30px 60px; position: relative;}
.nickname-dialog-row:last-of-type{padding-top: 10px;font-size: 0;line-height: 0;text-align: center;}
.nickname-dialog-label{display: block;min-height: 24px;margin-bottom: 10px;line-height: 24px;color: #333;}
.nickname-dialog-label em.asterisk{position: relative;top: 5px;line-height: 0;font-size: 18px;color: red;}
.nickname-dialog-input{
  display: block;width: 330px;height: 40px;color:#333;background-color: transparent;border: 1px solid #8EBFFB;
  background:#FFF; border-radius: 4px; font-size: 16px;
}
.nickname-dialog-input.error{border-color: #e53f3f;}
.nickname-dialog-prompt{display: block;height: 30px;line-height: 30px;color: #e53f3f;}
.nickname-dialog-confirm{color: #fff;background-color: #0D66EF;}
.nickname-dialog-confirm:hover{background-color: #0b4cb1;}
.nickname-dialog-cancel{color: #A3A3A3;background-color: #F5F5F5;border:none;}
.nickname-dialog-cancel:hover{color: #666;}
.nickname-dialog-btns {position: absolute; left: 0; right: 0; bottom: 0; display: flex;}
.nickname-dialog-btns button {flex: 1; height: 50px; font-size: 16px;}
</style>
