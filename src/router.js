import Main from './views/Main.vue';

export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: resolve => { require(['./views/login.vue'], resolve); }
};

export const page404 = {
    path: '/*',
    name: 'error_404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => { require(['./views/error_page/404.vue'], resolve); }
};

export const page401 = {
    path: '/401',
    meta: {
        title: '401-权限不足'
    },
    name: 'error_401',
    component: resolve => { require(['./views/error_page/401.vue'], resolve); }
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error_500',
    component: resolve => { require(['./views/error_page/500.vue'], resolve); }
};

export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'home', title: '首页', name: 'home_index', component: resolve => { require(['./views/home/home.vue'], resolve); } },
        { path: 'ownspace', title: '修改密码', name: 'ownspace_index', component: resolve => { require(['./views/own-space/own-space.vue'], resolve); } },
        { path: 'message', title: '消息中心', name: 'message_index', component: resolve => { require(['./views/message/message.vue'], resolve); } }
    ]
};

export const preview = {
    path: '/preview',
    name: 'preview',
    component: resolve => { require(['./views/form/article-publish/preview.vue'], resolve); }
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: resolve => { require(['./views/main_components/locking-page.vue'], resolve); }
};

export const kycRouter = [
    {
        path: '/kycauditing',
        name: 'kycauditing',
        title: 'KYC审核',
        component: Main,
        meta:{
            roles: ['ROLE_ADMIN', 'ROLE_KYC_AUDIT', 'ROLE_KYC_RECHECK'],
        },
        children: [
            { path: 'index', title: 'KYC审核', name: 'kycauditing_index', component: resolve => { require(['./views/manage_kyc/auditing.vue'], resolve); } }
        ]
    },
    {
        path: '/kyccheck',
        name: 'kyccheck',
        title: 'KYC复核',
        component: Main,
        meta:{
            roles: ['ROLE_ADMIN', 'ROLE_KYC_RECHECK'],
        },
        children: [
            { path: 'index', title: 'KYC复核', name: 'kyccheck_index', component: resolve => { require(['./views/manage_kyc/check.vue'], resolve); } }
        ]
    },
    {
        path: '/kycmanage',
        name: 'kycmanage',
        title: 'KYC管理',
        component: Main,
        meta:{
            roles: ['ROLE_ADMIN', 'ROLE_KYC_RECHECK'],
        },
        children: [
            { path: 'index', title: 'KYC管理', name: 'kycmanage_index', component: resolve => { require(['./views/manage_kyc/manage.vue'], resolve); } }
        ]
    }
];

export const otcRouter = [
    {
        path: '/otc_data_statistics',
        name: 'otc_data_statistics',
        title: '数据统计',
        component: Main,
        meta:{
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION'],
        },
        children: [
            { path: 'index', title: '数据统计', name: 'otc_data_statistics_index', component: resolve => { require(['./views/manage_otc/data_statistics.vue'], resolve); } }
        ]
    },
    {
        path: '/otc_users',
        name: 'otc_users',
        title: '用户管理',
        component: Main,
        meta:{
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION', 'ROLE_CUSTOMER', 'ROLE_OTC_APPEAL', 'ROLE_OTC_AUDIT'],
        },
        children: [
            { path: 'index', title: '用户管理', name: 'otc_users_index', component: resolve => { require(['./views/manage_otc/users.vue'], resolve); } }
        ]
    },
    {
        path: '/otc_ads',
        name: 'otc_ads',
        title: '广告管理',
        component: Main,
        meta:{
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION', 'ROLE_CUSTOMER', 'ROLE_OTC_APPEAL', 'ROLE_OTC_AUDIT'],
        },
        children: [
            { path: 'index', title: '广告管理', name: 'otc_ads_index', component: resolve => { require(['./views/manage_otc/ads.vue'], resolve); } }
        ]
    },
    {
        path: '/otc_orders',
        name: 'otc_orders',
        title: '订单管理',
        component: Main,
        meta:{
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION', 'ROLE_CUSTOMER', 'ROLE_OTC_APPEAL', 'ROLE_OTC_AUDIT'],
        },
        children: [
            { path: 'index', title: '订单管理', name: 'otc_orders_index', component: resolve => { require(['./views/manage_otc/orders.vue'], resolve); } }
        ]
    },
    {
        path: '/otc_appeals',
        name: 'otc_appeals',
        title: '申诉管理',
        component: Main,
        meta:{
            roles: ['ROLE_ADMIN', 'ROLE_CUSTOMER', 'ROLE_OTC_APPEAL', 'ROLE_OTC_AUDIT'],
        },
        children: [
            { path: 'index', title: '申诉管理', name: 'otc_appeals_index', component: resolve => { require(['./views/manage_otc/appeals.vue'], resolve); } }
        ]
    },
    {
        path: '/otc_auditing',
        name: 'otc_auditing',
        title: '审核管理',
        component: Main,
        meta:{
            roles: ['ROLE_ADMIN', 'ROLE_OTC_AUDIT'],
        },
        children: [
            { path: 'index', title: '审核管理', name: 'otc_auditing_index', component: resolve => { require(['./views/manage_otc/auditing.vue'], resolve); } }
        ]
    }
];

