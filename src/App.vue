<template>
  <div id="app">
    <template v-if="$route.name !== 'login'">
      <!--屏蔽用户名/密码自动填写：创建假的用户名/密码input让chrome浏览器填充，在autocomplete=off不起作用时适用-->
      <input class="fake-input" type="text" name="fakeusernameremembered">
      <input class="fake-input" type="password" name="fakepasswordremembered"/>
    </template>
    <bheader v-if="$route.name !== 'homephone' && $route.name !== 'maintenance'"/>
    <div v-if="isIE" class="compatible" v-show="browser">
      <div class="compatible-w">{{$t('public0.public239').format('NEWTON')}}<!--建议您使用Chrome浏览器获取NEWTON最佳体验。如使用360或QQ浏览器，可切换至极速模式。--><span @click="closeCompa">×</span></div>
    </div>
    <router-view/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import utils from '@/assets/js/utils'
import numUtils from '@/assets/js/numberUtils'
import GlobalWebSocket from '@/assets/js/websocket'
import OtcWebSocket from '@/assets/js/websocket-otc'
import bheader from '@/components/header'
import userApi from '@/api/user'
export default {
  name: 'app',
  components: {
    bheader
  },
  data () {
    return {
      ws: null,
      gws: null,
      browser: true,
      fromRoute: null
    }
  },
  computed: {
    ...mapGetters(['getApiToken', 'getOtcSocketEvents', 'getLang']),
    isIE () {
      // (true = IE9) || true >= IE10
      return (document.all && document.addEventListener && !window.atob) || (document.body.style.msTouchAction !== undefined)
    }
  },
  watch: {
    getLang () {
      utils.gtValidate()
    },
    getApiToken (val) {
      if (val) {
        this.getUserInfoMethod()
      }
      try {
        this.gws.changeLogin()
      } catch (ex) {
        console.warn(ex)
      }
      if (val) {
        // 登录跳转
        let tempName = null
        if (this.fromRoute) {
          if (this.fromRoute.meta.goHome) {
            tempName = 'home'
          } else {
            tempName = this.fromRoute.name === 'login' ? 'home' : this.fromRoute.name
          }
        } else {
          tempName = 'home'
        }
        this.$router.push({name: tempName})
        try {
          this.ws && this.ws.open()
        } catch (ex) {
          window.console.warn(ex)
        }
      } else {
        this.$route.meta.login ? this.$router.push({name: 'home'}) : void 0
        try {
          this.ws && this.ws.close()
        } catch (ex) {
          window.console.warn(ex)
        }
      }
    },
    '$route' (to, from) {
      this.fromRoute = from
      this.checkRouteChange(to)
    }
  },
  created () {
    this.getUserInfoMethod()
    this.checkRouteChange(this.$route)
    this.ws = new OtcWebSocket({
      onMessage: (data) => {
        let events = this.getOtcSocketEvents
        for (let i = 0; i < events.length; i++) {
          let ev = events[i]
          ev(data)
        }
      }
    })
    this.gws = new GlobalWebSocket({
      type: 'global',
      checkNetWork: (signal) => {
        this.setNetworkSignal(signal)
      },
      onClose: () => {
        this.setNetworkSignal(3)
      },
      callback: (res) => {
        if (res.dataType === 'LastValuation') {
          this.setUSDCNY({
            USD: numUtils.BN(res.USD).toFixed(2),
            CNY: numUtils.BN(res.USDCNY).toFixed(2)
          })
          this.setBTCValuation(numUtils.BN(res.totalAmount).toFixed(8)) // 当前转换人民币
        }
      }
    })
    if (utils.isMobile) {
      var f = Math.min(window.screen.width, window.screen.height)
      document.documentElement.className = 'phone'
      document.documentElement.style.fontSize = f / 7.5 + 'px'
    }
  },
  beforeDestroy () {
    this.ws && this.ws.close()
  },
  methods: {
    ...mapActions(['setBTCValuation', 'setUSDCNY', 'setNetworkSignal', 'setUserInfo']),
    checkRouteChange (currentRoute) {
      if (this.getApiToken) {
        currentRoute.meta.noEntry ? this.$router.push({name: 'home'}) : void 0
      } else {
        currentRoute.meta.login ? this.$router.push({name: 'home'}) : void 0
      }
    },
    closeCompa () {
      this.browser = false
    },
    getUserInfoMethod () {
      if (!this.getApiToken) {
        return
      }
      userApi.getUserInfo((userInfo) => {
        if (this.getApiToken) {
          this.setUserInfo(userInfo)
        }
      }, (res) => {
        console.warn(res)
        setTimeout(() => {
          this.getUserInfoMethod()
        }, 1000)
      })
    }
  }
}
</script>

<style scoped>
.fake-input{position: absolute;clip: rect(0, 0, 0, 0);}
.mycenter{position: fixed;z-index: 9999;top: 50%;width: 24px;height: 50px;margin-top: -25px;background: url(./assets/images/slide.png) no-repeat center center;}
.mycenter.arrow-left{right: 0;}
.mycenter.arrow-right{left: 0;transform: rotate(180deg);}
.mycenter.arrow-left:hover{animation: arrowAnimation 500ms infinite;}
.mycenter.arrow-right:hover{animation: arrowAnimation 500ms infinite;}
@keyframes arrowAnimation{
  0% {background-position: center;}
  50% {background-position: left;}
  100% {background-position: center;}
}
.dialog{position: absolute;z-index: 999;top: 60px;left: 0;right: 0;min-width: 1200px;min-height: calc(100% - 60px);background-color: #404b69;transition: opacity .5s ease, transform .5s ease;}
.dialog.fadeAndSlide-enter-active{opacity: 0;transform: translate(100%, 0);}
.dialog.fadeAndSlide-enter-to{opacity: 1;transform: translate(0, 0);}
.dialog.fadeAndSlide-leave-active{opacity: 1;transform: translate(0, 0);}
.dialog.fadeAndSlide-leave-to{opacity: 0;transform: translate(100%, 0);}
.dialog-container{width: 1200px;margin-left: auto;margin-right: auto;}
.compatible{height: 46px;line-height: 46px; background-color:#3d99d2;color: #fff; }
.compatible-w{width: 1200px;margin: 0 auto;text-align: center;font-size: 16px;position: relative;}
.compatible-w span{font-size: 24px;position: absolute;right: 2px;cursor: pointer;}
</style>

