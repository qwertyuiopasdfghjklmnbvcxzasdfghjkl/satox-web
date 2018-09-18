<template>
    <div class="coininfo" :class="{show:isShow}">
        <div class="coininfo-top">
            <div class="coininfo-top-left">
                <img class="coin-icon" :src="iconUrl"/>
                <span class="coin-title">
                    <span>{{currentSymbol}}<font>({{currentSymbol}})</font></span>
                    <span>
                        {{getCoinSign}} {{curPrice}}
                        <i :class="[!isRed ? 'green':'red']">
                            {{getLast24h.percent}}%
                        </i>
                    </span>
                </span>
            </div>
            <ul class="coininfo-top-right">
                <li>
                    <span>{{$t('public.market_cap')}}<!--市值--></span>
                    <span>{{getCoinSign}} {{marketCapitalisation}}</span>
                </li>
                <li>
                    <span>{{$t('public.max_supply')}}<!--发行总量--></span>
                    <span>{{totalIssuance}} {{currentSymbol}}</span>
                </li>
                <li>
                    <span>{{$t('public.circulating_supply')}}<!--流通总量--></span>
                    <span>{{totalCirculation}} {{currentSymbol}}</span>
                </li>
                <li>
                    <span>{{$t('public.issue_price')}}<!--发行价格--></span>
                    <span>{{getCoinSign}} {{issuePrice}}</span>
                </li>
            </ul>
        </div>
        <p class="coininfo-title">{{$t('public.introduction')}}<!--币种介绍--></p>
        <div class="coininfo-content">
          <p>{{symbolDescription}}</p>
        </div>
        <p class="coininfo-bottom"><em class="icon-arrow-up3" @click="hideCoinInfo"></em></p>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import numUtils from '@/assets/js/numberUtils'
import marketApi from '@/api/market'
export default {
  props: ['baseSymbol', 'currentSymbol', 'isShow', 'iconUrl'],
  data () {
    return {
      symbolInfo: {}
    }
  },
  computed: {
    ...mapGetters(['getCoinSign', 'getLast24h', 'getUSDCNY', 'getUsdRate', 'getLang', 'getBtcValues']),
    isRed () {
      return numUtils.BN(this.getLast24h.percent).lt(0)
    },
    symbolDescription () {
      return this.$t(`symbol_desc.${this.currentSymbol}`)
    },
    curPrice () { // 当前价格
      if (this.getUSDCNY && this.getLast24h.close) {
        if (this.baseSymbol === 'USDT') {
          if (this.getLang === 'en') {
            return numUtils.BN(this.getLast24h.close).toFixed(2).toMoney()
          }
          return numUtils.div(this.getLast24h.close, this.getUsdRate).toFixed(2).toMoney()
        } else if (this.baseSymbol === 'ATN') {
          if (this.getLang === 'en') {
            return numUtils.mul(this.getLast24h.close, '0.1').toFixed(2).toMoney()
          }
          return numUtils.div(numUtils.mul(this.getLast24h.close, '0.1'), this.getUsdRate).toFixed(2).toMoney()
        }
        let curMarketBtc = this.getBtcValues[this.baseSymbol]
        let curMarketPrice = curMarketBtc ? numUtils.mul(curMarketBtc, this.getUSDCNY).toFixed(2) : this.getUSDCNY
        return numUtils.mul(this.getLast24h.close, curMarketPrice).toFixed(2).toMoney()
      } else {
        return '0.00'
      }
    },
    marketCapitalisation () { // 市值 = 当前价格 * 流通总量
      if (this.symbolInfo && this.symbolInfo.totalCirculation) {
        let currentPrice = numUtils.mul(this.getLast24h.close, this.getUSDCNY).toFixed(2)
        let tempMarketValue = numUtils.mul(currentPrice, this.symbolInfo.totalCirculation)
        if (this.getLang === 'en') {
          return numUtils.mul(tempMarketValue, this.getUsdRate).toFixed(2).toMoney()
        } else {
          return tempMarketValue.toFixed(2).toMoney()
        }
      } else {
        return '--'
      }
    },
    totalIssuance () { // 发行总量
      if (this.symbolInfo && this.symbolInfo.totalIssuance) {
        return this.symbolInfo.totalIssuance.toString().toMoney()
      } else {
        return '--'
      }
    },
    totalCirculation () { // 流通总量
      if (this.symbolInfo && this.symbolInfo.totalCirculation) {
        return this.symbolInfo.totalCirculation.toString().toMoney()
      } else {
        return '--'
      }
    },
    issuePrice () { // 发行价格
      if (this.symbolInfo && this.symbolInfo.issuePrice) {
        if (this.getLang === 'en') {
          return numUtils.mul(this.symbolInfo.issuePrice.toString(), this.getUsdRate).toFixed(2).toMoney()
        } else {
          return parseFloat(this.symbolInfo.issuePrice).toFixed(2).toString().toMoney()
        }
      } else {
        return '--'
      }
    }
  },
  watch: {
    currentSymbol () {
      this.getSymbolIntroduce()
    }
  },
  created () {
    this.getSymbolIntroduce()
  },
  methods: {
    ...mapActions(['tiggerEvents']),
    getSymbolIntroduce () {
      marketApi.getSymbolIntroduce(this.currentSymbol, (res) => {
        this.symbolInfo = res || {}
      })
    },
    hideCoinInfo () {
      this.tiggerEvents({
        name: 'klineEvent',
        params: {
          type: 'showCoinInfo',
          isShow: false
        }
      })
    }
  }
}
</script>

