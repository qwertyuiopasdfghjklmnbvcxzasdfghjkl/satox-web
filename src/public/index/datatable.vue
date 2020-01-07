<template>
  <div class="symbol-list">
    <div class="holdplace"></div>
    <section class="wrap">
      <section class="xmain beijing002-content">
        <div class="layui-tab layui-tab-card">
          <ul class="layui-tab-title">
            <li class="hover" v-for="item in markets" :class="{layuithis:active ===item}" @click="active=item"
                :key="item">{{item}}
            </li>
            <li class="volume" :title="valumeTip" v-html="'Volume:&nbsp;&nbsp;'+valumeTip" v-if="false">
              <!-- <span class="last-span" style="position:relative;padding-right:34px;">
                <i>{{$t('home.home_connected')}}</i>
                <em class="network-signal" :class="['signal-' + getNetworkSignal]"></em>
              </span> -->
              <!--是否连接-->
            </li>
            <li><input v-model="filterValue" :placeholder="$t('public0.public284')"/></li>
          </ul>
          <div class="layui-tab-content">
            <!--2、btc市场、eth市场-->
            <div class="layui-tab-item" v-show="tabContent===2">
              <table class="layui-table" lay-size="sm" lay-even="" lay-skin="line">
                <colgroup>
                  <col width="80">
                  <col width="180">
                  <col width="280">
                  <col width="200">
                  <col width="220">
                  <col width="220">
                  <col>
                </colgroup>
                <thead>
                <tr>
                  <th></th>
                  <th @click="sortMarket('market')">
                    {{$t('home.home_pair')}}
                    <em v-if="sortActive==='market'">
                      <i class="icon-arrow-up" :class="{active:sort==='asc'}"></i>
                      <i class="icon-arrow-down" :class="{active:sort==='desc'}"></i>
                    </em>
                  </th><!--市场-->
                  <th @click="sortMarket('lastPrice')">
                    {{$t('home.home_last_price')}}
                    <em v-if="sortActive==='lastPrice'">
                      <i class="icon-arrow-up" :class="{active:sort==='asc'}"></i>
                      <i class="icon-arrow-down" :class="{active:sort==='desc'}"></i>
                    </em>
                  </th><!--最新价-->
                  <th @click="sortMarket('change24h')">
                    {{$t('home.home_change_24h')}}
                    <em v-if="sortActive==='change24h'">
                      <i class="icon-arrow-up" :class="{active:sort==='asc'}"></i>
                      <i class="icon-arrow-down" :class="{active:sort==='desc'}"></i>
                    </em>
                  </th><!--24小时涨跌-->
                  <th @click="sortMarket('highPrice24h')">
                    {{$t('home.home_high_24h')}}
                    <em v-if="sortActive==='highPrice24h'">
                      <i class="icon-arrow-up" :class="{active:sort==='asc'}"></i>
                      <i class="icon-arrow-down" :class="{active:sort==='desc'}"></i>
                    </em>
                  </th><!--24h最高-->
                  <th @click="sortMarket('lowPrice24h')">
                    {{$t('home.home_low_24h')}}
                    <em v-if="sortActive==='lowPrice24h'">
                      <i class="icon-arrow-up" :class="{active:sort==='asc'}"></i>
                      <i class="icon-arrow-down" :class="{active:sort==='desc'}"></i>
                    </em>
                  </th><!--24h最低-->
                  <th @click="sortMarket('dealAmount')">
                    {{$t('home.home_volume_24h')}}
                    <em v-if="sortActive==='dealAmount'">
                      <i class="icon-arrow-up" :class="{active:sort==='asc'}"></i>
                      <i class="icon-arrow-down" :class="{active:sort==='desc'}"></i>
                    </em>
                  </th><!--24h成交量-->
                </tr>
                </thead>
                <tbody>
                <!--<tr v-for=" btc in getMarketFilter()" >-->
                <tr v-for="(btc, index) in curProducts" :key="index">
                  <td><i :class="[!btc.collection?'icon_hollow':'icon_solid']" @click.stop="keep(btc)"></i></td>
                  <router-link :to="{name: 'exchange_index',params:{symbol:btc.currencySymbol+'_'+btc.baseSymbol}}"
                               tag='td'>
                    <span class="font-white">{{btc.currencySymbol}}</span><span
                    class="font-default">/{{btc.baseSymbol}}</span>
                  </router-link><!--市场-->
                  <router-link :to="{name: 'exchange_index',params:{symbol:btc.currencySymbol+'_'+btc.baseSymbol}}"
                               tag='td'>
                    <span
                          :class="[(getDirection(btc.direction)===1 || getDirection(btc.direction)===0)?'font-green':'font-red']">{{toFixed(btc.lastPrice, 4)}} </span>
                    <span class="font-default">/ <valuation :lastPrice="btc.lastPrice" :baseSymbol="btc.baseSymbol" :regs="2"/></span>
                  </router-link><!--最新价-->
                  <router-link :to="{name: 'exchange_index',params:{symbol:btc.currencySymbol+'_'+btc.baseSymbol}}"
                               tag='td'>
                    <span class="font-green" v-html="percent(btc)"></span>
                  </router-link><!--24h涨跌-->
                  <router-link :to="{name: 'exchange_index',params:{symbol:btc.currencySymbol+'_'+btc.baseSymbol}}"
                               tag='td'>
                    <span class="font-default">{{toFixed(btc.highPrice24h,4)}}</span>
                  </router-link><!--24h最高价-->
                  <router-link :to="{name: 'exchange_index',params:{symbol:btc.currencySymbol+'_'+btc.baseSymbol}}"
                               tag='td'>
                    <span class="font-default">{{toFixed(btc.lowPrice24h,4)}}</span>
                  </router-link><!--24h最低价-->
                  <router-link :to="{name: 'exchange_index',params:{symbol:btc.currencySymbol+'_'+btc.baseSymbol}}"
                               tag='td'>
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
    <div class="holdplace"></div>
  </div>
