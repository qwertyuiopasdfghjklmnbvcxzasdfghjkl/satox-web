<!--  -->
<template>
    <Row>
        <Col span="24">
            <Row>
                <Card style="margin-top:10px;">
                    <p slot="title">
                        {{$t('exchange.yhdqwtgl')}}
                        <Button type="primary" @click="downloadNow()">{{$t('systemlog.dc')}}</Button>
                    </p>
                    <p style="margin-bottom: 20px" class="input_p">
                        <span>
                            {{$t('exchange.jysc')}}：
                            <Select v-model="formData.market" style="width: 110px">
                                <Option :value="0">{{$t('common.qb')}}</Option>
                                <Option v-for="item in marketList" :value="item.market" :key="item.market">{{ item.market }}</Option>
                            </Select>
                        </span>
                        <span>
                            {{$t('common.yhm')}}：
                            <Input v-model="formData.username" clearable style="width: 110px"
                                   :placeholder="$t('common.qsryhm')"></Input>
                        </span>
                        <span>
                            {{$t('exchange.wtfx')}}：
                            <Select v-model="formData.direction" style="width: 110px">
                                <Option :value="0">{{$t('common.qb')}}</Option>
                                <Option :value="1">{{$t('exchange.m1')}}</Option>
                                <Option :value="2">{{$t('exchange.m4')}}</Option>
                            </Select>
                        </span>
                        <span>
                            {{$t('exchange.wtlx')}}：
                            <Select v-model="formData.type" style="width: 110px">
                                <Option :value="0">{{$t('common.qb')}}</Option>
                                <Option :value="1">{{$t('exchange.xjwt')}}</Option>
                                <Option :value="2">{{$t('exchange.sjwt')}}</Option>
                            </Select>
                        </span>
                        <span>
                            {{$t('exchange.wtsj')}}：
                            <DatePicker type="datetime" v-model="formData.startTime" :placeholder="$t('common.kssj')"
                                        format="yyyy-MM-dd HH:mm:ss"
                                        style="width: 110px"></DatePicker>
                            <DatePicker type="datetime" v-model="formData.endTime" :placeholder="$t('common.jssj')"
                                        format="yyyy-MM-dd HH:mm:ss"
                                        style="width: 110px"></DatePicker>
                        </span>
                        <span>
                            {{$t('exchange.wtjg')}}：
                            <Select v-model="formData.prePrice" style="width:60px">
                                <Option :value="0">{{$t('common.qb')}}</Option>
                                <Option :value="1">{{$t('exchange.xy')}}</Option>
                                <Option :value="2">{{$t('exchange.dy')}}</Option>
                                <Option :value="3">{{$t('exchange.dengy')}}</Option>
                            </Select>
                            <InputNumber :min="0" v-model="formData.price" style="width: 80px"></InputNumber>
                        </span>
                        <span>
                            {{$t('exchange.zl')}}：
                            <Select v-model="formData.preTotalAmount" style="width: 60px">
                                <Option :value="0">{{$t('common.qb')}}</Option>
                                <Option :value="1">{{$t('exchange.xy')}}</Option>
                                <Option :value="2">{{$t('exchange.dy')}}</Option>
                                <Option :value="3">{{$t('exchange.dengy')}}</Option>
                            </Select>
                            <InputNumber :min="0" v-model="formData.totalAmount" style="width: 80px"></InputNumber>
                        </span>
                        <Button type="primary" @click="curPage=1;getAuditing()">{{$t('common.cx')}}</Button>
                    </p>
                    <Table :columns="columns" :data="datas"></Table>
                    <Page :current="curPage" :total="total" @on-change="changePage" :page-size="size"
                          style="text-align:center;margin-top:20px;"></Page>
                </Card>
            </Row>

            <Row>
                <Card style="margin-top:10px;">
                    <p slot="title">
                        {{$t('exchange.yhlswtgl')}}
                        <Button type="primary" @click="download()">{{$t('systemlog.dc')}}</Button>
                    </p>
                    <p style="margin-bottom: 20px" class="input_p">
                        <span>
                            {{$t('exchange.jysc')}}：
                            <Select v-model="formData1.market" style="width: 100px">
                                <Option :value="0">{{$t('common.qb')}}</Option>
                                <Option v-for="item in marketList" :value="item.market" :key="item.market">{{ item.market }}</Option>
                            </Select>
                        </span>
                        <span>
                            {{$t('common.yhm')}}：
                            <Input v-model="formData1.username" clearable style="width: 90px"
                                   :placeholder="$t('common.qsryhm')"></Input>
                        </span>
                        <span>
                            {{$t('exchange.wtfx')}}：
                            <Select v-model="formData1.direction" style="width: 60px">
                                <Option :value="0">{{$t('common.qb')}}</Option>
                                <Option :value="1">{{$t('exchange.m1')}}</Option>
                                <Option :value="2">{{$t('exchange.m4')}}</Option>
                            </Select>
                        </span>
                        <span>
                            {{$t('exchange.wtlx')}}：
                            <Select v-model="formData1.type" style="width: 80px">
                                <Option :value="0">{{$t('common.qb')}}</Option>
                                <Option :value="1">{{$t('exchange.xjwt')}}</Option>
                                <Option :value="2">{{$t('exchange.sjwt')}}</Option>
                            </Select>
                        </span>
                        <span>
                            {{$t('exchange.wtzt')}}：
                            <Select v-model="formData1.state" style="width: 80px">
                                <Option :value="3">{{$t('common.qb')}}</Option>
                                <Option :value="1">{{$t('exchange.qbcj')}}</Option>
                                <Option :value="2">{{$t('exchange.bfcj')}}</Option>
                                <Option :value="0">{{$t('finance.cx')}}</Option>
                                <Option :value="4">{{$t('exchange.bfcjyejsbqzcx')}}</Option>
                            </Select>
                        </span>
                        <span>
                            {{$t('exchange.wtsj')}}：
                            <DatePicker type="datetime" v-model="formData1.startTime" :placeholder="$t('common.kssj')"
                                        format="yyyy-MM-dd HH:mm:ss"
                                        style="width: 100px"></DatePicker>
                            <DatePicker type="datetime" v-model="formData1.endTime" :placeholder="$t('common.jssj')"
                                        format="yyyy-MM-dd HH:mm:ss"
                                        style="width: 100px"></DatePicker>
                        </span>
                        <span>
                            {{$t('exchange.wtjg')}}：
                            <Select v-model="formData1.prePrice" style="width:60px">
                                <Option :value="0">{{$t('common.qb')}}</Option>
                                <Option :value="1">{{$t('exchange.xy')}}</Option>
                                <Option :value="2">{{$t('exchange.dy')}}</Option>
                                <Option :value="3">{{$t('exchange.dengy')}}</Option>
                            </Select>
                            <InputNumber :min="0" v-model="formData1.price" style="width: 70px"></InputNumber>
                        </span>
                        <span>
                            {{$t('exchange.zl')}}：
                            <Select v-model="formData1.preTotalAmount" style="width: 60px">
                                <Option :value="0">{{$t('common.qb')}}</Option>
                                <Option :value="1">{{$t('exchange.xy')}}</Option>
                                <Option :value="2">{{$t('exchange.dy')}}</Option>
                                <Option :value="3">{{$t('exchange.dengy')}}</Option>
                            </Select>
                            <InputNumber :min="0" v-model="formData1.totalAmount" style="width: 70px"></InputNumber>
                        </span>
                        <Button type="primary" @click="curPage1=1;getHistoryEntrust()">{{$t('common.cx')}}</Button>
                    </p>
                    <Table :columns="columns1" :data="datas1"></Table>
                    <Page :current="curPage1" :total="total1" @on-change="changePage1" :page-size="size"
                          style="text-align:center;margin-top:20px;"></Page>
                </Card>
            </Row>
        </Col>
    </Row>
