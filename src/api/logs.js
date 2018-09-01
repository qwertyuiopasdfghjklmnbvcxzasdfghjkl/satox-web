import api from './api'

let logs = {}

// 查询用户操作日志
const findOptLogList = function (curPage, success, error) {
    api.post(`api/bm/sysLog/findOptLogList/10/${curPage}`, (res) => {
      if (res.rst === 1) {
        success && success(res.data, res.total)
      } else {
        error && error(res.msg)
      }
    }, error)
  }
logs.findOptLogList = findOptLogList

  // 查询用户登录日志
const findUserLoginLogList = function (curPage, success, error) {
  api.post(`api/bm/sysLog/findUserLoginLogList/10/${curPage}`, (res) => {
    if (res.rst === 1) {
      success && success(res.data, res.total)
    } else {
      error && error(res.msg)
    }
  }, error)
}
logs.findUserLoginLogList = findUserLoginLogList


export default logs