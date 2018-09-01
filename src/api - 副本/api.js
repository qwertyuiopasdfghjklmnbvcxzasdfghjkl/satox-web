import util from '../libs/util';

let api = {};

const get = function (url, data, success, error) {
    if (typeof data === 'function') {
        error = success;
        success = data;
        data = {};
    }
    util.ajax.get(url, {
        params: data
    }).then((res) => {
        if (!res) { return; }
        success && success(res.data);
    }).catch((res) => {
        window.console.warn(res);
        error && error(res.response && res.response.data && res.response.data.length < 500 ? res.response.data : 'Server_Error', res);
    });
};
api.get = get;

const post = function (url, data, success, error) {
    if (typeof data === 'function') {
        error = success;
        success = data;
        data = {};
    }
    util.ajax.post(url, data).then((res) => {
        if (!res) { return; }
        success && success(res.data);
    }).catch((res) => {
        window.console.warn(res);
        error && error(res.response && res.response.data && res.response.data.length < 500 ? res.response.data : 'Server_Error', res);
    });
};
api.post = post;

const del = function (url, data, success, error) {
    if (typeof data === 'function') {
        error = success;
        success = data;
        data = {};
    }
    util.ajax.delete(url, {
        data: data
    }).then((res) => {
        if (!res) { return; }
        success && success(res.data);
    }).catch((res) => {
        window.console.warn(res);
        error && error(res.response && res.response.data && res.response.data.length < 500 ? res.response.data : 'Server_Error', res);
    });
};
api.delete = del;

const put = function (url, data, success, error) {
    if (typeof data === 'function') {
        error = success;
        success = data;
        data = {};
    }
    util.ajax.put(url, data).then((res) => {
        if (!res) { return; }
        success && success(res.data);
    }).catch((res) => {
        window.console.warn(res);
        error && error(res.response && res.response.data && res.response.data.length < 500 ? res.response.data : 'Server_Error', res);
    });
};
api.put = put;

export default api;
