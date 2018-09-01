<template>
    <div class="invite">
        <div class="banner">
           <div class="banner-img">
                <img src="../assets/images/home/banner-zhcn.png"/>
           </div>
        </div>
        <div class="content">
                <div class="invite_code">
                    <div class="title">{{$t('referral.my_referral')}}<!--我的邀请信息--></div>
                    <div class="invite_info" v-if="!isLogin">
                        <div class="invite_info_login">
                            <p>{{$t('referral.login_share')}}<!--您还未登录，请登录后与好友分享--></p>
                            <div class="info-btn">
                                <span class="info-btn-login" @click="loginDialog">{{$t('login_register.login')}}<!--登录--></span>
                                <span class="info-btn-reg" @click="registerDialog">{{$t('login_register.register')}}<!--注册--></span>
                            </div>
                        </div>
                    </div>
                    <div v-if="isLogin">
                        <div class="invite_list">
                            <div class="invite_caption12">{{$t('referral.referral_friends')}}<!--我的邀请好友--></div>
                            <div class="invite_caption1">
                                <div>
                                    <img src="../assets/images/invite/M1-icon.png" />
                                    <Span>M1</Span>
                                </div>
                                <div>{{getUserInfo.m1}}</div>
                            </div>
                            <div class="invite_caption2">
                                <div class="m2">
                                    <img src="../assets/images/invite/M2-ICON.png" />
                                    <Span>M2</Span>
                                </div>
                                <div>{{getUserInfo.m2}}</div>
                            </div>
                            <div class="invite_caption3">
                                <div class="m3">
                                    <img src="../assets/images/invite/m3-icon.png" />
                                    <Span>M3</Span>
                                </div>
                                <div>{{getUserInfo.m3}}</div>
                            </div>
                            <div class="invite_caption4">
                                <div>{{$t('referral.total')}}<!--合计--></div>
                                <div>{{(getUserInfo.m1) + (getUserInfo.m2) + (getUserInfo.m3)}}</div>
                            </div>
                        </div>
                        <div class="invite_list">
                            <div class="invite_caption12">{{$t('referral.referral_friends')}}<!--我的邀请奖励--></div>
                            <div class="invite_caption1">
                                <div>{{(getUserInfo.m1) * 15}}&nbsp;ATN</div>
                                <div>{{(getUserInfo.m1) * 3}}&nbsp;{{$t('referral.gift_coupon')}}<!--奖券--></div>
                            </div>
                            <div class="invite_caption2">
                                <div>{{(getUserInfo.m2) * 10}}&nbsp;ATN</div>
                                <div>{{(getUserInfo.m2) * 2}}&nbsp;{{$t('referral.gift_coupon')}}<!--奖券--></div>
                            </div>
                            <div class="invite_caption3">
                                <div>{{(getUserInfo.m3) * 5}}&nbsp;ATN</div>
                                <div>{{(getUserInfo.m3) * 1}}&nbsp;{{$t('referral.gift_coupon')}}<!--奖券--></div>
                            </div>
                            <div class="invite_caption4">
                                <div>{{this.reward}}&nbsp;ATN</div>
                                <div>{{this.reward1}}&nbsp;{{$t('referral.gift_coupon')}}<!--奖券--></div>
                            </div>
                        </div>
                        <div class="invite_list my_code">
                            <div class="invite_caption12">{{$t('referral.referral_id')}}<!--我的邀请码--></div>
                            <div class="invite_caption_code">{{getUserInfo.myInvitationCode || '------'}}</div>
                        </div>
                        <div class="invite_list">
                            <div class="invite_caption_left">{{$t('referral.referral_way')}}<!--邀请方式--></div>
                        </div>
                        <div class="invite_list witer">
                            <div class="invite_caption_left">{{$t('referral.text')}}<!--文字--></div>
                            <div class="invite_list_content">{{this.aaa}}</div>
                            <span class="invite_span" @click="copyCode">{{$t('referral.referral_link')}}<!--复制邀请链接--></span>
                        </div>
                        <div class="invite_list witer">
                            <div class="invite_caption_left">{{$t('referral.poster')}}<!--海报--></div>
                            <span class="invite_span" @click="shareImg">{{$t('referral.invitation_poster')}}<!--邀请海报-->  </span>
                            <span class="share">{{$t('referral.share_to_friends')}}<!--点击分享给好友--></span>
                        </div>
                    </div>
                </div>
                <div class="invite_code_list">
                    <div class="title">{{$t('referral.invitation_rank')}}<!--邀请排行--></div>
                    <ul>
                        <li>
                            <span>Top</span>
                            <span class="list-username">ID</span>
                            <span class="list-totalMx">{{$t('referral.referral_friends_count')}}<!--好友数--></span>
                            <span class="list-rewrard">{{$t('referral.commission')}}<!--奖励--></span>
                        </li>
                        <li v-for="(data,index) in inviteData" :key="data.id">
                            <span :class="'number' + index" class="list_top">{{index+1}}</span>
                            <span class="list-username">{{data.username}}</span>
                            <span class="list-totalMx">{{data.totalMx}}</span>
                            <span class="list-rewrard">
                                <em>{{data.totalAwardBark}} &nbsp;ATN</em>
                                <em>{{data.totalAwardTicket}} &nbsp;{{$t('referral.gift_coupon')}} <!--奖券--></em>
                            </span>
                        </li>
                    </ul>
                </div>
                <div class="rule">
                    <div class="title">{{$t('referral.referral_rule')}} <!--邀请活动规则--></div>
                    <p>{{$t('referral.invite_reward_nt_1')}}<!--1. 一旦您推荐的好友成功完成注册，实名认证，他将获得660BARK的注册奖励和880BARK的实名认证奖励。--></p>
                    <p>{{$t('referral.invite_reward_nt_2')}}<!--2.您也将获得代币奖励。奖励规则为：每位M1：200BARK，M2：100BARK，M3：50BARK。（M1-M3为下级好友的层级。）--></p>
                    <p>{{$t('referral.invite_reward_nt_3')}}<!--3.您还将获得大量活动抽奖券奖励，每位M1：10张，M2：6张，M3：3 张。活动抽奖券会作为Bitark平台的糖果分发、手续费抽奖等活动的权重依据之一。
    我们将每个月收取手续费的5%加入抽奖活动奖池。若本月收取1000BTC手续费，50BTC加入抽奖活动奖池。--></p>
                    <p>{{$t('referral.invite_reward_nt_4')}}<!--4.邀请奖励均无上限限制。--></p>
                    <p>{{$t('referral.invite_reward_nt_5')}}<!--5. 为回馈前期用户的支持，在邀请活动开始前注册的用户均将自动获得M1-M3好友各一个及相应的奖励。--></p>
                    <p>{{$t('referral.invite_reward_nt_6')}}<!--6. 邀请活动开启时间见活动海报。邀请奖励每周发放一次。--></p>
                    <p>{{$t('referral.invite_reward_nt_7')}}<!--7.活动抽奖劵使用规则以官方活动的详细规则为准。抽奖随机数基于Bitcoin区块hash产生，代码将透明公开开源。--></p>
                    <p>{{$t('referral.invite_reward_nt_8')}}<!--8.Bitark保留随时对邀请活动规则进行调整的权利，但是对您推荐的好友数量没有限制。--></p>
                    <p>{{$t('referral.invite_reward_nt_9')}}<!--9. 被推荐人必须使用您的邀请链接、二维码或者邀请码注册才可以。--></p>
                    <p>{{$t('referral.invite_reward_nt_10')}}<!--10. Bitark会严查重复的或者虚假账户，一经发现，将不会支付奖励。--></p>
                    <div class="remark">
                        <div class="remark_title">
                            <span>*</span>{{$t('referral.important_notice')}}<!--特别注意：-->
                        </div>
                        <div class="detail">{{$t('referral.important_notice_nt')}}<!--由于市场环境的改变，欺诈风险的存在等原因，Bitark保留随时对活动邀请规则做出调整的最终解释权。--></div>
                    </div>
                </div>

        </div>
        <div class="bottom">
        <div class="bottom-center">
            <div class="item">
            <a href="javascript:;" target="_blank">{{$t('public.foot_about')}}</a>
            </div><!--关于我们-->
            <div class="item">
            <a href="javascript:;" target="_blank">{{$t('public.foot_terms')}}</a>
            </div><!--服务协议-->
            <div class="item">
            <a href="javascript:;" target="_blank">{{$t('public.foot_privacy')}}</a>
            </div><!--隐私声明-->
            <div class="item">
            <a href="javascript:;" target="_blank">{{$t('public.foot_fees')}}</a>
            </div><!--费率标准-->
            <div class="item"></div>
            <div class="item">{{$t('public.foot_contact')}}</div><!--联系我们-->
            <div class="item">
            <a class="contact-icons icon-facebook" href="javascript:;" target="_blank"></a>
            </div>
            <div class="item">
            <a class="contact-icons icon-twitter" href="javascript:;" target="_blank"></a>
            </div>
            <div class="item">
            <a class="contact-icons icon-telegram" href="javascript:;" target="_blank"></a>
            </div>
            <div class="item">
            <a class="contact-icons icon-slack" href="javascript:;" target="_blank"></a>
            </div>
            <div class="item">
            <a class="contact-icons icon-weixin">
            </a>
            </div>
        </div>
        </div>

        <section class="bk-wrap footer-main">
        <section class="bk-main footer">
            <p>© 2017-2018 www.newtonXchange.com All Rights Reserved</p>
        </section>
        </section>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import utils from '@/assets/js/utils'
