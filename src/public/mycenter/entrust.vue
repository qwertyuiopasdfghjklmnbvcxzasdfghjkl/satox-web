<template>
    <div class="management">
        <div class="title">{{$t('account.userEntrustmentManagement')}}<!--我的委托管理--></div>
        <div class="assort">
            <span :class="{'actives':actives==='currentcomm'}" @click="switch_tabs('currentcomm')">
                {{$t('orders.open_orders')}}<!--当前委托-->
            </span>
            <span :class="{'actives':actives==='historycomm'}" @click="switch_tabs('historycomm')">
                {{$t('orders.orders_history')}}<!--历史委托-->
            </span>
            <span :class="{'actives':actives==='historyrecord'}" @click="switch_tabs('historyrecord')">
                {{$t('orders.trade_history')}}<!--历史成交-->
            </span>
        </div>
        <div v-if="actives === 'currentcomm'" class="currentcomm">
            <div class="comm-select">
                <span class="view">{{$t('account.userViewTheHistory')}}<!--历史记录--></span>
            </div>
            <ul >
                <li class="top">
                    <span class="time">{{$t('exchange.exchange_date')}}<!--时间--></span>
                    <span class="market">{{$t('exchange.exchange_pair')}}<!--市场--></span>
                    <span class="fall">{{$t('orders.orders_type')}}<!--买卖--></span>
                    <span class="price">{{$t('orders.orders_price')}}<!--委托价格--></span>
                    <span class="number">{{$t('orders.orders_amount')}}<!--委托数量--></span>
                    <span class="sum">{{$t('orders.orders_total')}}<!--委托金额--></span>
                    <span class="operat">{{$t('orders.orders_operation')}}<!--操作--></span>
                </li>
                <li v-for="(data) in curEntrustDatas" :key="data.id">
                    <span class="time">{{data.time}}</span>
                    <span class="market">{{data.market}}</span>
                    <span class="fall">{{data.fall}}</span>
                    <span class="price">{{data.price}}</span>
                    <span class="number">{{data.number}}</span>
                    <span class="sum">{{data.sum}}</span>
                    <span class="operat">{{data.operat}}</span>
                </li>
            </ul>
        </div>
        <div v-if="actives === 'historycomm'" class="historycomm">
            <div class="comm-select">
                {{$t('exchange.exchange_date')}}<!--时间--><input type="text" class="time"/>一<input type="text" class="time"/>
                {{$t('exchange.exchange_pair')}}<!--市场-->
                <select>
                    <option>EOS</option>
                    <option>BTC</option>
                </select>
                一
                <select>
                    <option>EOS</option>
                    <option>BTC</option>
                </select>
                {{$t('exchange.exchange_type')}}
                <select>
                    <option>EOS</option>
                    <option>BTC</option>
                </select>
                <input type="button" :value="$t('exchange.advanced_search')" /><!--搜索-->
                <input type="reset" :value="$t('account.userReset')" /><!--重置-->
                <em class="icon-radio-unchecked"></em>
                {{$t('account.userConcealmentHasBeenRevoked')}}<!--隐藏已撤销-->
                 <span class="view">{{$t('orders.history_export')}}<!--导出历史委托记录--></span>
            </div>
            <ul >
                <li class="top">
                    <span class="time">{{$t('exchange.exchange_date')}}<!--时间--></span>
                    <span class="market">{{$t('exchange.exchange_pair')}}<!--市场--></span>
                    <span class="fall">{{$t('orders.orders_type')}}<!--买卖--></span>
                    <span class="price">{{$t('orders.orders_price')}}<!--委托价格--></span>
                    <span class="number">{{$t('orders.orders_amount')}}<!--委托数量--></span>
                    <span class="aver-price">{{$t('orders.history_avg_price')}}<!--成交均价--></span>
                    <span class="deal-number">{{$t('orders.history_filled')}}<!--成交数量--></span>
                    <span class="deal-price">{{$t('exchange.exchange_Transaction_amount')}}<!--成交金额--></span>
                    <span class="status">{{$t('orders.history_status')}}<!--状态--></span>
                    <span class="operat">{{$t('orders.orders_operation')}}<!--操作--></span>
                </li>
                <li v-for="(data,index) in historyEntrustDatas" :key="data.id">
                    <span class="time">{{data.time}}</span>
                    <span class="market">{{data.market}}</span>
                    <span class="fall">{{data.fall}}</span>
                    <span class="price">{{data.price}}</span>
                    <span class="number">{{data.number}}</span>
                    <span class="aver-price"><!--成交均价--></span>
                    <span class="deal-number"><!--成交数量--></span>
                    <span class="deal-price"><!--成交金额--></span>
                    <span class="status"><!--状态--></span>
                    <span class="operat"  @click="toggle(data,index)">{{data.operat}}</span>
                    <div class="details" v-show="data.show===true">
                        <p>{{$t('account.user_total_turnover')}}<!--成交总额-->：0.129381 ETH</p>
                        <ul>
                            <li>
                                <span class="time">{{$t('exchange.exchange_date')}}<!--成交时间--></span>
                                <span class="price">{{$t('exchange.exchange_Transaction_price')}}<!--成交价格--></span>
                                <span class="number">{{$t('orders.history_filled')}}<!--成交数量--></span>
                                <span class="fee">{{$t('orders.trade_history_fee')}}<!--手续费--></span>
                                <span class="turnover">{{$t('exchange.exchange_Transaction_amount')}}<!--成交金额--></span>
                            </li>
                            <li>
                                <span class="time">2017-11-28 04:27:22</span>
                                <span class="price">0.006100</span>
                                <span class="number">21.21</span>
                                <span class="fee">0.00012938 ETH</span>
                                <span class="turnover">0.12938100 ETH</span>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
        <div v-if="actives === 'historyrecord'" class="historyrecord">
            <div class="comm-select">
                {{$t('exchange.exchange_date')}}<!--时间--><input type="text" class="time"/>一<input type="text" class="time"/>
                {{$t('exchange.exchange_pair')}}<!--市场-->
                <select>
                    <option>EOS</option>
                    <option>BTC</option>
                </select>
                一
                <select>
                    <option>EOS</option>
                    <option>BTC</option>
                </select>
                {{$t('orders.orders_type')}}
                <select>
                    <option>EOS</option>
                    <option>BTC</option>
                </select>
                <input type="button" :value="$t('exchange.advanced_search')" /><!--搜索-->
                <input type="reset" :value="$t('account.userReset')" /><!--重置-->
                <span class="view">{{$t('orders.history_export')}}</span><!--导出历史委托记录-->
            </div>
            <ul>
                <li class="top">
                    <span class="time">{{$t('exchange.exchange_date')}}<!--时间--></span>
                    <span class="market">{{$t('exchange.exchange_pair')}}<!--市场--></span>
                    <span class="fall">{{$t('orders.orders_type')}}<!--买卖--></span>
                    <span class="price">{{$t('orders.history_avg_price')}}<!--成交均价--></span>
                    <span class="number">{{$t('exchange.exchange_Transaction_volume')}}<!--成交量--></span>
                    <span class="sum">{{$t('exchange.exchange_Transaction_amount')}}<!--成交金额--></span>
                    <span class="operat">{{$t('exchange.advanced_fee')}}<!--手续费--></span>
                </li>
                <li v-for="(data) in historyDealDatas" :key="data.id">
                    <span class="time">{{data.time}}</span>
                    <span class="market">{{data.market}}</span>
                    <span class="fall">{{data.fall}}</span>
                    <span class="price">{{data.price}}</span>
                    <span class="number">{{data.number}}</span>
                    <span class="sum">{{data.sum}}</span>
                    <span class="operat">0.12914656ETH</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import marketApi from '@/api/market'
