import BigNumber from './bignumber.min'

let utils = {}

const BN = function (v) {
  try {
    return new BigNumber((v || 0).toString())
  } catch (ex) {
    return new BigNumber(0)
  }
}
utils.BN = BN

// 加
const add = function (v1, v2) {
  return BN(v1).add(BN(v2))
}
utils.add = add

// 减
const minus = function (v1, v2) {
  return BN(v1).minus(BN(v2))
}
utils.minus = minus

// 乘
const mul = function (v1, v2) {
  return BN(v1).mul(BN(v2))
}
utils.mul = mul

// 除
const div = function (v1, v2) {
  return BN(v1).div(BN(v2))
}
utils.div = div

// 最大值
const max = function (arr) {
  return BigNumber.max.apply(null, arr)
}
utils.max = max

// 最小值
const min = function (arr) {
  return BigNumber.min.apply(null, arr)
}
utils.min = min

export default utils
