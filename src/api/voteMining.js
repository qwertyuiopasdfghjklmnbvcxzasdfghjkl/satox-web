/**
 * 投票挖矿API接口
 */
import api from '@/api'

let domain = ''
let voteMining = {}

// 获得投票信息
const getVoteInfo = function (success, error) {
  api.get(`${domain}api/v2/account2/vote/info`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
voteMining.getVoteInfo = getVoteInfo

// 资金划转
const postTransfer = function (data, success, error) {
  api.post(`${domain}api/v2/account2/transfer`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
voteMining.postTransfer = postTransfer

// 投票挖矿
const postVote = function (data, success, error) {
  api.post(`${domain}api/v2/account2/vote`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
voteMining.postVote = postVote

// 投票收益统计
const getVoteStatistics = function (success, error) {
  api.get(`${domain}api/v2/account2/vote/statistics`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
voteMining.getVoteStatistics = getVoteStatistics

// 投票列表
const getVoteRecord = function (data, success, error) {
  api.get(`${domain}api/v2/account2/vote/record?page=${data.page}&size=${data.size}`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
voteMining.getVoteRecord = getVoteRecord

// 挖矿收益统计
const getMiningStatistics = function (success, error) {
  api.get(`${domain}api/v2/account2/mining/statistics`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
voteMining.getMiningStatistics = getMiningStatistics

// 挖矿收益列表
const getMiningRecord = function (success, error) {
  api.get(`${domain}api/v2/account2/mining/record`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
voteMining.getMiningRecord = getMiningRecord

// 社区收益统计
const getCommunityStatistics = function (success, error) {
  api.get(`${domain}api/v2/account2/community/statistics`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
voteMining.getCommunityStatistics = getCommunityStatistics

// 我的矿池
const getMiningPool = function (data, success, error) {
  api.get(`${domain}api/v2/account2/mining/pool?page=${data.page}&size=${data.size}`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
voteMining.getMiningPool = getMiningPool

export default voteMining
