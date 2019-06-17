<!-- 顶部菜单 -->
<style lang="less">
    @import './menus.less';

    a {
        color: #fff;
    }
</style>

<template>
    <Menu accordion :active-name="currentPageName" :open-names="openedSubmenuArr" :theme="$store.state.menuTheme">
        <Submenu v-for="(item, index) in filterMenus" :key="item.id" :class="{select:item.id===selected}"
                 :name="index">
            <template slot="title">
                <Icon :type="icon[index]" style="width: 12px"/>
                {{$t(item.name)}}
            </template>
            <MenuItem v-for="(data,i) in item.menus" :name="index+'-'+i" class="menu_left">
                <p @click="readerTo(data)">
                    <Icon :type="data.icon"/>
                    <span>{{$t(data.title)}}</span>
                </p>
            </MenuItem>
        </Submenu>
    </Menu>
</template>

<script>
    import Cookies from 'js-cookie';
    import util from '../libs/util.js';
    import {
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
        fundRouter,
        mallRouter
    } from '../router';
    import breadcrumbNavVue from './main_components/breadcrumbNav.vue';
    import sidebarMenuShrink from './main_components/sidebarMenuShrink.vue';
    import sidebarMenu from './main_components/sidebarMenu.vue';

    export default {
        data () {
            return {
                iconSize: '14',
                currentPageName: null,
                openedSubmenuArr: this.$store.state.openedSubmenuArr,
                hideMenuText: false,
                selected: localStorage.getItem('currentMenu') || 'kyc',
                datas: [
                    {id: 'kyc', path: 'kycauditing_index', name: this.$t('nav.kycsh'), menus: kycRouter},
                    // {id: 'otc', path: 'otc_data_statistics_index', name: 'OTC管理', menus: otcRouter},
                    {id: 'exchange', path: 'exchange_data_statistics_index', name: this.$t('nav.bbgl'), menus: exchangeRouter},
                    // {id: 'community', path: 'community_data_index', name: '社区管理', menus: communityRouter},
                    // {id: 'vote', path: 'vote_data_count_index', name: '投票挖矿管理', menus: voteRouter},
                    {id: 'finance', path: 'finance_finance_index', name: this.$t('nav.cwgl'), menus: financeRouter},
                    {id: 'mall', path: 'mall_index', name: this.$t('nav.scddgl'), menus: mallRouter},
                    {id: 'risk', path: 'risk_exchange_index', name: this.$t('nav.fxkzgl'), menus: riskRouter},
                    {id: 'operation', path: 'operation_distribute_index', name: this.$t('nav.ywtggl'), menus: operationRouter},
                    {name: this.$t('report.tjbbgl'), menus: reportRouter},
                    {id: 'admin', path: 'admin_index', name: this.$t('nav.glyxtqx'), menus: adminRouter},
                    {id: 'systemconfig', path: 'systemconfig_index', name: this.$t('nav.xtcs'), menus: systemConfigRouter},
                    {id: 'systemcogs', path: 'systemlogs_index', name: this.$t('nav.xtrz'), menus: systemLogsRouter},
                    {id: 'monitoring', path: 'monitoring_index', name: this.$t('nav.jkpt'), menus: monitoringRouter},
                    {id: 'fund', path: 'fund_index', name: this.$t('nav.ptzjgl'), menus: fundRouter}
                ],
                icon: ['ios-analytics', 'ios-pie-outline', 'ios-calculator', 'ios-cart', 'ios-pulse', 'ios-settings',
                    'ios-calendar-outline', 'ios-cart', 'ios-clock', 'ios-eye', 'ios-filing-outline',
                    'android-clipboard', 'android-drafts']
            };
        },
        components: {
            sidebarMenuShrink,
            sidebarMenu
        },
        computed: {
            filterMenus () {
                let accessCode = Cookies.get('roles');
                let newMenus = [];
                this.datas.forEach((menu) => {
                    let menuList = [];
                    menu.menus.forEach((item, index) => {
                        let access = item.meta && item.meta.roles;
                        if (access !== undefined) {
                            if (util.showThisRoute(access, accessCode)) {
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
                                        if (util.showThisRoute(access, accessCode)) {
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
                    if (menuList.length) {
                        newMenus.push({
                            id: menu.id,
                            menus: menuList,
                            name: menu.name,
                            path: menu.path,
                        });
                    }
                });
                return newMenus;
            },
            tagsList () {
                return this.$store.state.tagsList;
            },
            menuList () {
                return this.$store.state.menuList;
            },
        },
        watch: {
            selected (newVal) {
                localStorage.setItem('currentMenu', newVal);
            },
            '$route' (to) {
                if (to.name === 'home_index' && this.filterMenus.length) {
                    // this.changeMenu(this.filterMenus[0].menus[0].children[0].name);
                }
            }
        },
        created () {
            let isExist = false;
            for (let i = 0; i < this.filterMenus.length; i++) {
                let data = this.filterMenus[i];
                if (data.id === this.selected) {
                    isExist = true;
                    this.switchMenus(data, false);
                    break;
                }
            }
            if (!isExist && this.filterMenus.length) {
                this.switchMenus(this.filterMenus[0]);
            }
        },
        methods: {

            readerTo (active) {
                let urlName = null;
                urlName = active.children[0].name;
                this.changeMenu(urlName);
            },

            switchMenus (item, notClear) {
                this.selected = item.id;
                this.$store.commit('updateMenulist', item.menus);
                if (notClear === false) {
                    return;
                }
                this.$store.commit('clearTag');
                this.changeMenu(item.menus[0].children[0].name);
            },
            changeMenu (active) {
                if (active !== 'accesstest_index') {
                    let pageOpenedList = this.$store.state.pageOpenedList;
                    let openedPageLen = pageOpenedList.length;
                    let i = 0;
                    let tagHasOpened = false;
                    while (i < openedPageLen) {
                        if (active === pageOpenedList[i].name) {  // 页面已经打开
                            this.$store.commit('moveToSecond', i);
                            tagHasOpened = true;
                            break;
                        }
                        i++;
                    }
                    if (!tagHasOpened) {
                        let tag = this.tagsList.filter((item) => {
                            if (item.children) {
                                return active === item.children[0].name;
                            } else {
                                return active === item.name;
                            }
                        });
                        tag = tag[0];
                        tag = tag.children ? tag.children[0] : tag;
                        this.$store.commit('increateTag', tag);
                        localStorage.pageOpenedList = JSON.stringify(this.$store.state.pageOpenedList); // 本地存储已打开页面
                    }
                    this.$store.commit('setCurrentPageName', active);
                    this.$router.push({
                        name: active
                    });
                }
            }
        }
    };
</script>
