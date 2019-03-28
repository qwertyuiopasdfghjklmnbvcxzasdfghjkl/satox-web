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
    }, error);
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
    }, error);
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
    }, error);
};
extend.cancelDistribute = cancelDistribute;

//查找分发记录
const findAllDistribute = function (curPage, data, success, error) {
    api.post(`api/bm/promotionManage/distribute/findAllDistribute/10/${curPage}`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
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
    }, error);
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
    }, error);
};
extend.findSymbolInfo = findSymbolInfo;

//修改bunnaer图
const updatePromotionActivity = function (data, success, error) {
    api.post(`api/bm/promotionManage/activityManager/updatePromotionActivity`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
extend.updatePromotionActivity = updatePromotionActivity;

//删除bunnaer图
const deleteBannerPage = function (data, success, error) {
    api.post(`/api/bm/promotionManage/activityManager/deleteBannerPage`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
extend.deleteBannerPage = deleteBannerPage;

// 查询推荐市场
const findSpecialMarket = function (curPage, data, success, error) {
    api.post(`api/bm/promotionManage/specialMarketManager/findSpecialMarket/10/${curPage}`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
extend.findSpecialMarket = findSpecialMarket;

// 修改推荐市场
const updateSpecialMarket = function (data, success, error) {
    api.post(`api/bm/promotionManage/specialMarketManager/updateSpecialMarket`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
extend.updateSpecialMarket = updateSpecialMarket;

// 新增推荐市场
const addSpecialMarket = function (data, success, error) {
    api.post(`api/bm/promotionManage/specialMarketManager/addSpecialMarket`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
extend.addSpecialMarket = addSpecialMarket;

// 取消推荐市场
const cancelSpecialMarket = function (data, success, error) {
    api.post(`api/bm/promotionManage/specialMarketManager/cancelSpecialMarket`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
extend.cancelSpecialMarket = cancelSpecialMarket;

// 新增banner
const addBannerPage = function (data, success, error) {
    api.post(`api/bm/promotionManage/activityManager/addBannerPage`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
extend.addBannerPage = addBannerPage;

//查询公告
const findAllAnnouncement = function (curPage, data, success, error) {
    api.post(`api/bm/promotionManage/announcement/findAllAnnouncement/10/${curPage}`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
extend.findAllAnnouncement = findAllAnnouncement;

//查询详情
const findDetail = function (data, success, error) {
    api.post(`api/bm/promotionManage/announcement/findAllAnnouncement/10/1`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
extend.findDetail = findDetail;

// 新增公告
const addAnnouncement = function (data, success, error) {
    api.post(`/api/bm/promotionManage/announcement/addAnnouncement`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
extend.addAnnouncement = addAnnouncement;

// 删除公告
const deleteAnnouncement = function (data, success, error) {
    api.post(`/api/bm/promotionManage/announcement/deleteAnnouncement`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
extend.deleteAnnouncement = deleteAnnouncement;

// 修改公告
const updateAnnouncement = function (data, success, error) {
    api.post(`/api/bm/promotionManage/announcement/updateAnnouncement`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
extend.updateAnnouncement = updateAnnouncement;

//APP发布列表
const findAppDetail = function (success, error) {
    api.get(`api/bm/promotionManage/app/query`, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
extend.findAppDetail = findAppDetail;

// 更新APP发布
const updataAppDetail = function (data, success, error) {
    api.post(`api/bm/promotionManage/app/update`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
extend.updataAppDetail = updataAppDetail;

export default extend;
