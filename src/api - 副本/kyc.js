import api from './api'

let kyc = {}

// KYC管理列表
const kycReviewList = function (success, error) {
    api.get('api/v1/manage/kyc/verify/list', (res) => {
      if (res.rst === 1) {
        success && success(res.data)
      } else {
        error && error(res.msg)
      }
    }, error)
  }
kyc.kycReviewList = kycReviewList

// KYC详情
const kycReviewInfo = function (verifyId, success, error) {
    api.get(`api/v1/manage/kyc/verify/info/${verifyId}`, (res) => {
      if (res.rst === 1) {
        success && success(res.data)
      } else {
        error && error(res.msg)
      }
    }, error)
  }
kyc.kycReviewInfo = kycReviewInfo


// KYC删除
const deleteVerify = function (verifyId, success, error) {
    api.delete(`api/v1/manage/kyc/verify`, {
      verify_id: verifyId
    }, (res) => {
      if (res.rst === 1) {
        success && success(res.msg)
      } else {
        error && error(res.msg)
      }
    }, error)
  }
kyc.deleteVerify = deleteVerify


// KYC添加
const addVerify = function (data, success, error) {
    api.post(`api/v1/manage/kyc/verify`, data, (res) => {
      if (res.rst === 1) {
        success && success(res.msg)
      } else {
        error && error(res.msg)
      }
    }, error)
  }
kyc.addVerify = addVerify

// KYC审核统计
const kycStatistic = function (success, error) {
    api.get('api/v1/manage/kyc/statistic ', (res) => {
      if (res.rst === 1) {
        success && success(res.data)
      } else {
        error && error(res.msg)
      }
    }, error)
  }
kyc.kycStatistic = kycStatistic


export default kyc