<template>
  <div class="market">
        <div ref="marketTip" class="market-tip" v-show="isShowMarketTip">
          <em class="market-tip-icon icon-arrow-up"></em>
          <valuation :lastPrice="tipPrice.lastPrice" :baseSymbol="tipPrice.baseSymbol"/>
        </div>

        <div class="top-search">
          <em class="icon-search"></em>
          <input v-model="filterValue" maxlength="20" class="top-input-box" type="text" :placeholder="$t('public0.public284')" />
        </div>
        <em class="market-icon" :class="[isList1?'icon-market-list1':'icon-market-list2']" @click="isList1=!isList1"></em>
        <ul class="tabs">
            <li class="tabs-item" :class="{active:active===item, 'icon-star': item === 'collection'}" v-for="item in markets" :key="item" @click="active=item">{{item !== 'collection' ? item : ''}}</li>
        </ul>
        <template v-if="isList1">
          <div class="list-panel">
              <ul class="list1">
                  <li v-for="data in curProducts" :key="data.marketId" class="list1-item" :class="{'list1-item-active':data.market === symbol}" @click="changeSymbol(data)">
                      <em class="list1-collection icon-star" :class="{collection:data.collection}" @click.stop="keep(data)"></em>
                      <span class="list1-percent" :class="getUpOrDown(data)"><font v-html="percent(data)"></font></span>
                      <span class="list1-col list1-currency">
                          <em class="list1-currency-icon">
                            <img :src="data.iconBase64?`data:image/png;base64,${data.iconBase64}`:`${origin}${data.iconUrl}`"/>
                          </em>
                          <font>{{data.currencySymbol}}</font>
                      </span>
                      <span class="list1-col list1-right">
                        <font class="list1-price">
                          {{toFixed(data.lastPrice)}}{{data.baseSymbol}}
                        </font>
                        <font class="list1-amount">
                          <i><valuation :lastPrice="data.lastPrice" :baseSymbol="data.baseSymbol"/></i>
                        </font>
                        <font class="list1-amount">
                          vol. {{toFixed(data.dealAmount, 0)}} {{data.baseSymbol}}
                        </font>
                      </span>
                      <span class="list1-col list1-fall active"></span><!-- 跌涨 -->
                  </li>
                  <li class="list-loading" v-if="showLoading && products.length===0">
                    <loading :size="24"/>
                  </li>
              </ul>
          </div>
        </template>
        <template v-if="!isList1">
          <ul class="list" style="height:24px;max-height:20px;margin-right:0;overflow-y:hidden;">
            <li class="list-header">
              <span class="list-col currency" @click="sortMarket('market')">{{$t('exchange.exchange_pair')}}<!--市场--><em v-if="sortActive==='market'" :class="[sort==='desc'?'icon-arrow-down':'icon-arrow-up']"></em></span>
              <span class="list-col price" @click="sortMarket('price')">{{$t('exchange.exchange_price')}}<!--价格--><em v-if="sortActive==='price'" :class="[sort==='desc'?'icon-arrow-down':'icon-arrow-up']"></em></span>
              <span class="list-col fall" @click="sortMarket('fall')">{{$t('exchange.exchange_Fall_rise')}}<!--日涨跌--><em v-if="sortActive==='fall'" :class="[sort==='desc'?'icon-arrow-down':'icon-arrow-up']" style="margin-right:12px;"></em></span>
            </li>
          </ul>
          <div class="list-panel" ref="tipList">
              <ul class="list">
                  <li v-for="(data, index) in curProducts" :key="index" class="list-item" :class="{'list-item-active':data.market === symbol}" @click="changeSymbol(data)" @mouseover="tipMouseover($event, data)" @mouseout="tipMouseout($event, data)">
                      <span class="list-col currency">
                          <em class="list-collection icon-star-full"  :class="{collection:data.collection}" @click.stop="keep(data)"></em>
                          {{data.currencySymbol}}/{{data.baseSymbol}}
                      </span>
                      <span class="list-col price" :class="[(getDirection(data.direction)===1 || getDirection(data.direction)===0)?'font-green':'font-red']">{{toFixed(data.lastPrice)}}</span>
                      <span class="list-col fall" v-html="percent(data)"></span><!-- 跌涨 -->
                  </li>
                  <li class="list-loading" v-if="showLoading && products.length===0">
                    <loading :size="24"/>
                  </li>
              </ul>
          </div>
        </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import numUtils from '@/assets/js/numberUtils'
