<template>
  <div class="exponent">
    <div class="exponent-top">
      <div class="keypoint-cont">
        <p class="type">
          <span>
            <i class="icon" :class="[`icon-${params.symbol.toLowerCase()}`]"></i>
            <em class="label">{{params.symbol}} {{$t('public0.public158')}}<!--指数--></em>
            <span class="tips" v-if="!isATN">
              <i class="tips-icon">?</i>
              <em class="tips-text">{{$t('otc_ad.data_sources')}}<!--数据来自coinmarket--></em>
            </span>
          </span>
          <!-- <span>CNY</span> -->
          <select v-if="!isATN" v-model="params.currency">
            <option v-for="item in currencys" :key="item.id" :value="item.value">{{$t(item.text)}}</option>
          </select>
          <select v-if="isATN" v-model="params.currency">
            <option value="USD">{{$t('otc_exchange.otc_exchange_USD')}}</option>
          </select>
        </p>
        <p class="newest" :class="percent.indexOf('-') === -1 ? 'up' : 'down'">
          <strong>{{curPrice}} {{isATN ? 'USD' : params.currency}}</strong>
          <small>{{percent}}%</small>
        </p>
        <p class="low">
          <span>{{$t('exchange.exchange_low')}}<!--24h最低价--></span>
          <span>{{minPrice}}</span>
        </p>
        <p class="high">
          <span>{{$t('exchange.exchange_high')}}<!--24h最高价--></span>
          <span>{{maxPrice}}</span>
        </p>
      </div>
    </div>
    <div class="exponent-bottom" :style="`visibility:${isATN ? 'hidden' : 'visible'};`">
      <div class="kline-cont">
        <div class="kline-cont-canvas" ref="canvas"></div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import otcApi from '@/api/otc'
import otcConfig from '@/assets/js/otcconfig'
import numUtils from '@/assets/js/numberUtils'
export default {
  props: ['params'],
  data () {
    return {
      curPrice: this.params.symbol === otcConfig.additional[0].symbol ? otcConfig.additional[0].price : 0,
      percent: '0',
      minPrice: this.params.symbol === otcConfig.additional[0].symbol ? otcConfig.additional[0].price : '0.00',
      maxPrice: this.params.symbol === otcConfig.additional[0].symbol ? otcConfig.additional[0].price : '0.00',
      currencys: otcConfig.currencys,
      isATN: this.params.symbol === otcConfig.additional[0].symbol
    }
  },
  computed: {
    paramsChange () {
      return {
        bench_marking_id: 1,
        currency: this.params.currency,
        symbol: this.params.symbol
      }
    }
  },
  watch: {
    'params.symbol' (newVal) {
      if (newVal === otcConfig.additional[0].symbol) {
        this.curPrice = otcConfig.additional[0].price
        this.percent = '0'
        this.minPrice = otcConfig.additional[0].price
        this.maxPrice = otcConfig.additional[0].price
        this.isATN = true
      } else {
        this.curPrice = 0
        this.minPrice = '0.00'
        this.maxPrice = '0.00'
        this.isATN = false
      }
    },
    paramsChange () {
      this.getCoinMarket()
    }
  },
  created () {
    this.$nextTick(() => {
      this.getCoinMarket()
    })
  },
  methods: {
    getCoinMarket () {
      if (this.isATN) {
        return
      }
      otcApi.getCoinMarket(this.paramsChange, (res) => {
        let priceArray = []
        let timeArray = []
        this.curPrice = numUtils.BN(res[0].price).toFixed(2)
        this.percent = (res[0].percent_change_24h || '0').toString()
        res.reverse()
        res.forEach((item) => {
          priceArray.push(item.price)
          timeArray.push(item.time)
        })
        this.minPrice = numUtils.BN(Math.min.apply(null, priceArray)).toFixed(2)
        this.maxPrice = numUtils.BN(Math.max.apply(null, priceArray)).toFixed(2)
        this.createCanvas(priceArray, timeArray)
      }, (msg) => {
        console.error(msg)
      })
    },
    createCanvas (priceArray, timeArray) {
      // 以数据最小值为基点进行图表展示
      let minPrice = Math.min.apply(null, priceArray)
      let newPriceArray = []
      priceArray.forEach((item) => {
        newPriceArray.push(item - minPrice)
      })
      // 配置图表
      let option = {
        grid: {
          top: 0,
          right: 16,
          bottom: 20,
          left: 16
        },
        tooltip: {
          trigger: 'axis',
          position: (point) => [point[0], '10%'],
          formatter: (params) => {
            let result = ''
            params.forEach((item) => {
              result += `<span>${this.$t('exchange.exchange_date')}：</span>${params[0].name.substring(0, 16)}<br/><span>${this.$t('exchange.exchange_price')}：</span>${(parseFloat(params[0].data) + minPrice).toFixed(2)}`
            })
            return result
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: true,
          axisLabel: {
            color: '#fff',
            align: 'center',
            padding: [0, 8],
            formatter: (value, index) => value.substring(11, 16)
          },
          data: timeArray
        },
        yAxis: {
          type: 'value',
          axisLine: false,
          splitLine: false,
          boundaryGap: ['10%', '10%']
        },
        series: [
          {
            type: 'line',
            name: '价格',
            symbol: 'none',
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#DDCF6F',
                  width: 1.2
                }
              }
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#DDCF6F'
                  }, {
                    offset: 0.25,
                    color: '#DDCF6F'
                  }, {
                    offset: 0.5,
                    color: '#DDCF6F'
                  }, {
                    offset: 0.75,
                    color: '#DDCF6F'
                  }, {
                    offset: 1,
                    color: '#222121'
                  }
                ],
                globalCoord: false
              }
            },
            data: newPriceArray
          }
        ]
      }
      // 生成图表
      echarts.init(this.$refs.canvas).setOption(option)
    }
  }
}
</script>

