import Vue from 'vue'
import Vuex from 'vuex'
import JsCookies from 'js-cookie'
import numUtils from '@/assets/js/numberUtils'

Vue.use(Vuex)

let userInfo = null

try {
  userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
} catch (ex) {}

const last24h = {open: '0', high: '0', bottom: '0', close: '0', vol: '0', rfvol: '0', percent: '0'}
const fixed = 8

export default new Vuex.Store({
  state: {
    userInfo: userInfo || {},
    marketList: [], // 交易市场列表
    api_token: JsCookies.get('api_token'),
    lang: window.localStorage.getItem('lang') || 'en',
    marketConfig: null,
    USDCNY: {},
    btcValuation: 0,
    fixed: fixed,
    last24h: last24h,
    otcSocketEvents: [],
    entrustPrices: [],
    entrustNewPrice: 0,
    networkSignal: 0,
    events: {},
    btcValues: {},
    smsCountrys:[],
    sysParams:{}
  },
  getters: {
    getMarketList (state) {
      return state.marketList
    },
    getSysParams(state){
      return state.sysParams
    },
    getSmsCountrys(state){
      return state.smsCountrys
    },
    getUserInfo (state) {
      return state.userInfo
    },
    getApiToken (state) {
      return state.api_token
    },
    isLogin (state) {
      return state.api_token
    },
    getLang (state) {
      return state.lang
    },
    getMarketConfig (state) {
      return state.marketConfig
    },
    getUSDCNY (state) {
      if (state.lang === 'en') {
        return state.USDCNY && state.USDCNY.USD
      } else {
        return state.USDCNY && state.USDCNY.CNY
      }
    },
    getUsdRate (state) {
      if (state.USDCNY && state.USDCNY.USD && state.USDCNY.CNY) {
        return numUtils.div(state.USDCNY.USD, state.USDCNY.CNY).toFixed(2)
      } else {
        return 0
      }
    },
    getBTCValuation (state) {
      return state.btcValuation
    },
    getLast24h (state) {
      return state.last24h
    },
    getFixed (state) {
      return state.fixed
    },
    getOtcSocketEvents (state) {
      return state.otcSocketEvents
    },
    getEntrustPrices (state) {
      return state.entrustPrices
    },
    getCoinSign (state) {
      return state.lang === 'en' ? '$' : '¥'
    },
    getEntrustNewPrice (state) {
      return state.entrustNewPrice
    },
    getNetworkSignal (state) {
      return state.networkSignal
    },
    getBtcValues (state) {
      return state.btcValues
    }
  },
  mutations: {
    updateMarketList (state, marketList) {
      state.marketList = marketList
    },
    updateSysParams (state, sysParams) {
      state.sysParams = sysParams
    },
    updateUserInfo (state, userInfo) {
      state.userInfo = userInfo
    },
    updateApiToken (state, apiToken) {
      state.api_token = apiToken
    },
    updateLang (state, lang) {
      state.lang = lang
    },
    updateMarketConfig (state, marketConfig) {
      state.marketConfig = marketConfig
    },
    updateUSDCNY (state, USDCNY) {
      state.USDCNY = USDCNY
    },
    updateBTCValuation (state, btcValuation) {
      state.btcValuation = state.api_token ? btcValuation : 0
    },
    updateLast24h (state, last24h) {
      state.last24h = last24h
    },
    addOtcSocketEvent (state, ev) {
      state.otcSocketEvents.push(ev)
    },
    removeOtcSocketEvent (state, ev) {
      let events = state.otcSocketEvents
      for (let i = 0; i < events.length; i++) {
        let cev = events[i]
        if (cev === ev) {
          events.splice(i, 1)
          break
        }
      }
    },
    updateEntrustPrices (state, datas) {
      state.entrustPrices = datas
    },
    updateEntrustNewPrice (state, price) {
      state.entrustNewPrice = price
    },
    addEvents (state, ev) {
      if (state.events[ev.name]) {
        state.events[ev.name].push(ev.fun)
      } else {
        state.events[ev.name] = [ev.fun]
      }
    },
    removeEvents (state, name) {
      delete state.events[name]
    },
    tiggerEvents (state, obj) {
      if (state.events[obj.name]) {
        state.events[obj.name].forEach((callback) => {
          callback(obj.params)
        })
      }
    },
    updateNetworkSignal (state, signal) {
      state.networkSignal = signal
    },
    updateBtcValues (state, btcValues) {
      state.btcValues = btcValues
    }
  },
  actions: {
    setMarketList (context, marketList) {
      marketList = JSON.parse(JSON.stringify(marketList))
      marketList.sort((item1, item2) => {
        let m1 = `${item1.currencySymbol}/${item1.baseSymbol}`
        let m2 = `${item2.currencySymbol}/${item2.baseSymbol}`
        if (m1 === m2) {
          return 0
        }
        return m1 < m2 ? -1 : 1
      })
      context.commit('updateMarketList', marketList)
    },
    setSysParams (context, sysParams) {
      context.commit('updateSysParams', sysParams)
    },
    setUserInfo (context, userInfo) {
      if (userInfo) {
        window.localStorage.setItem('userInfo', JSON.stringify(userInfo))
      }
      context.commit('updateUserInfo', userInfo)
    },
    setApiToken (context, apiToken) {
      if (apiToken) {
        JsCookies.set('api_token', apiToken)
      } else {
        window.localStorage.removeItem('userInfo')
        JsCookies.remove('api_token')
      }
      context.commit('updateApiToken', apiToken)
    },
    setLang (context, lang) {
      window.localStorage.setItem('lang', lang)
      context.commit('updateLang', lang)
    },
    setMarketConfig (context, marketConfig) {
      context.commit('updateMarketConfig', marketConfig)
    },
    setUSDCNY (context, USDCNY) {
      context.commit('updateUSDCNY', USDCNY)
    },
    setBTCValuation (context, btcValuation) {
      context.commit('updateBTCValuation', btcValuation)
    },
    setLast24h (context, data) {
      if (!data) {
        context.commit('updateLast24h', last24h)
        return
      }
      data = data[0].constructor === Array ? data[0] : data
      let open = numUtils.BN(data[0]).toFixed(fixed)
      let high = numUtils.BN(data[1]).toFixed(fixed)
      let bottom = numUtils.BN(data[2]).toFixed(fixed)
      let close = numUtils.BN(data[3]).toFixed(fixed)
      let direction = Number(data[8])
      let percent = !numUtils.BN(open).equals(0) ? numUtils.minus(close, open).div(open).mul(100) : numUtils.BN('0')
      context.commit('updateLast24h', {
        open: open,
        high: high, // 24h最高价
        bottom: bottom, // 24h最低价
        close: close, //  最新价
        vol: numUtils.BN(data[4]).toFixed(fixed), // 24h成交量
        rfvol: numUtils.minus(close, open).toFixed(fixed), // 涨跌幅
        isDown: percent.lt(0),
        percent: percent.toFixed(2),
        direction: direction // 价格 1 买 绿色、2 卖 红色
      })
    },
    addOtcSocketEvent (context, ev) {
      context.commit('addOtcSocketEvent', ev)
    },
    removeOtcSocketEvent (context, ev) {
      context.commit('removeOtcSocketEvent', ev)
    },
    setEntrustPrices (context, datas) {
      if (!datas) {
        context.commit('updateEntrustPrices', [])
        return
      }
      let temp = {}
      let newDatas = []
      for (let i = 0; i < datas.length; i++) {
        let d = datas[i]
        let price = numUtils.BN(String(d.price)).toFixed(fixed)
        let direction = String(d.direction)
        let key = price + '_' + direction
        if (!temp[key]) {
          temp[key] = true
          newDatas.push([price, direction])
        }
      }
      context.commit('updateEntrustPrices', newDatas)
    },
    setEntrustNewPrice (context, price) {
      context.commit('updateEntrustNewPrice', price)
    },
    addEvents (context, ev) {
      context.commit('addEvents', ev)
    },
    removeEvents (context, name) {
      context.commit('removeEvents', name)
    },
    tiggerEvents (context, obj) {
      context.commit('tiggerEvents', obj)
    },
    setNetworkSignal (context, signal) {
      context.commit('updateNetworkSignal', signal)
    },
    setBtcValues (context, data) {
      let btcValues = {}
      data.forEach((item) => {
        if (item.baseSymbol === 'BTC') {
          btcValues[item.currencySymbol] = item.lastPrice
        }
      })
      context.commit('updateBtcValues', btcValues)
    }
  }
})
