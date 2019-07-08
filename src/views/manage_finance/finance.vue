<!-- 财务管理 -->
<template>
    <Row>
        <Col span="24">
            <Row>
                <Card>
                    <p slot="title">{{$t('finance.rtbtj')}}</p>
                    <Table :columns="columns2" :data="data2" @on-sort-change="setWithdrawSort"></Table>
                    <Page :current="curPage1" :total="total1" @on-change="changePage1"
                          style="text-align:center;margin-top:20px;"></Page>
                </Card>
            </Row>
            <Row>
                <Card style="margin:10px 0;">
                    <p slot="title">{{$t('finance.mrcttj')}}</p>
                    <Table :columns="columns9" :data="data9" @on-sort-change="setFinanceSort"></Table>
                    <Page :current="curPage9" :total="total9" :page-size="pageSize9" @on-change="changePage9"
                          style="text-align:center;margin-top:20px;"></Page>
                </Card>
            </Row>
            <Row>
                <Card>
                    <p slot="title">{{$t('finance.zjcqk')}}</p>
                    <p style="margin-bottom: 20px">
                        {{$t('common.bz')}}：
                        <Select v-model="formData.symbol" style="width: 200px" :placeholder="'请选择币种'">
                            <Option value="0">{{$t('common.qb')}}</Option>
                            <Option v-for="item in symbolList" :value="item.symbol" :key="item.symbol">{{ item.symbol }}
                            </Option>
                        </Select>
                        {{$t('common.rq')}}：
                        <DatePicker type="datetime" v-model="formData.createdStart" :placeholder="$t('common.kssj')"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    style="width: 200px"></DatePicker>
                        <DatePicker type="datetime" v-model="formData.createdEnd" :placeholder="$t('common.jssj')"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    style="width: 200px"></DatePicker>
                        <Button type="primary" @click="curPage3=1;reGetPoolList()">{{$t('common.cx')}}</Button>
                    </p>
                    <Table ref="test" :columns="columns4" :data="data4" @on-sort-change="setCapitalPoolSort"></Table>
                    <Page :current="curPage3" :total="total3" :page-size="10" @on-change="changePage3"
                          style="text-align:center;margin-top:20px;"></Page>
                </Card>
            </Row>
            <Row style="margin-top:10px;">
                <Card>
                    <p slot="title">{{$t('finance.sxfzh')}}</p>
                    <p style="margin-bottom: 20px">
                        {{$t('common.bz')}}：
                        <Select v-model="formData1.symbol" style="width: 200px" :placeholder="'请选择币种'">
                            <Option value="0">{{$t('common.qb')}}</Option>
                            <Option v-for="item in symbolList" :value="item.symbol" :key="item.symbol">{{ item.symbol }}
                            </Option>
                        </Select>
                        {{$t('common.rq')}}：
                        <DatePicker type="datetime" v-model="formData1.createdStart" :placeholder="$t('common.kssj')"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    style="width: 200px"></DatePicker>
                        <DatePicker type="datetime" v-model="formData1.createdEnd" :placeholder="$t('common.jssj')"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    style="width: 200px"></DatePicker>
                        <Button type="primary" @click="curPage4=1;reGetAccountList()">{{$t('common.cx')}}</Button>
                    </p>
                    <Table ref="test1" :columns="columns5" :data="data5" @on-sort-change="setChargeSort"></Table>
                    <Page :current="curPage4" :total="total4" :page-size="10" @on-change="changePage4"
                          style="text-align:center;margin-top:20px;"></Page>
                </Card>
            </Row>
            <Row style="margin-top:10px;">
                <Card>
                    <p slot="title">{{$t('finance.yhzzcsj')}}</p>
                    <p style="margin-bottom: 20px">
                        {{$t('common.bz')}}：
                        <Select v-model="formData2.symbol" style="width: 200px">
                            <Option value="0">{{$t('common.qb')}}</Option>
                            <Option v-for="item in symbolList" :value="item.symbol" :key="item.symbol">{{ item.symbol }}
                            </Option>
                        </Select>
                        {{$t('common.rq')}}：
                        <DatePicker type="datetime" v-model="formData2.createdStart" :placeholder="$t('common.kssj')"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    style="width: 200px"></DatePicker>
                        <DatePicker type="datetime" v-model="formData2.createdEnd" :placeholder="$t('common.jssj')"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    style="width: 200px"></DatePicker>
                        <Button type="primary" @click="curPage6=1;reGetfindUserAssetList()">{{$t('common.cx')}}</Button>
                    </p>
                    <p style="margin-bottom: 20px">
                        {{$t('finance.btjzh')}}:
                        <Select v-model="formData3.username" style="width: 200px">
                            <Option value="1">{{$t('finance.sxfzh')}}</Option>
                            <Option value="2">{{$t('finance.jqrzh')}}</Option>
                            <Option value="0">{{$t('finance.sxfjjqrzh')}}</Option>

                            <!--<Option :value="0">{{$t('common.qb')}}</Option>-->
                            <!--<Option v-for="item in accountsData" :value="item.username">{{item.username}}</Option>-->
                        </Select>
                        <!--<Input v-model="formData3.value" placeholder="多个用户名用,号隔开" style="width: 300px"></Input>-->
                        <Button type="primary" @click="curPage6=1;reGetfindUserAssetList1()">{{$t('common.cx')}}
                        </Button>
                    </p>
                    <Table ref="test3" :columns="columns7" :data="data7" @on-sort-change="setAssetSort"></Table>
                    <Page :current="curPage6" :total="total6" @on-change="changePage6"
                          style="text-align:center;margin-top:20px;"></Page>
                </Card>
            </Row>
            <Row style="margin-top:10px;">
                <Card>
                    <p slot="title">{{$t('finance.zdzbzsl')}}</p>
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
    import system from '../../api/systemparam';

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
                columns2: [
                    {title: this.$t('finance.glbz'), key: 'symbol'},
                    {title: this.$t('finance.rdtbbs'), key: 'withdrawDailyToBeConfirmedCount', sortable: 'custom'},
                    // {title: '日待提币总量', key: 'withdrawDailyToBeConfirmedAmount'},
                    {title: this.$t('finance.rytbbs'), key: 'withdrawDailyFinishCount', sortable: 'custom'},
                    // {title: '日已提币总量', key: 'withdrawDailyFinishAmount'},
                ],
                data2: [],
                columns4: [
                    {title: this.$t('common.rq'), key: 'createdTime'},
                    {title: this.$t('common.bz'), key: 'symbol', sortable: 'custom'},
                    {title: this.$t('finance.dqsl'), key: 'currentCapitalPoolQuantity', sortable: 'custom'},
                    {
                        title: this.$t('finance.syjyrspsj'),
                        key: 'closingCapitalPoolYesterdayQuantity',
                        sortable: 'custom'
                    },
                    {title: this.$t('finance.rjz'), key: 'increaseDailyQuantity', sortable: 'custom'}
                ],
                data4: [],
                columns5: [
                    {title: this.$t('common.rq'), key: 'createdTime'},
                    {title: this.$t('common.bz'), key: 'symbol', sortable: 'custom'},
                    {title: this.$t('finance.dqsl'), key: 'currentCapitalPoolQuantity', sortable: 'custom'},
                    {
                        title: this.$t('finance.syjyrspsj'),
                        key: 'closingCapitalPoolYesterdayQuantity',
                        sortable: 'custom'
                    },
                    {title: this.$t('finance.rsq'), key: 'collectfeeDailyQuantity', sortable: 'custom'}
                ],
                data5: [],
                columns6: [
                    {title: this.$t('common.bz'), key: 'symbol'},
                    {title: this.$t('common.zh'), key: 'username'},
                    {title: this.$t('common.dz'), key: 'address'},
                    {
                        title: this.$t('common.sl'), key: 'availableBalance',
                        render: (h, params) => {
                            return h('div', [params.row.availableBalance, params.row.symbol]);
                        }
                    }
                ],
                data6: [],
                columns7: [
                    {title: this.$t('common.rq'), key: 'createdTime'},
                    {title: this.$t('common.bz'), key: 'symbol', sortable: 'custom'},
                    {title: this.$t('finance.dqsl'), key: 'currentAssetAmount', sortable: 'custom'},
                    {title: this.$t('finance.syjyrsl'), key: 'closingAssetYesterdayQuantity', sortable: 'custom'},
                    {title: this.$t('finance.rjz'), key: 'increaseDailyQuantity', sortable: 'custom'}
                ],
                data7: [],
                columns9: [
                    {title: this.$t('common.bz'), key: 'symbol'},
                    {title: this.$t('finance.rczsl'), key: 'rechargeAmountDaily', sortable: 'custom'},
                    {title: this.$t('finance.rczbs'), key: 'rechargeCountDaily', sortable: 'custom'},
                    {title: this.$t('finance.rtxsl'), key: 'withdrawAmountDaily', sortable: 'custom'},
                    {title: this.$t('finance.rtxbs'), key: 'withdrawCountDaily', sortable: 'custom'},
                    {title: this.$t('finance.rxzjd'), key: 'increaseAmountDaily', sortable: 'custom'},
                    {title: this.$t('finance.dshtx'), key: 'waitCheckWithdraw', sortable: 'custom'},
                    {title: this.$t('finance.dshtxpqsl'), key: 'waitCheckWithdrawAmount', sortable: 'custom'}
                ],
                data9: [],
                curPage9: 1,
                total9: 0,
                pageSize9: 3,
                symbolList: [],
                formData: {
                    symbol: '0',
                    createdStart: null,
                    createdEnd: null
                },
                formData1: {
                    symbol: '0',
                    createdStart: null,
                    createdEnd: null
                },
                formData2: {
                    symbol: '0',
                    createdStart: null,
                    createdEnd: null
                },
                formData3: {
                    username: '0',
                    value: null
                },
                search: 0,
                accountsData: [],
                accountsDataAll: '',
                accountsDataRobot: '',
                accountsDataFee: '',
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
            this.getDataList9();
            this.getdataSymbol();
            this.getAccounts();
        },
        methods: {
            getAccounts () {
                let data = {};
                system.getAccounts(data, (res) => {
                    this.accountsData = res;
                    this.accountsData.filter((res) => {
                        this.accountsDataAll += res.username + ',';
                        if (res.specialType === 1) {
                            this.accountsDataFee += res.username + ',';
                        } else if (res.specialType === 2) {
                            this.accountsDataRobot += res.username + ',';
                        }
                    });
                    console.log(this.accountsDataAll, this.accountsDataFee, this.accountsDataRobot);
                }, (msg) => {
                    console.error(msg);
                });
            },
            getdataSymbol () {
                currenyApi.findAllValidSymbolList((res) => {
                    this.symbolList = res;
                });
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
            getfindUserAssetList (data) {
                let sortStr = this.assetSortKey ? `${this.assetSortKey}%20${this.assetSortVal}` : 'null';
                financeApi.findUserAssetList(this.curPage6, sortStr, data, (res, total) => {
                    this.total6 = total;
                    this.data7 = res;
                });
            },
            changePage6 (page) {
                this.curPage6 = page;
                if (this.search === 1) {
                    this.reGetfindUserAssetList();
                } else if (this.search === 2) {
                    this.reGetfindUserAssetList1();
                } else {
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
            getPoolList (data) {
                let sortStr = this.capitalPoolSortKey ? `${this.capitalPoolSortKey}%20${this.capitalPoolSortVal}` : 'null';
                financeApi.findCapitalPoolList(this.curPage3, sortStr, data, (res, total) => {
                    this.total3 = total;
                    this.data4 = res;
                });
            },
            changePage3 (page) {
                this.curPage3 = page;
                this.reGetPoolList();
            },
            getAccountList (data) {
                let sortStr = this.chargeSortKey ? `${this.chargeSortKey}%20${this.chargeSortVal}` : 'null';
                financeApi.findServiceFeeAccountList(this.curPage4, sortStr, data, (res, total) => {
                    this.total4 = total;
                    this.data5 = res;
                });
            },
            changePage4 (page) {
                this.curPage4 = page;
                this.reGetAccountList();
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
            },
            reGetPoolList () {
                let D = JSON.stringify(this.formData);
                let data = JSON.parse(D);
                data.createdStart = data.createdStart ? util.dateToStr(new Date(data.createdStart)) : null;
                data.createdEnd = data.createdEnd ? util.dateToStr(new Date(data.createdEnd)) : null;
                data.symbol = data.symbol === '0' ? null : data.symbol;
                this.columns4.splice(3, 2);
                this.getPoolList(data);
            },
            reGetAccountList () {
                let D = JSON.stringify(this.formData1);
                let data = JSON.parse(D);
                data.createdStart = data.createdStart ? util.dateToStr(new Date(data.createdStart)) : null;
                data.createdEnd = data.createdEnd ? util.dateToStr(new Date(data.createdEnd)) : null;
                data.symbol = data.symbol === '0' ? null : data.symbol;
                this.columns5.splice(3, 2);
                this.getAccountList(data);
            },
            reGetfindUserAssetList () {
                this.search = 1;
                let D = JSON.stringify(this.formData2);
                let data = JSON.parse(D);
                data.createdStart = data.createdStart ? util.dateToStr(new Date(data.createdStart)) : null;
                data.createdEnd = data.createdEnd ? util.dateToStr(new Date(data.createdEnd)) : null;
                data.symbol = data.symbol === '0' ? null : data.symbol;
                this.columns7.splice(3, 2);
                if(data.createdStart || data.createdEnd){
                    this.columns7[2] = {title: this.$t('finance.dqsl'), key: 'closingAssetYesterdayQuantity', sortable: 'custom'}
                }else{
                    this.columns7[2] = {title: this.$t('finance.dqsl'), key: 'currentAssetAmount', sortable: 'custom'}
                }
                this.formData3.username = '0';
                this.getfindUserAssetList(data);
            },
            reGetfindUserAssetList1 () {
                this.search = 2;
                let data = {};
                if (this.formData3.username === '0') {
                    data.username = this.accountsDataAll;
                } else if (this.formData3.username === '1') {
                    data.username = this.accountsDataFee;
                } else if (this.formData3.username === '2') {
                    data.username = this.accountsDataRobot;
                }
                this.columns7.splice(3, 2);
                this.columns7[2] = {title: this.$t('finance.dqsl'), key: 'currentAssetAmount', sortable: 'custom'}
                this.formData2 = {
                    symbol: '0',
                    createdStart: null,
                    createdEnd: null
                };
                this.getfindUserAssetList(data);
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
