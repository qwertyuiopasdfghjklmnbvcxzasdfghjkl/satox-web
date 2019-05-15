<template>
    <div>
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
    </div>
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
            return {
                coinPoolsSymbolParam: null,
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
                coinPoolsData: [],
                coinPoolsPage: {
                    pageSize: 10,
                    currentPage: 1,
                    total: 0
                },
            };
        },
        watch: {
            coinPoolsPage () {
                this.fnFindAdminCoinPools(this.coinPoolsSymbolParam);
            }
        },
        created () {
            this.fnFindAdminCoinPools();
        },
        methods: {
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
                } else if (flag === 2) {
                    this.coinPoolsPage.currentPage = page;
                    this.fnFindAdminCoinPools();
                } else {
                    return false;
                }
            }
        }
    };
</script>

<style scoped>

</style>
