import api from './api'

let curreny = {}

// 用户管理列表
const getfindUserList = function (data, curPage, success, error) {
    api.post(`api/bm/bbManage/userManage/findUserList/10/${curPage}`, data, (res) => {
      if (res.rst === 1) {
        success && success(res.data, res.total)
      } else {
        error && error(res.msg)
      }
    }, error)
  }
curreny.getfindUserList = getfindUserList

// 用户管理--收藏市场
const findUserCollectionMarketList = function (success, error) {
    api.post('api/bm/bbManage/userManage/findUserCollectionMarketList/10/1', (res) => {
      if (res.rst === 1) {
        success && success(res.data)
      } else {
        error && error(res.msg)
      }
    }, error)
  }
curreny.findUserCollectionMarketList = findUserCollectionMarketList

// 用户管理--消息记录
const findUserMessageList = function (userId, success, error) {
    api.post('api/bm/bbManage/userManage/findUserMessageList/10/1', {
      userId: userId
    }, (res) => {
      if (res.rst === 1) {
        success && success(res.data)
      } else {
        error && error(res.msg)
      }
    }, error)
  }
curreny.findUserMessageList = findUserMessageList

// 用户管理--发送消息
const insertUserMessage = function (userId, msg, success, error) {
  api.post('api/bm/bbManage/userManage/insertUserMessage', {
    userId: userId,
    msg: msg
  }, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
curreny.insertUserMessage = insertUserMessage

// 用户管理--登录记录
const findUserLoginLogList = function (curPage, data, success, error) {
  api.post(`api/bm/bbManage/userManage/findUserLoginLogList/10/${curPage}`, data, (res, total) => {
    if (res.rst === 1) {
      success && success(res.data, res.total)
    } else {
      error && error(res.msg)
    }
  }, error)
}
curreny.findUserLoginLogList = findUserLoginLogList

// 用户管理--当前委托
const findUserCurrentEntrustmentList = function (userId, success, error) {
  api.post('api/bm/bbManage/userManage/findUserCurrentEntrustmentList/10/1',{
    userId: userId
  }, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
curreny.findUserCurrentEntrustmentList = findUserCurrentEntrustmentList

// 用户管理--历史委托
const findUserHistoricalEntrustmentList = function (userId, success, error) {
  api.post('api/bm/bbManage/userManage/findUserHistoricalEntrustmentList/10/1',{
    userId: userId
  }, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
curreny.findUserHistoricalEntrustmentList = findUserHistoricalEntrustmentList

// 用户管理--币币交易记录
const findUserExchangeRecordList = function (userId, success, error) {
  api.post('api/bm/bbManage/userManage/findUserExchangeRecordList/10/1',{
    userId: userId
  }, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
curreny.findUserExchangeRecordList = findUserExchangeRecordList

// 用户管理--当前资产记录
const findUserCurrentAssetsList = function (userId, success, error) {
    api.post('api/bm/bbManage/userManage/findUserCurrentAssetsList/10/1', (res) => {
      if (res.rst === 1) {
        success && success(res.data)
      } else {
        error && error(res.msg)
      }
    }, error)
  }
curreny.findUserCurrentAssetsList = findUserCurrentAssetsList



// 用户管理--充值记录
const findUserRechargeRecordList = function (userId, success, error) {
  api.post('api/bm/bbManage/userManage/findUserRechargeRecordList/10/1', (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
curreny.findUserRechargeRecordList = findUserRechargeRecordList

// 用户管理--提币记录（充值记录）
const findUserWithdrawRecordList = function (userId, success, error) {
  api.post('api/bm/bbManage/userManage/findUserWithdrawRecordList/10/1', (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
curreny.findUserWithdrawRecordList = findUserWithdrawRecordList

// 用户管理--充值地址记录
const findUserRechargeAddrList = function (userId, success, error) {
  api.post('api/bm/bbManage/userManage/findUserRechargeAddrList/10/1', (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
curreny.findUserRechargeAddrList = findUserRechargeAddrList

// 用户管理--提现地址
const findUserWithdrawAddrList = function (userId, success, error) {
  api.post('api/bm/bbManage/userManage/findUserWithdrawAddrList/10/1', (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
curreny.findUserWithdrawAddrList = findUserWithdrawAddrList

// 用户管理--分发记录
const findUserDistributeRecordList = function (userId, success, error) {
  api.post('api/bm/bbManage/userManage/findUserDistributeRecordList/10/1', (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
curreny.findUserDistributeRecordList = findUserDistributeRecordList

// 用户管理--查询账户权限
const findUserPermission = function (userId, success, error) {
    api.post('api/bm/bbManage/userManage/findUserPermission',{
      userId: userId
    }, (res) => {
      if (res.rst === 1) {
        success && success(res.data)
      } else {
        error && error(res.msg)
      }
    }, error)
  }
curreny.findUserPermission = findUserPermission

// 用户管理--修改账户权限
const updateUserPermission = function (data, success, error) {
  api.post('api/bm/bbManage/userManage/updateUserPermission', data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
curreny.updateUserPermission = updateUserPermission

// 用户管理--修改记录
const findUserPermissionChangeRecordList = function (success, error) {
    api.post('api/bm/bbManage/userManage/findUserPermissionChangeRecordList/10/1', (res) => {
      if (res.rst === 1) {
        success && success(res.data)
      } else {
        error && error(res.msg)
      }
    }, error)
  }
curreny.findUserPermissionChangeRecordList = findUserPermissionChangeRecordList

// 币种管理--修改币种充值设置
const updateSymbol = function (data, success, error) {
  api.post('api/bm/bbManage/symbolManage/updateSymbol', data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
curreny.updateSymbol = updateSymbol

// 币种管理--修改币种
const insertSymbol = function (data, success, error) {
  api.post('api/bm/bbManage/symbolManage/insertSymbol', data, (res) => {
    if (res.status == 200) {
      if (res.rst === 1) {
        success && success(res.data)
      } else {
        error && error(res.msg)
      }
    }  else if (res.status == 500) {
      error && error(res.msg)
    }

  }, error)
}
curreny.insertSymbol = insertSymbol

// 币种管理--修改提币设置
const updateSymbolWithdrawFees = function (data, success, error) {
  api.post('api/bm/bbManage/symbolManage/updateSymbolWithdrawFees', data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
curreny.updateSymbolWithdrawFees = updateSymbolWithdrawFees

// 币种管理--市场管理交易信息
const findSymbolExchangeInfoList = function (data, curPage1, success, error) {
  api.post(`api/bm/bbManage/symbolManage/findSymbolExchangeInfoList/10/${curPage1}`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data, res.total)
    } else {
      error && error(res.msg)
    }
  }, error)
}
curreny.findSymbolExchangeInfoList = findSymbolExchangeInfoList

// 市场管理--市场交易信息
const findMarketExchangeInfoList = function (data, curPage, success, error) {
  api.post(`api/bm/bbManage/marketManage/findMarketExchangeInfoList/10/${curPage}`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data, res.total)
    } else {
      error && error(res.msg)
    }
  }, error)
}
curreny.findMarketExchangeInfoList = findMarketExchangeInfoList


// 市场管理--市场修改
const updateMarket = function (data, success, error) {
  api.post('api/bm/bbManage/marketManage/updateMarket', data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
curreny.updateMarket = updateMarket


// 币种管理--查询币种
const findSymbolList = function (data, curPage, success, error) {
  api.post(`api/bm/bbManage/symbolManage/findSymbolList/10/${curPage}`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data, res.total)
    } else {
      error && error(res.msg)
    }
  }, error)
}
curreny.findSymbolList = findSymbolList

// 币种管理--id查询币种提币设置
const findSymbolWithdrawFees = function (data, success, error) {
  api.post('api/bm/bbManage/symbolManage/findSymbolWithdrawFees', data , (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
curreny.findSymbolWithdrawFees = findSymbolWithdrawFees

// 币种管理--市场管理新增市场
const insertMarket = function (data, success, error) {
  api.post('api/bm/bbManage/marketManage/insertMarket',data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
curreny.insertMarket = insertMarket

// 币种管理--查询市场
const findMarketList = function (data, curPage, success, error) {
  api.post(`api/bm/bbManage/marketManage/findMarketList/10/${curPage}`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data, res.total)
    } else {
      error && error(res.msg)
    }
  }, error)
}
curreny.findMarketList = findMarketList


export default curreny