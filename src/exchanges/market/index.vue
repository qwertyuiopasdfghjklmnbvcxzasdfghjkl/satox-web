<template>
  <div class="market" :class="[fullscreen && fullscreen.isFullscreen ? 'marketfull' : '']">
      <coininfo :iconUrl="iconUrl" :baseSymbol="baseSymbol" :currentSymbol="currentSymbol" :isShow="isShowCoinInfo"/>
      <div class="left" v-if="canvasStyles.active==='kline'">
        <ul class="drawtools">
          <li v-for="item in drawtools.datas" :key="item.id" v-show="hideDrawItem(item.key)" class="drawicon" @click="drawtoolsActive=item.key"
            :class="['icon-draw-' + item.id, item.key === drawtoolsActive ? 'selected' : '']" :title="item.title"></li>
          <li class="drawicon icon-delete" @click="clearCanvasToolsLine" :title="$t('public0.public3')"></li>
        </ul>
      </div>
      <div class="right" :class="{marginLeft:canvasStyles.active==='depth'}">
        <div class="tools">
          <ul class="menus">
            <!-- K线图和深度图切换 -->
            <li class="dropdown" :class="{active: canvasStyles.show}" @click.stop="canvasStyles.show = !canvasStyles.show">
              <span class="dropdown-txt">{{$t(`public.${canvasStyles.active}_title`)}}</span>
              <em class="dropdown-icon icon-arrow-down" :class="{'dropdown-icon-active':canvasStyles.show}"></em>
              <ul class="dropdown-list" v-show="canvasStyles.show" style="width:80px">
                <li class="dropdown-item" :class="{selected:canvasStyles.active==='kline'}" @click="canvasStyles.active='kline'">{{$t('public.kline_title')}}</li>
                <li class="dropdown-item" :class="{selected:canvasStyles.active==='depth'}" @click="canvasStyles.active='depth'">{{$t('public.depth_title')}}</li>
              </ul>
            </li>
            <!-- 周期 -->
            <li class="dropdown" :class="{active: periods.show}" @click.stop="periods.show = !periods.show" v-show="canvasStyles.active==='kline'">
              <span class="dropdown-txt">{{curPeriod}}</span>
              <em class="dropdown-icon icon-arrow-down" :class="{'dropdown-icon-active':periods.show}"></em>
              <ul class="dropdown-list" v-show="periods.show">
                <li v-for="item in periodsDatas" :key="item.id" class="dropdown-item" :class="{selected:item.id===periods.active}" @click="switchPeriod(item)">{{item.name}}</li>
              </ul>
            </li>
            <!-- 技术指标 -->
            <li class="dropdown" :class="{active: quotas.show}" @click.stop="quotas.show = !quotas.show" v-show="canvasStyles.active==='kline'">
              <span class="dropdown-txt">{{quotas.active}}</span>
              <em class="dropdown-icon icon-arrow-down" :class="{'dropdown-icon-active':quotas.show}"></em>
              <ul class="dropdown-list" v-show="quotas.show">
                <li v-for="item in quotas.datas" :key="item" class="dropdown-item" :class="{selected:item===quotas.active}" @click="quotas.active=item">{{item}}</li>
              </ul>
            </li>
            <!-- 主图样式 -->
            <li class="dropdown" :class="{active: mainStyles.show}" @click.stop="mainStyles.show = !mainStyles.show" v-show="canvasStyles.active==='kline'">
              <span class="dropdown-txt">{{mainStyles.active}}</span>
              <em class="dropdown-icon icon-arrow-down" :class="{'dropdown-icon-active':mainStyles.show}"></em>
              <ul class="dropdown-list" v-show="mainStyles.show">
                <li v-for="item in mainStyles.datas" :key="item" class="dropdown-item" :class="{selected:item===mainStyles.active}" @click="mainStyles.active=item">{{item}}</li>
              </ul>
            </li>
          </ul>
          <a class="fullscreen" :class="[fullscreen && fullscreen.isFullscreen ? 'icon-shrink' : 'icon-enlarge']" @click="toggleFullScreen"></a>
        </div>
        <div class="container">
          <div class="container-transform" :class="{depth:canvasStyles.active==='depth'}">
            <div ref="canvas" class="canvas">
              <div v-if="showLoading" class="loading">
                <loading></loading>
              </div>
            </div>
            <div ref="depth" class="depth">
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import KLineChart from '@/assets/js/kline.draw'
import DepthChart from '@/assets/js/kline.depth'
import fullscreen from '@/assets/js/fullscreen'
import numUtils from '@/assets/js/numberUtils'
import loading from '@/components/loading'
import coininfo from './coininfo'
import { mapGetters, mapActions } from 'vuex'
let chartSettings = window.localStorage.getItem('chartSettings')
chartSettings && (chartSettings = JSON.parse(chartSettings))
export default {
  props: {
    symbol: {
      type: String,
      default: ''
    },
    baseSymbol: null,
    currentSymbol: null,
    iconUrl: null,
    klineData: {
      type: Array,
      defualt: () => {
        return []
      }
    },
    closeMainLoading: {
      type: Boolean,
      default: false
    }
  },
  components: {
    coininfo,
    loading
  },
  data () {
    return {
      isShowCoinInfo: false,
      showLoading: true,
      isEntrustShow: false,
      drawtoolsActive: 'CrossCursor',
      asks: [],
      bids: [],
      canvasStyles: {
        active: 'kline',
        show: false
      },
      periods: {
        show: false,
        active: chartSettings ? chartSettings.charts.period : '1m'
      },
      quotas: {
        show: false,
        active: chartSettings ? chartSettings.charts.indics[1] : 'MACD',
        datas: ['MACD', 'KDJ', 'StochRSI', 'RSI', 'DMI', 'OBV', 'BOLL', 'SAR', 'DMA', 'TRIX', 'BRAR', 'VR', 'EMV', 'WR', 'ROC', 'MTM', 'PSY']
      },
      mainStyles: {
        show: false,
        active: chartSettings ? chartSettings.charts.chartStyle : 'CandleStick',
        datas: ['CandleStick', 'CandleStickHLC', 'OHLC']
      },
      kLineChart: null,
      depthChart: null,
      fullscreen: null,
      langs: {
        'zh-CN': 'zh-cn',
        'en': 'en-us',
        'cht': 'zh-tw'
      }
    }
  },
  computed: {
    ...mapGetters(['getLang']),
    drawtools () {
      // 光标、十字光标、线段、直线、射线、箭头、水平直线、水平射线、垂直直线、平行直线
      return {
        datas: [
          {id: 'crosscursor', key: 'CrossCursor', title: this.$t('public0.public174')},
          {id: 'arrow', key: 'Cursor', title: this.$t('public0.public173')},
          {id: 'trendline', key: 'SegLine', title: this.$t('public0.public175')},
          {id: 'straightline', key: 'StraightLine', title: this.$t('public0.public176')},
          {id: 'rayline', key: 'RayLine', title: this.$t('public0.public177')},
          {id: 'arrowline', key: 'ArrowLine', title: this.$t('public0.public178')},
          {id: 'horizontalline', key: 'HoriStraightLine', title: this.$t('public0.public179')},
          {id: 'horirayline', key: 'HoriRayLine', title: this.$t('public0.public180')},
          {id: 'verticalline', key: 'VertiStraightLine', title: this.$t('public0.public181')},
          {id: 'biparallelrayline', key: 'BiParallelLine', title: this.$t('public0.public182')}
        ]
      }
    },
    curPeriod () {
      let datas = this.periodsDatas
      for (let i = 0; i < datas.length; i++) {
        let data = datas[i]
        if (this.periods.active === data.id) {
          return data.name
        }
      }
      return null
    },
    periodsDatas () {
      // 分时 分钟 小时 日线 周线
      return [
        {id: 'line', name: this.$t('exchange.exchange_time')},
        {id: '1m', name: `1${this.$t('exchange.exchange_min')}`},
        {id: '3m', name: `3${this.$t('exchange.exchange_min')}`},
        {id: '5m', name: `5${this.$t('exchange.exchange_min')}`},
        {id: '15m', name: `15${this.$t('exchange.exchange_min')}`},
        {id: '30m', name: `30${this.$t('exchange.exchange_min')}`},
        {id: '1h', name: `1${this.$t('exchange.exchange_hour')}`},
        {id: '2h', name: `2${this.$t('exchange.exchange_hour')}`},
        {id: '4h', name: `4${this.$t('exchange.exchange_hour')}`},
        {id: '6h', name: `6${this.$t('exchange.exchange_hour')}`},
        {id: '12h', name: `12${this.$t('exchange.exchange_hour')}`},
        {id: '1d', name: this.$t('exchange.exchange_1D')},
        {id: '1w', name: this.$t('exchange.exchange_1W')}
      ]
    },
    depthChange () {
      return {
        asks: this.filterAsks,
        bids: this.filterBids
      }
    },
    filterAsks () {
      let mergeDatas = []
      let temp = {}
      this.asks.forEach((item) => {
        let key = this.toFixed(item.price)
        let tempItem = temp[key]
        if (!tempItem) {
          temp[key] = {
            price: key,
            avaliableAmount: item.avaliableAmount
          }
          mergeDatas.push(temp[key])
        } else {
          tempItem.avaliableAmount = numUtils.add(tempItem.avaliableAmount, item.avaliableAmount).toString()
        }
      })
      let newDatas = []
      mergeDatas.forEach((item) => {
        newDatas.push([item.price, item.avaliableAmount])
      })
      newDatas.sort((item1, item2) => {
        return numUtils.BN(item1[0]).lt(numUtils.BN(item2[0])) ? -1 : 1
      })
      return newDatas
    },
    filterBids () {
      let mergeDatas = []
      let temp = {}
      this.bids.forEach((item) => {
        let key = this.toFixed(item.price)
        let tempItem = temp[key]
        if (!tempItem) {
          temp[key] = {
            price: key,
            avaliableAmount: item.avaliableAmount
          }
          mergeDatas.push(temp[key])
        } else {
          tempItem.avaliableAmount = numUtils.add(tempItem.avaliableAmount, item.avaliableAmount).toString()
        }
      })
      let newDatas = []
      mergeDatas.forEach((item) => {
        newDatas.push([item.price, item.avaliableAmount])
      })
      return newDatas
    }
  },
  watch: {
    klineData () {
      this.$nextTick(() => {
        this.showLoading = false
        this.kLineChart && this.kLineChart.updateKlienDatas(this.klineData)
      })
    },
    symbol () {
      if (this.symbol) {
        this.$nextTick(() => {
          this.kLineChart && this.kLineChart.switch_market(this.symbol)
        })
      }
    },
    'drawtoolsActive' () {
      this.kLineChart && this.kLineChart.drawingTool(this.drawtoolsActive)
    },
    'periods.show' (bool) {
      if (bool) {
        this.wclick('periods')
      }
    },
    'quotas.show' (bool) {
      if (bool) {
        this.wclick('quotas')
      }
    },
    'mainStyles.show' (bool) {
      if (bool) {
        this.wclick('mainStyles')
      }
    },
    'canvasStyles.show' (bool) {
      if (bool) {
        this.wclick('canvasStyles')
      }
    },
    'quotas.active' (val) {
      this.$nextTick(() => {
        this.kLineChart && this.kLineChart.switch_indic(val)
      })
    },
    'mainStyles.active' (val) {
      this.$nextTick(() => {
        this.kLineChart && this.kLineChart.switch_chartStyle(val)
      })
    },
    getLang (val) {
      this.$nextTick(() => {
        this.kLineChart && this.kLineChart.switch_language(this.langs[val])
      })
    },
    closeMainLoading (val) {
      if (val) {
        this.showLoading = false
      }
    },
    depthChange () {
      this.depthChart && this.depthChart.drawDepth(this.depthChange)
    },
    'canvasStyles.active' () {
      this.$nextTick(() => {
        this.resize()
      })
    }
  },
  created () {
    this.$nextTick(() => {
      this.addEvents({
        name: 'klineEvent',
        fun: this.klineEvent
      })
    })
    this.$nextTick(() => {
      this.fullscreen = fullscreen({
        change: (isFullScreen) => {
          this.$nextTick(() => {
            this.resize()
          })
        }
      })
      this.kLineChart = KLineChart({
        container: this.$refs.canvas,
        klineType: 'eosbtc',
        hideDepth: true,
        scale: 3,
        fixedNumber: 8,
        ThemeColor: {
          Background: '#333232',
          Grid0: '#54616c',
          Grid1: '#54616c'
        },
        onToolCallback: () => {
          this.drawtoolsActive = 'CrossCursor'
        }
      })
      this.kLineChart && this.kLineChart.switch_indic(this.quotas.active)
      this.kLineChart && this.kLineChart.switch_language(this.langs[this.getLang])
      window.addEventListener('click', this.wclick, false)
      window.addEventListener('resize', this.resize, false)

      // 深度图
      this.depthChart = DepthChart({
        gridLineColor: '#54616c',
        tpFillStyle: '#333232',
        container: this.$refs.depth
      })
    })
  },
  beforeDestroy () {
    this.removeEvents('klineEvent')
    window.removeEventListener('click', this.wclick, false)
    window.removeEventListener('resize', this.resize, false)
  },
  methods: {
    ...mapActions(['addEvents', 'removeEvents']),
    klineEvent (res) {
      if (res && res.type === 'showCoinInfo') {
        this.isShowCoinInfo = !this.isShowCoinInfo
      } else if (res && res.type === 'resize') {
        this.isEntrustShow = res.value
        this.resize()
      } else if (res && res.type === 'depth') {
        this.asks = res.asks
        this.bids = res.bids
      }
    },
    hideDrawItem (item) {
      if (this.isEntrustShow) {
        return !(item === 'RayLine' || item === 'HoriStraightLine' || item === 'HoriRayLine' || item === 'VertiStraightLine')
      } else {
        return true
      }
    },
    wclick (type) {
      let arr = ['periods', 'quotas', 'mainStyles', 'canvasStyles']
      arr.forEach((item) => {
        if (item !== type) {
          this[item].show = false
        }
      })
    },
    resize () {
      this.kLineChart && this.kLineChart.on_size()
      this.depthChart && this.depthChart.resize()
    },
    toggleFullScreen () {
      this.fullscreen.toggle()
    },
    switchPeriod (item) {
      this.periods.active = item.id
      this.kLineChart && this.kLineChart.switch_period(item.id)
      this.$emit('switchPeriod', item.id)
    },
    clearCanvasToolsLine () {
      this.drawtoolsActive = 'CrossCursor'
      this.kLineChart && this.kLineChart.clearCanvasToolsLine()
    },
    toFixed (v1) {
      return numUtils.BN(v1).toFixed(this.fixedNumber)
    }
  }
}
</script>

