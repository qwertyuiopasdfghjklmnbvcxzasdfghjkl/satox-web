import api from './api'

let monitoring = {}

// 扥也查找提现失败列表
const findFailWithdrawApplyList = function (curPage, data, success, error) {
    api.post(`api/bm/monitor/withdrawApply/findFailWithdrawApplyList/10/${curPage}`, data, (res) => {
      if (res.rst === 1) {
        success && success(res.data, res.total)
      } else {
        error && error(res.msg)
      }
    }, error)
  }
monitoring.findFailWithdrawApplyList = findFailWithdrawApplyList

// 提现记录列表
const findAllWithdrawApplyList = function (curPage, data, success, error) {
  api.post(`api/bm/monitor/withdrawApply/findAllWithdrawApplyList/10/${curPage}`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data, res.total)
    } else {
      error && error(res.msg)
    }
  }, error)
}
monitoring.findAllWithdrawApplyList = findAllWithdrawApplyList

// 区块扫描列表
const findScanningBlockNumber = function (curPage, data, success, error) {
  api.get(`api/bm/monitor/comfirm/findScanningBlockNumber/10/${curPage}`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data, res.total)
    } else {
      error && error(res.msg)
    }
  }, error)
}
monitoring.findScanningBlockNumber = findScanningBlockNumber

//根据id查找错误id
const findErrorLogList = function (data, success, error) {
    api.post(`api/bm/monitor/errorLog/findErrorLogList/10/1`, data, (res) => {
      if (res.rst === 1) {
        success && success(res.data)
      } else {
        error && error(res.msg)
      }
    }, error)
  }
monitoring.findErrorLogList = findErrorLogList

//根据id查找错误id
const ignoreWithdrawApply = function (data, success, error) {
    api.post(`api/bm/monitor/withdrawApply/ignoreWithdrawApply`, data, (res) => {
      if (res.rst === 1) {
        success && success(res.data)
      } else {
        error && error(res.msg)
      }
    }, error)
  }
monitoring.ignoreWithdrawApply = ignoreWithdrawApply

//分页查找拥堵列表
const findWaitingWithdrawApplyList = function (curPage, data, success, error) {
    api.post(`api/bm/monitor/withdrawApply/findWaitingWithdrawApplyList/10/${curPage}`, data, (res) => {
      if (res.rst === 1) {
        success && success(res.data, res.total)
      } else {
        error && error(res.msg)
      }
    }, error)
  }
monitoring.findWaitingWithdrawApplyList = findWaitingWithdrawApplyList

//根据id查找确认区块数
const transactionConfirmList = function (data, success, error) {
    api.post(`api/bm/monitor/comfirm/findWaitingTransactionConfirmList/10/1`, data, (res) => {
      if (res.rst === 1) {
        success && success(res.data)
      } else {
        error && error(res.msg)
      }
    }, error)
  }
monitoring.transactionConfirmList = transactionConfirmList

//区块确认列表
const confirmList = function (curPage, data, success, error) {
    api.post(`api/bm/monitor/comfirm/findWaitingTransactionConfirmList/10/${curPage}`, data, (res) => {
      if (res.rst === 1) {
        success && success(res.data, res.total)
      } else {
        error && error(res.msg)
      }
    }, error)
  }
monitoring.confirmList = confirmList

//分页查询手续费账户信息
const findAdminAccountsList = function (curPage, data, success, error) {
  api.post(`api/bm/monitor/adminAccount/findAdminAccountsList/10/${curPage}`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data, res.total)
    } else {
      error && error(res.msg)
    }
  }, error)
}
monitoring.findAdminAccountsList = findAdminAccountsList

//分页查询提币主账户信息
const findAdminCoinPoolsList = function (curPage, data, success, error) {
  api.post(`api/bm/monitor/adminAccount/findAdminCoinPoolsList/10/${curPage}`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data, res.total)
    } else {
      error && error(res.msg)
    }
  }, error)
}
monitoring.findAdminCoinPoolsList = findAdminCoinPoolsList

//分页查询btc节点信息
const findBtcNodeList = function (curPage, data, success, error) {
  api.get(`api/bm/monitor/node/findBtcNodeList/10/${curPage}`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data, res.total)
    } else {
      error && error(res.msg)
    }
  }, error)
}
monitoring.findBtcNodeList = findBtcNodeList

//分页查询eth节点信息
const findEthNodeList = function (curPage, data, success, error) {
  api.get(`api/bm/monitor/node/findEthNodeList/10/${curPage}`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data, res.total)
    } else {
      error && error(res.msg)
    }
  }, error)
}
monitoring.findEthNodeList = findEthNodeList

//分页查询错误日志
const findErrorLogListPage = function (curPage, data, success, error) {
  api.post(`api/bm/monitor/errorLog/findErrorLogList/10/${curPage}`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data, res.total)
    } else {
      error && error(res.msg)
    }
  }, error)
}
monitoring.findErrorLogListPage = findErrorLogListPage

//根据错误日志id查找错误详情
const findeErrorDetails = function (errorLogId, success, error) {
  api.get(`api/bm/monitor/errorLog/findeErrorDetails/${errorLogId}`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
monitoring.findeErrorDetails = findeErrorDetails

//用户账户信息
const findAccountList = function (curPage, data, success, error) {
  api.post(`api/bm/monitor/userAccount/findAccountList/10/${curPage}`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data, res.total)
    } else {
      error && error(res.msg)
    }
  }, error)
}
monitoring.findAccountList = findAccountList

export default monitoring