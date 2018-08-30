/**
 * OTC接口
 */
import api from '@/api'

let domain = ''
let otc = {}

// 广告列表
const getAdvertisementList = function (formData, success, error) {
  api.post(`${domain}api/v2/otc/ads/list`, formData, (res) => {
    if (res.rst === 1) {
      success && success(res)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.getAdvertisementList = getAdvertisementList

// 我的广告列表
const getMyAdvertisementList = function (formData, success, error) {
  api.post(`${domain}api/v2/otc/ads/mylist`, formData, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.getMyAdvertisementList = getMyAdvertisementList

// 我的历史广告列表
const getHistoryAdList = function (formData, success, error) {
  api.get(`${domain}api/v2/otc/ads/myhistorylist`, formData, (res) => {
    if (res.rst === 1) {
      success && success(res)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.getHistoryAdList = getHistoryAdList

// 获取广告详情
const getAdvertisementDetail = function (id, success, error) {
  api.get(`${domain}api/v2/otc/ads/detail/${id}`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.getAdvertisementDetail = getAdvertisementDetail

// 发布广告
const createAdvertisement = function (formData, success, error) {
  api.post(`${domain}api/v2/otc/ads/create`, formData, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.createAdvertisement = createAdvertisement

// 修改广告
const updateAdvertisement = function (id, formData, success, error) {
  api.put(`${domain}api/v2/otc/ads/update/${id}`, formData, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.updateAdvertisement = updateAdvertisement

// 下架广告
const deleteAdvertisement = function (id, success, error) {
  api.delete(`${domain}api/v2/otc/ads/down/${id}`, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.deleteAdvertisement = deleteAdvertisement

// 上传图片
const uploadImage = function (type, formData, success, error) {
  // type 2:支付宝，3:微信
  api.postForm(`${domain}api/v2/otc/upload/${type}`, formData, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.uploadImage = uploadImage

// 下载收款二维码 - 收款方式设置
const downloadImage = function (type, success, error) {
  // type 2:支付宝，3:微信
  api.get(`${domain}api/v2/otc/download/code/${type}`, (res) => {
    if (res.rst === 1) {
      success && success(`${res.url ? res.url + '?' + Date.now() : ''}`)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.downloadImage = downloadImage

// 下载收款二维码 - 未完成的购买订单
const downloadImageByUserId = function (type, formData, success, error) {
  // type 2:支付宝，3:微信
  api.post(`${domain}api/v2/otc/download/commonCode/${type}`, formData, (res) => {
    if (res.rst === 1) {
      success && success(res.url)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.downloadImageByUserId = downloadImageByUserId

// 设置支付方式
const savePaySettings = function (type, formData, success, error) {
  api.post(`${domain}api/v2/otc/setting/paytype/${type}`, formData, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.savePaySettings = savePaySettings

// 获取支付方式，需要apiToken
const getPaySettings = function (success, error) {
  api.get(`${domain}api/v2/otc/paytypes`, (res) => {
    if (res.rst === 1) {
      success && success(res || {})
    } else {
      error && error(res)
    }
  }, error)
}
otc.getPaySettings = getPaySettings

// 获取支付方式，不需要apiToken
const getPaySettingsNoToken = function (formData, success, error) {
  api.post(`${domain}api/v2/otc/paytypes/common`, formData, (res) => {
    if (res.rst === 1) {
      success && success(res || {})
    } else {
      error && error(res)
    }
  }, error)
}
otc.getPaySettingsNoToken = getPaySettingsNoToken

// 获取订单列表
const getOrdersList = function (formData, success, error) {
  api.post(`${domain}api/v2/otc/orders/list`, formData, (res) => {
    if (res.rst === 1) {
      success && success(res.data, res.cur_time, res.total)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.getOrdersList = getOrdersList

// 新建订单
const createOrders = function (formData, success, error) {
  api.post(`${domain}api/v2/otc/orders`, formData, (res) => {
    if (res.rst === 1) {
      success && success(res.order_id, res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.createOrders = createOrders

// 订单详情
const ordersDetail = function (id, success, error) {
  api.get(`${domain}api/v2/otc/orders/detail/${id}`, (res) => {
    if (res.rst === 1) {
      success && success(res.data || {}, res.cur_time)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.ordersDetail = ordersDetail

// 取消订单
const cancelOrder = function (id, data, success, error) {
  api.delete(`${domain}api/v2/otc/orders/cancel/${id}`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.cancelOrder = cancelOrder

// 完成订单
const finishOrder = function (id, success, error) {
  api.put(`${domain}api/v2/otc/orders/finish/${id}`, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.finishOrder = finishOrder

// 支付完成
const payFinish = function (id, formData, success, error) {
  api.put(`${domain}api/v2/otc/orders/payFinish/${id}`, formData, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.payFinish = payFinish

// 买卖双方对交易对方进行评价
const commentOrder = function (id, data, success, error) {
  api.put(`${domain}api/v2/otc/orders/comment/${id}`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.commentOrder = commentOrder

// 创建申诉
const createAppeal = function (data, success, error) {
  api.post(`${domain}api/v2/otc/appeal`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.createAppeal = createAppeal

// 取消申诉
const cancelAppeal = function (id, success, error) {
  api.delete(`${domain}api/v2/otc/appeal/cancel/${id}`, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.cancelAppeal = cancelAppeal

// 获取申诉类型
const appealTtpe = function (success, error) {
  api.get(`${domain}api/v2/otc/appeal/types`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.appealTtpe = appealTtpe

// 上传图片
const uploadImages = function (data, success, error) {
  api.postForm(`${domain}api/v2/otc/upload/appeal/images`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.path)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.uploadImages = uploadImages

// 申请延时
const applydelay = function (id, data, success, error) {
  api.post(`${domain}api/v2/otc/orders/applydelay/${id}`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.applydelay = applydelay

// 获取OTC币种列表
const getCoinsList = function (success, error) {
  api.get(`${domain}api/v2/otc/symbols`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.getCoinsList = getCoinsList

// 新建意见反馈
const createFeedback = function (data, success, error) {
  api.post(`${domain}api/v2/otc/feedbacks`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.createFeedback = createFeedback

// 获取法币列表
const getCurrencys = function (success, error) {
  api.get(`${domain}api/v2/otc/currencys`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.getCurrencys = getCurrencys

// 获取对标交易所
const getBenchExchange = function (success, error) {
  api.get(`${domain}api/v2/otc/bench/markings`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.getBenchExchange = getBenchExchange

// 获取对标交易所对应币种的价格
const getBenchSymbolInfo = function (data, success, error) {
  api.post(`${domain}api/v2/otc/bench/symbolInfo`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.getBenchSymbolInfo = getBenchSymbolInfo

// 获取对标交易所对应币种的价格
const getCoinMarket = function (data, success, error) {
  api.post(`${domain}api/v2/otc/bench/symbol24Info`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.getCoinMarket = getCoinMarket

// 获取交易次数
const getScoreInfo = function (success, error) {
  api.get(`${domain}api/v2/otc/credits/score`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.getScoreInfo = getScoreInfo

// 获取好评率
const getUserLevel = function (success, error) {
  api.get(`${domain}api/v2/otc/comments/level`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.getUserLevel = getUserLevel

// 获取用户OTC基本交易信息：交易次数、好评率、可用余额、冻结金额
const getBaseInfo = function (symbol, success, error) {
  api.get(`${domain}api/v2/otc/baseInfo/${symbol}`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.getBaseInfo = getBaseInfo

/**
 * 聊天窗口发送消息
 * @param {*} data {order_number:订单号,content:消息}
 * @param {*} success 成功回调函数
 * @param {*} error 失败回调函数
 */
const sendMessage = function (data, success, error) {
  api.post(`${domain}api/v2/otc/chat/send`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.sendMessage = sendMessage

/**
 * 获取订单对应聊天记录
 * @param {*} data {order_number:订单号}
 * @param {*} success 成功回调函数
 * @param {*} error 失败回调函数
 */
const getMessagesByOrderNumber = function (data, success, error) {
  api.post(`${domain}api/v2/otc/chat/get`, data, (res) => {
    if (res.rst === 1) {
      res.data.user_header = `${res.data.user_header ? res.data.user_header + '?' + Date.now() : ''}`
      res.data.opposite_user_header = `${res.data.opposite_user_header ? res.data.opposite_user_header + '?' + Date.now() : ''}`
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.getMessagesByOrderNumber = getMessagesByOrderNumber

/**
 * 根据订单编号获取广告信息
 * @param {*} orderNumber 订单编号
 * @param {*} success 成功回调函数
 * @param {*} error 失败回调函数
 */
const getAdByOrderNumber = function (orderNumber, success, error) {
  api.post(`${domain}api/v2/otc/chat/getAd`, {order_number: orderNumber}, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.getAdByOrderNumber = getAdByOrderNumber

/**
 * 匹配支付方式
 * @param {*} adId 广告ID
 * @param {*} success 成功回调函数
 * @param {*} error 失败回调函数
 */
const matchPayTypes = function (adId, success, error) {
  api.post(`${domain}api/v2/otc/paytypes/match`, {ad_id: adId}, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.matchPayTypes = matchPayTypes

// 获取自己的实名验证状态
const getVerifyState = function (success, error) {
  api.get(`${domain}api/v2/otc/verify`, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.getVerifyState = getVerifyState

// OTC交易记录 - 导出报表 formData:{startDate:开始时间, endDate:结束时间, lang:语言}
const exportOTCTradeRecord = function (formData, success, error) {
  api.post(`${domain}api/v2/otc/export/excel`, formData, (res) => {
    if (res.rst === 1) {
      success && success(res.url)
    } else {
      error && error(res.msg)
    }
  }, error)
}
otc.exportOTCTradeRecord = exportOTCTradeRecord

export default otc