</template>

<script>
    import util from '../../libs/util';
    import currenyApi from '../../api/currency';

    export default {
        data () {
            return {
                curPage: 1,
                curPage1: 1,
                total: 0,
                total1: 0,
                size: 10,
                columns: [
                    {key: 'orderBookId', title: this.$t('exchange.wtid')},
                    {key: 'username', title: this.$t('common.yhm')},
                    {key: 'market', title: this.$t('risk.sc')},
                    {
                        key: 'type', title: this.$t('exchange.wtlx'),
                        render: (h, params) => {
                            return h('div', params.row.type === 1 ? this.$t('exchange.xjwt') : this.$t('exchange.sjwt'));
                        }
                    },
                    {
                        key: 'direction', title: this.$t('exchange.wtfx'),
                        render: (h, params) => {
                            return h('div', params.row.direction === 1 ? this.$t('exchange.m1') : this.$t('exchange.m4'));
                        }
                    },
                    {key: 'price', title: this.$t('exchange.wtjg')},
                    {key: 'finishedAmount', title: this.$t('exchange.cjl')},
                    {key: 'totalAmount', title: this.$t('exchange.zl')},
                    {key: 'dealCurrency', title: this.$t('common.je')},
                    {key: 'createdAt', title: this.$t('exchange.wtsj')},
                    // {key: 'action', title: this.$t('common.cz')},
                ],
                columns1: [
                    {key: 'orderBookId', title: this.$t('exchange.wtid')},
                    {key: 'username', title: this.$t('common.yhm')},
                    {key: 'market', title: this.$t('risk.sc')},
                    {
                        key: 'type', title: this.$t('exchange.wtlx'),
                        render: (h, params) => {
                            return h('div', params.row.type === 1 ? this.$t('exchange.xjwt') : this.$t('exchange.sjwt'));
                        }
                    },
                    {
                        key: 'direction', title: this.$t('exchange.wtfx'),
                        render: (h, params) => {
                            return h('div', params.row.direction === 1 ? this.$t('exchange.m1') : this.$t('exchange.m4'));
                        }
                    },
                    {key: 'price', title: this.$t('exchange.wtjg')},
                    {key: 'finishedAmount', title: this.$t('exchange.cjl')},
                    {key: 'totalAmount', title: this.$t('exchange.zl')},
                    {key: 'dealCurrency', title: this.$t('exchange.cjje')},
                    {key: 'createdAt', title: this.$t('exchange.wtsj')},
                    {key: 'updatedAt', title: this.$t('common.gxsj')},
                    {key: 'state', title: this.$t('common.zt'),
                        render: (h, params) => {
                            return h('div', this.switchStaus(params.row.state));
                        }
                    },
                ],
                datas: [],
                datas1: [],
                formData: {
                    direction: 0,
                    endTime: null,
                    market: 0,
                    page: null,
                    prePrice: 0,
                    preTotalAmount: 0,
                    price: null,
                    size: null,
                    startTime: null,
                    state: null,
                    totalAmount: null,
                    type: 0,
                    username: null,
                },
                formData1: {
                    direction: 0,
                    endTime: null,
                    market: 0,
                    page: null,
                    prePrice: 0,
                    preTotalAmount: 0,
                    price: null,
                    size: null,
                    startTime: null,
                    state: 3,
                    totalAmount: null,
                    type: 0,
                    username: null,
                },
                marketList: [],
                exportDocPrames:{},
                exportNowDocPrames:{}
            };
        },
        created () {
            this.getAuditing();
            this.getAllMarket();
            this.getHistoryEntrust();
        },
        methods: {
            getAllMarket () {
                currenyApi.findAllMarketList((res) => {
                    this.marketList = res;
                });
            },
            switchStaus (state) {// 全部成交、部分成交、撤销、部分成交余额较少被强制撤销
                switch (state) {
                    case 0:
                        return this.$t('finance.cx');
                    case 1:
                        return this.$t('exchange.qbcj');
                    case 2:
                        return this.$t('exchange.bfcj');
                    case 3:
                        return this.$t('common.wc');
                    case 4:
                        return this.$t('exchange.bfcjyejsbqzcx');
                }
            },
            getAuditing () {
                let D = JSON.stringify(this.formData);
                let data = JSON.parse(D);
                data.startTime = data.startTime ? util.dateToStr(new Date(data.startTime)) : null;
                data.endTime = data.endTime ? util.dateToStr(new Date(data.endTime)) : null;
                data.market = data.market === 0 ? null : data.market;
                data.direction = data.direction === 0 ? null : data.direction;
                data.prePrice = data.prePrice === 0 ? null : data.prePrice;
                data.preTotalAmount = data.preTotalAmount === 0 ? null : data.preTotalAmount;
                data.type = data.type === 0 ? null : data.type;
                data.page = this.curPage;
                data.size = this.size;
                this.exportNowDocPrames = data
                currenyApi.getEntrust(data,
                    (res, total) => {
                        this.total = total;
                        this.datas = res;
                    });
            },
            getHistoryEntrust () {
                let D = JSON.stringify(this.formData1);
                let data = JSON.parse(D);
                data.startTime = data.startTime ? util.dateToStr(new Date(data.startTime)) : null;
                data.endTime = data.endTime ? util.dateToStr(new Date(data.endTime)) : null;
                data.market = data.market === 0 ? null : data.market;
                data.direction = data.direction === 0 ? null : data.direction;
                data.prePrice = data.prePrice === 0 ? null : data.prePrice;
                data.preTotalAmount = data.preTotalAmount === 0 ? null : data.preTotalAmount;
                data.type = data.type === 0 ? null : data.type;
                data.state = data.state === 3 ? null : data.state;
                data.page = this.curPage1;
                data.size = this.size;
                this.exportDocPrames = data
                currenyApi.getHistoryEntrust(data,
                    (res, total) => {
                        this.total1 = total;
                        this.datas1 = res;
                    });
            },
            changePage (page) {
                this.curPage = page;
                this.getAuditing();
            },
            changePage1 (page) {
                this.curPage1 = page;
                this.getHistoryEntrust();
            },
            downloadNow(){
                let data = ['export=1']
                for (let i in this.exportNowDocPrames) {
                    if(this.exportNowDocPrames[i]){
                        let v = this.exportNowDocPrames[i] ? this.exportNowDocPrames[i] : ''
                        data.push(i+'='+v)
                    }
                }
                window.location.href = `${util.baseURL}api/bm/bbManage/orderBooks/query?${data.join('&')}`
            },
            download(){
                let data = ['export=1']
                for (let i in this.exportDocPrames) {
                    if(this.exportDocPrames[i]){
                        let v = this.exportDocPrames[i] ? this.exportDocPrames[i] : ''
                        data.push(i+'='+v)
                    }
                }
                window.location.href = `${util.baseURL}api/bm/bbManage/orderBooks/queryHistory?${data.join('&')}`
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

    .ivu-card-head-inner, .ivu-card-head p {
        display: flex !important;
        justify-content: space-between !important;
        height: 40px !important;
        line-height: 40px !important;
    }

    .input_p {
        span {
            display: inline-block;
            margin: 10px 10px 0 0;
        }
    }
</style>
