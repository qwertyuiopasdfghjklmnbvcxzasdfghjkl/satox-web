import api from './api'

let system = {}

// 系统参数查询
const findSysParam = function (success, error) {
    api.post('api/bm/sysParam/findSysParam', (res) => {
      if (res.rst === 1) {
        success && success(res.data)
      } else {
        error && error(res.msg)
      }
    }, error)
  }
  system.findSysParam = findSysParam


// 修改系统参数查询
const saveSysParam = function (data, success, error) {
    api.post('api/bm/sysParam/saveSysParam', data, (res) => {
      if (res.rst === 1) {
        success && success(res.data)
      } else {
        error && error(res.msg)
      }
    }, error)
  }
  system.saveSysParam = saveSysParam

export default system