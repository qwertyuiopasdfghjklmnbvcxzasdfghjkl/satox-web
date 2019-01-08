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


export default voteMining
