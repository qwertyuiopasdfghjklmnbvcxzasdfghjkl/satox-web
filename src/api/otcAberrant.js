import api from './api';

let otcAberrant = {};

// otc日常预警
const findOtcAbnormalInfo = function (curPage, data, success, error) {
    api.post(`api/bm/riskManage/otc/findOtcAbnormalInfo/10/${curPage}`, data, (res, total) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error)
};
otcAberrant.findOtcAbnormalInfo = findOtcAbnormalInfo;

// otc日常预警详情
const findOtcOrderInfo = function (data, success, error) {
    api.post(`api/bm/riskManage/otc/findOtcOrderInfo`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error)
};
otcAberrant.findOtcOrderInfo = findOtcOrderInfo;

// otc日常预警处理
const handleAbnormal = function ( data, success, error) {
    api.post(`api/bm/riskManage/otc/handleAbnormal`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error)
};
otcAberrant.handleAbnormal = handleAbnormal;

// otc预警数量情况
const abnormalInfo = function ( data, success, error) {
    api.get(`api/bm/riskManage/otc/abnormalInfo`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error)
};
otcAberrant.abnormalInfo = abnormalInfo;

// 币币预警--大额提币
const getMonitoring = function (curPage, data, success, error) {
    api.post(`api/bm/riskManage/bb/findWithdrawAbnormalInfo/10/${curPage}`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error)
};
otcAberrant.getMonitoring = getMonitoring;

// 币币预警--处理大额提币
const handleMonitoring = function (data, success, error) {
    api.post(`api/bm/riskManage/bb/handleWithdrawAbnormal`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error)
};
otcAberrant.handleMonitoring = handleMonitoring;

// 币币预警--大额充值
const getAbnormalInfo = function (curPage, data, success, error) {
    api.post(`api/bm/riskManage/bb/findRechargeAbnormalInfo/10/${curPage}`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error)
};
otcAberrant.getAbnormalInfo = getAbnormalInfo;

// 币币预警--处理大额充值
const handleRecharge = function (data, success, error) {
    api.post(`api/bm/riskManage/bb/handleRechargeAbnormal`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error)
};
otcAberrant.handleRecharge = handleRecharge;

// 币币预警--交易价格浮动
const getPriceFloat = function (curPage, data, success, error) {
    api.post(`api/bm/riskManage/bb/findPriceFloatAbnormalInfo/10/${curPage}`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error)
};
otcAberrant.getPriceFloat = getPriceFloat;

// 币币预警--交易量浮动
const getTransactionAmountFloat = function (curPage, data, success, error) {
    api.post(`api/bm/riskManage/bb/findTransactionAmountFloatAbnormalInfo/10/${curPage}`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error)
};
otcAberrant.getTransactionAmountFloat = getTransactionAmountFloat;

// 币币预警--处理交易异常
const handleMarketAbnormal = function (data, success, error) {
    api.post(`api/bm/riskManage/bb/handleMarketAbnormal`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error)
};
otcAberrant.handleMarketAbnormal = handleMarketAbnormal;

// 币币预警--日常预警
const abnormalAmountInfo = function (success, error) {
    api.get(`api/bm/riskManage/bb/abnormalAmountInfo`, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error)
};
otcAberrant.abnormalAmountInfo = abnormalAmountInfo;

// 
const findReconciliation = function (curPage, data, success, error) {
    api.post(`api/bm/riskManage/emMonitoring/findReconciliationAbnormalInfo/10/${curPage}`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error)
};
otcAberrant.findReconciliation = findReconciliation;

// 
const handleReconciliationAbnormal = function (data, success, error) {
    api.post(`api/bm/riskManage/emMonitoring/handleReconciliationAbnormal`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error)
};
otcAberrant.handleReconciliationAbnormal = handleReconciliationAbnormal;


// 查询用户异常登录预警
const findAbnormalLoginUserInfo = function (curPage, data, success, error) {
    api.post(`api/bm/riskManage/bb/findAbnormalLoginUserInfo/10/${curPage}`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error)
};
otcAberrant.findAbnormalLoginUserInfo = findAbnormalLoginUserInfo;


// 处理用户异常登录预警
const handleUserLoginAbnormal = function (data, success, error) {
    api.post(`api/bm/riskManage/bb/handleUserLoginAbnormal`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error)
};
otcAberrant.handleUserLoginAbnormal = handleUserLoginAbnormal;

export default otcAberrant;
