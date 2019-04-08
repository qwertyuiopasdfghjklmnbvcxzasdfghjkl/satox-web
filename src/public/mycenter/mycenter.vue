<template>
    <div class="mycenter">
      <div class="top">
        <h3>{{$t('account.userPersonalCenter')}}<!--我的个人中心--></h3>
        <div class="info" :class="{active:!vsloaded}">
          <div class="info-pic">
            <div class="image">
              <img :src="avatarUrl" @error="setDefaultAvatar($event)" />
            </div>
            <form ref="form" v-if="!isExistUserAvatar">
              <input class="file" type="file" @change="uploadImage" name="source" title=" "/>
              <span class="tips">{{$t('account.user_center_set_photo')}}<!--头像只能设置一次--></span>
            </form>
          </div>
          <div class="info-message">
            <p class="attestation">
              <span class="email">{{$t('account.user_center_account')}}：<!--账号--></span>
              <span class="name">{{getUserInfo.username}}<!--用户名--></span>
              <template>
              <span v-if="showVerifyState(0)" class="attestation-state entrance" @click="switchTab('authentication')">
                {{$t('account.user_Real_name_verification')}}<!--实名认证-->
              </span>
              <span v-if="showVerifyState(1)" class="attestation-state wait">
                {{$t('public0.public37')}}<!--待审核-->
              </span>
              <span v-if="showVerifyState(4)" class="attestation-state wait">
                {{$t('public0.public151')}}<!--审核中-->
              </span>
              <span v-if="showVerifyState(2)" class="attestation-state success">
                {{$t('public0.public38')}}<!--已认证-->
              </span>
              <span v-if="showVerifyState(3)" class="attestation-state fail">
                {{$t('public0.public39')}}<!--未通过-->
              </span>
              </template>
            </p>
            <p class="nickname" v-if="false">
              <span>{{$t('public0.public190')}}：<!--昵称--></span>
              <span class="nickname-text">{{updateNickname}}</span>
              <span class="nickname-modify" v-if="!isAlreadyModifyNickname" @click="nicknameDialog">
                {{$t('public0.public40')}}<!--修改昵称-->
              </span>
            </p>
            <p class="sale">
              <span>
                {{$t('account.user_center_pay_fees').format('SATOX', '50%')}}<!--使用SATOX支付交易手续费（50% 折扣）-->
                <a class="icon-checkbox" href="javascript:;" :class="isUseSATOXPay ? 'icon-checkbox-checked' : 'icon-checkbox-unchecked'" @click="switchCoinState"></a>
              </span>
            </p>
            <p class="limit" v-if="false">
              {{$t('account.user_24_hours_cash_withdrawal')}}：<!--24小时提现额度-->
              <span>{{getUserInfo.withdrawAmount || 0}}&nbsp;BTC</span>
              <!--如需更大额度请联系我们-->
              <label v-html="contactHtml"></label>
            </p>
          </div>
        </div>
      </div>
      <div class="distribution" v-if="false">
        <h3>{{$t('account.user_center_distribution_h')}}<!--分发记录--></h3>
        <ul class="header" v-if="!distributeLoading && distributeHistory.length > 0">
          <li>
            <span class="time">
              {{$t('account.user_center_history_date')}}<!--时间-->
            </span>
            <span class="species">
              {{$t('account.estimated_value_coin')}}<!--币种-->
            </span>
            <span class="number">
              {{$t('account.user_center_history_amount')}}<!--数量-->
            </span>
            <span class="remark">
              {{$t('account.user_center_history_note')}}<!--备注-->
            </span>
          </li>
        </ul>
        <ul v-if="!distributeLoading && distributeHistory.length > 0">
          <li v-for="(data, index) in distributeHistory" :key="index">
            <span class="time">{{new Date(Number(data.createdAt)).format()}}</span>
            <span class="species">{{data.symbol }}</span>
            <span class="number">{{data.quantity}}</span>
            <span class="remark">{{data.remarks}}</span>
          </li>
        </ul>
        <page v-if="!distributeLoading && distributeHistory.length > 0" :pageIndex="distributeParam.page" :pageSize="distributeParam.pageSize" :total="distributeTotal" @changePageIndex="distributePageChange"/>
        <div v-if="!distributeLoading && distributeHistory.length === 0" class="nodata">
          <div class="nodata-icon icon-no-order"></div>
          <div class="nodata-text">{{$t('account.user_center_no_distribution')}}<!--暂无当前委托--></div>
        </div>
        <loading v-if="distributeLoading"/>
      </div>
      <div class="dist-record" v-if="false">
        <h3>{{$t('account.user_registration_record')}}<!--登录记录--></h3>
        <ul v-if="!loginHistoryLoading && loginHistory.length > 0">
          <li>
            <span class="time">{{$t('account.user_center_history_date')}}<!--时间--></span>
            <span class="ip">{{$t('public0.public191')}}<!--IP地址--></span>
            <span class="adress">{{$t('public0.public192')}}<!--所在地--></span>
          </li>
          <li v-for="(data, index) in loginHistory" :key="index">
            <span class="time">{{new Date(Number(data.loginTime)).format()}}</span>
            <span class="ip">{{data.ipAddress}}</span>
            <span class="adress">{{data.loginLocation}}</span>
          </li>
        </ul>
        <div v-if="!loginHistoryLoading && loginHistory.length === 0" class="nodata">
          <div class="nodata-icon icon-no-order"></div>
          <div class="nodata-text">{{$t('account.user_registration_no_record')}}<!--暂无登录记录--></div>
        </div>
        <loading v-if="loginHistoryLoading"/>
      </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import userUtils from '@/api/individual'
