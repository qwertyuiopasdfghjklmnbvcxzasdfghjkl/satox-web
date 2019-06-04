<!-- 交易查询 -->
<template>
    <Row>
        <Col span="24">
            <Row>
                <Card style="margin-top:10px;">
                    <p slot="title">{{$t('nav.jycx')}}</p>
                    <p style="margin-bottom: 20px" class="input_p">
                        <span>
                            {{$t('exchange.jysc')}}：
                            <Select v-model="formData.market" style="width: 140px">
                                <Option :value="0">{{$t('common.qb')}}</Option>
                                <Option v-for="item in marketList" :value="item.market" :key="item.market">{{ item.market }}</Option>
                            </Select>
                        </span>
                        <span>
                            {{$t('common.yhm')}}：
                            <Input v-model="formData.userName" clearable style="width: 140px"
                                   :placeholder="$t('common.qsryhm')"></Input>
                        </span>
                        <span>
                            {{$t('exchange.cjsj')}}：
                            <DatePicker type="datetime" v-model="formData.startTime" :placeholder="$t('common.kssj')"
                                        format="yyyy-MM-dd HH:mm:ss"
                                        style="width: 160px"></DatePicker>
                            <DatePicker type="datetime" v-model="formData.endTime" :placeholder="$t('common.jssj')"
                                        format="yyyy-MM-dd HH:mm:ss"
                                        style="width: 160px"></DatePicker>
                        </span>
                        <span>
                            {{$t('exchange.cjjg')}}：
                            <Select v-model="formData.prePrice" style="width:60px">
                                <Option :value="0">{{$t('common.qb')}}</Option>
                                <Option :value="1">{{$t('exchange.xy')}}</Option>
                                <Option :value="2">{{$t('exchange.dy')}}</Option>
                                <Option :value="3">{{$t('exchange.dengy')}}</Option>
                            </Select>
                            <InputNumber :min="0" v-model="formData.price" style="width: 100px"></InputNumber>
                        </span>
                        <span>
                            {{$t('exchange.cjl')}}：
                            <Select v-model="formData.preTotalAmount" style="width: 60px">
                                <Option :value="0">{{$t('common.qb')}}</Option>
                                <Option :value="1">{{$t('exchange.xy')}}</Option>
                                <Option :value="2">{{$t('exchange.dy')}}</Option>
                                <Option :value="3">{{$t('exchange.dengy')}}</Option>
                            </Select>
                            <InputNumber :min="0" v-model="formData.totalAmount" style="width: 100px"></InputNumber>
                        </span>
                        <Button type="primary" @click="curPage=1;getAuditing()">{{$t('common.cx')}}</Button>
                    </p>
                    <Table :columns="columns" :data="datas"></Table>
                    <Page :current="curPage" :total="total" @on-change="changePage" :page-size="size"
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
                total: 0,
                size: 10,
                columns: [
                    {key: 'orderBookId', title: this.$t('common.jyid')},
                    {key: 'username', title: this.$t('exchange.mfyhm')},
                    {key: 'market', title: this.$t('exchange.m4fyhm')},
                    {key: 'market', title: this.$t('exchange.jysc')},
                    {key: 'price', title: this.$t('exchange.cjjg')},
                    {key: 'finishedAmount', title: this.$t('exchange.cjl')},
                    {key: 'totalAmount', title: this.$t('exchange.cjje')},
                    {key: 'totalAmount', title: this.$t('exchange.mfsxfsq')},
                    {key: 'totalAmount', title: this.$t('exchange.m4fsxfsq')},
                    {key: 'createdAt', title: this.$t('exchange.cjsj')},
                ],
                datas: [],
                formData: {
                    endTime: null,
                    market: 0,
                    prePrice: 0,
                    preTotalAmount: 0,
                    price: null,
                    startTime: null,
                    state: null,
                    totalAmount: null,
                    username: null,
                },
                marketList: []
            };
        },
        created () {
            this.getAuditing();
            this.getAllMarket();
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
                data.prePrice = data.prePrice === 0 ? null : data.prePrice;
                data.preTotalAmount = data.preTotalAmount === 0 ? null : data.preTotalAmount;
                data.page = this.curPage;
                data.size = this.size;
                currenyApi.getTransaction(data,
                    (res, total) => {
                        this.total = total;
                        this.datas = res;
                    });
            },
            changePage (page) {
                this.curPage = page;
                this.getAuditing();
            },
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
