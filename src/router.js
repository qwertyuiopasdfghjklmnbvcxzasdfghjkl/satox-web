import Main from './views/Main.vue';

export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: resolve => {
        require(['./views/login.vue'], resolve);
    }
};

export const page404 = {
    path: '/*',
    name: 'error_404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => {
        require(['./views/error_page/404.vue'], resolve);
    }
};

export const page401 = {
    path: '/401',
    meta: {
        title: '401-权限不足'
    },
    name: 'error_401',
    component: resolve => {
        require(['./views/error_page/401.vue'], resolve);
    }
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error_500',
    component: resolve => {
        require(['./views/error_page/500.vue'], resolve);
    }
};

export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        {
            path: 'home', title: '首页', name: 'home_index', component: resolve => {
                require(['./views/home/home.vue'], resolve);
            }
        },
        {
            path: 'ownspace', title: 'login.xgmm', name: 'ownspace_index', component: resolve => {
                require(['./views/own-space/own-space.vue'], resolve);
            }
        },
        {
            path: 'message', title: '消息中心', name: 'message_index', component: resolve => {
                require(['./views/message/message.vue'], resolve);
            }
        }
    ]
};

export const preview = {
    path: '/preview',
    name: 'preview',
    component: resolve => {
        require(['./views/form/article-publish/preview.vue'], resolve);
    }
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: resolve => {
        require(['./views/main_components/locking-page.vue'], resolve);
    }
};