</template>
<script>
  import {mapGetters, mapActions} from 'vuex'
  import marketApi from '@/api/market'
  import numUtils from '@/assets/js/numberUtils'
  import valuation from '@/components/valuation'

  export default {
    components: {
      valuation
    },
    data() {
      return {
        sort: 'asc', // 默认升序
        sortActive: 'market',
        symbolVolumes: [], // 币种成交量
        fixedNumber: 8,
        filterValue: '', // 市场筛选
        isActive: 2, /* 样式是否选中 */
        tabContent: 2, /* tab切换 */
        optionalList: [], /* 自选临时数据 */
        tableheadpars: {
          newprise1: 'idefault',
          newprise2: 'idefault',
          twhourstop: 'idefault',
          twhourslow: 'idefault',
          volume: 'idefault'
        },
        checked: false,
        active: 'USDT',
        marketArry: [], // 市场信息
        filterMarketAtty: [], // 前台过滤'BTCETH、ETHBTC、BTCMARKET'市场信息
        products: []
      }
    },
    created() {
      this.getMarketList() // 初始化数据
    },
    methods: {
      ...mapActions(['setBtcValues']),
      keep(data) {
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
      getDirection(direction) { //  1 买  绿色  2 卖 红色
        return parseInt(direction || 0)
      },
      toNumberss(nu) {
        let n = numUtils.BN(nu)
        console.log(n)
      },
      toFixed(value, fixed) {
        return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.fixedNumber : fixed)
      },
      percent(item) { // 涨跌
        if (numUtils.BN(item.openingPrice).equals(0)) {
          return '0.00%'
        } else if (item.openingPrice && item.lastPrice) {
          var percent = numUtils.mul(numUtils.BN(item.change24h).div(item.openingPrice), 100)
          return `<font color="${percent < 0 ? '#E44242' : '#48d417'}">` + percent.toFixed(2) + '%</font>'
        } else {
          return '0.00%'
        }
      },
      getMarketList() { // 获取所有市场数据
        marketApi.marketList((res) => {
          this.products = res
        })
      },
      getMarketFilter() { // 前台通过参数筛选市场
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
      switchTab(index, tabindex) {
        this.isActive = index
        this.tabContent = tabindex
      },
      remove(index) {
        this.optionalList.splice(index, 1)
      },
      sortMarket(active) {
        if (active === this.sortActive) {
          this.sort = this.sort === 'asc' ? 'desc' : 'asc'
        } else {
          this.sortActive = active
          this.sort = 'asc'
        }
      },
      changeUpDown(values) {
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
      }
    },
    computed: {
      ...mapGetters(['getApiToken', 'getNetworkSignal']),
      curProducts() {
        let val = this.filterValue.toUpperCase()
        let datas = this.products.sort((item1, item2) => {
          if (this.sortActive === 'lastPrice') {
            let m1 = numUtils.BN(item1.lastPrice)
            let m2 = numUtils.BN(item2.lastPrice)
            return this.sort === 'asc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
          } else if (this.sortActive === 'change24h') {
            let m1 = numUtils.BN(item1.openingPrice).equals(0) ? numUtils.BN(0) : numUtils.BN(item1.change24h).div(item1.openingPrice)
            let m2 = numUtils.BN(item2.openingPrice).equals(0) ? numUtils.BN(0) : numUtils.BN(item2.change24h).div(item2.openingPrice)
            return this.sort === 'asc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
          } else if (this.sortActive === 'dealAmount') {
            let m1 = numUtils.BN(item1.dealAmount)
            let m2 = numUtils.BN(item2.dealAmount)
            return this.sort === 'asc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
          } else if (this.sortActive === 'highPrice24h') {
            let m1 = numUtils.BN(item1.highPrice24h)
            let m2 = numUtils.BN(item2.highPrice24h)
            return this.sort === 'asc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
          } else if (this.sortActive === 'lowPrice24h') {
            let m1 = numUtils.BN(item1.lowPrice24h)
            let m2 = numUtils.BN(item2.lowPrice24h)
            return this.sort === 'asc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
          } else {
            let m1 = item1.market
            let m2 = item2.market
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
      markets() {
        // 收藏
        return ['USDT']
        // return ['BTC', 'ETH', 'SATOX', 'USDT', this.$t('public0.public283')]
      },
      /* 选中数据的集合 */
      mytotalList: function () {
        let checkedArry = []
        this.optionalList = checkedArry
      },
      valumeTip() {
        let valumes = []
        this.symbolVolumes.forEach((item) => {
          valumes.push(` ${Math.ceil(item.volumes)} ${item.symbol}&nbsp;&nbsp;`)
        })
        return valumes.join('')
      }
    },
    watch: {
      getApiToken() {
        this.getMarketList()
      },
      filterValue() {
        this.filterValue = this.filterValue.replace(/[\W]/g, '')
      },
      active: function () {
      },
      mytotalList: function () {
      },
      products() {
        this.setBtcValues(this.products)
      }
    }
  }
</script>
<style scoped>
  .symbol-list {
    min-height: 400px;
    padding-bottom: 20px;
    height: fit-content;
    min-width: 1190px;
    background-color: #262525;
  }

  .wrap {
    min-width: 1190px;
    max-width: 1360px;
    margin: 0 auto;
  }

  .holdplace {
    height: 20px;
  }

  .icondown {
    display: inline-block;
    width: 20px;
    height: 17px;
    background: url("../../assets/images/i-up.png") no-repeat -4px -3px
  }

  .iconup {
    display: inline-block;
    width: 20px;
    height: 17px;
    background: url("../../assets/images/i-down.png") no-repeat -4px -3px
  }

  .idefault {
    display: inline-block;
    width: 20px;
    height: 17px;
    background: url("../../assets/images/moren.png") no-repeat -4px -3px
  }

  .font-default {
    color: #ffffff !important;
  }

  .last-span {
    margin-left: 28px;
  }

  .layui-table .icon_solid {
    cursor: pointer;
    display: inline-block;
    height: 16px;
    width: 16px;
    background-image: url("../../assets/images/icon-start-s.png")
  }

  .layui-table .icon_hollow {
    cursor: pointer;
    display: inline-block;
    height: 16px;
    width: 16px;
    background-image: url("../../assets/images/icon-start-k.png")
  }

  .layui-table .font-white {
    color: #ffffff;
  }

  .layui-table .font-red {
    color: #E44242;
  }

  .layui-table .font-green {
    color: #48d417;
  }

  .bk-wrap {
    width: 100%;
    position: relative;
    overflow: hidden;
  }

  .bk-main {
    width: 1172px;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
  }

  .slider-nav {
    position: absolute;
    bottom: 22px;
    left: 45%;
  }

  .slider-nav ul {
    width: 170px;
    margin: 0 auto;
  }

  .slider-nav ul::after {
    content: '';
    display: block;
    clear: both;
  }

  .slider-nav ul li {
    width: 35px;
    display: inline-block;
  }

  .slider-nav ul li span {
    width: 30px;
    height: 4px;
    background: #47577f;
    display: inline-block;
    border-radius: 2px;
  }

  .slider-nav ul li span.slider-this {
    background: #48bcff;
  }

  .layui-tab {
    margin: 0 0;
    text-align: left !important;
  }

  .layui-tab-title {
    position: relative;
    left: 0;
    height: 40px;
    white-space: nowrap;
    font-size: 0;
    transition: all .2s;
    -webkit-transition: all .2s;
    background: #000;
    padding: 6px 20px;
  }

  .layui-tab-title li {
    display: inline-block;
    vertical-align: middle;
    font-size: 16px;
    transition: all .2s;
    -webkit-transition: all .2s;
    position: relative;
    line-height: 40px;
    min-width: 140px;
    text-align: left;
    cursor: pointer;
    color: #5a5a5a;
    box-sizing: border-box;
  }

  .layui-tab-title li.hover {
  }

  .layui-tab-title li.hover:hover {
    color: #467daa;
  }

  .layui-tab-title li:last-child {
    float: right;
    padding-right: 0;
  }

  .layui-tab-title li.volume {
    margin-left: 45px;
  }

  .layui-tab-title li.layuithis {
    color: #BA8D35 !important;
  }

  .layui-tab-title li:last-child > input {
    width: 300px;
    color: #5a5a5a;
    border: 1px solid #1E1E1E;
    line-height: 40px;
    height: 38px;
    padding-left: 8px;
    background: url("../../assets/images/chazao.png") no-repeat 270px center;
    box-sizing: border-box;
    border-radius: 4px;
    transition: 0.3s;
  }
  .layui-tab-title li:last-child > input:hover{
    border-color: #2a74d3;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  .layui-table {
    width: 100%;
    color: #BA8D35;
  }

  .layui-table tr {
    transition: all .3s;
    -webkit-transition: all .3s;
    cursor: pointer
  }

  .layui-table th {
    text-align: left;
    font-weight: 400;
  }

  .layui-table th em {
    position: relative;
  }

  .layui-table th em i {
    position: absolute;
    top: 0px;
    color: #716521;
  }

  .layui-table th em i.icon-arrow-down {
    top: 10px;
  }

  .layui-table th em i.active {
    color: #FFDE00;
  }

  .layui-table tbody tr:hover {
    background-color: #37342F;
  }


  .layui-table[lay-skin=nob] td,
  .layui-table[lay-skin=nob] th {
    border: none;
  }

  .layui-table td,
  .layui-table th {
    margin: 0;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    position: relative;
    padding: 0 15px;
    height: 45px;
    line-height: 45px;
    font-size: 14px;
    border-width: 1px;
    border-style: solid;
    border-color: #37342F;
  }

  .layui-table[lay-skin=line] {
    border-width: 0;
    border-style: solid;
    background: #202020;
  }

  .layui-table[lay-skin=line] td,
  .layui-table[lay-skin=line] th {
    border-width: 0 0 1px;
  }

  /*网络信号*/
  .network-signal {
    border-right: 4px solid #03c087;
    height: 20px;
    display: flex;
    flex: initial;
    position: absolute;
    right: 10px;
    top: calc(50% - 14px);
    align-items: flex-end;
  }

  .network-signal::before,
  .network-signal::after {
    content: "";
    display: flex;
    width: 4px;
    height: 8px;
    background: #03c087;
    margin-right: 2px;
  }

  .network-signal::after {
    height: 14px;
    margin-right: 2px;
  }

  /*信号中*/
  .signal-1 {
    border-right-color: #717788;
  }

  .signal-1::after,
  .signal-1::before {
    background: #ffc81f;
  }

  /*信号弱*/
  .signal-2 {
    border-right-color: #717788;
  }

  .signal-2::after {
    background: #717788;
  }

  .signal-2::before {
    background: #de6941;
  }

  /*无信号*/
  .signal-3 {
    border-right-color: #717788;
  }

  .signal-3::after,
  .signal-3::before {
    background: #717788;
  }
</style>
