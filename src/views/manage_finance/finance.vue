<!-- 财务管理 -->
<template>
    <Row>
        <Col span="24">
            <Row style="margin:10px 0;">
                <Card>
                    <p slot="title">充值监控
                        <span class="refresh" @click="reshAll"></span>
                    </p>
                    <Table :columns="columns1" :data="data1" @on-sort-change="setRechargeSort"></Table>
                    <Page :current="curPage" :total="total" @on-change="changePage"
                          style="text-align:center;margin-top:20px;"></Page>
                </Card>
            </Row>
            <Row>
                <Card>
                    <p slot="title">日提币统计</p>
                    <Table :columns="columns2" :data="data2" @on-sort-change="setWithdrawSort"></Table>
                    <Page :current="curPage1" :total="total1" @on-change="changePage1"
                          style="text-align:center;margin-top:20px;"></Page>
                </Card>
            </Row>
            <Row>
                <Card style="margin:10px 0;">
                    <p slot="title">每日充提统计</p>
                    <Table :columns="columns9" :data="data9" @on-sort-change="setFinanceSort"></Table>
                    <Page :current="curPage9" :total="total9" :page-size="pageSize9" @on-change="changePage9"
                          style="text-align:center;margin-top:20px;"></Page>
                </Card>
            </Row>
            <!--<Row style="margin:10px 0;">-->
                <!--<Card>-->
                    <!--<p slot="title">实时对账</p>-->
                    <!--<Table :columns="columns3" :data="data3"></Table>-->
                    <!--<Page :current="curPage2" :total="total2" @on-change="changePage2"-->
                          <!--style="text-align:center;margin-top:20px;"></Page>-->
                <!--</Card>-->
            <!--</Row>-->
            <Row>
                <Card>
                    <p slot="title">资金池情况</p>
                    <Table ref="test" :columns="columns4" :data="data4" @on-sort-change="setCapitalPoolSort"></Table>
                    <Page :current="curPage3" :total="total3" @on-change="changePage3"
                          style="text-align:center;margin-top:20px;"></Page>
                </Card>
            </Row>
            <Row style="margin-top:10px;">
                <Card>
                    <p slot="title">手续费账户</p>
                    <Table ref="test1" :columns="columns5" :data="data5" @on-sort-change="setChargeSort"></Table>
                    <Page :current="curPage4" :total="total4" @on-change="changePage4"
                          style="text-align:center;margin-top:20px;"></Page>
                </Card>
            </Row>
            <Row style="margin-top:10px;">
                <Card>
                    <p slot="title">用户总资产数据</p>
                    <Table ref="test3" :columns="columns7" :data="data7" @on-sort-change="setAssetSort"></Table>
                    <Page :current="curPage6" :total="total6" @on-change="changePage6"
                          style="text-align:center;margin-top:20px;"></Page>
                </Card>
            </Row>
            <Row style="margin-top:10px;">
                <Card>
                    <p slot="title">充币列表</p>
                    <Table ref="test2" :columns="columns8" :data="data8" @on-sort-change="setChargeTokenSort"></Table>
                    <Page :current="curPage7" :total="total7" @on-change="changePage7"
                          style="text-align:center;margin-top:20px;"></Page>
                </Card>
            </Row>
            <Row style="margin-top:10px;">
                <Card>
                    <p slot="title">主地址币种数量</p>
                    <Table :columns="columns6" :data="data6"></Table>
                    <Page :current="curPage5" :total="total5" @on-change="changePage5"
                          style="text-align:center;margin-top:20px;"></Page>
                </Card>
            </Row>
        </Col>
    </Row>
</template>

