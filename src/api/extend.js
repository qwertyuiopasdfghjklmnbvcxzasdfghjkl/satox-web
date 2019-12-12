import api from './api';
import util from '../libs/util';
import Cookies from 'js-cookie';

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

// 分页模糊查询国际化信息列表
const findI18nList = function (data, success, error) {
    api.post(`api/bm/promotionManage/global/queryList`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
extend.findI18nList = findI18nList;

// 新增国际化信息
const addI18nList = function (data, success, error) {
    api.post(`api/bm/promotionManage/global`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
extend.addI18nList = addI18nList;

// 更新国际化信息
const updateI18nList = function (data, success, error) {
    api.put(`api/bm/promotionManage/global`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
extend.updateI18nList = updateI18nList;

// 查询国际化信息详情
const i18nDetail = function (data, success, error) {
    api.get(`api/bm/promotionManage/global`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
extend.i18nDetail = i18nDetail;

// 多语言列表
const getLang = function (data, success, error) {
    api.get(`api/bm/promotionManage/type/list`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
extend.getLang = getLang;

// 更新多语言
const updataLang = function (data, success, error) {
    api.put(`api/bm/promotionManage/type`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
extend.updataLang = updataLang;

// 更新多语言
const addLang = function (data, success, error) {
    api.post(`api/bm/promotionManage/type`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
extend.addLang = addLang;

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

// 进度条上传图片 有进度条的
const upData = function uploadFile (file, uploadProgress, uploadComplete, uploadFailed, uploadCanceled) {
    var formData = new FormData();
    formData.append('androidFile', file);
    var xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', uploadProgress, false);
    xhr.addEventListener('load', uploadComplete, false);
    xhr.addEventListener('error', uploadFailed, false);
    xhr.addEventListener('abort', uploadCanceled, false);

    xhr.open('POST', `${util.baseURL}api/bm/promotionManage/app/update`);
    xhr.setRequestHeader('Authorization', Cookies.get('Authorization'));
    xhr.setRequestHeader('roles', Cookies.get('roles'));

    xhr.send(formData);
};
extend.upData = upData;

// 节点列表
const nodeList = function (data, success, error) {
    api.post(`api/bm/riskManage/node/list`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
extend.nodeList = nodeList;

// 新增节点
const addNode = function (data, success, error) {
    api.post(`api/bm/riskManage/node/add`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
extend.addNode = addNode;

// 更新节点
const updateNode = function (data, success, error) {
    api.put(`api/bm/riskManage/node/update`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
extend.updateNode = updateNode;

// 删除节点
const delNode = function (nodeManageId, success, error) {
    api.delete(`api/bm/riskManage/node/delete/${nodeManageId}`, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
extend.delNode = delNode;

// 市场配置列表
const marketList = function (data, success, error) {
    api.post(`api/bm/riskManage/market/list`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
extend.marketList = marketList;

// 新增市场配置
const addMarket = function (data, success, error) {
    api.post(`api/bm/riskManage/market/add`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
extend.addMarket = addMarket;

// 更新市场配置
const updataMarket = function (data, success, error) {
    api.put(`api/bm/riskManage/market/update`, data, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
extend.updataMarket = updataMarket;

// 删除市场配置
const delMarket = function (marketManageId, success, error) {
    api.delete(`api/bm/riskManage/market/delete/${marketManageId}`, (res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
extend.delMarket = delMarket;

// cms信息列表
const getCms = function (data, success, error) {
    api.post(`api/bm/promotionManage/cms/list`, data,(res) => {
        if (res.rst === 1) {
            success && success(res.data, res.total);
        } else {
            error && error(res.msg);
        }
    }, error);
};
extend.getCms = getCms;

// 新增cms信息
const addCms = function (data, success, error) {
    api.post(`api/bm/promotionManage/cms/add`, data,(res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
extend.addCms = addCms;

// 删除Cms信息
const delCms = function (cmsInfoId, success, error) {
    api.delete(`api/bm/promotionManage/cms/delete${cmsInfoId}`,(res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
extend.delCms = delCms;

// 更新cms信息
const updataCms = function (data, success, error) {
    api.post(`api/bm/promotionManage/cms/update`, data,(res) => {
        if (res.rst === 1) {
            success && success(res.data);
        } else {
            error && error(res.msg);
        }
    }, error);
};
extend.updataCms = updataCms;

export default extend;
