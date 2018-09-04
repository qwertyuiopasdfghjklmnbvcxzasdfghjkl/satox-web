const config = {
  areaCodeList: [
    {code: '+86', key: 'countrys.China', name: '中国大陆'},
    {code: '+886', key: 'countrys.TW', name: '中国台湾'},
    {code: '+60', key: 'countrys.MY', name: '马来西亚'}
  ],
  areaCodeReg: /^(\+(86|886|60))/
}

export default config