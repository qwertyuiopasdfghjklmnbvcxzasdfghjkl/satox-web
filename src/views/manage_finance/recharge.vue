<!-- 财务管理 -->
<template>
    <Row>
        <Col span="24">
            <Row style="margin:10px 0;">
                <Card>
                    <p slot="title">公链充值监控
                        <!--<span class="refresh" @click="reshAll"></span>-->
                    </p>
                    <Table :columns="columns1" :data="data1" @on-sort-change="setRechargeSort"></Table>
                    <Page :current="curPage" :total="total" @on-change="changePage"
                          style="text-align:center;margin-top:20px;"></Page>
                </Card>
            </Row>
            <Row>
                <Card>
                    <p slot="title">币种充值监控</p>
                    <p style="margin-bottom: 20px">
                        币种：
                        <Select v-model="formData.symbol2" style="width: 200px">
                            <Option v-for="item in symbolList" :value="item.symbol" :key="item.symbol">{{ item.symbol }}
                            </Option>
                        </Select>
                        <Button type="primary" @click="curPage1=1;">查询</Button>
                    </p>
                    <Table :columns="columns2" :data="data2" @on-sort-change="setWithdrawSort"></Table>
                    <Page :current="curPage1" :total="total1" @on-change="changePage1"
                          style="text-align:center;margin-top:20px;"></Page>
                </Card>
            </Row>

            <Row style="margin-top:10px;">
                <Card>
                    <p slot="title">充币列表</p>
                    <p style="margin-bottom: 20px">
                        币种：
                        <Select v-model="formData.symbol" style="width: 200px">
                            <Option v-for="item in symbolList" :value="item.symbol" :key="item.symbol">{{ item.symbol }}
                            </Option>
                        </Select>
                        创建时间：
                        <DatePicker type="date" v-model="formData.beginTime" placeholder="开始时间" format="yyyy-MM-dd"
                                    style="width: 150px"></DatePicker>
                        <DatePicker type="date" v-model="formData.endTime" placeholder="结束时间" format="yyyy-MM-dd"
                                    style="width: 150px"></DatePicker>
                        有户名：
                        <Input v-model="formData.username" clearable style="width: 200px"></Input>
                        数量：
                        <Select v-model="formData.amount" style="width: 200px">
                            <Option value="">全部</Option>
                            <Option value="1">小于等于1</Option>
                            <Option value="2">大于1小于等于1000</Option>
                            <Option value="3">大于1000小于等于10000</Option>
                            <Option value="4">大于10000</Option>
                        </Select>
                        <Button type="primary" @click="curPage7=1;getfindRechargeRecords">查询</Button>
                    </p>
                    <Table ref="test2" :columns="columns8" :data="data8" @on-sort-change="setChargeTokenSort"></Table>
                    <Page :current="curPage7" :total="total7" @on-change="changePage7"
                          style="text-align:center;margin-top:20px;"></Page>
                </Card>
            </Row>

        </Col>
    </Row>
</template>

<script>
    import financeApi from '../../api/finance';
    import currenyApi from '../../api/currency';

    export default {
        data () {
            return {
                curPage: 1,
                total: 0,
                curPage1: 1,
                total1: 0,
                curPage7: 1,
                total7: 0,
                symbolList: [],
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
                formData: {
                    username: '',
                    symbol: '',
                    symbol2: '',
                    amount: '',
                    beginTime: null,
                    endTime: null
                },
                ChargeTokenSortKey: null,
                withdrawSortKey: null,
                rechargeSortKey: null,
            };
        },
        created () {
            this.getMonitorList();
            this.getStatisticsList();
            this.getfindRechargeRecords();
            this.getdataSymbol();
        },
        methods: {
            getdataSymbol () {
                currenyApi.findAllValidSymbolList((res) => {
                    this.symbolList = res;
                });
            },
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
            getMonitorList () {
                let sortStr = this.rechargeSortKey ? `${this.rechargeSortKey}%20${this.rechargeSortVal}` : 'null';
                financeApi.findRechargeMonitorList(this.curPage, sortStr, (res, total) => {
                    this.total = total;
                    this.data1 = res;
                });
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
            changePage (page) {
                this.curPage = page;
                this.getMonitorList();
            },
            changePage7 (page) {
                this.curPage7 = page;
                this.getfindRechargeRecords();
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
