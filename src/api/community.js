import api from './api';

let community = {};

const communityList = function (data, success, error) {
    api.get(`api/bm/community/list`, data, (res) => {
        if (res.rst === 1) {
            success && success(res);
        } else {
            error && error(res.msg);
        }
    }, error)
};
community.communityList = communityList;

const communityAdd = function (data, success, error) {
    api.post(`api/bm/community`, data, (res) => {
        if (res.rst === 1) {
            success && success(res);
        } else {
            error && error(res.msg);
        }
    }, error)
};
community.communityAdd = communityAdd;

const communityModify = function (data, success, error) {
    api.put(`api/bm/community`, data, (res) => {
        if (res.rst === 1) {
            success && success(res);
        } else {
            error && error(res.msg);
        }
    }, error)
};
community.communityModify = communityModify;


export default community;