import Config from '@/assets/js/config'
import utils from '@/assets/js/utils'
import loading from '@/components/loading'
import page from '@/components/page'
import nickName from '@/public/dialog/nickname'
import avatar from '@/assets/images/touxiang.png'
export default {
  components: {
    loading,
    page
  },
  data () {
    return {
      vsloaded: false, // 认证信息加载完毕状态
      avatarUrl: avatar,
      userState: { // 用户状态信息
        coinState: 0,
        googleState: 0,
        nickname: null,
        verifyState: 0,
        verifyTimes: 0
      },
      isUseSATOXPay: false,
      distributeHistory: [], // 分发记录
      distributeParam: {
        page: 1, // 当前页
        pageSize: 6 // 每页显示多少条
      },
      distributeTotal: 0, // 总数量
      distributeLoading: true,
      loginHistory: [], // 登录记录
      loginHistoryLoading: true
    }
  },
  computed: {
    ...mapGetters(['getUserInfo', 'getLang']),
    isExistUserAvatar () {
      return this.avatarUrl !== avatar
    },
    isAlreadyModifyNickname () {
      return this.userState.nickname !== null
    },
    updateNickname () {
      return this.userState.nickname
    },
    contactHtml () {
      // let alink = `<a href="${this.getLang === 'en' ? 'https://cdcc.kf5.com/hc/request/guest/?lang=en' : 'https://cdcc.kf5.com/hc/request/guest/'}" target="_blank">${this.$t('public0.public241')}</a>`
      let alink = `<a href="${this.getLang === 'en' ? '#' : '#'}" target="_blank">${this.$t('public0.public241')}</a>`
      return `（${this.$t('account.user_prompt5').format(alink)}）`
    }
  },
  watch: {
    'distributeParam.page' () {
      this.fnDistributeHistory()
    }
  },
  created () {
    this.fnDownloadHeader()
    this.fnUserState()
    this.fnDistributeHistory()
    this.fnLoginHistory()
  },
  methods: {
    setDefaultAvatar(e){ //图片加载失败用默认头像
      let tar = e.currentTarget
      tar.src = avatar
    },
    switchTab (tab) {
      this.$emit('switchTab', tab)
    },
    fnDownloadHeader () {
      // 下载当前用户头像
      userUtils.downloadHeader((url) => {
        this.avatarUrl = url
      })
    },
    uploadImage (e) {
      // 上传头像
      var target = e.target
      if (Config.imageType.test(target.files.item(0).name) === false) {
        return Vue.$koallTipBox({icon: 'notification', message: this.$t('public0.public43')}) // 请上传JPG、PNG、JPEG、BMP格式的图片
      }
      let isTrue = utils.limitUploadImage(target, (msg) => {
        Vue.$koallTipBox({icon: 'notification', message: this.$t(msg)}) // 图片不能超过1M
      }, 1)
      if (!isTrue) {
        target.value = ''
        return
      }
      this.avatarUrl = window.URL.createObjectURL(target.files.item(0))
      var formData = new FormData(this.$refs.form)
      userUtils.uploadHeader(formData, (msg) => {}, (msg) => {
        Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
      })
    },
    fnUserState () {
      // 获取当前用户状态信息
      userUtils.getUserState((data) => {
        this.userState = {
          coinState: data.coinState,
          googleState: data.googleState,
          nickname: data.nickname,
          verifyState: data.verifyState,
          verifyTimes: data.verifyTimes
        }
        this.isUseSATOXPay = data.coinState === 1
        this.vsloaded = true
      }, (msg) => {
        console.error(msg)
      })
    },
    showVerifyState (targetVerifyState) {
      if (this.userState.verifyTimes <= 3) {
        if (this.userState.verifyTimes === 3) {
          if (this.userState.verifyState === 0) {
            return targetVerifyState === 3
          } else {
            return targetVerifyState === this.userState.verifyState
          }
        } else {
          return targetVerifyState === this.userState.verifyState
        }
      } else {
        return targetVerifyState === 3
      }
    },
    switchCoinState () {
      // 切换使用SATOX支付交易手续费（50% 折扣）
      userUtils.switchSATOXChargeState((msg) => {
        this.isUseSATOXPay = !this.isUseSATOXPay
      }, (msg) => {
        console.error(msg)
      })
    },
    nicknameDialog () {
      // 修改呢称
      utils.setDialog(nickName, {
        nickname: this.nickname,
        okCallback: (aNickName) => {
          this.userState.nickname = aNickName
        }
      })
    },
    fnDistributeHistory () {
      this.distributeLoading = true
      // 获取分发记录
      userUtils.getDistributeHistory(this.distributeParam, (res) => {
        this.distributeHistory = res.data
        this.distributeTotal = res.total
        this.distributeLoading = false
      }, (msg) => {
        console.error(msg)
      })
    },
    distributePageChange (currentIndex) {
      this.distributeParam.page = currentIndex
    },
    fnLoginHistory () {
      this.loginHistoryLoading = true
      // 获取最近登录记录
      userUtils.getLoginHistory((data) => {
        if (data && data.length) {
          this.loginHistory = data.splice(0, 5)
        }
        this.loginHistoryLoading = false
      }, (msg) => {
        console.error(msg)
      })
    }
  }
}
</script>

