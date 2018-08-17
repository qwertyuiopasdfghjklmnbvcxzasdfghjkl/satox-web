/**
 * 国际化语言接口
 */
import api from '@/api'

let language = {}

const getLanguage = function (lang, success, error) {
  api.get(`api/v2/language/${lang}`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
language.getLanguage = getLanguage

export default language
