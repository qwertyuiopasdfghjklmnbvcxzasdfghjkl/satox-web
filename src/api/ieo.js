import api from './api';

let ieo = {
    // 认购列表
    subscriptionList (data, success, error) {
        api.post(`api/bm/ieoManage/subscription/list`, data, (res) => {
            if (res.rst === 1) {
                success && success(res.data, res.total);
            } else {
                error && error(res.msg);
            }
        }, error);
    },

    // 更新认购状态
    updateSubscription (data, success, error) {
        api.put(`api/bm/ieoManage/subscription/update`, data, (res) => {
            if (res.rst === 1) {
                success && success(res.data);
            } else {
                error && error(res.msg);
            }
        }, error);
    },

    // 新增项目
    addProject (data, success, error) {
        api.post(`api/bm/ieoManage/project/add`, data,
            (res) => {
                if (res.rst === 1) {
                    success && success(res.data);
                } else {
                    error && error(res.msg || res.error);
                }
            }, error);
    },

    // 项目列表
    projectList (data, success, error) {
        api.post(`api/bm/ieoManage/project/list`, data,
            (res) => {
                if (res.rst === 1) {
                    success && success(res.data, res.total);
                } else {
                    error && error(res.msg);
                }
            }, error);
    },

    // 更新项目
    updataProject (data, success, error) {
        api.post(`api/bm/ieoManage/project/update`, data,
            (res) => {
                if (res.rst === 1) {
                    success && success(res.msg);
                } else {
                    error && error(res.msg);
                }
            }, error);
    },

    // 扣款发币
    debit (data, success, error) {
        api.post(`api/bm/ieoManage/project/debit`, data,
            (res) => {
                if (res.rst === 1) {
                    success && success(res.msg);
                } else {
                    error && error(res.msg);
                }
            }, error);
    },

    // 解冻
    unfreeze (data, success, error) {
        api.post(`api/bm/ieoManage/project/unfreeze`, data,
            (res) => {
                if (res.rst === 1) {
                    success && success(res.msg);
                } else {
                    error && error(res.msg);
                }
            }, error);
    }
};
export default ieo;
