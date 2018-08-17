/**
 * 钱包API接口
 */
import api from '@/api'
let domain = process.env.NODE_ENV === 'development' ? `` : ''
let wallet = {}

// 获取对应币种钱包
const getWalletByCoin = function (data, success, error) {
  api.get(`${domain}api/v2/account/show`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
wallet.getWalletByCoin = getWalletByCoin

// 我的资产
const myAssets = function (data, success, error) {
  api.get(`${domain}api/v2/account/listAccounts`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
wallet.myAssets = myAssets

// 查询钱包地址
const listWithdraws = function (symbol, success, error) {
  api.get(`${domain}api/v2/account/showWithdraw?symbol=${symbol}`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
wallet.listWithdraws = listWithdraws
// 钱包提现
const walletWithdraw = function (data, success, error) {
  api.post(`${domain}api/v2/account/withdraw`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
wallet.walletWithdraw = walletWithdraw
// 历史充值充值 direction 1 充值  2 提现
const listDepositHistory = function (data, success, error) {
  api.post(`${domain}/api/v2/account/showHistory`, data, (res) => {
    if (res.rst === 1) {
      success && success(res)
    } else {
      error && error(res.msg)
    }
  }, error)
}
wallet.listDepositHistory = listDepositHistory

// 新增钱包地址
/* const postWithdraws = function (data, success, error) {
  api.get(`api/v1/wallet/postWithdraws`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
wallet.postWithdraws = postWithdraws

// 删除钱包地址
const removeWithdraws = function (data, success, error) {
  api.get(`api/v1/wallet/removeWithdraws`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
wallet.removeWithdraws = removeWithdraws

 */

export default wallet
