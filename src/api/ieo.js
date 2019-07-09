/**
 * 商家API接口
 */
import api from '@/api'

let domain = ''
let ieo = {}

// 获取IEO项目列表
const getIEOProjectsList = function (success, error) {
  api.get(`${domain}api/ieo/projects/list`, (res) => {
    if (res.rst === 1) {
      success && success(res.data, res.timestamp)
    } else {
      error && error(res.msg)
    }
  }, error)
}
ieo.getIEOProjectsList = getIEOProjectsList

// 获取IEO详情
const getIEOprojectsDetail = function (id, success, error) {
  api.get(`${domain}api/ieo/projects/detail?projectId=${id}`, (res) => {
    if (res.rst === 1) {
      success && success(res.data, res.timestamp)
    } else {
      error && error(res.msg)
    }
  }, error)
}
ieo.getIEOprojectsDetail = getIEOprojectsDetail

//立即参与预校验
const postProjectsValidate = function (data, success, error) {
  api.post(`${domain}api/ieo/projects/validate`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
ieo.postProjectsValidate = postProjectsValidate

// 确认申购
const postProjectsApply = function (data, success, error) {
  api.post(`${domain}api/ieo/projects`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
ieo.postProjectsApply = postProjectsApply

// 获取用户IEO列表
const getUserIEOProjectsList = function (data, success, error) {
  api.get(`${domain}api/ieo/user/projects`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data, res.total)
    } else {
      error && error(res.msg)
    }
  }, error)
}
ieo.getUserIEOProjectsList = getUserIEOProjectsList


export default ieo
