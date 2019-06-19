/**
 * 商家API接口
 */
import api from '@/api'

let domain = ''
let shops = {}

// 获取认证商家社区信息
const getShopsCommunity = function (data, success, error) {
  api.get(`${domain}api/v2/otc/shops/community`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
shops.getShopsCommunity = getShopsCommunity

// 获取认证商家的等级信息
const getShopsLevel = function (data, success, error) {
  api.get(`${domain}api/v2/otc/shops/level`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
shops.getShopsLevel = getShopsLevel

// 获取认证商家申请信息
const getShopsApply = function (data, success, error) {
  api.get(`${domain}api/v2/otc/shops/apply/get`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
shops.getShopsApply = getShopsApply

// 用户申请进行商家认证
const postShopsApply = function (data, success, error) {
  api.post(`${domain}api/v2/otc/shops/apply`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
shops.postShopsApply = postShopsApply

// 产品列表
const productList = function (data, success, error) {
  api.get(`${domain}api/shop/products`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
shops.productList = productList;

// 预检查订单金额
const getMoney = function (data, success, error) {
  api.post(`${domain}api/shop/order/validate`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
shops.getMoney = getMoney;

// 创建订单
const createdOrder = function (data, success, error) {
  api.post(`${domain}api/shop/order`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
shops.createdOrder = createdOrder;

// 订单详情
const orderDetail = function (data, success, error) {
  api.get(`${domain}api/shop/order`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data,res.total)
    } else {
      error && error(res.msg)
    }
  }, error)
}
shops.orderDetail = orderDetail;

// 订单列表
const orderList = function (data, success, error) {
  api.get(`${domain}api/shop/order/list`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
shops.orderList = orderList;

// 我的购物车
const cartList = function ( success, error) {
  api.get(`${domain}api/shop/cart`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
shops.cartList = cartList;

// 加入购物车
const addCart = function (data, success, error) {
  api.post(`${domain}api/shop/cart`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
shops.addCart = addCart;

// 更新购物车
const putCart = function (data, success, error) {
  api.put(`${domain}api/shop/cart`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
shops.putCart = putCart;

export default shops
