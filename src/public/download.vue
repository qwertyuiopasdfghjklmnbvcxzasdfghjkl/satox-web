<template>
    <div class="download">
        <p class="title">{{$t('public0.public212')}}</p>
        <div><img src="../assets/images/download/mobile.png"/></div>
        <template v-if="isWeiXi">
            <a class="button mtb" @click="showTip">
                <img width="24px" height="28px" src="../assets/images/download/iphone.png"/>
                <span>iPhone</span>
            </a>
            <a class="button" @click="showTip">
                <img width="20px" height="25px" src="../assets/images/download/android.png"/>
                <span>Android</span>
            </a>
        </template>
        <template v-if="!isWeiXi">
            <a class="button mtb" href="https://www.pgyer.com/nCfg">
                <img width="24px" height="28px" src="../assets/images/download/iphone.png"/>
                <span>iPhone</span>
            </a>
            <a href="/static/newton-pro-0918.apk" class="button" download="newton-pro-0918.apk">
                <img width="20px" height="25px" src="../assets/images/download/android.png"/>
                <span>Android</span>
            </a>
        </template>
        <p class="wechat">
            <!--微信内请点击右上角“...”按钮，使用浏览器打开。-->
            {{$t('public0.public213')}}
        </p>
    </div>
</template>

<script>
import Vue from 'vue'
export default {
  data () {
    return {
      isWeiXi: /MicroMessenger/i.test(window.navigator.userAgent)
    }
  },
  methods: {
    showTip () {
      Vue.$koallTipBox({icon: 'notification', message: this.$t('public0.public213')})
    },
    showTip2 () {
      Vue.$confirmDialog({content: 'Coming soon', showCancel: false})
    }
  }
}
</script>

<style scoped>
.download{width:828px;min-height:556px;height:fit-content;margin:91px auto 0 auto;padding-top: 10px;display:flex;flex-direction:column;align-items:center;background:#1B1B1B;}
.download .title{color:#FCDA00;font-size:16px;margin:31px 0 15px 0;}
.download .button{display:flex;width:260px;height:50px;border:1px solid #FCDA00;color:#FCDA00;align-items:center;}
.download .button.mtb{margin:41px 0 26px 0;}
.download .button img{margin-left:70px}
.download .button span{margin-left:18px;}
.download .wechat{color:#CCC;font-size:14px;margin-top:21px;margin-top:10px;padding:0 20px;}

@media screen and (max-width: 868px){
    .download{width:calc(100% - 40px);min-height:500px;margin-top:30px;margin-bottom:30px;}
    .download .title{margin:15px 0;}
    .download .button.mtb{margin:20px 0 15px 0;}
}
</style>
