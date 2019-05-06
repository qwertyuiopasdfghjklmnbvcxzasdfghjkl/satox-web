<template>
    <Card>
        <p slot="title">{{$t('system.tszhcssz')}}</p>
        <Card>
            <p slot="title" style="height:auto;vertical-align:top;overflow:hidden;">
                <span style="height:32px;font-weight:normal;line-height:32px;">{{$t('system.jyssxfzh')}}</span>
                <span>
              <Input type="text" v-model="accountsSymbolParam" :placeholder="$t('system.qsrycxdbzgjz')"
                     style="width:auto;margin-left:28px;"></Input>
              <Button type="primary" @click="fnFindAdminAccounts(accountsSymbolParam)">{{$t('common.cx')}}</Button>
              <Button type="ghost" @click="fnFindAdminAccounts()">{{$t('system.cz')}}</Button>
            </span>
                <Button type="primary" style="float:right;" @click="addOrEditFeeAccountDialog">{{$t('system.tjsxfzh')}}</Button>
            </p>
            <Table :columns="accountsColumns" :data="accountsData" style="margin-top:10px;"></Table>
            <Page :current="accountsPage.currentPage" :total="accountsPage.total"
                  @on-change="changePage(arguments[0], 1)" style="text-align:center;margin-top:20px;"></Page>
        </Card>
        <Card style="margin-top:16px;">
            <p slot="title" style="height:auto;vertical-align:top;overflow:hidden;">
                <span style="height:32px;font-weight:normal;line-height:32px;">{{$t('system.tbzdzsz')}}</span>
                <span>
              <Input type="text" v-model="coinPoolsSymbolParam" :placeholder="$t('system.qsrycxdbzgjz')"
                     style="width:auto;margin-left:28px;"></Input>
              <Button type="primary" @click="fnFindAdminCoinPools(coinPoolsSymbolParam)">{{$t('common.cx')}}</Button>
              <Button type="ghost" @click="fnFindAdminCoinPools()">{{$t('system.cz')}}</Button>
            </span>
                <Button type="primary" style="float:right;" @click="addOrEditWithdrawalAddressDialog">{{$t('system.tjtbzdz')}}
                </Button>
            </p>
            <Table :columns="coinPoolsColumns" :data="coinPoolsData" style="margin-top:10px;"></Table>
            <Page :current="coinPoolsPage.currentPage" :total="coinPoolsPage.total"
                  @on-change="changePage(arguments[0], 2)" style="text-align:center;margin-top:20px;"></Page>
        </Card>

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
                accountsColumns: [
                    {title: this.$t('common.bz'), key: 'symbol', width: 80},
                    {title: this.$t('common.yhm'), key: 'username'},
                    {title: this.$t('system.yhid'), key: 'userId'},
                    {title: this.$t('system.zhid'), key: 'accountId'},
                    {title: this.$t('system.cjr'), key: 'creator'},
                    {title: this.$t('common.cjsj'), key: 'createdTime'},
                    {title: this.$t('system.zhxgr'), key: 'lastUpdatedBy'},
                    {title: this.$t('system.zhxgsj'), key: 'lastUpdatedTime'},
                    {
                        title: this.$t('common.cz'), render: (h, params) => {
                            return h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        util.setDialog(addOrEditFeeAccount, {
                                            isEdit: true,
                                            symbol: params.row.symbol,
                                            username: params.row.username,
                                            symbolType: params.row.symbolType,
                                            okCallback: () => {
                                                this.fnFindAdminAccounts();
                                            }
                                        });
                                    }
                                }
                            }, this.$t('common.xg'));
                        }, width: 80
                    }
                ],
                coinPoolsColumns: [
                    {title: this.$t('common.bz'), key: 'symbol', width: 80},
                    {title: this.$t('common.yhm'), key: 'username'},
                    {title: this.$t('system.yhid'), key: 'userId'},
                    {title: this.$t('system.zhid'), key: 'accountId'},
                    {title: this.$t('system.qbdz'), key: 'address'},
                    {title: this.$t('system.cjr'), key: 'creator'},
                    {title: this.$t('common.cjsj'), key: 'createdTime'},
                    {title: this.$t('system.zhxgr'), key: 'lastUpdatedBy'},
                    {title: this.$t('system.zhxgsj'), key: 'lastUpdatedTime'},
                    {
                        title: this.$t('common.cz'), render: (h, params) => {
                            return h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        util.setDialog(addOrEditWithdrawalAddress, {
                                            isEdit: true,
                                            symbol: params.row.symbol,
                                            username: params.row.username,
                                            symbolType: params.row.symbolType,
                                            okCallback: () => {
                                                this.fnFindAdminCoinPools();
                                            }
                                        });
                                    }
                                }
                            }, this.$t('common.xg'));
                        }, width: 80
                    }
                ],
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

<style scoped>

</style>
