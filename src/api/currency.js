import api from './api';

let curreny = {};

// 更新用户登录冻结状态
const updateUserLoginPermission = function (userId, status, success, error) {
    api.put(`api/bm/bbManage/userManage/updateUserLoginPermission/${userId}/${status}`, (res) => {
        if (res.rst === 1) {
            success && success(res);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.updateUserLoginPermission = updateUserLoginPermission;

// 用户管理列表
const getfindUserList = function (curPage, sortStr, data, success, error) {
    api.post(`api/bm/bbManage/userManage/findUserList/10/${curPage}/${sortStr}`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.getfindUserList = getfindUserList;

// 用户管理--收藏市场
const findUserCollectionMarketList = function (curPage, data, success, error) {
    api.post(`api/bm/bbManage/userManage/findUserCollectionMarketList/10/${curPage}`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.findUserCollectionMarketList = findUserCollectionMarketList;

// 用户管理--消息记录
const findUserMessageList = function (curPage, userId, success, error) {
    api.post(`api/bm/bbManage/userManage/findUserMessageList/10/${curPage}`, {
        userId: userId
    }, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.findUserMessageList = findUserMessageList;

// 用户管理--发送消息
const insertUserMessage = function (userId, msg, success, error) {
    api.post('api/bm/bbManage/userManage/insertUserMessage', {
        userId: userId,
        msg: msg
    }, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.insertUserMessage = insertUserMessage;

// 用户管理--登录记录
const findUserLoginLogList = function (curPage, data, success, error) {
    api.post(`api/bm/bbManage/userManage/findUserLoginLogList/10/${curPage}`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.findUserLoginLogList = findUserLoginLogList;

// 用户管理--当前委托
const findUserCurrentEntrustmentList = function (curPage, userId, success, error) {
    api.post(`api/bm/bbManage/userManage/findUserCurrentEntrustmentList/10/${curPage}`, {
        userId: userId
    }, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.findUserCurrentEntrustmentList = findUserCurrentEntrustmentList;

// 用户管理--历史委托
const findUserHistoricalEntrustmentList = function (curPage, userId, success, error) {
    api.post(`api/bm/bbManage/userManage/findUserHistoricalEntrustmentList/10/${curPage}`, {
        userId: userId
    }, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.findUserHistoricalEntrustmentList = findUserHistoricalEntrustmentList;

// 用户管理--币币交易记录
const findUserExchangeRecordList = function (curPage, userId, success, error) {
    api.post(`api/bm/bbManage/userManage/findUserExchangeRecordList/10/${curPage}`, {
        userId: userId
    }, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.findUserExchangeRecordList = findUserExchangeRecordList;

// 用户管理--当前资产记录
const findUserCurrentAssetsList = function (curPage, userId, success, error) {
    api.post(`api/bm/bbManage/userManage/findUserCurrentAssetsList/10/${curPage}`, {
        userId: userId
    }, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.findUserCurrentAssetsList = findUserCurrentAssetsList;

// 用户管理--充值记录
const findUserRechargeRecordList = function (curPage, userId, success, error) {
    api.post(`api/bm/bbManage/userManage/findUserRechargeRecordList/10/${curPage}`, {
        userId: userId
    }, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.findUserRechargeRecordList = findUserRechargeRecordList;

// 用户管理--提币记录（充值记录）
const findUserWithdrawRecordList = function (curPage, userId, success, error) {
    api.post(`api/bm/bbManage/userManage/findUserWithdrawRecordList/10/${curPage}`, {
        userId: userId
    }, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.findUserWithdrawRecordList = findUserWithdrawRecordList;

// 用户管理--充值地址记录
const findUserRechargeAddrList = function (curPage, userId, success, error) {
    api.post(`api/bm/bbManage/userManage/findUserRechargeAddrList/10/${curPage}`, {
        userId: userId
    }, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.findUserRechargeAddrList = findUserRechargeAddrList;

// 用户管理--提现地址
const findUserWithdrawAddrList = function (curPage, userId, success, error) {
    api.post(`api/bm/bbManage/userManage/findUserWithdrawAddrList/10/${curPage}`, {
        userId: userId
    }, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.findUserWithdrawAddrList = findUserWithdrawAddrList;

// 用户管理--分发记录
const findUserDistributeRecordList = function (curPage, userId, success, error) {
    api.post(`api/bm/bbManage/userManage/findUserDistributeRecordList/10/${curPage}`, {
        userId: userId
    }, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.findUserDistributeRecordList = findUserDistributeRecordList;

// 用户管理--查询账户权限
const findUserPermission = function (userId, success, error) {
    api.post('api/bm/bbManage/userManage/findUserPermission', {
        userId: userId
    }, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.findUserPermission = findUserPermission;

// 用户管理--修改账户权限
const updateUserPermission = function (data, success, error) {
    api.post('api/bm/bbManage/userManage/updateUserPermission', data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.updateUserPermission = updateUserPermission;

// 用户管理--修改记录
const findUserPermissionChangeRecordList = function (curPage, userId, success, error) {
    api.post(`api/bm/bbManage/userManage/findUserPermissionChangeRecordList/10/${curPage}`, {
        userId: userId
    }, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.findUserPermissionChangeRecordList = findUserPermissionChangeRecordList;

// 用户管理--操作日志
const findUserOperateLogList = function (pageSize, curPage, data, success, error) {
    api.post(`api/bm/bbManage/userManage/findUserOperateLogList/${pageSize}/${curPage}`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.findUserOperateLogList = findUserOperateLogList;

// 用户管理--登录记录--注册时间
const findUserInfo = function (userId, success, error) {
    api.get(`api/bm/bbManage/userManage/findUserInfo/${userId}`, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.findUserInfo = findUserInfo;

// 用户管理--用户总资产
const findUserCurrentAssetsByBTC = function (data, success, error) {
    api.post(`api/bm/bbManage/userManage/findUserCurrentAssetsByBTC`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.findUserCurrentAssetsByBTC = findUserCurrentAssetsByBTC;

// 币种管理--查询所有有效币种
const findAllValidSymbolList = function (success, error) {
    api.get(`api/bm/bbManage/symbolManage/findAllValidSymbolList`, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.findAllValidSymbolList = findAllValidSymbolList;

// 币种管理--修改币种充值设置
const updateSymbol = function (data, success, error) {
    api.post('api/bm/bbManage/symbolManage/updateSymbol', data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.updateSymbol = updateSymbol;

// 币种管理--币种详情
const coinFindSymbolInfo = function (data, success, error) {
    api.post(`api/bm/bbManage/symbolManage/findSymbolInfo`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.coinFindSymbolInfo = coinFindSymbolInfo;

// 币种管理--添加币种
const insertSymbol = function (data, success, error) {
    api.post('api/bm/bbManage/symbolManage/insertSymbol', data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.insertSymbol = insertSymbol;

// 币种管理--修改提币设置
const updateSymbolWithdrawFees = function (data, success, error) {
    api.post('api/bm/bbManage/symbolManage/updateSymbolWithdrawFees', data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.updateSymbolWithdrawFees = updateSymbolWithdrawFees;

// 币种管理--市场管理交易信息
const findSymbolExchangeInfoList = function (data, curPage, flag, success, error) {
    api.post(`api/bm/bbManage/symbolManage/findSymbolExchangeInfoList/10/${curPage}/${flag}`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.findSymbolExchangeInfoList = findSymbolExchangeInfoList;

// 币种管理--查询币种
const findSymbolList = function (data, curPage, flag, success, error) {
    api.post(`api/bm/bbManage/symbolManage/findSymbolList/10/${curPage}/${flag}`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.findSymbolList = findSymbolList;

// 币种管理--id查询币种提币设置
const findSymbolWithdrawFees = function (data, success, error) {
    api.post('api/bm/bbManage/symbolManage/findSymbolWithdrawFees', data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.findSymbolWithdrawFees = findSymbolWithdrawFees;

// 数据统计--分页查找财务情况信息
const findFinancialDataList = function (pageSize, curPage, sortStr, data, success, error) {
    api.get(`api/bm/bbManage/DataStatistic/findFinancialDataList/${pageSize}/${curPage}/${sortStr}`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.findFinancialDataList = findFinancialDataList;

// 数据统计--查找风控情况信息
const findRiskDataList = function (success, error) {
    api.get(`api/bm/bbManage/DataStatistic/findRiskDataList`, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.findRiskDataList = findRiskDataList;

// 数据统计--查找用户情况信息
const findUserDataList = function (success, error) {
    api.get(`api/bm/bbManage/DataStatistic/findUserDataList`, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.findUserDataList = findUserDataList;

// 数据统计--分页查找市场交易信息
const findMarketExchangeList = function (curPage, sortStr, success, error) {
    api.get(`api/bm/bbManage/DataStatistic/findMarketExchangeList/3/${curPage}/${sortStr}`, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.findMarketExchangeList = findMarketExchangeList;

// 数据统计--分页查找统计数据
const findStatisticData = function (success, error) {
    api.get(`api/bm/bbManage/DataStatistic/findStatisticData`, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.findStatisticData = findStatisticData;

// 数据统计--查找图表统计
const getfindChartDataList = function (data, success, error) {
    api.post(`api/bm/bbManage/DataStatistic/findChartDataList`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.getfindChartDataList = getfindChartDataList;

// 市场管理--市场交易信息
const findMarketExchangeInfoList = function (curPage, data, success, error) {
    api.post(`api/bm/bbManage/marketManage/findMarketExchangeInfoList/10/${curPage}`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.findMarketExchangeInfoList = findMarketExchangeInfoList;

// 市场管理--查询市场
const findMarketList = function (data, curPage, success, error) {
    api.post(`api/bm/bbManage/marketManage/findMarketList/10/${curPage}`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.findMarketList = findMarketList;

// 交易市场管理--查询所有市场
const findAllMarketList = function ( success, error) {
    api.get(`api/bm/bbManage/marketManage/findAllOnlineMarkets`, {}, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.findAllMarketList = findAllMarketList;

// 市场管理--市场管理新增市场
const insertMarket = function (data, success, error) {
    api.post('api/bm/bbManage/marketManage/insertMarket', data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.insertMarket = insertMarket;

// 市场管理--市场修改
const updateMarket = function (data, success, error) {
    api.post('api/bm/bbManage/marketManage/updateMarket', data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.updateMarket = updateMarket;

// 地址管理
const findUserAccountByAddress = function (data, success, error) {
    api.post('api/bm/bbManage/addressManage/findUserAccountByAddress', data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.findUserAccountByAddress = findUserAccountByAddress;

// 地址管理
const updateIconFile = function (data, success, error) {
    api.post('api/bm/bbManage/symbolManage/updateIconFile', data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.updateIconFile = updateIconFile;

// 邀请活动信息
const findUserInviteInfo = function (data, success, error) {
    api.post('api/bm/bbManage/userManage/findUserInviteInfo', data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.findUserInviteInfo = findUserInviteInfo;

// 查询币币当前委托
const getEntrust = function (data, success, error) {
    api.post('api/bm/bbManage/orderBooks/query', data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.getEntrust = getEntrust;

// 查询币币历史委托
const getHistoryEntrust = function (data, success, error) {
    api.post('api/bm/bbManage/orderBooks/queryHistory', data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.getHistoryEntrust = getHistoryEntrust;

// 交易查询 POST /bbManage/orderBookLogs/query
const getTransaction = function (data, success, error) {
    api.post('api/bm/bbManage/orderBookLogs/query', data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
curreny.getTransaction = getTransaction;

export default curreny;