export const kycRouter = [
    {
        path: '/kycauditing',
        name: 'kycauditing',
        title: 'nav.kycsh',
        component: Main,
        icon: 'briefcase',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_KYC_AUDIT', 'ROLE_KYC_RECHECK'],
        },
        children: [
            {
                path: 'index', title: 'nav.kycsh', name: 'kycauditing_index', component: resolve => {
                    require(['./views/manage_kyc/auditing.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/kyccheck',
        name: 'kyccheck',
        title: 'nav.kycfh',
        component: Main,
        icon: 'folder',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_KYC_RECHECK'],
        },
        children: [
            {
                path: 'index', title: 'nav.kycfh', name: 'kyccheck_index', component: resolve => {
                    require(['./views/manage_kyc/check.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/kycmanage',
        name: 'kycmanage',
        title: 'nav.kycgl',
        component: Main,
        icon: 'clipboard',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_KYC_RECHECK'],
        },
        children: [
            {
                path: 'index', title: 'nav.kycgl', name: 'kycmanage_index', component: resolve => {
                    require(['./views/manage_kyc/manage.vue'], resolve);
                }
            }
        ]
    }
];

export const otcRouter = [
    {
        path: '/otc_data_statistics',
        name: 'otc_data_statistics',
        title: '数据统计',
        component: Main,
        icon: 'arrow-graph-up-right',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION'],
        },
        children: [
            {
                path: 'index', title: '数据统计', name: 'otc_data_statistics_index', component: resolve => {
                    require(['./views/manage_otc/data_statistics.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/otc_merchant_review',
        name: 'otc_merchant_review',
        title: '商家审核',
        component: Main,
        icon: 'lock-combination',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION', 'ROLE_CUSTOMER', 'ROLE_OTC_APPEAL', 'ROLE_OTC_AUDIT'],
        },
        children: [
            {
                path: 'index', title: '商家审核', name: 'otc_merchant_review_index', component: resolve => {
                    require(['./views/manage_otc/merchant_review.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/otc_users',
        name: 'otc_users',
        title: '用户管理',
        component: Main,
        icon: 'person-stalker',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION', 'ROLE_CUSTOMER', 'ROLE_OTC_APPEAL', 'ROLE_OTC_AUDIT'],
        },
        children: [
            {
                path: 'index', title: '用户管理', name: 'otc_users_index', component: resolve => {
                    require(['./views/manage_otc/users.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/otc_ads',
        name: 'otc_ads',
        title: '广告管理',
        component: Main,
        icon: 'chatbox',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION', 'ROLE_CUSTOMER', 'ROLE_OTC_APPEAL', 'ROLE_OTC_AUDIT'],
        },
        children: [
            {
                path: 'index', title: '广告管理', name: 'otc_ads_index', component: resolve => {
                    require(['./views/manage_otc/ads.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/otc_orders',
        name: 'otc_orders',
        title: '订单管理',
        component: Main,
        icon: 'clipboard',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION', 'ROLE_CUSTOMER', 'ROLE_OTC_APPEAL', 'ROLE_OTC_AUDIT'],
        },
        children: [
            {
                path: 'index', title: '订单管理', name: 'otc_orders_index', component: resolve => {
                    require(['./views/manage_otc/orders.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/otc_appeals',
        name: 'otc_appeals',
        title: '申诉管理',
        component: Main,
        icon: 'mic-a',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_CUSTOMER', 'ROLE_OTC_APPEAL', 'ROLE_OTC_AUDIT'],
        },
        children: [
            {
                path: 'index', title: '申诉管理', name: 'otc_appeals_index', component: resolve => {
                    require(['./views/manage_otc/appeals.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/otc_auditing',
        name: 'otc_auditing',
        title: '审核管理',
        component: Main,
        icon: 'ios-cog',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_OTC_AUDIT'],
        },
        children: [
            {
                path: 'index', title: '审核管理', name: 'otc_auditing_index', component: resolve => {
                    require(['./views/manage_otc/auditing.vue'], resolve);
                }
            }
        ]
    }
];

export const communityRouter = [
    {
        path: '/community_users',
        name: 'community_users',
        title: '社区管理',
        component: Main,
        icon: 'ios-cog',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION'],
        },
        children: [
            {
                path: 'index', title: '社区用户管理', name: 'community_users_index', component: resolve => {
                    require(['./views/community/users.vue'], resolve);
                }
            }
        ]
    }
];

export const voteRouter = [
    {
        path: '/vote_data_count',
        name: 'vote_data_count',
        title: '数据统计',
        component: Main,
        icon: 'ios-pie-outline',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION'],
        },
        children: [
            {
                path: 'index', title: '数据统计', name: 'vote_data_count_index', component: resolve => {
                    require(['./views/vote/index.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/vote_miner_query',
        name: 'vote_miner_query',
        title: '用户投票挖矿查询',
        component: Main,
        icon: 'ios-box',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION', 'ROLE_CUSTOMER'],
        },
        children: [
            {
                path: 'index', title: '用户投票挖矿查询', name: 'vote_query_index', component: resolve => {
                    require(['./views/vote/query.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/vote_record',
        name: 'vote_record',
        title: '投票记录',
        component: Main,
        icon: 'ios-copy-outline',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION', 'ROLE_CUSTOMER'],
        },
        children: [
            {
                path: 'index', title: '投票记录', name: 'vote_record_index', component: resolve => {
                    require(['./views/vote/vote.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/vote_miner_dispense',
        name: 'vote_miner_dispense',
        title: '挖矿分发记录',
        component: Main,
        icon: 'ios-list',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION', 'ROLE_CUSTOMER'],
        },
        children: [
            {
                path: 'index', title: '挖矿分发记录', name: 'vote_dispense_index', component: resolve => {
                    require(['./views/vote/dispense.vue'], resolve);
                }
            }
        ]
    },
];

export const exchangeRouter = [
    {
        path: '/exchange_data_statistics',
        name: 'exchange_data_statistics',
        title: 'nav.sjtj',
        component: Main,
        icon: 'ios-timer-outline',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION'],
        },
        children: [
            {
                path: 'index',  title: 'nav.sjtj', name: 'exchange_data_statistics_index', component: resolve => {
                    require(['./views/manage_exchange/data_statistics.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/exchange_users',
        name: 'exchange_users',
        title: 'nav.yhgl',
        component: Main,
        icon: 'person',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION', 'ROLE_CUSTOMER'],
        },
        children: [
            {
                path: 'index', title: 'nav.yhgl', name: 'exchange_users_index', component: resolve => {
                    require(['./views/manage_exchange/users.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/exchange_coins',
        name: 'exchange_coins',
        title: 'nav.bzgl',
        component: Main,
        icon: 'toggle-filled',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION'],
        },
        children: [
            {
                path: 'index', title: 'nav.bzgl', name: 'exchange_coins_index', component: resolve => {
                    require(['./views/manage_exchange/coins.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/exchange_markets',
        name: 'exchange_markets',
        title: 'nav.jyscgl',
        component: Main,
        icon: 'shuffle',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION'],
        },
        children: [
            {
                path: 'index',title: 'nav.jyscgl', name: 'exchange_markets_index', component: resolve => {
                    require(['./views/manage_exchange/markets.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/entrust',
        name: 'entrust',
        title: 'nav.wtgl',
        component: Main,
        icon: 'briefcase',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION'],
        },
        children: [
            { path: 'index', title: 'nav.wtgl', name: 'entrust_index',
                component: resolve => { require(['./views/manage_exchange/entrust.vue'], resolve); } }
        ]
    },
    {
        path: '/exchange_address',
        name: 'exchange_address',
        title: 'nav.dzgl',
        component: Main,
        icon: 'ionic',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION', 'ROLE_CUSTOMER'],
        },
        children: [
            {
                path: 'index', title: 'nav.dzgl', name: 'exchange_address_index', component: resolve => {
                    require(['./views/manage_exchange/exchange_address.vue'], resolve);
                }
            }
        ]
    }
];

export const financeRouter = [
    {
        path: '/finance_finance',
        name: 'finance_finance',
        title: 'nav.cwgl',
        component: Main,
        icon: 'connection-bars',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_FINANCE'],
        },
        children: [
            {
                path: 'index', title: 'nav.cwgl', name: 'finance_finance_index', component: resolve => {
                    require(['./views/manage_finance/finance.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/recharge',
        name: 'recharge',
        title: 'nav.czgl',
        component: Main,
        icon: 'battery-charging',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_FINANCE'],
        },
        children: [
            {
                path: 'index', title: 'nav.czgl', name: 'recharge_index', component: resolve => {
                    require(['./views/manage_finance/recharge.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/thirdparty',
        name: 'thirdparty',
        title: 'nav.dsfczlb',
        component: Main,
        icon: 'android-exit',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_FINANCE'],
        },
        children: [
            {
                path: 'thirdparty_index', title: 'nav.dsfczlb', name: 'thirdparty_index', component: resolve => {
                    require(['./views/manage_finance/thirdparty.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/finance_withdraw',
        name: 'finance_withdraw',
        title: 'nav.tbsh',
        component: Main,
        icon: 'soup-can-outline',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_FINANCE', 'ROLE_WITHDRAW_AUDIT'],
        },
        children: [
            {
                path: 'index', title: 'nav.tbsh', name: 'finance_withdraw_index', component: resolve => {
                    require(['./views/manage_finance/withdraw.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/bank_data',
        name: 'bank_data',
        title: 'nav.ussdyhzl',
        component: Main,
        icon: 'card',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_FINANCE'],
        },
        children: [
            {
                path: 'index', title: 'nav.ussdyhzl', name: 'bank_data_index', component: resolve => {
                    require(['./views/manage_finance/bank_data.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/ussd_list',
        name: 'ussd_list',
        title: 'nav.ussdtxjl',
        component: Main,
        icon: 'document-text',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_FINANCE'],
        },
        children: [
            {
                path: 'index', title: 'nav.ussdtxjl', name: 'ussd_list_index',
                component: resolve => {
                    require(['./views/manage_finance/ussd_list.vue'], resolve);
                }
            }
        ]
    },{
        path: '/sato_list',
        name: 'sato_list',
        title: 'nav.satotxjl',
        component: Main,
        icon: 'shuffle',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_FINANCE'],
        },
        children: [
            {
                path: 'index', title: 'nav.satotxjl', name: 'sato_list_index',
                component: resolve => {
                    require(['./views/manage_finance/sato_list.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/finance_user',
        name: 'finance_user',
        title: 'nav.yhzc',
        component: Main,
        icon: 'pie-graph',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_FINANCE'],
        },
        children: [
            {
                path: 'index', title: 'nav.yhzc', name: 'finance_user_index', component: resolve => {
                    require(['./views/manage_finance/user_finance.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/account_manage',
        name: 'account_manage',
        title: 'nav.pzgl',
        component: Main,
        icon: 'monitor',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_REBALANCE_ACCOUNT'],
        },
        children: [
            {
                path: 'index', title: 'nav.pzgl', name: 'account_manage_index', component: resolve => {
                    require(['./views/manage_finance/account_manage.vue'], resolve);
                }
            },
        ]
    },
    {
        path: '/usds_recharge',
        name: 'usds_recharge',
        title: 'nav.ussdcz',
        component: Main,
        icon: 'radio-waves',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_USSD_RECHARGE'],
        },
        children: [
            {
                path: 'index', title: 'nav.ussdcz', name: 'usds_recharge_index', component: resolve => {
                    require(['./views/manage_finance/usds_recharge.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/internal_transfer',
        name: 'internal_transfer',
        title: 'nav.nbzz',
        component: Main,
        icon: 'ios-loop-strong',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_TRANSFER_ADMIN']
        },
        children: [
            {
                path: 'index', title: 'nav.nbzz', name: 'internal_transfer_index', component: resolve => {
                    require(['./views/manage_finance/internal_transfer.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/change_sato_data',
        name: 'change_sato_data',
        title: 'nav.satoslxg',
        component: Main,
        icon: 'ios-compose',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_SATO_RECHARGE'],
        },
        children: [
            {
                path: 'index', title: 'nav.satoslxg', name: 'change_sato_data_index', component: resolve => {
                    require(['./views/manage_finance/change_sato_data.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/virtual',
        name: 'virtual',
        title: 'nav.xnct',
        component: Main,
        icon: 'arrow-swap',
        meta: {
            roles: ['ROLE_ADMIN'],
        },
        children: [
            {
                path: 'index', title: 'nav.xnct', name: 'virtual_index', component: resolve => {
                    require(['./views/manage_finance/virtual.vue'], resolve);
                }
            }
        ]
    }
];

export const riskRouter = [
    {
        path: '/risk_exchange',
        name: 'risk_exchange',
        title: 'nav.bbycyj',
        component: Main,
        icon: 'ios-alarm',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION', 'ROLE_FINANCE', 'ROLE_RISK_CONTROL'],
        },
        children: [
            {
                path: 'index', title: 'nav.bbycyj', name: 'risk_exchange_index', component: resolve => {
                    require(['./views/manage_risk/exchange.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/risk_otc',
        name: 'risk_otc',
        title: 'nav.tocycyj',
        component: Main,
        icon: 'ios-speedometer',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION', 'ROLE_FINANCE', 'ROLE_RISK_CONTROL'],
        },
        children: [
            {
                path: 'index', title: 'nav.tocycyj', name: 'risk_otc_index', component: resolve => {
                    require(['./views/manage_risk/otc.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/risk_urgent',
        name: 'risk_urgent',
        title: 'nav.jjycyj',
        component: Main,
        icon: 'ios-timer',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION', 'ROLE_FINANCE', 'ROLE_RISK_CONTROL'],
        },
        children: [
            {
                path: 'index', title: 'nav.jjycyj', name: 'risk_urgent_index', component: resolve => {
                    require(['./views/manage_risk/urgent.vue'], resolve);
                }
            }
        ]
    }
    // {
    //     path: '/risk_match',
    //     name: 'risk_match',
    //     title: '撮合异常监控',
    //     component: Main,
    //     children: [
    //         { path: 'index', title: '撮合异常监控', name: 'risk_match_index', component: resolve => { require(['./views/manage_risk/match.vue'], resolve); } }
    //     ]
    // }
];

export const operationRouter = [
    {
        path: '/operation_distribute',
        name: 'operation_distribute',
        title: 'nav.ff',
        component: Main,
        icon: 'ios-paper',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION'],
        },
        children: [
            {
                path: 'index', title: 'nav.ff', name: 'operation_distribute_index', component: resolve => {
                    require(['./views/manage_operation/distribute.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/operation_activity',
        name: 'operation_activity',
        title: 'nav.tghd',
        component: Main,
        icon: 'ios-bell',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION'],
        },
        children: [
            {
                path: 'index', title: 'nav.tghd', name: 'operation_activity_index', component: resolve => {
                    require(['./views/manage_operation/promotion_activities.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/operation_market',
        name: 'operation_market',
        title: 'nav.tjsc',
        icon: 'social-dropbox',
        component: Main,
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION'],
        },
        children: [
            {
                path: 'index', title: 'nav.tjsc', name: 'operation_market_index', component: resolve => {
                    require(['./views/manage_operation/operation_market.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/operation_placard',
        name: 'operation_placard',
        title: 'nav.gg',
        component: Main,
        icon: 'android-clipboard',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION'],
        },
        children: [
            {
                path: 'index', title: 'nav.gg', name: 'operation_placard_index', component: resolve => {
                    require(['./views/manage_operation/operation_placard.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/operation_app',
        name: 'operation_app',
        title: 'nav.appfb',
        component: Main,
        icon: 'social-apple-outline',
        meta: {
            roles: ['ROLE_ADMIN']
        },
        children: [
            {
                path: 'operation_app_index',
                title: 'nav.appfb',
                name: 'operation_app_index',
                component: resolve => {
                    require(['./views/manage_operation/operation_app.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/operation_i18n',
        name: 'operation_i18n',
        title: 'nav.gjhgl',
        component: Main,
        icon: 'ios-world',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION']
        },
        children: [
            {
                path: 'operation_i18n_index',
                title: 'nav.gjhgl',
                name: 'operation_i18n_index',
                component: resolve => {
                    require(['./views/manage_operation/operation_i18n.vue'], resolve);
                }
            }
        ]
    }
];

export const reportRouter = [
    {
        path: '/report',
        name: 'report',
        title: 'nav.dsfdcsj',
        component: Main,
        icon: 'android-archive',
        meta: {
            roles: ['ROLE_ADMIN', 'ROLE_REPORT_MANAGER'],
        },
        children: [
            {
                path: 'report_index', title: 'nav.dsfdcsj', name: 'report_index', component: resolve => {
                    require(['./views/manage_report/export_data.vue'], resolve);
                }
            }
        ]
    }
];

export const adminRouter = [
    {
        path: '/admin',
        name: 'admin',
        title: 'nav.glyqxgl',
        component: Main,
        icon: 'android-settings',
        meta: {
            roles: ['ROLE_ADMIN'],
        },
        children: [
            {
                path: 'index', title: 'nav.glyqxgl', name: 'admin_index', component: resolve => {
                    require(['./views/manage_admin/index.vue'], resolve);
                }
            }
        ]
    }
];

export const systemConfigRouter = [
    {
        path: '/systemconfig',
        name: 'systemconfig',
        title: 'nav.bbjycs',
        component: Main,
        icon: 'android-options',
        meta: {
            roles: ['ROLE_ADMIN'],
        },
        children: [
            {
                path: 'index', title: 'nav.bbjycs', name: 'systemconfig_index', component: resolve => {
                    require(['./views/manage_systemconfig/index.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/system',
        name: 'system',
        title: 'nav.otcjysz',
        component: Main,
        icon: 'ios-cog',
        meta: {
            roles: ['ROLE_ADMIN'],
        },
        children: [
            {
                path: 'otc_index', title: 'nav.otcjysz', name: 'otc_index', component: resolve => {
                    require(['./views/manage_systemconfig/otcTradeSet.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/sys',
        name: 'sys',
        title: 'nav.xtcssz',
        component: Main,
        icon: 'ios-settings-strong',
        meta: {
            roles: ['ROLE_ADMIN'],
        },
        children: [
            {
                path: 'sys_index', title: 'nav.xtcssz', name: 'sys_index', component: resolve => {
                    require(['./views/manage_systemconfig/systemConfig.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/addwithdrawal',
        name: 'addwithdrawal',
        title: 'nav.sxfzhsz',
        component: Main,
        icon: 'ios-toggle',
        meta: {
            roles: ['ROLE_ADMIN'],
        },
        children: [
            {
                path: 'addwithdrawal_index',
                title: 'nav.sxfzhsz',
                name: 'addwithdrawal_index',
                component: resolve => {
                    require(['./views/manage_systemconfig/addWithdrawal.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/addaddress',
        name: 'addaddress',
        title: 'nav.tbzdzsz',
        component: Main,
        icon: 'settings',
        meta: {
            roles: ['ROLE_ADMIN'],
        },
        children: [
            {
                path: 'addaddress_index',
                title: 'nav.tbzdzsz',
                name: 'addaddress_index',
                component: resolve => {
                    require(['./views/manage_systemconfig/addAddress.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/special_account',
        name: 'special_account',
        title: 'nav.tszhgl',
        component: Main,
        icon: 'person',
        meta: {
            roles: ['ROLE_ADMIN'],
        },
        children: [
            {
                path: 'special_account_index',
                title: 'nav.tszhgl',
                name: 'special_account_index',
                component: resolve => {
                    require(['./views/manage_systemconfig/special_account.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/poolwallet',
        name: 'poolwallet',
        title: 'nav.bcqbzlcs',
        component: Main,
        icon: 'ios-bookmarks',
        meta: {
            roles: ['ROLE_ADMIN'],
        },
        children: [
            {
                path: 'poolwallet_index',
                title: 'nav.bcqbzlcs',
                name: 'poolwallet_index',
                component: resolve => {
                    require(['./views/manage_systemconfig/poolWallet.vue'], resolve);
                }
            }
        ]
    }
];

export const systemLogsRouter = [
    {
        path: '/systemlogs',
        name: 'systemlogs',
        title: 'nav.xtrz',
        component: Main,
        icon: 'ios-list',
        meta: {
            roles: ['ROLE_ADMIN'],
        },
        children: [
            {
                path: 'index', title: 'nav.xtrz', name: 'systemlogs_index', component: resolve => {
                    require(['./views/manage_systemlogs/index.vue'], resolve);
                }
            }
        ]
    }
];

export const monitoringRouter = [
    {
        path: '/monitoring',
        name: 'monitoring',
        title: 'nav.txsblb',
        component: Main,
        icon: 'heart-broken',
        meta: {
            roles: ['ROLE_DEVELOP'],
        },
        children: [
            {
                path: 'index', title: 'nav.txsblb', name: 'monitoring_index', component: resolve => {
                    require(['./views/manage_monitoring/index.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/congestion',
        name: 'congestion',
        title: 'nav.txydlb',
        component: Main,
        icon: 'clipboard',
        meta: {
            roles: ['ROLE_DEVELOP'],
        },
        children: [
            {
                path: 'congestion_index', title: 'nav.txydlb', name: 'congestion_index', component: resolve => {
                    require(['./views/manage_monitoring/congestion_index.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/withdraw',
        name: 'withdraw',
        title: 'nav.txjllb',
        component: Main,
        icon: 'ios-paper',
        meta: {
            roles: ['ROLE_DEVELOP'],
        },
        children: [
            {
                path: 'withdraw_index', title: 'nav.txjllb', name: 'withdraw_index', component: resolve => {
                    require(['./views/manage_monitoring/withdraw_index.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/collection',
        name: 'collection',
        title: 'nav.gjjllb',
        component: Main,
        icon: 'arrow-shrink',
        meta: {
            roles: ['ROLE_DEVELOP']
        },
        children: [
            {
                path: 'collection_index',
                title: 'nav.gjjllb',
                name: 'collection_index',
                component: resolve => {
                    require(['./views/manage_monitoring/collection.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/block',
        name: 'block',
        title: 'nav.qkqrlb',
        component: Main,
        icon: 'ios-photos',
        meta: {
            roles: ['ROLE_DEVELOP'],
        },
        children: [
            {
                path: 'block_index', title: 'nav.qkqrlb', name: 'block_index', component: resolve => {
                    require(['./views/manage_monitoring/block_index.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/account_msg',
        name: 'account_msg',
        title: 'nav.zzhxx',
        component: Main,
        icon: 'ios-person',
        meta: {
            roles: ['ROLE_DEVELOP'],
        },
        children: [
            {
                path: 'account_msg_index',  title: 'nav.zzhxx', name: 'account_msg_index', component: resolve => {
                    require(['./views/manage_monitoring/account_msg_index.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/accountInofo',
        name: 'accountInofo',
        title: 'nav.yhzhxx',
        component: Main,
        icon: 'ios-people',
        meta: {
            roles: ['ROLE_DEVELOP'],
        },
        children: [
            {
                path: 'accountInofo_index', title: 'nav.yhzhxx', name: 'accountInofo_index', component: resolve => {
                    require(['./views/manage_monitoring/accountInofo_index.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/userPooledMining',
        name: 'userPooledMining',
        title: 'nav.yhbcxx',
        component: Main,
        icon: 'social-bitcoin',
        meta: {
            roles: ['ROLE_DEVELOP'],
        },
        children: [
            {
                path: 'userPooledMining_index',
                title: 'nav.yhbcxx',
                name: 'userPooledMining_index',
                component: resolve => {
                    require(['./views/manage_monitoring/user_pooled_mining.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/ETHNounce',
        name: 'ETHNounce',
        title: 'nav.enz',
        component: Main,
        icon: 'android-locate',
        meta: {
            roles: ['ROLE_DEVELOP'],
        },
        children: [
            {
                path: 'ETHNounce_index',
                title: 'nav.enz',
                name: 'ETHNounce_index',
                component: resolve => {
                    require(['./views/manage_monitoring/ETHNounce.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/node_msg',
        name: 'node_msg',
        title: 'nav.jdxx',
        component: Main,
        icon: 'network',
        meta: {
            roles: ['ROLE_DEVELOP'],
        },
        children: [
            {
                path: 'node_msg_index', title: 'nav.jdxx', name: 'node_msg_index', component: resolve => {
                    require(['./views/manage_monitoring/node_msg_index.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/error_log',
        name: 'error_log',
        title: 'nav.cwrz',
        component: Main,
        icon: 'bug',
        meta: {
            roles: ['ROLE_DEVELOP'],
        },
        children: [
            {
                path: 'error_log_index', title: 'nav.cwrz', name: 'error_log_index', component: resolve => {
                    require(['./views/manage_monitoring/error_log_index.vue'], resolve);
                }
            }
        ]
    },
];

export const fundRouter = [
    {
        path: '/coldWalletSet',
        name: 'coldWalletSet',
        title: 'nav.lqbsz',
        component: Main,
        icon: 'steam',
        meta: {
            roles: ['ROLE_ADMIN'],
        },
        children: [
            {
                path: 'coldWalletSet_index', title: 'nav.lqbsz', name: 'coldWalletSet_index', component: resolve => {
                    require(['./views/manage_fund/coldWalletSet_index.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/addressSet',
        name: 'addressSet',
        title: 'nav.zdzzlqbsz',
        component: Main,
        icon: 'pull-request',
        meta: {
            roles: ['ROLE_ADMIN'],
        },
        children: [
            {
                path: 'addressSet_index', title: 'nav.zdzzlqbsz', name: 'addressSet_index', component: resolve => {
                    require(['./views/manage_fund/addressSet_index.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/transferRecord',
        name: 'transferRecord',
        title: 'nav.zzjl',
        component: Main,
        icon: 'ios-loop-strong',
        meta: {
            roles: ['ROLE_ADMIN'],
        },
        children: [
            {
                path: 'transferRecord_index', title: 'nav.zzjl', name: 'transferRecord_index', component: resolve => {
                    require(['./views/manage_fund/transferRecord_index.vue'], resolve);
                }
            }
        ]
    }
];

export const appRouter = [
    /*{
        path: '/report',
        name: 'report',
        title: '数据统计',
        component: Main,
        children: [
            { path: 'index', title: '数据统计', name: 'report_index', component: resolve => { require(['./views/report/index.vue'], resolve); } }
        ]
    },
    {
        path: '/usermanagement',
        name: 'usermanagement',
        title: '客户管理',
        component: Main,
        meta: {permission: 1},
        children: [
            { path: 'index', title: '客户管理', meta: {permission: 1}, name: 'usermanagement_index', component: resolve => { require(['./views/account/index.vue'], resolve); } }
        ]
    },
    {
        path: '/coinmanagement',
        name: 'coinmanagement',
        title: '币种管理',
        component: Main,
        meta: {permission: 2},
        children: [
            { path: 'index', title: '币种管理', meta: {permission: 2}, name: 'coinmanagement_index', component: resolve => { require(['./views/coin/index.vue'], resolve); } }
        ]
    },
    {
        path: '/adsmanagement',
        name: 'adsmanagement',
        title: '广告管理',
        component: Main,
        meta: {permission: 3},
        children: [
            { path: 'index', title: '广告管理', meta: {permission: 3}, name: 'adsmanagement_index', component: resolve => { require(['./views/ads/index.vue'], resolve); } }
        ]
    },
    {
        path: '/appealmanagement',
        name: 'appealmanagement',
        title: '申诉管理',
        component: Main,
        meta: {permission: 4},
        children: [
            { path: 'index', title: '申诉管理', meta: {permission: 4}, name: 'appealmanagement_index', component: resolve => { require(['./views/appeal/index.vue'], resolve); } }
        ]
    },
    {
        path: '/adminmanagement',
        name: 'adminmanagement',
        title: '管理员权限管理',
        component: Main,
        meta: {permission: 5},
        children: [
            { path: 'index', title: '管理员权限管理', meta: {permission: 5}, name: 'adminmanagement_index', component: resolve => { require(['./views/admin/index.vue'], resolve); } }
        ]
    },
    {
        path: '/marketmanagement',
        name: 'marketmanagement',
        title: '市场管理',
        component: Main,
        meta: {permission: 6},
        children: [
            { path: 'index', title: '市场管理', meta: {permission: 6}, name: 'marketmanagement_index', component: resolve => { require(['./views/market/index.vue'], resolve); } }
        ]
    }*/
    // {
    //     path: '/access',
    //     redirect: '/access/index',
    //     icon: 'key',
    //     name: 'access',
    //     title: '权限管理',
    //     component: Main,
    //     children: [
    //         { path: 'index', title: '权限管理', name: 'access_index', component: resolve => { require(['./views/access/access.vue'], resolve); } }
    //     ]
    // },
    // {
    //     path: '/access-test',
    //     icon: 'lock-combination',
    //     title: '权限测试页',
    //     name: 'accesstest',
    //     access: 0,
    //     component: Main,
    //     children: [
    //         { path: 'index', title: '权限测试页', name: 'accesstest_index' }
    //     ]
    // },
    //{
    //    path: '/component',
    //    icon: 'social-buffer',
    //    name: 'component',
    //    title: '组件',
    //    component: Main,
    //    children: [
    //         {
    //             path: 'md-editor',
    //             icon: 'pound',
    //             name: 'md-editor',
    //             title: 'Markdown编辑器',
    //             component: resolve => { require(['./views/my_components/markdown-editor/markdown-editor.vue'], resolve); }
    //         },
    //         {
    //             path: 'image-editor',
    //             icon: 'crop',
    //             name: 'image-editor',
    //             title: '图片预览编辑',
    //             component: resolve => { require(['./views/my_components/image-editor/image-editor.vue'], resolve); }
    //         },
    //         {
    //             path: 'draggable-list',
    //             icon: 'arrow-move',
    //             name: 'draggable-list',
    //             title: '可拖拽列表',
    //             component: resolve => { require(['./views/my_components/draggable-list/draggable-list.vue'], resolve); }
    //         },
    //         {
    //             path: 'file-upload',
    //             icon: 'android-upload',
    //             name: 'file-upload',
    //             title: '文件上传',
    //             component: resolve => { require(['./views/my_components/file-upload/file-upload.vue'], resolve); }
    //         },
    //         {
    //             path: 'count-to',
    //             icon: 'arrow-graph-up-right',
    //             name: 'count-to',
    //             title: '数字渐变',
    //             component: resolve => { require(['./views/my_components/count-to/count-to.vue'], resolve); }
    //         }
    //     ]
    // },
    // {
    //     path: '/form',
    //     icon: 'android-checkbox',
    //     name: 'form',
    //     title: '表单编辑',
    //     component: Main,
    //     children: [
    //         { path: 'artical-publish', title: '文章发布', name: 'articalpublish', icon: 'compose', component: resolve => { require(['./views/form/article-publish/article-publish.vue'], resolve); } },
    //         { path: 'workflow', title: '工作流', name: 'workflow', icon: 'arrow-swap', component: resolve => { require(['./views/form/work-flow/work-flow.vue'], resolve); } }

    //     ]
    // },{
    //     path: '/access',
    //     redirect: '/access/index',
    //     icon: 'key',
    //     name: 'access',
    //     title: '权限管理',
    //     component: Main,
    //     children: [
    //         { path: 'index', title: '权限管理', name: 'access_index', component: resolve => { require(['./views/access/access.vue'], resolve); } }
    //     ]
    // },
    // {
    //     path: '/access-test',
    //     icon: 'lock-combination',
    //     title: '权限测试页',
    //     name: 'accesstest',
    //     access: 0,
    //     component: Main,
    //     children: [
    //         { path: 'index', title: '权限测试页', name: 'accesstest_index' }
    //     ]
    // },
    // {
    //     path: '/component',
    //     icon: 'social-buffer',
    //     name: 'component',
    //     title: '组件',
    //     component: Main,
    //     children: [
    //         {
    //             path: 'text-editor',
    //             icon: 'compose',
    //             name: 'text-editor',
    //             title: '富文本编辑器',
    //             component: resolve => { require(['./views/my_components/text-editor/text-editor.vue'], resolve); }
    //         },
    //         {
    //             path: 'md-editor',
    //             icon: 'pound',
    //             name: 'md-editor',
    //             title: 'Markdown编辑器',
    //             component: resolve => { require(['./views/my_components/markdown-editor/markdown-editor.vue'], resolve); }
    //         },
    //         {
    //             path: 'image-editor',
    //             icon: 'crop',
    //             name: 'image-editor',
    //             title: '图片预览编辑',
    //             component: resolve => { require(['./views/my_components/image-editor/image-editor.vue'], resolve); }
    //         },
    //         {
    //             path: 'draggable-list',
    //             icon: 'arrow-move',
    //             name: 'draggable-list',
    //             title: '可拖拽列表',
    //             component: resolve => { require(['./views/my_components/draggable-list/draggable-list.vue'], resolve); }
    //         },
    //         {
    //             path: 'file-upload',
    //             icon: 'android-upload',
    //             name: 'file-upload',
    //             title: '文件上传',
    //             component: resolve => { require(['./views/my_components/file-upload/file-upload.vue'], resolve); }
    //         },
    //         {
    //             path: 'count-to',
    //             icon: 'arrow-graph-up-right',
    //             name: 'count-to',
    //             title: '数字渐变',
    //             component: resolve => { require(['./views/my_components/count-to/count-to.vue'], resolve); }
    //         }
    //     ]
    // },
    // {
    //     path: '/form',
    //     icon: 'android-checkbox',
    //     name: 'form',
    //     title: '表单编辑',
    //     component: Main,
    //     children: [
    //         { path: 'artical-publish', title: '文章发布', name: 'articalpublish', icon: 'compose', component: resolve => { require(['./views/form/article-publish/article-publish.vue'], resolve); } },
    //         { path: 'workflow', title: '工作流', name: 'workflow', icon: 'arrow-swap', component: resolve => { require(['./views/form/work-flow/work-flow.vue'], resolve); } }

    //     ]
    // },
    // {
    //     path: '/charts',
    //     icon: 'ios-analytics',
    //     name: 'charts',
    //     title: '图表',
    //     component: Main,
    //     children: [
    //         { path: 'pie', title: '饼状图', name: 'pie', icon: 'ios-pie', component: resolve => { require('./views/access/access.vue') },
    //         { path: 'histogram', title: '柱状图', name: 'histogram', icon: 'stats-bars', component: resolve => { require('./views/access/access.vue') }

    //     ]
    // },
    // {
    //     path: '/tables',
    //     icon: 'ios-grid-view',
    //     name: 'tables',
    //     title: '表格',
    //     component: Main,
    //     children: [
    //         { path: 'dragableTable', title: '可拖拽排序', name: 'dragableTable', icon: 'arrow-move', component: resolve => { require(['./views/tables/dragable-table.vue'], resolve); } },
    //         { path: 'editableTable', title: '可编辑表格', name: 'editableTable', icon: 'edit', component: resolve => { require(['./views/tables/editable-table.vue'], resolve); } },
    //         { path: 'exportableTable', title: '表格导出数据', name: 'exportableTable', icon: 'code-download', component: resolve => { require(['./views/tables/exportable-table.vue'], resolve); } },
    //         { path: 'table2image', title: '表格转图片', name: 'table2image', icon: 'images', component: resolve => { require(['./views/tables/table-to-image.vue'], resolve); } }
    //     ]
    // },
    // {
    //     path: '/error-page',
    //     icon: 'android-sad',
    //     title: '错误页面',
    //     name: 'errorpage',
    //     component: Main,
    //     children: [
    //         { path: 'index', title: '错误页面', name: 'errorpage_index', component: resolve => { require(['./views/error_page/error-page.vue'], resolve); } }
    //     ]
    // }
];

export const routers = [
    loginRouter,
    otherRouter,
    preview,
    locking,
    ...kycRouter,
    ...otcRouter,
    ...exchangeRouter,
    ...communityRouter,
    ...voteRouter,
    ...financeRouter,
    ...riskRouter,
    ...operationRouter,
    ...adminRouter,
    ...reportRouter,
    ...systemConfigRouter,
    ...systemLogsRouter,
    ...appRouter,
    ...monitoringRouter,
    ...fundRouter,
    page500,
    page401,
    page404
];
