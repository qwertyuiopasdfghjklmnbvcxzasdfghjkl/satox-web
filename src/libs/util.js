import axios from 'axios';
import env from '../config/env';
import Cookies from 'js-cookie';
import Vue from 'vue';
import store from 'vuex';
// import i18n from '@/i18n/'

let util = {
};
util.title = function (title) {
    title = title || 'iView admin';
    window.document.title = title;
};

const setDialog = function (component, opts) {
    const DialogComponent = Vue.extend(component);
    opts = opts || {};
    var dialogComponent = new DialogComponent({
        store,
        el: document.createElement('div'),
        propsData: opts
    });
    opts.component = dialogComponent;
    dialogComponent.$dialog = Vue.$koallDialog(opts);
    dialogComponent.$on('okCallback', opts.okCallback || function () {});
    dialogComponent.$on('errCallback', opts.errCallback || function () {});
    dialogComponent.$on('removeDialog', dialogComponent.$dialog.removeDialog);
    return dialogComponent;
};
util.setDialog = setDialog;

const ajaxUrl = env === 'production' ? `${location.protocol}//${location.host}/` : 'http://manage.dev.koall.io/';
// const ajaxUrl = env === 'production' ? `${location.protocol}//${location.host}/` : 'http://manage.satox.bitark.io';
// const ajaxUrl = env === 'production' ? `${location.protocol}//${location.host}/` : 'http://manage.sit.satox.net';
// const ajaxUrl = env === 'production' ? `${location.protocol}//${location.host}/` : 'http://10.0.5.244:9009/';

util.baseURL = ajaxUrl;

util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000
});

// 添加请求拦截器
util.ajax.interceptors.request.use(function (config) {
    config.headers.common['Authorization'] = Cookies.get('Authorization');
    config.headers.common['roles'] = Cookies.get('roles');
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
})

let apiTokenExpire = false
// 添加响应拦截器
util.ajax.interceptors.response.use(function (response) {
    // debugger
    if (response && response.data && response.data.status === 500 && response.data.exception === 'io.bitark.exception.TokenInvalidException') {
        // debugger
        // console.log( Cookies.get('Authorization'))
        // 退出登录
        Cookies.remove('username');
        Cookies.remove('password');
        Cookies.remove('hasGreet');
        Cookies.remove('access');
        let language = '';
        if (window.localStorage.language) {
            language = window.localStorage.language;
        }
        window.localStorage.clear();
        if (language) {
            window.localStorage.language = language;
        }
        window.location.reload();
    }
    // 对响应数据做点什么
    return response;
}, function (error) {
    if (error.response && error.response.status === 500 && error.response.data.exception === 'io.bitark.exception.TokenInvalidException') {
        // console.log( Cookies.get('Authorization'))
        // 退出登录
        if (apiTokenExpire) {
            return Promise.reject(error);
        }
        apiTokenExpire = true
        alert(error.response.data.message)
        // this.$Message.error({content: error.response.data.message})
        Cookies.remove('username');
        Cookies.remove('password');
        Cookies.remove('hasGreet');
        Cookies.remove('access');
        let language = '';
        if (window.localStorage.language) {
            language = window.localStorage.language;
        }
        window.localStorage.clear();
        if (language) {
            window.localStorage.language = language;
        }
        window.location.reload();
    }
    // 对响应错误做点什么
    return Promise.reject(error);
});

util.inOf = function (arr, targetArr) {
    let res = true;
    arr.map(item => {
        if (targetArr.indexOf(item) < 0) {
            res = false;
        }
    });
    return res;
};

util.oneOf = function (ele, targetArr) {
    if (typeof ele === 'string') {
        if (targetArr.indexOf(ele) >= 0) {
            return true;
        } else {
            return false;
        }
    }
    for (let i = 0; i < ele.length; i++) {
      if (targetArr.indexOf(ele[i]) >= 0) {
        return true
      }
    }
    return false
};

util.showThisRoute = function (itAccess, currentAccess) {
    return util.oneOf(itAccess, currentAccess);
};

util.getPathObjByName = function (vm, name) {
    let pathObj = vm.$store.state.routers.filter((item) => {
        if (item.children.length <= 1) {
            return item.name === name;
        } else {
            let i = 0;
            let childArr = item.children;
            let len = childArr.length;
            while (i < len) {
                if (childArr[i].name === name) {
                    return true;
                }
                i++;
            }
            return false;
        }
    })[0];
    return pathObj;
};

