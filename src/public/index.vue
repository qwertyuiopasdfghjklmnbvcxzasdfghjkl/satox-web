<template>
  <div class="container">
    <!--轮播-->
    <indexslider></indexslider>
    <!--推荐市场-->
    <indexrecom ref="indexrecom"></indexrecom>
    <!--数据表格-->
    <indexdatatable ref="indexdatatable"></indexdatatable>

    <div class="bottom">
      <div class="bottom-center">
        <div class="item">
          <a :href="getLang === 'en' ? 'https://bitark.zendesk.com/hc/en-us/articles/360010724532-About-Us' : 'https://bitark.zendesk.com/hc/zh-cn/articles/360010724532-%E5%85%B3%E4%BA%8E%E6%88%91%E4%BB%AC'" target="_blank">{{$t('public.foot_about')}}</a>
        </div><!--关于我们-->
        <div class="item">
          <a :href="getLang === 'en' ? 'https://bitark.zendesk.com/hc/en-us/articles/360010724752-BITARK-Terms-of-Use' : 'https://bitark.zendesk.com/hc/zh-cn/articles/360010724752-BITARK%E6%9C%8D%E5%8A%A1%E6%9D%A1%E6%AC%BE'" target="_blank">{{$t('public.foot_terms')}}</a>
        </div><!--服务协议-->
        <div class="item">
          <a :href="getLang === 'en' ? 'https://bitark.zendesk.com/hc/en-us/articles/360011219731-BITARK-Privacy-Policy' : 'https://bitark.zendesk.com/hc/zh-cn/articles/360011219731-BITARK%E9%9A%90%E7%A7%81%E6%9D%A1%E6%AC%BE%E5%8F%8A%E5%A3%B0%E6%98%8E'" target="_blank">{{$t('public.foot_privacy')}}</a>
        </div><!--隐私声明-->
        <div class="item">
          <a :href="getLang === 'en' ? 'https://bitark.zendesk.com/hc/en-us/articles/360011894812-Fees-' : 'https://bitark.zendesk.com/hc/zh-cn/articles/360011894812-%E8%B4%B9%E7%8E%87%E6%A0%87%E5%87%86'" target="_blank">{{$t('public.foot_fees')}}</a>
        </div><!--费率标准-->
        <div class="item"></div>
        <div class="item">{{$t('public.foot_contact')}}</div><!--联系我们-->
        <div class="item">
          <a class="contact-icons icon-facebook" href="https://www.facebook.com/bitark.io" target="_blank"></a>
        </div>
        <div class="item">
          <a class="contact-icons icon-twitter" href="https://twitter.com/bitarkcommunity" target="_blank"></a>
        </div>
        <div class="item">
          <a class="contact-icons icon-telegram" href="https://t.me/Bitarkio" target="_blank"></a>
        </div>
        <div class="item">
          <a class="contact-icons icon-slack" href="https://join.slack.com/t/bitark/shared_invite/enQtMjczMzU2MDgxNjIxLTJkNmU3NWZiYWI1N2I1ZTZhMWMzYmNmZGQyN2U4NjllOTUzOGRlNjYxMDQ5NDIxYjhkNmYxNTc0MTljNjNiYzk" target="_blank"></a>
        </div>
        <div class="item">
          <a class="contact-icons icon-weixin">
            <div class="wechat">
              <img src="../assets/images/wechat.png"/>
            </div>
          </a>
        </div>
      </div>
    </div>

    <section class="bk-wrap footer-main">
      <section class="bk-main footer">
        <p>© 2017-2018 bitark.io All Rights Reserved</p>
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
  let chartSettings = window.localStorage.getItem('chartSettings')
  chartSettings && (chartSettings = JSON.parse(chartSettings))
  export default {
    name: 'app',
    components: {
      indexdatatable,
      indexslider,
      indexrecom
    },
    data () {
      return {
        bitark: []
      }
    },
    computed: {
      ...mapGetters(['getApiToken', 'getLang'])
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
.container .font-white{color:#becbe8;}
.container .font-red{color:#e65353;}
.container .font-green{color:#48d417;}
.container{width:100%;height:895px;}
.currency{color: #9fa7bf;font-size: 16px;}
.ticker-list {font-size: 14px;color: #9fa7bf;margin-top: 10px;}
.t-font-red{color:#e65353}
.t-font-green{color:#48d417}
.ticker-list em{font-size: 14px;color: #727272;}
.ticker-list i{color:#e65353;}
.ticker-list i.bg{color: #48d417;}
.type_symbol{width: 100%;background-color:#182138;overflow: hidden;}
.type_symbol ul{display: flex;text-align: center;justify-content: space-between;align-items: center;height: 150px;}
.type_symbol ul li{
  font-size: 14px;
  background: #0c142c;
  padding: 10px;
  width: 351px;
  text-align: left
}
.infotip{
  float: right;
  font-size: 12px;
}
.volume{font-size: 12px;}
.type_symbol_wrap{width:1200px; margin: 0 auto}
.type_symbol ul li div{line-height: 21px;}
.currency .icon-btc,.currency .icon-eth{vertical-align: middle;line-height: 21px;}
.bk-wrap{position:relative;overflow:hidden;width:100%;}
.bk-main{position:relative;overflow:hidden;margin:0 auto;width:1172px;}
.beijing001{background:#0c1426;}
.beijing001-center{display:flex;height:360px;flex-flow:row wrap;justify-content:space-between;align-items:center;}
.slider-nav{position:absolute;bottom:22px;left:45%;}
.slider-nav ul{margin:0 auto;width:170px;}
.slider-nav ul li{display:inline-block;width:35px;}
.slider-nav ul li span{display:inline-block;width:30px;height:4px;border-radius:2px;background:#47577f;}
.slider-nav ul li span.slider-this{background:#48bcff;}
.beijing{width:100%;height: 640px; position:relative;display:flex;background: url(../assets/images/bg1.png) no-repeat;background-size: cover;}
.beijing-center1{width:1172px;text-align: center;margin: 225px auto auto auto;}
.beijing-center1-p{font-size: 80px;color: #000;font-weight: bold;letter-spacing:2px;}
.beijing-center1-span{font-size: 30px;color: #fff;font-weight: bold;letter-spacing:2px;width:500px;display: inline-block;}
.beijing1-center-img{position: absolute;bottom: 0px;left: 0px;right: 0px;}
.beijing2{height: 466px;width: 100%;background: #182138;overflow: hidden;}
.beijing2-center{width: 1172px;margin: 0 auto; display: flex;justify-content: space-between;}
.bejing2-center-l{width: 51%;}
.bejing2-center-l-h4{font-size: 24px;color: #aeb7cd;margin-top: 88px;}
.bejing2-center-l-p{font-size: 18px;color: #aeb7cd;line-height: 32px;margin-top: 10px;}
.beijing2-center-r{text-align: center;}
.beijing2-center-r-a{display: inline-block;width: 220px;height: 36px;margin-top: 50px; line-height: 36px;background-color: #11a8fe;color: #fff;font-size: 18px;text-align: center;border-radius: 4px;}
.beijing2-center-r-a:hover{background-color: #15c9ff;}
.beijing2-center-r-img{margin-top: 62px;margin-bottom: 40px;}
.beijing3{height: 558px;width: 100%;position: relative;background: #182138;overflow: hidden;}
.beijing3-center{width: 1172px;margin: 0 auto;display: flex;justify-content: space-between;}
.beijing3-center-l-img{margin-top: 196px;}
.beijing3-center-r{width: 51%;}
.beijing3-center-r-h4{font-size: 24px;color: #aeb7cd;margin-top: 152px;}
.beijing3-center-r-p{font-size: 18px;color: #aeb7cd;line-height: 40px;margin-top: 36px;}
.beijing3-center-r-a{display: inline-block;margin-top: 50px; width: 220px;height: 36px;line-height: 36px;background-color: #11a8fe;color: #fff;font-size: 18px;text-align: center;border-radius: 4px;}
.beijing3-center-r-a:hover{background-color: #15c9ff;}
.beijing3-shadow{position: absolute;width:100%;left:0;right: 0;}
.beijing4{height: 680px;width: 100%; background: #182138;overflow: hidden;position: relative;}
.beijing4-center{width: 1172px;margin: 0 auto; display: flex;justify-content: space-between;}
.beijing4-center-l{width: 51%;}
.beijing4-center-l-h4{font-size: 24px;color: #aeb7cd;margin-top: 78px;}
.beijing4-center-l-p{font-size: 18px;color: #aeb7cd;line-height: 40px;margin-top: 36px;}
.beijing4-center-r-a{display: inline-block;margin-top: 39px;margin-bottom: 40px; width: 220px;height: 36px;line-height: 36px;background-color: #11a8fe;color: #fff;font-size: 18px;text-align: center;border-radius: 4px;}
.beijing4-center-r-a:hover{background-color: #15c9ff;}
.beijing4-center-r-img{margin-top: 42px;}
.abs{display:flex;flex-flow:column;justify-content:center;align-items:center;margin:0 20px;}
.abs-title{font-size:36px;font-weight:bold;color:#333;text-align:center;}
.abs-button{font-size:24px;min-width:215px;height:40px;line-height:40px;color:#333;border:2px solid #333;text-align:center;margin-top:15px;padding:0 10px;}
.abs-button.w255{width:255px;cursor:not-allowed;}
.abs-button:hover{color:#ffeb45;border-color:#ffeb45;}
.bottom{background: #090f1f;}
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
@media only screen and (min-width: 1000px) and (max-width: 1200px) {
  .beijing-center1{width: auto;}
  .beijing2-center{width: auto;margin: 0px 50px;}
  .beijing3-center{width: auto; margin: 0px 50px;}
  .beijing4-center{width: auto; margin: 0px 50px;}
  .bottom-center{width: auto;margin: 0px 50px;}
  .beijing2-center-r{text-align: center;display: flex;justify-content: space-between;}
  .beijing2-center-r-img{margin-top: 50px;}
  .beijing2-center-r-a{margin-top: 190px;}
  .beijing4-center-l{text-align: center;}
  .beijing4{height: auto;}
  .beijing4-center-r{text-align: center;}
}
@media only screen and (min-width: 800px) and (max-width: 1000px) {
  .beijing2{height: auto;}
  .beijing2-center{width: auto;margin:0 30px;}
  .beijing2-center-r-img{margin-top: 20px;}
  .beijing3{height: auto;}
  .beijing3-center{width: auto;}
  .beijing3-center-l{text-align: center;}
  .beijing3-center-l-img{margin-top: 50px;}
  .beijing3-center-r{background:#182138;padding:0 50px;}
  .beijing3-center-r-h4{margin-top: 0px;}
  .beijing3-center-r-a{margin-bottom: 30px;}
  .beijing4-center{width: auto;margin: 0 50px;}
  .beijing4-center-r{position: absolute;right: 0;top: 0px;}
  .bottom{height: auto;}
  .bottom-center{width: auto;display: block;}
  .center-l{display: flex;justify-content: space-between;padding: 0px 50px;}
  .follow,.bottom-icons{line-height: 143px;}
  .center-r-title{margin-top: 0px;}
  .center-r{display: flex;justify-content: space-around;padding-bottom: 30px;}
  .beijing-center1{width: auto;}
  .beijing2-center-r{display: flex;justify-content: space-between;}
  .beijing2-center-r-a{margin-top: 50px;margin-bottom: 32px;}
}
@media only screen and (min-width: 600px) and (max-width: 800px) {
  .beijing2{height: auto;}
  .beijing2-center{width: auto;margin:0 30px;}
  .beijing2-center-r-img{margin-top: 20px;}
  .beijing3{height: auto;}
  .beijing3-center{width: auto;}
  .beijing3-center-l{text-align: center;}
  .beijing3-center-l-img{margin-top: 50px;}
  .beijing3-center-r{background:#182138;padding:0 50px;}
  .beijing3-center-r-h4{margin-top: 0px;}
  .beijing3-center-r-a{margin-bottom: 30px;}
  .beijing4-center{width: auto;margin: 0 50px;}
  .beijing4-center-r{position: absolute;right: 0;top: 0px;}
  .bottom{height: auto;}
  .bottom-center{width: auto;display: block;}
  .center-l{display: block;padding: 0px 50px;}
  .follow{line-height: 40px;}
  .bottom-icons{line-height: 56px;}
  .center-r-title{margin-top: 0px;}
  .center-r{display: flex;justify-content: space-around;padding-bottom: 30px;line-height: 50px;margin-top: 29px;}
  .beijing-center1{width: auto;}
  .beijing2-center-r{display: flex;justify-content: space-between;}
  .beijing2-center-r-a{margin-top: 50px;margin-bottom: 32px;}
}
@media only screen and (min-width: 338px) and (max-width: 600px) {
  .beijing2{height: auto;}
  .beijing2-center{width: auto;margin:0 30px;display: block;}
  .beijing2-center-r-img{margin-top: 20px;}
  .beijing3{height: auto;}
  .beijing3-center{width: auto;display: block}
  .beijing3-center-l{text-align: center;}
  .beijing3-center-l-img{margin-top: 50px;}
  .beijing3-center-r{background:#182138;width: 100%;text-align: center;}
  .beijing3-center-r-h4{margin-top: 0px;}
  .beijing3-center-r-a{margin-bottom: 30px;}
  .beijing4-center{width: 100%;display: block;}
  .beijing4-center-r{position: absolute;top: 344px;display: flex;justify-content: center;align-items: center;width: 100%;}
  .bottom{height: auto;}
  .bottom-center{width: auto;display: block;}
  .center-l{display: block;padding: 0px 50px;}
  .follow{line-height: 40px;}
  .bottom-icons{line-height: 40px;}
  .center-r-title{margin-top: 0px;}
  .center-r{display: block;padding-bottom: 30px;line-height: 50px;margin-top: 29px;text-align: center;}
  .beijing-center1{width: auto;}
  .beijing2-center-r{display: flex;justify-content: center;width: 100%;align-items: center;}
  .beijing2-center-r-a{margin-top: 50px;margin-bottom: 32px;}
  .bejing2-center-l{width: 100%;text-align: center;}
  .type_symbol ul li{margin-right: 10px;}
  .beijing4-center-l{width: 100%;text-align: center;}
  .center-btn-en{margin-bottom: 10px;}
  .beijing-center1-span{width: auto;}
}
.footer-main{
  background: #090f1f;
}
.footer{
  background: #090f1f;
  color: #586687;
}
.footer > p{
  line-height: 80px;
}
.contact-icons{font-size:24px;}
</style>

