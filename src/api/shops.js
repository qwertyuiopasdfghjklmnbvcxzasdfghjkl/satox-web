import api from './api';

let shops = {};

const shopsList = function (data, success, error) {
    api.post(`api/bm/otcManage/shops/list/${data.size}/${data.page}`, data, (res) => {
        if (res.rst === 1) {
            success && success(res);
        } else {
            error && error(res.msg);
        }
    }, error)
};
shops.shopsList = shopsList;

const shopsUpdate = function (data, success, error) {
    api.post(`api/bm/otcManage/shops/update`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error)
};
shops.shopsUpdate = shopsUpdate;

export default shops;