<style scoped>
.coininfo{position:absolute;z-index:10;top:0;left:0;width:100%;height:0;background-color:rgba(51,50,50,0.95);transition:300ms;overflow:hidden;display:flex;flex-flow:column;}
.coininfo.show{height:100%;}
.coininfo-top{height:80px;margin:40px;display:flex;align-items:center;justify-content:space-between;overflow:hidden;}
.coininfo-top-left,.coininfo-top-right{display:flex;align-items:center;}
/*.coin-icon{display:flex;color:#fff;border:4px solid #fff;width:52px;height:52px;font-size:40px;border-radius:50%;justify-content:center;align-items:center;}*/
.coin-icon{width:53px;height:53px;border-radius:50%;}
.coin-title{display:flex;margin-left:30px;flex-flow:column;}
.coin-title /deep/ span{font-size:24px;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.coin-title /deep/ span:first-child{font-weight:bold;}
.coin-title /deep/ span font{color:#a1a8bb;font-weight:normal;}
.coin-title /deep/ span i{padding-left:20px;font-size:18px;}
.coin-title /deep/ span i.red{color:#ff7342;}
.coin-title /deep/ span i.green{color:#0ee7a5;}
.coininfo-top-right{flex:1;margin-left:40px;justify-content:space-between;}
.coininfo-top-right /deep/ li{display:flex;flex-flow:column;font-size:18px;margin-left:20px;}
.coininfo-top-right /deep/ li span{white-space:nowrap;overflow: hidden;text-overflow:ellipsis;}
.coininfo-top-right /deep/ li span:first-child{color:#bccbe8;margin-bottom:6px;}
.coininfo-top-right /deep/ li span:last-child{color:#fff;font-weight:bold;}
.coininfo-title{display:flex;font-size:18px;color:#fff;font-weight:bold;margin:0 40px 20px 40px;}
.coininfo-content{display:flex;flex:1;font-size:18px;color:#bccbe8;margin:0 40px;line-height:26px;overflow:auto;}
.coininfo-bottom{display:flex;margin:10px 40px;justify-content:center;align-items:center;}
.icon-arrow-up3{color:#11a8fe;font-size:20px;cursor:pointer;}
@media screen and (max-width: 1800px) {
    .coininfo-top-right /deep/ li{margin-left:40px;font-size:16px;}
}
@media screen and (max-width: 1700px) {
    .coininfo-top-right /deep/ li{margin-left:20px;}
}
@media screen and (max-width: 1600px) and (max-height: 900px) {
    .coininfo-top{height:60px;margin:20px 40px;}
    .coininfo-top-right /deep/ li{margin-left:10px;}
    .coin-icon{width:42px;height:42px;font-size:36px;}
    .coin-title /deep/ span{font-size:18px;}
    .coin-title /deep/ span i{font-size:14px;}
    .coininfo-top-right /deep/ li{font-size:14px;}
    .coininfo-title{margin:20px 40px;font-size:16px;}
    .coininfo-content{font-size:14px;line-height:22px;}
}
@media screen and (max-width: 1400px) {
    .coininfo-top{height:60px;margin:20px;}
    .coin-icon{width:49px;height:49px;font-size:40px;}
    .coin-title{margin-left:10px;}
    .coin-title /deep/ span{font-size:16px;}
    .coin-title /deep/ span i{padding-left:10px;font-size:12px;}
    .coininfo-top-right /deep/ li{font-size:12px;}
    .coininfo-title{font-size:14px;margin:20px;}
    .coininfo-content{font-size:12px;line-height:22px;margin:0 20px;}
}
</style>
