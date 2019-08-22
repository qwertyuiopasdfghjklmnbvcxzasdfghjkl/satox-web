import JsCookies from 'js-cookie'
import Config from './config'
/*
"subscribe":[]
     * @param kline K线图
     * @param account 帐户信息
     * @param market 市场信息
     * @param block_trade 大宗商品市场信息
     * @param depth 深度
     * @param last_price 24小时最新价
     * @param user_new_orderbook 用户当前委托
     * @param user_history_orderbook 用户历史委托
     * @param new_transaction 最新成交
     * @param valuation 估值
     * @param symbol_volumes 币种成交量

*/
(function (KLineWebSocket) {
  if (typeof module === 'object') {
    module.exports = KLineWebSocket
  } else {
    window.KLineWebSocket = KLineWebSocket
  }
})(function (opts) {
  let apiToken = ''
  opts = opts || {}
  let symbol = opts.symbol || 'ETHBTC'
  let period = opts.period || '1m'
  let subscribe = opts.subscribe || []
  let port = '9501'
  let isLeavePage = false

  let chartSettings = window.localStorage.getItem('chartSettings')
  if (chartSettings) {
    chartSettings = JSON.parse(chartSettings)
    period = chartSettings.charts.period
  }

  let webSocket = null
  function sendMessage () {
    apiToken = JsCookies.get('api_token') || ''
    if (opts.type === 'global' && webSocket && webSocket.readyState === webSocket.OPEN) {
      webSocket.send(`{"event":"addChannel","channel":"global","api_token":"${apiToken}"}`)
      return
    }
    if (webSocket && webSocket.readyState === webSocket.OPEN) {
      let params = {"event":"addChannel","channel":"kline","api_token":apiToken,"period":period === 'line' ? '1m' : period,"symbol":symbol,"isZip":false,"subscribe":subscribe}
      webSocket.send(JSON.stringify(params))
    }
  }
  let curTime = null
  function checkNetWork () {
    apiToken = JsCookies.get('api_token') || ''
    if (opts.type === 'global' && webSocket && webSocket.readyState === webSocket.OPEN) {
      curTime = Date.now()
      webSocket.send(`{"event":"network","channel":"global","api_token":"${apiToken}"}`)
    }
  }
  function createWebSocket () {
    let ws = new WebSocket(`${Config.protocol}${Config.domain}/ws${port}`)
    ws.onopen = function () {
      console.log(`open websocket:${port}`)
      this.send(1)
      sendMessage()
      if (opts.type === 'global') {
        checkNetWork()
      }
    }
    ws.onmessage = function (res) {
      try {
        res = JSON.parse(res.data)
        if (res == 1) {
          // 每隔3秒发送一次心跳
          setTimeout(() => {
            if (this.readyState === this.OPEN) {
              this.send(1)
            }
          }, 3000)
          return
        }
        if (res.dataType === 'LastNetwork') {
          let interval = Date.now() - curTime
          console.log(`网络监测：${interval}`)
          let minMS = 200
          let maxMS = 400
          if (interval < minMS) {
            // 网络信号优
            opts.checkNetWork && opts.checkNetWork(0)
          } else if (interval >= minMS && interval < maxMS) {
            // 网络信号中
            opts.checkNetWork && opts.checkNetWork(1)
          } else if (interval >= maxMS) {
            // 网络信号弱
            opts.checkNetWork && opts.checkNetWork(2)
          }
          setTimeout(checkNetWork, 10000)
        }
        opts.callback && opts.callback(res)
      } catch (ex) {
        console.warn(ex)
      }
    }
    ws.onclose = function () {
      console.log(`close websocket:${port}`)
      typeof opts.onClose === 'function' && opts.onClose()
      setTimeout(function () {
        if (isLeavePage) {
          return
        }
        webSocket = createWebSocket()
      }, 3000)
    }
    ws.onerror = function () {
      console.log(`error websocket:${port}`)
    }
    return ws
  }
  webSocket = createWebSocket()

  return {
    close () {
      isLeavePage = true
      if (webSocket.readyState === webSocket.OPEN) {
        webSocket.close()
      }
    },
    changeLogin () {
      sendMessage()
    },
    switchPeriod: function (p) {
      period = p
      sendMessage()
    },
    switchSymbol: function (s) {
      symbol = s
      sendMessage()
    }
  }
})