import marketApi from '@/api/market'
import loading from '@/components/loading'
import utils from '@/assets/js/utils'
import config from '@/assets/js/config'
import valuation from '@/components/valuation'
export default {
  props: {
    symbol: null,
    baseSymbol: null,
    toFixed: {
      type: Function
    }
  },
  components: {
    valuation,
    loading
  },
  data () {
    return {
      origin: config.origin,
      isList1: true,
      isShowMarketTip: false,
      sortActive: 'market',
      sort: 'asc',
      hoverItem: null,
      active: this.baseSymbol,
      showLoading: true,
      filterValue: '',
      products: []
    }
  },
  computed: {
    ...mapGetters(['getApiToken']),
    markets () {
      // 收藏
      return ['collection', 'BTC', 'ETH', 'ATN', 'USDT', 'MECoin']
    },
    tipPrice () {
      return this.hoverItem || {}
    },
    curProducts () {
      let val = this.filterValue.toUpperCase()
      let datas = this.products.sort((item1, item2) => {
        if (this.sortActive === 'price') {
          let m1 = numUtils.BN(item1.lastPrice)
          let m2 = numUtils.BN(item2.lastPrice)
          return this.sort === 'asc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
        } else if (this.sortActive === 'fall') {
          let m1 = numUtils.BN(item1.openingPrice).equals(0) ? numUtils.BN(0) : numUtils.BN(item1.change24h).div(item1.openingPrice)
          let m2 = numUtils.BN(item2.openingPrice).equals(0) ? numUtils.BN(0) : numUtils.BN(item2.change24h).div(item2.openingPrice)
          return this.sort === 'asc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
        } else if (this.sortActive === 'volume') {
          let m1 = numUtils.BN(item1.dealAmount)
          let m2 = numUtils.BN(item2.dealAmount)
          return this.sort === 'asc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
        } else if (this.sortActive === 'taker') {
          let m1 = numUtils.BN(item1.direction)
          let m2 = numUtils.BN(item2.direction)
          return this.sort === 'asc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
        } else {
          let m1 = item1.currencySymbol
          let m2 = item2.currencySymbol
          return this.sort === 'asc' ? (m1 < m2 ? -1 : 1) : (m1 > m2 ? -1 : 1)
        }
      })
      return datas.filter((item) => {
        let symbol = (item.market || '').toUpperCase()
        if (this.active !== 'collection') {
          return this.active === item.baseSymbol && (!val || symbol.indexOf(val) !== -1)
        } else {
          return item.collection && (!val || symbol.indexOf(val) !== -1)
        }
      })
    },
    getAccuracy () {
      var accuracy = 8
      for (let i = 0; i < this.products.length; i++) {
        let data = this.products[i]
        if (data.market === this.symbol) {
          accuracy = Number(data.accuracy)
          break
        }
      }
      return accuracy
    },
    marketConfig () {
      let config = {}
      this.products.forEach((item) => {
        config[item.market] = item
      })
      return utils.isPlainEmpty(config) ? null : config
    },
    hasCollection () {
      for (let i = 0; i < this.products.length; i++) {
        let d = this.products[i]
        if (d.collection) {
          return true
        }
      }
      return false
    }
  },
  watch: {
    getApiToken () {
      this.getCollection()
    },
    getAccuracy (val) {
      this.$emit('input', val)
    },
    marketConfig () {
      this.setMarketConfig(this.marketConfig)
    },
    filterValue (newVal, oldVal) {
      if (!newVal) {
        return
      }
      if (/[^0-9a-z]/i.test(newVal)) {
        this.$nextTick(() => {
          this.filterValue = oldVal
        })
      }
    },
    products () {
      this.setBtcValues(this.products)
    }
  },
  created () {
    this.$nextTick(() => {
      this.addEvents({
        name: 'marketEvent',
        fun: this.marketEvent
      })
    })
    this.getCollection()
  },
  beforeDestroy () {
    this.removeEvents('marketEvent')
  },
  methods: {
    ...mapActions(['setMarketConfig', 'addEvents', 'removeEvents', 'setBtcValues']),
    marketEvent (res) {
      if (res && res.type === 'updateData') {
        let datas = this.products
        let tempObj = {}
        datas.forEach((item) => {
          tempObj[item.market] = item
        })
        res.data.forEach((item) => {
          let d = tempObj[item.market]
          if (d) {
            item.collection = d.collection
            item.iconBase64 = d.iconBase64
            item.iconUrl = d.iconUrl
          }
        })
        this.products = res.data
      }
    },
    getDirection (direction) { //  1 买  绿色  2 卖 红色
      return parseInt(direction || 0)
    },
    getCollection () {
      // 获取产品
      marketApi.marketList((res) => {
        this.products = res
        if (this.hasCollection) {
          this.active = 'collection'
        }
        this.showLoading = false
      }, () => {
        this.showLoading = false
      })
    },
    getUpOrDown(item){
      if (item.openingPrice && item.lastPrice) {
        var percent = numUtils.BN(item.change24h).div(item.openingPrice).mul(100)
        return percent < 0 ? 'down' : 'up'
      } else {
        return 'up'
      }
    },
    percent (item) {
      if (numUtils.BN(item.openingPrice).equals(0)) {
        return '0.00%'
      } else if (item.openingPrice && item.lastPrice) {
        var percent = numUtils.BN(item.change24h).div(item.openingPrice).mul(100)
        return `<font color="${percent < 0 ? '#F34246' : '#23CD09'}">` + percent.toFixed(2) + '%</font>'
      } else {
        return '0.00%'
      }
    },
    keep (data) {
      console.log(data)
      if (this.getApiToken) {
        if (data.collection) { // 取消
          marketApi.removeCollection({
            market: data.market
          }, (res) => {
            data.collection = !data.collection
          })
        } else {
          marketApi.addCollection({ // 收藏
            market: data.market
          }, (res) => {
            data.collection = !data.collection
          })
        }
      } else {
        data.collection = !data.collection
      }
    },
    changeSymbol (data) {
      this.$emit('changeSymbol', data.baseSymbol, data.currencySymbol)
    },
    sortMarket (active) {
      if (active === this.sortActive) {
        this.sort = this.sort === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortActive = active
        this.sort = 'asc'
      }
    },
    tipMouseover (ev, data) {
      this.hoverItem = data
      this.isShowMarketTip = true
      this.$refs.marketTip.style.top = `${ev.currentTarget.offsetTop - this.$refs.tipList.scrollTop + 4}px`
    },
    tipMouseout (ev, data) {
      this.isShowMarketTip = false
    }
  }
}
</script>

