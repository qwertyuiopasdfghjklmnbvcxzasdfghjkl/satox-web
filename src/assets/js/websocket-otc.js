import JsCookies from 'js-cookie'
import Config from '@/assets/js/config'

(function (OtcWebSocket) {
  if (typeof module === 'object') {
    module.exports = OtcWebSocket
  } else {
    window.OtcWebSocket = OtcWebSocket
  }
})(function (opts) {
  opts = opts || {}
  let port = '9502'
  let isInit = false
  let isClose = false
  /**
   * 监听用户是否在线
   */
  var wsServer = `${Config.protocol}${Config.domain}/ws${port}`

  let websocket = null
  function sendMessage () {
    let apiToken = JsCookies.get('api_token')
    if (apiToken && websocket && websocket.readyState === websocket.OPEN) {
      var a = `{"event_type":"front","api_token":"${apiToken}"}`
      websocket.send(a)
    }
  }
  function createWebSocket () {
    let ws = new WebSocket(wsServer)

    // 监听连接打开
    ws.onopen = function (evt) {
      isInit = true
      console.log(`open websocket:${port}`)
      this.send(1)
      sendMessage()
    }

    // 监听连接关闭
    ws.onclose = function (evt) {
      isInit = false
      console.log(`close websocket:${port}`)
      setTimeout(function () {
        if (isClose) {
          return
        }
        websocket = createWebSocket()
      }, 3000)
    }

    // 监听服务器数据推送
    ws.onmessage = function (evt) {
      try {
        var data = JSON.parse(evt.data)
        if (data == 1) {
          // 每隔3秒发送一次心跳
          setTimeout(() => {
            if (this.readyState === this.OPEN) {
              this.send(1)
            }
          }, 3000)
          return
        }
        opts.onMessage && opts.onMessage(data)
      } catch (ex) {
        console.log(ex)
      }
    }

    // 监听连接错误信息
    ws.onerror = function (evt, e) {
    }
    return ws
  }
  if (JsCookies.get('api_token')) {
    websocket = new createWebSocket()
  }

  return {
    open () {
      if (isInit) {
        sendMessage()
        return
      }
      isClose = false
      websocket = new createWebSocket()
    },
    close: function () {
      if (!isInit) { return }
      isClose = true
      if (websocket && websocket.readyState === websocket.OPEN) {
        websocket.close()
      }
    },
    send: function () {
      sendMessage()
    }
  }
})
