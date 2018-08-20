<template>
  <div >
    <section class="wrap">
      <section class="xmain beijing002-content">
        <div class="layui-tab layui-tab-card">
          <ul class="layui-tab-title">
            <li class="hover" v-for="item in markets" :class="{layuithis:active ===item}" @click="active=item" :key="item" >{{item}}</li>
            <li><input v-model="filterValue" /></li>
            <li class="last-li">Volume:
              <template v-for="item in symbolVolumes"><span class="countli">&nbsp;{{Math.ceil(item.volumes)}}&nbsp;</span>{{item.symbol}}</template>
              <span class="last-span" style="position:relative;padding-right:34px;">
                <i>{{$t('home.home_connected')}}</i>
                <em class="network-signal" :class="['signal-' + getNetworkSignal]"></em>
              </span><!--是否连接-->
            </li>
          </ul>
          <div class="layui-tab-content">
            <!--2、btc市场、eth市场-->
            <div class="layui-tab-item" v-show="tabContent===2">
              <table class="layui-table" lay-size="sm" lay-even="" lay-skin="line">
                <colgroup>
                  <col width="80">
                  <col width="150">
                  <col width="230">
                  <col width="200">
                  <col width="200">
                  <col width="150">
                  <col>
                </colgroup>
                <thead>
                <tr>
                  <th></th>
                  <th @click="sortMarket('market')">{{$t('home.home_pair')}}
                    <em v-if="sortActive==='market'" :class="[sort==='desc' ? 'icon-arrow-down': 'icon-arrow-up']"></em>
                  </th><!--市场-->
                  <th @click="sortMarket('lastPrice')">{{$t('home.home_last_price')}}
                    <em v-if="sortActive==='lastPrice'" :class="[sort==='desc' ? 'icon-arrow-down': 'icon-arrow-up']"></em>
                  </th><!--最新价-->
                  <th @click="sortMarket('change24h')">{{$t('home.home_change_24h')}}
                    <em v-if="sortActive==='change24h'" :class="[sort==='desc' ? 'icon-arrow-down': 'icon-arrow-up']"></em>
                  </th><!--24小时涨跌-->
                  <th @click="sortMarket('highPrice24h')">{{$t('home.home_high_24h')}}
                    <em v-if="sortActive==='highPrice24h'" :class="[sort==='desc' ? 'icon-arrow-down': 'icon-arrow-up']"></em>
                  </th><!--24h最高-->
                  <th @click="sortMarket('lowPrice24h')">{{$t('home.home_low_24h')}}
                    <em v-if="sortActive==='lowPrice24h'" :class="[sort==='desc' ? 'icon-arrow-down': 'icon-arrow-up']"></em>
                  </th><!--24h最低-->
                  <th @click="sortMarket('dealAmount')">{{$t('home.home_volume_24h')}}
                    <em v-if="sortActive==='dealAmount'" :class="[sort==='desc' ? 'icon-arrow-down': 'icon-arrow-up']"></em>
                  </th><!--24h成交量-->
                </tr>
                </thead>
                <tbody>
                <!--<tr v-for=" btc in getMarketFilter()" >-->
                <tr v-for=" btc in curProducts" >
                  <td><i :class="[!btc.collection?'icon_hollow':'icon_solid']" @click.stop="keep(btc)" ></i></td>
                  <router-link :to="{name: 'exchange_index',params:{symbol:btc.currencySymbol+'_'+btc.baseSymbol}}" tag='td'>
                    <span class="font-white">{{btc.currencySymbol}}</span><span class="font-default">/{{btc.baseSymbol}}</span>
                  </router-link><!--市场-->
                  <router-link :to="{name: 'exchange_index',params:{symbol:btc.currencySymbol+'_'+btc.baseSymbol}}" tag='td'>
                    <span class="" :class="[(getDirection(btc.direction)===1 || getDirection(btc.direction)===0)?'font-green':'font-red']" >{{toFixed(btc.lastPrice)}} </span><span class="font-default">/{{getCoinSign}} {{getCurPrice(btc)}}</span>
                  </router-link><!--最新价-->
                  <router-link :to="{name: 'exchange_index',params:{symbol:btc.currencySymbol+'_'+btc.baseSymbol}}" tag='td'>
                    <span class="font-green" v-html="percent(btc)" ></span>
                  </router-link><!--24h涨跌-->
                  <router-link :to="{name: 'exchange_index',params:{symbol:btc.currencySymbol+'_'+btc.baseSymbol}}" tag='td'>
                    <span class="font-default" >{{toFixed(btc.highPrice24h)}}</span>
                  </router-link><!--24h最高价-->
                  <router-link :to="{name: 'exchange_index',params:{symbol:btc.currencySymbol+'_'+btc.baseSymbol}}" tag='td'>
                    <span class="font-default">{{toFixed(btc.lowPrice24h)}}</span>
                  </router-link><!--24h最低价-->
                  <router-link :to="{name: 'exchange_index',params:{symbol:btc.currencySymbol+'_'+btc.baseSymbol}}" tag='td'>
                    <span class="font-default">{{toFixed(btc.dealAmount,2)}}</span>
                  </router-link><!--24h成交量-->
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </section>

  </div>
