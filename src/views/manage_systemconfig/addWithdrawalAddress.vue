<template>
    <Card>
        <p slot="title">添加特殊账户地址参数设置</p>
        <Card>
            <p slot="title" style="height:auto;vertical-align:top;overflow:hidden;">
                <span style="height:32px;font-weight:normal;line-height:32px;">交易所手续费账户</span>
                <span>
              <Input type="text" v-model="accountsSymbolParam" placeholder="请输入要查询的币种关键字"
                     style="width:auto;margin-left:28px;"></Input>
              <Button type="primary" @click="fnFindAdminAccounts(accountsSymbolParam)">查询</Button>
              <Button type="ghost" @click="fnFindAdminAccounts()">重置</Button>
            </span>
                <Button type="primary" style="float:right;" @click="addOrEditFeeAccountDialog">添加手续费账户</Button>
            </p>
            <Table :columns="accountsColumns" :data="accountsData" style="margin-top:10px;"></Table>
            <Page :current="accountsPage.currentPage" :total="accountsPage.total"
                  @on-change="changePage(arguments[0], 1)" style="text-align:center;margin-top:20px;"></Page>
        </Card>
        <Card style="margin-top:16px;">
            <p slot="title" style="height:auto;vertical-align:top;overflow:hidden;">
                <span style="height:32px;font-weight:normal;line-height:32px;">提币主地址设置</span>
                <span>
              <Input type="text" v-model="coinPoolsSymbolParam" placeholder="请输入要查询的币种关键字"
                     style="width:auto;margin-left:28px;"></Input>
              <Button type="primary" @click="fnFindAdminCoinPools(coinPoolsSymbolParam)">查询</Button>
              <Button type="ghost" @click="fnFindAdminCoinPools()">重置</Button>
            </span>
                <Button type="primary" style="float:right;" @click="addOrEditWithdrawalAddressDialog">添加提币主地址
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
                columnsSymbol: [
                    {
                        title: '币种',
                        key: 'symbol'
                    },
                    {
                        title: '最小金额',
                        key: 'coinMin'
                    },
                    {
                        title: '保留金额',
                        key: 'coinReserve'
                    },
                    {
                        title: '矿工费币种',
                        key: 'minerSymbol'
                    },
                    {
                        title: 'BTC矿工费',
                        key: 'minerFee'
                    },
                    {
                        title: 'ETH GAS单价',
                        key: 'gasPrice'
                    },
                    {
                        title: 'ETH GAS上限',
                        key: 'gasLimit'
                    },
                    {
                        title: '是否可用',
                        key: 'enable',
                        render: (h, params) => {
                            return h('div', params.row.enable === 0 ? '不可用' : '可用');
                        }
                    },
                    {
                        title: ' ',
                        key: 'address',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {marginRight: '10px'},
                                    on: {
                                        click: () => {
                                            util.setDialog(upAddress, {
                                                item: params.row,
                                                okCallback: () => {
                                                    this.getfindCollectConfig();
                                                }
                                            });
                                        }
                                    }
                                }, '修改')
                            ]);
                        }
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
                accountsColumns: [
                    {title: '币种', key: 'symbol', width: 80},
                    {title: '用户名', key: 'username'},
                    {title: '用户ID', key: 'userId'},
                    {title: '账户ID', key: 'accountId'},
                    {title: '创建人', key: 'creator'},
                    {title: '创建时间', key: 'createdTime'},
                    {title: '最后修改人', key: 'lastUpdatedBy'},
                    {title: '最后修改时间', key: 'lastUpdatedTime'},
                    {
                        title: '操作', render: (h, params) => {
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
                            }, '修改');
                        }, width: 80
                    }
                ],
                coinPoolsColumns: [
                    {title: '币种', key: 'symbol', width: 80},
                    {title: '用户名', key: 'username'},
                    {title: '用户ID', key: 'userId'},
                    {title: '账户ID', key: 'accountId'},
                    {title: '钱包地址', key: 'address'},
                    {title: '创建人', key: 'creator'},
                    {title: '创建时间', key: 'createdTime'},
                    {title: '最后修改人', key: 'lastUpdatedBy'},
                    {title: '最后修改时间', key: 'lastUpdatedTime'},
                    {
                        title: '操作', render: (h, params) => {
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
                            }, '修改');
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
                console.log(e);
                d.$value = e.target.value;
                // this.formData[prop] = e.target.value;
            }
        }
    };
</script>

<style scoped>

</style>
