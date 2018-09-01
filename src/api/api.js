import util from '../libs/util';
import Vue from 'vue'
import Cookies from 'js-cookie';

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
        // error && error(res.response && res.response.data && res.response.data.length < 500 ? res.response.data : 'Server_Error', res);
        error && error(res.data && res.data.message ? res.data.message : '服务器错误', res);
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
        if (res.data.status == 200) {
            success && success(res.data)
        } else if (res.data.status == 500) {
            error && error(res.data.error)
        }
    }).catch((res) => {
        if (!res) {
            return
        }
        window.console.warn(res);
        res = res.response
        if (!res) {
            return
        }
        if (res.data && res.data.status === 401) {
            error && error(res.data.message)
            return
        }
        error && error(res.data && res.data.message ? res.data.message : '服务器错误', res);
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