<style scoped>
.mycenter h3{height: 55px; padding-left: 20px; font-weight: normal;font-size: 18px;line-height: 55px;color: #333;text-indent: 8px;border-bottom: 1px solid #e7e7e7;}
.mycenter .top{background-color: #FFF; border-radius: 4px; box-shadow: 0 1px 3px #e2e2e2;}
.mycenter .top .info{display: flex;height: 150px;padding-top: 30px; position: relative;}
.mycenter .top .info.active::after {content: ''; position: absolute; left: 0;top: 0; right: 0; bottom: 0; background-color: #fff; z-index: 1;}
.mycenter .top .info .info-pic{position: relative;}
.mycenter .top .info .info-pic form{display: flex;justify-content: center;position: absolute;top: 4px;left: 30px;width: 70px;height: 70px;}
.mycenter .top .info .info-pic .file{width: 100%;height: 100%;border-radius: 50%;opacity: 0;cursor: pointer;}
.mycenter .top .info .info-pic .tips{display: none;position: absolute;top: -30px;height: 24px;padding-left: 12px;padding-right: 12px;font-size: 12px;line-height: 24px;color: #181b2a;white-space: nowrap;background-color: #fff;border-radius: 4px;}
.mycenter .top .info .info-pic .tips:before{content: "";position: absolute;bottom: -6px;left: 50%;width: 0;height: 0;margin-left: -6px;border-width: 6px 6px 0 6px;border-style: solid;border-color: #fff transparent transparent transparent;}
.mycenter .top .info .info-pic .file:hover + .tips{display: block;}
.mycenter .top .info .info-pic .image{width: 68px;height: 68px;margin-top: 4px;margin-left: 30px;border: 2px solid #348EFB;border-radius: 50%;overflow: hidden;}
.mycenter .top .info .info-pic .image img{width: 100%;height: 100%;}
.mycenter .top .info .info-message{margin-left: 30px;}
.mycenter .top .info .info-message p{height: 26px;line-height: 26px;color: #333;}
.mycenter .top .info .info-message span{color: #333;}
.mycenter .top .info .info-message span.attestation-state{display: inline-block;height: 24px;padding-left: 8px;padding-right: 8px;margin-top: 1px;margin-left: 8px;line-height: 24px;color: #fff;vertical-align: top;border-radius: 4px;}
.mycenter .top .info .info-message span.entrance{background: url(../../assets/images/btn-bg-blue.png) repeat-x left center;cursor: pointer;}
.mycenter .top .info .info-message span.entrance:hover{background-image: url(../../assets/images/btn-bg-blue-highlight.png);}
.mycenter .top .info .info-message span.wait{background-color: #3283FF;}
.mycenter .top .info .info-message span.success{background-color: #24C08A;}
.mycenter .top .info .info-message span.fail{background-color: #F34246;}
.mycenter .top .info .info-message span.nickname-modify{color: #3283FF;cursor: pointer;}
.mycenter .top .info .info-message span.nickname-modify:hover{color: #3283FF;}
.mycenter .top .info .info-message span a{color: #3283FF;vertical-align: -1px;}
.mycenter .top .info .info-message label /deep/ a{color: #3283FF;text-decoration: underline;}
.mycenter .top .info .info-message span a:hover,
.mycenter .top .info .info-message label /deep/ a:hover{color: #3283FF;}

.distribution{margin-top: 10px;background-color: #FFF; border-radius: 4px; box-shadow: 0 1px 3px #e2e2e2;}
.distribution ul{padding-left: 20px;padding-right: 20px;}
.distribution ul.header li span {color: #A1A1A1;}
.distribution ul li{display: flex;justify-content: space-between;min-height: 40px;line-height: 40px;border-bottom: 1px solid #e7e7e7;}
.distribution ul.header li{border-bottom:none;}
.distribution ul li span{color: #333;}
.distribution ul li span.time{width:160px;}
.distribution ul li span.species{width: 100px;}
.distribution ul li span.number{width: 160px;}
.distribution ul li span.remark{width: 180px;}

.dist-record{margin-top: 10px;background-color: #FFF; border-radius: 4px; box-shadow: 0 1px 3px #e2e2e2;}
.dist-record ul{padding-bottom: 30px;padding-left: 20px;padding-right: 20px;}
.dist-record ul li{display: flex;justify-content: space-between;min-height: 40px;line-height: 40px;border-bottom: 1px solid #e7e7e7;}
.dist-record ul li span{color: #333;}
.dist-record ul li span.time{width: 160px;}
.dist-record ul li span.ip{width: 120px;}
.dist-record ul li span.adress{width: 280px;text-align: right;}

.nodata{text-align: center;}
.nodata .nodata-icon{height: 80px;font-size: 40px;line-height: 80px;color: #8b94a9;}
.nodata .nodata-text{height: 40px;line-height: 20px;color: #A1A1A1;}
</style>

