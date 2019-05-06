<template>
    <Card>
        <p slot="title">{{$t('system.xtcspz')}}</p>
        <Row style="margin-bottom:10px;border-bottom:1px solid #dddee1;">
            <Col span="6">{{$t('system.xm')}}</Col>
            <Col span="6">{{$t('system.xz')}}</Col>
            <Col span="12">{{$t('common.xg')}}</Col>
        </Row>
        <Row style="margin-bottom:10px;">
            <Col span="6">{{sysItem[0].codeDesc}}</Col>
            <Col span="6">{{sysItem[0].value}}</Col>
            <Col span="12">
                <Input :min="0" style="width:80px;" type="text" v-model="sysItem[0].$value"></Input>
                <Button @click="updataSystem(sysItem[0])" style="margin-left:10px;" type="primary">{{$t('common.xg')}}
                </Button>
            </Col>
        </Row>
        <Row v-for="(data,index) in sysItem" v-if="data.code !== 'siteName'" style="margin-bottom:10px;">
            <Col span="6">{{data.codeDesc}}</Col>
            <Col span="6"><img class="img" :src="base+data.value"/></Col>
            <Col span="8">
                <input name="siteLogo" ref="form" type="file"/>
            </Col>
            <Col span="3">
                <Button @click="updataSystemImg(data.sysParamId, index)" type="primary">{{$t('common.bc')}}</Button>
            </Col>
        </Row>
    </Card>
</template>