<style scoped>
.list-header,
.list-item .font-green { /* 绿 跌 deriction1 */
  color: #23CD09;
}
.list-header,
.list-item .font-red { /* 红 卖  deriction 2 */
  color: #F34246;
}
.market{display:flex;flex-flow:column;position:relative;width:calc(100% - 20px);padding:10px;background-color:#fff;}
.market-icon{position: absolute;color:#0054E2;font-size:36px;top:7px;right:0;cursor: pointer;}
.market-tip{position:absolute;padding:0 20px;top:50px;left:calc(100%);height:24px;line-height:24px;background-color:#fff;border-radius:4px;font-weight:bold;z-index:1200;white-space: nowrap;}
.market-tip-icon{position:relative;float:left;}
.market-tip-icon::before{position:absolute;left:-32px!important;top:4px!important;color:#fff;transform:rotate(-90deg);}
.top{display:flex;align-items:center;}
.top-search{display:flex;height:30px;border: 1px solid #7F7F7F; border-radius: 3px; margin-right: 40px;}
.icon-search{width:20px;height:30px; margin-left: 5px; line-height:30px;color:#333;text-align:center;}
.top-input-box{width:100%;height:30px;padding:0;color:#333;text-indent:10px;background-color:transparent;}
.top-input-box:focus{border-bottom-color:#333232 !important;}
.tabs{margin-top:6px;display:flex;justify-content:space-between;height:26px;max-height:22px;padding:0 10px 10px;border-bottom:1px solid #7E7E7E;}
.tabs-item{position:relative;height:22px;font-size:16px;line-height:20px;color:#666;text-align:center; padding-bottom:10px; border-bottom:1px solid #7E7E7E;cursor:pointer;}
.tabs-item:hover,
.tabs-item.active{color:#0557E2;border-bottom-color:#0557E2;}

.list1,
.list{height:calc(100% - 10px);margin-top:10px;margin-right:-17px;overflow-x:hidden;overflow-y: scroll;}
.list1::-webkit-scrollbar,
.list::-webkit-scrollbar{width:17px;}
.list-panel{height:100%;overflow:hidden;}
/* list1 */
.list1-item{height:80px;display:flex;position:relative;margin-bottom:5px;cursor:pointer;}
.list1-item::after{content: "";display:inline-block;height:1px;width:100%;background-color:#EEEEEE;position:absolute;bottom:-3px;left:0;}
.list1-item:hover{background-color:#e6e6e6;}
.list1-item-active,
.list1-item-active:hover{background-color:#e6e6e6;}
.list1-collection{position:absolute;top:50px;right:10px;color:#a1a8bb;cursor:pointer; font-size: 20px;}
.list1-collection.collection{color:#0557E2;}
.list1-percent{position:absolute;top:10px;right:0; width: 55px; height: 30px; border-radius: 3px; text-align: center; line-height: 30px;}
.list1-percent.up {background-color: rgba(35, 205, 9,0.3)}
.list1-percent.down {background-color: rgba(243, 66, 70,0.3)}
.list1-currency{display:flex;color:#333;flex-flow:column;align-items:flex-start;justify-content:center;width:80px;margin-left:10px;}
/*.list1-currency-icon{font-size:18px;width:22px;height:22px;background-color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;}
.list1-currency-icon::before{color:#181b2a;}*/
.list1-currency-icon{width:22px;height:22px;display:flex;align-items:center;justify-content:center;}
.list1-currency-icon img{width:100%;height:100%;border-radius:50%; border: 1px solid #e2e2e2;}
.list1-currency /deep/ font{margin-top:8px;display:block;white-space: nowrap;overflow: hidden;text-overflow:ellipsis;width:calc(100% - 4px);padding-right:4px;font-weight:bold;}
.list1-right{flex:1;display:flex;color:#fff;flex-flow:column;align-items:flex-start;justify-content:center;}
.list1-price{margin:2px 0;color:#1259DF;}
.list1-amount /deep/ i{color:#1259DF;font-size:12px;}
.list1-amount{font-size:12px;color:#666;}
.list1-item /deep/ .font-green{color:#23CD09;}
.list1-item /deep/ .font-red{color:#F34246;}
/* list2 */
.list-header,
.list-item{height:20px;line-height:20px;cursor:pointer;display:flex;justify-content:space-between;}
.list-header{color:#a1a8bb;}
.list-item{height:30px;line-height:30px;color:#333;margin-bottom:2px;font-size:12px;}
.list-item:hover{background-color:#e6e6e6;}
.list-item-active,
.list-item-active:hover{background-color:#e6e6e6;}
.list-item-active /deep/ .price,
.list-item-active /deep/ .fall{font-weight:bold;}
.list-col{font-size:12px;position:relative;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;}
.list-collection{color:#a1a8bb;}
.list-collection.collection{color:#0557E2;}
.icon-arrow-down,
.icon-arrow-up{position:relative;margin-left:4px;}
.icon-arrow-down::before,
.icon-arrow-up::before{position:absolute;vertical-align:middle;top:0;left:0px;}
.currency{width:90px;}
.taker{width:60px;}
.price{width:80px;padding:0 8px;}
.fall{width:80px;text-align:right;}
.volume{width:60px;}
.disabled-icon-star{color:#999;cursor:not-allowed;}
@media screen and (max-width: 1600px) {
  .list1-currency{width:60px;}
}
@media screen and (max-width: 1400px) {
  .market{width:calc(100% - 8px);padding:30px 4px 10px 4px;}
  .price{padding:0 4px;}
  .tabs-item{font-size:14px;}
  .fall{width:60px;}
}
</style>
