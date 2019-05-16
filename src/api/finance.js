import api from './api';
import kyc from './kyc';

let finance = {};

// 财务管理--提币审核
const getAuditingList = function (curPage, data, success, error) {
    api.post(`api/bm/financialManage/withdrawAuditing/findWithdrawAuditingList/10/${curPage}`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
finance.getAuditingList = getAuditingList;

// 财务管理--提币审核统计数据
const findTotalWithdrawAuditingData = function (success, error) {
    api.get('api/bm/financialManage/withdrawAuditing/findTotalWithdrawAuditingData', (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
finance.findTotalWithdrawAuditingData = findTotalWithdrawAuditingData;

// 财务管理--审核提币清单
const updateWithdrawAuditing = function (data, success, error) {
    api.post('api/bm/financialManage/withdrawAuditing/updateWithdrawAuditing', data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
finance.updateWithdrawAuditing = updateWithdrawAuditing;

// 财务管理--充值监控数据
const findRechargeMonitorList = function (curPage, sortStr, success, error) {
    api.get(`api/bm/financialManage/financialStatistics/findRechargeMonitorList/10/${curPage}/${sortStr}`, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
finance.findRechargeMonitorList = findRechargeMonitorList;

// 财务管理--日提币统计数据
const findWithdrawStatisticsList = function (curPage, sortStr, success, error) {
    api.get(`api/bm/financialManage/financialStatistics/findWithdrawStatisticsList/10/${curPage}/${sortStr}`, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
finance.findWithdrawStatisticsList = findWithdrawStatisticsList;

// 财务管理--币种充值记录
const findSymbolRechargeList = function (data, success, error) {
    api.get(`api/bm/financialManage/financialStatistics/symbolRecharge`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
finance.findSymbolRechargeList = findSymbolRechargeList;

// 财务管理--实时对账数据
const findRealTimeCheckingList = function (curPage, success, error) {
    api.get(`api/bm/financialManage/financialStatistics/findRealTimeCheckingList/10/${curPage}`, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
finance.findRealTimeCheckingList = findRealTimeCheckingList;

// 财务管理--资金池情况
const findCapitalPoolList = function (curPage, sortStr, data, success, error) {
    api.get(`api/bm/financialManage/financialStatistics/findCapitalPoolList/10/${curPage}/${sortStr}`, data,
        (res) => {
            if (res.rst === 1) {
                success && success(res.data, res.total);
            } else {
                error && error(res.msg);
            }
        }, error);
};
finance.findCapitalPoolList = findCapitalPoolList;

// 财务管理--手续费转账
const findServiceFeeAccountList = function (curPage, sortStr, data, success, error) {
    api.get(`api/bm/financialManage/financialStatistics/findServiceFeeAccountList/10/${curPage}/${sortStr}`, data,
        (res) => {
            if (res.rst === 1) {
                success && success(res.data, res.total);
            } else {
                error && error(res.msg);
            }
        }, error);
};
finance.findServiceFeeAccountList = findServiceFeeAccountList;

// 财务管理--异常交易数据
const findAbnormalExchangeList = function (curPage, success, error) {
    api.get(`api/bm/financialManage/financialStatistics/findAbnormalExchangeList/10/${curPage}`, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
finance.findAbnormalExchangeList = findAbnormalExchangeList;

// // 财务管理--异常交易数据
// const getExchangeList = function ( success, error) {
//   api.get(`api/bm/financialManage/financialStatistics/findRechargeMonitorList/10/1`, (res) => {
//     if (res.rst === 1) {
//       success && success(res.data)
//     } else {
//       error && error(res.msg)
//     }
//   }, error)
// }
// finance.getExchangeList = getExchangeList

// 财务管理--平账管理--漏记
const ledgerAdd = function (data, success, error) {
    api.post(`api/bm/account/ledger/add`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
finance.ledgerAdd = ledgerAdd;

// 财务管理--平账管理--多记
const ledgerReduce = function (data, success, error) {
    api.post(`api/bm/account/ledger/reduce`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
finance.ledgerReduce = ledgerReduce;

// 财务管理--平账管理--平差
const ledgerBalance = function (data, success, error) {
    api.post(`api/bm/account/ledger/balance`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
finance.ledgerBalance = ledgerBalance;

// 财务管理--平账管理--错记
const ledgerFix = function (data, success, error) {
    api.post(`api/bm/account/ledger/fix`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
finance.ledgerFix = ledgerFix;

// 财务管理--主地址币种
const getAdminWithdrawAccountInfo = function (curPage, success, error) {
    api.get(`api/bm/financialManage/financialStatistics/getAdminWithdrawAccountInfo/10/${curPage}`, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
finance.getAdminWithdrawAccountInfo = getAdminWithdrawAccountInfo;

// 财务管理--用户总资产数据
const findUserAssetList = function (curPage, sortStr, data, success, error) {
    api.get(`/api/bm/financialManage/financialStatistics/findUserAssetList/10/${curPage}/${sortStr}`, data,
        (res) => {
            if (res.rst === 1) {
                success && success(res.data, res.total);
            } else {
                error && error(res.msg);
            }
        }, error);
};
finance.findUserAssetList = findUserAssetList;

// 财务管理--用户充值记录
const findRechargeRecords = function (curPage, sortStr, data, success, error) {
    api.get(`/api/bm/financialManage/financialStatistics/findRechargeRecords/10/${curPage}/${sortStr}`, data,
        (res) => {
            if (res.rst === 1) {
                success && success(res.data, res.total);
            } else {
                error && error(res.msg);
            }
        }, error);
};
finance.findRechargeRecords = findRechargeRecords;

// 财务管理--用户资产
const finduserAccountList = function (data, success, error) {
    api.get(`/api/bm/monitor/userAccount/list`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
finance.finduserAccountList = finduserAccountList;

// 财务管理--USSD充值--账户列表
const findUSDSRechargeRecords = function (data, success, error) {
    api.get(`/api/bm/financialManage/usds/accounts`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
finance.findUSDSRechargeRecords = findUSDSRechargeRecords;

// 财务管理--USDS充值--账户详情
const findUSDSRechargeRecord = function (data, success, error) {
    api.get(`/api/bm/financialManage/usds/account`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
finance.findUSDSRechargeRecord = findUSDSRechargeRecord;

// 财务管理--USDS充值--账户充值
const recordRecharge = function (data, success, error) {
    api.post(`api/bm/financialManage/usds/recharge`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
finance.recordRecharge = recordRecharge;

// 财务管理--USDS管理--银行卡列表
const selectPageUsdsBanks = function (data, success, error) {
    api.get(`api/bm/financialManage/usds/banks`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
finance.selectPageUsdsBanks = selectPageUsdsBanks;

// 财务管理--USDS管理--添加银行卡
const insertUsdsBank = function (data, success, error) {
    api.post(`api/bm/financialManage/usds/bank`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
finance.insertUsdsBank = insertUsdsBank;

// 财务管理--USDS管理--更新银行卡
const updateBank = function (data, success, error) {
    api.put(`api/bm/financialManage/usds/bank`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
finance.updateBank = updateBank;

// 财务管理--SATO数量修改--修改记录
const recordSato = function (data, success, error) {
    api.get(`api/bm/account/transfer/record`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
finance.recordSato = recordSato;

// 财务管理--虚拟充提历史记录
const virtualList = function (data, success, error) {
    api.get(`api/bm/financialManage/virtual/list`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
finance.virtualList = virtualList;

// 财务管理--ussd、sato提现记录
const withdrawsList = function (data, success, error) {
    api.get(`api/bm/account/transfer/withdraws`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
finance.withdrawsList = withdrawsList;

// SATO USSD充值统计
const statisticList = function (data, success, error) {
    api.get(`api/bm/account/transfer/statistics`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
finance.statisticList = statisticList;

// SATO USSD 第三方充值
const outerList = function (data, success, error) {
    api.get(`api/bm/account/transfer/outer`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
finance.outerList = outerList;

// 财务管理--内部转账--列表
const listTransfer = function (data, success, error) {
    api.get(`api/bm/account/transfer/list`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
finance.listTransfer = listTransfer;

// 财务管理--内部转账--添加
const addTransfer = function (data, success, error) {
    api.post(`api/bm/account/transfer`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
finance.addTransfer = addTransfer;

// 财务管理--虚拟充值
const findRecharge = function (data, success, error) {
    api.post(`/api/bm/financialManage/recharge`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
finance.findRecharge = findRecharge;

// 财务管理--虚拟提现
const findWithdraw = function (data, success, error) {
    api.post(`/api/bm/financialManage/withdraw`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
finance.findWithdraw = findWithdraw;

export default finance;
