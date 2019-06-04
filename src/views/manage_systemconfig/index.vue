<!-- 系统参数 -->
<template>
    <Card>
        <p slot="title">{{$t('system.bbjycs')}}</p>
            <Row style="margin-bottom:10px;border-bottom:1px solid #dddee1;">
                <Col span="6">{{$t('system.xm')}}</Col>
                <Col span="6">{{$t('system.xz')}}</Col>
                <Col span="12">{{$t('common.xg')}}</Col>
            </Row>
            <Row style="margin-bottom:10px;" v-for="(data,index) in exchangeItem" v-if="data.paramGroup == 1"
                 :key="data.id">
                <Col span="6">{{data.codeDesc}}</Col>
                <Col span="6" v-if="data.code !== 'loginLockCount'">{{data.value}}</Col>
                <Col span="3" v-if="data.code === 'loginLockCount'">{{data.value}}{{$t('system.c')}}</Col>
                <Col span="3" v-if="data.code === 'loginLockCount'">{{data.value2}}{{$t('system.fz')}}</Col>
                <Col span="12" v-if="data.code === 'loginLockCount'">
                    <Input ref="price" type="text" v-model="data.$value" style="width:80px;"/>
                    <Input ref="price" type="text" v-model="data.$value2" style="width:80px;"/>
                    <Button type="primary" style="margin-left:10px;" @click="updataSystem1(data)">{{$t('common.xg')}}</Button>
                </Col>
                <Col span="12"
                     v-if="data.code !== 'loginLockCount' && data.code !==
                     'nicknameUpdateCount' && data.code !== 'headUpdateCount'">
                    <Input ref="price" type="text" v-model="data.$value" style="width:80px;"/>
                    <Button type="primary" style="margin-left:10px;" @click="updataSystem(data)">{{$t('common.xg')}}</Button>
                </Col>
            </Row>
    </Card>
</template>

<script>
    import system from '../../api/systemparam';
    import curreny from '../../api/currency';
    import util from '../../libs/util';
    import numberbox from '../components/dialog/numberbox';
    import addOrEditFeeAccount from './addOrEditFeeAccount';
    import addOrEditWithdrawalAddress from './addOrEditWithdrawalAddress';
    import addConfig from './addConfig';
    import upAddress from './upAddress';

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
                curPage: 1,
                total: 0,
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
        components: {
            numberbox
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
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            updataSystem1 (data) {
                let code = data.code;
                let value = data.$value;
                let value2 = data.$value2;
                if (!value || !value2 || (code === 'otcCoinType' && value.length === 0)) {
                    this.$Message.error({content: this.$t('system.qsrnr')});
                    return;
                }
                if (value2 > 60) {
                    this.$Message.error({content: this.$t('system.fzbndy')});
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
                    this.$Message.success({content: this.$t('common.xgcg')});
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
                    this.$Message.error({content: this.$t('system.qsrnr')});
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
                    this.$Message.success({content: this.$t('common.xgcg')});
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
                console.log(e);
                d.$value = e.target.value;
                // this.formData[prop] = e.target.value;
            }
        }
    };
</script>

<style lang="less">
    input[type="file"] {
        line-height: 26px;
    }
</style>