import shareImg from './shareImg'
import inviteApi from '@/api/individual'
import Vue from 'vue'
const copyText = (str) => {
  var save = function (e) {
    e.clipboardData.setData('text/plain', str)
    e.preventDefault()
  }
  document.addEventListener('copy', save)
  document.execCommand('copy')
  document.removeEventListener('copy', save)
}
export default {
  data () {
    return {
    //   aaa: 'Bitark交易所注册就送660个平台币，实名再送880个，现价XX元一个。更有机会得百万大奖。' + ${getUserInfo.myInvitationUrl}
      inviteData: []
    }
  },
  created () {
    this.getinvitedAwardRank()
  },
  methods: {
    copyCode () {
      Vue.$koallTipBox({icon: 'success', message: this.$t('public0.public33')}) // 复制成功
      copyText(this.aaa)
    },
    shareImg () {
      utils.setDialog(shareImg)
    },
    getinvitedAwardRank () {
      inviteApi.invitedAwardRank((res) => {
        this.inviteData = res.data
      })
    },
    loginDialog () {
      this.$router.push({name: 'login'})
    },
    registerDialog () {
      this.$router.push({name: 'register'})
    }
  },
  computed: {
    ...mapGetters(['isLogin', 'getApiToken', 'getLang', 'getUserInfo']),
    reward () {
      return (this.getUserInfo.m1) * 15 + (this.getUserInfo.m1) * 10 + (this.getUserInfo.m1) * 5
    },
    reward1 () {
      return (this.getUserInfo.m1) * 3 + (this.getUserInfo.m1) * 2 + (this.getUserInfo.m1) * 1
    },
    aaa () {
      if (this.getUserInfo.myInvitationUrl === null) {
        return this.$t('referral.referral_text_nt')
      } else {
        return this.$t('referral.referral_text_nt') + this.getUserInfo.myInvitationUrl
      }
    }
  }
}
</script>
<style scoped>
.invite{position: relative;overflow: hidden;margin: 0 auto;}
.banner{background:  #0d1426;}
.banner-img{width: 1200px;margin: 0 auto;}
.banner img{width: 100%;}
.invite_code{background: #181b2a;margin-top: 30px; }
.invite_code .title{background: #1b1e2e;height: 40px;line-height: 40px;color: #cbd4ec;font-size: 16px;padding-left: 30px;}
.content{width: 1200px;margin:  0 auto;}
.invite_list{display: flex;justify-content: space-between; background: #181b2a;color: #cbd4ec;padding-left: 30px;padding-right: 30px;padding-top: 10px;padding-bottom: 10px;}
.my_code{border-bottom: 1px solid #262a42;justify-content: start;}
.my_code .invite_caption{padding-right: 90px;}
.invite_caption{width: 100px}
.invite_caption1{width: 230px}
.invite_caption2{width: 230px}
.invite_caption3{width: 230px}
.invite_caption4{width: 230px;line-height: 33px;}
.invite_list>div{display: inline-block;text-align: center;}
.invite_caption_left{text-align: left !important;display: inline-block;width: 70px;padding-left: 10px;line-height: 60px;}
.my_code .invite_caption12{margin-right: 108px;}
.invite_caption12{width: 100px;line-height: 60px;}
.invite_caption1>div>span{display: inline-block;width: 62px;height: 20px;color:#fff; line-height: 20px;text-align: center;background: #e4ac46;}
.invite_caption1>div>img{position: absolute;top: 4px;left: 74px}
.invite_caption1>div{position: relative;line-height: 33px;}
.invite_caption2>div>span{display: inline-block;width: 62px;height: 20px;color:#fff; line-height: 20px;text-align: center;background: #9e9fb9;}
.invite_caption2>div>img{position: absolute;top: 4px;left: 74px}
.invite_caption2>div{position: relative;line-height: 33px;}
.invite_caption3>div>span{display: inline-block;width: 62px;height: 20px;color:#fff; line-height: 20px;text-align: center;background: #b8a481;}
.invite_caption3>div>img{position: absolute;top: 4px;left: 74px}
.invite_caption3>div{position: relative;line-height: 33px;}
.invite_caption>div{line-height: 30px;position: relative;}
.invite_caption{line-height: 60px;text-align: center;}
.invite_caption>div img{vertical-align: middle;position: absolute;top: 2px;left: -5px;}
.invite_caption>div span{display: inline-block;height: 20px;line-height: 20px; width: 75px;background: #e4ac46;text-align: center;color: #fff;}
.invite_caption>div.m2 span{background: #9e9fb9;}
.invite_caption>div.m3 span{background: #b8a481;}
.invite_list_content{width: 430px;background: #262a42;padding: 10px;margin-right: 20px;}
.invite_span{background: #11a8fe;color: #fff;height: 30px;line-height: 30px;cursor: pointer;padding-left: 5px;padding-right: 5px;}
.witer{justify-content: start;margin-bottom: 10px;align-items: center;}
.witer .invite_caption{margin-right: 40px;}
.invite_code_list .title{background: #1b1e2e;height: 40px;line-height: 40px;color: #cbd4ec;font-size: 16px;padding-left: 30px;}
.invite_code_list ul li span.number0{display: inline-block;width: 20px;height:20px;line-height: 20px;text-align: center;color: #fff; border-radius: 50%;background: #ffbc31;}
.invite_code_list ul li span.number1{display: inline-block;width: 20px;height:20px;line-height: 20px;text-align: center;color: #fff; border-radius: 50%;background: #8ea4c1;}
.invite_code_list ul li span.number2{display: inline-block;width: 20px;height:20px;line-height: 20px;text-align: center;color: #fff; border-radius: 50%;background: #9e8663;}
.invite_code_list ul li span.list_top{display: inline-block;width: 20px;height:20px;line-height: 20px;text-align: center;color: #fff; border-radius: 50%;}
.invite_code_list ul li{display: flex;justify-content: space-between;align-items: center; border-bottom: 1px solid #262a42;color: #cbd4ec;font-size: 14px;line-height: 60px;}
.invite_code_list ul li span>em{display: block;line-height: 30px;}
.invite_code_list ul {padding-left: 30px;padding-right: 30px;}
.rule .title{background: #1b1e2e;height: 40px;line-height: 40px;color: #cbd4ec;font-size: 16px;}
.rule {margin-top: 30px; color: #becbe8;background: #181b2a;padding-left: 40px;padding-right: 40px;padding-bottom: 40px;}
.rule p{line-height: 40px;}
.remark_title {font-size: 14px;color: #becbe8;line-height: 40px;}
.remark_title span{color: #11a8fe;margin-right: 20px;}
.detail{margin-left: 20px;}
.bottom{background: #090f1f;margin-top: 30px;}
.bottom-center{display:flex;margin:0 auto;width:1172px;height:50px;border-bottom:1px solid #404b69;color:#586687;justify-content:space-between;align-items:center;}
.bottom-center .item{text-align:left;-webkit-transition:all .2s;transition:all .2s;flex:1 1 auto;}
.bottom-center .item a{color:#586687;}
.bottom-center .item a:hover,.bottom-center .item:hover{color:#becbe8;cursor:pointer;}
.bottom-center .item:nth-child(5){width:680px;background:#ff0;}
.bottom-title-img{margin-top: 48px;margin-bottom: 35px;}
.bottom-title{font-size:30px;color:#f0f0f0;}
.bottom-icons{font-size:64px;color:#fff;}
a{cursor:pointer;color: rgba(204, 204, 204, 0.6);}
a:hover{color: rgba(204, 204, 204, 1);}
a.icon-weixin{position: relative}
a.icon-weixin:hover .wechat{display: block;}
.wechat{position: absolute;bottom: 30px;right: -87px;display: none}
.follow{color: #f0f0f0;font-size: 18px;font-weight: bold;margin-bottom: 35px;}
.center-r-title{font-size: 18px;color: #f0f0f0;font-weight: bold;margin-top: 145px;margin-bottom: 30px;}
.center-btn-en,
.center-btn-cn{display: inline-block;margin-right: 36px;width: 180px;height: 56px;line-height: 56px;border-radius: 10px;border: 2px solid #fff;font-size: 18px;text-align: center;color: #f0f0f0;font-weight: bold;}
.center-btn-en:hover,
.center-btn-cn:hover{color: #11a8fe;border-color: #11a8fe;}
.bk-wrap{position:relative;overflow:hidden;width:100%;}
.footer-main{background: #090f1f;}
.bk-main{position:relative;overflow:hidden;margin:0 auto;width:1172px;}
.footer{background: #090f1f;color: #586687;}
.footer > p{line-height: 80px;}
.foot{width: 100%;background: #060b1b;height: 130px;margin-top: 30px;}
.foot-cont{width: 1200px;margin: 0 auto;}
.invite_code_list{background: #181b2a;margin-top: 30px;}
.share{margin-left: 30px;cursor: pointer;color: #7077a0;}
.invite_caption_code{color: #11a8fe;line-height: 60px;}
.invite_info{height: 502px;background: #181b2a;text-align: center;align-items: center;display: flex;}
.invite_info_login{width: 396px;height: 230px;background: #262a42;margin: 0 auto;}
.info-btn-login{background: #11a8fe;color: #fff;width: 76px;height: 30px;margin-right: 30px;}
.info-btn span{display: inline-block;line-height: 30px;text-align: center;cursor: pointer;}
.info-btn-reg{display: inline-block;width: 74px;height: 28px;line-height: 30px;text-align: center;border:1px solid #11a8fe;color: #11a8fe;}
.invite_info_login p{font-size: 16xp;color: #becbe8;line-height: 108px;}
.list-totalMx{width: 180px;text-align: center;}
.list-username{width: 180px;text-align: center;}
.list-rewrard{width: 180px;text-align: center;}
</style>
