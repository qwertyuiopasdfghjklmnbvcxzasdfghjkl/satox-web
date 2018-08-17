import otcApi from '@/api/otc'

let config = {
  symbol: 'ETH',
  adsTypes: [
    {id: 1, key: 'otc_exchange.otc_exchange_buy', name: '购买'},
    {id: 2, key: 'otc_exchange.otc_exchange_sell', name: '出售'}
  ],
  currencys: [],
  coins: [],
  payments: [
    {id: 3, key: 'otc_ad.otc_ad_WeChatPay', name: '微信支付', css: 'wechat icon-wechat', checked: false},
    {id: 2, key: 'otc_ad.otc_ad_Alipay_pay', name: '支付宝支付', css: 'zfb icon-alipay', checked: false},
    {id: 1, key: 'otc_ad.otc_ad_BankPay', name: '银行卡支付', css: 'card icon-bank', checked: false}
  ]
}
otcApi.getCoinsList((res) => {
  res.forEach((item) => {
    config.coins.push(item)
  })
})
otcApi.getCurrencys((res) => {
  res.forEach((item) => {
    config.currencys.push({
      id: item.id,
      name: item.currencyCn,
      value: item.currency,
      text: `otc_exchange.otc_exchange_${item.currency}`,
      minLimit: item.minLimit
    })
  })
})

export default config
