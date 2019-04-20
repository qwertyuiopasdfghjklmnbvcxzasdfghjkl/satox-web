<!-- 充值管理 -->
<template>
    <Row>
        <Col span="24">
            <Row style="margin:10px 0;">
                <Card>
                    <p slot="title">{{$t('finance.glczjk')}}
                        <!--<span class="refresh" @click="reshAll"></span>-->
                    </p>
                    <Table :columns="columns1" :data="data1" @on-sort-change="setRechargeSort"></Table>
                    <Page :current="curPage" :total="total" @on-change="changePage"
                          style="text-align:center;margin-top:20px;"></Page>
                </Card>
            </Row>
            <Row>
                <Card>
                    <p slot="title">{{$t('finance.bzczjk')}}</p>
                    <p style="margin-bottom: 20px">
                        {{$t('common.bz')}}：
                        <Select v-model="formData.symbol2" style="width: 200px">
                            <Option value="0">{{$t('common.qb')}}</Option>
                            <Option v-for="item in symbolList" :value="item.symbol" :key="item.symbol">{{ item.symbol }}
                            </Option>
                        </Select>
                        <Button type="primary" @click="curPage1=1;getStatisticsList()">{{$t('common.cx')}}</Button>
                    </p>
                    <Table :columns="columns2" :data="data2" @on-sort-change="setWithdrawSort"></Table>
                    <Page :current="curPage1" :total="total1" @on-change="changePage1" :page-size="size"
                          style="text-align:center;margin-top:20px;"></Page>
                </Card>
            </Row>

            <Row style="margin-top:10px;">
                <Card>
                    <p slot="title">{{$t('finance.cblb')}}</p>
                    <p style="margin-bottom: 20px">
                        {{$t('common.bz')}}：
                        <Select v-model="formData.symbol" style="width: 200px" :placeholder="'请选择币种'">
                            <Option value="0">{{$t('common.qb')}}</Option>
                            <Option v-for="item in symbolList" :value="item.symbol" :key="item.symbol">{{ item.symbol }}
                            </Option>
                        </Select>
                        {{$t('common.cjsj')}}：
                        <DatePicker type="datetime" v-model="formData.createdStart" :placeholder="$t('common.kssj')" format="yyyy-MM-dd HH:mm:ss"
                                    style="width: 200px"></DatePicker>
                        <DatePicker type="datetime" v-model="formData.createdEnd" :placeholder="$t('common.jssj')" format="yyyy-MM-dd HH:mm:ss"
                                    style="width: 200px"></DatePicker>
                        {{$t('common.yhm')}}：
                        <Input v-model="formData.username" clearable style="width: 200px"></Input>
                        {{$t('common.sl')}}：
                        <Select v-model="formData.amount" style="width: 200px" >
                            <Option value="0">{{$t('common.qb')}}</Option>
                            <Option value="1">{{$t('common.xy1')}}</Option>
                            <Option value="2">{{$t('common.dy1xy1000')}}</Option>
                            <Option value="3">{{$t('common.dy1000xy10000')}}</Option>
                            <Option value="4">{{$t('common.dy10000')}}</Option>
                        </Select>
                        <Button type="primary" @click="curPage7=1;getfindRechargeRecords()">{{$t('common.cx')}}</Button>
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
    import util from '../../libs/util';

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
                    {title: this.$t('finance.glbz'), key: 'symbol'},
                    {title: this.$t('finance.jkdzsl'), key: 'currentMonitorAddrCount'},
                    {title: this.$t('finance.rczdqrbs'), key: 'dailyRechargeWaitComfirmCount', sortable: 'custom'},
                    // {title: '日充值待确认总量', key: 'dailyRechargeWaitComfirmAmount'},
                    {title: this.$t('finance.rczwcbs'), key: 'dailyRechargeFinishCount', sortable: 'custom'},
                    // {title: '日充值完成总量', key: 'dailyRechargeWaitComfirmAmount'}
                ],
                data1: [],
                columns2: [
                    {title: this.$t('common.bz'), key: 'symbol'},
                    {title: this.$t('finance.jrczyhs'), key: 'currentRechargeUserCount'},
                    {title: this.$t('finance.jrczbs'), key: 'currentRechargeCount'},
                    {title: this.$t('finance.jryczsl'), key: 'currentRechargeSum'},
                    {title: this.$t('finance.qrnczyhs'), key: 'rechargeUserCount7d'},
                    {title: this.$t('finance.qrnczbs'), key: 'rechargeCount7d'},
                    {title: this.$t('finance.qrnyczsl'), key: 'rechargeSum7d'},
                ],
                data2: [],
                columns8: [
                    {title: this.$t('common.cjsj'), key: 'createdTime', sortable: 'custom'},
                    {title: this.$t('common.yhm'), key: 'userName'},
                    {title: this.$t('common.bz'), key: 'symbol', sortable: 'custom'},
                    {title: this.$t('finance.czsl'), key: 'amount', sortable: 'custom'},
                    {
                        title: this.$t('common.zt'), key: 'status',
                        render: (h, params) => {
                            return h('div', params.row.status === 1 ? this.$t('common.dd') : this.$t('common.wc'));
                        },
                        sortable: 'custom'
                    },
                    {title: this.$t('finance.qrks'), key: 'confirmation'}
                ],
                data8: [],
                formData: {
                    username: '',
                    symbol: '0',
                    symbol2: '0',
                    amount: '0',
                    createdStart: null,
                    createdEnd: null,
                    min: null,
                    max: null
                },
                ChargeTokenSortKey: null,
                withdrawSortKey: null,
                rechargeSortKey: null,
                size: 10
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
                this.switch(this.formData.amount);
                let D = JSON.stringify(this.formData);
                let data = JSON.parse(D);
                data.createdStart = data.createdStart ? util.dateToStr(new Date(data.createdStart)) : null;
                data.createdEnd = data.createdEnd ? util.dateToStr(new Date(data.createdEnd)) : null;
                data.symbol = data.symbol === '0' ? null : data.symbol;
                financeApi.findRechargeRecords(this.curPage7, sortStr, data, (res, total) => {
                    this.total7 = total;
                    this.data8 = res;
                });
            },
            switch (i) {
                switch (i) {
                    case '1':
                        this.formData.min = null;
                        this.formData.max = 1;
                        break;
                    case '2':
                        this.formData.max = 1000;
                        this.formData.min = 1;
                        break;
                    case '3':
                        this.formData.max = 10000;
                        this.formData.min = 1000;
                        break;
                    case '4':
                        this.formData.min = 10000;
                        this.formData.max = null;
                        break;
                    case '0':
                        this.formData.max = null;
                        this.formData.min = null;
                        break;
                    default:
                        this.formData.max = null;
                        this.formData.min = null;
                }
            },
            getMonitorList () {
                let sortStr = this.rechargeSortKey ? `${this.rechargeSortKey}%20${this.rechargeSortVal}` : 'null';
                financeApi.findRechargeMonitorList(this.curPage, sortStr, (res, total) => {
                    this.total = total;
                    this.data1 = res;
                });
            },
            getStatisticsList () {
                let Data = JSON.stringify(this.formData.symbol2);
                let data = {
                    page: this.curPage1,
                    size: this.size,
                    symbol: JSON.parse(Data)
                };
                data.symbol = data.symbol === '0' ? null : data.symbol;
                financeApi.findSymbolRechargeList(data, (res, total) => {
                    this.total1 = total;
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