export const exchangeRouter = [
    {
        path: '/exchange_data_statistics',
        name: 'exchange_data_statistics',
        title: '数据统计',
        component: Main,
        meta:{
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION'],
        },
        children: [
            { path: 'index', title: '数据统计', name: 'exchange_data_statistics_index', component: resolve => { require(['./views/manage_exchange/data_statistics.vue'], resolve); } }
        ]
    },
    {
        path: '/exchange_users',
        name: 'exchange_users',
        title: '用户管理',
        component: Main,
        meta:{
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION', 'ROLE_CUSTOMER'],
        },
        children: [
            { path: 'index', title: '用户管理', name: 'exchange_users_index', component: resolve => { require(['./views/manage_exchange/users.vue'], resolve); } }
        ]
    },
    {
        path: '/exchange_coins',
        name: 'exchange_coins', 
        title: '币种管理',
        component: Main,
        meta:{
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION'],
        },
        children: [
            { path: 'index', title: '币种管理', name: 'exchange_coins_index', component: resolve => { require(['./views/manage_exchange/coins.vue'], resolve); } }
        ]
    },
    {
        path: '/exchange_markets',
        name: 'exchange_markets',
        title: '交易市场管理',
        component: Main,
        meta:{
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION'],
        },
        children: [
            { path: 'index', title: '交易市场管理', name: 'exchange_markets_index', component: resolve => { require(['./views/manage_exchange/markets.vue'], resolve); } }
        ]
    },
    // {
    //     path: '/exchange_api',
    //     name: 'exchange_api',
    //     title: '开放API管理',
    //     component: Main,
    //     meta:{
    //         roles: ['ROLE_ADMIN', 'ROLE_OPERATION'],
    //     },
    //     children: [
    //         { path: 'index', title: '开放API管理', name: 'exchange_api_index', component: resolve => { require(['./views/manage_exchange/api.vue'], resolve); } }
    //     ]
    // },
    {
        path: '/exchange_address',
        name: 'exchange_address',
        title: '地址管理',
        component: Main,
        meta:{
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION', 'ROLE_CUSTOMER'],
        },
        children: [
            { path: 'index', title: '地址管理', name: 'exchange_address_index', component: resolve => { require(['./views/manage_exchange/exchange_address.vue'], resolve); } }
        ]
    }
];

export const financeRouter = [
    {
        path: '/finance_finance',
        name: 'finance_finance',
        title: '财务管理',
        component: Main,
        meta:{
            roles: ['ROLE_ADMIN', 'ROLE_FINANCE'],
        },
        children: [
            { path: 'index', title: '财务管理', name: 'finance_finance_index', component: resolve => { require(['./views/manage_finance/finance.vue'], resolve); } }
        ]
    },
    {
        path: '/finance_withdraw',
        name: 'finance_withdraw',
        title: '提币审核',
        component: Main,
        meta:{
            roles: ['ROLE_ADMIN', 'ROLE_FINANCE', 'ROLE_WITHDRAW_AUDIT'],
        },
        children: [
            { path: 'index', title: '提币审核', name: 'finance_withdraw_index', component: resolve => { require(['./views/manage_finance/withdraw.vue'], resolve); } }
        ]
    },
    {
        path: '/account_manage',
        name: 'account_manage',
        title: '平账管理',
        component: Main,
        meta:{
            roles: ['ROLE_ADMIN', 'ROLE_FINANCE', 'ROLE_WITHDRAW_AUDIT'],
        },
        children: [
            { path: 'index', title: '平账管理', name: 'account_manage_index', component: resolve => { require(['./views/manage_finance/account_manage.vue'], resolve); } }
        ]
    }
];

