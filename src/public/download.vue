<template>
    <div class="download">
        <div class="banner1">
            <div class="content">
                <div>
                    <img src="../assets/images/download/logo2.png"/>
                </div>
                <div class="title1">Stay Connected</div>
                <div class="title2">
                    <!--保持链接 实时掌握-->
                    {{$t('public0.public228')}}
                </div>
                <div class="title3">We have created the mobile tools you need for trading on the go.</div>
                <div class="buttons" v-if="isWeiXi">
                    <a class="button" @click="showTip">
                        <!--安卓下载-->
                        {{$t('public0.public226')}}
                    </a>
                    <a class="button" @click="showTip">
                        <!--IOS下载-->
                        {{$t('public0.public227')}}
                    </a>
                </div>
                <div class="buttons" v-if="!isWeiXi">
                    <a class="button" :class="{en:getLang=='en'}" href="/static/newton-pro-1127.apk" download="newton-pro-1127.apk">
                        <!--安卓下载-->
                        {{$t('public0.public226')}}
                    </a>
                    <a class="button" :class="{en:getLang=='en'}" href="https://www.pgyer.com/nCfg">
                        <!--IOS下载-->
                        {{$t('public0.public227')}}
                    </a>
                </div>
                <div class="title4">Discover the mobile apps</div>
            </div>
        </div>
        <div class="tips">
            <img src="../assets/images/download/bg2.png"/>
            <p>
              <!--微信内请点击右上角“...”按钮，使用浏览器打开。-->
              {{$t('public0.public213')}}
            </p>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import {mapGetters} from 'vuex'
export default {
  data () {
    return {
      isWeiXi: /MicroMessenger/i.test(window.navigator.userAgent)
    }
  },
  computed: {
    ...mapGetters(['getLang'])
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
.download{min-width:1200px;width:100%;min-height:556px;height:fit-content;margin:15px auto 0 auto;display:flex;flex-direction:column;align-items:center;}
.download .banner1{
    min-width:1200px;width:100%;position: relative;display:flex;align-items:center;justify-content:center;
    background:url(../assets/images/download/bg.png) no-repeat center;background-size:100%;
}
.download .banner1 > img{width:100%;}
.download .banner1 .content{min-width:1200px;margin-top:30px;}
.download .banner1 .content div img{width:300px;}
.download .banner1 .content .title1{font-size:50px;font-weight:bold;color:#4EECFF;}
.download .banner1 .content .title2{font-size:36px;font-weight:bold;color:#FFF;line-height:73px;}
.download .banner1 .content .title3{width:572px;font-size:30px;font-weight:bold;color:#FFFEFE;line-height:50px;}
.download .banner1 .content .buttons{display:flex;width:448px;justify-content:space-between;}
.download .banner1 .content .buttons .button{
    display:flex;width:200px;height:121px;line-height:140px;background:url(../assets/images/download/btn.png) no-repeat center;
    cursor: pointer;justify-content:center;color:#FFF;font-size:24px;font-weight:bold;
}
.download .banner1 .content .buttons .button.en{font-size:18px;}
.download .banner1 .content .title4{font-size:20px;font-weight:bold;color:#BAB9B9;line-height:70px;}
.download .tips{position: relative;display:flex;justify-content:center;}
.download .tips img{width:100%;}
.download .tips p{
    height:100%;position:absolute;display:flex;align-items:center;top:0px;width:1200px;
    font-size:27px;color:#010101;font-weight:bold;
}
</style>
