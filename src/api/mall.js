import api from './api';

let mall = {
    // 订单列表
    getOrderList (data, success, error) {
        api.get('api/bm/shop/order/list', data, (res) => {
            if (res.rst === 1) {
                success && success(res.data, res.total);
            } else {
                error && error(res.msg);
            }
        }, error);
    },

    // 修改订单
    updataOrder (data, success, error) {
        api.put('api/bm/shop/order', data, (res) => {
            if (res.rst === 1) {
                success && success(res.data, res.total);
            } else {
                error && error(res.msg);
            }
        }, error);
    },

    // 商品列表
    productsList (data, success, error) {
        api.get('api/bm/shop/products/list', data, (res) => {
            if (res.rst === 1) {
                success && success(res.data, res.total);
            } else {
                error && error(res.msg);
            }
        }, error);
    },

    // 修改商品
    updataProducts (data, success, error) {
        api.post('api/bm/shop/products', data, (res) => {
            if (res.rst === 1) {
                success && success(res.data, res.total);
            } else {
                error && error(res.msg);
            }
        }, error);
    },

    // 商品详情
    getProducts (data, success, error) {
        api.get('api/bm/shop/products', data, (res) => {
            if (res.rst === 1) {
                success && success(res.data, res.total);
            } else {
                error && error(res.msg);
            }
        }, error);
    },

    // 新增商品
    addProduct (data, success, error) {
        api.post('api/bm/shop/products', data, (res) => {
            if (res.rst === 1) {
                success && success(res.data, res.total);
            } else {
                error && error(res.msg);
            }
        }, error);
    }
};

export default mall;
