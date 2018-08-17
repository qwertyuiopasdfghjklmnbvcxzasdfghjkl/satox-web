/**
 * 首页API接口
 */
import api from '@/api'
let domain = ``
let bitark = {}

// 获取首页banner币种
const getStatisticalData = function (success, error) {
  api.get(`${domain}api/v2/kline/coinTrend`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
bitark.getStatisticalData = getStatisticalData

export default bitark