<script>
    import system from '../../api/systemparam';
    import curreny from '../../api/currency';
    import util from '../../libs/util';
    import addOrEditFeeAccount from './addOrEditFeeAccount';
    import addOrEditWithdrawalAddress from './addOrEditWithdrawalAddress';
    import addConfig from './addConfig';

    export default {
        data () {
            const xxx = (rule, value, callback) => {
                if (/\.(jpg|png|jpeg|bmp|ico)/i.test(value) === false) {
                    return callback(new Error());
                } else {
                    return callback();
                }
            };
            let self = this;
            const xxx1 = (rule, value, callback) => {
                let isTrue = until.limitUploadImage(self.$refs.iconFile);
                if (!isTrue) {
                    return callback(new Error());
                }
                return callback();
            };
            return {
                siteLogo: '',
                base: util.baseURL,
                sysItem: [
                    {
                        codeDesc: ''
                    }
                ],
                columnsSymbolData: [],
                dataSymbol: [],
                exchangeItem: [],
                item: {
                    kycCount: 0,
                    ipCount: 0,
                    minQuota: 0,
                    otcCoinType: [],
                    version: null
                },
                tempItem: {},
                otcCoinType: [],
                transactionRate: null || 0,
                kycCount: null || 0,
                ipCount: null || 0,
                apiCount: null || 0,
                minQuota: null || 0,
                tradeLimitDays: null || 0,
                entrustDepth: null || 0,
                nicknameUpdateCount: null || 0,
                headUpdateCount: null || 0,
                upPwdLimitTime: null || 0,
                extractQuotaDay: null || 0,
                otcTransactionRate: null || 0,
                overtimeWarningTime: null || 0,
                excessWarningAmount: null || 0,
                adCountLimit: null || 0,
                cancelOrderCountLimit: null || 0,
                priceBasePlatform: null || 0,
                oneAdMaxConcurrency: null || 0,
                userTransactMaxConcurrency: null || 0,
                accountsSymbolParam: null,
                coinPoolsSymbolParam: null,
                accountsData: [],
                coinPoolsData: [],
                accountsPage: {
                    pageSize: 10,
                    currentPage: 1,
                    total: 0
                },
                coinPoolsPage: {
                    pageSize: 10,
                    currentPage: 1,
                    total: 0
                },
            };
        },
        computed: {
            symbolMap () {
                let m = {};
                this.dataSymbol.forEach((item) => {
                    m[item.symbol + '-' + item.symbolType] = item;
                });
                return m;
            }
        },
        watch: {
            accountsPage () {
                this.fnFindAdminAccounts(this.accountsSymbolParam);
            },
            coinPoolsPage () {
                this.fnFindAdminCoinPools(this.coinPoolsSymbolParam);
            }
        },
        created () {
            this.getfindSysParam();
            this.getdataSymbol();
            this.fnFindAdminAccounts();
            this.fnFindAdminCoinPools();
            this.getfindCollectConfig();
        },
        methods: {
            addCion () {
                util.setDialog(addConfig, {
                    okCallback: () => {
                        this.getfindCollectConfig();
                    }
                });
            },
            getfindCollectConfig () {
                system.findCollectConfig(this.curPage, {}, (res, total) => {
                    this.total = total;
                    this.columnsSymbolData = res;
                });
            },
            changePage1 (page) {
                this.curPage = page;
                this.getfindCollectConfig();
            },
            getfindSysParam () {
                system.findSysParam((res) => {
                    res.forEach((d) => {
                        this.item[d.code] = `${d.value || '0'}`;
                        if (d.code === 'otcCoinType') {
                            this.otcCoinType = d.value.split(',');
                        }
                        this.tempItem[d.code] = d;
                        if (d.code === 'otcCoinType') {
                            d.$value = d.value.split(',');
                        } else {
                            d.$value = '';
                        }
                        d.$valu2 = '';
                    });
                    this.exchangeItem = res;
                    this.sysItem = this.exchangeItem.filter(data => {
                        if (data.paramGroup === 3) {
                            return data;
                        }
                    });
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            updataSystem1 (data) {
                let code = data.code;
                let value = data.$value;
                let value2 = data.$value2;
                if (!value || !value2 || (code === 'otcCoinType' && value.length === 0)) {
                    this.$Message.error({content: '请输入内容'});
                    return;
                }
                if (value2 > 60) {
                    this.$Message.error({content: '分钟不能大于60'});
                    return;
                }
                value = code === 'otcCoinType' ? value.join(',') : value;
                system.saveSysParam({
                    value: value,
                    value2: value2,
                    sysParamId: this.tempItem[code].sysParamId,
                    version: this.tempItem[code].version
                }, (res) => {
                    this.getfindSysParam();
                    this.$Message.success({content: '修改成功'});
                    if (code !== 'otcCoinType') {
                        this[code] = '';
                    }
                }, (msg) => {
                    this.$$Message.error({content: msg});
                });
            },
            updataSystem (data) {
                let code = data.code;
                let value = data.$value;
                let nValues = [];
                if (!value || (code === 'otcCoinType' && value.length === 0)) {
                    this.$Message.error({content: '请输入内容'});
                    return;
                } else {
                    if (code === 'otcCoinType') {
                        value.forEach((symbol) => {
                            if (this.symbolMap[symbol]) {
                                nValues.push(symbol);
                            }
                        });
                    }

                }
                value = code === 'otcCoinType' ? nValues.join(',') : value;
                system.saveSysParam({
                    value: value,
                    sysParamId: this.tempItem[code].sysParamId,
                    version: this.tempItem[code].version
                }, (res) => {
                    this.getfindSysParam();
                    this.$Message.success({content: '修改成功'});
                    if (code !== 'otcCoinType') {
                        this[code] = '';
                    }
                }, (msg) => {
                    this.$$Message.error({content: msg});
                });
            },
            getdataSymbol () {
                curreny.findAllValidSymbolList((res) => {
                    this.dataSymbol = res;
                });
            },
            fnFindAdminAccounts (symbolParam) {
                let tempSymbolParam = null;
                if (symbolParam) {
                    tempSymbolParam = {symbol: symbolParam};
                } else {
                    tempSymbolParam = {};
                    this.accountsSymbolParam = null;
                }
                system.findAdminAccounts(this.accountsPage.pageSize, this.accountsPage.currentPage, tempSymbolParam, (data, total) => {
                    this.accountsData = data;
                    this.accountsPage.total = total;
                }, (msg) => {
                    console.error(msg);
                });
            },
            fnFindAdminCoinPools (symbolParam) {
                let tempSymbolParam = null;
                if (symbolParam) {
                    tempSymbolParam = {symbol: symbolParam};
                } else {
                    tempSymbolParam = {};
                    this.coinPoolsSymbolParam = null;
                }
                system.findAdminCoinPools(this.coinPoolsPage.pageSize, this.coinPoolsPage.currentPage, tempSymbolParam, (data, total) => {
                    this.coinPoolsData = data;
                    this.coinPoolsPage.total = total;
                }, (msg) => {
                    console.error(msg);
                });
            },
            addOrEditFeeAccountDialog () {
                util.setDialog(addOrEditFeeAccount, {
                    isEdit: false,
                    okCallback: () => {
                        this.fnFindAdminAccounts();
                    }
                });
            },
            addOrEditWithdrawalAddressDialog () {
                util.setDialog(addOrEditWithdrawalAddress, {
                    isEdit: false,
                    okCallback: () => {
                        this.fnFindAdminCoinPools();
                    }
                });
            },
            changePage (page, flag) {
                if (flag === 1) {
                    this.accountsPage.currentPage = page;
                    this.fnFindAdminAccounts();
                } else if (flag === 2) {
                    this.coinPoolsPage.currentPage = page;
                    this.fnFindAdminCoinPools();
                } else {
                    return false;
                }
            },
            iconValidator (d, e) {
                d.file = e.target.value;
            },
            updataSystemImg (d, i) {
                var formData = new FormData();
                if (d == 106) {
                    formData.append('file', this.$refs.form[1].files[0]);
                    if (/\.(jpg|png|jpeg|bmp|ico)/i.test(this.$refs.form[1].files[0].name) === false) {
                        this.$Message.error({content: this.$t('kyc.znscpnghjpeghbmpdtp')});
                        return;
                    }
                } else {
                    formData.append('file', this.$refs.form[0].files[0]);
                    if (/\.(jpg|png|jpeg|bmp|ico)/i.test(this.$refs.form[0].files[0].name) === false) {
                        this.$Message.error({content: this.$t('kyc.znscpnghjpeghbmpdtp')});
                        return;
                    }
                }
                formData.append('sysParamId', d);
                system.updateAdminImg(formData, (res) => {
                    this.getfindSysParam();
                    this.$Message.success({content: this.$t('common.xgcg')});
                    document.getElementsByTagName('input').value = '';
                }, (msg) => {
                    this.$$Message.error({content: msg});
                });
            }
        }
    };
</script>

<style scoped>
    .img {
        max-width: 60px;
        max-height: 40px;
    }
</style>
