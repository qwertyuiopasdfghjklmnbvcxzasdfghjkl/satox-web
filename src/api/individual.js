/**
 * 个人中心API接口
 */
import api from '@/api'

let domain = ''
let individual = {}

// 登录之后添加一条登录记录
const addLoginHistory = function () {
  api.get(`${domain}api/v2/individual/addRecentLoginRecord`)
}
individual.addLoginHistory = addLoginHistory

// 获取最近登录记录
const getLoginHistory = function (success, error) {
  api.get(`${domain}api/v2/individual/userRecentlyLogin`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
individual.getLoginHistory = getLoginHistory

// 生成谷歌秘钥
const createGoogleKey = function (success, error) {
  api.get(`${domain}api/v2/individual/googleAuth`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
individual.createGoogleKey = createGoogleKey

// 绑定谷歌验证
const bindGoogleAuth = function (data, success, error) {
  api.post(`${domain}api/v2/individual/binding`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
individual.bindGoogleAuth = bindGoogleAuth

/**
 * 登录谷歌验证
 * @param {*} data { verifyCode: 验证码 }
 * @param {*} success 成功回调函数
 * @param {*} error 失败回调函数
 */
const loginGoogleAuth = function (data, success, error) {
  api.post(`${domain}api/v2/individual/loginVerify`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
individual.loginGoogleAuth = loginGoogleAuth

/**
 * 登录谷歌验证
 * @param {*} data { verifyCode: 验证码, username: 用户名 }
 * @param {*} success 成功回调函数
 * @param {*} error 失败回调函数
 */
const loginTwo = function (data, success, error) {
  api.post(`${domain}api/v2/individual/loginTwo`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.api_token)
    } else {
      error && error(res.msg)
    }
  }, error)
}
individual.loginTwo = loginTwo

/**
 * 登录谷歌验证
 * @param {*} data { verifyCode: 验证码, username: 用户名 }
 * @param {*} success 成功回调函数
 * @param {*} error 失败回调函数
 */
const loginMobileVerify = function (data, success, error) {
  api.post(`${domain}api/v2/individual/loginMobileVerify`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.api_token)
    } else {
      error && error(res.msg)
    }
  }, error)
}
individual.loginMobileVerify = loginMobileVerify

// 解除谷歌验证
const unbindGoogleAuth = function (data, success, error) {
  api.post(`${domain}api/v2/individual/unbind`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
individual.unbindGoogleAuth = unbindGoogleAuth

// 获取分发记录
const getDistributeHistory = function (data, success, error) {
  api.post(`${domain}api/v2/account/showDistribution`, data, (res) => {
    if (res.rst === 1) {
      success && success(res)
    } else {
      error && error(res.msg)
    }
  }, error)
}
individual.getDistributeHistory = getDistributeHistory

// 提交身份认证信息
const submitIdentityInfo = function (data, success, error) {
  api.postForm(`${domain}api/v2/individual/UpVerify`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
individual.submitIdentityInfo = submitIdentityInfo

// 获取国家区域信息
const getAreas = function (success, error) {
  api.get(`${domain}api/v2/individual/country`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
individual.getAreas = getAreas

// 获取用户状态
const getUserState = function (success, error) {
  api.get(`${domain}api/v2/individual/user/individualState`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
individual.getUserState = getUserState

// 使用NEWTON支付交易手续费
const switchNewtonChargeState = function (success, error) {
  api.get(`${domain}api/v2/individual/coinState`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
individual.switchNewtonChargeState = switchNewtonChargeState

// 编辑昵称
const editNickname = function (data, success, error) {
  api.post(`${domain}api/v2/individual/editName`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
individual.editNickname = editNickname

/**
 * 获取所有消息/获取所有未读消息
 * @param {*} data {period:String:显示的时间范围, show:Number:每页显示条目, page:Number:当前页码, {}:参数为空时获取所有未读消息}
 * @param {*} success 成功回调函数
 * @param {*} error 失败回调函数
 */
const getMessages = function (data, success, error) {
  api.post(`${domain}api/v2/individual/msg`, data, (res) => {
    if (res.rst === 1) {
      success && success(res)
    } else {
      error && error(res.msg)
    }
  }, error)
}
individual.getMessages = getMessages

/**
 * 标记单条消息为已读
 * @param {*} data {msg_number:String:消息编号}
 * @param {*} success 成功回调函数
 * @param {*} error 失败回调函数
 */
const markItemRead = function (data, success, error) {
  api.post(`${domain}api/v2/individual/readItemMsg`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
individual.markItemRead = markItemRead

// 标记所有消息为已读
const markAllRead = function (success, error) {
  api.get(`${domain}api/v2/individual/readAllMsg`, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
individual.markAllRead = markAllRead

// 上传头像
const uploadHeader = function (data, success, error) {
  api.postForm(`${domain}api/v2/individual/upload/header`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
individual.uploadHeader = uploadHeader

// 下载自己头像
const downloadHeader = function (success, error) {
  api.get(`${domain}api/v2/individual/download/header`, (res) => {
    if (res.rst === 1) {
      success && success(`${res.url ? res.url + '?' + Date.now() : ''}`)
    } else {
      error && error(res.msg)
    }
  }, error)
}
individual.downloadHeader = downloadHeader

// 下载别人头像
const downloadHeaderOther = function (id, success, error) {
  api.get(`${domain}api/v2/individual/download/header?user_id=${id}`, (res) => {
    if (res.rst === 1) {
      success && success(`${res.url ? res.url + '?' + Date.now() : ''}`)
    } else {
      error && error(res.msg)
    }
  }, error)
}
individual.downloadHeaderOther = downloadHeaderOther

// 绑定手机号
const bindMobile = function (data, success, error) {
  api.post(`${domain}api/v2/individual/bindMobile`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
individual.bindMobile = bindMobile

// 解除手机号
const unbindMobile = function (data, success, error) {
  api.post(`${domain}api/v2/individual/unbindMobile`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
individual.unbindMobile = unbindMobile

// 发送授权短信验证码（6位）
const sendAuthSMSCode = function (data, success, error) {
  api.post(`${domain}api/v2/individual/sendAuthSms`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
individual.sendAuthSMSCode = sendAuthSMSCode

export default individual
