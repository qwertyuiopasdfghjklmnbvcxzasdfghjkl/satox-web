import api from './api';

let voteMiner = {};

//数据统计
const statisticsList = function (data, success, error) {
    api.get('api/bm/voteMiner/statistics', data, (res) => {
        if (res.rst === 1) {
            success && success(res);
        } else {
            error && error(res.msg);
        }
    }, error)
};
voteMiner.statisticsList = statisticsList;

//投票挖矿查询
const voteMinerQuery = function (data, success, error) {
    api.get(`api/bm/voteMiner/account`, data, (res) => {
        if (res.rst === 1) {
            success && success(res);
        } else {
            error && error(res.msg);
        }
    }, error)
};
voteMiner.voteMinerQuery = voteMinerQuery;

//投票记录
const voteRecord = function (data, success, error) {
    api.get(`api/bm/voteMiner/vote/record`, data, (res) => {
        if (res.rst === 1) {
            success && success(res);
        } else {
            error && error(res.msg);
        }
    }, error)
};
voteMiner.voteRecord = voteRecord;

//矿池记录
const poolRecord = function (data, success, error) {
    api.get(`api/bm/voteMiner/mining/pool`, data, (res) => {
        if (res.rst === 1) {
            success && success(res);
        } else {
            error && error(res.msg);
        }
    }, error)
};
voteMiner.poolRecord = poolRecord;

//挖矿分发记录
const disRecord = function (data, success, error) {
    api.get(`api/bm/voteMiner/dispense/record`, data, (res) => {
        if (res.rst === 1) {
            success && success(res);
        } else {
            error && error(res.msg);
        }
    }, error)
};
voteMiner.disRecord = disRecord;

export default voteMiner;
