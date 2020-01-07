<template>
  <div class="container">
    <!--轮播-->
    <indexslider></indexslider>
    <!--公告-->
    <notice/>
    <!--推荐市场-->
    <indexrecom ref="indexrecom"></indexrecom>
    <!--数据表格-->
    <indexdatatable ref="indexdatatable"></indexdatatable>

    <div class="bottom">
      <div class="bottom-center">
        <div class="item">
          <a :href="aboutUrl">{{$t('public.foot_about')}}</a>
        </div><!--关于我们-->
        <div class="item">
          <a :href="serviceAgreementUrl">{{$t('public.foot_terms')}}</a>
        </div><!--服务协议-->
        <div class="item">
          <a :href="privacyNoticeUrl" >{{$t('public.foot_privacy')}}</a>
        </div><!--隐私声明-->
        <div class="item">
          <a :href="rateStandardUrl">{{$t('public.foot_fees')}}</a>
        </div><!--费率标准-->
        <div class="item"></div>
        <div class="item">{{$t('public.foot_contact')}}</div><!--联系我们-->
        <div class="item">
          <a class="contact-icons icon-facebook" href="javascript:;"></a>
        </div>
        <div class="item">
          <a class="contact-icons icon-twitter" href="javascript:;"></a>
        </div>
        <!--<div class="item">-->
          <!--<a class="contact-icons icon-telegram" href="javascript:;" target="_blank"></a>-->
        <!--</div>-->
        <!--<div class="item">-->
          <!--<a class="contact-icons icon-slack" href="javascript:;" target="_blank"></a>-->
        <!--</div>-->
        <div class="item">
          <a class="contact-icons icon-weixin hover" href="javascript:;"><span class="wxqr"><img src="../assets/images/wxqr.png"><i></i></span></a>
        </div>
      </div>
    </div>

    <section class="bk-wrap footer-main">
      <section class="bk-main footer">
        <p>©2019-2020 www.satox.com All Rights Reserved</p>
      </section>
    </section>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import indexdatatable from '@/public/index/datatable'
  import indexslider from '@/public/index/indexslider'
  import indexrecom from '@/public/index/indexrecom'
  import KLineWebSocket from '@/assets/js/websocket'
  import notice from './index/notice'
  let chartSettings = window.localStorage.getItem('chartSettings')
  chartSettings && (chartSettings = JSON.parse(chartSettings))
  export default {
    name: 'app',
    components: {
      notice,
      indexdatatable,
      indexslider,
      indexrecom
    },
    computed: {
      ...mapGetters(['getApiToken', 'getLang']),
      aboutUrl () {
        // if (this.getLang === 'zh-CN' || this.getLang === 'cht') {
        //   return 'https://cdcc.kf5.com/hc/kb/article/1225583/'
        // } else {
        //   return 'https://cdcc.kf5.com/hc/kb/article/1225583/'
        // }
        return 'javascript:;'
      },
      serviceAgreementUrl () {
        // if (this.getLang === 'zh-CN' || this.getLang === 'cht') {
        //   return 'https://cdcc.kf5.com/hc/kb/article/1225585/'
        // } else {
        //   return 'https://cdcc.kf5.com/hc/kb/article/1225582/'
        // }
        return 'javascript:;'
      },
      privacyNoticeUrl () {
        // if (this.getLang === 'zh-CN' || this.getLang === 'cht') {
        //   return 'https://cdcc.kf5.com/hc/kb/article/1225585/'
        // } else {
        //   return 'https://cdcc.kf5.com/hc/kb/article/1225585/'
        // }
        return 'javascript:;'
      },
      rateStandardUrl () {
        // if (this.getLang === 'zh-CN' || this.getLang === 'cht') {
        //   return 'https://cdcc.kf5.com/hc/kb/article/1225584/'
        // } else {
        //   return 'https://cdcc.kf5.com/hc/kb/article/1225584/'
        // }
        return 'javascript:;'
      }
    },
    watch: {
      getApiToken () {
        this.socket && this.socket.changeLogin()
      }
    },
    created () {
      this.socket = KLineWebSocket({
        symbol: this.symbol,
        period: chartSettings ? chartSettings.charts.period : null,
        callback: (res) => {
          if (res.dataType === 'markets') {
            // 市场信息
            let datas = this.$refs.indexdatatable.products
            let tempObj = {}
            datas.forEach((item) => {
              tempObj[item.market] = item.collection
            })
            res.data.forEach((item) => {
              item.collection = tempObj[item.market]
            })
            this.$refs.indexdatatable.products = res.data
          } else if (res.dataType === 'SymbolVolumes') { // 币种成交量
            this.$refs.indexdatatable.symbolVolumes = res.data
          }
        },
        onClose: () => {
          this.closeMainLoading = true
        }
      })
    },
    beforeDestroy () {
      this.socket && this.socket.close()
    }
  }
</script>

<style scoped>
.container{width:100%;min-height:calc(100% - 60px);display:flex;flex-direction:column;}
.volume{font-size: 12px;}
.bk-wrap{position:relative;overflow:hidden;min-width:1190px;}
.bk-main{position:relative;overflow:hidden;margin:0 auto;max-width:1360px;}
.bottom{min-width:1190px;}
.bottom-center{display:flex;margin:0 auto;min-width:1190px; max-width:1360px;height:50px;border-bottom:1px solid #343434;color:#586687;justify-content:space-between;align-items:center;}
.bottom-center .item{text-align:left;-webkit-transition:all .2s;transition:all .2s;flex:1 1 auto;color:#FFF;}
.bottom-center .item a{color:#FFF; position: relative;}
.bottom-center .item a:hover,.bottom-center .item:hover{color:#FFF;cursor:pointer;}
.bottom-center .item a.contact-icons{color:#BA8D35;}
/*.bottom-center .item a.contact-icons:before{color:#ffffff;}*/
.bottom-center .item a.contact-icons:hover,.bottom-center .item.contact-icons:hover{color: #a37c2f;cursor:pointer;}
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
.center-btn-cn:hover{color: #fdb902;border-color: #fdb902;}

.footer{
  color: #9b9b9b;
}
.footer > p{
  line-height: 80px;
}
.contact-icons{font-size:24px;}
.wxqr {position: absolute; width: 140px; height: 140px; z-index: 1; background-color: #F5F5F5; border-radius: 4px; left: -58px; bottom: 45px;padding: 10px; box-sizing: border-box; display: none;}
.wxqr img {width: 120px; height: 120px;}
.wxqr i {position: absolute; left: 50%; margin-left: -5px; bottom: -10px; border-top: 10px solid #F5F5F5; border-left: 10px solid transparent; border-right: 10px solid transparent; z-index: 2;}
.icon-weixin.hover:hover .wxqr {display: block;}
</style>

