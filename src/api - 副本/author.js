import api from './api'

let author = {}

// 查询管理系统用户
const findBmUserList = function (curPage, success, error) {
    api.post(`api/bm/bmUser/findBmUserList/10/${curPage}`, (res) => {
      if (res.rst === 1) {
        success && success(res.data, res.total)
      } else {
        error && error(res.msg)
      }
    }, error)
  }
author.findBmUserList = findBmUserList

// 添加后台系统用户
const addUser = function (data, success, error) {
    api.post('api/bm/bmUser/addUser', data, (res) => {
      if (res.rst === 1) {
        success && success(res.data)
      } else {
        error && error(res.msg)
      }
    }, error)
  }
author.addUser = addUser

// 查询角色
const findAllRoleList = function (data, success, error) {
  api.post('api/bm/role/findAllRoleList', data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
author.findAllRoleList = findAllRoleList


// 修改用户角色
const updateUserRole = function (data, success, error) {
  api.post('api/bm/bmUser/updateUserRole', data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
author.updateUserRole = updateUserRole

export default author