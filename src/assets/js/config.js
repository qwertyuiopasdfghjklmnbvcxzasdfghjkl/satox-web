let config = {
    currencys: [
        {id: 'CNY', name: '人民币'},
        {id: 'TWD', name: '新台幣'},
        {id: 'HKD', name: '港幣'},
        {id: 'USD', name: '美元'}
    ],
    coins: ['BTC', 'ETH', 'EOS', 'BCH', 'ZEC', 'GXS', 'QTUM'],
    payments: [
        {id: 3, name: '微信支付', css: 'wechat icon-wechat', checked: false},
        {id: 2, name: '支付宝支付', css: 'zfb icon-alipay', checked: false},
        {id: 1, name: '银行卡支付', css: 'card icon-bank', checked: false}
    ]
};


export default config;
