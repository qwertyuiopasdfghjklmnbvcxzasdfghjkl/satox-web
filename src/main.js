import Vue from 'vue';
import VueI18n from 'vue-i18n';
import iView from 'iview';
import VueRouter from 'vue-router';
import {
    routers,
    otherRouter,
    appRouter,
    kycRouter,
    otcRouter,
    exchangeRouter,
    communityRouter,
    voteRouter,
    financeRouter,
    riskRouter,
    operationRouter,
    adminRouter,
    reportRouter,
    systemConfigRouter,
    systemLogsRouter,
    monitoringRouter,
    fundRouter
} from './router';
import Vuex from 'vuex';
import Util from './libs/util';
import App from './app.vue';
import Cookies from 'js-cookie';
import 'iview/dist/styles/iview.css';
import 'vue-directive-image-previewer/dist/assets/style.css';
import './views/components/dialog';


import Locales from 'iview/src/locale';
import zhLocale from 'iview/src/locale/lang/zh-CN';
import enLocale from 'iview/src/locale/lang/en-US';
import VueDirectiveImagePreviewer from 'vue-directive-image-previewer';
// import zh from './locale/lang/zh-CN';
// import en from './locale/lang/en-US';

Vue.use(VueDirectiveImagePreviewer, {
    background: {     // or : background: '#000'
        color: '#000' // or rgba or rgb     // or image: 'url(xxx)'
    },
    // transition
    animate: {
        duration: 600,
        delay: 500
    },
    // loading (not supported)
    loading: {
        image: ''
    },
    zIndex: 9999999,
    // cursor(css)
    cursor: 'pointer'
});
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueI18n);
Vue.use(iView, {
    i18n: function (path, options) {
        let value = i18n.t(path, options);
        if (value !== null && value !== undefined) {
            return value;
        }
        return '';
    }
});
Vue.locale = () => {};

// 自动设置语言
const navLang = navigator.language;
const localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false;
const lang = window.localStorage.getItem('language') || localLang || 'zh-CN';

// Vue.config.lang = lang;

// 多语言配置
// const locales = Locales;
// const mergeZH = Object.assign(zhLocale, locales['zh-CN']);
// const mergeEN = Object.assign(enLocale, locales['en-US']);
// Vue.locale('zh-CN', mergeZH);
// Vue.locale('en-US', mergeEN);

const messages = {
    'en-US': Object.assign(require('./locale/lang/en-US'), enLocale),
    'zh-CN': Object.assign(require('./locale/lang/zh-CN'), zhLocale)
};
const i18n = new VueI18n({
    locale: lang,    // 语言标识, 通过切换locale的值来实现语言切换,this.$i18n.locale
    messages
});

// 路由配置
const RouterConfig = {
    // mode: 'history',
    routes: routers
};

const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    if (Cookies.get('locking') === '1' && to.name !== 'locking') {  // 判断当前是否是锁定状态
        iView.LoadingBar.finish();
        next(false);
        router.replace({
            name: 'locking'
        });
    } else if (Cookies.get('locking') === '0' && to.name === 'locking') {
        iView.LoadingBar.finish();
        next(false);
    } else {
        if (!Cookies.get('username') && to.name !== 'login') {  // 判断是否已经登录且前往的页面不是登录页
            next({
                name: 'login'
            });
        } else if (Cookies.get('username') && to.name === 'login') {  // 判断是否已经登录且前往的是登录页
            next({
                name: 'home'
            });
        } else {
            next();
        }
    }
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