<style scoped>
.market{display:flex;flex:1;justify-content:center;align-items:center;width:100%;background:#333232;position:relative;}
.market.marketfull{position:absolute;width:100%;height:100vh;z-index:9999;top:0;left:0;}
.left{width:44px;height:100%;margin-right:6px;overflow:hidden;}
.right{display:flex;flex-flow:column;flex:1;height:100%;}
.right.marginLeft{margin-left:10px;}
.tools{width:100%;height:36px;display:flex;align-items:center;font-size:18px;}
.menus{display:flex;}
.dropdown{
  min-width:60px;line-height:24px;height:24px;border:1px solid #636e87;margin-right:4px;background:transparent;font-size:14px;
  display:flex;text-align:center;position:relative;text-transform:none;cursor:pointer;
}
.dropdown-txt{width:calc(100% - 14px);color:#d6dff9;border-right:1px solid #636e87;padding:0 4px;}
.dropdown-icon{
  width:13px;display:flex;justify-content:center;align-items:center;
  color:#d6dff9;font-size:12px;transition:transform .35s ease;-webkit-transition:transform .35s ease;
}
.dropdown-icon-active{
   transform:rotate(-180deg);-ms-transform:rotate(-180deg);-moz-transform:rotate(-180deg);
   -webkit-transform:rotate(-180deg);-o-transform:rotate(-180deg);
}
.dropdown-list{
  position:absolute;z-index:10;top:26px;left:-1px;background:#333232;width:150px;border:1px solid #636e87;
  display:flex;flex-flow:column;
}
.dropdown-item{
  width:100%;height:24px;line-height:24px;text-align:left;text-indent:10px;text-transform:none;color:#d6dff9;
}
.dropdown-item.selected,.dropdown-item:hover{background:#222121;}
.fullscreen{display:flex;justify-content:center;align-items:center;cursor:pointer;color:#d6dff9;background:transparent;width:24px;height:24px;border:1px solid #636e87;}
.fullscreen:hover,.dropdown:hover,.dropdown.active{}
.container{width:calc(100% - 12px);height:calc(100% - 46px);overflow:hidden;border:1px solid #54616c;}
.container-transform{width:200%;height:100%;display:flex;transition:300ms;}
.container-transform.depth{margin-left:-100%;}
.canvas{display:flex;flex:1;position:relative;overflow:hidden;}
.depth{display:flex;flex:1;position:relative;overflow:hidden;}
.drawtools{display:flex;justify-content:center;align-items:center;flex-flow:column;width:100%;margin-top:4px;}
.drawicon{display:flex;justify-content:center;align-items:center;height:30px;font-size:24px;color:#758696;}
.drawicon:hover{color:#11a8fe;}
.drawicon.selected{color:#11a8fe;}
.icon-delete{font-size:18px;width:24px;}
.loading{width:100%;height:100%;display:flex;align-items:center;justify-content:center;position:absolute;top:0;left:0;z-index:4;flex-flow:column;}
.loading /deep/ font{font-size:20px;color:#fff;}
</style>