util.setCurrentPath = function (vm, name) {
    let title = '';
    vm.$store.state.routers.forEach(item => {
        if (item.children.length === 1) {
            if (item.children[0].name === name) {
                title = item.title;
            }
        } else {
            item.children.forEach(child => {
                if (child.name === name) {
                    title = child.title;
                }
            });
        }
    });
    let currentPathArr = [];
    if (name === 'home_index') {
        currentPathArr = [
            {
                title: '首页',
                path: '',
                name: 'home_index'
            }
        ];
    } else if (name.indexOf('_index') >= 0 && name !== 'home_index') {
        currentPathArr = [
            {
                title: '首页',
                path: '/home',
                name: 'home_index'
            },
            {
                title: title,
                path: '',
                name: name
            }
        ];
    } else {
        let currentPathObj = vm.$store.state.routers.filter(item => {
            if (item.children.length <= 1) {
                return item.children[0].name === name;
            } else {
                let i = 0;
                let childArr = item.children;
                let len = childArr.length;
                while (i < len) {
                    if (childArr[i].name === name) {
                        return true;
                    }
                    i++;
                }
                return false;
            }
        })[0];
        if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
            currentPathArr = [
                {
                    title: '首页',
                    path: '',
                    name: 'home_index'
                }
            ];
        } else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
            currentPathArr = [
                {
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: name
                }
            ];
        } else {
            let childObj = currentPathObj.children.filter((child) => {
                return child.name === name;
            })[0];
            currentPathArr = [
                {
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: currentPathObj.name
                },
                {
                    title: childObj.title,
                    path: currentPathObj.path + '/' + childObj.path,
                    name: name
                }
            ];
        }
    }
    vm.$store.commit('setCurrentPath', currentPathArr);

    return currentPathArr;
};

util.openPage = function (vm, name, title) {
    vm.$router.push({
        name: name
    });
    let hasOpened = false;
    vm.pageTagsList.forEach((item, index) => {
        if (item.name === name) {
            hasOpened = true;
            vm.$store.commit('moveToSecond', index);
        }
    });
    if (!hasOpened) {
        vm.$store.commit('increateTag', {name: name, title: title});
    }
};

util.imageScale = function (w, h, p) {
    w -= 4;
    h -= 4;
    let image = new Image();
    image.src = p.url;
    image.onload = function () {
        let width = image.width;
        let height = image.height;
        var scale = Math.max(width / w, height / h);
        p.width = width / scale;
        p.height = height / scale;
    };
};

util.dateToStrDate = function (date, formatStr) {
    formatStr = formatStr || 'yyyy-MM-dd';
    let f = function (m) {
      return m < 10 ? `0${m}` : m
    }
    let str = formatStr.replace('yyyy', date.getFullYear())
    str = str.replace('MM', f(date.getMonth() + 1))
    str = str.replace('dd', f(date.getDate()))
    return str
};

util.dateToStr = function (date, formatStr) {
    formatStr = formatStr || 'yyyy-MM-dd HH:mm:ss';
    let f = function (m) {
      return m < 10 ? `0${m}` : m
    }
    let str = formatStr.replace('yyyy', date.getFullYear())
    str = str.replace('MM', f(date.getMonth() + 1))
    str = str.replace('dd', f(date.getDate()))
    str = str.replace('HH', f(date.getHours()))
    str = str.replace('mm', f(date.getMinutes()))
    str = str.replace('ss', f(date.getSeconds()))
    return str
};

const systemInfos = {
    BUYER:"买家",
    OTC_CANCEL_ORDER:"已经取消了交易订单。",
    OTC_CANCEL_ORDER_BODY:"已经取消了交易订单。",
    OTC_NEW_ORDER:"您的OTC有新的订单，请前往处理。",
    OTC_NEW_ORDER_BODY:"您的OTC有新的订单，请前往处理。",
    OTC_USER_UNFROZEN:"用户已解冻",
    OTC_USER_UNFROZEN_BODY:"您已解冻，可进行新的OTC交易",
    SELLER:"卖家",
    OTC_PAY_FINISH:"已经标记确认付款，请查收。",
    OTC_PAY_FINISH_BODY:"已经标记确认付款，请查收。",
    OTC_RELEASE_SYMBOL:"已确认收款，释放代币，请查收。",
    OTC_RELEASE_SYMBOL_BODY:"已确认收款，释放代币，请查收。",
    OTC_SYSTEM_CANCEL_ORDER:"订单超时未处理，已被自动取消。",
    OTC_SYSTEM_CANCEL_ORDER_BODY:"订单超时未处理，已被自动取消。",
    OTC_USER_FROZEN:"由于您取消了过多的订单，系统已暂停您24小时新的OTC交易。",
    OTC_USER_FROZEN_BODY:"由于您取消了过多的订单，系统已暂停您24小时新的OTC交易。",
    OTC_FROCE_RELEASE_SYMBOL: "已强制放币",
    OTC_FROCE_RELEASE_SYMBOL_BODY: "已强制放币",
    OTC_UNLOCK_ORDER: "已解除锁币",
    OTC_UNLOCK_ORDER_BODY: "已解除锁币" ,
    EXPORT_OTC_FAIL: "导出报表失败",
    EXPORT_OTC_SUCC:"导出报表成功"
}

