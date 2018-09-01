import api from './api'

let finance = {}

// 财务管理--提币审核
const getAuditingList = function (curPage, success, error) {
    api.post(`api/bm/financialManage/withdrawAuditing/findWithdrawAuditingList/10/${curPage}`, (res) => {
        if (res.rst === 1) {
          success && success(res.data, res.total)
        } else {
          error && error(res.msg)
        }
    }, error)
  }
finance.getAuditingList = getAuditingList


// 财务管理--提币审核统计数据
const findTotalWithdrawAuditingData = function (success, error) {
  api.get('api/bm/financialManage/withdrawAuditing/findTotalWithdrawAuditingData', (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
finance.findTotalWithdrawAuditingData = findTotalWithdrawAuditingData


// 财务管理--审核提币清单
const updateWithdrawAuditing = function (data, success, error) {
  api.post('api/bm/financialManage/withdrawAuditing/updateWithdrawAuditing', data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
finance.updateWithdrawAuditing = updateWithdrawAuditing



// 财务管理--充值监控数据
const findRechargeMonitorList = function (curPage, success, error) {
  api.get(`api/bm/financialManage/financialStatistics/findRechargeMonitorList/10/${curPage}`, (res) => {
    if (res.rst === 1) {
      success && success(res.data, res.total)
    } else {
      error && error(res.msg)
    }
  }, error)
}
finance.findRechargeMonitorList = findRechargeMonitorList

// 财务管理--日提币统计数据
const findWithdrawStatisticsList = function (curPage, success, error) {
  api.get(`api/bm/financialManage/financialStatistics/findWithdrawStatisticsList/10/${curPage}`, (res) => {
    if (res.rst === 1) {
      success && success(res.data, res.total)
    } else {
      error && error(res.msg)
    }
  }, error)
}
finance.findWithdrawStatisticsList = findWithdrawStatisticsList

// 财务管理--实时对账数据
const findRealTimeCheckingList = function (curPage, success, error) {
  api.get(`api/bm/financialManage/financialStatistics/findRealTimeCheckingList/10/${curPage}`, (res) => {
    if (res.rst === 1) {
      success && success(res.data, res.total)
    } else {
      error && error(res.msg)
    }
  }, error)
}
finance.findRealTimeCheckingList = findRealTimeCheckingList


// 财务管理--资金池情况
const findCapitalPoolList = function (curPage, success, error) {
  api.get(`api/bm/financialManage/financialStatistics/findCapitalPoolList/10/${curPage}`, (res) => {
    if (res.rst === 1) {
      success && success(res.data, res.total)
    } else {
      error && error(res.msg)
    }
  }, error)
}
finance.findCapitalPoolList = findCapitalPoolList




// 财务管理--手续费转账
const findServiceFeeAccountList = function (curPage, success, error) {
  api.get(`api/bm/financialManage/financialStatistics/findServiceFeeAccountList/10/${curPage}`, (res) => {
    if (res.rst === 1) {
      success && success(res.data, res.total)
    } else {
      error && error(res.msg)
    }
  }, error)
}
finance.findServiceFeeAccountList = findServiceFeeAccountList


// 财务管理--异常交易数据
const findAbnormalExchangeList = function (success, error) {
  api.get('api/bm/financialManage/financialStatistics/findAbnormalExchangeList/10/1', (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
finance.findAbnormalExchangeList = findAbnormalExchangeList

export default finance