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
        <p>© 2017-2018 newton.io All Rights Reserved</p>
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
.container{width:100%;height:895px;}
.volume{font-size: 12px;}
.bk-wrap{position:relative;overflow:hidden;width:100%;}
.bk-main{position:relative;overflow:hidden;margin:0 auto;width:1172px;}
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
  .bottom-center{width: auto;margin: 0px 50px;}
}
@media only screen and (min-width: 800px) and (max-width: 1000px) {
  .bottom{height: auto;}
  .bottom-center{width: auto;display: block;}
  .center-l{display: flex;justify-content: space-between;padding: 0px 50px;}
  .follow,.bottom-icons{line-height: 143px;}
  .center-r-title{margin-top: 0px;}
  .center-r{display: flex;justify-content: space-around;padding-bottom: 30px;}
}
@media only screen and (min-width: 600px) and (max-width: 800px) {
  .bottom{height: auto;}
  .bottom-center{width: auto;display: block;}
  .center-l{display: block;padding: 0px 50px;}
  .follow{line-height: 40px;}
  .bottom-icons{line-height: 56px;}
  .center-r-title{margin-top: 0px;}
  .center-r{display: flex;justify-content: space-around;padding-bottom: 30px;line-height: 50px;margin-top: 29px;}
}
@media only screen and (min-width: 338px) and (max-width: 600px) {
  .bottom{height: auto;}
  .bottom-center{width: auto;display: block;}
  .center-l{display: block;padding: 0px 50px;}
  .follow{line-height: 40px;}
  .bottom-icons{line-height: 40px;}
  .center-r-title{margin-top: 0px;}
  .center-r{display: block;padding-bottom: 30px;line-height: 50px;margin-top: 29px;text-align: center;}
  .center-btn-en{margin-bottom: 10px;}
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

