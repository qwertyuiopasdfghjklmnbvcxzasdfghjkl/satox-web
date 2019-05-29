<template>
    <div class="download">
        <div class="banner1">
            <div class="content">
                <section class="left">
                  <span class="logo"></span>
                  <h1 class="title1">{{$t('public0.public285')}}</h1>
                  <h3 class="title2">{{$t('public0.public286')}}</h3>
                  <div class="buttons" v-if="isWeiXi">
                      <a class="button" @click="showTip" v-if="android">
                          <!--安卓下载-->
                          {{$t('public0.public226')}}
                      </a>
                      <a class="button" @click="showTip" v-if="apple">
                          <!--IOS下载-->
                          {{$t('public0.public227')}}
                      </a>
                  </div>
                  <div class="buttons" v-if="!isWeiXi">
                      <div class="qrcode" ref="qrcode_apk" v-show="android"></div>
                      <a class="button" :class="{en:getLang=='en'}" :href="apk" target="_blank" v-if="android">
                          <!--安卓下载-->
                          <img src="../assets/images/download/android.png">{{$t('public0.public226')}}
                      </a>
                      <!--IOS下载-->
                      <div class="qrcode" ref="qrcode_ios" v-show="apple"></div>
                      <a class="button" :class="{en:getLang=='en'}" :href="apple" target="_blank" v-if="apple">
                          <img src="../assets/images/download/iphone.png">{{$t('public0.public227')}}
                      </a>
                  </div>
                </section>
                <section class="right">
                  <span class="mobile"></span>
                </section>
            </div>
        </div>

    </div>
</template>

<script>
import Vue from 'vue'
import {mapGetters} from 'vuex'
import utils from '@/assets/js/utils'
import config from '@/assets/js/config'
import market from '@/api/market'
export default {
  data () {
    return {
      android:'',
      apple:'',
      isWeiXi: /MicroMessenger/i.test(window.navigator.userAgent),
      // ios:'https://www.pgyer.com/68kt'
    }
  },
  computed: {
    ...mapGetters(['getLang']),
    apk(){
        return `${config.origin}${this.android}`
    }
  },
  created(){
    this.getrateSysparams()
  },
  watch:{
    android(_new){
      if(_new){
        this.initAndroidQr()
      }
    },
    apple(_new){
      if(_new){
        this.initAppleQr()
      }
    }
  },
  methods: {
    initAndroidQr(){
      utils.qrcode(this.$refs.qrcode_apk, {
        text: this.apk,
        width: 150,
        height: 150
      })
    },
    initAppleQr(){
      utils.qrcode(this.$refs.qrcode_ios, {
        text: this.apple,
        width: 150,
        height: 150
      })
    },
    getrateSysparams () {
      market.getSysparams((res) => {
        res.forEach((item) => {
          if (item.code === 'androidPath') {
            this.android = item.value
          }
          if (item.code === 'appleUrl') {
            this.apple = item.value
          }
        })
      })
    },
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
.qrcode { margin-top: 20px;}
.qrcode /deep/ img {margin-left: auto; margin-right: auto; border: 10px solid #fff;}
.logo {
  width: 125px;
  height: 125px;
  display: inline-block;
  background: url('../assets/images/bg-login.png') no-repeat center;
  background-size: contain;
}
.download{min-width:1200px;width:100%; height: calc(100% - 70px);display:flex;flex-direction:column;align-items:center; background:url(../assets/images/download/bg.jpg) #010A1E no-repeat center;background-size:cover;}
@media screen and (max-width: 1600px) {
  .download {height: calc(100% - 60px);}
}
.download .banner1{
    min-width:1200px;width:100%;position: relative;display:flex;align-items:center;justify-content:center;

}
.download .banner1 .content{min-width:1200px; display: flex; justify-content: space-between; padding-top: 50px;}
.download .banner1 .content .left {width: 320px; text-align: center; margin-left: 100px;}
.download .banner1 .content .title1{font-size:36px;font-weight:bold;color:#C89E56; margin-top: 20px;}
.download .banner1 .content .title2{font-size:24px;font-weight:normal;color:#fff;line-height:50px;}
.download .banner1 .content .buttons .button{
    display: block; text-align: center; height:50px; line-height: 50px; cursor: pointer; color:#FFF;font-size:18px; background: -webkit-linear-gradient(#C89E56, #8c6e41); background: linear-gradient(#C89E56, #8c6e41); border-radius: 4px; margin-top: 30px;
}
.download .banner1 .content .buttons .button img{ vertical-align: middle; margin-right: 20px;height: 24px; }
.download .banner1 .content .buttons .button.en{font-size:18px;}
.download .tips{position: relative;display:flex;justify-content:center;}
.download .tips img{width:100%;}
.download .tips p{
    height:100%;position:absolute;display:flex;align-items:center;top:0px;width:1200px;
    font-size:27px;color:#010101;font-weight:bold;
}
.mobile {display: inline-block;
width: 534px;
height: 715px;
background:url(../assets/images/download/mobile.png) no-repeat center;background-size:contain; 
}
</style>