<style scoped>
.exponent{background-color: #222121;}
.exponent-top{padding: 8px 8px 0 8px;}
.keypoint-cont p{display: flex;justify-content: space-between;align-items: center;padding-left: 6px;padding-right: 6px;}
.keypoint-cont p.type{height: 42px;padding-left: 0;padding-right: 0;}
.keypoint-cont p.type > span{display: flex;align-items: flex-end;}
.keypoint-cont p.type > span .icon{font-size: 32px;color: #ececec;}
.keypoint-cont p.type > span .label{padding-left: 8px;padding-right: 8px;font-weight: bold;font-size: 18px;color: #aeb7d0;}
.keypoint-cont p.type > span .tips{display: flex;justify-content: center;position: relative;width: 12px;height: 12px;margin-bottom: 6px;}
.keypoint-cont p.type > span .tips-icon{width: 12px;height: 12px;font-weight: bold;font-size: 12px;line-height: 12px;color: #181b2a;text-align: center;background-color: #fff;border-radius: 50%;cursor: help;}
.keypoint-cont p.type > span .tips-text{display: none;position: absolute;top: -30px;height: 24px;padding-left: 12px;padding-right: 12px;font-size: 12px;line-height: 24px;color: #181b2a;white-space: nowrap;background-color: #fff;border-radius: 4px;}
.keypoint-cont p.type > span .tips-text:before{content: "";position: absolute;bottom: -6px;left: 50%;width: 0;height: 0;margin-left: -6px;border-width: 6px 6px 0 6px;border-style: solid;border-color: #fff transparent transparent transparent;}
.keypoint-cont p.type > span .tips-icon:hover + .tips-text{display: block;}
.keypoint-cont p.type select{height: 24px;padding-right: 20px;color: #11a8fe;font-size: 16px;background-position: right 4px center;cursor: pointer;max-width:100px;}
.keypoint-cont p.type select option{font-size: 14px;}
.keypoint-cont p.newest{justify-content: flex-start;align-items: baseline;height: 32px;line-height: 32px;}
.keypoint-cont p.newest strong{font-weight: bold;font-size: 18px;}
.keypoint-cont p.newest small{padding-left: 6px;font-size: 12px;}
.keypoint-cont p.up strong,
.keypoint-cont p.up small{color: #03c087;}
.keypoint-cont p.down strong,
.keypoint-cont p.down small{color: #ff7342;}
.keypoint-cont p.low,
.keypoint-cont p.high{height: 24px;}
.keypoint-cont p.low span,
.keypoint-cont p.high span{font-size: 12px;color: #ececec;}
.kline-cont{padding-bottom: 10px;}
.kline-cont-canvas{height: 300px;}
</style>

