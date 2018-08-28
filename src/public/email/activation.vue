<template>
    <div class="mailbox">
        <div class="mailbox-title">{{$t('public0.public159')}}<!--邮箱验证--></div>
        <div class="mailbox-cont">
            <img class="mailbox-img" width="84" height="67" src="../../assets/images/activemailbox.png" />
            <p class="mailbox-p">{{$t('public0.public71')}}<!--邮箱未激活--></p>
            <a class="mailbox-a" href="javascript:;" @click="sendEmail">{{$t('public0.public72')}}<!--发送邮件--></a>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import userApi from '@/api/user'
export default {
  methods: {
    sendEmail () {
      let email = this.$route.params.email
      userApi.reSendEmail({
        email: email,
        username: email
      }, (msg) => {
        Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
      }, (msg) => {
        Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)})
      })
    }
  }
}
</script>

<style scoped>
.mailbox{width: 1000px;margin-left: auto;margin-right: auto;padding-top: 10px;}
.mailbox-title{height: 24px;line-height: 24px;color:#becbe8;text-indent: 8px;background-color: #1e2233;}
.mailbox-cont{display: flex;flex-flow: column;justify-content: center;align-items: center;height: 320px;background-color: #181b2a;}
.mailbox-p{margin: 30px 0 20px 0;font-size: 16px;color: #11a8fe;}
.mailbox-a{display: inline-block;min-width: 110px;height: 30px;padding:0 20px;line-height: 30px;color: #fff;text-align: center;background-color: #11a8fe;border-radius: 4px;}
.mailbox-a:hover{background-color: #15c9ff;}
</style>