<script>
    import util from '../../libs/util';
    import dialog from './components/dialog';
    import financeApi from '../../api/finance';
    import currenyApi from '../../api/currency';

    export default {
        data () {
            return {
                flag: 1,
                flag1: 1,
                flag2: 1,
                flag3: 1,
                ase: 1,
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
                curPage6: 1,
                total6: 0,
                curPage7: 1,
                total7: 0,
                columns1: [
                    {title: '公链币种', key: 'symbol'},
                    {title: '监控地址数量', key: 'currentMonitorAddrCount'},
                    {title: '日充值待确认笔数', key: 'dailyRechargeWaitComfirmCount', sortable: 'custom'},
                    // {title: '日充值待确认总量', key: 'dailyRechargeWaitComfirmAmount'},
                    {title: '日充值完成笔数', key: 'dailyRechargeFinishCount', sortable: 'custom'},
                    // {title: '日充值完成总量', key: 'dailyRechargeWaitComfirmAmount'}
                ],
                data1: [],
                columns2: [
                    {title: '公链币种', key: 'symbol'},
                    {title: '日待提币笔数', key: 'withdrawDailyToBeConfirmedCount', sortable: 'custom'},
                    // {title: '日待提币总量', key: 'withdrawDailyToBeConfirmedAmount'},
                    {title: '日已提币笔数', key: 'withdrawDailyFinishCount', sortable: 'custom'},
                    // {title: '日已提币总量', key: 'withdrawDailyFinishAmount'},
                ],
                data2: [],
                columns3: [
                    {
                        title: '对账状态', key: 'status',
                        render: (h, params) => {
                            return h('div', params.row.status == 1 ? '正常' : '异常');
                        }
                    },
                    {title: '日已核对交易笔数', key: 'exchangeVerifyDailyCount'},
                    {title: '日待核对交易笔数', key: 'exchangeToBeVerifyCount'},
                    {
                        title: '异常交易', key: 'action', render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    on: {
                                        click: () => {
                                            util.setDialog(dialog);
                                        }
                                    }
                                }, '查看')
                            ]);
                        }
                    }
                ],
                data3: [],
                columns4: [
                    {title: '币种', key: 'symbol', sortable: 'custom'},
                    {title: '当前数量', key: 'currentCapitalPoolQuantity', sortable: 'custom'},
                    {title: '上一交易日收盘数量', key: 'closingCapitalPoolYesterdayQuantity', sortable: 'custom'},
                    {title: '日净增', key: 'increaseDailyQuantity', sortable: 'custom'}
                ],
                data4: [],
                columns5: [
                    {title: '币种', key: 'symbol', sortable: 'custom'},
                    {title: '当前数量', key: 'currentCapitalPoolQuantity', sortable: 'custom'},
                    {title: '上一交易日收盘数量', key: 'closingCapitalPoolYesterdayQuantity', sortable: 'custom'},
                    {title: '日收取', key: 'collectfeeDailyQuantity', sortable: 'custom'}
                ],
                data5: [],
                columns6: [
                    {title: '币种', key: 'symbol'},
                    {title: '账号', key: 'username'},
                    {title: '地址', key: 'address'},
                    {
                        title: '数量', key: 'availableBalance',
                        render: (h, params) => {
                            return h('div', [params.row.availableBalance, params.row.symbol]);
                        }
                    }
                ],
                data6: [],
                columns7: [
                    {title: '币种', key: 'symbol', sortable: 'custom'},
                    {title: '当前数量', key: 'currentAssetAmount', sortable: 'custom'},
                    {title: '上一交易日数量', key: 'closingAssetYesterdayQuantity', sortable: 'custom'},
                    {title: '日净增', key: 'increaseDailyQuantity', sortable: 'custom'}
                ],
                data7: [],
                columns8: [
                    {title: '创建时间', key: 'createdTime', sortable: 'custom'},
                    {title: '用户账号', key: 'userName'},
                    {title: '币种', key: 'symbol', sortable: 'custom'},
                    {title: '充值数量', key: 'amount', sortable: 'custom'},
                    {
                        title: '状态', key: 'status',
                        render: (h, params) => {
                            return h('div', params.row.status === 1 ? '等待' : '完成');
                        },
                        sortable: 'custom'
                    },
                    {title: '确认块数', key: 'confirmation'}
                ],
                data8: [],
                columns9: [
                    {title: '币种', key: 'symbol'},
                    {title: '日充值数量', key: 'rechargeAmountDaily', sortable: 'custom'},
                    {title: '日充值笔数', key: 'rechargeCountDaily', sortable: 'custom'},
                    {title: '日提现数量', key: 'withdrawAmountDaily', sortable: 'custom'},
                    {title: '日提现笔数', key: 'withdrawCountDaily', sortable: 'custom'},
                    {title: '日新增净额', key: 'increaseAmountDaily', sortable: 'custom'},
                    {title: '待审核提现', key: 'waitCheckWithdraw', sortable: 'custom'},
                    {title: '待审核提现请求数量', key: 'waitCheckWithdrawAmount', sortable: 'custom'}
                ],
                data9: [],
                curPage9: 1,
                total9: 0,
                pageSize9: 3,
            };
        },
        created () {
            this.getMonitorList();
            this.getStatisticsList();
            this.getCheckingList();
            this.getPoolList();
            this.getAccountList();
            this.getAdminWithdrawAccountInfo();
            this.getfindUserAssetList();
            this.getfindRechargeRecords();
            this.getDataList9();
        },
        methods: {
            setChargeTokenSort (column) {
                this.curPage7 = 1;
                if (column.order !== 'normal') {
                    this.ChargeTokenSortKey = column.key;
                    this.ChargeTokenSortVal = column.order;
                } else {
                    this.ChargeTokenSortKey = null;
                }
                this.getfindRechargeRecords();
            },
            setAssetSort (column) {
                this.curPage6 = 1;
                if (column.order !== 'normal') {
                    this.assetSortKey = column.key;
                    this.assetSortVal = column.order;
                } else {
                    this.assetSortKey = null;
                }
                this.getfindUserAssetList();
            },
            setChargeSort (column) {
                this.curPage4 = 1;
                if (column.order !== 'normal') {
                    this.chargeSortKey = column.key;
                    this.chargeSortVal = column.order;
                } else {
                    this.chargeSortKey = null;
                }
                this.getAccountList();
            },
            setCapitalPoolSort (column) {
                this.curPage3 = 1;
                if (column.order !== 'normal') {
                    this.capitalPoolSortKey = column.key;
                    this.capitalPoolSortVal = column.order;
                } else {
                    this.capitalPoolSortKey = null;
                }
                this.getPoolList();
            },
            setWithdrawSort (column) {
                this.curPage1 = 1;
                if (column.order !== 'normal') {
                    this.withdrawSortKey = column.key;
                    this.withdrawSortVal = column.order;
                } else {
                    this.withdrawSortKey = null;
                }
                this.getStatisticsList();
            },
            setRechargeSort (column) {
                this.curPage = 1;
                if (column.order !== 'normal') {
                    this.rechargeSortKey = column.key;
                    this.rechargeSortVal = column.order;
                } else {
                    this.rechargeSortKey = null;
                }
                this.getMonitorList();
            },
            getfindRechargeRecords () {
                let sortStr = this.ChargeTokenSortKey ? `${this.ChargeTokenSortKey}%20${this.ChargeTokenSortVal}` : 'null';
                financeApi.findRechargeRecords(this.curPage7, sortStr, (res, total) => {
                    this.total7 = total;
                    this.data8 = res;
                });
            },
            changePage7 (page) {
                this.curPage7 = page;
                this.getfindRechargeRecords();
            },
            getfindUserAssetList () {
                let sortStr = this.assetSortKey ? `${this.assetSortKey}%20${this.assetSortVal}` : 'null';
                financeApi.findUserAssetList(this.curPage6, sortStr, (res, total) => {
                    this.total6 = total;
                    this.data7 = res;
                });
            },
            changePage6 (page) {
                this.curPage6 = page;
                this.getfindUserAssetList();
            },
            custom3 (o) {
                this.curPage6 = 1;
                if (o.order === 'desc') {
                    this.flag3 = 0;
                    this.getfindUserAssetList();
                } else {
                    this.$refs.test3.cloneColumns[0]._sortType = 'asc';
                    this.flag3 = 1;
                    this.getfindUserAssetList();
                }
            },
            custom2 (o) {
                this.curPage6 = 1;
                if (o.order === 'desc') {
                    this.flag2 = 0;
                    this.getfindUserAssetList();
                } else {
                    this.$refs.test2.cloneColumns[0]._sortType = 'asc';
                    this.flag2 = 1;
                    this.getfindUserAssetList();
                }
            },
            custom1 (o) {
                this.curPage4 = 1;
                if (o.order === 'desc') {
                    this.flag1 = 0;
                    this.getAccountList();
                } else {
                    this.$refs.test1.cloneColumns[0]._sortType = 'asc';
                    this.flag1 = 1;
                    this.getAccountList();
                }
            },
            custom (o) {
                this.curPage3 = 1;
                if (o.order === 'desc') {
                    this.flag = 0;
                    this.getPoolList();
                } else {
                    this.$refs.test.cloneColumns[0]._sortType = 'asc';
                    this.flag = 1;
                    this.getPoolList();
                }
            },
            reshAll () {
                this.getMonitorList();
                this.getStatisticsList();
                this.getCheckingList();
                this.getPoolList();
                this.getAccountList();
                this.getAdminWithdrawAccountInfo();
                this.getfindUserAssetList();
                this.getfindRechargeRecords();
            },
            getMonitorList () {
                let sortStr = this.rechargeSortKey ? `${this.rechargeSortKey}%20${this.rechargeSortVal}` : 'null';
                financeApi.findRechargeMonitorList(this.curPage, sortStr, (res, total) => {
                    this.total = total;
                    this.data1 = res;
                });
            },
            changePage (page) {
                this.curPage = page;
                this.getMonitorList();
            },
            getStatisticsList () {
                let sortStr = this.withdrawSortKey ? `${this.withdrawSortKey}%20${this.withdrawSortVal}` : 'null';
                financeApi.findWithdrawStatisticsList(this.curPage1, sortStr, (res, total) => {
                    this.total = total;
                    this.data2 = res;
                });
            },
            changePage1 (page) {
                this.curPage1 = page;
                this.getStatisticsList();
            },
            getCheckingList () {
                financeApi.findRealTimeCheckingList(this.curPage2, (res, total) => {
                    this.total2 = total;
                    this.data3 = res;
                });
            },
            changePage2 (page) {
                this.curPage2 = page;
                this.getCheckingList();
            },
            getPoolList () {
                let sortStr = this.capitalPoolSortKey ? `${this.capitalPoolSortKey}%20${this.capitalPoolSortVal}` : 'null';
                financeApi.findCapitalPoolList(this.curPage3, sortStr, (res, total) => {
                    this.total3 = total;
                    this.data4 = res;
                });
            },
            changePage3 (page) {
                this.curPage3 = page;
                this.getPoolList();
            },
            getAccountList () {
                let sortStr = this.chargeSortKey ? `${this.chargeSortKey}%20${this.chargeSortVal}` : 'null';
                financeApi.findServiceFeeAccountList(this.curPage4, sortStr, (res, total) => {
                    this.total4 = total;
                    this.data5 = res;
                });
            },
            changePage4 (page) {
                this.curPage4 = page;
                this.getAccountList();
            },
            getAdminWithdrawAccountInfo () {
                financeApi.getAdminWithdrawAccountInfo(this.curPage5, (res, total) => {
                    this.total5 = total;
                    this.data6 = res;
                });
            },
            changePage5 (page) {
                this.curPage5 = page;
                this.getAdminWithdrawAccountInfo();
            },
            setFinanceSort (column) {
                this.curPage9 = 1;
                if (column.order !== 'normal') {
                    this.financeSortKey = column.key;
                    this.financeSortVal = column.order;
                } else {
                    this.financeSortKey = null;
                }
                this.getDataList9();
            },
            getDataList9 () {
                let sortStr = this.financeSortKey ? `${this.financeSortKey}%20${this.financeSortVal}` : 'null';
                currenyApi.findFinancialDataList(this.pageSize9, this.curPage9, sortStr, {}, (res, total) => {
                    this.total9 = total;
                    this.data9 = res;
                });
            },
            changePage9 (page) {
                this.curPage9 = page;
                this.getDataList9();
            }
        }
    };
</script>

<style lang="less" scoped>
    .refresh {
        width: 49px;
        height: 24px;
        background: url(../../images/frsh.png) center/cover no-repeat;
        background-size: contain;
        cursor: pointer;
        color: #2d8cf0;
    }

    .ivu-table-sort i {
        display: none;
    }

    .ivu-table-cell .ivu-table-sort i:first-child {
        display: none;
    }

    .ivu-card-head-inner, .ivu-card-head p {
        display: flex !important;
        justify-content: space-between !important;
        height: 40px !important;
        line-height: 40px !important;
    }
</style>
