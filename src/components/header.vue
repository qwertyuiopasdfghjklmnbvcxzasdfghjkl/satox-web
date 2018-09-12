<template>
    <div class="header">
        <div class="header-fixed">
        <div class="header-center" :class="{'full-screen': $route.name === 'exchange_index2' || $route.name === 'exchange_index'}">
            <div class="center-left">
                <a href="javascript:;" @click="goHome"></a>
                <ul class="maxWidth">
                    <li>
                      <a @click="reloadPage('otc_index')" :class="{'current':$route.name==='otc_index'}">
                        {{$t('otc_public.otc_navigation_trade')}}<!--OTC-->
                      </a>
                    </li>
                    <li>
                      <a @click="reloadPage('exchange_index')" :class="{'current':$route.name==='exchange_index2' || $route.name==='exchange_index'}">
                        {{$t('public.navigation_exchange')}}<!--币币交易-->
                      </a>
                    </li>
                    <li>
                      <a :href="noticeUrl" target="_blank">
                        {{$t('public.navigation_news')}}<!--公告中心-->
                      </a>
                    </li>
                    <li>
                      <a :href="helperUrl" target="_blank">
                        {{$t('public.navigation_support')}}<!--帮助中心-->
                      </a>
                    </li>
                    <li>
                      <router-link :to="{name:'download'}">
                        {{$t('public0.public212')}}<!--APP下载-->
                      </router-link>
                    </li>
                </ul>
            </div>
            <div class="center-right">
                <ul class="minWidth">
                  <li>
                    <a class="icon-market-list1" @click="showMinMenu=!showMinMenu"></a>
                  </li>
                </ul>
                <ul class="maxWidth">
                    <li class="translations" @mouseover="showLang=true" @mouseout="showLang=false">
                        <a :class="{unfold: showLang}" href="javascript:;">
                          {{getCurLang.name}}<i class="icon-arrow-down"></i>
                        </a>
                        <ul class="lang-list" v-show="showLang">
                            <li class="lang-item" v-for="item in languages" :key="item.id" @click="setLanguage(item.id)">
                                {{item.name}}
                            </li>
                        </ul>
                    </li>
                    <li v-if="!isLogin">
                        <a href="javascript:;" @click="registerDialog">
                            {{$t('public.navigation_register')}}<!--注册-->
                        </a>
                    </li>
                    <li v-if="!isLogin">
                        <a href="javascript:;" @click="loginDialog">
                            {{$t('public.navigation_login')}}<!--登录-->
                        </a>
                    </li>
                    <li v-if="isLogin">
                        <a href="javascript:;" @click="loginOut">
                            {{$t('public.navigation_logout')}}<!--退出-->
                        </a>
                    </li>
                    <li v-if="isLogin">
                        <a @click="reloadPage('mycenter')">{{username}}</a>
                    </li>
                    <li class="message" @mouseover="showPanel" @mouseout="hidePanel">
                        <a class="icon-small-bell" :class="{'unfold': showMessage}" href="javascript:;">
                            <em class="message-new" v-if="hasNewMessage"></em>
                        </a>
                        <div class="message-panel" :class="{'message-panel-show':showMessage}">
                            <div class="message-panel-arrow"></div>
                            <!--<div class="message-panel-white"></div>-->
                            <div class="message-panel-container" :class="{'all-center':!isLogin || (isLogin && messageList.length === 0)}">
                                <div class="message-panel-list" v-if="isLogin && messageList.length > 0">
                                    <div class="message-panel-list-item" :class="{'message-readed':item.messageState === 1}" v-for="(item, index) in messageList" :key="index" @click="goPage(item)">
                                        <p class="message-panel-list-item-title">{{formatSystemMessage(item.title, item.msgType !== 5)}}</p>
                                        <p class="message-panel-list-item-time">{{item.msgTime}}</p>
                                    </div>
                                </div>
                                <div class="message-panel-nodata" v-if="isLogin && messageList.length === 0">
                                    <div class="nodata-icon icon-msg-nodata"></div>
                                    <div class="nodata-text">
                                        {{$t('message.no_message')}}<!--暂无站内消息-->
                                    </div>
                                </div>
                                <div class="message-panel-nologin" v-if="!isLogin">
                                    <div class="nologin-icon icon-msg-hi"></div>
                                    <div class="nologin-text">
                                        {{$t('message.msg_use_BITARK').format('NEWTON')}}<!--欢迎使用NEWTON!-->
                                    </div>
                                    <div class="nologin-text">
                                        {{$t('message.msg_please')}}<!--请先-->
                                        <a href="javascript:;" @click="loginDialog">{{$t('login_register.login')}}</a><!--登录-->
                                        {{$t('message.msg_or')}}<!--或-->
                                        <a href="javascript:;" @click="registerDialog">{{$t('login_register.register')}}</a><!--注册-->
                                    </div>
                                </div>
                            </div>
                            <div class="message-panel-operation" v-if="isLogin">
                              <span class="op-view" @click="goMessagePage">{{$t('message.view_all_message')}}<!--查看全部消息--></span>
                              <span class="op-mark" :class="{disabled: unReadLength === 0}" @click="markAllMsg">{{$t('message.all_read')}}<!--全部标记为已读--></span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        </div>
        <ul class="minWidthList" :class="{show:showMinMenu}" v-show="showMinMenu" @click="showMinMenu=false">
          <li>
            <a @click="reloadPage('otc_index')" :class="{'current':$route.name==='otc_index'}">
              {{$t('otc_public.otc_navigation_trade')}}<!--OTC-->
            </a>
          </li>
          <li>
            <a @click="reloadPage('exchange_index')" :class="{'current':$route.name==='exchange_index2' || $route.name==='exchange_index'}">
              {{$t('public.navigation_exchange')}}<!--币币交易-->
            </a>
          </li>
          <li>
            <a :href="noticeUrl" target="_blank">
              {{$t('public.navigation_news')}}<!--公告中心-->
            </a>
          </li>
          <li>
            <a :href="helperUrl" target="_blank">
              {{$t('public.navigation_support')}}<!--帮助中心-->
            </a>
          </li>
          <li>
            <router-link :to="{name:'download'}">
              {{$t('public0.public212')}}<!--APP下载-->
            </router-link>
          </li>
          <li v-if="!isLogin">
            <a href="javascript:;" @click="registerDialog">
              {{$t('public.navigation_register')}}<!--注册-->
            </a>
          </li>
          <li v-if="!isLogin">
            <a href="javascript:;" @click="loginDialog">
              {{$t('public.navigation_login')}}<!--登录-->
            </a>
          </li>
          <li v-if="isLogin">
            <a @click="reloadPage('mycenter')">{{username}}</a>
          </li>
          <li v-if="isLogin">
            <a href="javascript:;" @click="loginOut">
              {{$t('public.navigation_logout')}}<!--退出-->
            </a>
          </li>
        </ul>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import langApi from '@/api/language'
