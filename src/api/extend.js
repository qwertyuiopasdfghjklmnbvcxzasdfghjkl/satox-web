import api from './api';

let extend = {};

//创建分发
const createSingleDistribute = function (data, success, error) {
    api.post('api/bm/promotionManage/distribute/createSingleDistribute', data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error)
};
extend.createSingleDistribute = createSingleDistribute;

//进行分发
const distribute = function (distributeId, success, error) {
    api.post(`api/bm/promotionManage/distribute/distribute/${distributeId}`, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error)
};
extend.distribute = distribute;

//取消分发
const cancelDistribute = function (distributeId, success, error) {
    api.post(`api/bm/promotionManage/distribute/cancelDistribute/${distributeId}`, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error)
};
extend.cancelDistribute = cancelDistribute;

//查找分发记录
const findAllDistribute = function (curPage, success, error) {
    api.post(`api/bm/promotionManage/distribute/findAllDistribute/10/${curPage}`, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error)
};
extend.findAllDistribute = findAllDistribute;

//查看所有推广活动
const findAllActivity = function (curPage, data, success, error) {
    api.post(`api/bm/promotionManage/activityManager/findAllActivity/10/${curPage}`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error)
};
extend.findAllActivity = findAllActivity;

// //修改bunnaer图
// const updatePromotionActivity = function ( data, success, error) {
//     api.post(`api/bm/promotionManage/activityManager/updatePromotionActivity`, data, (res) => {
//         if (res.rst === 1) {
//             success && success(res.data);
//         } else {
//             error && error(res.msg);
//         }
//     }, error)
// };
// extend.updatePromotionActivity = updatePromotionActivity;

//查询有效币种
const findSymbolInfo = function (success, error) {
    api.get(`api/bm/promotionManage/distribute/findSymbolInfo`, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error)
};
extend.findSymbolInfo = findSymbolInfo;


//修改bunnaer图
const updatePromotionActivity = function ( data, success, error) {
    api.post(`api/bm/promotionManage/activityManager/updatePromotionActivity`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error)
};
extend.updatePromotionActivity = updatePromotionActivity;

//删除bunnaer图
const deleteBannerPage = function ( data, success, error) {
    api.post(`/api/bm/promotionManage/activityManager/deleteBannerPage`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error)
};
extend.deleteBannerPage = deleteBannerPage;

export default extend;
