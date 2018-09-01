import api from './api';

let otc = {};

/**
 * 广告列表
 * 参数：Oject
 * {
 * ad_type {Number} 广告类型：1：购买 2：出售
 * symbol {String} 币种（BTC、ETH、…）
 * currency {String} 法币（CNY、USD、…）（选传）
 * pay_type {String} 支付方式（选传）（可多选，逗号分隔）1：银行卡 2：支付宝 3：微信
 * sort_mode {Number} 排序模式（选传）1：按价格最低排 2：按信用最高排 3：按价格最高排 默认：按时间排
 * page {Number} 当前请求页码（选传）默认：1
 * show {Number} 每页显示数量（选传）默认：10
 * }
 */
const getAdsList = function (data, success, error) {
    api.post('api/v1/manage/otc/ads/list', data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
otc.getAdsList = getAdsList;

/**
 * 广告详情
 * @param {*} adsId 广告ID
 * @param {*} success 成功回调函数
 * @param {*} error 失败回调函数
 */
const getAdsDetail = function (adsId, success, error) {
    api.get(`api/v1/manage/otc/ads/detail/${adsId}`, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
otc.getAdsDetail = getAdsDetail;

/**
 * 强制下架广告
 * @param {*} adsId 广告ID
 * @param {*} success 成功回调函数
 * @param {*} error 失败回调函数
 */
const downAds = function (adsId, success, error) {
    api.get(`api/v1/manage/otc/ads/down/${adsId}`, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
otc.downAds = downAds;

/**
 * 删除广告
 * @param {*} adsId 广告ID
 * @param {*} success 成功回调函数
 * @param {*} error 失败回调函数
 */
const deleteAds = function (adsId, success, error) {
    api.delete(`api/v1/manage/otc/ads/${adsId}`, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
otc.deleteAds = deleteAds;

/**
 * 订单列表
 * @param {*} data Oject
 * {
 * trade_type {Number} 交易类型（选传）1：购买 2：出售
 * state {Number} 订单状态（选传）1：交易中 2：已完成 3：已取消
 * symbol {String} 币种（BTC、ETH、…）（选传）
 * ad_id {String} 广告ID（选传）
 * page {Number} 当前请求页码（选传）默认：1
 * show {Number} 每页显示数量（选传）默认：10
 * }
 * @param {*} success 成功回调函数
 * @param {*} error 失败回调函数
 */
const getOrdersList = function (data, success, error) {
    api.get('api/v1/manage/otc/orders', data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
otc.getOrdersList = getOrdersList;

/**
 * 订单详情
 * @param {*} orderId 订单ID
 * @param {*} success 成功回调函数
 * @param {*} error 失败回调函数
 */
const getOrderDetail = function (orderId, success, error) {
    api.get(`api/v1/manage/otc/orders/${orderId}`, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
otc.getOrderDetail = getOrderDetail;

/**
 * 提醒放币
 * @param {*} orderId 订单ID
 * @param {*} success 成功回调函数
 * @param {*} error 失败回调函数
 */
const remindReleaseCoin = function (orderId, success, error) {
    api.put(`api/v1/manage/otc/orders/notify/${orderId}`, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
otc.remindReleaseCoin = remindReleaseCoin;

/**
 * 强行放币
 * @param {*} orderId 订单ID
 * @param {*} success 成功回调函数
 * @param {*} error 失败回调函数
 */
const forceReleaseCoin = function (orderId, success, error) {
    api.put(`api/v1/manage/otc/orders/${orderId}`, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
otc.forceReleaseCoin = forceReleaseCoin;

/**
 * 获取订单对应的聊天记录
 * @param {*} orderNumber 订单编号
 * @param {*} success 成功回调函数
 * @param {*} error 失败回调函数
 */
const getChatRecords = function (orderNumber, success, error) {
    api.post('api/v1/manage/otc/chat/get', {
        order_number: orderNumber
    }, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
otc.getChatRecords = getChatRecords;

/**
 * 获取支付方式
 * @param {*} userId 用户ID
 * @param {*} success 成功回调函数
 * @param {*} error 失败回调函数
 */
const getPayTypes = function (userId, success, error) {
    api.post('api/v1/manage/otc/paytypes', {
        user_id: userId
    }, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
otc.getPayTypes = getPayTypes;

/**
 * 获取广告发布者的在线状态
 * @param {*} id 广告ID
 * @param {*} success 成功回调函数
 * @param {*} error 失败回调函数
 */
const getAdsPublisherOnlineState = function (id, success, error) {
    api.get(`api/v1/manage/otc/orders/adUserState/${id}`, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
otc.getAdsPublisherOnlineState = getAdsPublisherOnlineState;

/**
 * 申诉列表
 * @param {*} data { Object }
 * page {Number} 当前请求页码（选传）默认：1
 * show {Number} 每页显示数量（选传）默认：10
 * @param {*} success 成功回调函数
 * @param {*} error 失败回调函数
 */
const getAppealsList = function (data, success, error) {
    api.post('api/v1/manage/otc/appeal/list', data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
otc.getAppealsList = getAppealsList;

/**
 * 申诉详情
 * @param {*} appealId 申诉ID
 * @param {*} success 成功回调函数
 * @param {*} error 失败回调函数
 */
const getAppealDetail = function (appealId, success, error) {
    api.get(`api/v1/manage/otc/appeal/detail/${appealId}`, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
otc.getAppealDetail = getAppealDetail;

export default otc;
