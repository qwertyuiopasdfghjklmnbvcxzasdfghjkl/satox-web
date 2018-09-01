<template>
    <div>
        <Row>
           <Card style="font-size:16px;">
                <Row class="margin-top-8">
                    <p class="notwrap">
                        <strong>
                            <span>当前在线人数：{{baseInfo.onlineNum}}</span>
                            <span class="padding-left-20">总注册人数：{{baseInfo.totalUsers}}</span>
                            <span class="padding-left-20">今日新增注册人数：{{baseInfo.newUsers}}</span>
                        </strong>
                    </p>
                </Row>
                <Row class="margin-top-8">
                    <strong>
                        <p class="notwrap">
                            <span>今日交易总量：{{totalBTC}}BTC</span>
                            <span class="padding-left-20">{{totalCNY}}CNY</span>
                        </p>
                    </strong>
                </Row>
                <Row class="margin-top-8">
                    <strong><p class="notwrap">待处理申述：{{baseInfo.pendingAppeals}}</p></strong>
                </Row>
            </Card>
        </Row>
        <Row :height="500">
            <Col span="12">
                <Row class="margin-top-10">
                    <Card style="height:700px;">
                        <p slot="title" class="card-title">
                            <Icon type="android-map"></Icon>
                            历史交易量
                        </p>
                        <Select size="small" slot="extra" v-model="params.type" style="width:120px;margin-right:10px;">
                            <Option :value="1">OTC市场</Option>
                        </Select>
                        <Select size="small" slot="extra" v-model="params.symbol" style="width:120px;margin-right:10px;">
                            <Option v-for="item in symbols" :key="item.id" :value="item.symbol">{{item.symbol}}</Option>
                        </Select>
                        <Select size="small" slot="extra" v-model="params.time_type" style="width:120px;">
                            <Option :value="0">年</Option>
                            <Option :value="1">月</Option>
                            <Option :value="2">日</Option>
                        </Select>
                        <div class="data-source-row">
                            <div style="width:100%;height:615px;" ref="canvas"></div>
                        </div>
                    </Card>
                </Row>
            </Col>
            <Col span="12">
                <Row class="margin-top-10 padding-left-10">
                    <Card style="height:700px;">
                        <div class="map-con">
                            <Table :columns="columns" height="650" :data="datas"></Table>
                        </div>
                    </Card>
                </Row>
            </Col>
        </Row>
    </div>
</template>

<script>
import echarts from 'echarts';
import util from '@/libs/util';
import qs from 'qs';
export default {
    data () {
        return {
            totalBTC: null,
            totalCNY: null,
            baseInfo: {},
            params: {
                symbol: 'ETH',
                type: 1,
                time_type: 0
            },
            columns: [
                {title: '币种', key: 'symbol'},
                {title: '今日成交量', key: 'today'},
                {title: '今日涨幅', key: 'increase', render: (h, params) => {
                    return h('div', [params.row.increase + '%']);
                }},
                {title: '成交总量', key: 'total'}
            ],
            datas: [],
            otcSymbols: []
        }
    },
    computed: {
        symbols () {
            if (this.params.type === 1) {
                return this.otcSymbols;
            } else {
                return [];
            }
        },
        paramsChange () {
            return {
                symbol: this.params.symbol,
                type: this.params.type,
                time_type: this.params.time_type
            }
        }
    },
    watch: {
        paramsChange () {
            this.getTradeInfo();
        }
    },
    created () {
        this.getBaseInfo();

        this.getOtcSymbols();

        this.getSymbolInfo();

        this.$nextTick(() => {
            this.getTradeInfo();
        });
    },
    methods: {
        getBaseInfo () { // 获取大数据统计基本信息
            util.ajax.get(`api/v1/manage/otc/statis/baseInfo`).then((res) => {
                let data = res.data;
                if (data.rst === 1) {
                    this.baseInfo = data;
                } else {
                    let msgs = data.msg;
                    this.$Message.error(typeof msgs === 'string' ? msgs : msgs[0]);
                }
            }).catch((error) => {
                this.$Message.error('其他错误');
                window.console.log(error);
            })
        },
        getOtcSymbols () { // 获取OTC市场币种
            util.ajax.get(`api/v1/manage/otc/symbols`).then((res) => {
                let data = res.data;
                if (data.rst === 1) {
                    this.otcSymbols = data.data;
                } else {
                    let msgs = data.msg;
                    this.$Message.error(typeof msgs === 'string' ? msgs : msgs[0]);
                }
            })
        },
        getTradeInfo () { // 获取大数据统计交易信息
            util.ajax.post(`api/v1/manage/otc/statis/tradeInfo`, qs.stringify(this.params)).then((res) => {
                let data = res.data;
                if (data.rst === 1) {
                    this.canvasTradeInfo(data);
                } else {
                    let msgs = data.msg;
                    this.$Message.error(typeof msgs === 'string' ? msgs : msgs[0]);
                }
            }).catch((error) => {
                this.$Message.error('其他错误');
                window.console.log(error);
            })
        },
        canvasTradeInfo (data) {
            let visiteVolume = echarts.init(this.$refs.canvas);
            let data1 = [];
            let data2 = [];
            for (let i in data.data) {
                data1.push(i);
                data2.push(data.data[i]);
            }

            const option = {
                color: ['#3398DB'],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : data1,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'历史成交量',
                        type:'bar',
                        barWidth: '50%',
                        data: data2
                    }
                ]
            };

            visiteVolume.setOption(option);

            window.addEventListener('resize', function () {
                visiteVolume.resize();
            });
        },
        getSymbolInfo () { // 获取大数据统计币种信息
            util.ajax.get(`api/v1/manage/otc/statis/symbolInfo`).then((res) => {
                let data = res.data;
                if (data.rst === 1) {
                    this.totalBTC = data.btc;
                    this.totalCNY = data.cny;
                    this.datas = data.data;
                } else {
                    let msgs = data.msg;
                    this.$Message.error(typeof msgs === 'string' ? msgs : msgs[0]);
                }
            }).catch((error) => {
                this.$Message.error('其他错误');
                window.console.log(error);
            });
        }
    }
}
</script>

<style>

</style>