import msgApi from '@/api/individual'
import utils from '@/assets/js/utils'
export default {
  data () {
    return {
      showMinMenu: false,
      showLang: false,
      messageList: [],
      unReadLength: 0,
      showMessage: false,
      timeoutId: null,
      languages: [
        {id: 'en', name: 'English', n: 4},
        {id: 'cht', name: '中文繁體', n: 2},
        {id: 'zh-CN', name: '中文简体', n: 2}
        // {id: 'ko', name: '한국어', n: 4},
        // {id: 'ja', name: '日本語', n: 2},
        // {id: 'ru', name: 'русский', n: 4}
      ]
    }
  },
  computed: {
    ...mapGetters(['isLogin', 'getUserInfo', 'getLang']),
    isTest () {
      let url = location.href
      return url.indexOf('http://localhost') === 0 || url.indexOf('http://10.0.') === 0
    },
    username () {
      return this.getUserInfo && this.getUserInfo.username ? this.getUserInfo.username : null
    },
    getCurLang () {
      var lang = this.languages[0]
      this.languages.forEach((item) => {
        if (item.id === this.getLang) {
          lang = item
        }
      })
      return lang
    },
    hasNewMessage () {
      for (let i = 0; i < this.messageList.length; i++) {
        let item = this.messageList[i]
        if (item.messageState === 0) {
          return true
        }
      }
      return false
    },
    noticeUrl () {
      if (this.getLang === 'zh-CN' || this.getLang === 'cht') {
        return `https://newtonexchange.zendesk.com/hc/zh-cn/categories/360000905872-%E5%85%AC%E5%91%8A%E4%B8%AD%E5%BF%83`
      } else {
        return `https://newtonexchange.zendesk.com/hc/en-us/categories/360000905872-Announcement`
      }
    },
    helperUrl () {
      if (this.getLang === 'zh-CN' || this.getLang === 'cht') {
        return `https://newtonexchange.zendesk.com/hc/zh-cn/categories/360000871252`
      } else {
        return `https://newtonexchange.zendesk.com/hc/en-us/categories/360000871252-Help-Center`
      }
    }
  },
  watch: {
    isLogin () {
      this.getMessageList()
    }
  },
  created () {
    this.addOtcSocketEvent(this.systemEvent)
    this.getMessageList()
  },
  beforeDestroy () {
    this.removeOtcSocketEvent(this.systemEvent)
  },
  methods: {
    ...mapActions(['setApiToken', 'setLang', 'addOtcSocketEvent', 'removeOtcSocketEvent']),
    formatSystemMessage: utils.formatSystemMessage,
    systemEvent (data) {
      if (data.operate_type !== 1) {
        // 非系统消息返回
        return
      }
      data.message_state = 0

      let tempData = {
        body: data.body,
        link: data.link,
        messageId: data.message_id,
        messageState: data.message_state,
        msgTime: data.msg_time,
        msgType: data.type,
        title: data.title,
        typeName: data.type_desc
      }
      this.messageList.splice(0, 0, tempData)
      this.unReadLength++
    },
    showPanel () {
      clearTimeout(this.timeoutId)
      this.showMessage = true
    },
    hidePanel () {
      this.timeoutId = setTimeout(() => {
        this.showMessage = false
      }, 300)
    },
    getMessageList () {
      if (!this.isLogin) {
        this.messageList = []
        this.unReadLength = 0
        return
      }
      // 参数为空时获取所有未读消息
      msgApi.getMessages({}, (res) => {
        this.messageList = res.data
        this.unReadLength = res.data.length
      })
    },
    goHome () {
      this.$router.push({name: 'home'})
    },
    loginDialog () {
      this.$router.push({name: 'login'})
    },
    registerDialog () {
      this.$router.push({name: 'register'})
    },
    setLanguage (lang) {
      this.showLang = false
      this.setLang(lang)
      if (!utils.isPlainEmpty(this.$i18n.getLocaleMessage(lang))) {
        this.$i18n.locale = lang
        return
      }
      console.log('change langugae')
      langApi.getLanguage(lang, (res) => {
        this.$i18n.locale = lang
        this.$i18n.setLocaleMessage(lang, res)
      })
    },
    loginOut () {
      this.setApiToken(null)
    },
    reloadPage (name) {
      if (name === 'otc_index') {
        if (this.$route.name === 'otc_index') {
          location.reload()
        } else {
          this.$router.push({name: 'otc_index'})
        }
      } else if (name === 'exchange_index') {
        if (this.$route.name === 'exchange_index' || this.$route.name === 'exchange_index2') {
          location.reload()
        } else {
          this.$router.push({name: 'exchange_index2'})
        }
      } else if (name === 'mycenter') {
        if (this.$route.name === 'mycenter') {
          location.reload()
        } else {
          this.$router.push({name: 'mycenter'})
        }
      }
    },
    goPage (item) {
      this.signRead(item)
      if (Number(item.msgType) === 3) {
        this.$router.push({name: 'otc_index'})
      } else {
        this.$router.push({name: 'mycenter'})
      }
    },
    goMessagePage () {
      this.$router.push({name: 'mycenter_menu', params: {menu: 'message'}})
    },
    signRead (item) {
      if (item.messageState === 0) {
        msgApi.markItemRead({
          messageId: item.messageId
        }, (msg) => {
          item.messageState = 1
          this.unReadLength--
        })
      }
    },
    markAllMsg () {
      if (this.unReadLength) {
        msgApi.markAllRead((msg) => {
          this.messageList.forEach((item) => {
            item.messageState = 1
          })
          this.unReadLength = 0
          Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
        }, (msg) => {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
      }
    }
  }
}
</script>

<style scoped>
.message-panel{display: none;flex-flow: row wrap;justify-content: center;align-content: flex-start;position: absolute;top: 31px;right: -22px;width: 442px;height: 264px;padding-top: 20px;background-color: #181b2a;border: 1px solid #404b69;}
.message-panel-show{display: flex;}
.message-panel-arrow{position: absolute;top: -9px;right: 22px;width: 0;height: 0;border-width: 0 9px 9px 9px; border-style: solid; border-color:transparent transparent #404b69 transparent;}
.message-panel-arrow::after{content: "";display: block;width: 0;height: 0;margin-top: 2px;margin-left: -7px;border-width: 0 7px 7px 7px;border-style: solid;border-color:transparent transparent #181b2a transparent;}

.message-panel-container{width: 430px;height: 234px;background-color: #616c89;overflow-y: auto;overflow-x: hidden;}
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
.message-panel-container::-webkit-scrollbar { width: 5px; height: 5px; background-color: transparent; }
/*定义滚动条轨道 内阴影+圆角*/
.message-panel-container::-webkit-scrollbar-track { -webkit-box-shadow: inset 0 0 2px rgba(0,0,0,0.3); background-color: #555; }
/*定义滑块 内阴影+圆角*/
.message-panel-container::-webkit-scrollbar-thumb { -webkit-box-shadow: inset 0 0 2px rgba(0,0,0,.3); background-color: #8e8e8e; }

.message-panel-list-item{padding: 2px 18px;cursor:pointer;}
.message-panel-list-item:hover{background-color: #566a96;}
.message-panel-list-item-title,
.message-panel-list-item-time{height: 24px;line-height: 24px;font-weight: bold;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
.message-panel-list-item-title{font-size: 14px;color: #171f37;}
.message-panel-list-item-time{font-size: 12px;color: #354269;}
.message-readed .message-panel-list-item-title,
.message-readed .message-panel-list-item-time{font-weight: normal;color: #3a435d;}
.message-panel-container.all-center{display: flex;justify-content: center;align-items: center;}
.message-panel-nodata .nodata-icon,
.message-panel-nologin .nologin-icon{font-size: 60px;text-align: center;}
.message-panel-nodata .nodata-text,
.message-panel-nologin .nologin-text{font-size: 14px;color: #181b2a;}
.message-panel-nologin .nologin-text a{color: #11a8fe;}
.message-panel-nologin .nologin-text a:hover{color: #15c9ff;}
.message-panel-operation{display: flex;justify-content: space-between;align-items: center;width: 430px;height: 30px;}
.message-panel-operation span{font-size: 12px;color: #aeb7d0;cursor: pointer;}
.message-panel-operation span:hover{color: #11a8fe;}
.message-panel-operation span.disabled{color: #999;cursor: not-allowed;}
.message-panel-operation span.disabled:hover{color: #999;}

.header{height: 60px;}
.header-fixed{position: fixed;z-index:1000;top: 0;left: 0;width: 100%;background:url(../assets/images/bj-header.png) no-repeat;background-size:100% 100%;}
.header-center{display: flex;justify-content: space-between;align-items: center;width: 1200px;height: 60px;margin-left: auto;margin-right: auto;transition: width .2s ease-out;}
.header-center.full-screen{box-sizing: border-box;min-width:1200px;width: 100%;padding-left: 20px;padding-right: 10px;}
.header-center .center-left{display: flex;align-items: center;}
.header-center .center-left > a{width: 167px;height: 45px;background: url(../assets/images/logo.png) no-repeat center center;background-size:100%;}
.header-center .center-left > ul{height: 24px;}
.header-center .center-left > ul li{float: left;margin-left: 12px;height: 24px;line-height: 24px;}
.header-center .center-left > ul li:first-of-type{margin-left: 54px;}
.header-center .center-left > ul li a{padding-left: 6px;padding-right: 6px;font-size: 14px;color: #FFFFFF;cursor: pointer;}
.header-center .center-left > ul li a:hover,.header-center .center-left > ul li a.current{color: #FFDE00;}
.header-center .center-right{display: flex;align-items: center;}
.header-center .center-right > ul{height: 24px;}
.header-center .center-right > ul > li{float: right;margin-left: 12px;height: 24px;line-height: 24px;}
.header-center .center-right > ul > li > a{padding-left: 6px;padding-right: 6px;font-size:14px;cursor: pointer;color:#FFFFFF;}
.header-center .center-right > ul > li > a:hover{color: #FFDE00;}
.header-center .center-right ul li.translations{position: relative;margin-left: 18px;}
.header-center .center-right ul li.translations a{display: block;height: 22px;padding-left: 0;padding-right: 0;line-height: 22px;font-size: 14px;color: #FFFFFF;text-align: center;border-radius: 12px;margin-top:1px;}
.header-center .center-right ul li.translations a:hover,
.header-center .center-right ul li.translations a.unfold{color: #FFDE00; border-color: #FFDE00;}
.header-center .center-right ul li.translations a i{padding-left: 12px;font-size: 12px;}
.header-center .center-right ul li.translations .lang-list{display:flex;flex-flow:column;width:104px;height:117px;position: absolute;top: 24px;right:0;background-color: #12141f;box-shadow:0 3px 6px #12141f;}
.header-center .center-right ul li.translations .lang-item{flex:1;height: 38px;line-height: 38px;font-size: 14px;color: #a1a8bb;text-align: center;border-bottom: 1px solid #252e44;cursor: pointer;}
.header-center .center-right ul li.translations .lang-item:hover{color: #cbd4ec;background-color: #252e44;}

.header-center .center-right ul li.message{position: relative;margin-left: 0;}
.header-center .center-right ul li.message > a{display: block;position: relative;
  height: 20px;padding-left: 0; padding-right: 0;margin-top: 2px;line-height: 20px;font-size: 20px;}
.header-center .center-right ul li.message > a.unfold{color: #FFDE00;}
.header-center .center-right ul li.message > a em{position: absolute;top: -5px;left: 11px;min-width: 6px;height: 12px;padding-left: 3px;padding-right: 3px;line-height: 10px;font-size: 12px;color: #fff;background-color: #e2261c;border-radius: 5px;}
.header-center .center-right > ul.minWidth{display:none;}
.header .minWidthList{position:absolute;z-index:1000;left:-100%;top:60px;width:100%;background:#222121;display:none;flex-direction:column;height:fit-content;transition:0.3s;}
.header .minWidthList li{display:flex;}
.header .minWidthList li a{display:flex;flex:1;height:24px;line-height:24px;cursor:pointer;padding:0 10px;}

@media screen and (max-width: 1600px) {
    .header,.header-center{height:50px;}
    .header-center .center-right ul li.translations .lang-item{height:30px;line-height:30px;}
}

@media screen and (max-width: 1199px) {
  .header-center{min-width:100%!important;width:100%;}
  .header-center .center-left > a{background-size:70%;}
  .header-center .center-left > ul.maxWidth,
  .header-center .center-right > ul.maxWidth{display:none;}
  .header-center .center-right > ul.minWidth{height:40px;display:flex;}
  .header-center .center-right > ul.minWidth > li{height:40px;line-height:40px;}
  .header-center .center-right > ul.minWidth .icon-market-list1{font-size:40px;}
  .header .minWidthList{top:50px;}
  .header .minWidthList.show{display:flex;left:0px;}
}
</style>