// 状态管理
const store = new Vuex.Store({
    state: {
        routers: [
            otherRouter,
            ...appRouter
        ],
        menuList: [],
        tagsList: [...otherRouter.children],
        pageOpenedList: [],
        currentPageName: '',
        currentPath: [
            {
                title: '首页',
                path: '',
                name: 'home_index'
            }
        ],  // 面包屑数组
        openedSubmenuArr: [],  // 要展开的菜单数组
        menuTheme: '', // 主题
        theme: ''
    },
    getters: {},
    mutations: {
        setTagsList (state, list) {
            state.tagsList.push(...list);
        },
        increateTag (state, tagObj) {
            state.pageOpenedList.splice(2, 0, tagObj);
        },
        removeTag (state, name) {
            state.pageOpenedList.map((item, index) => {
                if (item.name === name) {
                    state.pageOpenedList.splice(index, 1);
                }
            });
        },
        clearTag (state) {
            state.pageOpenedList.splice(1, state.pageOpenedList.length);
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        moveToSecond (state, index) {
            let openedPage = state.pageOpenedList[index];
            state.pageOpenedList.splice(index, 1);
            state.pageOpenedList.splice(index === 1 ? 1 : 2, 0, openedPage);
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        setOpenedList (state) {
            state.pageOpenedList = localStorage.pageOpenedList ? JSON.parse(localStorage.pageOpenedList) : [otherRouter.children[0]];
        },
        setCurrentPath (state, pathArr) {
            state.currentPath = pathArr;
        },
        setCurrentPageName (state, name) {
            state.currentPageName = name;
        },
        addOpenSubmenu (state, name) {
            let hasThisName = false;
            let isEmpty = false;
            if (name.length === 0) {
                isEmpty = true;
            }
            if (state.openedSubmenuArr.indexOf(name) > -1) {
                hasThisName = true;
            }
            if (!hasThisName && !isEmpty) {
                state.openedSubmenuArr.push(name);
            }
        },
        clearOpenedSubmenu (state) {
            state.openedSubmenuArr.length = 0;
        },
        changeMenuTheme (state, theme) {
            state.menuTheme = theme;
        },
        changeMainTheme (state, mainTheme) {
            state.theme = mainTheme;
        },
        lock (state) {
            Cookies.set('locking', '1');
        },
        unlock (state) {
            Cookies.set('locking', '0');
        },
        setMenuList (state, menulist) {
            state.menuList = menulist;
        },
        updateMenulist (state, newMenus) {
            let accessCode = Cookies.get('roles');
            let menuList = [];
            (newMenus || appRouter).forEach((item, index) => {
                let access = item.meta && item.meta.roles;
                if (access !== undefined) {
                    if (Util.showThisRoute(access, accessCode)) {
                        if (item.children.length <= 1) {
                            menuList.push(item);
                        } else {
                            let i = menuList.push(item);
                            let childrenArr = [];
                            childrenArr = item.children.filter(child => {
                                let childAccess = child.meta && child.meta.roles;
                                if (childAccess !== undefined) {
                                    if (childAccess === accessCode) {
                                        return child;
                                    }
                                } else {
                                    return child;
                                }
                            });
                            menuList[i - 1].children = childrenArr;
                        }
                    }
                } else {
                    if (item.children.length <= 1) {
                        menuList.push(item);
                    } else {
                        let i = menuList.push(item);
                        let childrenArr = [];
                        childrenArr = item.children.filter(child => {
                            if (access !== undefined) {
                                if (Util.showThisRoute(access, accessCode)) {
                                    return child;
                                }
                            } else {
                                return child;
                            }
                        });
                        menuList[i - 1].children = childrenArr;
                    }
                }
            });
            state.menuList = menuList;
        },
        setAvator (state, path) {
            localStorage.avatorImgPath = path;
        }
    },
    actions: {}
});

window.vm = new Vue({
    el: '#app',
    i18n: i18n,
    router: router,
    store: store,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    mounted () {
        this.currentPageName = this.$route.name;
    },
    created () {
        let tagsList = [];
        let routers = [];
        routers = routers.concat(appRouter);
        routers = routers.concat(kycRouter);
        routers = routers.concat(otcRouter);
        routers = routers.concat(exchangeRouter);
        routers = routers.concat(communityRouter);
        routers = routers.concat(voteRouter);
        routers = routers.concat(financeRouter);
        routers = routers.concat(riskRouter);
        routers = routers.concat(operationRouter);
        routers = routers.concat(adminRouter);
        routers = routers.concat(reportRouter);
        routers = routers.concat(systemConfigRouter);
        routers = routers.concat(systemLogsRouter);
        routers = routers.concat(monitoringRouter);
        routers = routers.concat(fundRouter);
        routers.map((item) => {
            if (item.children.length <= 1) {
                tagsList.push(item.children[0]);
            } else {
                tagsList.push(...item.children);
            }
        });
        this.$store.commit('setTagsList', tagsList);
    }
});
