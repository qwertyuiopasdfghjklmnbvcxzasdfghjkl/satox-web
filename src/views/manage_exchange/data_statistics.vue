<!-- 数据统计 -->
<template>
    <Row>
        <Card>
            <p slot="title">{{$t('exchange.sjtj')}}</p>
            <Row>
                <Col span="9">
                    <p>
                        {{$t('exchange.rqzjyl')}}：
                        <span style="margin-right:15px;">{{datas.length ? datas[0].btcTransactionAmount : 0}}BTC</span>
                        <span style="margin-right:15px;">{{datas.length ? datas[0].ethTransactionAmount : 0}}ETH</span>
                        <!--<span style="margin-right:15px;">{{datas.length ? datas[0].atnTransactionAmount : 0}}ATN</span>-->
                        <span style="margin-right:15px;">{{datas.length ? datas[0].usdtTransactionAmount : 0}}USDT</span>
                        <span style="margin-right:15px;">{{$t('exchange.hj')}}：{{datas.length ? datas[0].btcPriceOfNewton : 0}}BTC
                            = {{datas.length ? datas[0].usdPriceOfNewton : 0}}USD</span>
                    </p>
                </Col>
                <Col span="7">
                    <p>
                        {{$t('exchange.dqzxyh')}}：{{datas.length ? datas[0].onlineUserAmount : 0}}{{$t('kyc.g')}}
                    </p>
                </Col>
                <Col span="8">
                    <p>
                        {{$t('exchange.zyhs')}}：{{datas.length ? datas[0].allUserAmount : 0}}{{$t('kyc.g')}}
                    </p>
                </Col>
            </Row>
        </Card>
        <Card style="margin:10px 0;">
            <p slot="title">{{$t('exchange.scjyqk')}}</p>
            <Table :columns="columns1" :data="data1" @on-sort-change="setMarketSort"></Table>
            <Page :current="curPage1" :total="total1" :page-size="pageSize" @on-change="changePage1"
                  style="text-align:center;margin-top:20px;"></Page>
        </Card>
        <Card>
            <p slot="title">{{$t('exchange.yhqk')}}</p>
            <Table :columns="columns2" :data="data2"></Table>
        </Card>
        <!--<Card style="margin:10px 0;">-->
        <!--<p slot="title">财务情况</p>-->
        <!--<Table :columns="columns3" :data="data3" @on-sort-change="setFinanceSort"></Table>-->
        <!--<Page :current="curPage" :total="total" :page-size="pageSize1" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>-->
        <!--</Card>-->
        <!-- <Card>
          <p slot="title">风控情况</p>
          <Table :columns="columns4" :data="data4"></Table>
        </Card> -->
        <Card style="margin-top:10px;">
            <p slot="title">{{$t('exchange.tbzs')}}</p>
            <Form ref="formItem" :model="formItem" :label-width="80" inline>
                <FormItem prop="user" :label="$t('common.bz')">
                    <Select v-model="formItem.symbol" style="width:100px">
                        <Option v-for="item in symbolList" :value="item.symbol" :key="item.symbol">{{ item.symbol }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem prop="password" :label="$t('exchange.xm')">
                    <Select v-model="formItem.project" style="width:150px">
                        <Option value="1">{{$t('exchange.zxyhsl')}}</Option>
                        <Option value="2">{{$t('exchange.qzjyl')}}</Option>
                        <Option value="3">{{$t('exchange.xzcyhs')}}</Option>
                        <Option value="4">{{$t('exchange.zyhs')}}</Option>
                        <Option value="5">{{$t('exchange.jyyhs')}}</Option>
                        <Option value="6">{{$t('exchange.dlyh')}}</Option>
                        <Option value="7">{{$t('exchange.ycyjs')}}</Option>
                        <Option value="8">{{$t('exchange.txsl')}}</Option>
                        <Option value="9">{{$t('exchange.czsl')}}</Option>
                        <Option value="10">{{$t('exchange.dshtxbs')}}</Option>
                        <Option value="11">{{$t('exchange.dshtxsl')}}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="password" :label="$t('exchange.sjd')">
                    <DatePicker v-model="formItem.date" format="yyyy-MM-dd" type="daterange" placement="bottom-end"
                                style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem prop="password" :label="$t('exchange.sjbc')">
                    <Select v-model="formItem.du" style="width:150px">
                        <Option value="1">{{$t('exchange.yxs')}}</Option>
                        <Option value="12">{{$t('exchange.srsx')}}</Option>
                        <Option value="24">{{$t('exchange.esxs')}}</Option>
                        <Option value="168">{{$t('exchange.qt')}}</Option>
                        <Option value="360">{{$t('exchange.swt')}}</Option>
                        <Option value="720">{{$t('exchange.yy')}}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="search()">{{$t('common.cx')}}</Button>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="exportBBExcel()">{{$t('exchange.scbb')}}</Button>
                </FormItem>
            </Form>
            <div ref="canvas" class="manage_exchange_canvas"></div>
        </Card>
    </Row>
</template>

<script>
    import echarts from 'echarts';
    import currenyApi from '../../api/currency';
    import util from '../../libs/util';

    export default {
        data () {
            return {
                curPage: 1,
                total: 0,
                curPage1: 1,
                total1: 0,
                pageSize: 3,
                pageSize1: 3,
                symbolList: [],
                columns1: [
                    {title: this.$t('exchange.sc'), key: 'market'},
                    {title: this.$t('exchange.zxjg'), key: 'currentPrice'},
                    {title: this.$t('exchange.rdz'), key: 'highLowDaily', sortable: 'custom'},
                    {title: this.$t('exchange.rjyl'), key: 'exchangeQuantityDaily', sortable: 'custom'},
                    {title: this.$t('exchange.rjybs'), key: 'exchangeAmountDaily', sortable: 'custom'},
                    {title: this.$t('exchange.ryhl'), key: 'userCountDaily', sortable: 'custom'},
                    {title: this.$t('exchange.rjybl'), key: 'ratioExchangeDaily', sortable: 'custom'}
                ],
                data1: [],
                columns2: [
                    {title: this.$t('exchange.rxzcyh'), key: 'registerAmountDaily'},
                    {title: this.$t('exchange.rdlyh'), key: 'loginAmountDaily'},
                    {title: this.$t('exchange.rjyyh'), key: 'rechargeAmountDaily'},
                    {title: this.$t('exchange.dqzxyh'), key: 'onlineAmountDaily'}
                ],
                data2: [],
                formItem: {
                    symbol: 'BTC',
                    project: '1',
                    date: [],
                    du: '1'
                },
                datas: [],
                data8: []
            };
        },
        computed: {
            params () {
                let data = {
                    symbol: this.formItem.symbol,
                    item: this.formItem.project,
                    step: this.formItem.du
                };
                if (this.formItem.date[0]) {
                    data.beginDate = util.dateToStr(this.formItem.date[0]);
                } else {
                    data.beginDate = util.dateToStr(new Date(), 'yyyy-MM-dd 00:00:00');
                }
                if (this.formItem.date[1]) {
                    data.endDate = util.dateToStr(this.formItem.date[1]);
                } else {
                    data.endDate = util.dateToStr(new Date(), 'yyyy-MM-dd 00:00:00');
                }
                return data;
            }
        },
        created () {
            this.getDataList();
            this.getfindRiskDataList();
            this.getfindMarketExchangeList();
            this.getfindUserDataList();
            this.getfindStatisticData();
            this.$nextTick(() => {
                this.search();
            });
            this.getdataSymbol();
        },
        methods: {
            getdataSymbol () {
                currenyApi.findAllValidSymbolList((res) => {
                    this.symbolList = res;
                });
            },
            setMarketSort (column) {
                this.curPage1 = 1;
                if (column.order !== 'normal') {
                    this.marketSortKey = column.key;
                    this.marketSortVal = column.order;
                } else {
                    this.marketSortKey = null;
                }
                this.getfindMarketExchangeList();
            },
            setFinanceSort (column) {
                this.curPage = 1;
                if (column.order !== 'normal') {
                    this.financeSortKey = column.key;
                    this.financeSortVal = column.order;
                } else {
                    this.financeSortKey = null;
                }
                this.getDataList();
            },
            exportBBExcel () {
                let paramStr = [];
                for (var i in this.params) {
                    paramStr.push(`${i}=${this.params[i]}`);
                }
                window.location.href = `${util.baseURL}` + `api/bm/bbManage/DataStatistic/exportBBExcel?${paramStr.join('&')}`;
            },
            search () {
                currenyApi.getfindChartDataList(this.params, (res) => {
                    let data1 = [];
                    let data2 = [];
                    res.forEach((item) => {
                        data1.push(item.createdAt);
                        if (this.formItem.project === '1') {
                            data2.push(item.onlineUserAmount);
                        } else if (this.formItem.project === '2') {
                            data2.push(item.dailyTransactionAmount);
                        } else if (this.formItem.project === '3') {
                            data2.push(item.newRegisterUserAmount);
                        } else if (this.formItem.project === '4') {
                            data2.push(item.allUserAmount);
                        } else if (this.formItem.project === '5') {
                            data2.push(item.transactionUserAmount);
                        } else if (this.formItem.project === '6') {
                            data2.push(item.loginUserAmount);
                        } else if (this.formItem.project === '7') {
                            data2.push(item.abnormalWarningAmount);
                        } else if (this.formItem.project === '8') {
                            data2.push(item.withdrawAmount);
                        } else if (this.formItem.project === '9') {
                            data2.push(item.rechargeAmount);
                        } else if (this.formItem.project === '10') {
                            data2.push(item.waitCheckWithdrawCount);
                        } else if (this.formItem.project === '11') {
                            data2.push(item.waitCheckWithdrawAmount);
                        }
                    });
                    this.initCanvas(data1, data2);
                });
            },

            initCanvas (data1, data2) {
                let option = {
                    color: ['#3398DB'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: data1 || [],
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '直接访问',
                            type: 'bar',
                            barWidth: '60%',
                            data: data2 || []
                        }
                    ]
                };
                var myChart = echarts.init(this.$refs.canvas);
                myChart.setOption(option);
            },
            getDataList () {
                let sortStr = this.financeSortKey ? `${this.financeSortKey}%20${this.financeSortVal}` : 'null';
                currenyApi.findFinancialDataList(this.pageSize1, this.curPage, sortStr, {}, (res, total) => {
                    this.total = total;
                    this.data3 = res;
                });
            },
            changePage (page) {
                this.curPage = page;
                this.getDataList();
            },
            getfindRiskDataList () {
                currenyApi.findRiskDataList((res) => {
                    this.data4 = [res];
                });
            },
            getfindUserDataList () {
                currenyApi.findUserDataList((res) => {
                    this.data2 = [res];
                });
            },
            getfindMarketExchangeList () {
                let sortStr = this.marketSortKey ? `${this.marketSortKey}%20${this.marketSortVal}` : 'null';
                currenyApi.findMarketExchangeList(this.curPage1, sortStr, (res, total) => {
                    this.total1 = total;
                    this.data1 = res;
                });
            },
            changePage1 (page) {
                this.curPage1 = page;
                this.getfindMarketExchangeList();
            },
            getfindStatisticData () {
                currenyApi.findStatisticData((res) => {
                    this.datas = [res];
                });
            }
        }
    };
</script>

<style lang="less" scoped>
    .manage_exchange_canvas {
        display: flex;
        margin: 20px;
        height: 400px;
    }
</style>
