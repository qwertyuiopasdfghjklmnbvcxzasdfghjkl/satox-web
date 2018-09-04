import api from './api'

let kyc = {}

// KYC管理列表
const listPageUserVerifys = function (pageSize, curPage, data, success, error) {
    api.post(`api/bm/kycManage/listPageUserVerifys/${pageSize}/${curPage}`, data, (res) => {
      if (res.rst === 1) {
        success && success(res.data, res.total)
      } else {
        error && error(res.msg)
      }
    }, error)
  }
kyc.listPageUserVerifys = listPageUserVerifys

// KYC重复检查
const duplicationCheck = function (data, success, error) {
  api.post('api/bm/kycManage/duplicationCheck', data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
kyc.duplicationCheck = duplicationCheck

// KYC初审详情
const showFirstReview = function (data, success, error) {
  api.post('api/bm/kycManage/showFirstReview', data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
kyc.showFirstReview = showFirstReview

// KYC审核详情
const showKycDetails = function (data, success, error) {
  api.post(`api/bm/kycManage/showKycDetails`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
kyc.showKycDetails = showKycDetails

// KYC初审提交
const firstReview = function (code, data, success, error) {
  api.post(`api/bm/kycManage/firstReview/${code}`, data, (res) => {
    if (res.rst === 1) {
      success && success(res)
    } else {
      error && error(res.msg)
    }
  }, error)
}
kyc.firstReview = firstReview

// KYC 复核记录
const listPageReCheckVerifys = function (curPage, data, success, error) {
  api.post(`api/bm/kycManage/listPageReCheckVerifys/10/${curPage}`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data, res.total)
    } else {
      error && error(res.msg)
    }
  }, error)
}
kyc.listPageReCheckVerifys = listPageReCheckVerifys

// KYC复审详情
const showSecondReview = function (data, success, error) {
  api.post('api/bm/kycManage/showSecondReview', data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
kyc.showSecondReview = showSecondReview

// KYC复审提交
const secondReview = function (code, data, success, error) {
  api.post(`api/bm/kycManage/secondReview/${code}`, data, (res) => {
    if (res.rst === 1) {
      success && success(res)
    } else {
      error && error(res.msg)
    }
  }, error)
}
kyc.secondReview = secondReview

// KYC管理列表
const selectPageKycVerifys = function (curPage, data, success, error) {
  api.post(`api/bm/kycManage/selectPageKycVerifys/10/${curPage}`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data, res.total)
    } else {
      error && error(res.msg)
    }
  }, error)
}
kyc.selectPageKycVerifys = selectPageKycVerifys

// KYC删除记录
const deleteVerify = function (data, success, error) {
  api.post('api/bm/kycManage/deleteVerify', data, (res) => {
    if (res.rst === 1) {
      success && success(res)
    } else {
      error && error(res.msg)
    }
  }, error)
}
kyc.deleteVerify = deleteVerify

// KYC添加记录
const insertVerify = function (data, success, error) {
  api.post('api/bm/kycManage/insertVerify', data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
kyc.insertVerify = insertVerify

// KYC用户状态统计
const showReviewStatusCount = function (data, success, error) {
  api.post('api/bm/kycManage/showReviewStatusCount', data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
kyc.showReviewStatusCount = showReviewStatusCount

// KYC不通过原因
const listVerifyFailReasons = function (data, success, error) {
  api.get('/api/bm/kycManage/listVerifyFailReasons', data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
kyc.listVerifyFailReasons = listVerifyFailReasons


// KYC详情
// const kycReviewInfo = function (verifyId, success, error) {
//     api.get(`api/v1/manage/kyc/verify/info/${verifyId}`, (res) => {
//       if (res.rst === 1) {
//         success && success(res.data)
//       } else {
//         error && error(res.msg)
//       }
//     }, error)
//   }
// kyc.kycReviewInfo = kycReviewInfo


// KYC删除
// const deleteVerify = function (verifyId, success, error) {
//     api.delete(`api/v1/manage/kyc/verify`, {
//       verify_id: verifyId
//     }, (res) => {
//       if (res.rst === 1) {
//         success && success(res.msg)
//       } else {
//         error && error(res.msg)
//       }
//     }, error)
//   }
// kyc.deleteVerify = deleteVerify


// KYC添加
// const addVerify = function (data, success, error) {
//     api.post(`api/v1/manage/kyc/verify`, data, (res) => {
//       if (res.rst === 1) {
//         success && success(res.msg)
//       } else {
//         error && error(res.msg)
//       }
//     }, error)
//   }
// kyc.addVerify = addVerify

// KYC审核统计
// const kycStatistic = function (success, error) {
//     api.get('api/v1/manage/kyc/statistic ', (res) => {
//       if (res.rst === 1) {
//         success && success(res.data)
//       } else {
//         error && error(res.msg)
//       }
//     }, error)
//   }
// kyc.kycStatistic = kycStatistic


export default kyc