export const riskRouter = [
    {
        path: '/risk_exchange',
        name: 'risk_exchange',
        title: '币币异常预警',
        component: Main,
        meta:{
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION', 'ROLE_FINANCE', 'ROLE_RISK_CONTROL'],
        },
        children: [
            { path: 'index', title: '币币异常预警', name: 'risk_exchange_index', component: resolve => { require(['./views/manage_risk/exchange.vue'], resolve); } }
        ]
    },
    {
        path: '/risk_otc',
        name: 'risk_otc',
        title: 'OTC异常预警',
        component: Main,
        meta:{
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION', 'ROLE_FINANCE', 'ROLE_RISK_CONTROL'],
        },
        children: [
            { path: 'index', title: 'OTC异常预警', name: 'risk_otc_index', component: resolve => { require(['./views/manage_risk/otc.vue'], resolve); } }
        ]
    },
    {
        path: '/risk_urgent',
        name: 'risk_urgent',
        title: '紧急异常预警',
        component: Main,
        meta:{
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION', 'ROLE_FINANCE', 'ROLE_RISK_CONTROL'],
        },
        children: [
            { path: 'index', title: '紧急异常预警', name: 'risk_urgent_index', component: resolve => { require(['./views/manage_risk/urgent.vue'], resolve); } }
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
        title: '分发',
        component: Main,
        meta:{
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION'],
        },
        children: [
            { path: 'index', title: '分发', name: 'operation_distribute_index', component: resolve => { require(['./views/manage_operation/distribute.vue'], resolve); } }
        ]
    },
    // {
    //     path: '/operation_updowncoin',
    //     name: 'operation_updowncoin',
    //     title: '上币/退币',
    //     component: Main,
    //     children: [
    //         { path: 'index', title: '上币/退币', name: 'operation_updowncoin_index', component: resolve => { require(['./views/manage_operation/updowncoin.vue'], resolve); } }
    //     ]
    // },
    {
        path: '/operation_activity',
        name: 'operation_activity',
        title: '推广活动',
        component: Main,
        meta:{
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION'],
        },
        children: [
            { path: 'index', title: '推广活动', name: 'operation_activity_index', component: resolve => { require(['./views/manage_operation/promotion_activities.vue'], resolve); } }
        ]
    },
    {
        path: '/operation_market',
        name: 'operation_market',
        title: '推荐市场',
        component: Main,
        meta:{
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION'],
        },
        children: [
            { path: 'index', title: '推荐市场', name: 'operation_market_index', component: resolve => { require(['./views/manage_operation/operation_market.vue'], resolve); } }
        ]
    },
    {
        path: '/operation_placard',
        name: 'operation_placard',
        title: '公告',
        component: Main,
        meta:{
            roles: ['ROLE_ADMIN', 'ROLE_OPERATION'],
        },
        children: [
            { path: 'index', title: '推荐市场', name: 'operation_placard_index', component: resolve => { require(['./views/manage_operation/operation_placard.vue'], resolve); } }
        ]
    }
];

export const adminRouter = [
    {
        path: '/admin',
        name: 'admin',
        title: '管理员权限管理',
        component: Main,
        meta:{
            roles: ['ROLE_ADMIN'],
        },
        children: [
            { path: 'index', title: '管理员权限管理', name: 'admin_index', component: resolve => { require(['./views/manage_admin/index.vue'], resolve); } }
        ]
    }
];

export const systemConfigRouter = [
    {
        path: '/systemconfig',
        name: 'systemconfig',
        title: '系统参数',
        component: Main,
        meta:{
            roles: ['ROLE_ADMIN'],
        },
        children: [
            { path: 'index', title: '系统参数', name: 'systemconfig_index', component: resolve => { require(['./views/manage_systemconfig/index.vue'], resolve); } }
        ]
    }
];

export const systemLogsRouter = [
    {
        path: '/systemlogs',
        name: 'systemlogs',
        title: '系统日志',
        component: Main,
        meta:{
            roles: ['ROLE_ADMIN'],
        },
        children: [
            { path: 'index', title: '系统日志', name: 'systemlogs_index', component: resolve => { require(['./views/manage_systemlogs/index.vue'], resolve); } }
        ]
    }
];


export const monitoringRouter = [
    {
        path: '/monitoring',
        name: 'monitoring',
        title: '提现失败列表',
        component: Main,
        meta:{
            roles: ['ROLE_DEVELOP'],
        },
        children: [
            { path: 'index', title: '提现失败列表', name: 'monitoring_index', component: resolve => { require(['./views/manage_monitoring/index.vue'], resolve); } }
        ]
    },
    {
        path: '/congestion',
        name: 'congestion',
        title: '提现拥堵列表',
        component: Main,
        meta:{
            roles: ['ROLE_DEVELOP'],
        },
        children: [
            { path: 'congestion_index', title: '提现拥堵列表', name: 'congestion_index', component: resolve => { require(['./views/manage_monitoring/congestion_index.vue'], resolve); } }
        ]
    },
    {
        path: '/withdraw',
        name: 'withdraw',
        title: '提现记录列表',
        component: Main,
        meta:{
            roles: ['ROLE_DEVELOP'],
        },
        children: [
            { path: 'withdraw_index', title: '提现记录列表', name: 'withdraw_index', component: resolve => { require(['./views/manage_monitoring/withdraw_index.vue'], resolve); } }
        ]
    },
    {
        path: '/block',
        name: 'block',
        title: '区块确认列表',
        component: Main,
        meta:{
            roles: ['ROLE_DEVELOP'],
        },
        children: [
            { path: 'block_index', title: '区块确认列表', name: 'block_index', component: resolve => { require(['./views/manage_monitoring/block_index.vue'], resolve); } }
        ]
    },
    {
        path: '/account_msg',
        name: 'account_msg',
        title: '主账户信息',
        component: Main,
        meta:{
            roles: ['ROLE_DEVELOP'],
        },
        children: [
            { path: 'account_msg_index', title: '主账户信息', name: 'account_msg_index', component: resolve => { require(['./views/manage_monitoring/account_msg_index.vue'], resolve); } }
        ]
    },
    {
        path: '/accountInofo',
        name: 'accountInofo',
        title: '用户账户信息',
        component: Main,
        meta:{
            roles: ['ROLE_DEVELOP'],
        },
        children: [
            { path: 'accountInofo_index', title: '用户账户信息', name: 'accountInofo_index', component: resolve => { require(['./views/manage_monitoring/accountInofo_index.vue'], resolve); } }
        ]
    },
    {
        path: '/node_msg',
        name: 'node_msg',
        title: '节点信息',
        component: Main,
        meta:{
            roles: ['ROLE_DEVELOP'],
        },
        children: [
            { path: 'node_msg_index', title: '节点信息', name: 'node_msg_index', component: resolve => { require(['./views/manage_monitoring/node_msg_index.vue'], resolve); } }
        ]
    },
    {
        path: '/error_log',
        name: 'error_log',
        title: '错误日志',
        component: Main,
        meta:{
            roles: ['ROLE_DEVELOP'],
        },
        children: [
            { path: 'error_log_index', title: '错误日志', name: 'error_log_index', component: resolve => { require(['./views/manage_monitoring/error_log_index.vue'], resolve); } }
        ]
    },
];

export const fundRouter = [
    {
        path: '/coldWalletSet',
        name: 'coldWalletSet',
        title: '冷钱包设置',
        component: Main,
        meta:{
            roles: ['ROLE_ADMIN'],
        },
        children: [
            { path: 'coldWalletSet_index', title: '冷钱包设置', name: 'coldWalletSet_index', component: resolve => { require(['./views/manage_fund/coldWalletSet_index.vue'], resolve); } }
        ]
    },
    {
        path: '/addressSet',
        name: 'addressSet',
        title: '主地址转冷钱包设置',
        component: Main,
        meta:{
            roles: ['ROLE_ADMIN'],
        },
        children: [
            { path: 'addressSet_index', title: '主地址转冷钱包设置', name: 'addressSet_index', component: resolve => { require(['./views/manage_fund/addressSet_index.vue'], resolve); } }
        ]
    },
    {
        path: '/transferRecord',
        name: 'transferRecord',
        title: '转账记录',
        component: Main,
        meta:{
            roles: ['ROLE_ADMIN'],
        },
        children: [
            { path: 'transferRecord_index', title: '转账记录', name: 'transferRecord_index', component: resolve => { require(['./views/manage_fund/transferRecord_index.vue'], resolve); } }
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
    ...financeRouter,
    ...riskRouter,
    ...operationRouter,
    ...adminRouter,
    ...systemConfigRouter,
    ...systemLogsRouter,
    ...appRouter,
    ...monitoringRouter,
    ...fundRouter,
    page500,
    page401,
    page404
];