const formatSystemMessage = function (msg, isI18n) {
    if (isI18n === false) {
      return msg
    }
    msg = (msg || '').split(' ')
    let joinSplit = ' '
    if (msg.length === 1) {
      joinSplit = ''
      msg[0] = systemInfos[msg[0]] || msg[0]
    } else if (msg.length === 2) {
      msg[1] = systemInfos[msg[1]] || msg[1]
    } else if (msg.length === 3) {
      msg[0] = systemInfos[msg[0]] || msg[0]
      msg[2] = systemInfos[msg[2]] || msg[2]
    }
    return msg.join(joinSplit)
  }
util.formatSystemMessage = formatSystemMessage

// 倒计时
const countDown = function (t, callbackFun) {
    var db = function (m) {
      return m < 10 ? '0' + m : m
    }
    function a() {
      t = Math.max(t - 1, 0)
      t <= 0 && clearInterval(interval)
      let m = db(Math.floor(t / 60))
      let s = db(Math.floor(t % 60))
      if (typeof callbackFun === 'function') {
        callbackFun(`${m}:${s}`)
      }
    }
    a()
    let interval = setInterval(a, 1000)
    return interval
  }
util.countDown = countDown


// 转化时间
const formatDate = function (val) {
    let reg = /(\d+)-(\d+)-(\d+)[ |T]?(\d+):(\d+):(\d+)/
    var mts = val.match(reg)
    return new Date(Number(mts[1]), Number(mts[2]) - 1, Number(mts[3]), Number(mts[4]), Number(mts[5]), Number(mts[6]))
}
util.formatDate = formatDate

// 限制上传图片大小，默认2M
const limitUploadImage = function (file, error, size) {
    let limitSize = (size || 2) * 1024 * 1024
    if (file.nodeName !== 'INPUT' && file.name && file.size) {
      if (file.size > limitSize) {
        typeof error === 'function' && error('图片不能超过2M')
        return false
      } else {
        return true
      }
    }
    let files = file.length ? file : file.files
    for (let i = 0; i < files.length; i++) {
      let f = files.item(i)
      if (f.size > limitSize) {
        typeof error === 'function' && error('图片不能超过2M')
        return false
      }
    }
    return true
  }
  util.limitUploadImage = limitUploadImage

const uploadImage = function (e, size) {
    var target = e.target
    if (!target.value) {
      return
    }
    if (/\.(jpg|png|jpeg|bmp|ico)/i.test(target.files.item(0).name) === false) {
      this.$Message.error({content: '只能上传PNG或JPG或JPEG或bmp或ICO格式的图片'})
      target.value = ''
      return
    }
    let isTrue = util.limitUploadImage(target, (msg) => {
      this.$Message.success({content: 'notification'})
    }, size)
    if (!isTrue) {
      target.value = ''
      return
    }
}
util.uploadImage = uploadImage

String.prototype.toMoney = function () {
    let s = this.split('.')
    let s0 = s[0]
    let end = s0.length % 3
    let arr = []
    if (end != 0) {
      arr.push(s0.substring(0, end))
    }
    let count = Math.floor(s0.length / 3)
    if (count > 0) {
      s0 = s0.substring(end)
      do {
        arr.push(s0.substring(0, 3))
        s0 = s0.substring(3)
      } while (s0.length)
    }
    s[0] = arr.join(',')
    return s.join('.')
}

// 获取光标位置
const getCursortPosition = function (dom) {
    var cursorPos = 0
    if (document.selection) {
      // IE Support
      dom.focus()
      var selectRange = document.selection.createRange()
      selectRange.moveStart ('character', -dom.value.length)
      cursorPos = selectRange.text.length;
    }else if (dom.selectionStart || dom.selectionStart == '0') {
      // Firefox support
      cursorPos = dom.selectionStart;
    }
    return cursorPos
  }
util.getCursortPosition = getCursortPosition

  // 设置光标位置
const setCursortPosition = function (dom, pos){
    if(dom.setSelectionRange) {
      // IE Support
      dom.focus()
      dom.setSelectionRange(pos, pos)
    }else if (dom.createTextRange) {
      // Firefox support
      var range = dom.createTextRange()
      range.collapse(true)
      range.moveEnd('character', pos)
      range.moveStart('character', pos)
      range.select()
    }
  }
  util.setCursortPosition = setCursortPosition

export default util;
