<template>
    <div class="mailbox">
        <div class="mailbox-title">{{$t('public.withdrawal_confirm')}}<!--提币确认--></div>
        <div class="mailbox-cont">
            <img class="mailbox-img" width="84" height="67" src="../../assets/images/tibiqueren.png" />
            <p class="mailbox-p">{{$t('public.withdrawal_successful')}}<!--提币请求确认成功！可在“我的数字资产”窗口点击“历史记录”查看提币进度。--></p>
            <a class="mailbox-a" href="javascript:;" @click="closeWin">{{$t('public.close_window')}}<!--关闭窗口--></a>
        </div>
    </div>
</template>

<script>
export default {
  methods: {
    closeWin () {
      window.opener = null
      window.close()
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