export default {
  data () {
    return {
      curEntrustDatas: [],
      historyEntrustDatas: [],
      historyDealDatas: [],
      actives: 'currentcomm'
    }
  },
  created () {
    // 当前委托
    marketApi.getCurrentEntrust({}, (res) => {
      this.curEntrustDatas = res
    })

    // 历史委托
    marketApi.getHistoryEntrust({}, (res) => {
      this.historyEntrustDatas = res
    })

    // 历史成交
    marketApi.getHistoryDeal({}, (res) => {
      this.historyDealDatas = res
    })
  },
  methods: {
    switch_tabs (tab) {
      this.actives = tab
    },
    toggle (data, index) {
      data.show = !data.show
    }
  }
}
</script>
<style scoped>
.management{margin-left: 24px;}
.management .title{font-size: 24px;color: #333;font-weight: bold;padding-top: 42px;}
.management .assort{padding: 24px 0px 14px 0px;position: relative;}
.management .assort span{font-size: 16px;color:#333;font-weight: bold;margin-right:24px;cursor: pointer;}
.management .assort span.actives{color: #11a8fe;}
.management .assort span.view{position: absolute;right: 0px;color: #11a8fe;font-size: 14px;font-weight: bold;text-decoration: underline;margin-right: 0px;}
.management ul{background: #eeeeee;height: calc(100vh - 192px);}
.management ul li.top{background: #dddddd;}
.management ul li.top span.operat{color: #333}
.management ul li{line-height:30px;}
.management ul li span{display: inline-block;height:30px;line-height:30px;font-size:12px;}
.management ul li span.time{padding-left: 34px;width: 172px;}
.management ul li span.market{width: 172px;}
.management ul li span.fall{width: 162px;}
.management ul li span.price{width: 162px;}
.management ul li span.number{width: 150px;}
.management ul li span.sum{width: 128px;}
.management ul li span.operat{width: 125px;color: #0066cc;cursor: pointer;}
.management ul li:hover>.details{background: #dddddd;}
.management ul li .details:hover ul{background: #dddddd; }
.historycomm{position: relative;}
.historycomm .comm-select{position: absolute;right: 0px;top: -33px;font-size: 12px;color:#333;}
.historycomm .comm-select span.view{cursor: pointer; color: #11a8fe;font-size: 14px;font-weight: bold;text-decoration: underline;margin-right: 0px;}
.historycomm .comm-select input{margin-left: 5px;margin-right:5px;cursor: pointer;}
.historycomm .comm-select input.time{width: 86px;height: 16px;line-height: 16px;border:1px solid #333;}
.historycomm .comm-select input[type="button"]{width: 42px;height:18px;line-height: 18px;background: #11a8fe;color: #fff; }
.historycomm .comm-select input[type="reset"]{width: 42px;height:18px;line-height: 18px;background: #11a8fe;color: #fff; }
.historycomm .comm-select select{width: 50px;height: 16px;line-height: 16px;border:1px solid #333;font-size: 12px;}
.historycomm ul li.top{background: #dddddd;}
.historycomm ul li span.time{padding-left: 34px;width: 136px;}
.historycomm ul li span.market{width: 85px;}
.historycomm ul li span.fall{width: 112px;}
.historycomm ul li span.price{width: 110px;}
.historycomm ul li span.number{width: 110px;}
.historycomm ul li span.aver-price{width: 110px;}
.historycomm ul li span.deal-number{width: 110px;}
.historycomm ul li span.deal-price{width: 110px;}
.historycomm ul li span.status{width: 100px;}
.historycomm ul li span.operat{width: 78px; color: #333}
.historycomm ul li .details p{font-size: 12px;color: #333;margin-left: 34px;}
.historycomm ul li .details>ul{height: initial;}
.historycomm ul li .details>ul li span {display: inline-block;}
.historycomm ul li .details>ul li span.tiem{width: 145px;}
.historycomm ul li .details>ul li span.price{width: 134px;}
.historycomm ul li .details>ul li span.number{width: 146px;}
.historycomm ul li .details>ul li span.fee{width: 134px;}
.historycomm ul li .details>ul li span.turnover{width: 110px;}
.historyrecord{position: relative;}
.historyrecord .comm-select{position: absolute;right: 0px;top: -33px;font-size: 12px;color:#333;}
.historyrecord .comm-select span.view{cursor: pointer; color: #11a8fe;font-size: 14px;font-weight: bold;text-decoration: underline;margin-right: 0px;}
.historyrecord .comm-select input{margin-left: 5px;margin-right:5px;cursor: pointer;}
.historyrecord .comm-select input.time{width: 86px;height: 16px;line-height: 16px;border:1px solid #333;}
.historyrecord .comm-select input[type="button"]{width: 42px;height:18px;line-height: 18px;background: #11a8fe;color: #fff; }
.historyrecord .comm-select input[type="reset"]{width: 42px;height:18px;line-height: 18px;background: #11a8fe;color: #fff; }
.historyrecord .comm-select  select{width: 50px;height: 16px;line-height: 16px;border:1px solid #333;font-size: 12px;}
.currentcomm{position: relative;}
.currentcomm  .comm-select{position: absolute;right: 0px;top: -33px;font-size: 12px;color:#333;}
.currentcomm  .comm-select span.view{cursor: pointer; color: #11a8fe;font-size: 14px;font-weight: bold;text-decoration: underline;margin-right: 0px;}
</style>

