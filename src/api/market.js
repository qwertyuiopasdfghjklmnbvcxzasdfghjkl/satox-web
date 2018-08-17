/**
 * 交易市场api接口
 */
import api from '@/api'

let domain = process.env.NODE_ENV === 'development' ? `` : ''
let market = {}

// 市场列表 获取所有产品
const marketList = function (success, error) {
  api.get(`${domain}api/v2/trade/market`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
market.marketList = marketList

// 限价买
const limitBuy = function (data, success, error) {
  api.post(`${domain}api/v2/trade/buy`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
market.limitBuy = limitBuy

// 限价卖
const limitSell = function (data, success, error) {
  api.post(`${domain}api/v2/trade/sell`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
market.limitSell = limitSell

// 市价买
const marketBuy = function (data, success, error) {
  api.post(`${domain}api/v2/trade/buyMarket`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
market.marketBuy = marketBuy

// 市价卖
const marketSell = function (data, success, error) {
  api.post(`${domain}api/v2/trade/sellMarket`, data, (res) => {
    if (res.rst === 1) {
      success && success()
    } else {
      error && error(res.msg)
    }
  }, error)
}
market.marketSell = marketSell

// 市场买卖
const marketTrade = function (data, success, error) {
  api.post(`${domain}api/v2/trade/market`, data, (res) => {
    if (res.rst === 1) {
      success && success()
    } else {
      error && error(res.msg)
    }
  }, error)
}
market.marketTrade = marketTrade

// 取消订单
const cancelOrder = function (orderBookId, success, error) {
  api.get(`${domain}api/v2/trade/my/orderBook/${orderBookId}/cancel`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
market.cancelOrder = cancelOrder

// 取消当前市场所有订单
const cancelAllOrder = function (market, success, error) {
  api.get(`${domain}api/v2/trade/my/orderBook/cancelAll?market=${market}`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
market.cancelAllOrder = cancelAllOrder

// 取消所有市场所有订单
const cancelAll = function (market, success, error) {
  api.get(`${domain}api/v2/trade/my/orderBook/cancelAll`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
market.cancelAll = cancelAll

// 最近交易记录
const getNearestTradeRecords = function (market, success, error) {
  api.get(`${domain}api/v3/trade/market/${market}/latestDeal`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
market.getNearestTradeRecords = getNearestTradeRecords

// 获取委托记录(旧)
const getCurrentEntrust = function (data, success, error) {
  api.post(`${domain}api/v2/trade/getCurrentEntrust`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
market.getCurrentEntrust = getCurrentEntrust

// 获取委托记录 - 当前委托、历史委托tp:0，币币成交记录tp:1
const getCurrentEntrustByParams = function (data, success, error) {
  api.post(`${domain}api/v2/trade/my/queryOrders`, data, (res) => {
    if (res.rst === 1) {
      success && success(res)
    } else {
      error && error(res.msg)
    }
  }, error)
}
market.getCurrentEntrustByParams = getCurrentEntrustByParams

// 导出报表 - 历史委托tp:0，币币成交记录tp:1
const exportHistory = function (date, success, error) {
  api.get(`${domain}api/v2/trade/my/exportData`, (res) => {
    if (res.rst === 1) {
      success && success(res.url)
    } else {
      error && error(res.msg)
    }
  }, error)
}
market.exportHistory = exportHistory
// 根据Symbol获取当前委托
const getCurrentEntrustBySymbol = function (history, market, success, error) {
  api.get(`${domain}api/v3/trade/my/orderBook?history=${history}&market=${market}`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
market.getCurrentEntrustBySymbol = getCurrentEntrustBySymbol

// 历史成交
const getHistoryDeal = function (history, market, success, error) {
  api.get(`${domain}api/v3/trade/my/orderBook?history=${history}&market=${market}`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
market.getHistoryDeal = getHistoryDeal

// 获取全部余额
const getBalance = function (success, error) {
  api.post(`${domain}api/v2/trade/balance`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
market.getBalance = getBalance

// 获取深度信息
const getDepths = function (market, success, error) {
  api.get(`${domain}api/v3/trade/market/${market}/depth`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
market.getDepths = getDepths

// 获取24小时最新价
const get24hPrice = function (data, success, error) {
  api.get(`${domain}api/v3/kline/lastPrice`, data, (res) => {
    if (res && res.length > 0) {
      success && success(res)
    } else {
      error && error(res.msg)
    }
  }, error)
}
market.get24hPrice = get24hPrice

// 获取所有产品
const getProduct = function (success, error) {
  api.post(`${domain}api/v2/trade/markets`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
market.getProduct = getProduct

// 添加收藏
const addCollection = function (data, success, error) {
  api.post(`${domain}api/v2/trade/market/addCollection`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
market.addCollection = addCollection

// 取消收藏
const removeCollection = function (data, success, error) {
  api.post(`${domain}api/v2/trade/market/removeCollection`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
market.removeCollection = removeCollection

// 市场买入和卖出
const marketBuyorSell = function (data, success, error) {
  api.post(`${domain}api/v2/account/entrust`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
market.marketBuyorSell = marketBuyorSell

// 获取K线图展示数据
const getKlineTestData = function (success, error) {
  api.get(`${location.origin}/static/kline.json`, (res) => {
    let datas = []
    res.forEach((item) => {
      datas.push([item[0], parseFloat(item[1]), parseFloat(item[2]), parseFloat(item[3]), parseFloat(item[4]), parseFloat(item[5])])
    })
    success && success(datas)
  }, error)
}
market.getKlineTestData = getKlineTestData

// 首页市场推荐
const marketListCom = function (recommand, success, error) {
  api.get(`${domain}api/v2/trade/market?recommand=${recommand}`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
market.marketListCom = marketListCom

// 获取币种简介信息
const getSymbolIntroduce = function (symbol, success, error) {
  api.get(`${domain}api/v2/kline/symbolIntroduce?symbol=${symbol}`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
market.getSymbolIntroduce = getSymbolIntroduce

export default market