</template>
<script>
  import {mapGetters, mapActions} from 'vuex'
  import marketApi from '@/api/market'
  import numUtils from '@/assets/js/numberUtils'
  export default {
    data () {
      return {
        sort: 'asc', // 默认升序
        sortActive: 'market',
        symbolVolumes: [], // 币种成交量
        fixedNumber: 8,
        filterValue: '', // 市场筛选
        isActive: 2, /* 样式是否选中 */
        tabContent: 2, /* tab切换 */
        optionalList: [], /* 自选临时数据 */
        tableheadpars: { newprise1: 'idefault', newprise2: 'idefault', twhourstop: 'idefault', twhourslow: 'idefault', volume: 'idefault' },
        checked: false,
        active: 'BTC',
        marketArry: [], // 市场信息
        filterMarketAtty: [], // 前台过滤'BTCETH、ETHBTC、BTCMARKET'市场信息
        products: []
      }
    },
    created () {
      this.getMarketList() // 初始化数据
    },
    methods: {
      ...mapActions(['setBtcValues']),
      keep (data) {
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
      getDirection (direction) { //  1 买  绿色  2 卖 红色
        return parseInt(direction || 0)
      },
      toNumberss (nu) {
        let n = numUtils.BN(nu)
        console.log(n)
      },
      toFixed (value, fixed) {
        return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.fixedNumber : fixed)
      },
      percent (item) { // 涨跌
        if (numUtils.BN(item.openingPrice).equals(0)) {
          return '0.00%'
        } else if (item.openingPrice && item.lastPrice) {
          var percent = numUtils.mul(numUtils.BN(item.change24h).div(item.openingPrice), 100)
          return `<font color="${percent < 0 ? '#e65353' : '#48d417'}">` + percent.toFixed(2) + '%</font>'
        } else {
          return '0.00%'
        }
      },
      getMarketList () { // 获取所有市场数据
        marketApi.marketList((res) => {
          this.products = res
        })
      },
      getMarketFilter () { // 前台通过参数筛选市场
        let val = this.filterValue.toUpperCase()
        return this.marketArry.filter((item) => {
          let symbol = (item.market || '').toUpperCase()
          if (this.active !== this.$t('exchange.exchange_collection')) {
            return this.active === item.baseSymbol && (!val || symbol.indexOf(val) !== -1)
          } else {
            return item.collection && (!val || symbol.indexOf(val) !== -1)
          }
        })
      },
      switchTab (index, tabindex) {
        this.isActive = index
        this.tabContent = tabindex
      },
      remove (index) {
        this.optionalList.splice(index, 1)
      },
      sortMarket (active) {
        if (active === this.sortActive) {
          this.sort = this.sort === 'asc' ? 'desc' : 'asc'
        } else {
          this.sortActive = active
          this.sort = 'asc'
        }
      },
      changeUpDown (values) {
        let tableheadpars = this.tableheadpars
        for (let ite in tableheadpars) {
          if (ite === values) {
            if (tableheadpars[ite] === 'idefault') {
              // 升序
              tableheadpars[ite] = 'iconup'
            } else if (tableheadpars[ite] === 'iconup') {
              // 降序
              tableheadpars[ite] = 'icondown'
            } else if (tableheadpars[ite] === 'icondown') {
              // 降序
              tableheadpars[ite] = 'iconup'
            }
          } else {
            tableheadpars[ite] = 'idefault'
          }
        }
      },
      getCurPrice (data) {
        if (data.lastPrice && this.getUSDCNY) {
          let curMarketBtc = this.getBtcValues[data.baseSymbol]
          let curMarketPrice = curMarketBtc ? numUtils.mul(curMarketBtc, this.getUSDCNY).toFixed(2) : this.getUSDCNY
          return numUtils.mul(data.lastPrice, curMarketPrice).toFixed(2).toMoney()
        } else {
          return '0.00'
        }
      }
    },
    computed: {
      ...mapGetters(['getApiToken', 'getUSDCNY', 'getCoinSign', 'getNetworkSignal', 'getBtcValues']),
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
          if (this.active !== this.$t('exchange.exchange_collection')) {
            return this.active === item.baseSymbol && (!val || symbol.indexOf(val) !== -1)
          } else {
            return item.collection && (!val || symbol.indexOf(val) !== -1)
          }
        })
      },
      markets () {
        // 收藏
        return [this.$t('exchange.exchange_collection'), 'BTC', 'ETH']
      },
      /* 选中数据的集合 */
      mytotalList: function () {
        let checkedArry = []
        this.optionalList = checkedArry
      }
    },
    watch: {
      getApiToken () {
        this.getMarketList()
      },
      filterValue () {
        this.filterValue = this.filterValue.replace(/[\W]/g, '')
      },
      active: function () {
      },
      mytotalList: function () {
      },
      products () {
        this.setBtcValues(this.products)
      }
    }
  }
