import api from './api'

let fund = {}

// 查询冷钱包
const findAllColdWallet = function (curPage, success, error) {
    api.post(`api/bm/coinTask/coinColdWallet/findAllColdWallet/10/${curPage}`, (res) => {
      if (res.rst === 1) {
        success && success(res.data, res.total)
      } else {
        error && error(res.msg)
      }
    }, error)
  }
fund.findAllColdWallet = findAllColdWallet

// // 修改冷钱包
// const updateColdWallet = function (data, success, error) {
//     api.post(`api/bm/coinTask/coinColdWallet/updateColdWallet`, data, (res) => {
//       if (res.rst === 1) {
//         success && success(res.data)
//       } else {
//         error && error(res.msg)
//       }
//     }, error)
//   }
// fund.updateColdWallet = updateColdWallet


// 添加冷钱包
const addColdWallet = function (data, success, error) {
  api.post(`api/bm/coinTask/coinColdWallet/addColdWallet`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
fund.addColdWallet = addColdWallet

// 查询转账配置
const findTransferConfig = function (curPage, success, error) {
  api.get(`api/bm/coinTask/coinCtConfig/findTransferConfig/10/${curPage}`, (res) => {
    if (res.rst === 1) {
      success && success(res.data, res.total)
    } else {
      error && error(res.msg)
    }
  }, error)
}
fund.findTransferConfig  = findTransferConfig

// 查询转账记录
const findTransactionRecords = function (curPage, success, error) {
  api.get(`api/bm/coinTask/transactionRecords/findTransactionRecords/10/${curPage}/null`, (res) => {
    if (res.rst === 1) {
      success && success(res.data, res.total)
    } else {
      error && error(res.msg)
    }
  }, error)
}
fund.findTransactionRecords  = findTransactionRecords

// 冷钱包--设为启用
const updateColdWallet = function (data, success, error) {
  api.post(`/api/bm/coinTask/coinColdWallet/updateColdWallet`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
fund.updateColdWallet  = updateColdWallet

// 冷钱包--修改地址
const updateWalletAddress = function (data, success, error) {
  api.post(`/api/bm/coinTask/coinColdWallet/updateColdWallet`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
fund.updateWalletAddress  = updateWalletAddress

// 冷钱包--新增配置
const addConfig = function (data, success, error) {
  api.post(`/api/bm/coinTask/coinCtConfig/addConfig`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
fund.addConfig  = addConfig


// 冷钱包--修改配置
const updateConfig = function (data, success, error) {
  api.post(`/api/bm/coinTask/coinCtConfig/updateConfig`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
fund.updateConfig  = updateConfig


// 冷钱包--配置详情
const findOneTransferConfig = function (data, success, error) {
  api.post(`api/bm/coinTask/coinCtConfig/findOneTransferConfig`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
fund.findOneTransferConfig  = findOneTransferConfig

// 冷钱包--配置详情
const setDetail= function (data, success, error) {
  api.post(`api/bm/coinTask/coinColdWallet/setDefaultWallet`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
fund.setDetail  = setDetail

// 查询手动转账
const getAdminCoinPool = function (curPage, data, success, error) {
  api.post(`api/bm/coinTask/transferTask/getAdminCoinPool/10/${curPage}`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data, res.total)
    } else {
      error && error(res.msg)
    }
  }, error)
}
fund.getAdminCoinPool  = getAdminCoinPool


// 主地址转冷钱包设置--手动转账
const transfer = function (data, success, error) {
  api.post(`api/bm/coinTask/transferTask/ManagerTransfer`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
fund.transfer  = transfer


// 冷钱包设置--新增地址
const addColdWalletAddress = function (data, success, error) {
  api.post(`api/bm/coinTask/coinColdWallet/addColdWalletAddress`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
fund.addColdWalletAddress  = addColdWalletAddress


// 冷钱包设置--删除地址
const deleteColdWallet = function (data, success, error) {
  api.post(`api/bm/coinTask/coinColdWallet/deleteColdWallet`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
fund.deleteColdWallet  = deleteColdWallet

export default fund
