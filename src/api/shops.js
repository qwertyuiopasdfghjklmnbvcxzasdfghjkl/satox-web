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



export default shops
