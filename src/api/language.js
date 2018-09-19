/**
 * 国际化语言接口
 */
import api from '@/api'

let domain = ''
let language = {}

const getLanguage = function (lang, success, error) {
  api.get(`${domain}api/v2/language/${lang}?domain=newton`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
language.getLanguage = getLanguage

export default language
