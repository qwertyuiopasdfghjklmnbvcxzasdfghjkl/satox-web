<!--资产记录-->
<template>
    <div>
        <Card style="width:1200px;">
            <p slot="title">
                <span>{{vm.$t('exchange.zcjl')}}</span>
                <span>
                <span class="refresh" @click="reshAll" style="margin-right:50px;"></span>
                <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer; margin-top: 14px;"
                   @click="closeDialog"></i>
            </span>
            </p>
            <Tabs value="name1">
                <TabPane :label="vm.$t('exchange.dqzc')" name="name1">
                    <Card>
                        <p slot="title">{{vm.$t('exchange.zzc')}}：{{totalAssets.totalAmountByBTC}}BTC
                            {{totalAssets.totalAmountByCNY}}CNY</p>
                    </Card>
                    <Table :columns="columns1" :data="data1"></Table>
                    <Page :current="curPage" :total="total" @on-change="changePage"
                          style="text-align:center;margin-top:20px;"></Page>
                </TabPane>
                <TabPane :label="vm.$t('exchange.czjl')" name="name2">
                    <Table :columns="columns2" :data="data2"></Table>
                    <Page :current="curPage1" :total="total1" @on-change="changePage1"
                          style="text-align:center;margin-top:20px;"></Page>
                </TabPane>
                <TabPane :label="vm.$t('exchange.tbjl')" name="name3">
                    <Table :columns="columns3" :data="data3"></Table>
                    <Page :current="curPage2" :total="total2" @on-change="changePage2"
                          style="text-align:center;margin-top:20px;"></Page>
                </TabPane>
                <TabPane :label="vm.$t('exchange.czdzjl')" name="name4">
                    <Table :columns="columns4" :data="data4"></Table>
                    <Page :current="curPage3" :total="total3" @on-change="changePage3"
                          style="text-align:center;margin-top:20px;"></Page>
                </TabPane>
                <TabPane :label="vm.$t('exchange.tbdzjl')" name="name5">
                    <Table :columns="columns5" :data="data5"></Table>
                    <Page :current="curPage4" :total="total4" @on-change="changePage4"
                          style="text-align:center;margin-top:20px;"></Page>
                </TabPane>
                <TabPane :label="vm.$t('exchange.ffjl')" name="name6">
                    <Table :columns="columns6" :data="data6"></Table>
                    <Page :current="curPage5" :total="total5" @on-change="changePage5"
                          style="text-align:center;margin-top:20px;"></Page>
                </TabPane>
            </Tabs>
        </Card>
    </div>
</template>