</script>
<style scoped>
.icondown{display:inline-block;width: 20px;height: 17px;background: url("../../assets/images/i-up.png") no-repeat -4px -3px}
.iconup{display:inline-block;width: 20px;height: 17px;background: url("../../assets/images/i-down.png") no-repeat -4px -3px}
.idefault{display:inline-block;width: 20px;height: 17px;background: url("../../assets/images/moren.png") no-repeat -4px -3px}
.font-default{color: #586687!important;}
.last-span{margin-left: 28px;}
.layui-table .icon_solid{cursor: pointer;display: inline-block;height: 16px;width: 16px;background-image: url("../../assets/images/icon-start-s.png")}
.layui-table .icon_hollow{cursor: pointer;display: inline-block;height: 16px;width: 16px;background-image: url("../../assets/images/icon-start-k.png")}
.layui-table .font-white{color: #becbe8;}
.layui-table .font-red{color: #e65353;}
.layui-table .font-green{color: #48d417;}
.bk-wrap{width: 100%; position: relative; overflow: hidden;}
.bk-main{width: 1172px; margin: 0 auto; position: relative; overflow: hidden;}
.beijing001{background-color: #0c1426;}
.beijing001-center{display: flex; height: 360px; flex-flow: row wrap; justify-content: space-between; align-items: center;}

.slider-nav{position: absolute; bottom: 22px; left: 45%;}
.slider-nav ul{width: 170px; margin: 0 auto;}
.slider-nav ul li{width: 35px; display: inline-block;}
.slider-nav ul li span{width: 30px; height: 4px; background: #47577f; display: inline-block; border-radius: 2px;}
.slider-nav ul li span.slider-this{background: #48bcff;}
.layui-tab{margin: 0 0; text-align: left!important;}
.layui-tab-title{border-color: #e6e6e6; position: relative; left: 0; height: 40px; white-space: nowrap; font-size: 0; transition: all .2s; -webkit-transition: all .2s;}
.layui-tab-title li{display: inline-block; vertical-align: middle; font-size: 14px; transition: all .2s; -webkit-transition: all .2s; position: relative; line-height: 40px; min-width: 65px; padding: 0 15px; text-align: center; cursor: pointer; color: #586687;}
.layui-tab-title li:nth-child(-n+3){border: 1px solid #404b69; border-bottom: 0; transition: all .2s; -webkit-transition: all .2s;border-right: 0;}
.layui-tab-title li:nth-child(-n+2){border-right: 0; transition: all .2s; -webkit-transition: all .2s;}
.layui-tab-title li.hover:hover{color: #becbe8;}
.layui-tab-title li:nth-child(4){text-align: left;border: 0;border-left: 1px solid #404b69;}
.layui-tab-title li.layuithis{border-bottom-color: #182138; background-color: #182138;}
.layui-tab-title li:nth-child(4)>input{width: 150px;color: #becbe8;background-color: #ffffff00; border: 1px solid #404b69; line-height: 35px; height: 25px; padding-left: 19px; background: url("../../assets/images/chazao.png") no-repeat 139px center;}
.layui-tab-title li:nth-child(n+5){padding: 0;}
.layui-tab-title li:nth-child(n+5)>span{color: #becbe8;}
.layui-tab-title li.last-li{float: right;}

table{border-collapse: collapse; border-spacing: 0;}
.layui-table{width: 100%; background-color: #182138; color: #586687;}
.layui-table tr{transition: all .3s; -webkit-transition: all .3s;cursor: pointer}
.layui-table th{text-align: left; font-weight: 400;}
.layui-table tbody tr:hover{background-color: #0c142c;}
.layui-table[lay-skin=nob] td,
.layui-table[lay-skin=nob] th{border: none;}
.layui-table td,
.layui-table th{margin: 0; -webkit-tap-highlight-color: rgba(0,0,0,0); position: relative; padding: 9px 15px; min-height: 20px; line-height: 20px; font-size: 14px; border-width: 1px; border-style: solid; border-color: #404b69;}
.layui-table[lay-skin=line]{border-width: 1px; border-style: solid; border-color: #404b69;}
.layui-table[lay-skin=line] td,
.layui-table[lay-skin=line] th{border-width: 0 0 1px;}
.layui-table[lay-size=sm] td,
.layui-table[lay-size=sm] th{font-size: 12px; padding: 5px 10px;}
.wrap{width: 100%; background: #182138; height: 530px;}
.xmain{margin: 0 auto; width: 1200px;}

/*网络信号*/
.network-signal{border-right:4px solid #03c087;height:20px;display:flex;flex:initial;position:absolute;right:10px;top:calc(50% - 14px);align-items:flex-end;}
.network-signal::before,
.network-signal::after{content:"";display:flex;width:4px;height:8px;background:#03c087;margin-right:2px;}
.network-signal::after{height:14px;margin-right:2px;}
/*信号中*/
.signal-1{border-right-color:#717788;}
.signal-1::after,
.signal-1::before{background:#ffc81f;}
/*信号弱*/
.signal-2{border-right-color:#717788;}
.signal-2::after{background:#717788;}
.signal-2::before{background:#de6941;}
/*无信号*/
.signal-3{border-right-color:#717788;}
.signal-3::after,
.signal-3::before{background:#717788;}
</style>