<script>
    import currenyApi from '../../../api/currency';

    export default {
        props: ['userId'],
        data () {
            const vm = window.vm;
            return {
                vm: vm,
                curPage: 1,
                total: 0,
                curPage1: 1,
                total1: 0,
                curPage2: 1,
                total2: 0,
                curPage3: 1,
                total3: 0,
                curPage4: 1,
                total4: 0,
                curPage5: 1,
                total5: 0,
                columns1: [
                    {
                        title: vm.$t('common.bz'),
                        key: 'symbol'
                    },
                    {
                        title: vm.$t('common.qblx'),
                        key: 'type',
                        render: (h, params) => {
                            return h('div', params.row.type === 1 ? vm.$t('common.zqb') : vm.$t('common.fzqb'));
                        }
                    },
                    {
                        title: vm.$t('exchange.ky'),
                        key: 'availableAmount'
                    },
                    {
                        title: vm.$t('exchange.sd'),
                        key: 'frozenAmount'
                    },
                    {
                        title: vm.$t('exchange.hj'),
                        key: 'totalAmount'
                    }
                ],
                data1: [],
                columns2: [
                    {
                        title: vm.$t('common.bz'),
                        key: 'symbol'
                    },
                    {
                        title: vm.$t('common.sl'),
                        key: 'quantity'
                    },
                    {
                        title: vm.$t('common.zrdz'),
                        key: 'toAddress'
                    },
                    {
                        title: vm.$t('common.jyid'),
                        key: 'txId'
                    },
                    {
                        title: vm.$t('exchange.qkjd'),
                        key: 'confirmation'
                    },
                    {
                        title: vm.$t('common.zt'),
                        key: 'status',
                        render: (h, params) => {
                            return h('div', params.row.status === 1 ? vm.$t('common.dd') : vm.$t('common.wc'));
                        }
                    },
                    {
                        title: vm.$t('exchange.dzsj'),
                        key: 'createdTime'
                    }
                ],
                data2: [],
                columns3: [
                    {
                        title: vm.$t('common.bz'),
                        key: 'symbol'
                    },
                    {
                        title: vm.$t('common.sl'),
                        key: 'quantity'
                    },
                    {
                        title: vm.$t('common.zrdz'),
                        key: 'toAddress'
                    },
                    {
                        title: vm.$t('common.jyid'),
                        key: 'txId'
                    },
                    {
                        title: vm.$t('common.zt'),
                        key: 'status',
                        render: (h, params) => {
                            return h('div', this.switchStaus(params.row.status));
                        }
                    },
                    {
                        title: vm.$t('exchange.fssj'),
                        key: 'createdTime'
                    }
                ],
                data3: [],
                columns4: [
                    {
                        title: vm.$t('common.zh'),
                        key: 'accountName'
                    },
                    {
                        title: vm.$t('common.bz'),
                        key: 'symbol'
                    },
                    {
                        title: vm.$t('common.zrdz'),
                        key: 'toAddress'
                    },
                    {
                        title: 'MEMO',
                        key: 'memo'
                    }
                ],
                data4: [],
                columns5: [
                    {
                        title: vm.$t('common.bz'),
                        key: 'symbol'
                    },
                    {
                        title: vm.$t('common.zrdz'),
                        key: 'toAddress'
                    },
                    {
                        title: vm.$t('exchange.dzbm'),
                        key: 'addrAlias'
                    },
                    {
                        title: 'MEMO',
                        key: 'memo'
                    }
                ],
                data5: [],
                columns6: [
                    {
                        title: vm.$t('common.sj'),
                        key: 'ticreatedTime'
                    },
                    {
                        title: vm.$t('common.bz'),
                        key: 'symbol'
                    },
                    {
                        title: vm.$t('common.sl'),
                        key: 'quantity'
                    },
                    {
                        title: vm.$t('common.beiz'),
                        key: 'remarks'
                    }
                ],
                data6: [],
                totalAssets: []
            };
        },
        created () {
            this.getAssetsList();
            this.getRecordList();
            this.getWithdraw();
            this.getRecharge();
            this.getWithdrawAddrList();
            this.getDistribute();
            this.allRecord();
        },
        methods: {
            reshAll () {
                this.getAssetsList();
                this.getRecordList();
                this.getWithdraw();
                this.getRecharge();
                this.getWithdrawAddrList();
                this.getDistribute();
                this.allRecord();
            },
            switchStaus (state) {
                switch (state) {
                    case 1:
                        return '提现中';
                        break;
                    case 2:
                        return '已完成';
                        break;
                }
            },
            allRecord () {
                currenyApi.findUserCurrentAssetsByBTC({
                    userId: this.userId
                }, (res) => {
                    this.totalAssets = res;
                });
            },
            closeDialog () {
                this.$emit('removeDialog');
            },
            getAssetsList () {
                currenyApi.findUserCurrentAssetsList(this.curPage, this.userId, (res, total) => {
                    this.total = total;
                    this.data1 = res;
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            changePage (page) {
                this.curPage = page;
                this.getAssetsList();
            },
            getRecordList () {
                currenyApi.findUserRechargeRecordList(this.curPage1, this.userId, (res, total) => {
                    this.total1 = total;
                    this.data2 = res;
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            changePage1 (page) {
                this.curPage1 = page;
                this.getRecordList();
            },
            getWithdraw () {
                currenyApi.findUserWithdrawRecordList(this.curPage2, this.userId, (res, total) => {
                    this.total2 = total;
                    this.data3 = res;
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            changePage2 (page) {
                this.curPage2 = page;
                this.getWithdraw();
            },
            getRecharge () {
                currenyApi.findUserRechargeAddrList(this.curPage3, this.userId, (res, total) => {
                    this.total3 = total;
                    this.data4 = res;
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            changePage3 (page) {
                this.curPage3 = page;
                this.getRecharge();
            },
            getWithdrawAddrList () {
                currenyApi.findUserWithdrawAddrList(this.curPage4, this.userId, (res, total) => {
                    this.total4 = total;
                    this.data5 = res;
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            changePage4 (page) {
                this.curPage4 = page;
                this.getWithdrawAddrList();
            },
            getDistribute () {
                currenyApi.findUserDistributeRecordList(this.curPage5, this.userId, (res, total) => {
                    this.total5 = total;
                    this.data6 = res;
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            changePage5 (page) {
                this.curPage5 = page;
                this.getDistribute();
            }
        }
    };
</script>
<style>
    .refresh {
        width: 49px;
        height: 24px;
        background: url(../../../images/frsh.png) center/cover no-repeat;
        background-size: contain;
        cursor: pointer;
        color: #2d8cf0;
    }
</style>

